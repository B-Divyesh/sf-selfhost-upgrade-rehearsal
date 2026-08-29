# Repair handoff — Self-Host Upgrade Rehearsal

## Result: PASS

This repair addresses every finding in independent verification report 3,
recorded at `72f4d284af737578267a97004acc55720b8d9ecf`, for candidate
`41e4347260f74e5c916dfa72f753f4c13e0f3a47`.

Product repair commit: `4b45bee fix: clear verifier release blockers`.
It is pushed to `main` and its static artifact is deployed at
<https://selfhost-upgrade-rehearsal.sociobot.in>.

## Repairs

1. **Resource claim is accurate and testable.** Open Graph and Twitter copy
   no longer promises resource *checks*. It now says the product runs backup,
   restore, health, and config checks, then records declared resource
   minimums. The new `declared-resource-minimums` claim runs a fresh
   declaration with 1536 MB / 4096 MB and asserts those exact values in the
   JSON receipt. The CLI deliberately does not claim to measure host capacity.
2. **200% text resize works at 390 CSS pixels.** The mobile header now stacks
   its wordmark and wrapping navigation. The hero has shrinkable content and
   bounded, wrapping headline/action text. The exact 390px regression sets
   the root font size to 32px and checks document width, header order,
   headline, and primary action bounds.
3. **Legal and recovery links meet the touch-target contract.** Privacy and
   Terms contact links have a 44px minimum height. The standalone real-404
   recovery link is an inline-flex 44px target. Regression coverage visits all
   three documents at 390px.
4. **Cached invalid licenses retain their notice.** Landing setup now restores
   the inactive notice from a valid cached negative verdict before deciding
   whether the daily verification is due. A browser test records one mocked
   invalid verification, reloads, and asserts the notice remains visible with
   no second request.

## Verification

Run locally:

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

Completed on 29 August 2026 UTC:

- Clean `npm ci`: 33 packages, zero audit vulnerabilities.
- `npm test`: 46 passed, one intentional desktop-only skip. This includes 5
  Rust tests and desktop, mobile, and exact 390 CSS-pixel Playwright coverage.
- Every exact command in `.factory/claims.json` ran serially and passed (17
  claims, including `@claim:declared-resource-minimums`).
- `npm run build`: passed; `dist/site` built with the optimized Rust binary.
- Strict TypeScript, Rust fmt, strict Clippy, and `npm audit --audit-level=high`:
  passed.
- `cargo package --locked`: passed; 15 files, 54.4 KiB unpacked and 16.3 KiB
  compressed. A fresh `cargo install --path target/package/rehearsal-0.1.1`
  consumer reported `rehearsal 0.1.1` and completed a READY nine-check demo.
- Production bundle: JS 20,692 bytes / 7,362 gzip; CSS 13,071 bytes / 3,707
  gzip; hero image 70,902 bytes.

## Browser, accessibility, privacy, and update checks

- `verify-url.sh` against production: HTTP 200, 775ms network-idle load, no
  console errors, title/lang/main/alt/button checks passed.
- Axe scans of `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` at 1366px
  and 390px: zero serious or critical violations; no page or console errors.
- Live 200%-text check at 390px: viewport/document/body all 390px; header
  navigation starts below the wordmark; headline is 18–372px and primary
  action is 18–372px horizontally.
- Live touch targets: Privacy 183×44px, Terms 183×44px, standalone 404
  recovery link 284×44px.
- Keyboard: the visible skip link is first in tab order and jumps to `#main`.
  Existing route/focus and keyboard-action tests passed.
- Privacy: landing requests only the product origin and disclosed
  `https://api.github.com`; demo requests only the product origin. With the
  demo loaded, the browser was taken offline, reset, and reached READY.
- The product registers zero service workers. It is not a PWA, so
  service-worker update checks do not apply.
- Lighthouse production: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.8s, LCP 1.7s, CLS 0, TBT 70ms, 86 KiB transfer.

## Deployment and live identity

Deployed using:

```sh
/opt/fleet/lib/deploy-static.sh selfhost-upgrade-rehearsal /work/repo/dist/site
```

Azure deployment `fb1225bf-e1f8-4f3c-81d7-3bf66f44152a` succeeded. The custom
domain returned HTTPS 200 immediately after deployment.

Fresh local/live SHA-256 values match exactly:

| File | SHA-256 |
| --- | --- |
| `index.html` | `b21ccf516e606e74c18d4cee963d01be3304353fc806b59cc7276e5990589778` |
| `index-CFCSWkJP.js` | `9760a883fe82dbc0bf68a1b01d48eee3e73f0c75baf9ba0db8c0777914d83821` |
| `index-B9IVHe6m.css` | `11121e419759fcebec1e2ef15365e532cc1a82b0293f19fd6768672287419c83` |

`/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown route returns a
real HTTP 404. Production headers include HSTS, `nosniff`, strict-origin
referrer policy, restrictive permissions policy, the expected CSP (self plus
GitHub and Sociobot connections), HTML `max-age=30, must-revalidate`, and
immutable hashed assets.

## Known limits

- The CLI intentionally records vendor-declared memory/disk minimums; it does
  not measure customer host capacity.
- Docker, Podman, kubectl, and kind were unavailable in this worker. Shipped
  fixture hooks plus Compose/Kubernetes declaration coverage ran locally.
- No new platform-binary release was required because this repair changes only
  the static landing artifact; the tested packaged CLI remains `0.1.1`.
