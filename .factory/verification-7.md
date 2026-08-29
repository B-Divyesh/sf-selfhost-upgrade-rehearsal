# Independent verification 7

## Result: PASS

Verified candidate commit `b427b102ea634d6116e69556c6b6ddef54c4b252` against
<https://selfhost-upgrade-rehearsal.sociobot.in> on 2026-08-29 UTC. The
deployment matches the candidate's product payload and satisfies the researched
brief: it provides a distributable local CLI for vendors to rehearse one
declared Compose or Kubernetes upgrade path, record schema/resource/check
evidence, and create a customer-safe readiness receipt without customer access.

## Cold first read and demo

Fresh cold-load evidence is in
`.factory/verification-7-artifacts/live-cold-read.json` and
`live-cold-desktop.png`. The first screen plainly says:

- **What:** “Rehearse upgrades before customers do.”
- **For whom:** self-hosted product teams releasing Compose or Kubernetes
  products.
- **What to click first:** “Try it with sample data,” with the adjacent
  explanation that it opens the bundled sample receipt.

The first-screen action is one click and meets the demo-sandbox requirement.
At `/?demo=1` and `/demo`, the real Arbor Desk 1.8.4 → 2.0.0 sample shows a
finished nine-check receipt, displays the persistent “Demo — sample data,
nothing is saved” banner, uses only `sessionStorage` key `demo:active`, and
downloads `arbor-desk-readiness.json`. “Start for real” clears the demo
namespace. The live demo flow made only same-origin requests and emitted no
console or page errors; see `live-demo-flow.json`.

## Claims gate

`.factory/claims.json` exists and lists 41 claims. Before installation, each
exact command was invoked from the raw clone as required; all stopped at the
shared site-build prerequisite because Node dependencies had not yet been
installed (`sharp` was unavailable). This is retained in
`claim-tests-before-install.log`.

After the required locked clean install (`npm ci`, zero audit
vulnerabilities), every exact manifest command was rerun independently against
the shipped demo entry points: **41 passed, 0 failed**. Evidence:
`claim-tests-after-install.log`. This includes receipt generation, offline
demo, demo request privacy, schema redaction, no-upload/customer boundaries,
Compose and Kubernetes declarations, exact exit codes, installers, release
assets, license/browser storage, payment boundary, and demo isolation.

## Local product and package verification

- `npm test`: **PASS** — 103 passed, 4 intentional platform-specific skips.
  It includes Rust unit/integration tests, desktop and mobile Playwright tests,
  claim tests, accessibility checks, 390 px checks, and 200% text resize.
- `npm run build`: **PASS** — release Rust binary and `dist/site` produced.
  Initial JS is 22,418 bytes raw / 7,600 bytes gzip; CSS is 13,227 bytes raw /
  3,750 bytes gzip, both comfortably within the static budget.
- `cargo fmt --check` and `cargo clippy --all-targets -- -D warnings`:
  **PASS**. No separate TypeScript lint/typecheck is configured in this
  repository.
- `cargo package --locked --allow-dirty`: **PASS**. A clean consumer install
  of the packed crate reported `rehearsal 0.1.2`; its demo emitted a schema-1,
  customer-safe Arbor Desk receipt with 9 passed checks and the declared
  768 MB/2,048 MB resource minima.
- The published Linux x86_64 release artifact was downloaded separately. Its
  SHA-256 is `baae9909cffe06c7d5a3ba0f0f50eb2c8678a02461eb89fe05c1e2f6152f3f3a`,
  matching the v0.1.2 `SHA256SUMS`; its real `demo` command, help, receipt,
  and non-empty-output recovery path were exercised. The published Homebrew
  formula and Scoop manifest also resolve and reference v0.1.2.

Representative normal, boundary, and recovery checks covered the sample demo,
both declared adapters, no-shell-parsing hook arguments, failed/invalid
declarations, refusal to overwrite a nonempty demo output directory (exit 2),
and a starter Compose declaration that explains its missing-schema next step.

## Live site, privacy, accessibility, and performance

- `/opt/fleet/lib/verify-url.sh` passed against production: HTTP 200,
  652 ms network-idle load, title/lang/one-H1/main/alt/button checks, and no
  console errors.
- Fresh Playwright + axe coverage at 1440 px and 390 px covered `/`, both demo
  routes, Privacy, Terms, and the real 404. All normal routes were 200, the
  unknown route was a deliberate 404, all had one H1 and a main landmark, no
  horizontal overflow, zero serious/critical axe findings (zero total axe
  findings), and no errors except the expected browser network message for
  directly loading the intentional 404. The skip link has a visible 3 px
  focus ring and correctly moves to `#main`; reduced-motion computed states
  have no animation.
- During complete demo use, outgoing requests were only to the same site;
  there are no third-party fonts, scripts, analytics, or customer-data uploads.
  Browser headers provide CSP, HSTS, `nosniff`, strict-origin referrer policy,
  and restrictive permissions policy. Hashed JS/CSS are cached for one year
  immutable; the sample image is cached one day.
- Live Lighthouse (mobile/default) was **100 Performance, 100 Accessibility,
  100 Best Practices, 100 SEO**: FCP 0.8 s, LCP 1.2 s, TBT 10 ms, CLS 0.
- The only server-side product integration is Sociobot license verification.
  From this client, 31 verification requests returned 200 and request 32
  returned **429** with `Retry-After: 3` and `X-RateLimit-After: 3`; observed
  allowance: 31 requests in this fresh window. The checkout endpoint is the
  product-specific Sociobot URL and returns a 303 to Dodo. No sign-in, product
  backend persistence, PWA service worker, or Entra surface exists, so those
  checks do not apply.

## Deployment identity

The candidate changes only factory evidence/handoff material after the last
product-source deployment. A fresh candidate build was compared byte-for-byte
with production: all 17 public payloads (HTML routes, assets, images,
installers, manifest, robots, and sitemap) matched. `staticwebapp.config.json`
correctly remains non-public and returns a 404. See `live-parity.log`.

## Defects by severity

None. No release-blocking, high, medium, or low product defects were found.

## Evidence

Fresh command/browser artifacts are retained in
`.factory/verification-7-artifacts/`, including claim logs, full-suite and
build logs, package/install records, release checksum, live request/header
captures, responsive/axe data, screenshots, Lighthouse output, rate-limit
capture, route-link results, and byte parity log.
