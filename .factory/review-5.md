# Adversarial first-read review 5 — Self-Host Upgrade Rehearsal

**Verdict: FAIL.** Reviewed 29 August 2026 UTC against
<https://selfhost-upgrade-rehearsal.sociobot.in> in fresh 390×844 and
1440×900 Chromium contexts, and against a clean clone of
`9ce36691aeef903f88f507cfac01ae74f45c061f`.

The first screen and demo pass. All 47 declared test commands exit zero.
However, two earlier claim-coverage findings are only partly fixed: commercial
claims are tested by looking for their own words, and current distribution
claims rely on v0.1.3 fixtures while the product is v0.1.4. One README behavior
has no claim entry, and one fallback link does not name its result. The required
zero-finding threshold is therefore not met.

## Cold first read

**390px and desktop: PASS.** Before scrolling, I could answer all three
questions:

- What it does: it rehearses a self-hosted Compose or Kubernetes upgrade before
  customers receive it.
- Who it is for: self-hosted product teams preparing those releases.
- What to click first: **Try it with sample data**, which opens the bundled
  sample demo and its receipt.

The exact supporting text is “Rehearse upgrades before customers do”, “For
self-hosted product teams that need proof before each Compose or Kubernetes
release.”, and “Runs the bundled sample demo and opens its receipt.” The action
and all three facts fit within 390×844. There is no horizontal overflow.

## Findings

### F-5-1 / F-1-2 reopened — BLOCKING — Purchase and refund tests repeat the claims instead of proving them

**Exact quotes and locations:** landing paid section, “Sociobot is the merchant
of record.” and “Refunds are handled through Sociobot.”; Terms, “A refund
revokes the related license.”

**Evidence:** `.factory/claims.json` registers `sociobot-merchant` and
`sociobot-refunds`, but their tests at `e2e/site.spec.ts:429` and
`e2e/site.spec.ts:435` only load the site and assert that the same sentences are
visible. The merchant test also checks the checkout URL. Neither test observes
merchant-of-record data, a refund, or license revocation. The separate
`dodo-checkout-processing` fixture proves only that checkout redirects to Dodo.
It does not prove who is merchant of record or what happens after a refund.

**Why a visitor is misled:** these are purchase and legal promises. Repeating
them in a browser assertion does not establish that the promised commercial
behavior exists. F-1-2 originally required recorded checkout/entitlement
evidence for these promises, so its claimed closure is incomplete.

**Concrete fix:** either remove the merchant/refund assertions and say only the
tested result, such as “Payment opens Sociobot checkout,” or add scrubbed
Sociobot fixtures that identify the merchant and exercise an active license
through refund to a rejected verification. Make each test assert the response
or state transition, not page copy.

### F-5-2 / F-1-3 reopened — BLOCKING — README claims are broader than their manifest coverage

**Exact quotes and locations:** README installation section, “Homebrew packages
use the published tap,” “Scoop uses the published bucket,” “Each release also
carries `.deb`, `.rpm`, unsigned macOS `.pkg`, Windows zip, Winget manifests,
`SHA256SUMS`, and `latest.json`,” and “GitHub Actions also records build
provenance for every release asset”; README declaration section, “Use
`{source_dir}` and `{work_dir}` as path placeholders.”

**Evidence:** the package and live release are v0.1.4, but
`@claim:homebrew-tap`, `@claim:scoop-manifest`, `@claim:supported-platforms`,
and `@claim:release-asset-set` read fixtures named v0.1.3 and explicitly assert
version 0.1.3. The manifest calls the Homebrew formula “current,” while its test
does not compare the fixture version with `package.json`. `release-asset-set`
claims only that v0.1.3 had the assets, which does not cover README’s “Each
release” promise. The provenance test checks that workflow source mentions an
attestation action; it does not inspect a published attestation for every
asset. The path-placeholder sentence has no claim entry or dedicated
`@claim:path-placeholders` test; `argument-arrays` uses no placeholders.

The live endpoints currently return a v0.1.4 Homebrew formula, v0.1.4 Scoop
manifest, and all documented v0.1.4 assets. That confirms today’s state but
does not repair the clean-clone regression tests or cover “Each release.”

**Why a visitor is misled:** operators rely on package-manager state,
provenance, release contents, and path substitution. A green suite can remain
green after those current artifacts drift or placeholder expansion breaks.
This is the same incomplete README claim coverage raised by F-1-3.

**Concrete fix:** capture v0.1.4 fixtures and assert their version equals the
package version, URLs point to that tag, and checksums match its assets. Change
“Each release” to “Release v0.1.4” or test the release workflow output for the
version under review. Verify published attestations by digest, or narrow the
sentence to “The release workflow requests GitHub provenance.” Add a
`path-placeholders` claim that runs hooks with both placeholders in a fresh
temporary directory and asserts the resolved arguments.

### F-5-3 — MINOR — The download fallback is an active link with a status label

**Exact quote and location:** landing installation fallback,
“Downloads are being published.”

**Evidence:** when the GitHub release request is unavailable, the element is a
focusable `<a>` to the GitHub releases page with no `aria-disabled`, although
its class is `button primary disabled`. The label describes a status and does
not tell the visitor what clicking does. The adjacent error copy separately
offers “open the release page.”

**Why a visitor is lost:** the control looks active but its words do not name
its destination or result, contrary to the result-naming action rule.

**Concrete fix:** label the active link **Open GitHub releases**, or replace it
with a non-interactive status element until a package is available.

## Copy audit

Counts ignore standalone punctuation and treat hyphenated terms, versions,
commands, and filenames as one word. Terminal output, fenced code, and raw URLs
are not prose sentences. Headings, labels, buttons, alternate runtime states,
and image alt text are included. No item exceeds 22 words and no banned
marketing adjective appears. The flags below are the findings above.

### Landing page

| Visible sentence or label | Words | Result |
| --- | ---: | --- |
| Upgrade Rehearsal | 2 | pass |
| Demo | 1 | pass |
| Install | 1 | pass |
| Privacy | 1 | pass |
| Upgrade rehearsal for self-hosted products | 5 | pass |
| Rehearse upgrades before customers do | 5 | pass |
| For self-hosted product teams that need proof before each Compose or Kubernetes release. | 13 | pass |
| Try it with sample data | 5 | pass |
| Runs the bundled sample demo and opens its receipt. | 9 | pass |
| The demo uploads no project data. | 6 | pass |
| The bundled demo runs offline after this page loads. | 9 | pass |
| The core CLI is free under the MIT License. | 9 | pass |
| A field-guide plant grows from stacked containers beside an upgrade receipt. | 11 | pass; image alt |
| A receipt names the tested versions and supported environments. | 9 | pass |
| Sample terminal recording | 3 | pass |
| Sample upgrade rehearsal | 3 | pass |
| This recording uses the bundled sample demo from `rehearsal demo`. | 10 | pass |
| Play recording | 2 | pass |
| Pause recording | 2 | pass; runtime state |
| Resume recording | 2 | pass; runtime state |
| Replay recording | 2 | pass; runtime state |
| Tested versions | 2 | pass |
| Backup and restore | 3 | pass |
| Passed | 1 | pass |
| Schema changes | 2 | pass |
| 3 changes | 2 | pass |
| Ready | 1 | pass |
| How the upgrade rehearsal works | 5 | pass |
| Declare, run, and share a receipt | 6 | pass |
| Declare the path | 3 | pass |
| Name both versions, supported systems, resource minimums, schemas, and hook commands. | 11 | pass |
| Run the test commands | 4 | pass |
| The CLI uses a new temporary directory for sample data, backup, restore, and health checks. | 15 | pass |
| Give customers the receipt | 4 | pass |
| Share the HTML receipt. | 4 | pass |
| Keep the JSON receipt as your release gate. | 8 | pass; audience-appropriate release term |
| CLI installation | 2 | pass |
| Install one binary | 3 | pass |
| Checking published downloads… | 3 | pass; transient status |
| Release v0.1.4 is ready for this device. | 7 | pass |
| Install on macOS, Windows, or Linux. | 6 | pass |
| No phone or tablet package is provided. | 7 | pass |
| Downloads are being published | 4 | **F-5-3** |
| Download linux-x86_64.tar.gz | 2 | pass; detected desktop variant |
| The download comes from the matching GitHub release. | 8 | pass |
| You can open the release page while packages are prepared. | 10 | pass |
| Downloads are being published or this device is offline. | 9 | pass |
| Try again later or open the release page. | 8 | pass |
| Copy macOS and Linux install | 5 | pass |
| Copy Windows install | 3 | pass |
| Copied install command | 3 | pass; completion status |
| Select the command below | 4 | pass; recovery instruction |
| Installers verify SHA256 before placing the binary on your path. | 10 | pass |
| Published packages are unsigned. | 4 | pass |
| First run | 2 | pass |
| Receipt limits | 2 | pass |
| Know what the receipt does not prove | 7 | pass |
| The CLI has no built-in network client and does not discover customer installations. | 13 | pass |
| Hooks can access paths and networks you configure. | 8 | pass |
| Each receipt covers only its listed versions and environments. | 9 | pass |
| Optional paid kit | 3 | pass |
| Run the rehearsal in release CI | 6 | pass; audience-appropriate CI term |
| The $79 one-time Team kit adds a CI checklist for each supported source and target version. | 16 | pass |
| The CLI and both receipt formats stay free. | 8 | pass |
| Sociobot is the merchant of record. | 6 | **F-5-1** |
| Refunds are handled through Sociobot. | 5 | **F-5-1** |
| Buy the Team kit — $79 | 5 | pass |
| Have a license? Paste it | 5 | pass |
| Verify license | 2 | pass |
| Payment opens Sociobot checkout. | 4 | pass |
| Paste a license token, then verify it. | 7 | pass; error state |
| Checking this license… | 3 | pass; progress state |
| Team kit active. | 3 | pass; success state |
| License no longer active. | 4 | pass; error state |
| You can buy a new license. | 6 | pass; recovery state |
| The license check is offline. | 5 | pass; error state |
| Try again when connected. | 4 | pass; recovery state |
| Download Team CI kit | 4 | pass |
| Self-Host Upgrade Rehearsal | 3 | pass |
| Readiness receipts for self-hosted upgrades. | 5 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v0.1.4 · build 2026.08.29 | 3 | pass |

### README

| Sentence, heading, or label | Words | Result |
| --- | ---: | --- |
| Self-Host Upgrade Rehearsal | 3 | pass |
| Rehearse self-hosted upgrades and issue a customer-safe readiness receipt. | 9 | pass |
| This CLI is for teams that ship Docker Compose or Kubernetes products. | 12 | pass |
| It checks one declared upgrade path before customers use it. | 10 | pass |
| Website | 1 | pass |
| One-click browser demo | 3 | pass; verified live |
| Run the sample demo | 4 | pass |
| The command creates a temporary Arbor Desk project with sample records. | 11 | pass |
| It prints the paths to JSON and HTML receipts. | 9 | pass |
| The CLI checks backup, restore, and health hooks. | 8 | pass |
| It never includes hook output or sample data in a receipt. | 11 | pass |
| Install | 1 | pass |
| macOS and Linux | 3 | pass |
| Windows PowerShell | 2 | pass |
| Both installers verify SHA256 before placing the binary on `PATH`. | 10 | pass |
| Homebrew packages use the published tap. | 6 | **F-5-2** |
| Scoop uses the published bucket. | 5 | **F-5-2** |
| Each release also carries `.deb`, `.rpm`, unsigned macOS `.pkg`, Windows zip, Winget manifests, `SHA256SUMS`, and `latest.json`. | 16 | **F-5-2** |
| Verify and roll back an installer | 6 | pass |
| The installers download the matching release `SHA256SUMS` file and check the archive before installing it. | 15 | pass |
| GitHub Actions also records build provenance for every release asset; verify it with GitHub CLI. | 15 | **F-5-2** |
| To install an earlier tagged release, set `REHEARSAL_VERSION` to its full tag. | 12 | pass |
| The installer checks that release's checksum before replacing the binary. | 10 | pass |
| Declare an upgrade path | 4 | pass |
| Start with a declaration template. | 5 | pass |
| Add your schema files and hook commands before running `rehearsal check`. | 11 | pass |
| The declaration lists only the versions, resources, schemas, and commands the rehearsal needs. | 13 | pass |
| Commands are argument arrays, so no shell parsing happens inside the CLI. | 12 | pass |
| Use `{source_dir}` and `{work_dir}` as path placeholders. | 7 | **F-5-2**; unlisted claim |
| Validate and run | 3 | pass |
| `check` validates Compose and Kubernetes declarations before launch. | 8 | pass |
| `run` executes hooks in a new temporary directory. | 8 | pass |
| The result contains schema key changes, declared resource minimums, checks, tested versions, and supported environments. | 15 | pass |
| It writes `readiness.json` and `readiness.html`. | 5 | pass |
| Use `--json` with `check`, `run`, or `demo` for scripts. | 9 | pass |
| A failed check returns exit code 1. | 7 | pass |
| Invalid input returns exit code 2. | 6 | pass |
| Privacy and limits | 3 | pass |
| The CLI has no built-in network client or telemetry path. | 10 | pass |
| Your hook commands may use the network when your test requires it. | 12 | pass |
| Schema comparison records paths and value types. | 7 | pass |
| It does not copy schema values into the receipt. | 9 | pass |
| A receipt covers only the versions and environments printed on it. | 11 | pass |
| It is not proof for an unlisted customer system. | 9 | pass |
| Team kit | 2 | pass |
| The free CLI includes both receipt formats. | 7 | pass |
| The optional $79 one-time Team kit adds a CI checklist for each supported source and target version. | 16 | pass |
| License purchase and verification use the Sociobot billing API. | 9 | pass |
| No payment provider is embedded in this repository. | 8 | pass |
| Develop | 1 | pass |
| Requirements: stable Rust, Node 22, and npm. | 7 | pass |
| `npm test` runs Rust, claim, accessibility, desktop, and 390 px browser checks. | 12 | pass |
| `npm run build:site` writes `dist/site/index.html`. | 5 | pass |
| Run the site locally | 4 | pass |
| Package the Rust crate without publishing it | 7 | pass |
| The complete deployable static site is in `dist/site`. | 8 | pass |
| Tag a version such as `v0.1.4` to run the cross-platform GitHub release workflow. | 13 | pass |
| License | 1 | pass |
| MIT. | 1 | pass |
| See LICENSE. | 2 | pass |

Terminology is otherwise consistent: YAML input is a **declaration**, the
isolated example is the **sample demo**, the customer-facing output is a
**receipt**, and the paid download is the **Team kit**. Compose, Kubernetes,
CLI, JSON, SHA256, schema, hooks, CI, and provenance are technical terms needed
by the stated release-engineering audience; each is used in an operational
context rather than as marketing language.

## Demo and sandbox behavior

- **One-click path: PASS.** Clicking **Try it with sample data** on the live
  landing page opens `/?demo=1` in one click.
- **Useful first screen: PASS.** At 390px it immediately shows the persistent
  “Demo — sample data, nothing is saved” banner, Arbor Desk 1.8.4 → 2.0.0,
  nine realistic checks, READY, and the populated receipt.
- **Reset and persistence: PASS.** At `scrollY=1696`, the 390px banner remained
  sticky at y=0–81.19 with Reset and Install visible. Offline Reset replayed to
  READY. A `real:project` local-storage sentinel and `real:session` session
  sentinel survived. Leaving demo removed `demo:` keys, reached `/#install`,
  and focused `#install-title`. The declared close/reopen test also passed.
- **Network privacy: PASS.** Direct demo entry, reset, and receipt download made
  only same-origin GET requests with no request bodies. The landing page makes
  the separately disclosed GitHub release-metadata request; entering and using
  the demo adds no external request. No analytics or third-party script loaded.
- **CLI demo: PASS.** From a new temporary directory, `rehearsal demo --output
  <temp>/sample` wrote JSON and HTML receipts. The JSON reported Arbor Desk
  1.8.4 → 2.0.0, READY, `customer_safe: true`, and nine checks.

## Claims results

The clean clone contained 47 unique manifest IDs and exactly 47 unique
`@claim:` tags. Every exact command in `.factory/claims.json` was run
independently and exited zero:

| Claim | Result | Claim | Result |
| --- | --- | --- | --- |
| `demo-receipt` | PASS | `offline-demo` | PASS |
| `demo-network-privacy` | PASS | `cli-receipts` | PASS |
| `upgrade-hooks` | PASS | `declared-resource-minimums` | PASS |
| `compose-kubernetes-declarations` | PASS | `installer-checksum` | PASS |
| `installer-provenance-rollback` | PASS, inadequate for published provenance; F-5-2 | `mit-core` | PASS |
| `schema-redaction` | PASS | `customer-safe-receipt` | PASS |
| `temporary-workspace` | PASS | `argument-arrays` | PASS |
| `exit-codes` | PASS | `unsigned-packages` | PASS |
| `cli-no-upload` | PASS | `team-kit-license` | PASS |
| `declared-upgrade-path` | PASS | `customer-boundary` | PASS |
| `receipt-scope` | PASS | `team-kit-price-scope` | PASS |
| `free-cli-formats` | PASS | `sociobot-merchant` | PASS, tautological; F-5-1 |
| `sociobot-refunds` | PASS, tautological; F-5-1 | `sociobot-checkout` | PASS |
| `published-platform-download` | PASS | `supported-platforms` | PASS, stale fixture; F-5-2 |
| `homebrew-tap` | PASS, stale fixture; F-5-2 | `scoop-manifest` | PASS, stale fixture; F-5-2 |
| `release-asset-set` | PASS for v0.1.3 only; F-5-2 | `receipt-contents` | PASS |
| `release-workflow` | PASS | `sample-demo-parity` | PASS |
| `sociobot-license-api` | PASS | `no-embedded-payment-provider` | PASS |
| `demo-storage-isolation` | PASS | `starter-templates` | PASS |
| `json-output` | PASS | `release-metadata` | PASS |
| `license-browser-storage` | PASS | `no-card-collection` | PASS |
| `dodo-checkout-processing` | PASS | `development-requirements` | PASS |
| `test-coverage` | PASS | `site-build-output` | PASS |
| `deploy-directory` | PASS |  |  |

There was no non-zero claim command, so no blocker is based on command exit
status. F-5-1 and F-5-2 are blockers because the passing assertions do not test
the relied-on outcomes and leave earlier claim-coverage findings half-fixed.

The unfiltered clean-clone checks also passed: 5 Rust tests and 119 Playwright
tests passed, with 5 intentional project-specific skips. `npm run lint` and
`npm run build` passed. The built initial JavaScript is 22,979 bytes raw and
7,806 bytes gzip; `dist/site` was produced.

## Earlier-history verification

I read `.factory/review-1.md` through `.factory/review-4.md`,
`.factory/polish-1.md` through `.factory/polish-4.md`, and the prior handoff.
Each earlier finding was checked on the live site and in current source or its
test. Prior PASS labels were not treated as evidence.

| Earlier finding | Review 5 verification |
| --- | --- |
| F-1-1 | Fixed: an unknown URL returns HTTP 404 with the full header, footer, legal links, recovery action, and route metadata. |
| F-1-2 | **Reopened as F-5-1:** merchant/refund tests repeat page copy and do not prove the purchase outcomes. |
| F-1-3 | **Reopened as F-5-2:** release tests use old fixtures, “Each release” is broader than its entry, and placeholder behavior is unlisted. |
| F-1-4 | Fixed: browser, CLI, README, and demo guide use “sample demo.” |
| F-1-5 | Fixed: hero label is “Upgrade rehearsal for self-hosted products.” |
| F-1-6 | Fixed: “Plate I” is absent from live copy and source. |
| F-1-7 | Fixed: the caption names tested versions and supported environments. |
| F-1-8 | Fixed: the section label is “Sample terminal recording.” |
| F-1-9 | Fixed: the heading is “Sample upgrade rehearsal.” |
| F-1-10 | Fixed: the workflow headings name declare, run, and share steps. |
| F-1-11 | Fixed: the installation section is labelled “CLI installation.” |
| F-1-12 | Fixed: the limits section is labelled “Receipt limits.” |
| F-1-13 | Fixed: paid scope names the CI checklist and supported version pairs. |
| F-1-14 | Fixed: preview labels identify tested versions and three schema changes. |
| F-1-15 | Fixed: headings name test commands and release CI. |
| F-1-16 | Fixed: README names versions, resources, schemas, and commands directly. |
| F-1-17 | Fixed: Demo, Privacy, Terms, and 404 retain distinct metadata. |
| F-2-1 | Fixed: Install reaches `/#install`, positions the section at the viewport top, focuses its heading, and announces it. |
| F-3-1 | Fixed: README says “declaration template” and states that schemas and hooks must be added. |
| F-4-1 | Fixed: the page distinguishes no built-in discovery from configured hook access; the hostile hook test exercises both sides. |
| F-4-2 | Fixed: the 390px demo banner remains sticky at the receipt. |
| F-4-3 | Fixed: README heading is “Run the sample demo.” |
| F-4-4 | Fixed: the unsupported three-workspace statement is absent. |
| F-4-5 | Fixed: platform copy describes available packages, and `supported-platforms` covers the matrix. Its stale fixture is separately part of F-5-2. |
| F-4-6 | Fixed: close/reopen clears demo session keys while preserving real local storage. |
| F-4-7 | Fixed: the four development claims remain registered and their tests pass. |
| F-4-8 | Fixed: the demo exit action is “Install the CLI.” |

## Structure, accessibility, links, and visual identity

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200. An unknown
  path returns a designed HTTP 404. Each page has `lang=en`, one H1, one main,
  a route-specific title under 60 characters, description, canonical,
  OG/Twitter data, favicon, header, footer, Privacy, and Terms.
- Privacy navigation and Back move focus to the destination H1. The Install
  link reaches `/#install`, places the section at y≈0, focuses its heading, and
  updates the polite route announcement. The keyboard skip link focuses main.
- Every discovered HTTP link resolved: internal routes and assets returned
  200, the GitHub binary and Sociobot checkout resolved through redirects to
  200, and `sociobot.in` returned 200. Mail links are explicit.
- Playwright Axe found zero violations on every route and the real 404 at both
  viewports. There was no overflow or application console error. The expected
  failed-resource message occurred only for the deliberately requested 404.
  The worker URL verifier also returned no errors.
- Reduced-motion mode computes `scroll-behavior: auto`. Focus rings and 44px
  mobile targets remain covered by the passing suite. Production sends CSP,
  HSTS, referrer-policy, permissions-policy, and content-type headers.
- The herbarium-sheet palette, botanical plate, serif/monospace pairing,
  asymmetric layout, clipped receipt panels, and inspection stamp match
  `.factory/design.md`. The result is product-specific, not a generic SaaS
  template.

## Missed leverage

No AI feature is justified. The job is deterministic command execution and
auditable evidence; generated advice would weaken that boundary. JSON and HTML
already provide the obvious export paths. Remote sync would conflict with the
local/no-customer-data scope. No decorative AI, embedded provider key, or
missing import/export/sync requirement was found.

## What would make this perfect

Close all three findings. Replace self-referential commercial tests with
observable fixtures or narrower copy; bind distribution fixtures and claims to
the current release; register path-placeholder behavior; and make the download
fallback either a real status or a result-naming link. Then rerun all 47 claim
commands and this complete mobile/desktop review from clean state.
