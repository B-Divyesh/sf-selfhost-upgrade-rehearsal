# Self-Host Upgrade Rehearsal

Rehearse self-hosted upgrades and issue a customer-safe readiness receipt.

This kit is for teams that ship Docker Compose or Kubernetes products. It checks one declared upgrade path before customers use it.

Website: <https://selfhost-upgrade-rehearsal.sociobot.in>  
One-click browser demo: <https://selfhost-upgrade-rehearsal.sociobot.in/demo>

## Try the bundled upgrade

```sh
rehearsal demo
```

The command creates a temporary Arbor Desk project with synthetic records. It prints the paths to JSON and HTML receipts.

The CLI checks backup, restore, and health hooks. It never includes hook output or fixture contents in a receipt.

## Install

macOS and Linux:

```sh
curl -fsSL https://selfhost-upgrade-rehearsal.sociobot.in/install.sh | sh
```

Windows PowerShell:

```powershell
irm https://selfhost-upgrade-rehearsal.sociobot.in/install.ps1 | iex
```

Both installers verify SHA256 before placing the binary on `PATH`.

Homebrew packages use the published tap:

```sh
brew install B-Divyesh/selfhost-upgrade-rehearsal/rehearsal
```

Scoop uses the release manifest:

```powershell
scoop install https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/latest/download/rehearsal-scoop.json
```

Each release also carries `.deb`, `.rpm`, unsigned macOS `.pkg`, Windows zip, Winget manifests, and checksums.

## Declare an upgrade path

Start with a checked template:

```sh
rehearsal init compose
# or: rehearsal init kubernetes
```

The declaration keeps the public surface small:

```yaml
schema: 1
product: Arbor Desk
adapter: compose
source:
  version: 1.8.4
  config_schema: schemas/1.8.yml
target:
  version: 2.0.0
  config_schema: schemas/2.0.yml
environment:
  operating_systems: [linux]
  architectures: [x86_64, aarch64]
resources:
  memory_mb: 768
  disk_mb: 2048
hooks:
  preflight: [docker, compose, config, --quiet]
  start_source: [sh, "{source_dir}/hooks/start-source.sh"]
  seed: [sh, "{source_dir}/hooks/seed.sh"]
  backup: [sh, "{source_dir}/hooks/backup.sh"]
  stop_source: [sh, "{source_dir}/hooks/stop-source.sh"]
  start_target: [sh, "{source_dir}/hooks/start-target.sh"]
  restore: [sh, "{source_dir}/hooks/restore.sh"]
  health: [sh, "{source_dir}/hooks/health.sh"]
  cleanup: [sh, "{source_dir}/hooks/cleanup.sh"]
```

Commands are argument arrays, so no shell parsing happens inside the CLI. Use `{source_dir}` and `{work_dir}` as path placeholders.

## Validate and run

```sh
rehearsal check --file rehearsal.yml
rehearsal run --file rehearsal.yml --output release-proof
```

`check` validates Compose and Kubernetes declarations before launch. `run` executes hooks in a new temporary directory.

The result contains schema key changes, declared resource minimums, checks, tested versions, and supported environments. It writes `readiness.json` and `readiness.html`.

Use `--json` with `check`, `run`, or `demo` for scripts. A failed check returns exit code 1. Invalid input returns exit code 2.

## Privacy and limits

The CLI has no built-in network client or telemetry path. Your hook commands may use the network when your test requires it.

Schema comparison records paths and value types. It does not copy schema values into the receipt.

A receipt covers only the versions and environments printed on it. It is not proof for an unlisted customer system.

## Team kit

The free CLI includes both receipt formats. The optional $79 Team kit adds a release-matrix workflow and upgrade checklist.

License purchase and verification use the Sociobot billing API. No payment provider is embedded in this repository.

## Develop

Requirements: stable Rust, Node 22, and npm.

```sh
npm install
npm test
npm run build
```

`npm test` runs Rust, claim, accessibility, desktop, and 390 px browser checks. `npm run build:site` writes `dist/site/index.html`.

Run the site locally:

```sh
npm run dev
```

Package the Rust crate without publishing it:

```sh
cargo package --locked
```

The factory deploys `dist/site`. Tag a version such as `v0.1.1` to run the cross-platform GitHub release workflow.

## License

MIT. See [LICENSE](LICENSE).
