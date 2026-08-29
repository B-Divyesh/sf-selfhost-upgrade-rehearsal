# Independent product verification 6

## Verdict: PASS

Candidate `33d92aa9a7d0a1017918fb7ac2f5d9b2c29e3645` is releasable under the supplied work order, researched brief, and attached acceptance contracts. Independent verification ran on 29 August 2026 UTC from the clean candidate checkout against <https://selfhost-upgrade-rehearsal.sociobot.in>.

The previously reported deployment-only concern was not reproduced. Production is healthy, and all 17 publicly deployable files in the fresh `dist/site` build match the live files byte-for-byte. The two blockers from `.factory/verification-5.md` are also fixed: all three plain facts fit common desktop first screens at 17 px, and the standalone 404 wordmark is a 44 px target.

No product code was changed during verification.

## Findings by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Mandatory first-read and demo gate: PASS

A cold browser with empty storage answers the required questions in plain words:

- What it does: “Rehearse upgrades before customers do.”
- Who it serves: “For self-hosted product teams that need proof before each Compose or Kubernetes release.”
- What to click first: **Try it with sample data**.

The action is visible without scrolling at desktop and 390 px mobile. One click opens `/?demo=1`, which immediately shows the Arbor Desk 1.8.4 → 2.0.0 rehearsal, completed terminal output, and READY customer-safe receipt. The persistent banner says “Demo — sample data, nothing is saved” and provides **Reset demo** and **Start for real**.

At 1366×768, the three required facts render at 17 px and end at y=616.52, 653.70, and 690.89. At 1440×900 they are also fully visible. At 390×844 the headline, audience sentence, sample action, and all three facts fit without horizontal overflow.

## Claims gate: PASS

`.factory/claims.json` exists with 41 unique entries. There are exactly 41 unique `@claim:` test declarations, with no missing, extra, or duplicate tags.

The first pre-install claim invocation reached the shared site-build prerequisite and reported the expected missing `sharp` package because a raw clean clone has no `node_modules`. After the required locked `npm ci`, every exact manifest command was run separately. Result: **41 passed, 0 failed**.

Passing claim IDs:

`demo-receipt`, `offline-demo`, `demo-network-privacy`, `cli-receipts`, `upgrade-hooks`, `declared-resource-minimums`, `compose-kubernetes-declarations`, `installer-checksum`, `mit-core`, `schema-redaction`, `customer-safe-receipt`, `temporary-workspace`, `argument-arrays`, `exit-codes`, `unsigned-packages`, `cli-no-upload`, `team-kit-license`, `declared-upgrade-path`, `customer-boundary`, `receipt-scope`, `team-kit-price-scope`, `free-cli-formats`, `sociobot-merchant`, `sociobot-refunds`, `sociobot-checkout`, `published-platform-download`, `homebrew-tap`, `scoop-manifest`, `release-asset-set`, `receipt-contents`, `release-workflow`, `sample-demo-parity`, `sociobot-license-api`, `no-embedded-payment-provider`, `demo-storage-isolation`, `starter-templates`, `json-output`, `release-manifest`, `license-browser-storage`, `no-card-collection`, and `dodo-checkout-processing`.

The live landing page, demo, metadata, README, Privacy, and Terms copy were cross-checked against the manifest. No material public promise was found outside these entries.

## Clean local gates: PASS

The checkout started clean at the requested SHA, and `origin/main` resolved to the same SHA.

Passed commands:

```sh
npm ci
npm test
# 5 Rust tests passed; 99 Playwright tests passed; 4 intentional project-specific skips

npm run build
# optimized Rust binary plus dist/site

npx tsc --noEmit --strict --target es2022 \
  --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
# 0 vulnerabilities

cargo package --locked
# 15 files; 54.6 KiB unpacked, 16.4 KiB compressed; verification passed

sh -n site/public/install.sh
git diff --check
```

`npm run build` produced `dist/site/`. Production asset sizes are:

- JavaScript: 21,607 bytes raw / 7,465 bytes gzip;
- CSS: 13,227 bytes raw / 3,759 bytes gzip;
- hero WebP: 70,902 bytes;
- Open Graph WebP: 57,158 bytes.

These are comfortably below the supplied JS, CSS, font, and mobile-image budgets. The site uses system fonts and makes no font request.

Candidate GitHub Actions test run `33261928198` completed successfully for the exact candidate SHA.

## CLI, package, boundary, and recovery behavior: PASS

The packaged crate was installed into a fresh consumer root with:

```sh
cargo install --path target/package/rehearsal-0.1.2 --root <fresh-root> --locked
```

The consumer binary reported `rehearsal 0.1.2`; its help listed `init`, `check`, `run`, and `demo`. Its public demo produced JSON and HTML receipts for Arbor Desk 1.8.4 → 2.0.0 with schema 1, READY status, 9 passed checks, 3 schema changes, declared 768 MB memory / 2,048 MB disk, and `customer_safe: true`. The streamed JSON and written JSON are semantically identical. The generated HTML receipt has `lang=en`, one H1, one main landmark, no 390 px overflow, no console/page errors, and zero axe violations.

Independent boundary and recovery cases behaved correctly:

- zero memory: exit 2 with “resource minimums must be greater than zero”;
- equal source and target versions: exit 2 with “choose an actual upgrade path”;
- `u64::MAX` memory and disk declarations: accepted and recorded exactly, consistent with the declaration-only contract;
- failed preflight: exit 1, `not ready`, later normal hooks `not run`, cleanup still passed;
- missing declaration: exit 2 with the missing path;
- unknown command: exit 2 with usage and `--help` recovery;
- non-empty demo output: exit 2, with the existing sentinel preserved.

## Published distribution and installer: PASS

GitHub release `v0.1.2` has 14 assets: Linux x86_64/aarch64 archives, macOS x86_64/aarch64 archives and unsigned packages, Windows x86_64 zip, `.deb`, `.rpm`, Scoop, Winget, Homebrew formula, `latest.json`, and `SHA256SUMS`.

The Linux x86_64 archive independently downloaded with SHA256 `baae9909cffe06c7d5a3ba0f0f50eb2c8678a02461eb89fe05c1e2f6152f3f3a`, exactly matching `SHA256SUMS`. Its binary reported 0.1.2 and completed a READY nine-check customer-safe demo.

The shipped shell installer was run with an isolated install directory. It printed checksum success before installation, installed version 0.1.2, and its binary completed the same demo. The current Homebrew tap formula matches the release formula; the Scoop manifest is valid for 0.1.2; `latest.json` matches the site copy; and the Winget archive passes `unzip -t`.

CLI source, templates, manifests, and installers are unchanged since tag `v0.1.2`. The only release-workflow change since the tag makes a missing Homebrew token fail instead of silently skipping publication.

## Live identity, routes, links, headers, and caching: PASS

All 17 public files in `dist/site` match production byte-for-byte, including HTML route documents, hashed JS/CSS, both WebP images, icons, installers, release manifest, robots, and sitemap. Production therefore matches the candidate rather than stale builder output.

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms`: HTTP 200.
- Unknown route: designed page with real HTTP 404.
- All rendered HTTP links resolve as expected.
- The release download reaches the published GitHub asset.
- The product checkout returns HTTP 303 to `checkout.dodopayments.com`.
- The external Sociobot/Param Factory link returns HTTP 200.

Production sends HSTS, `X-Content-Type-Options: nosniff`, `strict-origin-when-cross-origin`, camera/microphone/geolocation restrictions, and a CSP limited to self plus the documented Sociobot API. `frame-ancestors 'none'` is delivered as a response header.

HTML and `latest.json` use `public, must-revalidate, max-age=30`; hashed JS/CSS use one-year immutable caching; the hero uses a one-day cache. An `If-None-Match` request for the root returned 304.

## Browser, accessibility, privacy, and performance: PASS

Independent live sweeps covered landing, both demo URLs, Privacy, Terms, and the real 404 at 1440×900 and 390×844.

- Product routes have route-specific titles, `lang=en`, one H1, one main landmark, no missing image alt, no horizontal overflow, no application console/page error, and no failed request.
- The intentional 404 navigation produces the browser's expected “resource returned 404” console line but no page exception or secondary failed resource.
- Axe found zero serious/critical issues on every route in both viewports.
- Every visible link, button, and input in the sweep is at least 44×44 CSS px.
- At 200% root text size on a 390 px viewport, scroll width remains 390 px and the header, headline, and primary action remain horizontally intact.
- Full keyboard traversal cycles through 20 focus stops without a trap. The skip link has a visible 3 px rust focus outline, Enter skips the header, and the next Tab reaches the sample action. Keyboard activation opens the demo and resets its recording. Empty license submission returns focus to the field with an actionable message.
- With reduced motion, the media query matches, scroll behavior is `auto`, stamp animation is reduced to 0.01 ms, and the longest transition is 0.01 ms.
- An iPhone user agent receives a calm desktop-only message and no active desktop package link.

The browser demo was warmed, taken offline, reset, completed to READY, and downloaded via the UI. It made only three same-origin shell requests, registered no service worker, and downloaded a complete schema-1 receipt with 9 checks, 3 schema changes, and `customer_safe: true`.

A real invalid-license flow strips the token from the URL, stores only the namespaced token and daily verdict, keeps the Team download hidden, and preserves the inactive notice after reload without a second verification request.

Fresh Lighthouse 12.8.2 mobile results, with full-page screenshot collection disabled to avoid the container screenshot artifact:

- Performance: 100;
- Accessibility: 100;
- Best Practices: 100;
- SEO: 100;
- FCP: 0.82 s;
- LCP: 1.25 s;
- TBT: 88 ms;
- CLS: 0;
- transferred bytes: 84,399.

`/opt/fleet/lib/verify-url.sh` also passed production: HTTP 200, 826 ms network-idle load, correct title/lang/H1/main/alt/button checks, and zero errors.

## Server-side endpoint allowance: PASS

The product is static and has no first-party backend, tenant persistence, or sign-in. The optional Sociobot license endpoint is the only runtime server-side product integration.

From one client, 30 consecutive verification requests returned HTTP 200. Request 31 returned HTTP 429 with both `Retry-After: 3` and `X-RateLimit-After: 3`. The observed allowance is therefore 30 requests per client window.

The checkout endpoint returns HTTP 303 to the hosted Dodo checkout. No card field or payment-provider script is present in the product.

## Applicability and remaining test boundary

- No sign-in exists, so Microsoft Entra External ID authority verification is not applicable.
- This is not a PWA and registers no service worker, so PWA update testing is not applicable. The explicit offline-demo promise was tested and passed.
- There is no product backend or persistence surface, so backend concurrency and persistence-boundary checks are not applicable.
- Docker, Podman, kubectl, and kind are unavailable in this verifier container. A real container engine or cluster was therefore not launched. The packaged fixture exercised all hook phases, and both Compose and Kubernetes declarations were validated. Vendor-supplied hooks are the declared execution boundary in the brief.
- The deterministic upgrade-proof job does not need an AI step; no missed-leverage finding applies.

## Acceptance conclusion

The candidate fulfills the smallest useful product: an installable CLI that validates a declared upgrade path through isolated vendor hooks, compares config schemas without values, verifies backup/restore/health behavior, records declared resource minimums, and emits customer-safe JSON and HTML receipts. The first-screen demo, privacy boundary, accessibility, package distribution, payment integration, rate limiting, and live deployment all satisfy the supplied contract.

**Final result: PASS.**
