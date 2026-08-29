# Independent product verification 4

## Verdict: PASS

Candidate `6feca7140620f9b7573a9b5d99f9ff6355d63017` is releasable under the
supplied work order, researched brief, and attached product contracts.
Independent verification ran on 29 August 2026 UTC from the clean candidate
checkout against <https://selfhost-upgrade-rehearsal.sociobot.in>.

No release-blocking defect was found. The previous failures in
`.factory/verification-3.md` are repaired in the candidate and in production.

## Mandatory first-read gate: PASS

A cold 1440×900 browser with empty storage showed, without scrolling:

- What it does: **“Rehearse upgrades before customers do.”**
- Who it serves: **“For self-hosted product teams that need proof before each
  Compose or Kubernetes release.”**
- What to do first: **“Try it with sample data”**, next to **“Runs a complete
  synthetic upgrade and opens its receipt.”**

The action was visible at `y=669` and opened `/demo` in one click. The first
demo screen already contained the completed Arbor Desk 1.8.4 → 2.0.0 terminal
run, a READY receipt, nine passed checks, three schema changes, and the
persistent **“Demo — sample data, nothing is saved”** banner with **Reset
demo** and **Start for real**. Cold-load console and page error counts were
both zero. Screenshots were recorded at `/tmp/selfhost-live-cold.png` and
`/tmp/selfhost-live-demo.png`.

## Claims gate: PASS

`.factory/claims.json` exists and has 17 entries. After `npm ci`, every exact
manifest command was run separately and serially. Every command passed in
both its desktop and mobile Playwright projects; each claim ID occurs in
exactly one tagged test.

| Claim | Result |
| --- | --- |
| `demo-receipt` | PASS, 2 tests |
| `offline-demo` | PASS, 2 tests |
| `demo-network-privacy` | PASS, 2 tests |
| `cli-receipts` | PASS, 2 tests |
| `upgrade-hooks` | PASS, 2 tests |
| `declared-resource-minimums` | PASS, 2 tests |
| `compose-kubernetes-declarations` | PASS, 2 tests |
| `installer-checksum` | PASS, 2 tests |
| `mit-core` | PASS, 2 tests |
| `schema-redaction` | PASS, 2 tests |
| `customer-safe-receipt` | PASS, 2 tests |
| `temporary-workspace` | PASS, 2 tests |
| `argument-arrays` | PASS, 2 tests |
| `exit-codes` | PASS, 2 tests |
| `unsigned-packages` | PASS, 2 tests |
| `cli-no-upload` | PASS, 2 tests |
| `team-kit-license` | PASS, 2 tests |

The complete per-claim logs are in `/tmp/selfhost-claims.yz03ya`. A cross-check
of the live landing copy and README found the material promises represented by
the manifest tests. The resource wording correctly says the receipt records
vendor-declared minimums; it does not claim to measure host capacity.

## Clean local gates: PASS

The checkout began clean at the requested commit, and `origin/main` resolved
to the same SHA. These commands passed:

```sh
npm ci
npm test
# 5 Rust tests and 46 Playwright tests passed; one intentional desktop skip

npm run build
# optimized Rust binary plus dist/site

npx tsc --noEmit --strict --target es2022 \
  --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
# zero vulnerabilities

cargo package --locked
# 15 files; 54.4 KiB unpacked, 16.3 KiB compressed; verification passed
```

Gate logs are in `/tmp/selfhost-gates.BMPyeE`. The exact production bundle is
20,692 bytes JavaScript / 7,364 gzip, 13,071 bytes CSS / 3,712 gzip, and a
70,902-byte hero WebP. These are well below the supplied budgets.

## CLI, package, and recovery paths: PASS

The packaged crate was installed into a fresh consumer root with
`cargo install --path target/package/rehearsal-0.1.1 --root <temp> --locked`.
The consumer reported `rehearsal 0.1.1`; `--help` documented the public
commands; and `demo --output <empty-dir> --json` produced both JSON and HTML
receipts. The JSON had schema 1, READY status, nine passed checks, three
configuration changes, declared 768 MB / 2,048 MB resources, all documented
schema fields, and `customer_safe: true`.

Independent boundary and recovery evidence:

- declared 1 MB memory / 1 MB disk: READY and recorded exactly;
- declared `u64::MAX` memory / disk: READY and recorded exactly, consistent
  with the product's declaration-only resource contract;
- zero memory: exit 2 with “resource minimums must be greater than zero”;
- failed preflight: exit 1, later normal hooks marked `not run`, cleanup still
  ran and passed, and the receipt said `not ready`;
- missing declaration, unknown command, incomplete Compose/Kubernetes starter,
  and non-empty demo destination: exit 2 with a specific recovery message;
- a sentinel in the non-empty destination was not overwritten.

The generated HTML receipt had `lang=en`, one H1, one main landmark, no
390px overflow, no console/page errors, and zero axe violations.

## Release and installers: PASS

GitHub release `v0.1.1` is published. Its successful release workflow contains
Linux x86_64/aarch64 archives, macOS x86_64/aarch64 archives and unsigned
packages, Windows zip, `.deb`, `.rpm`, Homebrew, Scoop, Winget, `latest.json`,
and `SHA256SUMS`. The release predates only site/test/report changes: candidate
and tag have identical `src/lib.rs` and `src/main.rs` hashes.

The Linux x86_64 archive matched `SHA256SUMS`; its binary reported 0.1.1 and
completed the nine-check READY demo. `latest.json` parsed with URLs for all
five published platform builds. The Homebrew tap exists at
`B-Divyesh/homebrew-selfhost-upgrade-rehearsal` and contains the 0.1.1 formula.

The live one-line shell installer was run with an isolated install directory.
It printed checksum success before installation, installed version 0.1.1, and
the installed binary completed a nine-check READY demo. `install.sh` also
passed `sh -n`.

## Live identity, routes, headers, and caching: PASS

Fresh local and live artifacts match byte-for-byte:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `b21ccf516e606e74c18d4cee963d01be3304353fc806b59cc7276e5990589778` |
| `index-CFCSWkJP.js` | `9760a883fe82dbc0bf68a1b01d48eee3e73f0c75baf9ba0db8c0777914d83821` |
| `index-B9IVHe6m.css` | `11121e419759fcebec1e2ef15365e532cc1a82b0293f19fd6768672287419c83` |
| `specimen-upgrade.webp` | `278b1f35e76f0680afcbb9b96914f6d3ba33d4500e0c48e37e961945de8d560e` |
| `og-card.webp` | `7f1ddb589b4cd28193080c3e041c8882638b7282bd3ad7ed01321c0248e7ee97` |
| `install.sh` | `40e965f4056bea2048c59b58a820adbecb280ddf716fe6cb5f9c94ba10319547` |
| `install.ps1` | `7c97f02e16527f9885c105e309b664aae1747954dc0f3628983a05acde991ae8` |

`/`, `/demo`, `/privacy`, and `/terms` return HTTP 200. An unknown path returns
a designed real HTTP 404 with a 284×44px recovery action. All landing links
resolve: internal routes return 200, the release asset returns its expected
download redirect, checkout returns 303, and the factory link returns 200.

Production sends HSTS, `nosniff`, strict-origin referrer policy, restrictive
camera/microphone/geolocation policy, and the expected CSP. HTML is
`public, must-revalidate, max-age=30`; hashed JS/CSS is one-year immutable;
the hero image is cached for one day.

## Browser, accessibility, privacy, and performance: PASS

Independent sweeps covered `/`, `/demo`, `/privacy`, `/terms`, and an unknown
route at 1440×900 and an exact 390×844 CSS viewport. Product routes had
route-specific titles, `lang=en`, one H1, one main landmark, header/nav/footer,
no missing alt text, no horizontal overflow, no undersized interactive target,
no application console/page error, and zero axe serious or critical findings.
The expected browser resource message for the intentional HTTP 404 document
was not an application exception.

At 390px with root text set to 32px, viewport/document/body widths remained
390px. The header was 390px wide; H1 and primary action remained within
`x=18..372`. An iPhone user agent received the correct calm desktop-only
download message instead of a desktop binary.

Keyboard traversal starts with the visible skip link, whose 3px rust-orange
focus outline is present. Activating it moves the sequential focus point into
main content; the next Tab reaches the primary demo action. Route links move
focus to the destination H1, and back navigation restores the route and H1
focus. The terminal control works with keyboard activation. Empty license
submission returns focus to the labelled field and announces the recovery
message through `aria-live=polite`. No keyboard trap was found.

With `prefers-reduced-motion: reduce`, scroll behavior is `auto` and the
maximum animation/transition duration is 0.01 ms. All rendered controls are at
least 44px in both browser sizes.

The landing requests only the product origin and disclosed GitHub release
metadata. A fresh demo load, Reset demo, offline completion, and receipt
download use only same-origin resources. Demo storage contained only
`sessionStorage["demo:active"]`; Start for real removed it. No analytics,
trackers, remote fonts, project upload, AI endpoint, or service-worker
registration was present.

The real invalid-license flow stored the returned token at
`sb_license:selfhost-upgrade-rehearsal`, removed it from the URL, showed
“License no longer active,” kept the Team download locked, retained that
notice after reload, and made no second verification request inside the daily
cache window. Checkout returns HTTP 303 to Dodo hosted checkout.

The product verification endpoint accepted 30 requests from one client in a
fresh window. Request 31 returned HTTP 429 with `Retry-After: 3`. Evidence is
in `/tmp/rehearsal-rate-clean.Gvhmmi`.

`/opt/fleet/lib/verify-url.sh` passed production with HTTP 200, a 951ms
network-idle load, correct title/lang/H1/main/alt/button checks, and zero
console errors. Lighthouse produced Performance 99, Accessibility 100, Best
Practices 100, and SEO 100, with FCP 0.86s, LCP 1.28s, TBT 95ms, CLS 0, and
88,129 transferred bytes. Lighthouse emitted its known post-audit browser-tab
crash while collecting a non-scoring artifact, but wrote the complete scored
report to `/tmp/selfhost-lighthouse.json`; direct Playwright and axe runs were
clean.

## Documentation, design, and applicability: PASS

README, MIT LICENSE, CHANGELOG, privacy/terms routes, demo documentation,
claim manifest, copy audit, release workflow, package-manager manifests, and
handoff are present. The live visual system matches `.factory/design.md`: a
distinct herbarium field-guide palette, system serif/monospace pairing,
8px-based spacing, restrained inspection motion, and documented original
art. No third-party font or script is loaded.

This product has no sign-in, product backend, backend persistence surface, or
PWA service worker. Entra, backend concurrency/persistence, and service-worker
update tests do not apply. Docker, Podman, kubectl, and kind were unavailable
in the verifier container, so a real container engine/cluster was not
launched. The installed fixture exercised every hook phase, and the suite
covered valid Compose and Kubernetes declarations.

## Findings by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

