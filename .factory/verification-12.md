# Independent verification 12 — FAIL

## Release decision

**FAIL — the requested candidate cannot be verified or released.** The supplied
candidate SHA `4510fe62d2c568fefb7ef464a621ab929763a92f` is not an object in
the clean clone or on `origin`: `git fetch origin <sha>` returned
`upload-pack: not our ref`. The reachable `main` and work-order base is instead
`4510fedc1a6aa668b457a5e672a8fddca700d09e`. Therefore there is no way to
prove that production matches the requested candidate, which is a release
blocker even though the available base passes the checks below.

Tested URL: <https://selfhost-upgrade-rehearsal.sociobot.in> (2026-08-30 UTC).
Clean clone: `/tmp/selfhost-qa-LdyM2b/repo` at
`4510fedc1a6aa668b457a5e672a8fddca700d09e`.

## Blocker

| Severity | Finding | Evidence / required resolution |
| --- | --- | --- |
| Blocker | Candidate identity is unavailable. | Neither `git cat-file -t` nor `git fetch origin 4510fe62d2c568fefb7ef464a621ab929763a92f` can resolve it; the remote reports `not our ref`. Push the exact candidate (or issue a corrected SHA) and rerun deployment identity verification. |

No other defects were found on the reachable base.

## Mandatory first checks

`.factory/claims.json` exists and contains 47 entries. After `npm ci` in a
fresh clone, I ran every manifest `test` command separately and in manifest
order. All 47 passed. The command log is
`/tmp/selfhost-qa-LdyM2b/claim-tests.log` (47 command headers; none failed).

Cold first-read of the live root passed. The first screen says “Rehearse
upgrades before customers do,” names self-hosted Compose/Kubernetes product
teams, and offers the visible one-click **Try it with sample data** action with
the immediate outcome (“Runs the bundled sample demo and opens its receipt”).
It also states the three relevant facts: no project-data upload, offline demo
after load, and MIT-licensed core CLI.

## Clean build and CLI evidence (reachable base)

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 33 packages, 0 reported vulnerabilities |
| `npm test` | PASS; 6 Rust tests and 126 Playwright executions passed; 5 intentional project skips |
| `npm run lint` | PASS; rustfmt, Clippy with `-D warnings`, strict TypeScript |
| `npm run build` | PASS; release binary and `dist/site` produced |
| `cargo package --locked` | PASS; `target/package/rehearsal-0.1.5.crate` produced |
| Clean packaged consumer | PASS; `cargo install --path target/package/rehearsal-0.1.5 --root <temp>` installed `rehearsal 0.1.5`; `demo --json` returned `ready`, Arbor Desk `1.8.4 → 2.0.0`, schema 1, 9 checks, and `customer_safe: true` |
| Published Linux package | PASS; v0.1.5 archive matches `SHA256SUMS`, reports `rehearsal 0.1.5`, and produces JSON and HTML receipts |
| Shipped shell installer | PASS; with a temporary `REHEARSAL_INSTALL_DIR` and `REHEARSAL_VERSION=v0.1.5`, it verified the archive checksum, installed the binary, and the binary reported 0.1.5 |

The normal sample run produced 9 passed backup/restore/health checks, 3 schema
changes, 768 MB memory, 2,048 MB disk, Linux/x86_64 tested environment, and
the declared Linux/macOS/Windows + x86_64/aarch64 support scope. A non-empty
demo output directory recovered safely with exit 2 and an actionable message.
The manifest tests also covered invalid declarations (exit 2), failed checks
(exit 1), Compose and Kubernetes declarations, literal hook argument arrays,
redaction, temporary workspace isolation, JSON output, and receipt scope.

## Live deployment, privacy, and security

Production byte-matches the reachable base, not the unavailable candidate:

| File | SHA-256 | Result |
| --- | --- | --- |
| `index.html` | `042de581e253bad3ffecd9ab4de7180ba80cea2021121f302c2c66429d1822d4` | local = live |
| `assets/index-_5jUxj35.js` | `bcb0b1bb71c943a2bbe80b1b403fea40e695f5717a4f0ce901a4660e34eb0dce` | local = live |
| `assets/index-CB5JWaCw.css` | `a859dd42f754f7914d1907c3776801b378d1d35fc91618ee8985dede21032a5b` | local = live |

`verify-url.sh` passed: HTTPS 200, title, `lang=en`, one h1, main landmark,
image alt text, labelled buttons, and no console/page errors. An unknown live
route returned HTTP 404. Root response headers include HSTS, `nosniff`, strict
origin referrer policy, restrictive permissions policy, and an appropriate CSP
with `frame-ancestors 'none'` as a response header. Root caching is 30 seconds;
hashed JS and CSS use `public, max-age=31536000, immutable`.

Cold root traffic was same-origin assets plus the disclosed GitHub release API
request. The completed live demo reset/replay made only three bodyless,
same-origin GETs (document, JS, CSS), stored no local data, and produced no
console/page errors. The core CLI has no built-in network client; configured
hooks remain the documented explicit boundary. The paid action redirects with
HTTP 303 to Dodo through the Sociobot product checkout; an invalid verification
returns HTTP 200, `{valid:false,reason:"invalid"}`, and `Cache-Control:
no-store`.

The documented verification allowance is enforced: 30 sequential requests
from one client returned 200; request 31 returned **429** with
`Retry-After: 1`.

## Browser, accessibility, and performance

Playwright/Axe checks on live `/`, `/?demo=1`, `/privacy`, `/terms`, and
`/404.html` found zero serious or critical violations and no console/page
errors. At 390px every page had `scrollWidth == innerWidth == 390`; keyboard
Tab reached the skip link with a visible `rgb(166,58,36)` 3px outline and Enter
moved focus to `main`. In `prefers-reduced-motion`, transitions reduced to
`1e-05s` and no animation ran.

The standalone `@axe-core/cli` could not find a system Chrome in this image;
the equivalent installed `@axe-core/playwright` scan above ran against the
Playwright Chromium used by the product test suite. Mobile Lighthouse (fresh
run with that Chromium) was Performance 100, Accessibility 100, Best Practices
100, SEO 100; FCP 1.0s, LCP 1.3s, TBT 20ms, CLS 0. Initial JS is 22,948 bytes
(7,780 gzip), CSS 13,411 bytes (3,780 gzip), and the largest static hero asset
is 70,902 bytes, all within budget.

## Next step

Make `4510fe62d2c568fefb7ef464a621ab929763a92f` reachable on the remote, or
correct the release request to `4510fedc1a6aa668b457a5e672a8fddca700d09e`.
Only then can the byte-match evidence be attributed to the requested release.
