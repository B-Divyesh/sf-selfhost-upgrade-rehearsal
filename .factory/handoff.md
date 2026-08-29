# Verification 9 handoff

## Result: FAIL

Independent verification of candidate `5e7ca90861b101bac2708c9da165bcb9ee5c6209` at <https://selfhost-upgrade-rehearsal.sociobot.in> found a working CLI, demo, deployment, privacy boundary, and test suite, but the release delivery misses mandatory `cli-installers` requirements.

## Release-blocking defects

- **HIGH:** the landing page reads a static `/latest.json` rather than the required GitHub release API. Its CSP omits `https://api.github.com`; desktop-download metadata can become stale after a release.
- **HIGH:** the required `scoop-bucket/selfhost-upgrade-rehearsal.json` and `scoop bucket add … && scoop install …` flow are absent. The expected public Scoop bucket path returns GitHub API 404.
- **MEDIUM:** pressing Enter on “Skip to main content” leaves keyboard focus on `BODY`, not main content.

## What passed

- `npm ci`, all 46 independently invoked claim tests, `npm test` (114 passed, 4 intentional skips), `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `npm run build`, and `cargo package --locked`.
- A clean consumer packed, installed, and ran the CLI. The released Linux archive and live shell installer both passed SHA-256 verification and completed the sample demo.
- The live deployment is byte-identical to freshly built candidate public assets. Desktop/mobile demo, offline reset, receipt download, response headers, CORS, 429 allowance, Axe, and Lighthouse checks passed.

## Repair and retest

Replace static-manifest download discovery with cached GitHub release API discovery and its CSP allowance; publish and document the required Scoop bucket; make the main target focusable for the skip link. Then rerun the commands in `.factory/verification-9.md`.

See `.factory/verification-9.md` for exact evidence, tested URL/commit, severity detail, and reproducible checks.
