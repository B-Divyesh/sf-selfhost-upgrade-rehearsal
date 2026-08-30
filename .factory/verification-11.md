# Independent verification 11 — FAIL

**Candidate commit:** `871da0650d35b1f628a868de820a437691753e57`  
**Live URL:** <https://selfhost-upgrade-rehearsal.sociobot.in>  
**Verified:** 2026-08-30 UTC

## Verdict

**FAIL.** The candidate passes its claim suite, build, CLI execution, deployment,
privacy, accessibility, performance, packaging, and rate-limit checks. However,
the customer-facing HTML readiness receipt omits the declared supported
environments and its corresponding scope limitation. The landing page tells
vendors to give customers this HTML receipt, so the shipped core artifact does
not meet the brief's requirement to separate tested scope from unsupported
environments.

## Cold first read

The mandatory first-read gate passes. The initial screen says **“Rehearse
upgrades before customers do”**, identifies self-hosted product teams preparing
Compose or Kubernetes releases, and makes **“Try it with sample data”** the
primary action. Adjacent copy says that it runs the bundled sample and opens its
receipt. The first screen also states demo upload privacy, offline-after-load
behavior, and the MIT status of the core CLI.

One click opens the isolated Arbor Desk 1.8.4 → 2.0.0 demo with an always-visible
demo disclosure, reset action, finished receipt, and JSON download.

## Mandatory claims gate — 47/47 commands passed

After `npm ci`, every exact `test` value in `.factory/claims.json` was invoked
separately and in manifest order. All 47 commands passed. The manifest existed,
and the run did not stop after individual tests.

Passed claim IDs:

`demo-receipt`, `offline-demo`, `demo-network-privacy`, `cli-receipts`,
`upgrade-hooks`, `declared-resource-minimums`,
`compose-kubernetes-declarations`, `installer-checksum`,
`installer-provenance-rollback`, `mit-core`, `schema-redaction`,
`customer-safe-receipt`, `temporary-workspace`, `argument-arrays`, `exit-codes`,
`unsigned-packages`, `cli-no-upload`, `team-kit-license`,
`declared-upgrade-path`, `customer-boundary`, `receipt-scope`,
`team-kit-price-scope`, `free-cli-formats`, `dodo-merchant-returns`,
`sociobot-checkout`, `published-platform-download`, `supported-platforms`,
`homebrew-tap`, `scoop-manifest`, `release-asset-set`, `path-placeholders`,
`receipt-contents`, `release-workflow`, `sample-demo-parity`,
`sociobot-license-api`, `no-embedded-payment-provider`,
`demo-storage-isolation`, `starter-templates`, `json-output`,
`release-metadata`, `license-browser-storage`, `no-card-collection`,
`dodo-checkout-processing`, `development-requirements`, `test-coverage`,
`site-build-output`, and `deploy-directory`.

The release-blocking defect below was not caught because
`@claim:receipt-scope` and `@claim:receipt-contents` inspect only
`readiness.json`; the HTML-format tests assert only that an HTML file exists and
contains a generic customer-safe label.

## Clean local gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 33 packages, 0 reported vulnerabilities |
| `npm test` | PASS; 5 Rust tests and 121 Playwright tests; 5 intentional project skips |
| `npm run lint` | PASS; rustfmt, Clippy with `-D warnings`, strict TypeScript |
| `npm run build` | PASS; release binary and `dist/site` produced |
| `cargo package --locked` | PASS; 15 files, 56.7 KiB unpacked, packaged crate verified |
| Clean consumer install | PASS; installed packaged `rehearsal 0.1.4` into an isolated `CARGO_INSTALL_ROOT` |

The exact production build emitted 22,948 bytes of JavaScript (7,795 gzip) and
13,411 bytes of CSS (3,788 gzip). The largest static asset is 70,902 bytes. No
third-party font or script is shipped.

## CLI and release exercise

- The installed packaged binary exposes useful `init`, `check`, `run`, and
  `demo` help and reports version 0.1.4.
- `demo --json` produced JSON and HTML receipts for Arbor Desk 1.8.4 → 2.0.0.
  The JSON receipt was `ready`, contained three schema changes, recorded 768 MB
  memory / 2,048 MB disk, and had nine passed checks.
- A normal declaration check and run exited 0. Zero memory, identical source and
  target versions, and a missing target schema each exited 2 with actionable
  errors.
- A deliberately failing health hook exited 1, produced a `not ready` receipt,
  and still ran cleanup. Correcting that hook and rerunning exited 0 with a
  `ready` receipt.
- The live installer installed the published Linux binary into a temporary
  target, printed successful SHA-256 verification before installation, and its
  demo completed successfully.
- Release `v0.1.4` contains Linux archives plus deb/rpm, macOS x86_64/aarch64
  archives and unsigned pkg files, Windows zip, Winget, Homebrew, Scoop,
  `SHA256SUMS`, and `latest.json` assets. The Linux x86_64 archive matched
  `d5ba325542908d43af0a02dda5361c9e432f04f10284bbf4f05a4ad1726846b7`.
  GitHub's attestation API returned one in-toto attestation for that digest.
- The live Homebrew formula is 0.1.4 with release-matching hashes. The documented
  Scoop repository uses Scoop's supported bare-bucket layout; its root manifest
  is 0.1.4 and matches the Windows release digest.

## Live deployment evidence

- Fresh `dist/site` bytes exactly matched production for the root, demo,
  privacy, terms, designed 404, hashed JS/CSS, installers, images, favicon,
  Apple icon, robots file, and sitemap. The deployed app therefore matches the
  candidate.
- Root HTML SHA-256: `34b1180adea3b7e81d2cd27395bd96bae1ff4bd041fe14e18208f7ae5c247a63`.
  JS SHA-256: `b40ba1b6b88c69f53e81df3505f748d1f322281f836f42f7da684d147c58e4dc`.
  CSS SHA-256: `a859dd42f754f7914d1907c3776801b378d1d35fc91618ee8985dede21032a5b`.
- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown
  route returned a real 404 with the designed recovery page. All internal and
  public external links tested successfully; checkout returned the expected
  303 to Dodo.
- The factory `verify-url.sh` passed in 796 ms with one H1, `lang=en`, a main
  landmark, complete alt text, labelled controls, and no valid-page console
  errors.
- Desktop and 390 px audits found no horizontal overflow, undersized rendered
  targets, or serious/critical Axe findings on any application route. Keyboard
  traversal reached all controls with a 3 px rust-colored focus outline. The
  skip link moved focus to `main`. Reduced-motion mode had no running page
  animations and reduced CSS transition durations to 0.01 ms.
- The generated receipt itself also had no serious/critical Axe findings and no
  390 px overflow.
- Mobile Lighthouse: Performance 97, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.8 s, LCP 1.7 s, TBT 180 ms, CLS 0, total transfer 87 KiB.
- Valid routes had no console or page errors. The only console network message
  observed on the intentional unknown route was the expected main-document 404.

## Privacy, headers, caching, and server boundary

- A fresh `/demo` flow requested only its same-origin HTML, JS, and CSS. All
  were bodyless GETs. No analytics, font, payment, project-data, or other
  third-party request occurred.
- Demo storage before reset was only
  `sessionStorage["demo:active"]`; reset left both storage areas empty.
- The ordinary landing page additionally requested the disclosed public GitHub
  release API and cached only that public response. An explicit invalid-license
  action sent one GET to the documented product-specific Sociobot verification
  endpoint and displayed the inactive-license recovery message.
- Response headers include HSTS, `nosniff`, strict-origin referrer policy,
  restrictive permissions policy, and a CSP limited to self plus the documented
  GitHub and Sociobot connection origins. HTML uses
  `max-age=30, must-revalidate`; hashed assets use
  `max-age=31536000, immutable`; conditional requests returned 304.
- From one client, license verification requests 1–30 returned 200 and request
  31 returned **429** with `Retry-After: 4`. Observed allowance: 30 requests per
  burst.
- The product requires no sign-in. Entra authority verification is therefore
  not applicable. It is a static CLI landing site, not a PWA or product backend,
  so service-worker update, server persistence, concurrency, and health/build
  endpoint checks are not applicable.

## Defects by severity

### Major — release blocking: customer HTML receipt omits supported-environment scope

The bundled declaration and JSON receipt say that Linux, macOS, and Windows on
x86_64/aarch64 are supported, distinguish the actual tested host as
Linux/x86_64, and include the limitation “Only the declared operating systems
and architectures are supported.” The generated `readiness.html` contains only:

> Arbor Desk was tested with sample demo on linux/x86_64.

Its Coverage limits section mentions only versions and omitted data. The HTML
contains none of `macos`, `windows`, `aarch64`, or the declared-environment
limitation. This is the format the landing page explicitly says to give to
customers. A macOS or ARM customer cannot determine from it whether their
environment is in the vendor's declared support set, contrary to the researched
brief and the public receipt-scope/receipt-contents promises.

Reproduction:

```sh
rehearsal demo --output /tmp/rehearsal-verification-11
jq '.tested_environment, .supported_environments, .limitations' \
  /tmp/rehearsal-verification-11/report/readiness.json
grep -E 'macos|windows|aarch64|declared operating systems' \
  /tmp/rehearsal-verification-11/report/readiness.html
```

The `jq` command prints the supported set and limitation; `grep` returns no
matches. Fix `receipt_html` to render tested and declared-supported environments
as separate fields and include the environment limitation. Strengthen the claim
tests to inspect both receipt formats.

No critical, moderate, or minor defects were found.

## Reproduce the main gates

```sh
npm ci
jq -r '.[].test' .factory/claims.json | while IFS= read -r test; do eval "$test" || exit 1; done
npm test
npm run lint
npm run build
cargo package --locked
```
