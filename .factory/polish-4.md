# Perfection-loop polish 4 — cumulative finding closure

Reviewed `.factory/review-1.md` through `.factory/review-4.md` and `.factory/polish-1.md` through `.factory/polish-3.md`. Every finding below was checked against implementation commit `fdf7229a2d9f38d529664d93f8b21c6c28391c9d` and deployment `a8f36e13-4fca-44c7-8196-b338f5e0a514`. Nothing is deferred.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the product-styled real 404 with skip link, common header/footer, legal links, route metadata, and plain recovery copy. | `real 404 document has the common shell, recovery action, and complete metadata`; live `/round-4-missing` returned 404 with one H1/main/header/footer; `.factory/evidence/polish-4/live/404-390.png`. |
| F-1-2 | Kept every landing promise registered and corrected the previously false customer boundary to distinguish built-in behavior from configured hooks. | 46 exact clean-clone claim commands passed; `@claim:customer-boundary`; live [Receipt limits](https://selfhost-upgrade-rehearsal.sociobot.in/#limits-title) copy in `.factory/evidence/polish-4/live-audit.json`. |
| F-1-3 | Kept separate claim coverage for README CLI, installer, receipt, release, billing, and development statements. | All 46 manifest commands passed from clean clone `fdf7229`; raw GitHub README contains “Run the sample demo”; manifest/tag one-to-one audit reports 46 claims and no extras. |
| F-1-4 | Standardized the isolated example as “sample demo” in the site, CLI, README, and demo guide. | `@claim:sample-demo-parity`; README heading is “Run the sample demo”; live [demo](https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1). |
| F-1-5 | Retained “Upgrade rehearsal for self-hosted products” as the useful hero label. | Full browser suite; `.factory/evidence/polish-4/live/landing-390.png`. |
| F-1-6 | Kept the metaphorical “Plate I” label absent. | Copy audit and live landing screenshot. |
| F-1-7 | Kept the caption that names tested versions and supported environments. | `@claim:receipt-scope`; live landing screenshot. |
| F-1-8 | Kept “Sample terminal recording.” | Full browser suite and `.factory/copy-audit.md`. |
| F-1-9 | Kept “Sample upgrade rehearsal.” | Full browser suite and live landing screenshot. |
| F-1-10 | Kept “How the upgrade rehearsal works” and “Declare, run, and share a receipt.” | Full browser suite and `.factory/copy-audit.md`. |
| F-1-11 | Kept “CLI installation.” | `@regression:install-navigation`; live `/#install` focused `install-title` at top `0.21875px`. |
| F-1-12 | Kept “Receipt limits.” | Full browser suite and live limit-copy audit. |
| F-1-13 | Kept the exact $79 one-time Team kit scope in plain words. | `@claim:team-kit-price-scope`; live landing and `/terms`. |
| F-1-14 | Kept “Tested versions,” “Schema changes,” and “3 changes” in the preview. | `@claim:receipt-contents`; live landing screenshot. |
| F-1-15 | Kept headings that name test commands and release CI. | Copy audit and full browser suite. |
| F-1-16 | Kept README wording that names versions, resources, schemas, and commands. | `@claim:declared-upgrade-path`; current GitHub README. |
| F-1-17 | Retained route-specific titles, descriptions, canonicals, Open Graph, and Twitter metadata. | `every application route updates its own title, description, canonical, and social metadata`; live route matrix in `.factory/evidence/polish-4/live-audit.json`. |
| F-2-1 | Retained real `/#install` navigation, scrolling, focus, history, announcement, and demo cleanup. | `@regression:install-navigation`, `@regression:install-deep-link`; cold live check focused `install-title` and placed the section at `0.21875px`. |
| F-3-1 | Kept “declaration template,” the schema/hook prerequisites, CLI setup message, and exact template claim. | `@claim:starter-templates`; clean-clone full suite and current README. |
| F-4-1 | Removed the false claim that arbitrary configured hooks cannot reach customer paths. The page and manifest now state that the CLI has no built-in network client or discovery, while configured hooks retain host path/network access. The hostile test proves both sides. | `@claim:customer-boundary built-in discovery stays inert while configured hooks retain explicit host access`: an unconfigured sentinel stayed unchanged and `/usr/bin/touch` wrote the configured marker; live limits copy recorded in `.factory/evidence/polish-4/live-audit.json`. |
| F-4-2 | Preserved `position: sticky` at 390px and compacted the banner into two 44px-target rows. | `@regression:demo-banner-mobile`; after scrolling to the receipt at `scrollY=1696`, live banner top/bottom were `0/81.1875px`; `.factory/evidence/polish-4/live/demo-receipt-390.png`. |
| F-4-3 | Changed README heading from “Try the bundled upgrade” to “Run the sample demo.” | `@claim:sample-demo-parity`; cold raw GitHub README check; `.factory/copy-audit.md`. |
| F-4-4 | Removed the unproved “three test workspaces” statement and described the visible recording instead. | Live body contains no old phrase; demo says “This recording shows the Arbor Desk 1.8.4 to 2.0.0 sample demo”; `.factory/evidence/polish-4/live-audit.json`. |
| F-4-5 | Rewrote mobile copy as package availability, added `supported-platforms`, and verified the published desktop matrix plus absence of phone assets. | `@claim:supported-platforms`; live iPhone context showed “Install on macOS, Windows, or Linux” and “No phone or tablet package is provided”; `.factory/evidence/polish-4/live/install-mobile-390.png`. |
| F-4-6 | Extended demo-storage coverage through tab close/reopen while preserving a real-data sentinel. | `@claim:demo-storage-isolation`; live close/reopen produced no `demo:` keys while `real:project` remained `keep`. |
| F-4-7 | Registered four development claims and made the requirements machine-declared with `rust-toolchain.toml` plus package engines. | `@claim:development-requirements`, `@claim:test-coverage`, `@claim:site-build-output`, `@claim:deploy-directory`; all passed independently from the clean clone. |
| F-4-8 | Renamed “Start for real” to “Install the CLI.” | `@claim:demo-storage-isolation` follows the link, clears demo state, reaches `/#install`, and focuses the installation heading; live demo screenshot. |

## Final acceptance evidence

- Clean clone: `/tmp/rehearsal-claims-nIg6AT` at `fdf7229a2d9f38d529664d93f8b21c6c28391c9d`.
- Claims: 46/46 exact `.factory/claims.json` commands passed independently.
- Full clean-clone suite: 5 Rust tests and 114 Playwright tests passed; 4 intentional project-specific skips.
- Build and package: `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and `cargo package --locked` passed.
- Accessibility: Playwright axe and `npx @axe-core/cli` found zero violations on landing, demo, Privacy, and Terms. `/opt/fleet/lib/verify-url.sh` found no load errors.
- Performance: live Lighthouse scored 100 in Performance, Accessibility, Best Practices, and SEO; LCP 1,207ms, TBT 26ms, CLS 0. Raw JS is 22,412 bytes and CSS is 13,411 bytes.
- Privacy/offline: live demo requests stayed same-origin, offline Reset reached `READY`, the demo namespace cleared on exit and tab close, and real storage survived.
- Deployment parity: live HTML, hashed JS/CSS, hero image, `latest.json`, and Demo/Privacy/Terms documents matched `dist/site` byte-for-byte.
- Production: <https://selfhost-upgrade-rehearsal.sociobot.in>; deployed 2026-08-29 UTC with deployment `a8f36e13-4fca-44c7-8196-b338f5e0a514`.
