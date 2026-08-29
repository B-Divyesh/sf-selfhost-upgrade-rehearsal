# Landing copy audit

Audited 2026-08-29 against `site/src/main.ts`. Counts treat hyphenated terms, version strings, and commands as one word. Buttons, labels, and code output are included where they affect the first read.

| Landing sentence or label | Words | Result |
| --- | ---: | --- |
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
| Tested versions | 2 | Pass |
| Backup and restore | 3 | Pass |
| Schema changes | 2 | Pass |
| How the upgrade rehearsal works | 5 | Pass |
| Declare, run, and share a receipt | 6 | Pass |
| Declare the path | 3 | Pass |
| Name both versions, supported systems, resource minimums, schemas, and hook commands. | 11 | Pass |
| Run the test commands | 4 | Pass |
| The CLI uses a new temporary directory for sample data, backup, restore, and health checks. | 14 | Pass |
| Give customers the receipt | 4 | Pass |
| Share the HTML receipt. | 4 | Pass |
| Keep the JSON receipt as your release gate. | 8 | Pass |
| CLI installation | 2 | Pass |
| Install one binary | 3 | Pass |
| You can open the release page while packages are prepared. | 10 | Pass |
| Installers verify SHA256 before placing the binary on your path. | 10 | Pass |
| Published packages are unsigned. | 4 | Pass |
| It does not connect to customer servers or collect customer data. | 11 | Pass |
| It does not upgrade a customer installation. | 7 | Pass |
| Each receipt covers only its listed versions and environments. | 9 | Pass |
| Run the rehearsal in release CI | 6 | Pass |
| The $79 one-time Team kit adds a CI checklist for each supported source and target version. | 16 | Pass |
| The CLI and both receipt formats stay free. | 8 | Pass |
| Sociobot is the merchant of record. | 6 | Pass |
| Refunds are handled through Sociobot. | 6 | Pass |
| Payment opens Sociobot checkout. | 4 | Pass |
| Readiness receipts for self-hosted upgrades. | 5 | Pass |

Average: 6.6 words. Longest: 16 words. No sentence exceeds 22 words. No banned word appears.

The first screen reads in one breath: it rehearses upgrades for self-hosted product teams, and the first action runs the sample demo.

## Terminology

| Concept | One term used |
| --- | --- |
| YAML input | declaration |
| Vendor command | test command (the CLI schema field remains `hooks`) |
| Customer-safe result | receipt |
| Isolated browser and CLI example | sample demo |
| Paid CI download | Team kit |
| Tested source-to-target change | upgrade path |

Catalog description: “Rehearse self-hosted upgrades and issue a customer-safe readiness receipt.” It is 76 characters and starts with a verb.
