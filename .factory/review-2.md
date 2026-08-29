# Adversarial first-read review 2 — Self-Host Upgrade Rehearsal

**Verdict: FAIL.** Reviewed 29 August 2026 UTC against
<https://selfhost-upgrade-rehearsal.sociobot.in> from a fresh browser context
at 390×844 and 1440×900, and against the clean checkout at `6ca5190`.

The product is clear on first read, the sample demo is isolated and usable,
and the claims suite passes. One header link has broken in-page routing. The
site-structure contract makes broken routing blocking, so this cannot pass.

## Cold first read

**390px: PASS.** Before scrolling, the screen says the product rehearses
upgrades, names self-hosted product teams using Compose or Kubernetes as the
audience, and gives **Try it with sample data** as the first action. Adjacent
copy says: “Runs the bundled sample demo and opens its receipt.” The headline,
audience sentence, action, and all three facts were visible without horizontal
overflow.

**Desktop: PASS.** The same four answers were visible before scrolling. The
hero’s primary action was fully visible at 1440×900.

## Findings

### F-2-1 — BLOCKING — Header Install link does not reach the installation section

**Location and exact quote:** Main navigation, **“Install”**, at
`https://selfhost-upgrade-rehearsal.sociobot.in/#install`. The live source is
`site/src/main.ts`: the link has `href="/#install" data-link`, and the generic
`bindNavigation()` handler prevents its normal anchor navigation before it
re-renders the route.

**Evidence:** In a fresh 390×844 live browser, clicking the header link changed
the URL to `/#install`, but after 250 ms the viewport was at `scrollY: 1693`
and the installation section began `1719` CSS pixels below the viewport. The
user remains in the earlier content instead of seeing “CLI installation.” Focus
was `BODY`; it did not move to a useful destination.

**Why this matters:** A first-time visitor who chooses the visible Install
navigation item does not arrive at installation instructions. This is a broken
internal route, not merely a cosmetic scroll offset.

**Concrete fix:** Make this a normal same-document anchor (`href="#install"`
without `data-link`), or have the router call `scrollIntoView()` for the hash
after rendering and move focus to the installation heading. Add a live
Playwright regression at 390px and desktop that clicks the header Install link,
asserts that `#install` is within the viewport, and confirms a meaningful
focus destination.

## Copy audit

Counts treat hyphenated terms, version strings, prices, and commands as one
word. Fenced commands and terminal output are code rather than prose; their
behaviour was checked in the CLI and demo tests. No audited prose exceeds 22
words. No banned marketing adjective, unexplained metaphor heading, or
non-result-naming button remains. The sole copy-adjacent control defect is
F-2-1.

### Landing page

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Wordmark | Upgrade Rehearsal | 2 | pass |
| Header | Demo / Install / Privacy | 1 / 1 / 1 | pass; Install behaviour is F-2-1 |
| Hero eyebrow | Upgrade rehearsal for self-hosted products | 5 | pass |
| Hero H1 | Rehearse upgrades before customers do | 5 | pass |
| Hero | For self-hosted product teams that need proof before each Compose or Kubernetes release. | 13 | pass |
| Hero action | Try it with sample data | 5 | pass |
| Hero action | Runs the bundled sample demo and opens its receipt. | 9 | pass; `demo-receipt`, `sample-demo-parity` |
| Hero fact | The demo uploads no project data. | 6 | pass; `demo-network-privacy` |
| Hero fact | The bundled demo runs offline after this page loads. | 9 | pass; `offline-demo` |
| Hero fact | The core CLI is free under the MIT License. | 9 | pass; `mit-core` |
| Hero caption | A receipt names the tested versions and supported environments. | 9 | pass; `receipt-scope` |
| Preview eyebrow | Sample terminal recording | 3 | pass |
| Preview H2 | Sample upgrade rehearsal | 3 | pass |
| Preview | This recording uses the bundled sample demo from `rehearsal demo`. | 10 | pass; `sample-demo-parity` |
| Preview button | Play recording | 2 | pass |
| Preview data | Tested versions / Backup and restore / Passed / Schema changes / 3 changes / Ready | 2 / 3 / 1 / 2 / 2 / 1 | pass |
| How eyebrow | How the upgrade rehearsal works | 5 | pass |
| How H2 | Declare, run, and share a receipt | 6 | pass |
| Step | Declare the path | 3 | pass |
| Step | Name both versions, supported systems, resource minimums, schemas, and hook commands. | 11 | pass |
| Step | Run the test commands | 4 | pass |
| Step | The CLI uses a new temporary directory for sample data, backup, restore, and health checks. | 14 | pass; `temporary-workspace` |
| Step | Give customers the receipt | 4 | pass |
| Step | Share the HTML receipt. | 4 | pass |
| Step | Keep the JSON receipt as your release gate. | 8 | pass |
| Install eyebrow | CLI installation | 2 | pass |
| Install H2 | Install one binary | 3 | pass |
| Install status | Release v0.1.2 is ready for this device. | 7 | pass; `release-manifest`, `published-platform-download` |
| Install action | Download linux-x86_64.tar.gz | 2 | pass |
| Install | The download comes from the matching GitHub release. | 8 | pass; `published-platform-download` |
| Install buttons | Copy macOS and Linux install / Copy Windows install | 5 / 4 | pass |
| Install | Installers verify SHA256 before placing the binary on your path. | 10 | pass; `installer-checksum` |
| Install | Published packages are unsigned. | 4 | pass; `unsigned-packages` |
| First run | First run | 2 | pass |
| Limits eyebrow | Receipt limits | 2 | pass |
| Limits H2 | Know what the receipt does not prove | 8 | pass |
| Limits | It does not connect to customer servers or collect customer data. | 11 | pass; `customer-boundary`, `cli-no-upload` |
| Limits | It does not upgrade a customer installation. | 7 | pass; `customer-boundary` |
| Limits | Each receipt covers only its listed versions and environments. | 9 | pass; `receipt-scope` |
| Paid eyebrow | Optional paid kit | 3 | pass |
| Paid H2 | Run the rehearsal in release CI | 6 | pass |
| Paid | The $79 one-time Team kit adds a CI checklist for each supported source and target version. | 16 | pass; `team-kit-price-scope` |
| Paid | The CLI and both receipt formats stay free. | 8 | pass; `free-cli-formats` |
| Paid | Sociobot is the merchant of record. | 6 | pass; `sociobot-merchant` |
| Paid | Refunds are handled through Sociobot. | 6 | pass; `sociobot-refunds` |
| Paid action | Buy the Team kit — $79 | 6 | pass |
| License label/action | Have a license? Paste it / Verify license | 5 / 2 | pass |
| License status | Payment opens Sociobot checkout. | 4 | pass; `sociobot-checkout` |
| Footer | Readiness receipts for self-hosted upgrades. | 5 | pass |
| Footer links | Privacy / Terms / Built by Param Factory | 1 / 1 / 4 | pass |

### README

| # | Copy | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Self-Host Upgrade Rehearsal | 3 | title, pass |
| 2 | Rehearse self-hosted upgrades and issue a customer-safe readiness receipt. | 9 | pass |
| 3 | This CLI is for teams that ship Docker Compose or Kubernetes products. | 12 | pass |
| 4 | It checks one declared upgrade path before customers use it. | 10 | pass; `declared-upgrade-path` |
| 5 | Try the bundled upgrade | 4 | heading, pass |
| 6 | The command creates a temporary Arbor Desk project with sample records. | 11 | pass; `temporary-workspace` |
| 7 | It prints the paths to JSON and HTML receipts. | 9 | pass; `cli-receipts` |
| 8 | The CLI checks backup, restore, and health hooks. | 8 | pass; `upgrade-hooks` |
| 9 | It never includes hook output or sample data in a receipt. | 11 | pass; `customer-safe-receipt` |
| 10 | Install | 1 | heading, pass |
| 11 | macOS and Linux / Windows PowerShell | 3 / 2 | labels, pass |
| 12 | Both installers verify SHA256 before placing the binary on `PATH`. | 10 | pass; `installer-checksum` |
| 13 | Homebrew packages use the published tap. | 6 | pass; `homebrew-tap` |
| 14 | Scoop uses the release manifest. | 5 | pass; `scoop-manifest` |
| 15 | Each release also carries `.deb`, `.rpm`, unsigned macOS `.pkg`, Windows zip, Winget manifests, and checksums. | 14 | pass; `release-asset-set` |
| 16 | Declare an upgrade path | 4 | heading, pass |
| 17 | Start with a checked template. | 5 | pass |
| 18 | The declaration lists only the versions, resources, schemas, and commands the rehearsal needs. | 13 | pass |
| 19 | Commands are argument arrays, so no shell parsing happens inside the CLI. | 12 | pass; `argument-arrays` |
| 20 | Use `{source_dir}` and `{work_dir}` as path placeholders. | 7 | pass |
| 21 | Validate and run | 3 | heading, pass |
| 22 | `check` validates Compose and Kubernetes declarations before launch. | 8 | pass; `compose-kubernetes-declarations` |
| 23 | `run` executes hooks in a new temporary directory. | 8 | pass; `temporary-workspace` |
| 24 | The result contains schema key changes, declared resource minimums, checks, tested versions, and supported environments. | 15 | pass; `receipt-contents` |
| 25 | It writes `readiness.json` and `readiness.html`. | 5 | pass; `cli-receipts` |
| 26 | Use `--json` with `check`, `run`, or `demo` for scripts. | 9 | pass; `json-output` |
| 27 | A failed check returns exit code 1. | 7 | pass; `exit-codes` |
| 28 | Invalid input returns exit code 2. | 6 | pass; `exit-codes` |
| 29 | Privacy and limits | 3 | heading, pass |
| 30 | The CLI has no built-in network client or telemetry path. | 10 | pass; `cli-no-upload` |
| 31 | Your hook commands may use the network when your test requires it. | 12 | pass |
| 32 | Schema comparison records paths and value types. | 7 | pass; `schema-redaction` |
| 33 | It does not copy schema values into the receipt. | 9 | pass; `schema-redaction` |
| 34 | A receipt covers only the versions and environments printed on it. | 11 | pass; `receipt-scope` |
| 35 | It is not proof for an unlisted customer system. | 9 | pass; `receipt-scope` |
| 36 | Team kit | 2 | heading, pass |
| 37 | The free CLI includes both receipt formats. | 7 | pass; `free-cli-formats` |
| 38 | The optional $79 one-time Team kit adds a CI checklist for each supported source and target version. | 16 | pass; `team-kit-price-scope` |
| 39 | License purchase and verification use the Sociobot billing API. | 9 | pass; `sociobot-license-api` |
| 40 | No payment provider is embedded in this repository. | 8 | pass; `no-embedded-payment-provider` |
| 41 | Develop | 1 | heading, pass |
| 42 | Requirements: stable Rust, Node 22, and npm. | 7 | pass |
| 43 | `npm test` runs Rust, claim, accessibility, desktop, and 390 px browser checks. | 12 | pass; verified locally |
| 44 | `npm run build:site` writes `dist/site/index.html`. | 5 | pass; verified locally |
| 45 | Run the site locally | 4 | heading, pass |
| 46 | Package the Rust crate without publishing it. | 7 | pass |
| 47 | The factory deploys `dist/site`. | 4 | deployment instruction, pass |
| 48 | Tag a version such as `v0.1.2` to run the cross-platform GitHub release workflow. | 8 | pass; `release-workflow` |
| 49 | License / MIT. / See LICENSE. | 1 / 1 / 2 | pass |

The Website and one-click-demo URLs, code fences, and YAML sample are links or
code rather than sentences. All claim-like landing and README prose maps to a
listed claim, except development instructions that were directly run above.

## Demo, sandbox, and CLI

- **Demo entry: PASS.** The first visible screen at `/?demo=1` already showed
  the finished Arbor Desk 1.8.4 → 2.0.0 rehearsal: READY, nine passed checks,
  three schema changes, resource minimums, and coverage limits.
- **Isolation: PASS.** The persistent banner reads “Demo — sample data,
  nothing is saved,” with Reset demo and Start for real. A pre-seeded
  `localStorage["real:sentinel"]` remained `intact` after entering demo and
  after Start for real; demo state was limited to `sessionStorage["demo:active"]`.
  Start for real removed every `demo:` key.
- **Reset: PASS.** Reset cleared the demo namespace and replayed the terminal.
  The banner stayed present. No real-storage key was read or changed.
- **Offline and privacy: PASS.** After the live `/demo` document, JS, and CSS
  loaded from the product origin, the context was put offline. Reset and
  Download sample JSON still produced `arbor-desk-readiness.json` with
  `status: "ready"`. The complete demo request log contained only those three
  same-origin initial requests; no upload or third-party request occurred.
- **CLI: PASS.** `cargo run --quiet -- demo --output <fresh-temp>/receipt
  --json` produced a schema-1, customer-safe READY Arbor Desk receipt with all
  nine checks in a new temporary workspace.

## Claims

`.factory/claims.json` has 41 entries, each with one matching
`@claim:<id>` test. I invoked every listed command (`npm test -- --grep
@claim:<id>`) after `npm ci`; the full local suite then passed with all claim
tests: 5 Rust tests, 99 Playwright tests passed, and 4 intentional
project-specific skips.

Claim IDs exercised: `demo-receipt`, `offline-demo`, `demo-network-privacy`,
`cli-receipts`, `upgrade-hooks`, `declared-resource-minimums`,
`compose-kubernetes-declarations`, `installer-checksum`, `mit-core`,
`schema-redaction`, `customer-safe-receipt`, `temporary-workspace`,
`argument-arrays`, `exit-codes`, `unsigned-packages`, `cli-no-upload`,
`team-kit-license`, `declared-upgrade-path`, `customer-boundary`,
`receipt-scope`, `team-kit-price-scope`, `free-cli-formats`,
`sociobot-merchant`, `sociobot-refunds`, `sociobot-checkout`,
`published-platform-download`, `homebrew-tap`, `scoop-manifest`,
`release-asset-set`, `receipt-contents`, `release-workflow`,
`sample-demo-parity`, `sociobot-license-api`,
`no-embedded-payment-provider`, `demo-storage-isolation`,
`starter-templates`, `json-output`, `release-manifest`,
`license-browser-storage`, `no-card-collection`, and
`dodo-checkout-processing`.

## Earlier-history verification

Read `.factory/review-1.md`, `.factory/polish-1.md`, and the prior handoff.
Every earlier finding was checked on the current live site and in current
source, rather than relying on its prior fixed label.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | Fixed: an unknown live URL returns HTTP 404 and serves a full shell with skip link, header, footer, legal links, metadata, and recovery action. |
| F-1-2 | Fixed: landing promises are mapped to the exhaustive 41-entry claim manifest and passing tests. |
| F-1-3 | Fixed: README promises are mapped to specific manifest entries, including installers, release assets, receipt contents, scope, and billing. |
| F-1-4 | Fixed: live browser, CLI, README, and demo docs consistently use “sample demo.” |
| F-1-5 through F-1-12 | Fixed: the former product-lore and metaphor labels have been replaced with clear product, recording, method, installation, and limits headings. |
| F-1-13 | Fixed: paid scope now names a CI checklist for supported source and target versions. |
| F-1-14 | Fixed: preview labels now say “Tested versions” and “3 changes.” |
| F-1-15 | Fixed: headings now name test commands and release CI. |
| F-1-16 | Fixed: README names the declaration fields instead of “public surface.” |
| F-1-17 | Fixed: direct Demo, Privacy, and Terms loads have their own title, description, canonical, and social metadata. |

## Structure and visual checks

- Known routes have the required title pattern, one H1, a main landmark, meta
  description, canonical, OG/Twitter metadata, favicon, and `lang="en"`.
- `/`, `/?demo=1`, `/privacy`, and `/terms` load correctly from their URLs.
  Back/forward and focus work for the SPA routes covered by the suite. The
  failed hash navigation is F-2-1.
- Crawl result: all actual internal links returned 200; the published binary
  redirect returned 302; Sociobot checkout returned 303; `mailto:` links were
  explicit. An injected unknown URL correctly returned 404 and is not a dead
  product link.
- The 404 is designed, product-specific, and structurally complete. No generic
  SaaS-template pattern was observed; the field-guide/receipt visual system is
  distinct and matches `.factory/design.md`.
- No console or page errors occurred on known pages. The expected resource
  error from deliberately loading an unknown URL was the HTTP 404 itself.
- No additional AI, import/export, or sync feature is required by the brief.
  JSON and HTML receipt export already cover the useful export path; remote
  sync would conflict with the explicit local-first, no-customer-data scope.
  No decorative AI feature or provider key was found.

## What would make this perfect

Repair and regression-test F-2-1. After the header Install link reliably
places the installation heading in view (with a useful focus destination),
repeat this full review from a fresh browser context. No other change is
identified by this review.
