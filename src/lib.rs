use anyhow::{anyhow, bail, Context, Result};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, BTreeSet};
use std::ffi::OsString;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::time::{Instant, SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Declaration {
    pub schema: u8,
    pub product: String,
    pub adapter: Adapter,
    pub source: Release,
    pub target: Release,
    pub environment: Environment,
    pub resources: Resources,
    pub hooks: Hooks,
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum Adapter {
    Compose,
    Kubernetes,
    #[serde(rename = "fixture")]
    Fixture,
}

impl Adapter {
    fn label(&self) -> &'static str {
        match self {
            Self::Compose => "Docker Compose",
            Self::Kubernetes => "Kubernetes",
            Self::Fixture => "bundled fixture",
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Release {
    pub version: String,
    pub config_schema: PathBuf,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Environment {
    pub operating_systems: Vec<String>,
    pub architectures: Vec<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Resources {
    pub memory_mb: u64,
    pub disk_mb: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Hooks {
    pub preflight: Vec<String>,
    pub start_source: Vec<String>,
    pub seed: Vec<String>,
    pub backup: Vec<String>,
    pub stop_source: Vec<String>,
    pub start_target: Vec<String>,
    pub restore: Vec<String>,
    pub health: Vec<String>,
    pub cleanup: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Receipt {
    pub receipt_schema: u8,
    pub run_id: String,
    pub product: String,
    pub source_version: String,
    pub target_version: String,
    pub adapter: String,
    pub status: String,
    pub tested_environment: TestedEnvironment,
    pub supported_environments: Environment,
    pub required_resources: Resources,
    pub config_changes: Vec<ConfigChange>,
    pub checks: Vec<Check>,
    pub customer_safe: bool,
    pub limitations: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestedEnvironment {
    pub operating_system: String,
    pub architecture: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConfigChange {
    pub path: String,
    pub change: String,
    pub source_type: Option<String>,
    pub target_type: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Check {
    pub name: String,
    pub status: String,
    pub duration_ms: u128,
}

#[derive(Debug, Clone)]
pub struct RunOutput {
    pub receipt: Receipt,
    pub json_path: PathBuf,
    pub html_path: PathBuf,
}

pub fn read_declaration(path: &Path) -> Result<Declaration> {
    let raw =
        fs::read_to_string(path).with_context(|| format!("could not read {}", path.display()))?;
    let declaration: Declaration = serde_yaml::from_str(&raw)
        .with_context(|| format!("{} is not a valid rehearsal declaration", path.display()))?;
    validate(
        &declaration,
        path.parent().unwrap_or_else(|| Path::new(".")),
    )?;
    Ok(declaration)
}

pub fn validate(declaration: &Declaration, base: &Path) -> Result<()> {
    if declaration.schema != 1 {
        bail!("schema must be 1; update the declaration before running it");
    }
    if declaration.product.trim().is_empty() {
        bail!("product is empty; name the product being rehearsed");
    }
    if declaration.source.version.trim().is_empty() || declaration.target.version.trim().is_empty()
    {
        bail!("source and target versions are required");
    }
    if declaration.source.version == declaration.target.version {
        bail!("source and target versions match; choose an actual upgrade path");
    }
    if declaration.resources.memory_mb == 0 || declaration.resources.disk_mb == 0 {
        bail!("resource minimums must be greater than zero");
    }
    if declaration.environment.operating_systems.is_empty()
        || declaration.environment.architectures.is_empty()
    {
        bail!("supported operating systems and architectures cannot be empty");
    }
    for schema in [
        &declaration.source.config_schema,
        &declaration.target.config_schema,
    ] {
        if !base.join(schema).is_file() {
            bail!(
                "config schema {} was not found",
                base.join(schema).display()
            );
        }
    }
    for (name, command) in declaration.hooks.named() {
        if command.is_empty() || command[0].trim().is_empty() {
            bail!("{name} hook is empty; provide an executable and its arguments");
        }
    }
    Ok(())
}

impl Hooks {
    fn named(&self) -> [(&'static str, &Vec<String>); 9] {
        [
            ("preflight", &self.preflight),
            ("start source", &self.start_source),
            ("seed", &self.seed),
            ("backup", &self.backup),
            ("stop source", &self.stop_source),
            ("start target", &self.start_target),
            ("restore", &self.restore),
            ("health", &self.health),
            ("cleanup", &self.cleanup),
        ]
    }
}

pub fn run_declaration(path: &Path, output: &Path) -> Result<RunOutput> {
    let declaration = read_declaration(path)?;
    let source_dir = fs::canonicalize(path.parent().unwrap_or_else(|| Path::new(".")))?;
    let work = tempfile::Builder::new().prefix("rehearsal-").tempdir()?;
    let work_dir = work.path().to_path_buf();
    let changes = compare_schemas(
        &source_dir.join(&declaration.source.config_schema),
        &source_dir.join(&declaration.target.config_schema),
    )?;

    let normal_hooks = [
        ("Preflight", &declaration.hooks.preflight),
        ("Start source", &declaration.hooks.start_source),
        ("Seed fixture", &declaration.hooks.seed),
        ("Create backup", &declaration.hooks.backup),
        ("Stop source", &declaration.hooks.stop_source),
        ("Start target", &declaration.hooks.start_target),
        ("Restore backup", &declaration.hooks.restore),
        ("Run health check", &declaration.hooks.health),
    ];
    let mut checks = Vec::new();
    let mut failed = false;
    for (name, hook) in normal_hooks {
        if failed {
            checks.push(Check {
                name: name.into(),
                status: "not run".into(),
                duration_ms: 0,
            });
            continue;
        }
        let check = run_hook(name, hook, &source_dir, &work_dir)?;
        failed = check.status != "passed";
        checks.push(check);
    }
    let cleanup = run_hook(
        "Clean temporary services",
        &declaration.hooks.cleanup,
        &source_dir,
        &work_dir,
    )?;
    if cleanup.status != "passed" {
        failed = true;
    }
    checks.push(cleanup);

    let mut hasher = Sha256::new();
    hasher.update(declaration.product.as_bytes());
    hasher.update(declaration.source.version.as_bytes());
    hasher.update(declaration.target.version.as_bytes());
    hasher.update(
        SystemTime::now()
            .duration_since(UNIX_EPOCH)?
            .as_nanos()
            .to_le_bytes(),
    );
    let run_id = format!(
        "SHR-{}",
        &format!("{:x}", hasher.finalize())[..12].to_uppercase()
    );
    let receipt = Receipt {
        receipt_schema: 1,
        run_id,
        product: declaration.product.clone(),
        source_version: declaration.source.version.clone(),
        target_version: declaration.target.version.clone(),
        adapter: declaration.adapter.label().into(),
        status: if failed { "not ready" } else { "ready" }.into(),
        tested_environment: TestedEnvironment {
            operating_system: std::env::consts::OS.into(),
            architecture: std::env::consts::ARCH.into(),
        },
        supported_environments: declaration.environment.clone(),
        required_resources: declaration.resources.clone(),
        config_changes: changes,
        checks,
        customer_safe: true,
        limitations: vec![
            "This receipt covers only the source and target versions shown here.".into(),
            "Only the declared operating systems and architectures are supported.".into(),
            "Hook output and fixture contents are intentionally excluded from this receipt.".into(),
        ],
    };
    write_receipt(&receipt, output)?;
    Ok(RunOutput {
        receipt,
        json_path: output.join("readiness.json"),
        html_path: output.join("readiness.html"),
    })
}

fn run_hook(name: &str, hook: &[String], source_dir: &Path, work_dir: &Path) -> Result<Check> {
    let replace = |value: &str| {
        value
            .replace("{source_dir}", &source_dir.to_string_lossy())
            .replace("{work_dir}", &work_dir.to_string_lossy())
    };
    let program = replace(&hook[0]);
    let args: Vec<OsString> = hook[1..]
        .iter()
        .map(|arg| OsString::from(replace(arg)))
        .collect();
    let start = Instant::now();
    let mut command = Command::new(&program);
    command
        .args(args)
        .current_dir(work_dir)
        .env_clear()
        .env("PATH", std::env::var_os("PATH").unwrap_or_default())
        .env("REHEARSAL_SOURCE_DIR", source_dir)
        .env("REHEARSAL_WORK_DIR", work_dir)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null());
    for key in ["SYSTEMROOT", "COMSPEC", "PATHEXT", "TEMP", "TMP"] {
        if let Some(value) = std::env::var_os(key) {
            command.env(key, value);
        }
    }
    let status = command.status();
    Ok(Check {
        name: name.into(),
        status: if status.is_ok_and(|value| value.success()) {
            "passed"
        } else {
            "failed"
        }
        .into(),
        duration_ms: start.elapsed().as_millis(),
    })
}

fn compare_schemas(source: &Path, target: &Path) -> Result<Vec<ConfigChange>> {
    let before = flatten_schema(source)?;
    let after = flatten_schema(target)?;
    let keys: BTreeSet<_> = before.keys().chain(after.keys()).cloned().collect();
    Ok(keys
        .into_iter()
        .filter_map(|path| match (before.get(&path), after.get(&path)) {
            (Some(left), Some(right)) if left == right => None,
            (Some(left), Some(right)) => Some(ConfigChange {
                path,
                change: "type changed".into(),
                source_type: Some(left.clone()),
                target_type: Some(right.clone()),
            }),
            (Some(left), None) => Some(ConfigChange {
                path,
                change: "removed".into(),
                source_type: Some(left.clone()),
                target_type: None,
            }),
            (None, Some(right)) => Some(ConfigChange {
                path,
                change: "added".into(),
                source_type: None,
                target_type: Some(right.clone()),
            }),
            (None, None) => None,
        })
        .collect())
}

fn flatten_schema(path: &Path) -> Result<BTreeMap<String, String>> {
    let raw = fs::read_to_string(path)?;
    let value: serde_yaml::Value = serde_yaml::from_str(&raw)
        .with_context(|| format!("{} is not valid YAML", path.display()))?;
    let mut output = BTreeMap::new();
    flatten_value("", &value, &mut output);
    Ok(output)
}

fn flatten_value(prefix: &str, value: &serde_yaml::Value, output: &mut BTreeMap<String, String>) {
    match value {
        serde_yaml::Value::Mapping(map) => {
            for (key, child) in map {
                if let Some(key) = key.as_str() {
                    let path = if prefix.is_empty() {
                        key.into()
                    } else {
                        format!("{prefix}.{key}")
                    };
                    flatten_value(&path, child, output);
                }
            }
        }
        serde_yaml::Value::Sequence(_) => {
            output.insert(prefix.into(), "list".into());
        }
        serde_yaml::Value::Bool(_) => {
            output.insert(prefix.into(), "boolean".into());
        }
        serde_yaml::Value::Number(_) => {
            output.insert(prefix.into(), "number".into());
        }
        serde_yaml::Value::String(_) => {
            output.insert(prefix.into(), "string".into());
        }
        serde_yaml::Value::Null => {
            output.insert(prefix.into(), "null".into());
        }
        _ => {
            output.insert(prefix.into(), "value".into());
        }
    }
}

fn write_receipt(receipt: &Receipt, output: &Path) -> Result<()> {
    fs::create_dir_all(output)?;
    fs::write(
        output.join("readiness.json"),
        serde_json::to_string_pretty(receipt)?,
    )?;
    fs::write(output.join("readiness.html"), receipt_html(receipt))?;
    Ok(())
}

fn receipt_html(receipt: &Receipt) -> String {
    let checks = receipt
        .checks
        .iter()
        .map(|check| {
            format!(
                "<tr><td>{}</td><td>{}</td><td>{} ms</td></tr>",
                escape(&check.name),
                escape(&check.status),
                check.duration_ms
            )
        })
        .collect::<String>();
    let changes = if receipt.config_changes.is_empty() {
        "<p>No schema key or type changes found.</p>".into()
    } else {
        format!(
            "<ul>{}</ul>",
            receipt
                .config_changes
                .iter()
                .map(|item| format!(
                    "<li><code>{}</code> — {}</li>",
                    escape(&item.path),
                    escape(&item.change)
                ))
                .collect::<String>()
        )
    };
    format!(
        r#"<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Readiness receipt — {product}</title><style>body{{background:#f3eedc;color:#18332d;font:17px/1.55 system-ui;margin:0}}main{{max-width:760px;margin:auto;padding:48px 24px}}h1,h2{{font-family:Georgia,serif}}.stamp{{border:3px solid #c84b2f;color:#9d2e2e;display:inline-block;padding:8px 16px;text-transform:uppercase;font-weight:800}}table{{width:100%;border-collapse:collapse}}th,td{{border-bottom:1px solid #76956c;text-align:left;padding:10px}}code{{font-family:ui-monospace,monospace}}footer{{margin-top:48px;border-top:2px solid #18332d;padding-top:16px}}</style></head><body><main><p>Self-Host Upgrade Rehearsal · {run_id}</p><h1>{source} → {target}</h1><p class="stamp">{status}</p><p>{product} was tested with {adapter} on {os}/{arch}.</p><h2>Checks</h2><table><thead><tr><th>Check</th><th>Result</th><th>Time</th></tr></thead><tbody>{checks}</tbody></table><h2>Config schema changes</h2>{changes}<h2>Required resources</h2><p>{memory} MB memory · {disk} MB disk</p><h2>Coverage limits</h2><ul><li>This receipt covers only the versions shown above.</li><li>Hook output and fixture contents are not included.</li></ul><footer>Customer-safe receipt schema 1</footer></main></body></html>"#,
        product = escape(&receipt.product),
        run_id = escape(&receipt.run_id),
        source = escape(&receipt.source_version),
        target = escape(&receipt.target_version),
        status = escape(&receipt.status),
        adapter = escape(&receipt.adapter),
        os = escape(&receipt.tested_environment.operating_system),
        arch = escape(&receipt.tested_environment.architecture),
        checks = checks,
        changes = changes,
        memory = receipt.required_resources.memory_mb,
        disk = receipt.required_resources.disk_mb
    )
}

fn escape(value: &str) -> String {
    value
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}

pub fn starter_declaration(adapter: Adapter) -> &'static str {
    match adapter {
        Adapter::Compose => include_str!("../templates/rehearsal.compose.yml"),
        Adapter::Kubernetes => include_str!("../templates/rehearsal.kubernetes.yml"),
        Adapter::Fixture => unreachable!(),
    }
}

pub fn fixture_step(step: &str) -> Result<()> {
    let root = std::env::var_os("REHEARSAL_WORK_DIR")
        .map(PathBuf::from)
        .ok_or_else(|| anyhow!("fixture step requires a rehearsal workspace"))?;
    match step {
        "preflight" => fs::write(root.join("preflight.ok"), "sample only")?,
        "start-source" => fs::write(root.join("source.running"), "1.8.4")?,
        "seed" => fs::write(root.join("fixture.txt"), "three synthetic workspaces")?,
        "backup" => fs::copy(root.join("fixture.txt"), root.join("backup.txt")).map(|_| ())?,
        "stop-source" => {
            let _ = fs::remove_file(root.join("source.running"));
        }
        "start-target" => fs::write(root.join("target.running"), "2.0.0")?,
        "restore" => fs::copy(root.join("backup.txt"), root.join("restored.txt")).map(|_| ())?,
        "health" => {
            if fs::read_to_string(root.join("restored.txt"))? != "three synthetic workspaces" {
                bail!("restored fixture did not match");
            }
            fs::write(root.join("health.ok"), "ready")?;
        }
        "cleanup" => {
            for name in ["source.running", "target.running"] {
                let _ = fs::remove_file(root.join(name));
            }
        }
        _ => bail!("unknown fixture step"),
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn schema_diff_never_includes_values() {
        let dir = tempfile::tempdir().unwrap();
        fs::write(
            dir.path().join("a.yml"),
            "db:\n  password: secret-a\n  port: 5432\n",
        )
        .unwrap();
        fs::write(
            dir.path().join("b.yml"),
            "db:\n  password: secret-b\n  port: '5432'\n  ssl: true\n",
        )
        .unwrap();
        let changes =
            compare_schemas(&dir.path().join("a.yml"), &dir.path().join("b.yml")).unwrap();
        let json = serde_json::to_string(&changes).unwrap();
        assert!(!json.contains("secret-a"));
        assert!(!json.contains("secret-b"));
        assert!(json.contains("db.ssl"));
        assert!(json.contains("type changed"));
    }
}
