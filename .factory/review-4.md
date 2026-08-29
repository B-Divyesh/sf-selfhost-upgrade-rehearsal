# Adversarial first-read review 4 — Self-Host Upgrade Rehearsal

**Verdict: FAIL.** Reviewed 29 August 2026 UTC against the live deployment at
<https://selfhost-upgrade-rehearsal.sociobot.in> in fresh 390×844 and
1440×900 Chromium contexts, and against clean clone
`5ea4bf4164881da3682c8b0ed42c8acf5fde005d`.

The first screen is clear and the demo is immediately useful. The product is
not ready to pass because an absolute customer-safety claim is false for the
hooks the CLI executes, the demo warning stops being visible on a phone, two
earlier findings are not fully closed, and several public statements have no
matching claim entry.

## Cold first read

**390px and desktop: PASS.** Before scrolling, I could answer all three
questions:

- What it does: rehearses a self-hosted Compose or Kubernetes upgrade before
  customers receive it.
- Who it is for: self-hosted product teams preparing those releases.
- What to click first: **Try it with sample data**; the adjacent text says it
  opens the bundled sample demo and its receipt.

The exact text was “Rehearse upgrades before customers do”, “For self-hosted
product teams that need proof before each Compose or Kubernetes release.”, and
“Runs the bundled sample demo and opens its receipt.” The action and all three
facts were fully visible at 390×844 and 1440×900 with no horizontal overflow.

## Findings

### F-4-1 / F-1-2 reopened — BLOCKING — The customer-installation boundary is false for configured hooks

**Location and exact quotes:** landing, Receipt limits: “It does not connect to
customer servers or collect customer data.” and “It does not upgrade a
customer installation.” The registered claim in `.factory/claims.json` says,
“The CLI does not connect to or modify a customer installation.”

**Evidence:** `run_hook` in `src/lib.rs` executes every declared program with
the host `PATH`; it does not restrict absolute paths or network-capable
commands. In a fresh temporary directory I supplied a valid declaration whose
`preflight` hook was `[/usr/bin/touch,
"<temp>/customer-installation/modified-by-rehearsal-hook"]`. The released CLI
created that file, returned exit code 0, and issued a `ready` receipt.

The passing `@claim:customer-boundary` test does not exercise this boundary.
It places a customer URL and path only in declaration `notes`, runs nine
`/usr/bin/true` hooks, and then confirms that an unrelated sentinel is
unchanged. That proves notes are inert, not that hooks cannot connect to or
modify customer installations. README itself acknowledges the same gap:
“Your hook commands may use the network when your test requires it.”

**Why this matters:** a release team could rely on the limit as a safety
guarantee. The actual executable can perform the action the page says it does
not perform. This also means the earlier F-1-2 promise was registered but not
actually verified, so that finding is reopened.

**Concrete fix:** replace the absolute landing claim with: “The CLI has no
built-in network client and does not discover customer installations. Hooks
can access paths and networks you configure.” Narrow `customer-boundary` to
that observable statement and test it. If the absolute boundary is intended,
run hooks in an enforced sandbox and add a hostile hook test that attempts
filesystem and network access outside it.

### F-4-2 — BLOCKING — The demo banner is not persistent at 390px

**Location:** live `/?demo=1`, after scrolling to **Download sample JSON**;
`site/src/styles.css` mobile rule for `.demo-banner`.

**Evidence:** the banner is `position: sticky` on desktop, but the ≤520px rule
changes it to `position: relative`. At 390×844 it began at y=130–239. After
scrolling to the receipt action, `scrollY` was 1724 and the banner was at
y=-1594 to -1485, entirely outside the viewport. The required “Demo — sample
data, nothing is saved”, **Reset demo**, and **Start for real** controls were no
longer visible.

**Why this matters:** the phone user loses the sandbox disclosure precisely
while inspecting and downloading the result. The supplied demo contract
requires a persistent banner, and a weak mobile demo is blocking.

**Concrete fix:** retain sticky positioning at 390px and use a compact wrapping
layout. Add a 390px test that scrolls to the receipt/download action and
asserts the banner plus both controls remain in the viewport.

### F-4-3 / F-1-4 reopened — BLOCKING — README still renames the sample demo

**Location and quote:** README heading, “Try the bundled upgrade”. The site,
demo guide, claim manifest, CLI adapter, and terminology table call the same
isolated example the “sample demo”.

**Why this matters:** this is the exact terminology problem from F-1-4. The
polish reports say “sample demo” was standardized across README, but the first
README task still uses another name. Under the review contract, a half-fixed
earlier finding is blocking again.

**Concrete fix:** change the heading to “Run the sample demo”. Keep “sample
data” only for the records inside that demo.

### F-4-4 — HIGH — The demo makes an unlisted three-workspace claim

**Location and quote:** demo intro: “This sample demo moves three test
workspaces from 1.8.4 to 2.0.0.”

**Evidence:** no `.factory/claims.json` entry promises or tests the number of
workspaces. `demo-receipt` checks versions, nine checks, three config changes,
and receipt fields. `sample-demo-parity` compares only product and versions.

**Why this matters:** “three” appears to describe executed test environments,
but the browser is a recording and the receipt does not expose that count.

**Concrete fix:** either say “This recording shows the Arbor Desk 1.8.4 to
2.0.0 sample demo,” or add a `demo-workspaces` claim whose CLI and browser test
proves exactly three distinct workspaces and defines what a workspace means.

### F-4-5 — HIGH — The mobile compatibility statement is an unlisted claim

**Location and quote:** landing installation section at 390px: “This CLI does
not run on phones or tablets.” The adjacent status also says, “Desktop
downloads are available for macOS, Windows, and Linux.”

**Evidence:** neither statement appears in `.factory/claims.json`.
`release-asset-set` proves a recorded desktop asset list, but does not test the
negative phone/tablet compatibility statement or register this mobile copy.

**Why this matters:** platform support is a release fact a visitor may rely on.

**Concrete fix:** add a `supported-platforms` claim and test the exact supported
OS/architecture matrix against the published assets, then rewrite the copy as
“Install on macOS, Windows, or Linux. No phone or tablet package is provided.”

### F-4-6 — HIGH — The Privacy page adds an untested storage-lifetime claim

**Location and quote:** `/privacy`, Demo storage: “Closing the tab clears
them.”

**Evidence:** `demo-storage-isolation` checks the `demo:` session namespace and
that **Start for real** clears it. It never closes the tab and verifies the
keys are gone in a new tab/session, and its manifest claim does not include the
closing-tab promise.

**Why this matters:** storage lifetime is part of the privacy promise.

**Concrete fix:** add the closing-tab behavior to `demo-storage-isolation` and
test a closed/reopened page in a fresh browser context, or remove the sentence
and state only the tested namespace and exit behavior.

### F-4-7 — HIGH — README development claims are absent from the claim manifest

**Location and exact quotes:** README Develop:

- “Requirements: stable Rust, Node 22, and npm.”
- “`npm test` runs Rust, claim, accessibility, desktop, and 390 px browser
  checks.”
- “`npm run build:site` writes `dist/site/index.html`.”
- “The factory deploys `dist/site`.”

**Evidence:** none has a `.factory/claims.json` entry. I directly confirmed the
test and build statements in this review, but the contract requires each
public claim to remain registered and testable on every build.

**Why this matters:** contributors rely on these statements to choose their
toolchain and deployment artifact; an ad hoc review run is not durable claim
coverage.

**Concrete fix:** add narrowly scoped `development-requirements`,
`test-coverage`, `site-build-output`, and `deploy-directory` entries with
observable tests, or rewrite the section as commands without unsupported
descriptive promises.

### F-4-8 — MINOR — “Start for real” does not name its result

**Location and quote:** demo banner link, “Start for real”.

**Evidence:** the link exits the demo and focuses the “Install one binary”
heading. The label does not say that it opens installation.

**Why this matters:** a result-naming action lets a first-time visitor predict
the navigation without trying it.

**Concrete fix:** rename it to “Install the CLI”.

## Copy audit

Counts treat hyphenated terms, versions, prices, commands, and filenames as one
word. Raw terminal output, code blocks, URLs, and sample data values are not
sentences. Headings, labels, buttons, alternate runtime states, and alt text
are included. No sentence exceeds 22 words and no banned marketing adjective
appears. Flags are the findings above.

### Landing page

| Text | Words | Result |
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
| A field-guide plant grows from stacked containers beside an upgrade receipt. | 11 | pass; image alt text |
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
| Keep the JSON receipt as your release gate. | 8 | pass |
| CLI installation | 2 | pass |
| Install one binary | 3 | pass |
| Checking published downloads… | 3 | pass; transient state |
| Release v0.1.3 is ready for this device. | 7 | pass |
| Desktop downloads are available for macOS, Windows, and Linux. | 9 | **F-4-5** |
| Downloads are being published | 4 | pass; fallback state |
| Download linux-x86_64.tar.gz | 2 | pass; detected desktop variant |
| The download comes from the matching GitHub release. | 8 | pass |
| This CLI does not run on phones or tablets. | 9 | **F-4-5** |
| You can open the release page while packages are prepared. | 10 | pass; fallback state |
| Downloads are being published or this device is offline. | 9 | pass; error state |
| Try again later or open the release page. | 8 | pass; error action sentence |
| Copy macOS and Linux install | 5 | pass |
| Copy Windows install | 3 | pass |
| Copied install command | 3 | pass; success state |
| Select the command below | 4 | pass; clipboard error state |
| Installers verify SHA256 before placing the binary on your path. | 10 | pass |
| Published packages are unsigned. | 4 | pass |
| First run | 2 | pass |
| Receipt limits | 2 | pass |
| Know what the receipt does not prove | 7 | pass |
| It does not connect to customer servers or collect customer data. | 11 | **F-4-1** |
| It does not upgrade a customer installation. | 7 | **F-4-1** |
| Each receipt covers only its listed versions and environments. | 9 | pass |
| Optional paid kit | 3 | pass |
| Run the rehearsal in release CI | 6 | pass; audience-appropriate CI term |
| The $79 one-time Team kit adds a CI checklist for each supported source and target version. | 16 | pass |
| The CLI and both receipt formats stay free. | 8 | pass |
| Sociobot is the merchant of record. | 6 | pass |
| Refunds are handled through Sociobot. | 5 | pass |
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
| Download Team CI kit | 4 | pass; licensed state |
| Self-Host Upgrade Rehearsal | 3 | pass |
| Readiness receipts for self-hosted upgrades. | 5 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v0.1.3 · build 2026.08.29 | 3 | pass |

### README

| Text | Words | Result |
| --- | ---: | --- |
| Self-Host Upgrade Rehearsal | 3 | pass |
| Rehearse self-hosted upgrades and issue a customer-safe readiness receipt. | 9 | pass |
| This CLI is for teams that ship Docker Compose or Kubernetes products. | 12 | pass |
| It checks one declared upgrade path before customers use it. | 10 | pass |
| Website | 1 | pass |
| One-click browser demo | 3 | pass |
| Try the bundled upgrade | 4 | **F-4-3 / F-1-4 reopened** |
| The command creates a temporary Arbor Desk project with sample records. | 11 | pass |
| It prints the paths to JSON and HTML receipts. | 9 | pass |
| The CLI checks backup, restore, and health hooks. | 8 | pass |
| It never includes hook output or sample data in a receipt. | 11 | pass |
| Install | 1 | pass |
| macOS and Linux | 3 | pass |
| Windows PowerShell | 2 | pass |
| Both installers verify SHA256 before placing the binary on `PATH`. | 10 | pass |
| Homebrew packages use the published tap. | 6 | pass |
| Scoop uses the release manifest. | 5 | pass |
| Each release also carries `.deb`, `.rpm`, unsigned macOS `.pkg`, Windows zip, Winget manifests, and checksums. | 15 | pass |
| Declare an upgrade path | 4 | pass |
| Start with a declaration template. | 5 | pass; F-3-1 remains fixed |
| Add your schema files and hook commands before running `rehearsal check`. | 11 | pass |
| The declaration lists only the versions, resources, schemas, and commands the rehearsal needs. | 13 | pass |
| Commands are argument arrays, so no shell parsing happens inside the CLI. | 12 | pass |
| Use `{source_dir}` and `{work_dir}` as path placeholders. | 7 | pass |
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
| Your hook commands may use the network when your test requires it. | 12 | pass; necessary boundary caveat |
| Schema comparison records paths and value types. | 7 | pass |
| It does not copy schema values into the receipt. | 9 | pass |
| A receipt covers only the versions and environments printed on it. | 11 | pass |
| It is not proof for an unlisted customer system. | 9 | pass |
| Team kit | 2 | pass |
| The free CLI includes both receipt formats. | 7 | pass |
| The optional $79 one-time Team kit adds a CI checklist for each supported source and target version. | 17 | pass |
| License purchase and verification use the Sociobot billing API. | 9 | pass |
| No payment provider is embedded in this repository. | 8 | pass |
| Develop | 1 | pass |
| Requirements: stable Rust, Node 22, and npm. | 7 | **F-4-7** |
| `npm test` runs Rust, claim, accessibility, desktop, and 390 px browser checks. | 12 | **F-4-7** |
| `npm run build:site` writes `dist/site/index.html`. | 5 | **F-4-7** |
| Run the site locally | 4 | pass |
| Package the Rust crate without publishing it | 7 | pass |
| The factory deploys `dist/site`. | 4 | **F-4-7** |
| Tag a version such as `v0.1.3` to run the cross-platform GitHub release workflow. | 13 | pass |
| License | 1 | pass |
| MIT. | 1 | pass |
| See LICENSE. | 2 | pass |

### Terminology check

| Concept | Expected term | Observed exception |
| --- | --- | --- |
| YAML input | declaration | none |
| Vendor command | test command / schema field `hooks` | none |
| Customer-facing result | receipt | none |
| Isolated example | sample demo | README “bundled upgrade” — F-4-3 |
| Paid CI download | Team kit | none |
| Tested source-to-target change | upgrade path | none |

## Demo, sandbox, and CLI evidence

- One click from the live first screen opened `/?demo=1`. Its first 390px
  screen already showed Arbor Desk 1.8.4 → 2.0.0 and realistic backup,
  restore, and health output.
- The downloaded `arbor-desk-readiness.json` parsed as schema 1, `ready`, nine
  checks, and `customer_safe: true`.
- A pre-seeded `localStorage["real:sentinel"]` and
  `sessionStorage["real:session"]` survived demo entry, Reset, and Start for
  real. Demo entry used only `sessionStorage["demo:active"]`; Start for real
  cleared it and focused `#install-title`.
- After the initial page load, offline Reset replayed through `READY`. The
  request log contained only same-origin document, JS, CSS, image, and release
  manifest requests; no project upload or tracker appeared.
- The banner itself fails mobile persistence as described in F-4-2.
- All CLI checks ran from temporary directories. The controlled boundary
  probe in F-4-1 created only a marker inside its disposable test directory.

## Claims results

`.factory/claims.json` contains 41 entries and the source contains exactly one
matching `@claim:<id>` test for each. I invoked every listed command separately
from the clean clone. All commands exited 0:

| Claim | Result | Claim | Result |
| --- | --- | --- | --- |
| demo-receipt | PASS | offline-demo | PASS |
| demo-network-privacy | PASS | cli-receipts | PASS |
| upgrade-hooks | PASS | declared-resource-minimums | PASS |
| compose-kubernetes-declarations | PASS | installer-checksum | PASS |
| mit-core | PASS | schema-redaction | PASS |
| customer-safe-receipt | PASS | temporary-workspace | PASS |
| argument-arrays | PASS | exit-codes | PASS |
| unsigned-packages | PASS | cli-no-upload | PASS |
| team-kit-license | PASS | declared-upgrade-path | PASS |
| customer-boundary | PASS, inadequate; F-4-1 | receipt-scope | PASS |
| team-kit-price-scope | PASS | free-cli-formats | PASS |
| sociobot-merchant | PASS | sociobot-refunds | PASS |
| sociobot-checkout | PASS | published-platform-download | PASS |
| homebrew-tap | PASS | scoop-manifest | PASS |
| release-asset-set | PASS | receipt-contents | PASS |
| release-workflow | PASS | sample-demo-parity | PASS |
| sociobot-license-api | PASS | no-embedded-payment-provider | PASS |
| demo-storage-isolation | PASS | starter-templates | PASS |
| json-output | PASS | release-manifest | PASS |
| license-browser-storage | PASS | no-card-collection | PASS |
| dodo-checkout-processing | PASS |  |  |

Passing the registered tests does not clear the unlisted claims in F-4-4
through F-4-7 or the inadequate boundary assertion in F-4-1.

The unfiltered clean-clone suite also passed: 5 Rust tests and 103 Playwright
tests passed, with 4 intentional platform-specific skips. `npm run build`
produced the release binary and `dist/site`; initial JS was 7,633 bytes gzip.
The live landing HTML, JS, CSS, and `latest.json` matched the clean build
byte-for-byte.

## Earlier-history verification

Every earlier review and polish report plus the prior handoff was read. Each
finding was checked in both the live site and current source.

| Earlier finding | Review 4 verification |
| --- | --- |
| F-1-1 | Fixed: an unknown URL returns HTTP 404 with the complete product header/footer, legal links, recovery action, and route metadata. |
| F-1-2 | **Reopened as F-4-1:** the claim is now listed, but the hostile test does not exercise hooks and the live absolute boundary is false. |
| F-1-3 | Fixed for its listed README release, receipt, installer, and billing quotes; all matching commands passed. New development-copy omissions are F-4-7. |
| F-1-4 | **Reopened as F-4-3:** README still says “bundled upgrade” for the sample demo. |
| F-1-5 | Fixed: hero label is “Upgrade rehearsal for self-hosted products.” |
| F-1-6 | Fixed: “Plate I” is absent from live copy and source. |
| F-1-7 | Fixed: caption names tested versions and supported environments. |
| F-1-8 | Fixed: section label is “Sample terminal recording.” |
| F-1-9 | Fixed: heading is “Sample upgrade rehearsal.” |
| F-1-10 | Fixed: headings name the workflow and its declare/run/share steps. |
| F-1-11 | Fixed: installation label is “CLI installation.” |
| F-1-12 | Fixed: limits label is “Receipt limits.” |
| F-1-13 | Fixed: paid copy names the CI checklist and supported version pairs. |
| F-1-14 | Fixed: preview labels say “Tested versions” and “Schema changes / 3 changes.” |
| F-1-15 | Fixed: headings say “Run the test commands” and “Run the rehearsal in release CI.” |
| F-1-16 | Fixed: README names versions, resources, schemas, and commands directly. |
| F-1-17 | Fixed: Demo, Privacy, Terms, and 404 have distinct title, description, canonical, and social metadata. |
| F-2-1 | Fixed: Install reached `/#install`, placed the section at y=0.22px, and focused `install-title` at 390px. |
| F-3-1 | Fixed: README and CLI say “declaration template,” name the missing schemas/hooks, and the starter-template claim passed. |

## Structure, accessibility, links, and visual identity

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown
  route returned a designed HTTP 404. Each route had `lang=en`, one H1, one
  main, header/footer, route title, description, canonical, OG/Twitter data,
  favicon, and no horizontal overflow.
- History navigation moved focus to the destination H1. Back restored the
  landing H1. The install deep link focused its heading and scrolled it into
  view.
- Axe found zero violations on landing, demo, Privacy, Terms, and 404 at both
  390×844 and 1440×900. Known routes produced no console or page errors; the
  deliberate unknown URL produced only the expected HTTP 404 resource error.
- Every discovered internal link returned 200. The published binary returned
  a valid 302 release-asset redirect, checkout returned a 303 to Dodo, and the
  Param Factory link returned 200. `mailto:` links were explicit.
- Response headers carry CSP `frame-ancestors`, content-type protection,
  referrer policy, permissions policy, and HSTS. No third-party font, script,
  analytics, or tracker loaded.
- The herbarium-sheet palette, botanical plate, editorial asymmetry, serif /
  monospace pairing, clipped receipt panels, and inspection stamp are distinct
  and match `.factory/design.md`. This is not a generic SaaS template.

## Missed leverage

No additional AI feature is justified: the core job is deterministic command
execution and evidence generation, and model output would weaken that proof.
JSON and HTML already provide the obvious export paths. Remote sync would
conflict with the explicit local/no-customer-data boundary. The missing
leverage is not AI or sync; it is an enforced hook sandbox if the product wants
to keep the absolute safety claim in F-4-1.

## What would make this perfect

Close all eight findings. In particular, either enforce the advertised
customer-installation boundary or narrow the copy and claim test honestly;
keep the demo banner visible while a phone user scrolls; standardize “sample
demo”; register every public claim; and rename the demo exit action. Then rerun
all 41 claim commands plus the complete mobile/desktop review from clean state.
