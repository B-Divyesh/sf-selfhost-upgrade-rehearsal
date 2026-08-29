# Perfection-loop polish 5 — cumulative finding closure

Reviewed `.factory/review-1.md` through `.factory/review-5.md` and
`.factory/polish-1.md` through `.factory/polish-4.md`. Implementation commit
`a40c6d64d36a8a98d59fd573fbb36b4991d15f9e` was deployed as Azure Static Web
Apps deployment `753d9ef2-fa7a-4b7e-881b-6de507bf7d01`. No finding is deferred.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the styled real HTTP 404 with skip link, common header/footer, legal links, recovery action, and complete metadata. | Test `real 404 document has the common shell, recovery action, and complete metadata`; `.factory/evidence/polish-5/live/404-390.png`; cold live `/polish-5-cold-missing` returned 404 with zero Axe findings or console errors. |
| F-1-2 | Kept landing promises mapped to observable claims and corrected the commercial claims reopened in round 5. | 47/47 clean-clone claim commands; `@claim:dodo-merchant-returns`, `@claim:customer-boundary`, and `@claim:team-kit-price-scope`; `.factory/evidence/polish-5/live/landing-390.png`; cold live `/` and `/terms`. |
| F-1-3 | Kept distinct README claims, replaced stale v0.1.3 release fixtures, bound distribution checks to package v0.1.4, and added placeholder execution coverage. | `@claim:homebrew-tap`, `@claim:scoop-manifest`, `@claim:release-asset-set`, `@claim:installer-provenance-rollback`, and `@claim:path-placeholders`; `.factory/evidence/polish-5/live/landing-390.png`; live v0.1.4 release, tap, bucket, and attestation checks matched fixtures. |
| F-1-4 | Retained “sample demo” across site, CLI, README, and demo guide. | `@claim:sample-demo-parity`; `.factory/evidence/polish-5/live/demo-query-390.png`; cold live `/?demo=1`. |
| F-1-5 | Retained the useful hero label “Upgrade rehearsal for self-hosted products.” | `landing has one clear page outline and no serious accessibility errors`; `.factory/evidence/polish-5/live/landing-390.png`; cold live `/`. |
| F-1-6 | Kept the metaphorical “Plate I” label absent. | `.factory/copy-audit.md`; `.factory/evidence/polish-5/live/landing-390.png`; cold live `/`. |
| F-1-7 | Kept the tested receipt-scope caption. | `@claim:receipt-scope`; `.factory/evidence/polish-5/live/landing-390.png`; cold live `/`. |
| F-1-8 | Kept “Sample terminal recording” as the section label. | Landing browser test and `.factory/copy-audit.md`; `.factory/evidence/polish-5/live/landing-390.png`; cold live `/`. |
| F-1-9 | Kept “Sample upgrade rehearsal” as the section heading. | Landing browser test; `.factory/evidence/polish-5/live/landing-390.png`; cold live `/`. |
| F-1-10 | Kept the workflow headings “How the upgrade rehearsal works” and “Declare, run, and share a receipt.” | Landing browser test; `.factory/evidence/polish-5/live/landing-390.png`; cold live `/`. |
| F-1-11 | Kept “CLI installation” as the installation label. | `@regression:install-navigation`; `.factory/evidence/polish-5/live/landing-390.png`; cold live `/#install` focused `#install-title`. |
| F-1-12 | Kept “Receipt limits” as the limits label. | Landing browser test; `.factory/evidence/polish-5/live/landing-390.png`; cold live `/`. |
| F-1-13 | Kept the exact $79 one-time Team kit scope in plain words. | `@claim:team-kit-price-scope`; `.factory/evidence/polish-5/live/terms-390.png`; cold live `/terms`. |
| F-1-14 | Kept the preview labels for tested versions and three schema changes. | `@claim:receipt-contents`; `.factory/evidence/polish-5/live/demo-query-390.png`; cold live `/?demo=1`. |
| F-1-15 | Kept result-naming headings for test commands and release CI. | Landing browser test and `.factory/copy-audit.md`; `.factory/evidence/polish-5/live/landing-390.png`; cold live `/`. |
| F-1-16 | Kept README wording that names versions, resources, schemas, and commands. | `@claim:declared-upgrade-path`; `.factory/evidence/polish-5/live/landing-390.png`; live GitHub README at implementation commit `a40c6d6`. |
| F-1-17 | Kept distinct titles, descriptions, canonicals, Open Graph, and Twitter metadata for every route. | `every application route updates its own title, description, canonical, and social metadata`; route screenshots under `.factory/evidence/polish-5/live/`; cold live `/`, `/?demo=1`, `/privacy`, `/terms`, and 404 metadata in `live-browser-audit.json`. |
| F-2-1 | Kept real Install navigation with scroll, history, focus, announcement, and demo cleanup. | `@regression:install-navigation` and `@regression:install-deep-link`; `.factory/evidence/polish-5/live/landing-390.png`; live `/#install` placed the section at 0.44 px and focused `install-title`. |
| F-3-1 | Kept “declaration template,” setup prerequisites, CLI guidance, and both generated adapters. | `@claim:starter-templates`; `.factory/evidence/polish-5/live/landing-390.png`; live README. |
| F-4-1 | Kept the honest boundary: no built-in discovery or network client, while configured hooks retain access. | `@claim:customer-boundary` hostile hook test; `.factory/evidence/polish-5/live/landing-390.png`; cold live Receipt limits section. |
| F-4-2 | Kept the 390 px demo banner sticky with visible 44 px controls. | `@regression:demo-banner-mobile`; `.factory/evidence/polish-5/live/demo-query-390.png`; live banner stayed at y=0–81.1875 after scrolling to the receipt. |
| F-4-3 | Kept “Run the sample demo” in README. | `@claim:sample-demo-parity`; `.factory/evidence/polish-5/live/demo-query-390.png`; cold live `/?demo=1` and live README. |
| F-4-4 | Kept the unsupported three-workspace statement removed. | `@claim:demo-receipt`; `.factory/evidence/polish-5/live/demo-query-390.png`; cold live demo says it shows the Arbor Desk 1.8.4 to 2.0.0 sample demo. |
| F-4-5 | Kept platform copy as package availability and bound it to the current published asset matrix. | `@claim:supported-platforms`; `.factory/evidence/polish-5/live/landing-390.png`; live mobile `/` shows macOS, Windows, Linux, and no phone/tablet package. |
| F-4-6 | Kept demo storage isolated through Reset, exit, and tab close/reopen while preserving real storage. | `@claim:demo-storage-isolation`; `.factory/evidence/polish-5/live/demo-query-390.png`; live close/reopen left no `demo:` keys and preserved `real:project=keep`. |
| F-4-7 | Kept all four development statements machine-declared and tested. | `@claim:development-requirements`, `@claim:test-coverage`, `@claim:site-build-output`, and `@claim:deploy-directory`; `.factory/evidence/polish-5/local/landing-desktop.png`; live README. |
| F-4-8 | Kept the demo exit action named “Install the CLI.” | `@claim:demo-storage-isolation`; `.factory/evidence/polish-5/live/demo-query-390.png`; cold live action cleared demo state and focused `/#install`. |
| F-5-1 / F-1-2 reopened | Replaced the false “Sociobot is the merchant” statement with the live checkout fact that Dodo Payments is merchant of record and handles order questions and returns. Removed the unproved refund-revocation assertion. The test now inspects the recorded 303 checkout and Dodo footer before checking site copy. | `@claim:dodo-merchant-returns` and `@claim:dodo-checkout-processing`; `.factory/evidence/polish-5/live/terms-390.png`; live `/terms` plus a fresh checkout returned 303 to Dodo and exposed the recorded merchant/returns footer. |
| F-5-2 / F-1-3 reopened | Replaced all v0.1.3 distribution fixtures with current v0.1.4 release, tap, Scoop, and GitHub attestation fixtures. Tests bind fixture tags to `package.json`, compare published URLs and digests, prove provenance for every release asset, narrow README to release v0.1.4, and execute both path placeholders. | `@claim:installer-provenance-rollback`, `@claim:supported-platforms`, `@claim:homebrew-tap`, `@claim:scoop-manifest`, `@claim:release-asset-set`, and `@claim:path-placeholders`; `.factory/evidence/polish-5/live/landing-390.png`; live release/API/tap/bucket/attestation parity and Linux archive checksum passed. |
| F-5-3 | Renamed the active fallback to “Open GitHub releases” and removed its disabled styling. | `@regression:release-publishing-state`; `.factory/evidence/polish-5/live/release-fallback-1440.png`; a cold live page with the release API intercepted at 503 exposed the result-naming link to the GitHub releases page. |

## Final acceptance evidence

- Clean clone: `/tmp/rehearsal-polish5-clean-bcb3o6` at `a40c6d64d36a8a98d59fd573fbb36b4991d15f9e`.
- Claims: 47/47 exact `.factory/claims.json` commands passed independently; IDs and tags are one-to-one.
- Full clean-clone suite: 5 Rust tests and 121 Playwright tests passed; 5 intentional project-specific skips.
- Quality: `npm ci`, `npm run lint`, `npm run build`, and `cargo package --locked` passed. `dist/site` was produced.
- Accessibility: landing, demo query, `/demo`, Privacy, Terms, and real 404 had zero serious/critical Axe findings, one H1/main, and no console errors or horizontal overflow at 390 px.
- Privacy/offline: demo requests were same-origin GETs without bodies; offline Reset returned READY; the downloaded receipt was READY with nine checks; demo keys cleared without touching real storage.
- Performance: live Lighthouse scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO; LCP 1,652 ms, TBT 19 ms, CLS 0. JavaScript is 22,948 bytes raw and CSS is 13,411 bytes raw.
- Distribution: v0.1.4 release, Homebrew, Scoop, and GitHub provenance fixtures matched their live sources; the Linux archive passed its published SHA256 checksum.
- Deployment parity: root HTML, route documents, hashed JavaScript/CSS, and both installers matched `dist/site` byte-for-byte.
- Primary evidence: `.factory/evidence/polish-5/verification-summary.json`, `.factory/evidence/polish-5/live/live-browser-audit.json`, `.factory/evidence/polish-5/lighthouse-live.json`, and `.factory/evidence/polish-5/verify-url/verify.json`.

No product-specific defect, earlier regression, copy issue, untested claim, or
current finding remains open.
