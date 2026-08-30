# Adversarial first-read review 6 — Self-Host Upgrade Rehearsal

**Verdict: FAIL.** Reviewed 30 August 2026 UTC against
<https://selfhost-upgrade-rehearsal.sociobot.in> in fresh 390×844 and
1440×900 Chromium contexts, and against a fresh clone of
`ed30ad7e566a5ec80198ad42e22eb1a90a35fbc3`.

The first screen, one-click demo, routing, accessibility, release artifacts,
and all 47 command exits pass. The zero-finding standard is not met. One
registered claim test never observes the isolation it promises, and one README
promise has no claim entry or test.

## Cold first read

**390px: PASS.** Before scrolling, I could answer all three questions:

- What it does: rehearses a Compose or Kubernetes upgrade before customers
  receive it.
- Who it is for: self-hosted product teams preparing a release.
- What to click first: **Try it with sample data**. The adjacent sentence says
  it opens the bundled sample demo and its receipt.

The exact text was “Rehearse upgrades before customers do,” “For self-hosted
product teams that need proof before each Compose or Kubernetes release,” and
“Runs the bundled sample demo and opens its receipt.” The action and all three
facts were visible inside the initial 390×844 viewport. Document width equalled
viewport width.

**Desktop: PASS.** The same job, audience, action, next result, and facts were
visible before scrolling at 1440×900.

## Findings

### F-6-1 — BLOCKING — The temporary-workspace claim test never observes a temporary workspace

**Exact quotes and locations:** landing, “The CLI uses a new temporary
directory for sample data, backup, restore, and health checks”; README,
“`run` executes hooks in a new temporary directory”; `.factory/claims.json`,
“The CLI uses a new temporary directory for rehearsal seed, backup, restore,
and health checks.”

**Evidence:** `e2e/site.spec.ts:335-340` runs `rehearsal demo --json`, parses
stdout, and asserts only `status: ready` plus the shape of the run ID. It does
not capture a workspace path, inspect any hook's working directory, compare
two runs for unique directories, or prove that seed, backup, restore, and
health shared the isolated directory. The separate `path-placeholders` test
observes only the preflight hook and is tagged for another claim. All 47 exact
commands exit zero, but this one can still pass if the CLI runs every promised
hook in the source directory.

**Why a visitor is misled:** workspace isolation is a safety boundary for a
tool that executes vendor commands. A READY receipt and a random-looking run
ID do not prove that boundary.

**Concrete fix:** instrument seed, backup, restore, and health hooks in a fresh
declaration to append their resolved working directory to an observation file
outside the workspace. Assert that all four received the same newly created
OS-temporary path, that it differs across two runs, and that it is not the
declaration directory. Keep this under the single
`@claim:temporary-workspace` tag.

### F-6-2 / F-1-3 reopened — HIGH — README promises printed receipt paths without a claim entry

**Exact quote and location:** `README.md:16`, “It prints the paths to JSON and
HTML receipts.”

**Evidence:** no `.factory/claims.json` entry claims that either path is
printed. `cli-receipts` promises and tests only that the files are written;
its test ignores stdout. `temporary-workspace` uses `--json`, where stdout is
the receipt rather than the two path lines. This sentence was present in the
earlier copy inventory, but the repeated closure of F-1-3 did not add
observable coverage for it.

**Why a visitor is misled:** a CLI user relies on those lines to locate the
generated files. The suite can stay green if both path lines disappear.

**Concrete fix:** add a claim such as `receipt-path-output`, run `rehearsal
demo` without `--json` in a fresh temporary directory, parse the `JSON:` and
`HTML:` lines, and assert both printed paths exist and contain the expected
receipt formats. Alternatively, remove the sentence.

## Copy audit

Counts use whitespace-delimited words; hyphenated terms, versions, filenames,
and commands count as one word. Terminal output, fenced code, raw URLs, and
sample values are not prose sentences. Headings, labels, actions, alternate
runtime states, and image alt text are included. No item exceeds 22 words. No
banned marketing word, metaphor heading, mood slogan, inconsistent product
term, or non-result-naming button remains. Claim-coverage flags are shown.

### Landing page

| Sentence or label | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | pass |
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
| rehearsal · sample | 2 | pass; terminal label |
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
| The CLI uses a new temporary directory for sample data, backup, restore, and health checks. | 15 | **F-6-1** |
| Give customers the receipt | 4 | pass |
| Share the HTML receipt. | 4 | pass |
| Keep the JSON receipt as your release gate. | 8 | pass |
| CLI installation | 2 | pass |
| Install one binary | 3 | pass |
| Checking published downloads… | 3 | pass; transient state |
| Release v0.1.5 is ready for this device. | 7 | pass |
| Install on macOS, Windows, or Linux. | 6 | pass; mobile state |
| No phone or tablet package is provided. | 7 | pass; mobile state |
| Open GitHub releases | 3 | pass; fallback action |
| Download linux-x86_64.tar.gz | 2 | pass; detected variant |
| The download comes from the matching GitHub release. | 8 | pass |
| You can open the release page while packages are prepared. | 10 | pass; initial state |
| Downloads are being published or this device is offline. | 9 | pass; error state |
| Try again later or open the release page. | 8 | pass; recovery state |
| Copy macOS and Linux install | 5 | pass |
| Copy Windows install | 3 | pass |
| Copied install command | 3 | pass; completion state |
| Select the command below | 4 | pass; recovery state |
| Installers verify SHA256 before placing the binary on your path. | 10 | pass |
| Published packages are unsigned. | 4 | pass |
| First run | 2 | pass |
| Receipt limits | 2 | pass |
| Know what the receipt does not prove | 7 | pass |
| The CLI has no built-in network client and does not discover customer installations. | 13 | pass |
| Hooks can access paths and networks you configure. | 8 | pass |
| Each receipt covers only its listed versions and environments. | 9 | pass |
| Team CI Kit | 3 | pass; decorative visible label |
| Optional paid kit | 3 | pass |
| Run the rehearsal in release CI | 6 | pass |
| The $79 one-time Team kit adds a CI checklist for each supported source and target version. | 16 | pass |
| The CLI and both receipt formats stay free. | 8 | pass |
| Dodo Payments is the merchant of record. | 7 | pass |
| Dodo Payments handles order questions and returns. | 7 | pass |
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
| Built by Param Factory (external site) | 6 | pass |
| v0.1.5 · build 2026.08.30 | 3 | pass |

### README

| Sentence, heading, or label | Words | Result |
| --- | ---: | --- |
| Self-Host Upgrade Rehearsal | 3 | pass |
| Rehearse self-hosted upgrades and issue a customer-safe readiness receipt. | 9 | pass |
| This CLI is for teams that ship Docker Compose or Kubernetes products. | 12 | pass |
| It checks one declared upgrade path before customers use it. | 10 | pass |
| Website | 1 | pass |
| One-click browser demo | 3 | pass |
| Run the sample demo | 4 | pass |
| The command creates a temporary Arbor Desk project with sample records. | 11 | pass |
| It prints the paths to JSON and HTML receipts. | 9 | **F-6-2 / F-1-3 reopened** |
| The CLI checks backup, restore, and health hooks. | 8 | pass |
| It never includes hook output or sample data in a receipt. | 11 | pass |
| Install | 1 | pass |
| macOS and Linux | 3 | pass |
| Windows PowerShell | 2 | pass |
| Both installers verify SHA256 before placing the binary on `PATH`. | 10 | pass |
| Homebrew packages use the published tap. | 6 | pass |
| Scoop uses the published bucket. | 5 | pass |
| Release v0.1.5 includes `.deb`, `.rpm`, unsigned macOS `.pkg`, Windows zip, Winget manifests, `SHA256SUMS`, and `latest.json`. | 15 | pass |
| Verify and roll back an installer | 6 | pass |
| The installers download the matching release `SHA256SUMS` file and check the archive before installing it. | 15 | pass |
| Release v0.1.5 has GitHub provenance for every asset; verify it with GitHub CLI. | 13 | pass |
| To install an earlier tagged release, set `REHEARSAL_VERSION` to its full tag. | 12 | pass |
| The installer checks that release's checksum before replacing the binary. | 10 | pass |
| Declare an upgrade path | 4 | pass |
| Start with a declaration template. | 5 | pass |
| Add your schema files and hook commands before running `rehearsal check`. | 11 | pass |
| The declaration lists only the versions, resources, schemas, and commands the rehearsal needs. | 13 | pass |
| Commands are argument arrays, so no shell parsing happens inside the CLI. | 12 | pass |
| Use `{source_dir}` and `{work_dir}` as path placeholders. | 7 | pass |
| Validate and run | 3 | pass |
| `check` validates Compose and Kubernetes declarations before launch. | 8 | pass |
| `run` executes hooks in a new temporary directory. | 8 | **F-6-1** |
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
| The optional $79 one-time Team kit adds a CI checklist for each supported source and target version. | 17 | pass |
| License purchase and verification use the Sociobot billing API. | 9 | pass |
| No payment provider is embedded in this repository. | 8 | pass |
| Develop | 1 | pass |
| Requirements: stable Rust, Node 22, and npm. | 7 | pass |
| `npm test` runs Rust, claim, accessibility, desktop, and 390 px browser checks. | 12 | pass |
| `npm run build:site` writes `dist/site/index.html`. | 5 | pass |
| Run the site locally | 4 | pass |
| Package the Rust crate without publishing it | 7 | pass |
| The complete deployable static site is in `dist/site`. | 8 | pass |
| Tag a version such as `v0.1.5` to run the cross-platform GitHub release workflow. | 13 | pass |
| License | 1 | pass |
| MIT. | 1 | pass |
| See LICENSE. | 2 | pass |

Terminology is consistent: YAML input is a **declaration**, the isolated
example is the **sample demo**, the customer-facing output is a **receipt**,
and the paid download is the **Team kit**. Compose, Kubernetes, CLI, JSON,
SHA256, hooks, schemas, CI, and provenance are necessary terms for the stated
release-engineering audience.

## Demo and sandbox behavior

- **One click: PASS.** The first-screen action opens `/?demo=1` in one click.
- **Useful immediately: PASS.** The initial 390px demo viewport shows the
  persistent sandbox banner, Arbor Desk 1.8.4→2.0.0, and realistic preflight,
  seed, backup, restore, and health output. The populated receipt reports
  READY, nine passed checks, three schema changes, memory, disk, and scope.
- **Banner and Reset: PASS.** At the receipt, the 390px banner remained sticky
  at y=0–81.19. Both controls were 44px high. Reset replayed to READY, including
  while offline.
- **Isolation: PASS for browser state.** `real:project` and `real:session`
  sentinels survived entry, Reset, and exit. Demo entry used
  `sessionStorage["demo:active"]`; exit and tab close removed demo keys without
  changing real storage. **Install the CLI** reached `/#install` and focused
  `#install-title`.
- **Requests: PASS.** Direct demo entry, Reset, and receipt download made only
  same-origin GET requests with no bodies. There were no trackers, third-party
  scripts, or project uploads. The landing page's separate public GitHub
  release lookup is disclosed on Privacy.
- **CLI demo: PASS.** In a new temporary directory,
  `target/release/rehearsal demo --output <temp>/sample --json` produced READY,
  customer-safe JSON and HTML receipts for Arbor Desk 1.8.4→2.0.0 with nine
  checks. This does not close F-6-1 because the internal hook workspace was not
  observed.

## Claims

The fresh clone contains 47 unique manifest IDs and exactly 47 matching unique
`@claim:` tags. Every exact `test` command was invoked independently; all 47
exited zero. There were no unrun manifest entries.

`demo-receipt`, `offline-demo`, `demo-network-privacy`, `cli-receipts`,
`upgrade-hooks`, `declared-resource-minimums`,
`compose-kubernetes-declarations`, `installer-checksum`,
`installer-provenance-rollback`, `mit-core`, `schema-redaction`,
`customer-safe-receipt`, `temporary-workspace`, `argument-arrays`,
`exit-codes`, `unsigned-packages`, `cli-no-upload`, `team-kit-license`,
`declared-upgrade-path`, `customer-boundary`, `receipt-scope`,
`team-kit-price-scope`, `free-cli-formats`, `dodo-merchant-returns`,
`sociobot-checkout`, `published-platform-download`, `supported-platforms`,
`homebrew-tap`, `scoop-manifest`, `release-asset-set`, `path-placeholders`,
`receipt-contents`, `release-workflow`, `sample-demo-parity`,
`sociobot-license-api`, `no-embedded-payment-provider`,
`demo-storage-isolation`, `starter-templates`, `json-output`,
`release-metadata`, `license-browser-storage`, `no-card-collection`,
`dodo-checkout-processing`, `development-requirements`, `test-coverage`,
`site-build-output`, and `deploy-directory`: **command PASS**.

`temporary-workspace` remains **coverage FAIL** for F-6-1. Command success
does not make an unobserved outcome tested. The README path-output promise is
an **unlisted claim** under F-6-2.

Live cross-checks confirmed v0.1.5 release assets and digests, the current
Homebrew formula, the current Scoop manifest, GitHub provenance, a 303 from
the product-specific Sociobot checkout to Dodo, and Dodo's merchant/returns
footer. The live release identifies product code commit
`9f8afa90811ff94c9acff8c5f1c943c5abe052b2`; the reviewed HEAD differs only by
later factory verification documentation.

The unfiltered clean-clone checks also passed: 6 Rust tests, 3 identity tests,
and 123 Playwright tests passed with 5 intentional project-specific skips.
`npm run lint`, `npm run build`, and `cargo package --locked` passed.
`dist/site` was produced; initial JavaScript is 22.95 kB raw and 7.78 kB gzip.

## Earlier-history verification

Every earlier review, polish report, and the prior handoff was read. Each
finding was checked in the live site and current source; prior closure labels
were not treated as evidence.

| Earlier finding | Review 6 verification |
| --- | --- |
| F-1-1 | Fixed: unknown URLs return HTTP 404 with the full shell, metadata, legal links, and recovery action. |
| F-1-2 | Fixed for its exact landing claims: current boundary, paid, receipt-scope, checkout, and release statements are registered and observably covered. |
| F-1-3 | **Reopened as F-6-2:** its listed release claims are fixed, but the existing README path-output promise still lacks a manifest entry. |
| F-1-4 | Fixed: site, CLI, README, and demo guide use “sample demo.” |
| F-1-5 | Fixed: the hero label names self-hosted upgrade rehearsal. |
| F-1-6 | Fixed: “Plate I” is absent. |
| F-1-7 | Fixed: the caption names tested versions and supported environments. |
| F-1-8 | Fixed: the section label is “Sample terminal recording.” |
| F-1-9 | Fixed: the heading is “Sample upgrade rehearsal.” |
| F-1-10 | Fixed: workflow headings name declare, run, and share steps. |
| F-1-11 | Fixed: the installation label is “CLI installation.” |
| F-1-12 | Fixed: the limits label is “Receipt limits.” |
| F-1-13 | Fixed: paid copy names the CI checklist and version-pair scope. |
| F-1-14 | Fixed: preview labels identify tested versions and three schema changes. |
| F-1-15 | Fixed: headings name test commands and release CI. |
| F-1-16 | Fixed: README names versions, resources, schemas, and commands. |
| F-1-17 | Fixed: Demo, Privacy, Terms, and 404 have distinct metadata. |
| F-2-1 | Fixed: Install reaches `/#install`, scrolls it to the viewport top, focuses its heading, and announces the section. |
| F-3-1 | Fixed: README and CLI say “declaration template” and name the required schemas and hooks. |
| F-4-1 | Fixed: copy distinguishes built-in discovery from configured hook access; the hostile hook test covers both sides. |
| F-4-2 | Fixed: the 390px demo banner remains sticky at the receipt. |
| F-4-3 | Fixed: README says “Run the sample demo.” |
| F-4-4 | Fixed: the unproved three-workspace sentence is absent. |
| F-4-5 | Fixed: platform copy and current release assets cover macOS, Windows, Linux, and no phone/tablet package. |
| F-4-6 | Fixed: close/reopen clears demo session keys and preserves real local storage. |
| F-4-7 | Fixed: all four development statements are registered and their commands pass. |
| F-4-8 | Fixed: the demo exit action is “Install the CLI.” |
| F-5-1 | Fixed: the Dodo claim test uses recorded checkout evidence; the live checkout and footer matched it. |
| F-5-2 | Fixed: v0.1.5 fixtures match the live release, tap, Scoop manifest, asset digests, provenance, and placeholders. |
| F-5-3 | Fixed: the active fallback says “Open GitHub releases.” |

## Structure, accessibility, links, and visual identity

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200. An unknown
  path returns a designed HTTP 404. Every route has `lang=en`, one H1, one
  main, a route-specific title under 60 characters, description, canonical,
  OG/Twitter metadata, favicon, header, footer, Privacy, and Terms.
- History navigation and Back focus the destination H1. Install deep links
  position and focus the installation heading. The polite route announcement
  updates. The skip link works.
- All discovered links resolved: internal routes and public assets returned
  200, the release download returned its expected 302, checkout returned 303
  to Dodo, and `sociobot.in` returned 200. Mail links are explicit.
- Playwright Axe found zero violations on landing, demo, Privacy, Terms, and
  404 at 390px with reduced motion. Known routes produced no console or page
  errors. The worker URL verifier also passed with one H1/main, complete image
  alt text, and no console errors.
- Production sends CSP with `frame-ancestors` as a header, HSTS,
  `Referrer-Policy`, `X-Content-Type-Options`, and `Permissions-Policy`.
  Reduced motion, 200% text, 44px targets, keyboard navigation, and 390px
  reflow pass the suite.
- The warm herbarium sheet, botanical/container specimen, serif/monospace
  pairing, asymmetric editorial grid, clipped receipt panels, and inspection
  stamp match `.factory/design.md`. The identity is product-specific rather
  than a generic SaaS template. Asset provenance is documented.

## Missed leverage

No AI step is justified. The product's value is deterministic execution and
auditable evidence; generated advice would weaken that boundary. JSON and HTML
already provide the obvious export paths. Remote sync conflicts with the
local/no-customer-data scope. No decorative AI, provider key, or missing
import/export/sync feature was found.

## What would make this perfect

Close both findings: make `@claim:temporary-workspace` observe the directory
used by every promised hook, and register plus test the printed JSON/HTML path
lines (or remove that README sentence). Then rerun all 47 exact commands and
the full cold mobile/desktop review. Nothing else was found.
