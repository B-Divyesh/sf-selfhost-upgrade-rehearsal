# Perfection-loop polish 6 — cumulative finding closure

Read `.factory/review-1.md` through `.factory/review-6.md` and
`.factory/polish-1.md` through `.factory/polish-5.md`. The product repair is
commit `0e1b92839c310e0cae06d10f2a2f82affd7a3f57`, deployed as Azure Static Web
Apps deployment `cb269a80-d28b-4e6c-a909-ab3776834ac9`. No finding is
deferred.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the real, styled HTTP 404 with skip link, full shell, legal links, route metadata, and recovery action. | `real 404 document has the common shell, recovery action, and complete metadata`; [live 404](https://selfhost-upgrade-rehearsal.sociobot.in/polish-6-missing); [mobile capture](evidence/polish-6/not-found-390.png); live audit route matrix. |
| F-1-2 | Kept every visitor-facing landing claim in the manifest and added observable coverage where review 6 exposed a gap. | 48/48 exact clean-clone manifest commands; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); [mobile capture](evidence/polish-6/landing-390.png). |
| F-1-3 | Kept separate README claim coverage and added `receipt-path-output` for the printed JSON and HTML paths. | `@claim:receipt-path-output`, `@claim:homebrew-tap`, `@claim:release-asset-set`; current [README](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/blob/main/README.md); live landing capture. |
| F-1-4 | Kept **sample demo** as the only name for the isolated browser and CLI example. | `@claim:sample-demo-parity`; [live sample demo](https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1); [mobile capture](evidence/polish-6/demo-query-390.png). |
| F-1-5 | Kept the useful hero label “Upgrade rehearsal for self-hosted products.” | Landing accessibility test; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); landing capture. |
| F-1-6 | Kept the decorative “Plate I” label absent. | `.factory/copy-audit.md`; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); landing capture. |
| F-1-7 | Kept the receipt-scope caption naming tested versions and supported environments. | `@claim:receipt-scope`; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); landing capture. |
| F-1-8 | Kept “Sample terminal recording” as the named section. | Landing browser test and copy audit; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); landing capture. |
| F-1-9 | Kept “Sample upgrade rehearsal” as the section heading. | Landing browser test and copy audit; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); landing capture. |
| F-1-10 | Kept “How the upgrade rehearsal works” and “Declare, run, and share a receipt.” | Landing browser test and copy audit; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); landing capture. |
| F-1-11 | Kept the installation label and real destination focus. | `@regression:install-navigation`; [live install](https://selfhost-upgrade-rehearsal.sociobot.in/#install) focused `install-title` at 0.21875 px. |
| F-1-12 | Kept “Receipt limits” as the limits label. | Landing browser test and copy audit; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); landing capture. |
| F-1-13 | Kept the exact $79 one-time Team kit scope in plain language. | `@claim:team-kit-price-scope`; [live terms](https://selfhost-upgrade-rehearsal.sociobot.in/terms); demo/terms route audit. |
| F-1-14 | Kept preview labels for tested versions and three schema changes. | `@claim:receipt-contents`; [live sample demo](https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1); demo capture. |
| F-1-15 | Kept headings that explain test commands and release CI. | Copy audit and browser suite; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); landing capture. |
| F-1-16 | Kept README wording that names versions, resources, schemas, and commands. | `@claim:declared-upgrade-path`; current [README](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/blob/main/README.md); live landing audit. |
| F-1-17 | Kept distinct title, description, canonical, Open Graph, and Twitter metadata on Demo, Privacy, Terms, and 404. | `every application route updates its own title, description, canonical, and social metadata`; live `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and 404 matrix in [live-browser-audit.json](evidence/polish-6/live-browser-audit.json). |
| F-2-1 | Kept `/#install` routing with scroll, history, focus, announcement, and demo cleanup. | `@regression:install-navigation` and `@regression:install-deep-link`; [live install](https://selfhost-upgrade-rehearsal.sociobot.in/#install) passed the mobile audit. |
| F-3-1 | Kept “declaration template,” explicit schema/hook setup, and generated Compose/Kubernetes templates. | `@claim:starter-templates`; [live README](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/blob/main/README.md); landing capture. |
| F-4-1 | Kept the honest boundary: no built-in discovery/network client; configured hooks retain explicit access. | `@claim:customer-boundary`; [live limits](https://selfhost-upgrade-rehearsal.sociobot.in/#limits-title); landing capture. |
| F-4-2 | Kept the demo banner sticky at 390 px with two 44 px controls. | Mobile live audit: banner `0–81.1875px`, controls `44px`; [live demo](https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1); demo capture. |
| F-4-3 | Kept “Run the sample demo” in the README. | `@claim:sample-demo-parity`; [live README](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/blob/main/README.md); demo capture. |
| F-4-4 | Kept the unproved three-workspace statement removed. | `@claim:demo-receipt`; [live demo](https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1) states only the observed Arbor Desk sample; demo capture. |
| F-4-5 | Kept mobile wording as package availability and tested the published desktop matrix. | `@claim:supported-platforms`; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); landing capture. |
| F-4-6 | Kept demo storage isolated through reset, exit, and tab close while preserving real storage. | `@claim:demo-storage-isolation`; [live demo](https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1); live audit records `real:*` preservation and cleared `demo:*`. |
| F-4-7 | Kept the four development statements registered and tested. | `@claim:development-requirements`, `@claim:test-coverage`, `@claim:site-build-output`, and `@claim:deploy-directory`; clean clone evidence. |
| F-4-8 | Kept the exit action named “Install the CLI.” | `@claim:demo-storage-isolation`; [live demo](https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1); exit reaches focused live install section. |
| F-5-1 | Kept Dodo’s tested merchant/returns wording and evidence-based checkout fixture. | `@claim:dodo-merchant-returns` and `@claim:dodo-checkout-processing`; [live terms](https://selfhost-upgrade-rehearsal.sociobot.in/terms); terms route audit. |
| F-5-2 | Kept current v0.1.5 release/tap/Scoop/attestation fixtures bound to package version and executed placeholders. | `@claim:installer-provenance-rollback`, `@claim:homebrew-tap`, `@claim:scoop-manifest`, `@claim:release-asset-set`, and `@claim:path-placeholders`; [live download](https://selfhost-upgrade-rehearsal.sociobot.in/). |
| F-5-3 | Kept the active fallback labelled “Open GitHub releases.” | `@regression:release-publishing-state`; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/); landing capture. |
| F-6-1 | Replaced the success-only workspace test with an instrumented fresh declaration. Its seed, backup, restore, and health hooks append `process.cwd()` outside the workspace; two runs prove one shared new OS-temporary `rehearsal-*` directory per run and different directories across runs. | `@claim:temporary-workspace`; 48/48 clean-clone claims; [live landing](https://selfhost-upgrade-rehearsal.sociobot.in/) keeps the tested wording. |
| F-6-2 | Added `receipt-path-output`; it runs `rehearsal demo` without `--json`, parses both printed lines, and opens each printed receipt. | `@claim:receipt-path-output`; current [README](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/blob/main/README.md); live route audit. |

## Acceptance evidence

- Clean clone: `/tmp/selfhost-upgrade-rehearsal-clean-33kD0E` at
  `0e1b92839c310e0cae06d10f2a2f82affd7a3f57`; all **48/48** exact manifest
  commands completed independently. The manifest has 48 IDs and the source
  has exactly 48 matching unique `@claim:` tags.
- Local quality gate: `npm test` passed (6 Rust tests, 3 identity tests, 126
  Playwright passes, 4 intentional project-condition skips); `npm run lint`,
  `npm run build`, and `cargo package --locked` passed. `dist/site` exists.
- Production: [live site](https://selfhost-upgrade-rehearsal.sociobot.in/)
  returned HTTP 200. `verify-url.sh` reported title, `lang=en`, one H1, a main
  landmark, alt text, and no console errors in
  [verify.json](evidence/polish-6/live-verify/verify.json). The installed Axe
  CLI could not start its Selenium Chrome binary; the Playwright Axe audit in
  [live-browser-audit.json](evidence/polish-6/live-browser-audit.json) ran the
  same Axe engine across all six routes and both required viewports with zero
  serious/critical violations.
- Mobile live Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.8 s, TBT 40 ms, CLS 0. Evidence:
  [lighthouse-live.json](evidence/polish-6/lighthouse-live.json). Initial JS
  is 22.95 kB raw / 7.78 kB gzip and CSS is 13.41 kB raw / 3.78 kB gzip.
- Release identity: `npm run verify:release -- --expected
  0e1b92839c310e0cae06d10f2a2f82affd7a3f57 --site
  https://selfhost-upgrade-rehearsal.sociobot.in` passed. The cold live
  `release.json` was `no-store` and named that exact repair commit.

No cumulative finding, claim coverage hole, accessibility failure, mobile
regression, or product-specific defect remains open.
