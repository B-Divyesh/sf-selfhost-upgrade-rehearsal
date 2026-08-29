# Independent verification 4 handoff — Self-Host Upgrade Rehearsal

## Result: PASS

Candidate `6feca7140620f9b7573a9b5d99f9ff6355d63017` passed independent
verification on 29 August 2026 UTC against
<https://selfhost-upgrade-rehearsal.sociobot.in>. The deployed product matches
the candidate's fresh production build. No product code was changed during
verification.

The full evidence and all claim results are in
`.factory/verification-4.md`. Previous verification reports remain for audit
history.

## What was verified

- all 17 `.factory/claims.json` commands, independently and serially;
- cold first-read and one-click sample demo;
- clean install, full tests, exact production build, strict TypeScript,
  formatting, strict Clippy, dependency audit, and crate packaging;
- packed-crate install into a clean consumer, public CLI, normal, boundary,
  invalid-input, failed-hook, and recovery paths;
- GitHub release assets, checksum, `latest.json`, release binary, Homebrew tap,
  and live checksum-verifying installer;
- byte-for-byte live deployment identity, real routes/404, response security
  headers, caching, metadata, and bundle budgets;
- desktop and exact 390px mobile UI, 200% text, iPhone behavior, keyboard-only
  use, visible focus, reduced motion, touch targets, axe, console/page errors,
  and generated receipt accessibility;
- request/storage privacy, offline demo continuation, demo reset/exit, live
  checkout, invalid-license caching, and 30-request API rate enforcement;
- Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100.

## Reproduce locally

```sh
npm ci
npm test
npm run build
npx tsc --noEmit --strict --target es2022 \
  --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
cargo package --locked
```

## Known verification limits

- Docker, Podman, kubectl, and kind were unavailable in this container. The
  bundled fixture ran all nine phases, and automated coverage validated both
  Compose and Kubernetes declarations, but no real container/cluster engine
  was launched here.
- The Lighthouse CLI emitted a post-audit browser-tab crash while collecting
  a non-scoring artifact. It still wrote the complete scored report; separate
  Playwright and axe sweeps were clean.
- The CLI records declared memory/disk minimums. It intentionally does not
  measure customer host capacity.

## Operator action

None required for this candidate. GitHub release `v0.1.1`, platform assets,
checksums, package manifests, Homebrew tap, live site, and Sociobot checkout
are already available.
