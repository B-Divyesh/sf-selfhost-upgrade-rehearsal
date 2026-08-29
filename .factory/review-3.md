# Adversarial first-read review 3 — Self-Host Upgrade Rehearsal

**Verdict: FAIL.** Reviewed 29 August 2026 UTC at https://selfhost-upgrade-rehearsal.sociobot.in in fresh 390×844 and 1440×900 Chromium contexts, and in a fresh clone at 37e27ad8fd51211a939abe821390e85e1a1ce3bd.

## Cold first read

**390px and desktop: PASS.** Before scrolling, I could answer all three questions: it lets self-hosted product teams rehearse a Compose or Kubernetes upgrade before customers do; it is for those product teams; click **Try it with sample data** to run the bundled Arbor Desk rehearsal and open its receipt. The exact text was “Rehearse upgrades before customers do”, “For self-hosted product teams that need proof before each Compose or Kubernetes release.”, and “Runs the bundled sample demo and opens its receipt.” The action and all three facts fit the mobile first screen without horizontal overflow.

## Findings

### F-3-1 — HIGH — README calls an incomplete declaration a “checked template”

**Location and quote:** README, Declare an upgrade path: “Start with a checked template:”.

**Evidence:** In a new temporary directory, rehearsal init compose --output rehearsal.yml writes references to schemas/1.0.yml and schemas/2.0.yml but creates neither those schemas nor hook files. rehearsal check --file rehearsal.yml returns exit code 2: “config schema …/schemas/1.0.yml was not found”. Its own init output says “Add schema files and hook commands, then run rehearsal check.” The starter-templates claim verifies selected fields only; it neither registers nor proves “checked”.

**Why it matters:** The first README action promises an immediately checkable declaration, but the next command fails before the prerequisites are explained. This is inaccurate and unlisted in claims.json.

**Concrete fix:** Rewrite as “Start with a declaration template:” followed by “Add your schema files and hook commands before running rehearsal check.” Or make init write all prerequisites and add a checked-template claim test that runs init then check in a fresh directory.

## Copy audit

Counts treat hyphenated terms, versions, prices, and commands as one word. Raw URLs and fenced code are excluded. No prose exceeds 22 words; no banned adjective, metaphor heading, or non-result-naming button remains. The only flag is F-3-1.

### Landing page inventory

| Copy (every visible sentence/label) | Words | Result |
| --- | ---: | --- |
| Upgrade Rehearsal; Demo; Install; Privacy | 2; 1; 1; 1 | pass |
| Upgrade rehearsal for self-hosted products; Rehearse upgrades before customers do | 5; 5 | pass |
| For self-hosted product teams that need proof before each Compose or Kubernetes release. | 13 | pass |
| Try it with sample data; Runs the bundled sample demo and opens its receipt. | 5; 9 | pass; demo-receipt |
| The demo uploads no project data. / The bundled demo runs offline after this page loads. / The core CLI is free under the MIT License. | 6 / 9 / 9 | pass; registered |
| A receipt names the tested versions and supported environments. | 9 | pass; receipt-scope |
| Sample terminal recording; Sample upgrade rehearsal; This recording uses the bundled sample demo from rehearsal demo. | 3; 3; 10 | pass |
| Play recording; Tested versions; Backup and restore; Passed; Schema changes; 3 changes; Ready | 2; 2; 3; 1; 2; 2; 1 | pass |
| How the upgrade rehearsal works; Declare, run, and share a receipt | 5; 6 | pass |
| Declare the path; Name both versions, supported systems, resource minimums, schemas, and hook commands. | 3; 11 | pass |
| Run the test commands; The CLI uses a new temporary directory for sample data, backup, restore, and health checks. | 4; 14 | pass; temporary-workspace |
| Give customers the receipt; Share the HTML receipt.; Keep the JSON receipt as your release gate. | 4; 4; 8 | pass; cli-receipts |
| CLI installation; Install one binary; Release v0.1.2 is ready for this device. | 2; 3; 7 | pass; release claims |
| Download linux-x86_64.tar.gz; The download comes from the matching GitHub release. | 2; 8 | pass; published-platform-download |
| Copy macOS and Linux install; Copy Windows install; First run | 5; 4; 2 | pass |
| Installers verify SHA256 before placing the binary on your path. Published packages are unsigned. | 10; 4 | pass; registered |
| Receipt limits; Know what the receipt does not prove | 2; 8 | pass |
| It does not connect to customer servers or collect customer data. It does not upgrade a customer installation. Each receipt covers only its listed versions and environments. | 11; 7; 9 | pass; registered |
| Optional paid kit; Run the rehearsal in release CI | 3; 6 | pass |
| The $79 one-time Team kit adds a CI checklist for each supported source and target version. | 16 | pass; team-kit-price-scope |
| The CLI and both receipt formats stay free. Sociobot is the merchant of record. Refunds are handled through Sociobot. | 8; 6; 6 | pass; registered |
| Buy the Team kit — $79; Have a license? Paste it; Verify license; Payment opens Sociobot checkout. | 6; 5; 2; 4 | pass; registered |
| Readiness receipts for self-hosted upgrades.; Privacy; Terms; Built by Param Factory | 5; 1; 1; 4 | pass |

### README inventory

| Copy (every sentence/heading/label) | Words | Result |
| --- | ---: | --- |
| Self-Host Upgrade Rehearsal; Rehearse self-hosted upgrades and issue a customer-safe readiness receipt. | 3; 9 | pass |
| This CLI is for teams that ship Docker Compose or Kubernetes products. It checks one declared upgrade path before customers use it. | 12; 10 | pass; declared-upgrade-path |
| Try the bundled upgrade; The command creates a temporary Arbor Desk project with sample records. It prints the paths to JSON and HTML receipts. | 4; 11; 9 | pass; registered |
| The CLI checks backup, restore, and health hooks. It never includes hook output or sample data in a receipt. | 8; 11 | pass; registered |
| Install; macOS and Linux; Windows PowerShell; Both installers verify SHA256 before placing the binary on PATH. | 1; 3; 2; 10 | pass |
| Homebrew packages use the published tap. Scoop uses the release manifest. | 6; 5 | pass; registered |
| Each release also carries .deb, .rpm, unsigned macOS .pkg, Windows zip, Winget manifests, and checksums. | 14 | pass; release-asset-set |
| Declare an upgrade path; Start with a checked template. | 4; 5 | **F-3-1** |
| The declaration lists only the versions, resources, schemas, and commands the rehearsal needs. | 13 | pass |
| Commands are argument arrays, so no shell parsing happens inside the CLI. Use {source_dir} and {work_dir} as path placeholders. | 12; 7 | pass |
| Validate and run; check validates Compose and Kubernetes declarations before launch. run executes hooks in a new temporary directory. | 3; 8; 8 | pass; registered |
| The result contains schema key changes, declared resource minimums, checks, tested versions, and supported environments. It writes readiness.json and readiness.html. | 15; 5 | pass; registered |
| Use --json with check, run, or demo for scripts. A failed check returns exit code 1. Invalid input returns exit code 2. | 9; 7; 6 | pass; registered |
| Privacy and limits; The CLI has no built-in network client or telemetry path. Your hook commands may use the network when your test requires it. | 3; 10; 12 | pass; CLI claim plus operator caveat |
| Schema comparison records paths and value types. It does not copy schema values into the receipt. | 7; 9 | pass; schema-redaction |
| A receipt covers only the versions and environments printed on it. It is not proof for an unlisted customer system. | 11; 9 | pass; receipt-scope |
| Team kit; The free CLI includes both receipt formats. The optional $79 one-time Team kit adds a CI checklist for each supported source and target version. | 2; 7; 16 | pass; registered |
| License purchase and verification use the Sociobot billing API. No payment provider is embedded in this repository. | 9; 8 | pass; registered |
| Develop; Requirements: stable Rust, Node 22, and npm. | 1; 7 | pass |
| npm test runs Rust, claim, accessibility, desktop, and 390 px browser checks. npm run build:site writes dist/site/index.html. | 12; 5 | pass; run in review |
| Run the site locally; Package the Rust crate without publishing it. The factory deploys dist/site. | 4; 7; 4 | instruction, pass |
| Tag a version such as v0.1.2 to run the cross-platform GitHub release workflow. License; MIT.; See LICENSE. | 8; 1; 1; 2 | pass; release-workflow |

## Demo, privacy, CLI, and claims

- **Demo: PASS.** One click opens /demo. Its first mobile screen shows the persistent “Demo — sample data, nothing is saved” banner, Arbor Desk 1.8.4 → 2.0.0, and realistic backup/restore/health output. The ready receipt contains nine checks, three schema changes, declared resources, and scope limits.
- **Isolation/reset: PASS.** A real-storage sentinel survived entry, Reset demo, and Start for real. Demo used only the demo: session namespace on entry; reset/exit clear it and exit focuses Install.
- **Offline/privacy: PASS.** After load, offline Reset demo reached READY. The complete demo request log had only same-origin document, JS, and CSS requests.
- **CLI: PASS.** A fresh temporary CLI demo wrote a schema-1 READY customer-safe Arbor Desk receipt with nine checks plus JSON and HTML output.
- **Claims: PASS.** All 41 exact commands in claims.json passed in the fresh clone. The full suite passed: 5 Rust and 103 Playwright tests, with 4 intentional skips. npm run build produced dist/site and the release binary. F-3-1 is unlisted, not a failing registered test.

## Earlier-history verification

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | Fixed: unknown URL returns real 404 with full shell, legal links, metadata, and recovery action. |
| F-1-2, F-1-3 | Fixed for earlier landing/README claims: all 41 tagged tests passed. F-3-1 is a new unlisted assertion. |
| F-1-4 | Fixed: browser, CLI, README, and demo docs use “sample demo”. |
| F-1-5 through F-1-12 | Fixed: concrete headings replaced lore and mood labels. |
| F-1-13 through F-1-16 | Fixed: paid scope, preview labels, test/CI headings, and declaration wording remain clear. |
| F-1-17 | Fixed: Demo, Privacy, Terms, and 404 direct loads have route-specific metadata. |
| F-2-1 | Fixed: header Install opens /#install, reveals the section, and focuses “Install one binary”. |

## Structure, accessibility, and visual checks

- /, /demo, /privacy, /terms, and /404.html have the required title pattern, one H1/main, description, canonical, OG/Twitter metadata, favicon, header/footer, and legal links. Unknown URLs return real HTTP 404. Navigation and Back focus the destination H1.
- A 390px axe sweep of landing, demo, Privacy, Terms, and 404 found zero violations and zero overflow. The herbarium/receipt identity follows .factory/design.md and is not a generic SaaS template.
- Every discovered link resolved: internal routes 200, binary 302, Sociobot checkout 303, sociobot.in 200, and explicit mailto links. Production sends CSP, referrer policy, content-type protection, and frame-ancestor headers.
- No further AI, import/export, or sync feature is implied: JSON/HTML export exists, while remote sync conflicts with the local-first/no-customer-data boundary. No decorative AI feature or provider key was found.

## What would make this perfect

Close F-3-1, then rerun the fresh-template init/check path and this full review. With the false “checked template” promise removed or made true and tested, no other gap was identified.

