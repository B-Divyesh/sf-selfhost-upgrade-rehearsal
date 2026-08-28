# Independent product verification

## Verdict: FAIL

Candidate `69d0a76574399d178633243ce81060a1fb9cf3ca` is not releasable under the supplied work order and brief. Verification ran on 28 August 2026 against the clean clone and `https://selfhost-upgrade-rehearsal.sociobot.in`.

The core CLI, static site, release artifacts, performance, and declared claim tests work. Release is blocked by a customer-data safety failure, a broken live checkout, incomplete claim coverage, and a browser demo receipt that is not the real receipt schema. Secondary packaging, routing, mobile accessibility, and dead-link defects remain.

## Mandatory gates

### First read

Pass. A cold 1440×900 load says:

- What: “Rehearse upgrades before customers do.”
- For whom: self-hosted product teams releasing Compose or Kubernetes products.
- First click: “Try it with sample data,” next to “Runs a complete synthetic upgrade and opens its receipt.”

The action is on the first screen and opens `/demo` in one click. The demo immediately shows the Arbor Desk terminal run and readiness receipt. There were no cold-load console or page errors.

### Claims manifest

`.factory/claims.json` exists. After `npm ci`, every listed command was run independently and serially from candidate commit `69d0a76574399d178633243ce81060a1fb9cf3ca`. Each selected test passed in both configured Chromium projects (desktop and 390 px mobile):

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-receipt` | `npm test -- --grep @claim:demo-receipt` | PASS, 2 tests |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS, 2 tests |
| `demo-network-privacy` | `npm test -- --grep @claim:demo-network-privacy` | PASS, 2 tests |
| `cli-receipts` | `npm test -- --grep @claim:cli-receipts` | PASS, 2 tests |
| `upgrade-hooks` | `npm test -- --grep @claim:upgrade-hooks` | PASS, 2 tests |
| `compose-kubernetes-declarations` | `npm test -- --grep @claim:compose-kubernetes-declarations` | PASS, 2 tests |
| `installer-checksum` | `npm test -- --grep @claim:installer-checksum` | PASS, 2 tests |
| `mit-core` | `npm test -- --grep @claim:mit-core` | PASS, 2 tests |
| `schema-redaction` | `npm test -- --grep @claim:schema-redaction` | PASS, 2 tests |
| `cli-no-upload` | `npm test -- --grep @claim:cli-no-upload` | PASS, 2 tests |
| `team-kit-license` | `npm test -- --grep @claim:team-kit-license` | PASS, 2 tests |

Passing these tests does not clear the claims contract because the cross-check found unlisted public promises and an under-asserted demo receipt. See HIGH-3 and HIGH-4.

## Release-blocking findings

### HIGH-1 — JSON receipts can contain customer data while marked customer-safe

The brief says test artifacts must not include customer data, and the product repeatedly calls its output a “customer-safe readiness receipt.” The CLI copies arbitrary `environment.notes` into the JSON receipt and sets `customer_safe` to `true` unconditionally (`src/lib.rs:266-270`).

Reproduction:

1. Copy the bundled Arbor Desk declaration.
2. Set `environment.notes` to `Customer ACME host db.customer.internal token secret-123`.
3. Run `rehearsal run --file <copy>/rehearsal.yml --output <report> --json`.
4. `readiness.json` contains the full sensitive note and also contains `"customer_safe": true`.

The HTML receipt omits the note, so the two advertised receipt formats have different privacy boundaries. The tool must omit or explicitly redact arbitrary notes, or stop asserting customer safety.

### HIGH-2 — The advertised $79 purchase cannot be completed

The live “Buy the Team kit — $79” link points to the required Sociobot endpoint, but the product is not enabled there:

```text
GET https://api.sociobot.in/api/v1/products/selfhost-upgrade-rehearsal/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

This is fresh live evidence, not an inferred deployment concern. License verification itself responds, but a visitor cannot become a buyer. The public paid feature and its terms are therefore broken.

### HIGH-3 — Public promises are missing from `.factory/claims.json`

The claims contract says any unlisted claim fails review. Examples with no corresponding claim entry include:

- Landing: “The CLI uses a new temporary directory for seed, backup, restore, and health checks.”
- Landing: “Published packages are unsigned.”
- Landing: “It does not upgrade a customer installation.”
- Landing/demo: “Hook output and fixture contents are excluded.”
- README: “Commands are argument arrays, so no shell parsing happens inside the CLI.”
- README: “A failed check returns exit code 1. Invalid input returns exit code 2.”
- README: the receipt is “customer-safe.”

Some behavior has an ordinary unit/integration assertion, but the required manifest entry and exactly tagged sandbox test are absent. The particularly important customer-safe promise is also false for JSON receipts as shown in HIGH-1.

### HIGH-4 — The one-click demo downloads an incomplete receipt

“Download sample JSON” returns an object labelled `receipt_schema: 1`, but it lacks fields emitted by the real schema-1 CLI receipt: `adapter`, `tested_environment`, `supported_environments`, `config_changes`, `limitations`, and per-check `duration_ms`.

The `@claim:demo-receipt` test only checks `JSON.parse(text).status === "ready"`, so it does not prove that the demo produces a usable readiness receipt. The visible demo shows three schema changes that are absent from its download.

## Other findings

### MEDIUM-1 — The documented package command fails after the required install

After `npm ci`, `cargo package --locked` fails and reports 55 ignored `node_modules/**/README.md` and `LICENSE` files as dirty. `Cargo.toml` uses unanchored `README.md` and `LICENSE` include patterns. Running with `--allow-dirty` packages 70 files, including those unrelated Node dependency documents (347.7 KiB unpacked, 92.6 KiB compressed).

The forced package still verified, installed into a fresh consumer root, and ran `rehearsal 0.1.0`, `--help`, and a nine-check demo successfully. The documented clean packaging path itself is not reproducible.

### MEDIUM-2 — Required Homebrew tap is absent

The release contains `rehearsal.rb`, but `https://api.github.com/repos/B-Divyesh/homebrew-selfhost-upgrade-rehearsal` returns 404. The release workflow’s update step reports success because it exits successfully when `FACTORY_GITHUB_TOKEN` is absent. The README accurately qualifies the command with “after the tap is published,” but the installer contract requires the tap to exist for release.

### MEDIUM-3 — Unknown routes are soft 404s

`GET /this-page-does-not-exist` returns HTTP 200 and the SPA’s designed missing-page content. `/404.html` also returns 200. The navigation fallback consumes unknown document routes before the configured 404 response override, so crawlers and clients do not receive an actual 404 status.

### MEDIUM-4 — Mobile targets and small text miss the accessibility contract

At 390×844, seven visible links have a rendered dimension below 44 px. Header links are only 17 px high; footer links are 21 px high. Several first-screen and navigation texts are also below the 16 px baseline (`.plain-facts` renders at 12.8 px; mobile header links at about 10.9 px). Axe does not detect these ergonomic failures.

### MEDIUM-5 — Platform detection offers desktop archives on phones

An emulated iPhone 13 is offered `rehearsal-macos-x86_64.pkg`; an emulated Pixel 5 is offered `rehearsal-linux-x86_64.tar.gz`. The same user-agent logic cannot reliably detect ARM desktop architecture. Unsupported mobile devices need a calm unsupported state rather than an unusable binary.

### MEDIUM-6 — Footer link is dead

The live “Built by Param Factory” link targets `https://paramfactory.com/`, which has no DNS result from the verification environment. The site-structure contract requires every linked HTTP destination to resolve.

### LOW-1 — Empty license input fails silently

The license input has no `required`, `aria-required`, or `aria-describedby`. Submitting it empty leaves “Payment opens Sociobot checkout” unchanged. An invalid non-empty token does correctly produce the live-region recovery text.

### LOW-2 — Strict Rust lint fails

`cargo fmt --all -- --check` passes. `cargo clippy --all-targets --all-features -- -D warnings` fails at `src/lib.rs:252` with `clippy::useless-borrows-in-formatting`. A manual strict TypeScript check of `site/src/main.ts` passes; the repository has no configured typecheck or lint npm script.

### LOW-3 — Builder handoff miscounts release assets

The GitHub API returns 14 assets for `v0.1.0`, while the prior handoff says 13. This does not affect installation.

## Functional and build evidence

- `npm ci`: PASS; 33 packages, zero audit vulnerabilities.
- `npm test`: PASS; 4 Rust unit/integration tests and 26 Playwright tests.
- `npm run build`: PASS; optimized Rust binary and `dist/site` created.
- `npx tsc --noEmit --strict ... site/src/main.ts`: PASS.
- `npm audit --audit-level=high`: PASS; zero vulnerabilities.
- `cargo fmt --all -- --check`: PASS.
- Strict Clippy: FAIL as LOW-2.
- `cargo package --locked`: FAIL as MEDIUM-1.
- `cargo package --locked --allow-dirty`: package verification PASS; fresh consumer install and CLI demo PASS.
- Candidate GitHub test workflow run `33193211068`: PASS.

Representative CLI behavior:

- Bundled Arbor Desk upgrade: ready; nine checks; three schema changes; JSON and HTML written.
- Compose and Kubernetes declarations with isolated fixture hooks: both ready; nine checks each.
- Failed backup hook: exit 1; receipt is `not ready`; later normal hooks are `not run`; cleanup passes.
- Invalid cases (zero resources, same versions, empty OS list, missing schema, unknown field, malformed YAML): exit 2 with a next-step error.
- Boundary resources (`u64::MAX` memory and 1 MB disk): accepted without overflow.
- Hostile product text is HTML-escaped in the generated receipt.
- Docker, Podman, kind, and kubectl were unavailable in this verifier container. No real Docker or kind cluster was launched.

## Live deployment and distribution evidence

- Live HTML, JS, and CSS SHA256 hashes exactly match the candidate’s fresh `dist/site` files.
- Candidate differs from release tag `v0.1.0` only in `.factory/handoff.md`; application source is identical.
- `v0.1.0` release workflow run `33192928225`: all five platform builds and release job passed.
- Release has Linux x64/ARM64, macOS x64/ARM64 archives, two macOS packages, Windows x64 zip, deb, rpm, Scoop, Winget, Homebrew formula, `latest.json`, and `SHA256SUMS` (14 assets).
- Downloaded Linux x64 archive passes its published SHA256 checksum.
- The shipped shell installer independently downloaded, verified, installed, and ran the release binary.
- Published binary `rehearsal demo --json`: `ready`, nine checks, `customer_safe: true`.

## Browser, privacy, and accessibility evidence

- Fresh `/demo` flow request log: document, same-origin JS, and same-origin CSS only. Reset, playback, and JSON download make no requests.
- Fresh landing request log: same-origin document/JS/CSS/hero plus the disclosed GitHub release API request. No analytics, fonts, trackers, or Azure endpoints.
- Root headers: CSP matches GitHub/Sociobot calls; HSTS, `nosniff`, strict-origin referrer policy, and restrictive permissions policy present.
- Cache: HTML `max-age=30, must-revalidate`; hashed JS/CSS `max-age=31536000, immutable`.
- Product unlock verification allowance observed: 30 successful responses from one client; request 31 returned HTTP 429 with `Retry-After: 3` and `X-RateLimit-After: 3`.
- No sign-in exists, so Entra authority verification is not applicable.
- This is not a PWA; it registers no service worker, so service-worker update/offline-reload checks are not applicable.
- `/`, `/demo`, `/privacy`, `/terms`, and the missing-page UI each have `lang=en`, one H1, one main landmark, route-specific title/canonical, no missing image alt, and no viewport overflow at desktop or 390 px.
- Axe: zero serious/critical findings on all routes in desktop and 390 px contexts.
- Keyboard: controls are reachable and operable; the skip link becomes visibly focused and skips header tab order; no trap observed.
- Reduced motion: matched; stamp animation duration resolves to `0.00001s`, scroll behavior to `auto`.
- Factory `verify-url.sh`: PASS; HTTP 200, 863 ms network-idle load, no console errors, title/lang/main/alt checks pass.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.8 s, CLS 0, TBT 100 ms, 85 KiB transferred.
- Bundles: JS 19,243 bytes raw / 6,953 gzip; CSS 12,514 raw / 3,600 gzip; hero WebP 70,902 bytes; all within budget.

## Required fixes before re-verification

1. Remove/redact arbitrary declaration notes from customer-safe receipts and add a claim test that uses sensitive fixtures.
2. Register and enable the Sociobot product; verify the live checkout-to-return-to-license flow.
3. Make `.factory/claims.json` exhaustive and strengthen the demo-receipt test to validate the real schema.
4. Make browser sample JSON identical in shape and content to a real bundled CLI receipt.
5. Fix Cargo include patterns, publish the Homebrew tap, return true 404 responses, and repair the dead footer link.
6. Bring mobile text/targets and platform detection into contract, add empty-license validation, and clear strict Clippy.
