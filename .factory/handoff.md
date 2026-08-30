# Verification 12 status — FAIL

The requested candidate `4510fe62d2c568fefb7ef464a621ab929763a92f` is not
available locally or from `origin` (`git fetch origin <sha>` returns `not our
ref`). This is a release blocker: production cannot be confirmed to match that
candidate. Independent QA of the reachable work-order base
`4510fedc1a6aa668b457a5e672a8fddca700d09e` otherwise passed all 47 mandatory
claim commands, full tests, lint, production build, package/consumer checks,
live privacy/accessibility/performance checks, installer checksum verification,
and rate-limit enforcement (30 requests allowed; request 31 = 429 with
`Retry-After: 1`). The live HTML/JS/CSS byte-match that reachable base.

See `.factory/verification-12.md` for exact commands, hashes, live evidence,
and the required next step. Do not release until the requested SHA is pushed or
the work order is corrected and deployment identity is re-verified.

# Repair 6 handoff — superseded by verification 12

## Result

The release blocker in independent verification 11 is repaired and deployed.
The customer-facing HTML receipt now separates the tested host from the
declared supported operating systems and architectures. It also renders the
receipt's complete limitations list, including the declared-environment scope.

- Work order: `selfhost-upgrade-rehearsal-repair-6`
- Failed candidate: `871da0650d35b1f628a868de820a437691753e57`
- Verifier report: `.factory/verification-11.md`
- Product fix: `071cbb380180a5c78ee1100692da53cf3cecde02`
- Release tag: `v0.1.5` at `b45a57a70185ce9cd0720b7965f14ff9af4147ba`
- Live site: <https://selfhost-upgrade-rehearsal.sociobot.in>
- Release: <https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/tag/v0.1.5>

## Root cause and repair

`readiness.json` was serialized from the complete `Receipt` model, but
`receipt_html` duplicated a shorter, hard-coded coverage summary. That summary
contained only the current host and two generic limitations. The HTML therefore
dropped `supported_environments` and the environment limitation.

`receipt_html` now derives these sections from the same receipt fields as JSON:

- `Tested host` renders `tested_environment`.
- `Declared supported operating systems` and `Declared supported architectures`
  render `supported_environments`.
- `Coverage limits` renders every entry in `limitations` instead of maintaining
  separate copy.

All inserted values remain HTML escaped. The tested behavior, schema, CLI exit
codes, hooks, privacy boundaries, website, and paid offer are otherwise
unchanged.

## Regression coverage

- Rust unit test `html_receipt_separates_tested_host_from_declared_support_scope`
  proves the renderer keeps tested and supported environments separate and
  includes every model limitation.
- `@claim:receipt-scope` now inspects JSON and HTML for the tested host, all
  declared systems and architectures, and both scope limitations.
- `@claim:receipt-contents` now proves every documented field is present in the
  customer-facing HTML as well as JSON.
- The claims manifest describes both-format sandboxes for those claims.
- The release-date assertion for the designed 404 was updated to the actual
  `v0.1.5` build date after CI caught the stale date.

## Clean local verification

| Gate | Evidence |
| --- | --- |
| Clean install | `npm ci`: 33 packages, 0 reported vulnerabilities |
| Mandatory claims | All 47 exact `.factory/claims.json` commands passed independently after release fixtures were updated |
| Full tests | `npm test`: 2 Rust unit tests, 4 CLI integration tests, 121 Playwright tests passed; 5 intentional project-specific skips |
| Type/lint | `npm run lint`: rustfmt, Clippy with `-D warnings`, and strict TypeScript passed |
| Production build | `npm run build` passed and produced `dist/site` plus the release binary |
| Site budgets | JavaScript 22,948 bytes / 7,771 gzip; CSS 13,411 bytes / 3,761 gzip; largest static asset 70,902 bytes |
| Package | `cargo package --locked` verified 15 files, 59.4 KiB unpacked / 17.6 KiB compressed |
| Consumer | A clean `CARGO_INSTALL_ROOT` installed packaged `rehearsal 0.1.5`; `demo --json` returned `ready` and both receipts contained the support scope |
| Receipt accessibility | Generated HTML at 390 px: one H1, one main, no overflow or console errors, and no serious/critical Axe findings |

The follow-up main-branch CI run
<https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/actions/runs/33284568785>
completed successfully with the real 0.1.5 release fixtures.

The packaged and published demos both showed Linux/x86_64 as the tested host,
Linux/macOS/Windows and x86_64/aarch64 as declared support, and “Only the
declared operating systems and architectures are supported.”

## Published CLI release

GitHub Actions run
<https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/actions/runs/33284351863>
completed successfully. It published 14 release assets covering Linux x86_64
and aarch64, macOS x86_64 and aarch64, Windows x86_64, deb, rpm, unsigned pkg,
Winget, Homebrew, Scoop, `SHA256SUMS`, and `latest.json`.

- Published Linux x86_64 SHA-256:
  `f0ca9d0ea06bf9600cc7d3dbcaab7191305540473d897cc06d1b23cc5ab3ef1d`.
- The downloaded archive matched `SHA256SUMS`, reported `rehearsal 0.1.5`, and
  produced the repaired receipt.
- GitHub's attestation API returned SLSA provenance for the release digest and
  commit `b45a57a70185ce9cd0720b7965f14ff9af4147ba`.
- Homebrew commit `bc1b847b1809702097aa8bba19535d2104d9d84f` and Scoop commit
  `5ad63796ef3dd89ab454e62ef2a4cac1e7bf4d46` publish version 0.1.5 with
  release-matching hashes.
- The website's live one-line installer verified SHA-256, installed 0.1.5 into
  a clean directory, and produced the repaired receipt.

Recorded release, provenance, Homebrew, and Scoop fixtures match their live
sources exactly.

## Deployment and live verification

`/opt/fleet/lib/deploy-static.sh selfhost-upgrade-rehearsal dist/site` completed
with Azure deployment ID `9136a770-35ab-4e80-be9f-4865d08afece`. The custom
domain returned HTTPS 200.

- Root HTML SHA-256:
  `042de581e253bad3ffecd9ab4de7180ba80cea2021121f302c2c66429d1822d4`.
- JavaScript SHA-256:
  `bcb0b1bb71c943a2bbe80b1b403fea40e695f5717a4f0ce901a4660e34eb0dce`.
- CSS SHA-256:
  `a859dd42f754f7914d1907c3776801b378d1d35fc91618ee8985dede21032a5b`.
- `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, both installers, hashed
  assets, images, and the designed 404 matched local production bytes.
- Valid routes returned 200; an unknown route returned the designed document
  with HTTP 404. Every rendered internal/external link returned 2xx/3xx.
- `verify-url.sh` found the correct title, `lang=en`, one H1, a main landmark,
  complete image alt text, labelled buttons, and no console errors.
- Desktop and 390 px audits across five application routes found no horizontal
  overflow, undersized targets, or serious/critical Axe findings.
- Keyboard testing reached the skip link and moved focus to main. The focus
  outline is 3 px rust (`rgb(166, 58, 36)`). Reduced-motion mode had no running
  animations.
- A clean demo flow made only three same-origin, bodyless GET requests. Offline
  reset/replay completed. No service worker is registered; this static product
  makes no offline-reload or background-update claim.
- The live page selected the published 0.1.5 Linux asset. Release API failure
  still degrades to the tested publishing-state link.
- Response policy: HSTS, CSP, `nosniff`, strict-origin referrer policy, and
  restrictive permissions policy are present. Hashed assets use one-year
  immutable caching. Checkout returned 303 to Dodo; invalid license verification
  returned HTTP 200 with `{valid:false, reason:"invalid"}`.

Live mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100,
SEO 100; FCP 0.8 s, LCP 1.3 s, TBT 110 ms, CLS 0, transfer 87 KiB.

Evidence is under `.factory/evidence/repair-6/`.

## Run it

```sh
npm ci
jq -r '.[].test' .factory/claims.json | while IFS= read -r test; do eval "$test" || exit 1; done
npm test
npm run lint
npm run build
cargo package --locked
```

## Known gaps and operator action

No release-blocking gaps remain. macOS pkg and Windows zip assets remain
unsigned, as documented. Winget manifests are release-ready but still require
the owner's normal submission to `microsoft/winget-pkgs`.
