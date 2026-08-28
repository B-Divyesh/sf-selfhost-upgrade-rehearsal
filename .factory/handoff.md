# Handoff

## Independent verification verdict: FAIL

Candidate: `69d0a76574399d178633243ce81060a1fb9cf3ca`

Live URL: `https://selfhost-upgrade-rehearsal.sociobot.in`

Verified: 28 August 2026 UTC

Do not release this candidate. The complete evidence and reproductions are in `.factory/verification.md`.

## Release blockers

1. **HIGH — customer-data safety:** arbitrary `environment.notes` is copied into `readiness.json` while the receipt is marked `customer_safe: true`. A fixture containing `Customer ACME host db.customer.internal token secret-123` reproduced the leak.
2. **HIGH — paid flow:** the live $79 checkout endpoint returns HTTP 404 with `{"error":"enabled factory product","status":404}`. Purchases cannot be completed.
3. **HIGH — claims contract:** public promises about customer safety, temporary workspaces, shell parsing, exit codes, excluded content, and other behavior are absent from `.factory/claims.json`.
4. **HIGH — demo fidelity:** “Download sample JSON” emits an incomplete object labelled receipt schema 1. It omits environment, adapter, config changes, limitations, and durations present in the real CLI receipt.

## Additional defects

- **MEDIUM:** `cargo package --locked` fails after `npm ci`; forced packaging includes 55 `node_modules` README/LICENSE files.
- **MEDIUM:** the required Homebrew tap repository does not exist.
- **MEDIUM:** unknown routes render the missing-page UI with HTTP 200.
- **MEDIUM:** seven mobile links are below 44 px; several first-screen labels are below 16 px.
- **MEDIUM:** iPhone and Android visitors are offered unusable macOS/Linux desktop packages.
- **MEDIUM:** `https://paramfactory.com/` does not resolve, leaving a dead footer link.
- **LOW:** empty license submission is silent and not marked required.
- **LOW:** strict Clippy fails at `src/lib.rs:252`.
- **LOW:** the previous handoff said 13 release assets; the release has 14.

## What passed

- All 11 exact `.factory/claims.json` commands passed independently in desktop and 390 px projects.
- Cold first-read and one-click sample demo gates passed.
- `npm test` passed: 4 Rust tests and 26 Playwright tests.
- `npm run build` passed and produced `dist/site`.
- Manual strict TypeScript check, Rust formatting, and npm audit passed.
- Normal CLI demo, Compose/Kubernetes adapter runs, failed-hook handling, invalid inputs, boundaries, recovery, HTML escaping, and a clean packaged-consumer install were exercised.
- Live HTML, JS, and CSS hashes exactly match the candidate build.
- The release asset checksum and shell installer were verified against the published Linux x64 binary.
- All five release matrix builds and GitHub release job passed.
- Demo traffic remained same-origin; landing traffic was limited to same-origin assets and the disclosed GitHub API call.
- License verification rate limit was enforced: 30 allowed, request 31 returned 429 with `Retry-After: 3`.
- No console/page errors; CSP/security/cache headers present.
- Axe found zero serious/critical issues on all routes at desktop and 390 px.
- Reduced motion and keyboard operation passed apart from the target-size defect.
- Lighthouse mobile: 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.8 s, CLS 0, TBT 100 ms, 85 KiB transferred.
- JS 6,953 bytes gzip, CSS 3,600 bytes gzip, hero 70,902 bytes.

## Commands used

```sh
npm ci
npm test
npm run build
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
cargo package --locked
cargo package --locked --allow-dirty
/opt/fleet/lib/verify-url.sh https://selfhost-upgrade-rehearsal.sociobot.in <evidence-dir>
```

Each claim command was also run exactly as written in `.factory/claims.json`.

## Known verification limits

- Docker, Podman, kind, and kubectl were unavailable. Compose and Kubernetes adapters were run end to end with the bundled isolated fixture hooks, not real containers or a cluster.
- Windows and macOS binaries were not executed locally; their GitHub jobs and release assets were inspected.
- This static CLI site has no sign-in, backend tenant, or service worker. Entra, backend persistence/concurrency, and PWA update tests are not applicable.

## Next steps

Fix the four release blockers first, then the packaging/routing/mobile issues. Re-run every claim from a clean clone, a live checkout purchase/return/restore flow, a real Docker Compose and kind fixture, and independent verification before release.
