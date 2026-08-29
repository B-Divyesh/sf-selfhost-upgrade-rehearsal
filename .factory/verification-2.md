# Independent product verification 2

## Verdict: FAIL

Candidate `d7e2a51445bfc0386aef991d662e2382cd1638f0` was independently verified on
29 August 2026 UTC from a clean clone against
<https://selfhost-upgrade-rehearsal.sociobot.in>. It is not releasable under
the supplied acceptance contract because the live landing page has a 390px
mobile horizontal-overflow regression (HIGH-1 below). The deployed application
assets exactly match this candidate's freshly built assets, so this is a
candidate defect, not a stale deployment.

The previous verification report remains in `.factory/verification.md`; this
is the requested follow-up report.

## Mandatory first read

**PASS.** A cold, no-storage desktop load said:

- What it does: “Rehearse upgrades before customers do.”
- Who it is for: “self-hosted product teams that need proof before each
  Compose or Kubernetes release.”
- What to click: **Try it with sample data**, with the adjacent explanation
  “Runs a complete synthetic upgrade and opens its receipt.”

The first-screen action opens `/demo` in one click. The sample is the bundled
Arbor Desk 1.8.4 → 2.0.0 upgrade and immediately shows the rehearsal terminal
and readiness receipt. The demo banner says that it is sample data and nothing
is saved.

## Release-blocking finding

### HIGH-1 — 390px landing page has a 260px horizontal overflow

In a fresh Chromium page with a real 390×844 CSS viewport, after the normal
release-metadata response, the live landing page reports:

```text
window.innerWidth: 390
document.documentElement.scrollWidth: 650
document.body.scrollWidth: 650
```

The overflow begins at the `#install` grid. Its `.section-heading`,
`.install-card`, and `.usage-note` render 632px wide (`left: 18`, `right: 650`)
even though the mobile media rule selects a one-column grid. This leaves a
260px horizontal scroll area and violates the required 390px mobile rendering
and “content never hides behind fixed bars / no viewport overflow” contract.

The product's Playwright `mobile` project did pass, but it inherits the
`iPhone 13` descriptor and reports `window.innerWidth: 650` after navigation;
therefore its `scrollWidth <= innerWidth` assertion does not test the promised
390 CSS-pixel width. An iPhone user-agent correctly receives the calm
desktop-download state, but that does not repair the direct 390px layout
failure. Make the install grid tracks shrinkable at 390px (and add a true
390-CSS-pixel no-overflow regression test) before release.

## Claims gate

**PASS.** `.factory/claims.json` exists and contains 16 claims. After a clean
`npm ci`, every command listed in the manifest was run exactly as declared,
serially, through the product test/demo entry point. All passed (the last
Playwright result reports `status: "passed"`, no failed tests).

| Claim | Result |
| --- | --- |
| `demo-receipt` | PASS |
| `offline-demo` | PASS |
| `demo-network-privacy` | PASS |
| `cli-receipts` | PASS |
| `upgrade-hooks` | PASS |
| `compose-kubernetes-declarations` | PASS |
| `installer-checksum` | PASS |
| `mit-core` | PASS |
| `schema-redaction` | PASS |
| `customer-safe-receipt` | PASS |
| `temporary-workspace` | PASS |
| `argument-arrays` | PASS |
| `exit-codes` | PASS |
| `unsigned-packages` | PASS |
| `cli-no-upload` | PASS |
| `team-kit-license` | PASS |

## Local build, test, and package evidence

All of these passed from the clean candidate:

```sh
npm ci
npm test                         # 39 passed, 1 intentional desktop-only skip
npm run build                    # release binary plus dist/site
npx tsc --noEmit --strict --target es2022 --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high     # zero vulnerabilities
cargo package --locked           # 15 intended files; verification passed
```

The normal CLI path was exercised with the release build:
`rehearsal demo --output <empty-dir> --json` returned a schema-1, `ready`,
customer-safe receipt with nine passed checks, three configuration changes,
and both JSON and HTML reports. `rehearsal init compose` and `init kubernetes`
write starter declarations; checking the incomplete compose starter safely
returns exit code 2 with “config schema … was not found.” Existing claim tests
also exercise both valid Compose/Kubernetes declarations, failing hooks,
invalid declarations, schema secret redaction, shell metacharacters, and
recovery exit codes.

The packed crate was installed into a fresh consumer root with
`cargo install --path target/package/rehearsal-0.1.1 --root <fresh> --locked`.
Its public `--version` reported `rehearsal 0.1.1`; its `demo --json` reported
`ready`, schema 1, and nine checks. The published Linux x86_64 archive was
also downloaded, its SHA256 matched `SHA256SUMS`, and its contained binary ran
the same ready nine-check demo.

## Live deployment, privacy, and browser evidence

- Fresh local `dist/site/assets/index-Cu4z8XBx.js` and live JS SHA256:
  `6b363e4018d254198e5e22d32053b5a397cf6acbd8729401b8d1cb63f18add0a`.
  Fresh/local and live CSS SHA256 also match:
  `08b91a9626393ca323fefed3af95ccf796dc8b832c0712c1b0fb7e796ffae0cf`.
- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns
  a real 404. Each inspected product route has `lang=en`, one H1, one main
  landmark, a route-specific title, no missing image alt, no page/console
  errors, and no axe serious or critical findings at desktop or the configured
  mobile browser context.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, 683ms network-idle load,
  no console errors, title/lang/H1/main/alt checks passed.
- Keyboard-only inspection found the skip link and every sampled interactive
  control reachable with a visible 3px orange focus outline. Enter starts the
  demo recording. Empty license submission returns focus to the input and the
  polite live region says “Paste a license token, then verify it.”
- With reduced motion, computed scroll behavior is `auto` and animations
  resolve to the reduced 0.00001s duration.
- A fresh landing load makes only same-origin document/JS/CSS/image requests
  plus the disclosed GitHub release-metadata request. A fresh `/demo` load,
  Reset demo, and JSON download make only same-origin document/JS/CSS
  requests: no project data, analytics, trackers, fonts, or AI endpoints.
- Response headers include HSTS, `nosniff`, strict-origin referrer policy,
  restrictive permissions policy, and a CSP permitting only self plus the
  documented GitHub/Sociobot connections. HTML is `max-age=30,
  must-revalidate`; hashed JS/CSS is `max-age=31536000, immutable`.
- Asset budgets pass: JS 20,535 bytes raw / 7,284 gzip; CSS 12,630 / 3,609;
  hero WebP 70,902 bytes. These are below the static-product budgets.
- The live Team checkout returns HTTP 303 to a Dodo hosted checkout. Product
  license verification allowed 30 requests from one client and request 31
  returned HTTP 429 with `Retry-After: 3`, as required.
- There is no sign-in, backend persistence surface, or service worker; Entra,
  backend-concurrency, and PWA-update checks are not applicable. Docker,
  Podman, kind, and kubectl were unavailable in this verifier container, so
  real container/cluster launch was not performed; the shipped fixture hooks
  and both declaration adapters were covered by the test suite.

## Required fix and re-verification scope

1. Fix the 390px `#install` grid overflow and add a test using an actual
   390-CSS-pixel context, not a device descriptor whose layout viewport is
   650px.
2. Re-run the full claims manifest, `npm test`, production build, and the
   live desktop/390px browser sweep after deployment.
