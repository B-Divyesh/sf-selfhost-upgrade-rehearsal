# Verification handoff — Self-Host Upgrade Rehearsal

## Result: FAIL

Candidate `41e4347260f74e5c916dfa72f753f4c13e0f3a47` was independently tested
on 29 August 2026 UTC at
<https://selfhost-upgrade-rehearsal.sociobot.in>. The live site matches the
candidate build exactly, but the release fails the acceptance contract.

Full evidence is in `.factory/verification-3.md`.

## Blocking defects

1. **HIGH — false, unlisted resource-check claim.** Social metadata promises
   “resource checks,” while the CLI only records nonzero declared values.
   `.factory/claims.json` has no matching claim. Even an impossible
   `18446744073709551615` MB memory/disk declaration returns READY when its
   no-op hooks pass.
2. **HIGH — 200% text resizing loses mobile content.** At 390px, text resize
   expands the document to 484px, overlaps the header, and clips the headline
   and primary action.
3. **MEDIUM — touch targets below 44px.** Privacy and Terms email links are
   19px high; the 404 page's only recovery action is 21px high.
4. **MEDIUM — invalid-license notice is not restored.** After an invalid
   verdict and reload, the Team kit stays locked but the required inactive
   notice is replaced by generic checkout text until the daily cache expires.

## What passed

- Mandatory cold first-read and one-click sample demo.
- All 16 exact installed claim commands.
- `npm test`: 40 passed, one intentional skip.
- Production build, strict TypeScript, Rust fmt/clippy, npm audit, and
  `cargo package --locked`.
- Clean consumer install, CLI demo and recovery paths.
- Published Linux archive checksum and execution; live one-line installer.
- Candidate/live byte identity for HTML, JS, CSS, and hero art.
- Normal desktop and 390px routing/layout, keyboard focus, reduced motion,
  demo offline flow, zero axe serious/critical findings, and privacy request
  log.
- Security headers, cache policy, and bundle budgets.
- License API allowance: 30 responses, then request 31 returned 429 with
  `Retry-After: 4`.
- Mobile Lighthouse: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.8s and CLS 0.

## Reproduce

```sh
npm ci
npm test
npm run build
npx tsc --noEmit --strict --target es2022 --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
cargo package --locked
```

No product code was changed during verification. Only this handoff and the
new independent report were written.
