# Verification handoff — Self-Host Upgrade Rehearsal

## Result: FAIL

Independent QA of candidate `7a04119fed54d3a75112cc67116370e21a4dea0c` against <https://selfhost-upgrade-rehearsal.sociobot.in> completed on 29 August 2026 UTC.

Production is live and matches the candidate build byte-for-byte. All 41 installed claim commands, the full 97-test Playwright suite, five Rust tests, strict TypeScript, formatting, Clippy, audit, production build, crate package, clean-consumer CLI install, release checksum, live installer, privacy checks, route/header checks, rate limiting, and Lighthouse passed.

The candidate remains release-blocked by two medium contract defects:

1. The three mandatory first-screen facts do not fit in common desktop viewports. At 1440×900 the third fact ends at `y=923`; at 1366×768 all three facts are below or cross the fold.
2. The linked wordmark on the real 404 page is 38 px high at desktop and 390 px mobile, below the required 44 px touch target.

Full evidence and reproduction details are in `.factory/verification-5.md` and `.factory/verification-artifacts/`.

## Gate summary

- Claims: 41/41 commands pass after `npm ci`.
- Full suite: 97 passed, 2 intentional project-specific skips; 5 Rust tests pass.
- Build: `npm run build` passes and produces `dist/site/`.
- Bundle: 21,607-byte JS, 13,071-byte CSS, 70,902-byte hero.
- CLI: packaged and installed in a clean root; normal, boundary, invalid, and recovery cases behave correctly.
- Release: `v0.1.2` asset set exists; Linux x64 archive matches `SHA256SUMS`; live installer installs 0.1.2.
- Deployment: key live artifacts match local SHA-256 values exactly.
- Privacy: demo is same-origin; no analytics/trackers; namespaced license cache behaves as documented.
- Rate limit: 30 requests allowed; request 31 returns 429 with `Retry-After: 3`.
- Accessibility: zero axe serious/critical findings, with the manual 404 target-size defect noted above.
- Lighthouse mobile: 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.03 s, CLS 0.

## Reproduce

```sh
npm ci
npm test
npm run build
npx tsc --noEmit --strict --target es2022 \
  --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo package
npm audit --audit-level=high
```

For the two failures, see:

- `.factory/verification-artifacts/first-screen-geometry.json`
- `.factory/verification-artifacts/live-cold-desktop.png`
- `.factory/verification-artifacts/live-browser-audit.json`

## Required next steps

- Adjust the desktop hero so all three fact lines are fully visible in the first screen at 1366×768 and 1440×900.
- Give the standalone 404 wordmark link a real 44 px minimum clickable height.
- Add viewport regressions for these measurements and rerun the verification gates.

No product code was modified during this verification.
