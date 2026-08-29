use anyhow::{bail, Result};
use clap::{Parser, Subcommand, ValueEnum};
use rehearsal::{fixture_step, read_declaration, run_declaration, starter_declaration, Adapter};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::ExitCode;

#[derive(Parser)]
#[command(name = "rehearsal", version, about = "Rehearse a self-hosted upgrade before customers do.", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Write a checked starter declaration.
    Init {
        #[arg(value_enum, default_value = "compose")]
        adapter: AdapterArg,
        #[arg(short, long, default_value = "rehearsal.yml")]
        output: PathBuf,
    },
    /// Validate a declaration without launching services.
    Check {
        #[arg(short, long, default_value = "rehearsal.yml")]
        file: PathBuf,
        #[arg(long)]
        json: bool,
    },
    /// Run every upgrade hook and write JSON and HTML receipts.
    Run {
        #[arg(short, long, default_value = "rehearsal.yml")]
        file: PathBuf,
        #[arg(short, long, default_value = "rehearsal-report")]
        output: PathBuf,
        #[arg(long)]
        json: bool,
    },
    /// Run bundled sample data in an isolated temporary directory.
    Demo {
        #[arg(short, long)]
        output: Option<PathBuf>,
        #[arg(long)]
        json: bool,
    },
    #[command(hide = true)]
    FixtureStep { step: String },
}

#[derive(Copy, Clone, ValueEnum)]
enum AdapterArg {
    Compose,
    Kubernetes,
}

fn main() -> ExitCode {
    match run() {
        Ok(code) => code,
        Err(error) => {
            eprintln!("error: {error:#}");
            ExitCode::from(2)
        }
    }
}

fn run() -> Result<ExitCode> {
    match Cli::parse().command {
        Commands::Init { adapter, output } => {
            if output.exists() {
                bail!("{} already exists; choose another path", output.display());
            }
            let adapter = match adapter {
                AdapterArg::Compose => Adapter::Compose,
                AdapterArg::Kubernetes => Adapter::Kubernetes,
            };
            fs::write(&output, starter_declaration(adapter))?;
            println!(
                "Wrote {}. Add schema files and hook commands, then run `rehearsal check`.",
                output.display()
            );
            Ok(ExitCode::SUCCESS)
        }
        Commands::Check { file, json } => {
            let declaration = read_declaration(&file)?;
            if json {
                println!(
                    "{{\"valid\":true,\"product\":{},\"source\":{},\"target\":{}}}",
                    serde_json::to_string(&declaration.product)?,
                    serde_json::to_string(&declaration.source.version)?,
                    serde_json::to_string(&declaration.target.version)?
                );
            } else {
                println!(
                    "Declaration is ready: {} {} → {}.",
                    declaration.product, declaration.source.version, declaration.target.version
                );
            }
            Ok(ExitCode::SUCCESS)
        }
        Commands::Run { file, output, json } => finish_run(&file, &output, json),
        Commands::Demo { output, json } => {
            let root = output.unwrap_or_else(|| {
                std::env::temp_dir().join(format!("rehearsal-demo-{}", std::process::id()))
            });
            if root.exists() && fs::read_dir(&root)?.next().is_some() {
                bail!(
                    "{} is not empty; choose a new demo output directory",
                    root.display()
                );
            }
            fs::create_dir_all(&root)?;
            write_demo(&root)?;
            finish_run(&root.join("rehearsal.yml"), &root.join("report"), json)
        }
        Commands::FixtureStep { step } => {
            fixture_step(&step)?;
            Ok(ExitCode::SUCCESS)
        }
    }
}

fn finish_run(file: &Path, output: &Path, json: bool) -> Result<ExitCode> {
    let result = run_declaration(file, output)?;
    if json {
        println!("{}", serde_json::to_string(&result.receipt)?);
    } else {
        for check in &result.receipt.checks {
            println!("{:<28} {}", check.name, check.status);
        }
        println!(
            "\n{}: {}",
            result.receipt.run_id,
            result.receipt.status.to_uppercase()
        );
        println!("JSON: {}", result.json_path.display());
        println!("HTML: {}", result.html_path.display());
    }
    Ok(if result.receipt.status == "ready" {
        ExitCode::SUCCESS
    } else {
        ExitCode::from(1)
    })
}

fn write_demo(root: &Path) -> Result<()> {
    fs::write(
        root.join("schema-1.8.yml"),
        "database:\n  pool_size: 10\n  ssl: false\nmail:\n  from: robot@example.test\n",
    )?;
    fs::write(root.join("schema-2.0.yml"), "database:\n  pool_size: 10\n  ssl_mode: required\nmail:\n  from: robot@example.test\nworkers:\n  count: 2\n")?;
    let executable = std::env::current_exe()?
        .to_string_lossy()
        .replace('\\', "\\\\");
    let hook = |step: &str| format!("[\"{}\", \"fixture-step\", \"{}\"]", executable, step);
    let declaration = format!(
        r#"schema: 1
product: Arbor Desk
adapter: fixture
source:
  version: 1.8.4
  config_schema: schema-1.8.yml
target:
  version: 2.0.0
  config_schema: schema-2.0.yml
environment:
  operating_systems: [linux, macos, windows]
  architectures: [x86_64, aarch64]
  notes: Sample data only
resources:
  memory_mb: 768
  disk_mb: 2048
hooks:
  preflight: {preflight}
  start_source: {start_source}
  seed: {seed}
  backup: {backup}
  stop_source: {stop_source}
  start_target: {start_target}
  restore: {restore}
  health: {health}
  cleanup: {cleanup}
"#,
        preflight = hook("preflight"),
        start_source = hook("start-source"),
        seed = hook("seed"),
        backup = hook("backup"),
        stop_source = hook("stop-source"),
        start_target = hook("start-target"),
        restore = hook("restore"),
        health = hook("health"),
        cleanup = hook("cleanup")
    );
    fs::write(root.join("rehearsal.yml"), declaration)?;
    Ok(())
}
