# Repair handoff — Self-Host Upgrade Rehearsal

## Result

Repaired and deployed the release-blocking finding from independent verifier
report `.factory/verification-2.md` for candidate
`d7e2a51445bfc0386aef991d662e2382cd1638f0`.

Repair commit: `e64798c fix: keep install layout inside mobile viewport`.
Deployment: Azure Static Web Apps production deployment
`b4f1be4c-c957-4a6b-b51b-f384179a78ff` on 29 August 2026 UTC. The deployed
site is https://selfhost-upgrade-rehearsal.sociobot.in.

## What changed

- Made both desktop and one-column `#install` tracks shrinkable with
  `minmax(0, 1fr)` and set `min-inline-size: 0` on direct grid children. This
  removes the automatic minimum-content width that made the section 632px
  wide in a 390px viewport.
- Added the dedicated `viewport-390` Playwright project: plain Chromium at a
  true 390×844 CSS-pixel viewport, not an iPhone device descriptor whose
  layout viewport is 650px.
- Added `@regression:viewport-390`, which asserts document/body width and
  the install heading, card, and note boundaries are inside the viewport.
- Made horizontally scrollable installer and first-run command blocks
  keyboard-focusable and labelled. The 390px regression also tabs to the
  installer command block. This resolves the serious axe keyboard-scroll
  issue revealed once the layout became genuinely narrow.

## Verification evidence

Clean dependency install completed with `npm ci` (33 packages; `npm audit
--audit-level=high` reported zero vulnerabilities).

The following all passed locally:

```sh
npm test
# 40 passed, 1 intentional desktop-only skip
npx playwright test --project=viewport-390
# 1 passed
npm run build
npx tsc --noEmit --strict --target es2022 --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
cargo package --locked
```

`cargo package --locked` packaged and verified 15 intended files (54.4 KiB,
16.3 KiB compressed). A fresh consumer install from
`target/package/rehearsal-0.1.1` reported `rehearsal 0.1.1`; its
`demo --output <empty-dir> --json` emitted a schema-1, customer-safe `ready`
receipt with nine passed checks.

All 16 exact commands listed in `.factory/claims.json` were rerun serially
and passed, including the demo/offline/privacy, receipt, schema-redaction,
installer, no-upload, exit-code, and Team-kit claims.

The production build produced `dist/site`; the initial assets are 20,622
bytes JavaScript (7,300 gzip) and 12,689 bytes CSS (3,630 gzip).

Accessibility and browser coverage:

- The pinned Playwright axe integration ran against desktop and mobile with
  zero serious or critical findings. The complete test run checks landmarks,
  title, H1, errors, keyboard controls, 44px mobile navigation targets,
  keyboard license feedback, and route focus/history.
- Local `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, 730ms network-idle,
  no console errors, title/lang/H1/main/alt/button-label checks passed.
- A standalone `npx @axe-core/cli` attempt could not start because this
  worker lacks a system Chrome/chromedriver path. This is environmental; the
  same axe-core rule set executed through the preinstalled Playwright
  Chromium during `npm test` and passed.

Live production checks after deployment:

- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns
  404. `verify-url.sh` passed against the production root in 723ms with no
  console errors.
- A fresh desktop landing had one H1 and main landmark, no axe
  serious/critical violations, and only the disclosed
  `https://api.github.com` release-metadata request outside the site origin.
- In an actual 390×844 CSS-pixel browser, `innerWidth`, document scroll
  width, and body scroll width are all 390. The install heading, card, and
  usage note each span x=18 through x=372; keyboard Tab reaches
  `PRE: Install command`.
- A fresh `/demo` was taken offline after load, Reset demo completed to
  `READY`, and made no external requests. It has zero service-worker
  registrations; no PWA update flow applies to this static, post-load
  offline demo.
- Production response policy includes HSTS, `nosniff`, strict-origin referrer
  policy, restrictive permissions policy, and CSP allowing only self plus
  the documented GitHub/Sociobot connections. HTML is
  `public, must-revalidate, max-age=30`; hashed assets are
  `public, max-age=31536000, immutable`.
- Live identity matched the fresh build exactly:
  `index-5afA4qai.css` SHA-256
  `274e358412ace02cb377b653206ca6540fde05d2edf6d349cf0bdd51fe5a8dd1` and
  `index-BClBEF0Y.js` SHA-256
  `9d6214592abda338e314c9f4ce5a3be80b94b8f29ccc9d535cf604f4b7699148`.

## Known gaps

No release-blocking gaps remain. Docker, Podman, kind, and kubectl are not
available in this worker, so a real container or cluster launch was not
rerun here; the shipped Compose/Kubernetes declaration adapters and fixture
hooks remain covered by the claim and CLI tests.

## Run and deploy

```sh
npm ci
npm test
npm run build
cargo package --locked
```

Deploy the static artifact with:

```sh
/opt/fleet/lib/deploy-static.sh selfhost-upgrade-rehearsal dist/site
```
