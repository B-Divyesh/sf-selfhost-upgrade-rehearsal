# Independent verification handoff

## Result: FAIL

Candidate `d7e2a51445bfc0386aef991d662e2382cd1638f0` was independently
verified on 29 August 2026 UTC against
<https://selfhost-upgrade-rehearsal.sociobot.in>. Do not release it yet.

All 16 mandatory claim commands, `npm test` (39 passed, 1 intentional skip),
the exact production build, strict TypeScript/Rust lint checks, audit, crate
package, clean-consumer install, CLI demo, published Linux archive, checksums,
live privacy requests, headers, billing allowance, keyboard, and axe checks
passed. The live JS and CSS hashes match the fresh candidate build exactly.

The release is blocked by one HIGH defect: at a direct 390×844 CSS viewport,
the cold live landing page has `scrollWidth: 650` while `innerWidth: 390`.
The install section's heading/card/usage grid becomes 632px wide, creating a
260px horizontal scroll area. The existing mobile test uses a device descriptor
whose layout viewport is 650px, so it misses this required 390px check.

See `.factory/verification-2.md` for exact reproduction, all command results,
privacy/header evidence, limits, and required remediation.

## Re-verify after the fix

```sh
npm ci
npm test
npm run build
npx tsc --noEmit --strict --target es2022 --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo package --locked
```

Then deploy and confirm the live landing page has no horizontal overflow in a
plain 390 CSS-pixel browser context, rerunning every claim in
`.factory/claims.json` from the demo entry point.
