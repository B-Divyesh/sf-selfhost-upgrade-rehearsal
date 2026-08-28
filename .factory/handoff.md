# Handoff

## What shipped

- Rust 0.1.0 single-binary CLI with `init`, `check`, `run`, `demo`, and `--json` paths.
- Strict YAML declarations for Docker Compose and Kubernetes upgrade hooks.
- Isolated temporary workspaces with cleared environments and redacted hook output.
- Ordered preflight, source start, seed, backup, stop, target start, restore, health, and cleanup checks.
- Customer-safe JSON and standalone HTML receipts with schema key changes, resource minimums, tested versions, and support limits.
- Bundled Arbor Desk demo data. `rehearsal demo` needs no Docker, account, or network.
- Botanical field-guide landing site, live terminal recording, full demo receipt, mobile layout, and designed 404 page.
- One-time $79 Team kit purchase, return-token storage, daily license verification, manual restore, and CI kit download.
- Privacy and terms routes, canonical metadata, social card, sitemap, robots file, security headers, and cache policy.
- SHA256-checking shell and PowerShell installers with calm no-release and offline states.
- Release workflow for Linux x64/arm64, macOS Intel/Apple Silicon, and Windows x64.
- Release assets include tar/zip, `.deb`, `.rpm`, unsigned `.pkg`, checksums, `latest.json`, Scoop, Winget, and Homebrew files.
- GitHub Release `v0.1.0` is published with 13 assets.

## Run and verify

```sh
npm ci
npm test
npm run build:site
cargo package --locked
```

The required static build command is `npm run build:site`. It writes `dist/site/index.html`.

Demo entries:

```text
https://selfhost-upgrade-rehearsal.sociobot.in/demo
rehearsal demo
```

Verification completed on 2026-08-28:

- `npm test`: passed. Four Rust integration/unit tests and 26 Playwright checks passed.
- Claim manifest: 11 claims, each with one matching `@claim:` test.
- `npm test -- --grep @claim:cli-receipts`: passed in desktop and 390 px projects.
- `cargo package --locked --allow-dirty`: passed and verified the packaged crate.
- `npm audit --audit-level=high`: zero vulnerabilities.
- `yaml-lint` on both GitHub workflows: passed.
- GitHub Actions: test workflow and all five release matrix jobs passed.
- Published Linux x64 archive matched `SHA256SUMS`; its demo returned `ready` with nine checks.
- Published `latest.json`: valid version 0.1.0 with five platform URLs.
- `verify-url.sh`: HTTP 200, one H1, main landmark, `lang=en`, zero missing alt text, and zero console errors.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse lab metrics: FCP 1.0 s, LCP 1.6 s, CLS 0. INP was unavailable for the non-interactive lab run.
- Initial assets: 6.91 KB JavaScript gzip, 3.60 KB CSS gzip, 70.9 KB hero WebP.
- Social image: 1200×630 WebP. Hero image: 840×840 WebP.

## Product and privacy boundaries

Receipts never include hook commands, hook output, fixture contents, hostnames, or schema values. Hooks can access the network if the vendor writes them that way. The CLI itself contains no network client.

The demo uses synthetic records and `demo:` session-storage keys. The normal site uses local storage only for release caching and license state.

## Known gaps

- The local sandbox verified declaration handling with no-op hooks. It did not launch a real Docker or kind cluster.
- INP needs field data or an interactive Lighthouse run. The lab run had no qualifying interaction.

## Needs operator action

- Register the `selfhost-upgrade-rehearsal` billing product and its return URL in the Sociobot billing system.
- Create the public Homebrew tap repository and add `FACTORY_GITHUB_TOKEN` before the next automatic tap update.
- Submit the generated Winget manifest archive to `microsoft/winget-pkgs` after release.
- macOS and Windows packages are unsigned. Add signing credentials later if distribution policy requires them.

The generated hero source, output, exact prompt, deployment name, and license provenance are recorded in `.factory/design.md` and `assets/source/specimen-upgrade.png.json`.
