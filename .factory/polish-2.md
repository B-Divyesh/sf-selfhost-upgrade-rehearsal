# Perfection-loop polish 2 — finding closure

Reviewed `.factory/review-2.md`, `.factory/review-1.md`, and
`.factory/polish-1.md` against the current source and the cold production site.
Every finding is closed. No finding is deferred.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the complete product-specific 404 shell, plain recovery copy, route metadata, legal links, and real HTTP 404 response. | `real 404 document has the common shell, recovery action, and complete metadata`; live `/cold-missing-page` returned 404 with one H1/main/header/footer, Privacy and Terms, and zero serious/critical axe findings in `.factory/evidence/polish-2/live-browser-audit.json`. |
| F-1-2 | Retained manifest coverage for every landing-page promise and its observable sandbox behavior. | All 41 exact manifest commands passed from clean clone `59b6ab8`; `.factory/evidence/polish-2/claim-tests-clean-clone.log`. |
| F-1-3 | Retained distinct claim coverage for the README's CLI, installer, receipt, release, and billing statements. | Claim IDs and test tags are one-to-one (41 each); the clean-clone claim log includes Homebrew, Scoop, release asset, receipt content, workflow, and billing tests. |
| F-1-4 | Kept “sample demo” as the single visitor-facing term across browser, CLI, README, and demo documentation. | `@claim:sample-demo-parity`; `.factory/copy-audit.md`; live `/?demo=1`. |
| F-1-5 | Kept the concrete hero label “Upgrade rehearsal for self-hosted products.” | `landing has one clear page outline and no serious accessibility errors`; `.factory/evidence/polish-2/live-landing-mobile.png`. |
| F-1-6 | Kept the metaphorical “Plate I” label removed from the hero art. | Landing copy audit and cold live screenshot `.factory/evidence/polish-2/live-landing-mobile.png`. |
| F-1-7 | Kept the scope caption “A receipt names the tested versions and supported environments.” | `@claim:receipt-scope`; live `/`; clean-clone claim log. |
| F-1-8 | Kept the section label “Sample terminal recording.” | Landing copy audit; live `/`; full clean-clone browser suite. |
| F-1-9 | Kept the result-naming heading “Sample upgrade rehearsal.” | Landing copy audit; live `/`; full clean-clone browser suite. |
| F-1-10 | Kept “How the upgrade rehearsal works” and “Declare, run, and share a receipt.” | Landing copy audit; live `/`; full clean-clone browser suite. |
| F-1-11 | Kept the section label “CLI installation.” | Live `/#install`; `.factory/evidence/polish-2/live-install-mobile.png`. |
| F-1-12 | Kept the section label “Receipt limits.” | Landing copy audit; live `/`; full clean-clone browser suite. |
| F-1-13 | Kept the exact $79 one-time Team kit scope in plain words. | `@claim:team-kit-price-scope`; clean-clone claim log; live `/terms`. |
| F-1-14 | Kept the preview labels “Tested versions,” “Schema changes,” and “3 changes.” | `@claim:receipt-contents`; live demo screenshot `.factory/evidence/polish-2/live-demo-first-screen-mobile.png`. |
| F-1-15 | Kept the headings “Run the test commands” and “Run the rehearsal in release CI.” | Landing copy audit; live `/`; full clean-clone browser suite. |
| F-1-16 | Kept README copy that directly names versions, resources, schemas, and commands. | README copy audit in `.factory/review-2.md`; clean-clone full suite. |
| F-1-17 | Retained distinct title, description, canonical, Open Graph, and Twitter metadata for Demo, Privacy, and Terms. | `every application route updates its own title, description, canonical, and social metadata`; cold live route records in `.factory/evidence/polish-2/live-browser-audit.json`. |
| F-2-1 | Added explicit `/#install` navigation that renders the landing route when needed, scrolls immediately to the section, focuses “Install one binary,” announces “CLI installation,” and clears demo-only storage when leaving the demo. Direct `/#install`, back/forward, modified clicks, and normal links retain real URL behavior. | `@regression:install-navigation` and `@regression:install-deep-link` pass in desktop and mobile projects. After 250 ms live section top was 0.44 px desktop and 0.22 px mobile; focus was `install-title`. Screenshots: `.factory/evidence/polish-2/live-install-desktop.png` and `.factory/evidence/polish-2/live-install-mobile.png`. Live URL: `https://selfhost-upgrade-rehearsal.sociobot.in/#install`. |

## Cumulative acceptance evidence

- Clean clone: `59b6ab8b8503e896a15d210a6a47789fbe7f369a`.
- Every claim command: 41 passed, 0 failed.
- Full clean-clone suite: 5 Rust tests and 103 Playwright tests passed; 4 intentional platform-specific skips.
- Browser/axe sweep: `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a real 404 at 1440×900 and 390×844; zero serious/critical findings, console errors, or horizontal overflow.
- Demo: only `sessionStorage["demo:active"]`; real sentinel preserved; offline reset and JSON download passed; Start for real removed demo keys and focused the install heading.
- Production parity: all 17 public build files matched byte-for-byte.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, TBT 30 ms, CLS 0.
- Deployment: Azure Static Web Apps production deployment `ac06fda0-d025-4b07-9fab-090b7aeda7f5`.
- Live cold verification: 29 August 2026 UTC at `https://selfhost-upgrade-rehearsal.sociobot.in`.

No product-specific defect, earlier regression, minor copy issue, or current
blocking finding remains open.
