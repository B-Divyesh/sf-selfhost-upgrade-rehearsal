# Independent product verification 5

## Verdict: FAIL

Candidate `7a04119fed54d3a75112cc67116370e21a4dea0c` is not releasable under the supplied work order and attached acceptance contracts. Independent verification ran on 29 August 2026 UTC against <https://selfhost-upgrade-rehearsal.sociobot.in> from the candidate checkout.

The previously reported deployment-only concern is not present: production is available and its HTML, JavaScript, CSS, images, installers, and release manifest match the candidate build byte-for-byte. The release is blocked by two independently reproduced UI contract defects:

1. The required three plain facts do not all fit in the first desktop screen.
2. The standalone 404 page has a linked wordmark whose touch target is only 38 px high, below the mandatory 44 px minimum.

No product code was changed during verification.

## Findings by severity

### Critical

None.

### High

None.

### Medium — release blocking

#### M1. The required three facts are not all visible in the first desktop screen

The plain-words contract requires the first screen to contain three short facts. On a cold live load:

- At 1440×900, fact 3 occupies `y=886..923`; only 14 of its 37 pixels are inside the viewport.
- At 1366×768, all facts begin below or cross the fold: `y=766..803`, `803..867`, and `867..905`.
- The required what/who/first-action content is visible, and the one-click sample action works, so the work order's narrower explicit first-read hard gate passes. The attached three-fact first-screen contract does not.

Evidence: `verification-artifacts/first-screen-geometry.json` and `verification-artifacts/live-cold-desktop.png`.

#### M2. The real 404 page has a 38 px linked wordmark target

The accessibility and site-structure contracts require every touch/click target to be at least 44×44 CSS pixels. On the live HTTP 404 page, the linked `Upgrade Rehearsal` wordmark measures:

- desktop: 131×38 px;
- 390 px mobile: 126×38 px.

All other rendered route targets passed the same sweep. Axe reports no serious/critical violation because this product-specific 44 px requirement is stricter than the rule axe applies here.

Evidence: `verification-artifacts/live-browser-audit.json`.

### Low

None.

## Mandatory first-read gate: PASS

A fresh 1440×900 browser context with empty storage showed:

- what it does: “Rehearse upgrades before customers do”;
- who it serves: “For self-hosted product teams that need proof before each Compose or Kubernetes release”;
- what to click: “Try it with sample data”.

The action is visible at `y=669..737` and enters `/?demo=1` in one click. The first demo screen contains the Arbor Desk 1.8.4 → 2.0.0 sample, its persistent demo banner, Reset demo, Start for real, and a READY receipt. The downloaded JSON contains nine passed checks, three schema changes, and `customer_safe: true`. No external request occurs during the demo flow.

Cold-load console errors: 0. Page errors: 0.

## Claims gate: PASS after clean install

`.factory/claims.json` exists with 41 entries. Each ID occurs in exactly one tagged test declaration and there are no extra claim tags.

Before any repository inspection, every exact manifest command was invoked in the raw clone as requested. Since the clone had no `node_modules`, each command stopped in the common site-build prerequisite with `ERR_MODULE_NOT_FOUND: sharp`; no tagged test ran. After the required clean `npm ci`, all 41 exact commands were rerun separately and passed. The installed result is the acceptance result; both attempts were retained in the verification record.

Passing claim IDs:

`demo-receipt`, `offline-demo`, `demo-network-privacy`, `cli-receipts`, `upgrade-hooks`, `declared-resource-minimums`, `compose-kubernetes-declarations`, `installer-checksum`, `mit-core`, `schema-redaction`, `customer-safe-receipt`, `temporary-workspace`, `argument-arrays`, `exit-codes`, `unsigned-packages`, `cli-no-upload`, `team-kit-license`, `declared-upgrade-path`, `customer-boundary`, `receipt-scope`, `team-kit-price-scope`, `free-cli-formats`, `sociobot-merchant`, `sociobot-refunds`, `sociobot-checkout`, `published-platform-download`, `homebrew-tap`, `scoop-manifest`, `release-asset-set`, `receipt-contents`, `release-workflow`, `sample-demo-parity`, `sociobot-license-api`, `no-embedded-payment-provider`, `demo-storage-isolation`, `starter-templates`, `json-output`, `release-manifest`, `license-browser-storage`, `no-card-collection`, and `dodo-checkout-processing`.

Complete installed-run evidence: `verification-artifacts/claims-after-install.log` (`CLAIMS TOTAL=41 FAILURES=0`). The platform-download claim passed on desktop and intentionally skipped its mobile project because mobile shows the documented desktop-only state.

## Clean local quality gates

The checkout started at the requested candidate; `origin/main` resolved to the same SHA.

Passed commands:

```sh
npm ci
npm test
# 5 Rust tests; 97 Playwright tests passed; 2 intentional project-specific skips

npx tsc --noEmit --strict --target es2022 \
  --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
# 0 vulnerabilities

npm run build
# optimized Rust binary and dist/site

cargo package --allow-dirty
# 15 files; 54.6 KiB unpacked, 16.4 KiB compressed; package verification passed

sh -n site/public/install.sh
```

Production build sizes:

- JavaScript: 21,607 bytes raw / 7.43 KB gzip;
- CSS: 13,071 bytes raw / 3.70 KB gzip;
- hero WebP: 70,902 bytes;
- Open Graph WebP: 57,158 bytes.

These are well below the supplied budgets. `dist/site/` was produced.

## CLI, package, boundaries, and recovery

The packaged crate was installed into a fresh consumer root with `cargo install --path target/package/rehearsal-0.1.2 --root <temp> --locked`. The installed public CLI reported `rehearsal 0.1.2`; its help listed `init`, `check`, `run`, and `demo`; and its demo produced parseable JSON plus HTML.

The normal receipt was READY for Arbor Desk 1.8.4 → 2.0.0 with nine checks, three schema changes, declared 768 MB memory / 2,048 MB disk, and `customer_safe: true`.

Independent boundary and recovery cases:

- zero memory: exit 2 and “resource minimums must be greater than zero”;
- equal source and target versions: exit 2 and “choose an actual upgrade path”;
- `u64::MAX` declared memory and disk: accepted and recorded exactly, consistent with the declaration-only contract;
- failed preflight: exit 1, status `not ready`, later normal hooks `not run`, cleanup still passed;
- missing declaration: exit 2 with the missing path;
- unknown command: exit 2 with usage and `--help` recovery;
- non-empty demo destination: exit 2, sentinel unchanged.

The generated HTML receipt has `lang=en`, one H1, one main landmark, no 390 px overflow, no console/page errors, and zero axe violations.

Evidence: `verification-artifacts/cli-consumer-install.log`, `cli-boundaries.log`, and `receipt-accessibility.json`.

## Release and installers

GitHub release `v0.1.2` is published with Linux x86_64/aarch64 archives, macOS x86_64/aarch64 archives and unsigned packages, Windows zip, `.deb`, `.rpm`, Scoop, Winget, Homebrew formula, `latest.json`, and `SHA256SUMS`.

The independently downloaded Linux x86_64 archive hash was `baae9909cffe06c7d5a3ba0f0f50eb2c8678a02461eb89fe05c1e2f6152f3f3a`, exactly matching `SHA256SUMS`; its binary reported 0.1.2. The live shell installer was run into an isolated directory, printed checksum success before installation, installed 0.1.2, and completed a nine-check READY demo. Candidate CLI source, manifests, lockfile, and templates are unchanged since the release tag.

Evidence: `verification-artifacts/live-release.log` and `cli-consumer-install.log`.

## Live identity, routes, links, headers, and caching

Live and local SHA-256 values match for `index.html`, the hashed JS and CSS, both WebP assets, both installers, and `latest.json`. Production therefore matches the candidate build, not a stale deployment.

`/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown path returns the designed HTTP 404. Internal links return their expected statuses; the release asset returns its expected GitHub redirect; Sociobot checkout returns 303 to hosted Dodo checkout; and the external factory link returns 200.

Production sends HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation restrictions, and the expected CSP. HTML and `latest.json` use `public, must-revalidate, max-age=30`; hashed JS/CSS use one-year immutable caching; the hero uses one-day caching.

Evidence: `verification-artifacts/live-headers-and-parity.log` and `live-links.json`.

## Browser, accessibility, privacy, and performance

Independent live sweeps covered landing, both demo URLs, Privacy, Terms, and a real 404 at 1440×900 and 390×844. Product routes have route-specific titles, `lang=en`, one H1, one main, no overflow, no application console/page error, and zero axe serious/critical findings. The browser's expected failed-resource message for the intentionally requested HTTP 404 is not an application exception.

Keyboard traversal starts at the skip link with a 3 px rust focus ring. Enter targets `#main`; the next Tab reaches the primary sample action. Reduced motion matches and caps animation and transition duration at 0.01 ms with auto scrolling. An iPhone user agent receives the calm desktop-only download state and no desktop binary link.

The offline-after-load demo resets and reaches READY. Its requests are same-origin only. Start for real removes the demo key. The real invalid-license flow strips the token from the URL, stores only the namespaced token and daily verdict, shows the inactive notice, keeps the paid download hidden, and makes no second verify request after reload. There are no service-worker registrations, analytics, trackers, third-party fonts/scripts, or project-data uploads.

The product license endpoint allows 30 requests per client window. Request 31 returned HTTP 429 with `Retry-After: 3` and `X-RateLimit-After: 3`.

`/opt/fleet/lib/verify-url.sh` passed production: HTTP 200, 787 ms network-idle load, correct title/lang/H1/main/alt/button checks, and zero errors.

Lighthouse mobile results:

- Performance: 99;
- Accessibility: 100;
- Best Practices: 100;
- SEO: 100;
- FCP: 0.94 s;
- LCP: 1.03 s;
- TBT: 127.5 ms;
- CLS: 0;
- transferred bytes: 84,392.

Evidence: `verification-artifacts/live-browser-audit.json`, `live-state-privacy.json`, `license-rate-limit.log`, `verify-url/verify.json`, and `lighthouse-summary.json`.

## Documentation, design, and applicability

README, MIT LICENSE, CHANGELOG, privacy/terms routes, demo documentation, claim manifest, copy audit, design thesis, release workflow, package-manager manifests, and handoff exist. The deployed herbarium field-guide palette, serif/monospace pairing, asymmetric layout, original botanical art, and restrained motion match `.factory/design.md`. No third-party font or runtime script is loaded.

There is no sign-in, product backend, backend persistence surface, or PWA service worker. Entra, backend concurrency/persistence, and service-worker update testing do not apply. The only server-side product integration is Sociobot billing/license verification; its allowance was verified above. Docker, Podman, kubectl, and kind are unavailable in this verifier container, so a real container engine or cluster could not be launched. The packaged fixture and test suite exercised all hook phases and both declaration adapters.

## Required repair before acceptance

1. Fit all three plain facts entirely inside common desktop first viewports without hiding or shrinking the required content below legibility.
2. Increase the standalone 404 wordmark link's actual clickable height to at least 44 CSS pixels at desktop and 390 px mobile.
3. Add regression assertions for both geometries, then rerun every claim command, the full suite, live parity, and the affected viewport checks.
