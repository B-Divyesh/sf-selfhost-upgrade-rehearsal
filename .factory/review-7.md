# Adversarial first-read review 7 — Self-Host Upgrade Rehearsal

**Verdict: PASS.** Reviewed 30 August 2026 UTC against the live deployment at
https://selfhost-upgrade-rehearsal.sociobot.in and a fresh clone at
e496dd039a6a6c29b4b4d95c4cc1ff14b1c1e8fe.

There are no findings. The result is clear on a first read, the sample demo is
immediate and isolated, every declared claim was exercised independently from
the clean clone, and the earlier findings remain fixed in live behavior and
source.

## Cold first read

**390 × 844: PASS.** Before scrolling, the page states:

- It does: “Rehearse upgrades before customers do.”
- It is for: “self-hosted product teams that need proof before each Compose or
  Kubernetes release.”
- First action: **Try it with sample data**. The adjacent explanation is
  “Runs the bundled sample demo and opens its receipt.”

The action and all three facts are visible without horizontal overflow. The
same answers and action are visible in a cold 1440 × 900 context. This is not
a first-screen blocker.

## Findings

None.

## Copy audit

Counts treat hyphenated terms, version strings, prices, commands, and file
names as one word. Code blocks, URLs, and terminal output are excluded. Every
visible landing sentence or label and every README sentence or heading is
listed below. No prose is over 22 words. No banned marketing adjective,
unexplained metaphor, inconsistent product term, context-free heading, or
non-result-naming button remains.

### Landing page

| Copy | Words |
| --- | ---: |
| Upgrade Rehearsal | 2 |
| Demo / Install / Privacy | 1 / 1 / 1 |
| Upgrade rehearsal for self-hosted products | 5 |
| Rehearse upgrades before customers do | 5 |
| For self-hosted product teams that need proof before each Compose or Kubernetes release. | 13 |
| Try it with sample data | 5 |
| Runs the bundled sample demo and opens its receipt. | 9 |
| The demo uploads no project data. | 6 |
| The bundled demo runs offline after this page loads. | 9 |
| The core CLI is free under the MIT License. | 9 |
| A receipt names the tested versions and supported environments. | 9 |
| Sample terminal recording / Sample upgrade rehearsal | 3 / 3 |
| This recording uses the bundled sample demo from rehearsal demo. | 10 |
| Play recording / Pause recording / Resume recording / Replay recording | 2 / 2 / 2 / 2 |
| Tested versions / Backup and restore / Passed / Schema changes / 3 changes / Ready | 2 / 3 / 1 / 2 / 2 / 1 |
| How the upgrade rehearsal works / Declare, run, and share a receipt | 5 / 6 |
| Declare the path | 3 |
| Name both versions, supported systems, resource minimums, schemas, and hook commands. | 11 |
| Run the test commands | 4 |
| The CLI uses a new temporary directory for sample data, backup, restore, and health checks. | 15 |
| Give customers the receipt / Share the HTML receipt. / Keep the JSON receipt as your release gate. | 4 / 4 / 8 |
| CLI installation / Install one binary | 2 / 3 |
| Checking published downloads… | 3 |
| Release vX.Y.Z is ready for this device. | 7 |
| Install on macOS, Windows, or Linux. / No phone or tablet package is provided. | 6 / 7 |
| Open GitHub releases | 3 |
| The download comes from the matching GitHub release. | 8 |
| You can open the release page while packages are prepared. | 10 |
| Downloads are being published or this device is offline. | 9 |
| Try again later or open the release page. | 8 |
| Copy macOS and Linux install / Copy Windows install | 5 / 4 |
| Copied install command / Select the command below | 3 / 4 |
| Installers verify SHA256 before placing the binary on your path. | 10 |
| Published packages are unsigned. / First run | 4 / 2 |
| Receipt limits / Know what the receipt does not prove | 2 / 7 |
| The CLI has no built-in network client and does not discover customer installations. | 13 |
| Hooks can access paths and networks you configure. | 8 |
| Each receipt covers only its listed versions and environments. | 9 |
| Optional paid kit / Run the rehearsal in release CI | 3 / 6 |
| The $79 one-time Team kit adds a CI checklist for each supported source and target version. | 16 |
| The CLI and both receipt formats stay free. | 8 |
| Dodo Payments is the merchant of record. / Dodo Payments handles order questions and returns. | 7 / 8 |
| Buy the Team kit — $79 | 5 |
| Have a license? Paste it / Verify license | 5 / 2 |
| Payment opens Sociobot checkout. | 4 |
| Paste a license token, then verify it. | 7 |
| Checking this license… / Team kit active. / License no longer active. | 3 / 3 / 4 |
| You can buy a new license. | 6 |
| The license check is offline. / Try again when connected. | 5 / 4 |
| Download Team CI kit | 4 |
| Readiness receipts for self-hosted upgrades. | 5 |
| Privacy / Terms / Built by Param Factory / v0.1.5 · build 2026.08.30 | 1 / 1 / 4 / 3 |

### README

| Copy | Words |
| --- | ---: |
| Self-Host Upgrade Rehearsal | 3 |
| Rehearse self-hosted upgrades and issue a customer-safe readiness receipt. | 9 |
| This CLI is for teams that ship Docker Compose or Kubernetes products. | 12 |
| It checks one declared upgrade path before customers use it. | 10 |
| Website / One-click browser demo / Run the sample demo | 1 / 3 / 4 |
| The command creates a temporary Arbor Desk project with sample records. | 11 |
| It prints the paths to JSON and HTML receipts. | 9 |
| The CLI checks backup, restore, and health hooks. | 8 |
| It never includes hook output or sample data in a receipt. | 11 |
| Install / macOS and Linux / Windows PowerShell | 1 / 3 / 2 |
| Both installers verify SHA256 before placing the binary on PATH. | 10 |
| Homebrew packages use the published tap. / Scoop uses the published bucket. | 6 / 5 |
| Release v0.1.5 includes deb, rpm, unsigned macOS pkg, Windows zip, Winget manifests, SHA256SUMS, and latest.json. | 15 |
| Verify and roll back an installer | 6 |
| The installers download the matching release SHA256SUMS file and check the archive before installing it. | 15 |
| Release v0.1.5 has GitHub provenance for every asset; verify it with GitHub CLI: | 13 |
| To install an earlier tagged release, set REHEARSAL_VERSION to its full tag. | 12 |
| The installer checks that release's checksum before replacing the binary: | 10 |
| Declare an upgrade path / Start with a declaration template: | 4 / 5 |
| Add your schema files and hook commands before running rehearsal check. | 11 |
| The declaration lists only the versions, resources, schemas, and commands the rehearsal needs: | 12 |
| Commands are argument arrays, so no shell parsing happens inside the CLI. | 11 |
| Use source_dir and work_dir as path placeholders. | 7 |
| Validate and run | 3 |
| check validates Compose and Kubernetes declarations before launch. | 7 |
| run executes hooks in a new temporary directory. | 8 |
| The result contains schema key changes, declared resource minimums, checks, tested versions, and supported environments. | 13 |
| It writes readiness.json and readiness.html. | 5 |
| Use --json with check, run, or demo for scripts. | 10 |
| A failed check returns exit code 1. / Invalid input returns exit code 2. | 7 / 6 |
| Privacy and limits | 3 |
| The CLI has no built-in network client or telemetry path. | 10 |
| Your hook commands may use the network when your test requires it. | 11 |
| Schema comparison records paths and value types. | 7 |
| It does not copy schema values into the receipt. | 10 |
| A receipt covers only the versions and environments printed on it. | 11 |
| It is not proof for an unlisted customer system. | 9 |
| Team kit | 2 |
| The free CLI includes both receipt formats. | 7 |
| The optional $79 one-time Team kit adds a CI checklist for each supported source and target version. | 17 |
| License purchase and verification use the Sociobot billing API. | 9 |
| No payment provider is embedded in this repository. | 8 |
| Develop / Requirements: stable Rust, Node 22, and npm. | 1 / 7 |
| npm test runs Rust, claim, accessibility, desktop, and 390 px browser checks. | 12 |
| npm run build:site writes dist/site/index.html. | 5 |
| Run the site locally / Package the Rust crate without publishing it | 4 / 8 |
| The complete deployable static site is in dist/site. | 8 |
| Tag a version such as v0.1.5 to run the cross-platform GitHub release workflow. | 14 |
| License / MIT. / See LICENSE. | 1 / 1 / 3 |

Terminology is consistent: **declaration** is the YAML input, **test command**
is the operator term for a hook, **receipt** is the customer-facing result,
**sample demo** is the bundled example, **Team kit** is the paid download, and
**upgrade path** is the tested source-to-target change.

## Demo, sandbox, and privacy

The first screen after the one-click action is already a completed, realistic
Arbor Desk 1.8.4 → 2.0.0 rehearsal. It shows nine checks, resource minimums,
schema changes, receipt limits, and a downloadable sample JSON receipt. The
visible sticky disclosure reads “Demo — sample data, nothing is saved” and has
working **Reset demo** and **Install the CLI** controls.

In a fresh 390 px browser context, the full demo flow made three bodyless
same-origin GET requests only. Reset cleared demo-prefixed session keys; a
separately written real-data local-storage sentinel remained unchanged. The
demo did not read the real license namespace. The declared offline replay path
is also covered by its isolated browser claim test. The CLI sample path is
exercised in a fresh temporary directory by its receipt, hook, workspace,
output-path, and parity claim tests.

## Claims and clean-clone verification

The claims manifest contains 48 unique entries and the source contains one
matching unique claim test tag for each. Every listed command was run
independently from /tmp/selfhost-review7-clean, a fresh clone of the supplied
commit, after npm ci; all passed. This includes the privacy request log,
offline demo, customer boundary, receipt redaction, checkout fixture, release
identity/provenance, installers, platform assets, Homebrew, Scoop, and CLI
temporary-workspace checks.

Landing and README claim-like sentences map to these entries. In particular,
the live release metadata/fallback wording is covered by release-metadata,
download wording by published-platform-download, the three demo facts by their
respective demo/privacy/license entries, and each README operational or
distribution statement by a distinct manifest entry. No unlisted claim was
found.

## Earlier findings

Read every earlier review, polish record, and the preceding handoff. The
following was rechecked against live behavior and source, rather than accepted
from a prior closure note.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | A missing live URL returns the styled HTTP 404 with skip link, header, footer, legal links, route metadata, and Return home. |
| F-1-2 | Landing claims are listed and have observable tests. |
| F-1-3 | README claims are listed and have observable tests. |
| F-1-4 | Browser, CLI, README, and demo documentation use “sample demo.” |
| F-1-5 | The hero label names the product task. |
| F-1-6 | The decorative “Plate I” label is absent. |
| F-1-7 | The caption names tested versions and supported environments. |
| F-1-8 | The recording section is named “Sample terminal recording.” |
| F-1-9 | The preview heading is “Sample upgrade rehearsal.” |
| F-1-10 | Workflow headings name declaring, running, and sharing. |
| F-1-11 | The installation section is named “CLI installation.” |
| F-1-12 | The limits section is named “Receipt limits.” |
| F-1-13 | Paid scope names a CI checklist and supported version pairs. |
| F-1-14 | Preview data names tested versions and schema changes. |
| F-1-15 | Test-command and release-CI headings are plain language. |
| F-1-16 | README names the declaration fields directly. |
| F-1-17 | Demo, Privacy, Terms, and 404 metadata is route-specific. |
| F-2-1 | /#install scrolls the section into view, focuses install-title, and announces CLI installation. |
| F-3-1 | README calls it a declaration template and names the schemas/hooks still needed. |
| F-4-1 | Limits distinguish no built-in discovery/network client from explicitly configured hook access. |
| F-4-2 | At 390 px, the demo disclosure and its 44 px controls remain sticky at the receipt. |
| F-4-3 | README says “Run the sample demo.” |
| F-4-4 | The unproved three-workspace statement is absent. |
| F-4-5 | Platform wording accurately names macOS, Windows, Linux, and no phone/tablet package. |
| F-4-6 | Demo session storage is isolated and clears on reset/exit/closed context without changing real storage. |
| F-4-7 | Development requirements, test coverage, site output, and deploy directory have claim coverage. |
| F-4-8 | The demo exit action is “Install the CLI.” |
| F-5-1 | Dodo merchant/order-question/return wording is supported by product-specific recorded checkout evidence. |
| F-5-2 | v0.1.5 fixtures, assets, provenance, package-manager references, and placeholders agree with source and tests. |
| F-5-3 | The active release fallback names its result: “Open GitHub releases.” |
| F-6-1 | The workspace test observes seed, backup, restore, and health in one new OS-temporary directory per run. |
| F-6-2 | The sample-demo output-path promise has the receipt-path-output claim. |

## Structure, accessibility, and links

The landing, query demo, /demo, /privacy, /terms, and unknown-route 404 all
have the required title pattern, description, canonical, social metadata,
favicon, one H1, one main, common header/footer, Privacy/Terms links, and no
390 px overflow. Direct route loads work. Demo navigation and browser Back
both move focus to the route H1; the Install link reaches the section and
focuses its H2. The static deployment configuration supplies the navigation
fallback, real 404 rewrite, CSP, and security headers. robots.txt and the
sitemap list public routes.

The live link crawl found all internal links at 200 (the intentionally missing
route at 404), mail links explicit, the GitHub artifact redirecting to 200,
Sociobot at 200, and product checkout redirecting 303 then reaching 200. The
page has a distinct, coherent herbarium/workbench identity rather than a
generic SaaS surface: original field-guide art, paper/ink palette, serif and
monospace pairing, receipt rules, and a restrained inspection-stamp motion
with reduced-motion fallback.

npm run build produced dist/site; npm run lint passed. The built static site is
well below the JavaScript budget. Fresh browser checks found no application
console errors on valid routes and no serious or critical Axe issues in the
project accessibility suite.

## Missed leverage

No additional AI step is implied by the brief. This is a deterministic
local-first upgrade rehearsal: adding model calls would expose operator inputs
without improving its core validation. The useful implied capabilities—sample
run, Compose/Kubernetes declarations, receipts, JSON/HTML export, package
installation, and optional CI checklist—are present. No provider key is
embedded.

## What would make this perfect

Nothing further is required for the stated product contract. Preserve the
existing claim-to-test discipline when changing release versions, payment
copy, or the sample fixture.

