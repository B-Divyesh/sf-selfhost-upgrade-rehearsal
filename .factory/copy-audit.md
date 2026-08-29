# Copy audit — perfection loop 4

Audited 2026-08-29 against `site/src/main.ts` and `README.md`. Counts treat hyphenated terms, versions, prices, commands, and filenames as one word. Code output and URLs are not prose.

## Landing page

| Visible sentence or label | Words | Result |
| --- | ---: | --- |
| Upgrade Rehearsal | 2 | Pass |
| Demo | 1 | Pass |
| Install | 1 | Pass |
| Privacy | 1 | Pass |
| Upgrade rehearsal for self-hosted products | 5 | Pass |
| Rehearse upgrades before customers do | 5 | Pass |
| For self-hosted product teams that need proof before each Compose or Kubernetes release. | 13 | Pass |
| Try it with sample data | 5 | Pass |
| Runs the bundled sample demo and opens its receipt. | 9 | Pass |
| The demo uploads no project data. | 6 | Pass |
| The bundled demo runs offline after this page loads. | 9 | Pass |
| The core CLI is free under the MIT License. | 9 | Pass |
| A receipt names the tested versions and supported environments. | 9 | Pass |
| Sample terminal recording | 3 | Pass |
| Sample upgrade rehearsal | 3 | Pass |
| This recording uses the bundled sample demo from `rehearsal demo`. | 10 | Pass |
| Play recording | 2 | Pass |
| Pause recording | 2 | Pass |
| Resume recording | 2 | Pass |
| Replay recording | 2 | Pass |
| Tested versions | 2 | Pass |
| Backup and restore | 3 | Pass |
| Passed | 1 | Pass |
| Schema changes | 2 | Pass |
| 3 changes | 2 | Pass |
| Ready | 1 | Pass |
| How the upgrade rehearsal works | 5 | Pass |
| Declare, run, and share a receipt | 6 | Pass |
| Declare the path | 3 | Pass |
| Name both versions, supported systems, resource minimums, schemas, and hook commands. | 11 | Pass |
| Run the test commands | 4 | Pass |
| The CLI uses a new temporary directory for sample data, backup, restore, and health checks. | 15 | Pass |
| Give customers the receipt | 4 | Pass |
| Share the HTML receipt. | 4 | Pass |
| Keep the JSON receipt as your release gate. | 8 | Pass |
| CLI installation | 2 | Pass |
| Install one binary | 3 | Pass |
| Checking published downloads… | 3 | Pass |
| Release v0.1.3 is ready for this device. | 7 | Pass |
| Install on macOS, Windows, or Linux. | 6 | Pass; `supported-platforms` |
| No phone or tablet package is provided. | 7 | Pass; `supported-platforms` |
| Downloads are being published | 4 | Pass |
| The download comes from the matching GitHub release. | 8 | Pass |
| You can open the release page while packages are prepared. | 10 | Pass |
| Downloads are being published or this device is offline. | 9 | Pass |
| Try again later or open the release page. | 8 | Pass |
| Copy macOS and Linux install | 5 | Pass |
| Copy Windows install | 3 | Pass |
| Copied install command | 3 | Pass |
| Select the command below | 4 | Pass |
| Installers verify SHA256 before placing the binary on your path. | 10 | Pass |
| Published packages are unsigned. | 4 | Pass |
| First run | 2 | Pass |
| Receipt limits | 2 | Pass |
| Know what the receipt does not prove | 7 | Pass |
| The CLI has no built-in network client and does not discover customer installations. | 13 | Pass; `customer-boundary` |
| Hooks can access paths and networks you configure. | 8 | Pass; `customer-boundary` |
| Each receipt covers only its listed versions and environments. | 9 | Pass |
| Optional paid kit | 3 | Pass |
| Run the rehearsal in release CI | 6 | Pass |
| The $79 one-time Team kit adds a CI checklist for each supported source and target version. | 16 | Pass |
| The CLI and both receipt formats stay free. | 8 | Pass |
| Sociobot is the merchant of record. | 6 | Pass |
| Refunds are handled through Sociobot. | 5 | Pass |
| Buy the Team kit — $79 | 5 | Pass |
| Have a license? Paste it | 5 | Pass |
| Verify license | 2 | Pass |
| Payment opens Sociobot checkout. | 4 | Pass |
| Paste a license token, then verify it. | 7 | Pass |
| Checking this license… | 3 | Pass |
| Team kit active. | 3 | Pass |
| License no longer active. | 4 | Pass |
| You can buy a new license. | 6 | Pass |
| The license check is offline. | 5 | Pass |
| Try again when connected. | 4 | Pass |
| Download Team CI kit | 4 | Pass |
| Readiness receipts for self-hosted upgrades. | 5 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| v0.1.3 · build 2026.08.29 | 3 | Pass |

No landing sentence exceeds 22 words. No banned marketing word appears. The first screen says the job, audience, first action, and three facts in one breath.

## Demo and corrected review copy

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 6 | Pass |
| Reset demo | 2 | Pass |
| Install the CLI | 3 | Pass; result-naming action |
| Bundled sample demo · Arbor Desk | 5 | Pass |
| Inspect a finished upgrade rehearsal | 5 | Pass |
| This recording shows the Arbor Desk 1.8.4 to 2.0.0 sample demo. | 11 | Pass; no unproved workspace count |
| Closing the tab clears them. | 5 | Pass; `demo-storage-isolation` |

## README corrections and development copy

| Copy | Words | Result |
| --- | ---: | --- |
| Run the sample demo | 4 | Pass; terminology matches site and CLI |
| Start with a declaration template. | 5 | Pass; `starter-templates` |
| Add your schema files and hook commands before running `rehearsal check`. | 11 | Pass; `starter-templates` |
| Requirements: stable Rust, Node 22, and npm. | 7 | Pass; `development-requirements` |
| `npm test` runs Rust, claim, accessibility, desktop, and 390 px browser checks. | 12 | Pass; `test-coverage` |
| `npm run build:site` writes `dist/site/index.html`. | 5 | Pass; `site-build-output` |
| The complete deployable static site is in `dist/site`. | 8 | Pass; `deploy-directory` |

## Terminology

| Concept | One term used |
| --- | --- |
| YAML input | declaration |
| Vendor command | test command; the schema field remains `hooks` |
| Customer-facing result | receipt |
| Isolated browser and CLI example | sample demo |
| Paid CI download | Team kit |
| Tested source-to-target change | upgrade path |

Catalog description: “Rehearse self-hosted upgrades and issue customer-safe receipts.” It is 63 characters, starts with a verb, and contains no banned word.
