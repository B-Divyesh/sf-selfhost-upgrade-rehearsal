# Independent verification 13 — PASS

## Release decision

**PASS — candidate `9f8afa90811ff94c9acff8c5f1c943c5abe052b2` meets the acceptance contract.**

- Work order: `selfhost-upgrade-rehearsal-verify-13`
- Tested commit: `9f8afa90811ff94c9acff8c5f1c943c5abe052b2`
- Tested URL: <https://selfhost-upgrade-rehearsal.sociobot.in>
- Verification time: 2026-08-30 03:34 UTC
- Defects: no blocker, critical, serious, moderate, or minor product defects found

The previous deployment-identity blocker is resolved. At verification start,
the candidate was the reachable `origin/main` commit. Live `/release.json`
names that exact commit, and the built and deployed core files byte-match.

## Mandatory first checks

### Claims gate

`.factory/claims.json` is present and contains 47 claims. After the clean-clone
install (`npm ci`: 33 packages, 0 reported vulnerabilities), every manifest
`test` command was run separately and in file order. All 47 commands exited 0.
Each Playwright claim assertion passed in its applicable desktop and 390 px
project; platform-inapplicable project variants were intentionally skipped by
the suite and covered by the corresponding platform-specific test.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `demo-receipt` | PASS | Browser demo downloaded and parsed the schema-1 receipt. |
| `offline-demo` | PASS | Loaded demo reset and completed after the context went offline. |
| `demo-network-privacy` | PASS | Complete demo request interception found same-origin GETs only. |
| `cli-receipts` | PASS | Fresh CLI run wrote parseable JSON and HTML. |
| `upgrade-hooks` | PASS | Backup, restore, and health checks passed. |
| `declared-resource-minimums` | PASS | Receipt recorded 768 MB memory and 2,048 MB disk. |
| `compose-kubernetes-declarations` | PASS | Both declaration adapters validated. |
| `installer-checksum` | PASS | Both installers verify before placement; live shell install printed checksum success. |
| `installer-provenance-rollback` | PASS | v0.1.5 asset digests and version-aware rollback scripts matched. |
| `mit-core` | PASS | LICENSE and Cargo metadata are MIT. |
| `schema-redaction` | PASS | Receipt recorded schema paths/types without secret values. |
| `customer-safe-receipt` | PASS | Notes, hook output, and sample data were absent. |
| `temporary-workspace` | PASS | Demo created a new temporary workspace and receipts. |
| `argument-arrays` | PASS | Shell metacharacters remained literal; no sentinel was created. |
| `exit-codes` | PASS | Failed check returned 1; invalid input returned 2. |
| `unsigned-packages` | PASS | Workflow and documentation identify unsigned macOS/Windows packages. |
| `cli-no-upload` | PASS | Rust source/dependencies contain no network or telemetry client. |
| `team-kit-license` | PASS | Recorded valid entitlement restored the downloadable CI kit. |
| `declared-upgrade-path` | PASS | Receipt preserved exact source and target versions. |
| `customer-boundary` | PASS | Unconfigured customer path stayed untouched; configured hook access remained explicit. |
| `receipt-scope` | PASS | Tested host, declared support, and limitations were separated. |
| `team-kit-price-scope` | PASS | $79 one-time offer and supported-version checklist matched. |
| `free-cli-formats` | PASS | JSON and HTML remained available without a license. |
| `dodo-merchant-returns` | PASS | Checkout fixture and public copy identify Dodo's merchant/returns role. |
| `sociobot-checkout` | PASS | Buy action used the exact product-specific Sociobot URL. |
| `published-platform-download` | PASS | Desktop selected the exact v0.1.5 Linux asset URL. |
| `supported-platforms` | PASS | Live release has Linux, macOS, and Windows assets and no mobile package. |
| `homebrew-tap` | PASS | Published formula is v0.1.5 with current release checksums. |
| `scoop-manifest` | PASS | Published bucket manifest is v0.1.5 with the Windows asset checksum. |
| `release-asset-set` | PASS | Live release has 14 assets, including deb/rpm/pkg/zip/Winget/checksums/manifest. |
| `path-placeholders` | PASS | Source and temporary workspace placeholders expanded correctly. |
| `receipt-contents` | PASS | Both formats contained changes, resources, checks, versions, and environments. |
| `release-workflow` | PASS | `v*` workflow covers Linux, macOS, Windows, checksums, and GitHub Release. |
| `sample-demo-parity` | PASS | Browser and CLI both used Arbor Desk 1.8.4 to 2.0.0. |
| `sociobot-license-api` | PASS | License requests used only the product-specific Sociobot endpoint. |
| `no-embedded-payment-provider` | PASS | No provider client or script is embedded. |
| `demo-storage-isolation` | PASS | Only `demo:` session storage was used and reset cleared it. |
| `starter-templates` | PASS | Compose and Kubernetes templates named their required setup. |
| `json-output` | PASS | `check`, `run`, and `demo` returned machine-readable JSON. |
| `release-metadata` | PASS | Site read and cached CORS-safe GitHub release metadata. |
| `license-browser-storage` | PASS | Token and daily verdict used the documented namespaced storage. |
| `no-card-collection` | PASS | Site contains no card fields or payment-provider script. |
| `dodo-checkout-processing` | PASS | Sociobot checkout redirected to Dodo. |
| `development-requirements` | PASS | Stable Rust, Node 22, and npm are documented. |
| `test-coverage` | PASS | `npm test` includes Rust, identity, claim, accessibility, desktop, and 390 px checks. |
| `site-build-output` | PASS | `build:site` produced the static index. |
| `deploy-directory` | PASS | `dist/site` contained the complete deployable site. |

### Cold first-read

The cold desktop and 390 px first screen passes. In plain words it says:

- What it does: rehearses a Compose or Kubernetes upgrade and produces proof.
- Who it is for: self-hosted product teams preparing a release.
- What to click first: **Try it with sample data**; adjacent copy says it runs
  the bundled demo and opens its receipt.

The action is one click from the landing page. The same screen states that the
demo uploads no project data, works offline after loading, and the core CLI is
MIT licensed.

## Clean build, tests, and consumer install

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 33 packages, 0 reported vulnerabilities |
| 47 exact claim commands | PASS; 47/47 |
| `npm test` | PASS; 6 Rust tests, 3 identity tests, 123 Playwright tests; 5 intentional project-condition skips |
| `npm run lint` | PASS; rustfmt, Clippy `-D warnings`, strict TypeScript, Node syntax checks |
| `npm run build` | PASS; optimized CLI and exact production `dist/site` produced |
| `cargo package --locked` | PASS; 16 files, 62.4 KiB unpacked / 18.7 KiB compressed |
| Fresh packaged consumer | PASS; `cargo install` from `target/package/rehearsal-0.1.5` installed `rehearsal 0.1.5` |

The fresh consumer's `demo --json` returned `ready` for Arbor Desk
`1.8.4 -> 2.0.0`, with nine passed checks, three schema changes, declared
768 MB memory and 2,048 MB disk, and `customer_safe: true`. Human output named
the generated JSON and HTML receipt paths and both files were non-empty.

Independent recovery checks also passed: a missing declaration returned exit
2 with the missing path; a non-empty demo output directory returned exit 2,
gave an actionable message, and preserved its sentinel. The claim suite also
proved failed hooks return 1 and literal hook arguments do not invoke a shell.

## Deployment identity and distribution

`npm run verify:release -- --expected 9f8afa90811ff94c9acff8c5f1c943c5abe052b2 --site https://selfhost-upgrade-rehearsal.sociobot.in`
passed. Live `/release.json` is `no-store` and reports version 0.1.5 and the
exact candidate commit.

| File | SHA-256 (local and live) |
| --- | --- |
| `index.html` | `042de581e253bad3ffecd9ab4de7180ba80cea2021121f302c2c66429d1822d4` |
| `assets/index-_5jUxj35.js` | `bcb0b1bb71c943a2bbe80b1b403fea40e695f5717a4f0ce901a4660e34eb0dce` |
| `assets/index-CB5JWaCw.css` | `a859dd42f754f7914d1907c3776801b378d1d35fc91618ee8985dede21032a5b` |
| `release.json` | `b60ef3cc2b109840b344cf4bea0ea693363f36371227596043d96d2faee45f40` |

GitHub's live v0.1.5 release contains 14 assets covering Linux x86_64/aarch64,
macOS x86_64/arm64, Windows x86_64, deb, rpm, pkg, Winget, Homebrew, Scoop,
`SHA256SUMS`, and `latest.json`. The Linux x86_64 archive independently matched
checksum `f0ca9d0ea06bf9600cc7d3dbcaab7191305540473d897cc06d1b23cc5ab3ef1d`
and GitHub's attestation API returned one attestation for that digest. Its
binary reported 0.1.5. The live shell installer verified the checksum,
installed into a fresh directory, and ran the nine-check demo successfully.
The live Homebrew formula and Scoop manifest both name v0.1.5 and current
asset checksums.

## Live product, privacy, and failure handling

The browser demo produced the same Arbor Desk receipt as the CLI. Its complete
monitored flow made only three bodyless, same-origin GETs: document, JavaScript,
and CSS. It retained a seeded `real:` local-storage value, used only
`sessionStorage["demo:active"]`, and cleared that demo key on reset. No service
worker or background updater is registered. The root's only third-party fetch
is the documented public GitHub release API request; no analytics, fonts, or
tracking requests occurred.

The live invalid-license path called only the Sociobot product verification
endpoint and displayed “License no longer active. You can buy a new license.”
The endpoint returned JSON with `valid:false`, `reason:"invalid"`, and
`Cache-Control: no-store`. Checkout returned HTTP 303 to Dodo. From one client,
30 consecutive verification calls returned 200; call 31 returned **429** with
`Retry-After: 3`. This is the observed allowance.

This is a static site plus local CLI, so backend concurrency, server
persistence, and health endpoints are not applicable. It requires no sign-in,
so the Entra authority check is not applicable. It is not presented as a PWA;
the narrower loaded-demo offline claim passed.

## Accessibility, responsive behavior, headers, and performance

The factory `verify-url.sh` passed with HTTPS 200, title, `lang=en`, one h1,
one main landmark, complete image alt text, labelled buttons, and no console or
page errors. Independent Playwright plus axe covered `/`, `/?demo=1`, `/demo`,
`/privacy`, `/terms`, and a real 404 at 1440x900 and 390x844. All 12 views had
zero serious/critical axe findings, no horizontal overflow, one h1/main, no
missing alt text, and no undersized visible interactive target. Normal routes
had no console or page errors. Chromium reports the expected failed-document
network message for the intentionally HTTP-404 URL; its designed page has no
script exception.

Keyboard Tab order reaches every control. The skip link has a 3 px rust focus
outline and Enter moves focus to `main`; Enter on the primary sample action
opens the demo. All inspected controls were at least 44 px high. The 200% text
resize regression passed. Under `prefers-reduced-motion`, transitions reduce
to 0.01 ms and no meaningful motion continues.

Browser-observed root response headers include HSTS, `nosniff`,
`strict-origin-when-cross-origin`, restrictive Permissions Policy, and a CSP
that permits only self plus the documented GitHub and Sociobot connections;
`frame-ancestors 'none'` is a response directive. HTML caches for 30 seconds,
hashed JS/CSS cache immutably for one year, and release identity is never
cached. An unknown route returns a real HTTP 404.

Fresh mobile Lighthouse (completed report, no runtime error): Performance 98,
Accessibility 100, Best Practices 100, SEO 100; FCP 0.88 s, LCP 1.27 s,
TBT 162 ms, CLS 0. Initial transfer was 88,605 bytes. JavaScript is 22,948
bytes raw (7,872 transferred), CSS is 13,411 bytes raw (3,929 transferred),
the hero is 70,902 bytes, and no fonts are downloaded. All budgets pass.

## Product and documentation review

The CLI performs the brief's smallest useful job rather than simulating it:
it validates a declared source-to-target path, invokes vendor-supplied hooks in
a temporary workspace, compares schema paths/types, records declared resources,
and emits customer-safe receipts with explicit coverage limits. The sample,
README, privacy/terms pages, MIT license, demo documentation, copy audit,
release workflow, and product-specific visual thesis are present and consistent.
No obvious brief-implied AI feature is missing; model use would add risk rather
than help this deterministic upgrade proof workflow.

## Known non-blocking operator items

The macOS pkg and Windows package are intentionally unsigned and say so. The
Winget manifest remains ready for the owner's normal submission. These are
documented distribution constraints, not candidate defects.
