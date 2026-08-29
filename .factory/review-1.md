# Adversarial first-read review 1 — Self-Host Upgrade Rehearsal

**Verdict: FAIL.** Reviewed 29 August 2026 UTC against the live deployment at
`https://selfhost-upgrade-rehearsal.sociobot.in`, with a fresh browser context
at 390×844 and 1440×900, plus the clean local checkout at `5528236`.

The core experience is clear and tryable. It does not meet the supplied
contract yet because the real 404 document is outside the required site
skeleton, several visitor-facing promises have no claim-manifest entry, and
the copy retains product-lore headings and inconsistent terminology.

## Cold first read

**390px and desktop: PASS.** Before scrolling, the first screen says:

- It does: “Rehearse upgrades before customers do.”
- It is for: “self-hosted product teams that need proof before each Compose or
  Kubernetes release.”
- First action: **Try it with sample data**; adjacent text says “Runs a
  complete synthetic upgrade and opens its receipt.”

The action is visible and has a 390px-wide layout with no horizontal overflow.
This gate is not a blocker.

## Findings

### F-1-1 — HIGH — The real 404 route is not part of the site skeleton

**Location:** `GET /does-not-exist` returns HTTP 404 and rewrites to
`site/public/404.html`.

**Evidence:** the live 404 has only a `<main>` with “This specimen is
missing.” and “Return to the upgrade kit.” It has no product wordmark, skip
link, header navigation, footer, Privacy link, Terms link, build identifier,
canonical link, description, Open Graph data, favicon, or theme colour. The
landing, demo, Privacy, and Terms routes do have the common shell. This fails
the required consistent header/footer and per-route metadata structure.

**Why this matters:** a visitor following a stale documentation or installer
link loses the product navigation and legal links at the point they need a
recovery path.

**Concrete fix:** make the 404 a full product route (or render a static copy
of the complete header/footer) with the same skip link and legal navigation;
add route-specific `description`, canonical, OG/Twitter metadata, favicon,
and theme colour. Replace the lore copy with “Page not found” and “This link
does not point to a page in Self-Host Upgrade Rehearsal.” Add a live 404
shell/metadata test.

### F-1-2 — HIGH — Landing promises are not all registered as claims

**Location and exact quotes:**

- Hero action: “Runs a complete synthetic upgrade and opens its receipt.”
- Limits: “It does not connect to customer servers or collect customer data.”
- Limits: “It does not upgrade a customer installation.”
- Limits: “Each receipt covers only its listed versions and environments.”
- Paid kit: “The $79 one-time Team kit adds a release-matrix workflow and
  upgrade checklist.”
- Paid kit: “The CLI and both receipt formats stay free.”
- Paid kit: “Sociobot is the merchant of record.”
- Paid kit: “Refunds are handled through Sociobot.”
- Install: “Release v0.1.1 is ready for this device.”
- Install: “The download comes from the matching GitHub release.”
- Paid kit: “Payment opens Sociobot checkout.”

`.factory/claims.json` has no entry for these claims. Existing entries prove
that a sample JSON receipt is downloaded, that the core CLI is MIT licensed,
and that a valid license restores a Team kit; they do not prove the complete
run wording, no-customer-upgrade boundary, receipt scope, price/content of the
paid kit, free receipt formats, merchant role, or refund handling.

**Why this matters:** these are statements a release team could rely on for
their customer process and purchase decision. The claims contract requires a
sandbox test for each one, not a nearby test for a related feature. This is
also a recurrence of the earlier unlisted-public-promises finding
(`verification.md` HIGH-3): some earlier promises were added, but the
manifest is still not exhaustive.

**Concrete fix:** either remove/rewrite each promise as a non-claiming
instruction, or add one `claims.json` entry and exactly one
`@claim:<id>` sandbox test per promise. For the boundary statements, test a
hostile fixture and show no customer connection or installation is attempted.
For paid statements, use a recorded checkout/entitlement fixture that asserts
the exact $79 one-time scope, free formats, merchant/refund wording, and the
returned kit contents.

### F-1-3 — HIGH — README promises are also missing from the claim manifest

**Location and exact quotes:**

- “It checks one declared upgrade path before customers use it.”
- “Homebrew packages use the published tap:”
- “Scoop uses the release manifest:”
- “Each release also carries `.deb`, `.rpm`, unsigned macOS `.pkg`, Windows
  zip, Winget manifests, and checksums.”
- “The result contains schema key changes, declared resource minimums,
  checks, tested versions, and supported environments.”
- “A receipt covers only the versions and environments printed on it.”
- “It is not proof for an unlisted customer system.”
- “The free CLI includes both receipt formats.”
- “License purchase and verification use the Sociobot billing API.”
- “No payment provider is embedded in this repository.”
- “Tag a version such as `v0.1.1` to run the cross-platform GitHub release
  workflow.”

Some nearby behavior is tested, but none of these exact relied-on promises has
an entry in `.factory/claims.json`. In particular, no test verifies both
package-manager installation paths or the advertised release asset set.

**Why this matters:** the README is the installation surface for this CLI; a
visitor cannot distinguish tested release facts from unverified copy.

**Concrete fix:** add narrowly observable claim tests (for example install the
published Homebrew and Scoop paths in their documented sandboxes, parse the
release manifest, and inspect the receipt keys), or remove the promise until
it is testable. Do not use a single broad “CLI receipts” entry as a substitute
for these separate claims.

### F-1-4 — MEDIUM — Demo, fixture, and sample name the same thing

**Location:** “Try it with sample data”; “Runs a complete synthetic upgrade”;
“This recording uses the same bundled sample”; “Seed fixture · synthetic
records”; “Bundled fixture · linux/x86_64.”

**Why this matters:** the first screen asks a new visitor to try “sample data,”
then switches among *synthetic upgrade*, *sample*, and *fixture*. The provided
terminology table says the isolated sample run is “demo,” so the page itself
does not use its own chosen term consistently.

**Concrete fix:** use **sample demo** everywhere. For example: “Runs the
bundled sample demo and opens its receipt.”, “This recording uses the bundled
sample demo.”, and “Sample data · linux/x86_64.”

### F-1-5 — MINOR — “Field receipt no. 001 · upgrade proof kit” is lore, not useful copy

**Location:** landing hero eyebrow, 7 words.

**Why this matters:** “field receipt” and “proof kit” are not defined product
terms and do not tell a first-time visitor what section they are reading.

**Concrete fix:** delete it, or use “Upgrade rehearsal for self-hosted
products.”

### F-1-6 — MINOR — “Plate I · known path” is a metaphorical label

**Location:** hero illustration label, 5 words.

**Why this matters:** it is decorative product lore and the numbered “plate”
does not identify an actionable section or result.

**Concrete fix:** delete it; the image alt already explains the image.

### F-1-7 — MINOR — The hero caption carries no actionable information

**Location:** “Observe one declared path. Label everything outside it.” (4 and
5 words).

**Why this matters:** “observe” and “label” are botanical metaphors, not an
explanation of the tool's tested scope.

**Concrete fix:** “A receipt names the tested versions and supported
environments.” This is a claim, so add a matching scope test before keeping
it.

### F-1-8 — MINOR — “Live specimen” is a mood heading

**Location:** preview eyebrow, 2 words.

**Why this matters:** a screen-reader heading/listener learns nothing about
the section; there is no live system here, only a bundled recording.

**Concrete fix:** “Sample terminal recording.”

### F-1-9 — MINOR — “See the whole rehearsal” does not name its section

**Location:** preview H2, 4 words.

**Why this matters:** it is an invitation rather than a section name and is
ambiguous out of context.

**Concrete fix:** “Sample upgrade rehearsal.”

### F-1-10 — MINOR — “Method” and “Move one upgrade through three checks” are vague headings

**Location:** how-it-works eyebrow/H2, 1 and 6 words.

**Why this matters:** neither heading tells a visitor which steps the product
requires, and “move” does not describe a CLI operation.

**Concrete fix:** use “How the upgrade rehearsal works” and “Declare, run,
and share a receipt.”

### F-1-11 — MINOR — “Field kit” is product lore

**Location:** install eyebrow, 2 words.

**Why this matters:** it fails to name the installation section and adds an
undefined metaphor.

**Concrete fix:** “CLI installation.”

### F-1-12 — MINOR — “Specimen boundary” is product lore

**Location:** limits eyebrow, 2 words.

**Why this matters:** the section is about limits, but the heading makes a
visitor infer that from a botanical metaphor.

**Concrete fix:** “Receipt limits.”

### F-1-13 — MINOR — “release-matrix workflow” is unexplained jargon

**Location:** “The $79 one-time Team kit adds a release-matrix workflow and
upgrade checklist.” (13 words).

**Why this matters:** the page neither defines the workflow nor says what it
does for a release team.

**Concrete fix:** “The $79 one-time Team kit adds a CI checklist for each
supported source and target version.” Register and test the exact paid-scope
claim as required by F-1-2.

### F-1-14 — MINOR — Preview labels do not identify the displayed result

**Location:** “Path” and “3 labelled” in the readiness summary.

**Why this matters:** “Path” has several meanings in a CLI product and “3
labelled” does not say what was labelled. These labels make the summary harder
to scan than it needs to be.

**Concrete fix:** replace them with “Tested versions” and “3 schema changes.”

### F-1-15 — MINOR — Two headings leave CLI jargon unexplained

**Location:** “Run clean hooks” and “Reuse the check in release CI.”

**Why this matters:** a product team may know either term, but the headings do
not say that the former runs vendor commands in a temporary workspace and the
latter runs the rehearsal in continuous integration.

**Concrete fix:** use “Run the test commands” and “Run the rehearsal in
release CI.”

### F-1-16 — MINOR — README uses an unexplained abstraction

**Location:** “The declaration keeps the public surface small:” (7 words).

**Why this matters:** “public surface” does not tell an operator what the
declaration contains or why they should care.

**Concrete fix:** “The declaration lists only the versions, resources,
schemas, and commands the rehearsal needs:”

### F-1-17 — MINOR — Privacy, Demo, and Terms metadata still describes the landing page

**Location:** direct live loads of `/demo`, `/privacy`, and `/terms` retain
the root description “Rehearse Compose or Kubernetes upgrades and issue
customer-safe readiness receipts.” and OG title “Self-Host Upgrade Rehearsal
— test upgrades first.” Titles and canonicals change correctly.

**Why this matters:** shared links and search previews for Privacy or Terms
describe a different page, and the route metadata requirement is only
partially met.

**Concrete fix:** update description, OG title/description, Twitter title, and
Twitter description in `render()` for each route; add direct-route assertions
for all of them.

## Demo, privacy, CLI, and claims evidence

**Demo: PASS.** One click from the landing page opens `/demo`. The first
screen already shows the finished Arbor Desk 1.8.4 → 2.0.0 run, READY receipt,
9 passed checks, 3 schema changes, and the persistent “Demo — sample data,
nothing is saved” banner. The downloaded JSON has schema 1 and all 14 expected
receipt fields. Demo mode used only `sessionStorage["demo:active"]`; **Reset
demo** cleared it and replayed the recording; **Start for real** cleared it
before leaving demo mode. From `/demo`, taking the context offline, resetting,
and downloading the receipt still succeeded.

**Privacy: PASS for the tested demo flow.** The fresh `/demo` flow made only
same-origin page/resource requests, downloaded locally, and did not access
real license/release storage. No product data was uploaded. (The landing page
does separately request public GitHub release metadata; that is disclosed on
the Privacy route.)

**CLI demo: PASS.** `target/release/rehearsal demo --output <fresh-temp>/output
--json` returned `status: "ready"`, `customer_safe: true`, and 9 checks in a
new temporary fixture workspace.

**Claims commands: PASS.** After `npm ci`, all 17 exact commands listed in
`.factory/claims.json` were invoked from this clean checkout; all passed. The
full suite also passed: 46 passed, 1 intentional desktop-only skip. Passing
registered tests does not clear F-1-2 or F-1-3, which concern promises absent
from the manifest.

| Claim IDs passed |
| --- |
| `demo-receipt`, `offline-demo`, `demo-network-privacy`, `cli-receipts`, `upgrade-hooks`, `declared-resource-minimums`, `compose-kubernetes-declarations`, `installer-checksum`, `mit-core`, `schema-redaction`, `customer-safe-receipt`, `temporary-workspace`, `argument-arrays`, `exit-codes`, `unsigned-packages`, `cli-no-upload`, `team-kit-license` |

## Structure, accessibility, and links

- `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns
  a real HTTP 404. All discovered internal links, the release download,
  checkout, and `https://sociobot.in/` resolved successfully.
- Known product routes have `lang=en`, one H1, one main landmark, a
  route-specific title, canonical URL, favicon, no 390px overflow, and no axe
  violations. Their mobile console/page-error logs were clean.
- Back/forward and focus-on-route-change are covered by the passing suite.
  The herbarium visual system is distinct and matches `.factory/design.md`; it
  is not a generic SaaS template.
- The 404 exception is F-1-1. Browser devtools records the expected failed
  404 document response as a console resource error; it is not an application
  exception, but the bare document is still structurally incomplete.
- No additional AI, import/export, or sync feature is required by the brief:
  JSON and HTML receipts already provide export, while remote sync would
  conflict with the local-first, no-customer-data scope. No decorative AI or
  provider key was found.

## Earlier-history verification

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files.
I also checked the existing verification/handoff history rather than treating
its PASS label as evidence. The earlier real-404 status, 390px overflow,
200%-text reflow, 44px target, cached-license notice, receipt redaction,
checkout, package, and installer findings are fixed in the live page/code or
covered by the passing regression/claim tests. The earlier unlisted-claims
finding remains materially present and is re-raised as F-1-2 and F-1-3.

## Complete copy inventory

Counts treat hyphenated terms, version strings, and commands as one word.
Commands and URLs are listed separately where they are not prose. A flag ID
means the corresponding finding above proposes the rewrite.

### Landing page visible copy

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Header | Demo | 1 | pass |
| Header | Install | 1 | pass |
| Header | Privacy | 1 | pass |
| Hero | Field receipt no. 001 · upgrade proof kit | 7 | F-1-5 |
| Hero H1 | Rehearse upgrades before customers do | 5 | pass |
| Hero | For self-hosted product teams that need proof before each Compose or Kubernetes release. | 13 | pass |
| Hero action | Try it with sample data | 5 | pass |
| Hero action | Runs a complete synthetic upgrade and opens its receipt. | 9 | F-1-2/F-1-4 |
| Hero fact | The demo uploads no project data. | 6 | pass; registered |
| Hero fact | The bundled demo runs offline after this page loads. | 9 | pass; registered |
| Hero fact | The core CLI is free under the MIT License. | 9 | pass; registered |
| Hero art | Plate I · known path | 5 | F-1-6 |
| Hero art | Observe one declared path. | 4 | F-1-7 |
| Hero art | Label everything outside it. | 4 | F-1-7 |
| Preview | Live specimen | 2 | F-1-8 |
| Preview H2 | See the whole rehearsal | 4 | F-1-9 |
| Preview | This recording uses the same bundled sample as `rehearsal demo`. | 10 | F-1-4 |
| Preview button | Play recording | 2 | pass |
| Preview data | Path | 1 | F-1-14 |
| Preview data | Backup and restore | 3 | pass |
| Preview data | Passed | 1 | pass |
| Preview data | Schema changes | 2 | pass |
| Preview data | 3 labelled | 2 | F-1-14 |
| Preview state | Ready | 1 | pass |
| How | Method | 1 | F-1-10 |
| How H2 | Move one upgrade through three checks | 6 | F-1-10 |
| Step | Declare the path | 3 | pass |
| Step | Name both versions, supported systems, resource minimums, schemas, and hook commands. | 11 | pass |
| Step | Run clean hooks | 3 | F-1-15 |
| Step | The CLI uses a new temporary directory for seed, backup, restore, and health checks. | 14 | pass; registered |
| Step | Give customers the receipt | 4 | pass |
| Step | Share the HTML receipt. | 4 | pass |
| Step | Keep the JSON receipt as your release gate. | 8 | pass |
| Install | Field kit | 2 | F-1-11 |
| Install H2 | Install one binary | 3 | pass |
| Install | Release v0.1.1 is ready for this device. | 7 | unlisted release-status claim; add test or use “Choose a download” |
| Install button | Download linux-x86_64.tar.gz | 2 | pass |
| Install | The download comes from the matching GitHub release. | 8 | unlisted source claim; add test or delete |
| Install button | Copy macOS and Linux install | 5 | pass |
| Install button | Copy Windows install | 4 | pass |
| Install | Installers verify SHA256 before placing the binary on your path. | 10 | pass; registered |
| Install | Published packages are unsigned. | 4 | pass; registered |
| Install | First run | 2 | pass |
| Limits | Specimen boundary | 2 | F-1-12 |
| Limits H2 | Know what the receipt does not prove | 8 | pass |
| Limits | It does not connect to customer servers or collect customer data. | 11 | F-1-2 |
| Limits | It does not upgrade a customer installation. | 7 | F-1-2 |
| Limits | Each receipt covers only its listed versions and environments. | 9 | F-1-2 |
| Paid | Optional paid kit | 3 | pass |
| Paid H2 | Reuse the check in release CI | 6 | F-1-15 |
| Paid | The $79 one-time Team kit adds a release-matrix workflow and upgrade checklist. | 13 | F-1-2/F-1-13 |
| Paid | The CLI and both receipt formats stay free. | 8 | F-1-2 |
| Paid | Sociobot is the merchant of record. | 6 | F-1-2 |
| Paid | Refunds are handled through Sociobot. | 6 | F-1-2 |
| Paid button | Buy the Team kit — $79 | 6 | pass |
| Paid label | Have a license? Paste it | 5 | pass |
| Paid button | Verify license | 2 | pass |
| Paid | Payment opens Sociobot checkout. | 4 | F-1-2 |
| Footer | Readiness receipts for self-hosted upgrades. | 5 | pass |
| Footer links | Privacy; Terms; Built by Param Factory | 1; 1; 4 | pass |

The terminal transcript and install command blocks are code/output, not
sentences; they were checked separately in the demo and CLI tests.

### README prose

| # | Copy | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Self-Host Upgrade Rehearsal | 3 | title, pass |
| 2 | Rehearse self-hosted upgrades and issue a customer-safe readiness receipt. | 9 | pass |
| 3 | This kit is for teams that ship Docker Compose or Kubernetes products. | 12 | pass |
| 4 | It checks one declared upgrade path before customers use it. | 10 | F-1-3 |
| 5 | Try the bundled upgrade | 4 | heading, pass |
| 6 | The command creates a temporary Arbor Desk project with synthetic records. | 11 | pass; registered |
| 7 | It prints the paths to JSON and HTML receipts. | 9 | pass; registered |
| 8 | The CLI checks backup, restore, and health hooks. | 8 | pass; registered |
| 9 | It never includes hook output or fixture contents in a receipt. | 11 | pass; registered |
| 10 | Install | 1 | heading, pass |
| 11 | macOS and Linux | 3 | label, pass |
| 12 | Windows PowerShell | 2 | label, pass |
| 13 | Both installers verify SHA256 before placing the binary on PATH. | 10 | pass; registered |
| 14 | Homebrew packages use the published tap. | 6 | F-1-3 |
| 15 | Scoop uses the release manifest. | 5 | F-1-3 |
| 16 | Each release also carries `.deb`, `.rpm`, unsigned macOS `.pkg`, Windows zip, Winget manifests, and checksums. | 14 | F-1-3 |
| 17 | Declare an upgrade path | 4 | heading, pass |
| 18 | Start with a checked template. | 5 | pass |
| 19 | The declaration keeps the public surface small. | 7 | F-1-16 |
| 20 | Commands are argument arrays, so no shell parsing happens inside the CLI. | 12 | pass; registered |
| 21 | Use `{source_dir}` and `{work_dir}` as path placeholders. | 7 | pass |
| 22 | Validate and run | 3 | heading, pass |
| 23 | `check` validates Compose and Kubernetes declarations before launch. | 8 | pass; registered |
| 24 | `run` executes hooks in a new temporary directory. | 8 | pass; registered |
| 25 | The result contains schema key changes, declared resource minimums, checks, tested versions, and supported environments. | 15 | F-1-3 |
| 26 | It writes `readiness.json` and `readiness.html`. | 5 | pass; registered |
| 27 | Use `--json` with `check`, `run`, or `demo` for scripts. | 9 | pass |
| 28 | A failed check returns exit code 1. | 7 | pass; registered |
| 29 | Invalid input returns exit code 2. | 6 | pass; registered |
| 30 | Privacy and limits | 3 | heading, pass |
| 31 | The CLI has no built-in network client or telemetry path. | 10 | pass; registered |
| 32 | Your hook commands may use the network when your test requires it. | 12 | pass |
| 33 | Schema comparison records paths and value types. | 7 | pass; registered |
| 34 | It does not copy schema values into the receipt. | 9 | pass; registered |
| 35 | A receipt covers only the versions and environments printed on it. | 11 | F-1-3 |
| 36 | It is not proof for an unlisted customer system. | 9 | F-1-3 |
| 37 | Team kit | 2 | heading, pass |
| 38 | The free CLI includes both receipt formats. | 7 | F-1-3 |
| 39 | The optional $79 Team kit adds a release-matrix workflow and upgrade checklist. | 12 | F-1-3/F-1-13 |
| 40 | License purchase and verification use the Sociobot billing API. | 9 | F-1-3 |
| 41 | No payment provider is embedded in this repository. | 8 | F-1-3 |
| 42 | Develop | 1 | heading, pass |
| 43 | Requirements: stable Rust, Node 22, and npm. | 7 | pass |
| 44 | `npm test` runs Rust, claim, accessibility, desktop, and 390 px browser checks. | 12 | pass; verified |
| 45 | `npm run build:site` writes `dist/site/index.html`. | 5 | pass; verified |
| 46 | Run the site locally | 4 | heading, pass |
| 47 | Package the Rust crate without publishing it. | 7 | pass |
| 48 | The factory deploys `dist/site`. | 4 | deployment instruction, pass |
| 49 | Tag a version such as `v0.1.1` to run the cross-platform GitHub release workflow. | 8 | F-1-3 |
| 50 | License | 1 | heading, pass |
| 51 | MIT. | 1 | pass |
| 52 | See LICENSE. | 2 | pass |

The two Website/Demo URL lines and all fenced command blocks are links/code,
not sentences. No prose sentence exceeds 22 words. The problems are not length
but unregistered promises, jargon, product lore, and term drift.

## What would make this perfect

1. Repair the static 404 into a complete, route-metadata-correct product page.
2. Make the claim manifest exhaustive or remove every promise that cannot be
   sandbox-proven.
3. Replace the herbarium lore and CI jargon with the concrete rewrites above,
   then use “sample demo” consistently.
4. Give each direct route its own description and social metadata.
