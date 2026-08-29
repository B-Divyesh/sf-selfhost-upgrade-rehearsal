# Independent product verification 3

## Verdict: FAIL

Candidate `41e4347260f74e5c916dfa72f753f4c13e0f3a47` was independently
verified on 29 August 2026 UTC against
<https://selfhost-upgrade-rehearsal.sociobot.in>. The deployment exactly
matches the candidate's freshly built site, but the candidate is not
releasable under the supplied acceptance contract.

The release blockers are:

1. The public metadata promises resource checks that the CLI does not run,
   and `.factory/claims.json` has no resource-check claim or test.
2. At 200% text size, the 390px landing page expands to 484px, clips the
   headline and primary action, and overlaps the header navigation.
3. The 404 recovery action is only 21px high, below the required 44px touch
   target. The Privacy and Terms email links are also only 19px high.

The prior reports remain in `.factory/verification.md` and
`.factory/verification-2.md`. This is the requested follow-up report.

## Mandatory first read: PASS

A cold browser with no stored state answers all three questions on the first
screen, on desktop and at 390×844 CSS pixels:

- What it does: “Rehearse upgrades before customers do.”
- Who it is for: “self-hosted product teams that need proof before each
  Compose or Kubernetes release.”
- What to click: **Try it with sample data**. Adjacent copy says it runs a
  complete synthetic upgrade and opens the receipt.

The action is visible at `y=496` in the 844px-tall mobile viewport. One click
opens `/demo`, which immediately shows Arbor Desk 1.8.4 → 2.0.0, a completed
terminal run, a nine-check readiness receipt, and the persistent “Demo —
sample data, nothing is saved” banner with **Reset demo** and **Start for
real**.

## Release-blocking findings

### HIGH-1 — Public “resource checks” claim is unlisted and not implemented

`site/index.html` makes this Open Graph and Twitter claim:

> Run backup, restore, health, config, and resource checks before a customer
> upgrades.

There is no resource-check entry in `.factory/claims.json`. Source inspection
shows that the CLI only rejects zero values and copies vendor-declared
`memory_mb` and `disk_mb` into the receipt. It does not measure use, compare
the declaration with host capacity, or execute a resource check.

Fresh boundary runs confirmed the gap. Compose declarations with nine no-op
hooks produced `status: ready` and nine passed checks with both of these
declared resource sets:

```text
memory_mb=1, disk_mb=1
memory_mb=18446744073709551615, disk_mb=18446744073709551615
```

The second declaration exceeds any real host, yet the CLI reports READY.
This is both an unlisted claim under the claims contract and a misleading
statement about a central readiness input. Either implement and claim-test an
observable resource check, or change all public metadata to say that the
receipt records declared resource minimums.

### HIGH-2 — 200% text resizing loses mobile content

At a 390×844 viewport, setting the root text size from 16px to 32px (the
required 200% text-resize check) produces:

```text
window.innerWidth:                      390
document.documentElement.scrollWidth:  484
document.body.scrollWidth:              484
h1 right edge:                          416.44
primary action right edge:              416.44
```

The wordmark and navigation overlap, the headline is clipped at the right
edge, and the primary action extends outside the viewport. This violates the
attached accessibility requirement that text resize to 200% without loss.
The normal 100% 390px layout does fit exactly and therefore does not catch
this regression.

### MEDIUM-1 — Three mobile touch targets are below 44px

At 390px width, fresh rendered bounding boxes are:

| Route | Control | Size |
| --- | --- | ---: |
| `/privacy` | `privacy@sociobot.in` | 183×19px |
| `/terms` | `support@sociobot.in` | 183×19px |
| unknown/404 | `Return to the upgrade kit` | 260×21px |

The supplied accessibility and design contracts require 44×44px touch
targets. The principal landing and demo controls meet the requirement, but
these three do not. The 404 link is the page's only recovery action.

### MEDIUM-2 — A cached invalid license loses its required notice on reload

On the live landing page, an empty license submission correctly returns focus
to the input and says “Paste a license token, then verify it.” A fresh invalid
token then correctly locks the Team kit and says “License no longer active.
You can buy a new license.”

After reload, the invalid verdict remains cached and the feature remains
locked, but the notice reverts to “Payment opens Sociobot checkout.” No new
verification request is made during the one-day cache window. The paid-unlock
contract requires a quiet “license no longer active” notice whenever the
cached verdict is invalid.

## Claims gate

`.factory/claims.json` exists and has 16 claims. After the clean dependency
install (`npm ci`), every exact `test` command in the file was run serially
through the shipped test/demo entry point. All 16 passed:

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

Each ID appears in exactly one source test. The literal first invocation made
before dependencies were installed stopped in `build:assets` because `sharp`
was unavailable; the same exact commands all passed after the repository's
required clean install. No claim behavior failed in the installed checkout.

The additional “resource checks” sentence is not present in the manifest and
therefore fails the cross-check even though the listed claims pass.

## Clean local build, test, and package evidence

The clean candidate commit and remote branch were both
`41e4347260f74e5c916dfa72f753f4c13e0f3a47`. The worktree was clean before
verification. These gates passed:

```sh
npm ci
npm test
# 40 passed, 1 intentional desktop-only skip

npm run build
# release binary and dist/site produced

npx tsc --noEmit --strict --target es2022 \
  --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
# zero vulnerabilities

cargo package --locked
# 15 files; package verification passed
```

The production site bundle is 20,622 bytes JavaScript (7,300 gzip), 12,689
bytes CSS (3,630 gzip), and a 70,902-byte hero WebP. These are below the
supplied 200KB JS, 50KB CSS, and 300KB mobile-image budgets.

## CLI and installer evidence

The packaged crate was installed with `cargo install --path
target/package/rehearsal-0.1.1 --root <fresh-dir> --locked`. The clean
consumer reported `rehearsal 0.1.1`; `demo --output <empty-dir> --json`
returned schema 1, READY, nine checks, three schema changes, declared
768MB/2048MB resources, and `customer_safe: true`.

Recovery paths behaved safely:

- incomplete starter declaration: exit 2 with the missing schema path;
- reuse of a non-empty demo directory: exit 2 without overwriting it;
- duplicate `init` output: exit 2 without overwriting it;
- unknown command: exit 2 with usage.

The published `v0.1.1` release includes Linux x86_64/aarch64 archives,
macOS x86_64/aarch64 archives and unsigned packages, a Windows zip, `.deb`,
`.rpm`, Homebrew, Scoop, Winget, `latest.json`, and `SHA256SUMS`. The Linux
x86_64 archive matched `SHA256SUMS`; its binary ran the same nine-check READY
demo. The live one-line installer was also run with an isolated install
directory. It printed checksum success, installed version 0.1.1, and the
installed binary completed the demo.

## Live deployment and browser evidence

Fresh local and live files match byte-for-byte:

| File | SHA-256 |
| --- | --- |
| `index-BClBEF0Y.js` | `9d6214592abda338e314c9f4ce5a3be80b94b8f29ccc9d535cf604f4b7699148` |
| `index-5afA4qai.css` | `274e358412ace02cb377b653206ca6540fde05d2edf6d349cf0bdd51fe5a8dd1` |
| `specimen-upgrade.webp` | `278b1f35e76f0680afcbb9b96914f6d3ba33d4500e0c48e37e961945de8d560e` |

`index.html` also matches byte-for-byte. The live deployment is therefore the
candidate, not stale builder output.

Routes `/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown route
returns a designed real 404. At desktop and normal 390px mobile widths, every
route has `lang=en`, one H1, one main landmark, route-specific titles, no
missing image alt, no horizontal overflow, no page exceptions, and no axe
serious/critical findings. The expected browser resource message for the
intentional 404 document is not an application exception.

`/opt/fleet/lib/verify-url.sh` passed against production: HTTP 200, 748ms
network-idle load, title/lang/H1/main/alt/button checks present, and no console
errors. Keyboard traversal starts with the visible skip link and reaches all
landing controls in order. Every sampled focus state has a 3px orange outline.
Reduced motion is detected; animation and transition duration becomes
0.00001s and scroll behavior becomes `auto`.

The live demo was loaded, taken offline, reset, completed to READY, and
downloaded through the UI. Its receipt has schema 1, nine checks, three config
changes, and `customer_safe: true`. It uses only `demo:` session storage and
makes only same-origin document/JS/CSS requests. There are no analytics,
trackers, remote fonts, AI calls, or project-data requests.

The generated HTML receipt also has `lang=en`, one H1, one main landmark,
zero axe serious/critical findings, and no horizontal overflow at 390px.

## Headers, caching, rate limit, and performance

The live response includes HSTS, `nosniff`, strict-origin referrer policy,
restrictive camera/microphone/geolocation policy, and a CSP limited to self
plus the documented GitHub and Sociobot connections. HTML uses
`public, must-revalidate, max-age=30`; hashed JS/CSS use one-year immutable
caching; the hero uses a one-day cache.

A fresh landing load requests only the site document, hashed JS/CSS, the hero,
and disclosed GitHub release metadata. A fresh demo flow makes only
same-origin requests.

Fresh rate-limit evidence for the Sociobot license verification endpoint:
requests 1–30 from one client returned 200 with an invalid verdict; request 31
returned 429 with `Retry-After: 4`. The checkout endpoint returns 303 to the
Dodo-hosted checkout. The documented allowance is therefore 30 requests per
client in the observed window.

A clean mobile Lighthouse run (full-page-screenshot audit skipped because of
a Chromium/Lighthouse artifact crash) reports:

```text
Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100
FCP 0.9s · LCP 1.8s · CLS 0 · TBT 120ms · total transfer 86KiB
```

## Documentation and applicability

README, MIT LICENSE, CHANGELOG, `/privacy`, `/terms`, demo documentation,
visual thesis, asset provenance, installers, package-manager manifests, and
release workflow are present. The site uses system fonts and original art.

This product has no sign-in, product backend, or service worker. Entra login,
backend concurrency/persistence, and PWA update checks do not apply. The
optional license verification endpoint was tested separately as above.

Docker, Podman, kubectl, and kind are unavailable in this verifier container,
so a real Compose engine or Kubernetes cluster was not launched. Both adapter
declarations and all vendor-hook phases were exercised by the installed test
suite and CLI fixture paths.

## Required re-verification scope

1. Remove or implement and claim-test the resource-check promise.
2. Reflow the header, headline, action, and all sections at 200% text size.
3. Make the legal-page email links and 404 recovery action at least 44px high.
4. Restore the cached invalid-license notice on every landing load.
5. Re-run every claim command, the full local gates, clean package/install,
   deployed identity check, desktop/390px/200%-text browser sweep, axe, and
   live request/header/rate-limit checks.
