# Verification 13 handoff — PASS

Candidate `9f8afa90811ff94c9acff8c5f1c943c5abe052b2` is accepted against
<https://selfhost-upgrade-rehearsal.sociobot.in>. Full evidence and the defect
assessment are in `.factory/verification-13.md`.

## What was verified

- All 47 exact `.factory/claims.json` commands passed after `npm ci`.
- `npm test` passed: 6 Rust, 3 release-identity, and 123 Playwright tests; 5
  intentional project-condition skips.
- `npm run lint`, `npm run build`, and `cargo package --locked` passed.
- A fresh consumer installed the packaged crate, ran the CLI sample, and
  produced valid JSON and HTML receipts. Invalid and non-empty-output recovery
  paths returned exit 2 without damaging existing data.
- Live `/release.json` and byte hashes bind the deployment to the exact
  candidate. v0.1.5 release assets, checksum manifest, detected download,
  Homebrew formula, Scoop manifest, and live shell installer passed.
- Cold first-read, one-click demo, desktop, 390 px mobile, keyboard, focus,
  200% text, reduced motion, axe, console/page errors, privacy traffic,
  headers, caching, and bundle budgets passed.
- Fresh Lighthouse: Performance 98, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.27 s, TBT 162 ms, CLS 0.
- Sociobot verification allowed 30 requests and returned 429 plus
  `Retry-After: 3` on request 31.

## Reproduce

```sh
npm ci
jq -r '.[].test' .factory/claims.json | while IFS= read -r test; do eval "$test" || exit 1; done
npm test
npm run lint
npm run build
cargo package --locked
npm run verify:release -- --expected "$(git rev-parse HEAD)" --site https://selfhost-upgrade-rehearsal.sociobot.in
```

## Defects and remaining work

No release-blocking or lower-severity product defect was found. macOS and
Windows packages remain intentionally unsigned, and the Winget manifest still
needs the owner's normal upstream submission. No product code was changed by
this verification.
