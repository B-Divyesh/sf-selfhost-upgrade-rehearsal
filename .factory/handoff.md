# Repair handoff

## Result

The independent-verification findings for candidate
`69d0a76574399d178633243ce81060a1fb9cf3ca` are repaired. The product remains
a Rust single-binary CLI with a static landing site.

Repair commits:

- `552d9ee` — receipt safety, complete browser receipt, claims, packaging,
  routes, mobile, platform, footer, and lint repairs.
- `25f6344` — versioned the repaired release as `0.1.1`.
- `4e74415` — made the empty-license regression keyboard-operable and
  announced.

Published release: `v0.1.1` (`81918e353103f397ea4ee6939a4ead6a39c94e19`).
The release workflow completed successfully:
<https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/actions/runs/33247722935>.
It has 14 assets, including `SHA256SUMS` and `latest.json`.

Live site: <https://selfhost-upgrade-rehearsal.sociobot.in>

## Repairs

- Receipt `supported_environments` now has a receipt-safe type. Arbitrary
  declaration `environment.notes` never enters JSON or HTML receipts; the
  sensitive-note and hook-output regression tests assert this before a receipt
  may be called customer-safe.
- The demo downloads the complete schema-1 Arbor Desk receipt: adapter, tested
  and supported environments, resources, three config changes, nine checks
  with `duration_ms`, customer-safe flag, and limitations.
- `.factory/claims.json` now has 16 entries, including customer-safe receipt,
  temporary workspace, argument-array execution, exit codes, and unsigned
  packages. Each has exactly one tagged browser regression test.
- `Cargo.toml` uses root-anchored include patterns. `cargo package --locked`
  now packages 15 intended files after `npm ci` rather than Node dependency
  documents.
- The Homebrew tap exists at
  <https://github.com/B-Divyesh/homebrew-selfhost-upgrade-rehearsal>; its
  `Formula/rehearsal.rb` is version 0.1.1.
- Known site paths are emitted as static route documents. Navigation fallback
  is removed, so unknown paths return a real HTTP 404.
- Mobile navigation/footer targets are at least 44×44 px, first-screen facts
  and navigation are at least 16 px, mobile devices get a calm desktop-only
  download state, and empty license submission reports a focused recovery
  message.
- The footer now uses the resolving Sociobot destination. Strict Clippy is
  clean.
- The Sociobot billing product is enabled for the $79 one-time Team kit. Its
  checkout endpoint responds with the hosted checkout instead of 404; license
  verification/restore continues to use the existing product endpoint.

## Verification

Run from a clean clone:

```sh
npm ci
npm test
npx tsc --noEmit --strict --target es2022 --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
cargo package --locked
npm run build
```

All commands above passed on 29 August 2026 UTC. `npm test` passed 39 tests
with one intentional desktop-only skip; this includes desktop and 390 px
Playwright, keyboard, offline demo, privacy request recording, and Axe serious/
critical checks. Every one of the 16 claim commands in `.factory/claims.json`
was also run independently and passed.

Fresh package consumer check passed:

```sh
cargo install --path target/package/rehearsal-0.1.1 --root <fresh-root> --locked
<fresh-root>/bin/rehearsal --version
<fresh-root>/bin/rehearsal demo --json
```

The consumer reported `rehearsal 0.1.1` and a ready, nine-check schema-1
receipt. The downloaded 0.1.1 Linux x86_64 archive also passed its published
SHA256SUMS entry; `latest.json` reports 0.1.1.

Live verification passed after static deployment (deployment
`2e918b73-1bc7-4e96-bcf9-ed06b412de24`):

- Factory URL verifier: HTTP 200, 965 ms load, zero console errors,
  title/lang/H1/main/alt checks passed.
- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns
  404.
- Live desktop and 390 px browser checks found zero Axe serious/critical
  issues and zero console errors. The mobile check confirmed target sizes and
  keyboard empty-license feedback.
- CSP, HSTS, `nosniff`, referrer, and permissions headers are present. The
  live checkout endpoint returned 200 and rendered the Self-Host Upgrade
  Rehearsal Team kit checkout.

## Known limits

- Docker, Podman, kind, and kubectl were not available in this worker. The
  Compose and Kubernetes declaration adapters were exercised end to end with
  isolated bundled fixture hooks, as in the original verification.
- macOS and Windows release binaries were built by the successful matrix but
  were not executed locally. The macOS package and Windows zip remain
  intentionally unsigned, as disclosed.
- This is not a PWA and has no sign-in or backend tenant; service-worker update
  and Entra checks do not apply.
