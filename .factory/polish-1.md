# Perfection-loop polish 1 — finding closure

Reviewed against `.factory/review-1.md` and all earlier verification and polish history. There were no earlier `review-*.md` or `polish-*.md` files. Every current finding and every earlier regression named by the review is closed in release `v0.1.2`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rebuilt the true 404 as a complete product page with skip link, header, navigation, main, footer, legal links, build ID, route metadata, favicon, theme colour, and plain recovery copy. The Static Web Apps response override still returns HTTP 404. | `site/tests/site.spec.ts` — “real 404 document has the complete shell and route metadata”; live `GET /does-not-exist` = 404; axe serious/critical = 0; `.factory/evidence/live/404-390.png`. |
| F-1-2 | Registered every landing promise in `.factory/claims.json`. Added distinct sandbox checks for the sample run, customer boundary, receipt scope, Team kit price/scope, free formats, Sociobot merchant/refunds/checkout, and matching published download. | All 41 exact claim commands passed from the final clean clone. Relevant IDs: `sample-demo-parity`, `customer-boundary`, `receipt-scope`, `team-kit-price-scope`, `free-cli-formats`, `sociobot-merchant`, `sociobot-refunds`, `sociobot-checkout`, `published-platform-download`, `release-manifest`. |
| F-1-3 | Registered the README promises separately, including declared path behavior, Homebrew/Scoop publication, release asset set, receipt contents, scope, free formats, billing boundary, and release workflow. | Claim IDs `declared-upgrade-path`, `homebrew-tap`, `scoop-manifest`, `release-asset-set`, `receipt-contents`, `receipt-scope`, `free-cli-formats`, `sociobot-license-api`, `no-embedded-payment-provider`, `release-workflow`; published `v0.1.2` release and Homebrew tap commit `ff3e872`. |
| F-1-4 | Standardized the user-visible term to “sample demo” on the site, in CLI output, README, and demo documentation. | `@claim:sample-demo-parity`; `.factory/evidence/live/demo-390.png`; terminology table in `.factory/copy-audit.md`. |
| F-1-5 | Replaced the hero lore label with “Upgrade rehearsal for self-hosted products.” | Browser copy assertion in `site/tests/site.spec.ts`; `.factory/evidence/live/landing-390.png`. |
| F-1-6 | Removed “Plate I · known path” from the hero art. | Browser copy regression in `site/tests/site.spec.ts`; `.factory/evidence/live/landing-390.png`. |
| F-1-7 | Replaced the metaphorical caption with “A receipt names the tested versions and supported environments.” | `@claim:receipt-scope`; `.factory/evidence/live/landing-390.png`. |
| F-1-8 | Renamed the preview label to “Sample terminal recording.” | Browser copy assertion in `site/tests/site.spec.ts`; `.factory/evidence/live/landing-390.png`. |
| F-1-9 | Renamed the preview heading to “Sample upgrade rehearsal.” | Browser heading assertion in `site/tests/site.spec.ts`; `.factory/evidence/live/landing-390.png`. |
| F-1-10 | Replaced “Method” and its vague heading with “How the upgrade rehearsal works” and “Declare, run, and share a receipt.” | Browser copy assertion in `site/tests/site.spec.ts`; full `npm test`. |
| F-1-11 | Renamed “Field kit” to “CLI installation.” | Browser copy assertion in `site/tests/site.spec.ts`; `.factory/evidence/live/landing-390.png`. |
| F-1-12 | Renamed “Specimen boundary” to “Receipt limits.” | Browser copy assertion in `site/tests/site.spec.ts`; `.factory/evidence/live/landing-390.png`. |
| F-1-13 | Rewrote the paid scope as “The $79 one-time Team kit adds a CI checklist for each supported source and target version.” | `@claim:team-kit-price-scope`; recorded license/entitlement fixture in the browser suite. |
| F-1-14 | Replaced “Path” and “3 labelled” with “Tested versions” and “3 schema changes.” | Browser summary assertion in `site/tests/site.spec.ts`; `.factory/evidence/live/demo-390.png`. |
| F-1-15 | Replaced the jargon headings with “Run the test commands” and “Run the rehearsal in release CI.” | Browser copy assertion in `site/tests/site.spec.ts`; `.factory/copy-audit.md`. |
| F-1-16 | Rewrote README’s “public surface” sentence to name the declaration fields directly. | README copy regression in `site/tests/claims.spec.ts`; full clean-clone test suite. |
| F-1-17 | Added per-route descriptions and Open Graph/Twitter titles and descriptions in both generated route documents and History API navigation. | `site/tests/site.spec.ts` — direct-route and navigation metadata assertions; live `/`, `/?demo=1`, `/privacy`, and `/terms` metadata checks, all 200 and console-clean; route screenshots in `.factory/evidence/live/`. |

## Cumulative regression closure

The earlier verification issues cited by review 1 remain covered: true 404 status, schema value redaction, cached invalid-license handling, 390 px overflow, 200% text reflow, 44 px targets, installer checksums, package assets, argument-array execution, and demo privacy/isolation. The final full suite, claim-by-claim clean-clone run, live axe sweep, and cold live check passed.

## Live evidence

- Product: `https://selfhost-upgrade-rehearsal.sociobot.in`
- Demo: `https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1`
- Release: `https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/tag/v0.1.2`
- GitHub Actions release run: `33257395063`
- Static deployment: `62b5959b-3133-4988-9a7c-f800077791b1`
- Cold verifier output: `.factory/evidence/live/verify.json`
- Desktop capture: `.factory/evidence/live/screenshot-desktop.png`
- Mobile landing: `.factory/evidence/live/landing-390.png`
- Mobile demo: `.factory/evidence/live/demo-390.png`
- Mobile Privacy: `.factory/evidence/live/privacy-390.png`
- Mobile Terms: `.factory/evidence/live/terms-390.png`
- Mobile 404: `.factory/evidence/live/404-390.png`

No finding is deferred.
