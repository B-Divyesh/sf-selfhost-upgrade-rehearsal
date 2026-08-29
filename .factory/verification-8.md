# Independent verification 8

## Result: PASS

Verified candidate commit `807fe62879d454783bbc639c33550eec23dff21f` against
<https://selfhost-upgrade-rehearsal.sociobot.in> on 2026-08-29 UTC. This is a
fresh verification, not a reliance on the earlier deployment report.

The candidate meets the researched job: a vendor can install a local CLI,
declare one Compose or Kubernetes source-to-target path, run isolated hooks,
compare schemas without values, record declared memory/disk minimums, and
produce customer-safe JSON and HTML readiness receipts. It does not connect to
or change a customer installation.

## Cold first read and demo: PASS

Cold-load Playwright evidence at 1440×900 found HTTP 200, no console errors,
and the first screen states all three required facts in plain words:

- **What it does:** “Rehearse upgrades before customers do.”
- **For whom:** self-hosted product teams releasing Compose or Kubernetes
  products.
- **What to click:** “Try it with sample data,” immediately followed by
  “Runs the bundled sample demo and opens its receipt.”

That action is one click to `/?demo=1`. The resulting Arbor Desk 1.8.4 →
2.0.0 receipt shows 9 passed checks, resource minimums, config changes,
supported environments, limitations, and a downloadable JSON receipt. The
persistent banner says “Demo — sample data, nothing is saved” and provides
Reset demo and Start for real. At 390×844 there was no horizontal overflow;
the h1 and primary action were fully in bounds.

## Mandatory claims gate: PASS

`.factory/claims.json` exists with 41 entries. From the clean candidate clone,
after `npm ci`, I ran every listed exact command:

```sh
npm test -- --grep @claim:<id>
```

All 41 completed successfully; the sequential command loop stops on the first
failure and reached the final `@claim:dodo-checkout-processing` claim. The
final Playwright result was `{"status":"passed","failedTests":[]}`.

This covers the observable demo receipt/offline/privacy behavior; CLI receipt,
redaction, argument-array, exit-code, resource, and boundary behavior;
release/installer/package-manager claims; browser storage/license/payment
claims; and release workflow and sample parity. No claims manifest was missing
and no claim test failed.

## Clean local build, tests, and CLI: PASS

- `npm ci`: passed, 0 dependency audit vulnerabilities.
- `npm test`: passed. Rust ran 1 unit + 4 integration tests; Playwright ran
  103 tests with 4 expected project skips. This includes 390px, 200% text,
  accessibility, offline-demo, and complete claim coverage.
- `npm run build`: passed, producing the release binary and `dist/site`.
- `cargo package --locked --allow-dirty`: passed, creating
  `target/package/rehearsal-0.1.3.crate`.
- No separate lint or TypeScript type-check script is configured in
  `package.json`.

Independent CLI exercises:

- `rehearsal init compose` and `rehearsal init kubernetes` wrote templates and
  correctly explained that schemas/hooks must be added.
- `check --file examples/arbor-desk/rehearsal.yml --json` validated the sample
  declaration. With the installed binary on `PATH`, `run` completed all nine
  sample hook phases and returned a `ready` receipt.
- An invalid declaration returned exit code 2 with a concrete missing-field
  recovery message. The ordinary browser and CLI tests also covered failed
  checks (exit 1), no shell interpolation, nonempty demo output recovery, and
  customer-path hostility.
- A fresh consumer unpacked the generated `.crate`, ran `cargo install --path
  ... --root ... --locked`, then executed `rehearsal demo --json`: schema 1,
  `Arbor Desk`, `ready`, 9 checks.

## Published installer and release: PASS

Downloaded GitHub release `v0.1.3` asset
`rehearsal-linux-x86_64.tar.gz` plus `SHA256SUMS`. `sha256sum -c` returned OK.
The extracted binary's `--help` exposed the documented init/check/run/demo
commands and `demo --json` emitted a ready customer-safe Arbor Desk receipt
with 9 checks. The GitHub release API exposed Linux tarballs, deb/rpm,
unsigned macOS pkg/tarballs, Windows zip, Scoop, Winget, Homebrew formula,
checksums, and `latest.json` as documented.

## Live deployment identity, privacy, and security: PASS

The locally rebuilt candidate and production were SHA-256-equal for:

| File | Match |
| --- | --- |
| `index.html` | yes |
| `assets/index-BVLW8lZk.js` | yes |
| `assets/index-BFP1aa3d.css` | yes |
| `specimen-upgrade.webp` | yes |
| `latest.json` | yes |

The production route set was exercised directly: `/`, `/?demo=1`, `/demo`,
`/privacy`, and `/terms` returned 200 and each had its route-specific title,
one h1, and one main landmark. An unknown route returned the designed 404
with 404 status, a title, h1, main landmark, and recovery link.

Complete demo flows at 1440×900 and 390×844 had no console or page errors,
zero serious/critical axe findings, no horizontal overflow, and only
same-origin outgoing requests. The first Tab reaches the visible “Skip to
main content” control; keyboard actions operated the demo and receipt controls.
Reduced motion calculated the receipt animation duration as `0.01ms`.

Headers on the live HTML routes include CSP with `frame-ancestors 'none'`,
HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a
restrictive permissions policy. The hashed JS/CSS have
`Cache-Control: public, max-age=31536000, immutable`; the hero WebP is cached
for one day. Browser resource logging found only same-origin JS, CSS,
`latest.json`, and the local WebP. There were no service worker registrations,
third-party fonts, analytics, or customer-data uploads.

The real invalid-license form flow sent only one request to the documented
product-specific Sociobot verify endpoint, hid the paid download, and showed
“License no longer active. You can buy a new license.” without console errors.
The client-side checkout link resolves to the required product endpoint; a
HEAD request returned 303 to hosted Dodo checkout, with no embedded payment
client in the product.

## Endpoint allowance: PASS

The only server-side product integration is Sociobot license verification.
From this verifier client, requests 1–30 with fresh invalid license values
returned HTTP 200. Request 31 returned **429** and included
`Retry-After: 0`. Observed allowance: **30 requests per client window**. This
meets the required 429 plus Retry-After behavior. There is no product backend,
persistence boundary, sign-in/Entra flow, or PWA service worker to test.

## Performance and accessibility: PASS

Fresh live Lighthouse using Playwright's installed Chromium headless shell:

| Metric | Result |
| --- | ---: |
| Mobile performance | 100 |
| Accessibility | 100 |
| LCP | 1,307 ms |
| CLS | 0 |
| Initial JavaScript | 22,418 B raw / 7,633 B gzip |
| Initial CSS | 13,227 B raw / 3,759 B gzip |

The static budget is comfortably below 200 KB JavaScript and 50 KB CSS. The
site uses system fonts (zero font assets) and the 70,902-byte hero image is
below the 300 KB mobile budget.

## Defects by severity

None found.

There are no release-blocking, high, medium, or low product defects from this
verification. The earlier deployment-only concern is not reproduced: the
fresh live payload exactly matches this candidate's rebuild and all required
flows complete.
