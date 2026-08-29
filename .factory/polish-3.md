# Perfection-loop polish 3 — finding closure

This repair reviewed `.factory/review-1.md`, `.factory/review-2.md`,
`.factory/review-3.md`, `.factory/polish-1.md`, and `.factory/polish-2.md`.
All findings are closed; none is deferred.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the product-styled, real HTTP 404 document with the common shell, recovery link, legal links, and route metadata. | `npm test` route suite; [live 404](https://selfhost-upgrade-rehearsal.sociobot.in/cold-missing-page); `.factory/evidence/polish-3/live-not-found-390.png`; final live browser audit. |
| F-1-2 | Kept every landing-page promise in the 41-entry claim manifest, with one observable test per ID. | All 41 `@claim:` commands from a clean clone; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); `.factory/evidence/polish-3/live-landing-390.png`. |
| F-1-3 | Kept distinct claim coverage for README CLI, installer, receipt, release, and billing statements. | Clean-clone `@claim:declared-upgrade-path`, `@claim:homebrew-tap`, `@claim:scoop-manifest`, `@claim:release-asset-set`, and `@claim:release-workflow`; [README](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/blob/main/README.md). |
| F-1-4 | Kept “sample demo” as the single visitor-facing term across site, CLI, README, and demo guide. | `@claim:sample-demo-parity`; [live demo](https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1); `.factory/evidence/polish-3/live-demo-query-390.png`. |
| F-1-5 | Kept the concrete hero label “Upgrade rehearsal for self-hosted products.” | Full browser suite; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); `.factory/evidence/polish-3/live-landing-390.png`. |
| F-1-6 | Kept the metaphorical hero-art label removed. | Copy audit and full browser suite; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); `.factory/evidence/polish-3/live-landing-390.png`. |
| F-1-7 | Kept the plain scope caption about tested versions and supported environments. | `@claim:receipt-scope`; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); `.factory/evidence/polish-3/live-landing-390.png`. |
| F-1-8 | Kept the section label “Sample terminal recording.” | Full browser suite; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); `.factory/evidence/polish-3/live-landing-390.png`. |
| F-1-9 | Kept the result-naming heading “Sample upgrade rehearsal.” | Full browser suite; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); `.factory/evidence/polish-3/live-landing-390.png`. |
| F-1-10 | Kept “How the upgrade rehearsal works” and “Declare, run, and share a receipt.” | Full browser suite and copy audit; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); `.factory/evidence/polish-3/live-landing-390.png`. |
| F-1-11 | Kept “CLI installation” as the installation section label. | `@regression:install-navigation`; [live install](https://selfhost-upgrade-rehearsal.sociobot.in/#install); final browser audit focus result. |
| F-1-12 | Kept “Receipt limits” as the limits section label. | Full browser suite and copy audit; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); `.factory/evidence/polish-3/live-landing-390.png`. |
| F-1-13 | Kept the exact $79 one-time Team kit scope in plain words. | `@claim:team-kit-price-scope`; [live terms](https://selfhost-upgrade-rehearsal.sociobot.in/terms); `.factory/evidence/polish-3/live-terms-390.png`. |
| F-1-14 | Kept preview labels for tested versions, schema changes, and the three-change count. | `@claim:receipt-contents`; [live demo](https://selfhost-upgrade-rehearsal.sociobot.in/demo); `.factory/evidence/polish-3/live-demo-route-390.png`. |
| F-1-15 | Kept headings that name test commands and release CI. | Full browser suite and copy audit; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); `.factory/evidence/polish-3/live-landing-390.png`. |
| F-1-16 | Kept README wording that names versions, resources, schemas, and commands rather than an unexplained abstraction. | `@claim:declared-upgrade-path`; [README](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/blob/main/README.md). |
| F-1-17 | Kept route-specific title, description, canonical, Open Graph, and Twitter metadata for Demo, Privacy, Terms, and 404. | `npm test` route metadata suite; [live privacy](https://selfhost-upgrade-rehearsal.sociobot.in/privacy), [live terms](https://selfhost-upgrade-rehearsal.sociobot.in/terms); `.factory/evidence/polish-3/live-browser-audit.json`. |
| F-2-1 | Kept explicit `/#install` behavior: land on the section, focus its heading, announce it, and leave demo storage. | `@regression:install-navigation`, `@regression:install-deep-link`; [live install](https://selfhost-upgrade-rehearsal.sociobot.in/#install); `.factory/evidence/polish-3/live-install-390.png`; final audit records `install-title` focus and section top. |
| F-3-1 | Replaced “checked template” with “declaration template,” added the schema/hooks prerequisite to README, CLI help, and generated Compose/Kubernetes templates, and registered an exact claim. Released the correction in v0.1.3. | `@claim:starter-templates`; verified v0.1.3 Linux archive SHA-256 against `SHA256SUMS`, then ran `rehearsal init compose` and `rehearsal check --file` (expected missing-schema exit 2); [release v0.1.3](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/tag/v0.1.3); accompanying live-site capture `.factory/evidence/polish-3/live-root-final/screenshot-desktop.png`. |

## Final live checks

The final cold-browser audit covers `/`, `/?demo=1`, `/demo`, `/privacy`,
`/terms`, and an unknown URL at 390×844. It records route titles, one H1 and
main landmark, no horizontal overflow, demo isolation/reset/offline behavior,
no unexpected network requests, no console or page errors, and zero axe
violations. Evidence: `.factory/evidence/polish-3/live-browser-audit.json`.

Final mobile Lighthouse scores are Performance 100, Accessibility 100, Best
Practices 100, and SEO 100 (LCP 1.2 s, CLS 0, TBT 20 ms). Evidence:
`.factory/evidence/polish-3/lighthouse-live.json`; full-page screenshot
collection was disabled to avoid a browser-container artifact.

The shipped release is [v0.1.3](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/tag/v0.1.3), with the updated Homebrew formula in the [tap](https://github.com/B-Divyesh/homebrew-selfhost-upgrade-rehearsal/blob/main/Formula/rehearsal.rb).
