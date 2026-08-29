# Repair handoff — Self-Host Upgrade Rehearsal

## Result: repaired and locally verified

This repair starts from verifier report commit `a05b89607ba85deb7eaf112090ddbe7ea3167916` for candidate `7a04119fed54d3a75112cc67116370e21a4dea0c`. It fixes both release-blocking findings in `.factory/verification-5.md` without changing the researched brief, CLI, receipt schema, demo behavior, billing flow, release assets, or deployment class.

## What changed

- Reworked only the desktop hero geometry: the copy column is wider, the display heading is capped at `5.25rem`, and the hero uses viewport-aware vertical spacing. The three required facts remain 17 px and are now fully visible in both reported desktop viewports.
- Added a real 44 px minimum height to the standalone 404 wordmark link.
- Added `@regression:first-screen-facts`, which checks all three facts at 1440×900 and 1366×768 and rejects text below 16 px.
- Added `@regression:404-wordmark`, which checks the standalone wordmark at 1440×900 and 390×844.

Measured repaired geometry:

- 1440×900 facts: `y=649.14..686.33`, `686.33..723.52`, and `723.52..760.70`; computed size 17 px.
- 1366×768 facts: `y=579.33..616.52`, `616.52..653.70`, and `653.70..690.89`; computed size 17 px.
- 404 wordmark: 130.55×44 px at desktop and 125.67×44 px at 390 px.

## Local verification

Clean install and complete product suite:

```sh
npm ci
npm test
```

Result: 5 Rust tests passed; 99 Playwright tests passed; 4 intentional project-specific skips. The browser matrix covers desktop Chromium, iPhone/390 px, the dedicated 390 px project, keyboard actions, route focus/history, offline demo reset, demo network privacy, billing/license state, all 41 claims, accessibility, and both repair regressions.

Every exact command in `.factory/claims.json` was also run separately after `npm ci`: `CLAIMS TOTAL=41 FAILURES=0`.

Quality, build, and packaging gates:

```sh
npx tsc --noEmit --strict --target es2022 --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
npm run build
cargo package --locked
sh -n site/public/install.sh
git diff --check
```

All passed. `cargo package --locked` produced and verified a 15-file, 54.6 KiB unpacked crate. A fresh `cargo install --path target/package/rehearsal-0.1.2 --root <temporary-root> --locked` installed version 0.1.2; its demo returned a READY, customer-safe schema-1 receipt with nine checks.

Production site output is in `dist/site/`:

- JavaScript: 21,607 bytes raw / 7.43 KB gzip.
- CSS: 13,227 bytes raw / 3.75 KB gzip.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- FCP 0.90 s, LCP 1.65 s, TBT 27 ms, CLS 0, transferred bytes 85,647.

A local browser sweep covered `/`, `/?demo=1`, `/privacy`, `/terms`, and `/404.html` at 1440×900 and 390×844. Every page had one H1 and one main landmark, no horizontal overflow, no sub-44 px interactive targets, no serious/critical axe findings, and no console or page errors. Keyboard traversal started at the skip link, Enter targeted `#main`, and the next Tab reached “Try it with sample data.” Reduced-motion mode matched and reduced animation and transition durations to 0.01 ms with automatic scrolling.

## Deployment and live verification

Pending the repair commit and static deployment. The deployment command is:

```sh
/opt/fleet/lib/deploy-static.sh selfhost-upgrade-rehearsal dist/site
```

## Known gaps and operator action

- No product gap remains from verifier report 5.
- No new CLI release is needed because this repair changes only site CSS and browser regression coverage. Existing v0.1.2 release assets and package-manager manifests remain the tested distribution.
