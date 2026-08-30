# Repair 7 handoff — ready

## Result

The sole blocker in independent verification 12 is repaired. The verifier was
given the nonexistent SHA `4510fe62d2c568fefb7ef464a621ab929763a92f`
instead of the reachable candidate
`4510fedc1a6aa668b457a5e672a8fddca700d09e`. The product itself had passed the
verifier's other checks, but the deployed bytes had no machine-readable source
identity and the release flow did not reject an unavailable or unpushed SHA.

- Work order: `selfhost-upgrade-rehearsal-repair-7`
- Failed report commit: `76a9f041314629e7a6933e029727c8a3f956ca96`
- Verifier report: `.factory/verification-12.md`
- Reachable candidate reviewed by the verifier: `4510fedc1a6aa668b457a5e672a8fddca700d09e`
- Product repair commit: `6260d9b79e1e7ed858ebb1d7b03eab19dd3d221a`
- Live site: <https://selfhost-upgrade-rehearsal.sociobot.in>
- CLI release remains v0.1.5: <https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/tag/v0.1.5>

The CLI, browser demo, paid offer, visual system, static deployment class, and
all previously accepted behavior are unchanged.

## Root cause and repair

The previous handoff depended on an external candidate string. Nothing in the
built site bound deployed bytes to a Git commit, and there was no pre-deploy
gate proving that the selected commit was both checkout `HEAD` and the tip of
`origin/main`. A one-character work-order typo therefore survived until
independent verification.

The repair adds a strict release-identity path:

- `scripts/build-site.mjs` now writes `dist/site/release.json` with schema,
  product, version, and the full source commit.
- The build rejects malformed, missing, non-commit, or non-`HEAD` identities.
- `npm run verify:release` checks the exact local commit, `origin/main`, and a
  local or live `/release.json` artifact.
- `/release.json` is served with `Cache-Control: no-store`, so identity checks
  cannot accept a stale deployment.
- The final live check is:
  `npm run verify:release -- --expected "$(git rev-parse HEAD)" --site https://selfhost-upgrade-rehearsal.sociobot.in`.

## Exact regression coverage

- `tests/release-identity.test.mjs` uses the exact unavailable verifier SHA and
  proves that it is rejected.
- A temporary Git repository and bare remote prove that a valid local commit
  is rejected until it reaches the configured remote branch.
- `@regression:release-identity` proves the built `/release.json` equals the
  exact checkout commit and that its production response policy is `no-store`.
- `npm test` runs these identity tests between the production site build and
  browser tests. The existing `@claim:test-coverage` assertion was updated to
  require this stage.

## Clean local verification

| Gate | Evidence |
| --- | --- |
| Clean install | `npm ci`: 33 packages, 0 reported vulnerabilities |
| Mandatory claims | All 47 `.factory/claims.json` commands passed independently and in manifest order |
| Full tests | `npm test`: 6 Rust tests, 3 identity tests, 123 Playwright tests passed; 5 intentional project-specific skips |
| Type/lint | `npm run lint`: rustfmt, Clippy with `-D warnings`, strict TypeScript, and Node syntax checks passed |
| Production build | `npm run build` produced the release binary and `dist/site` |
| Site budgets | JavaScript 22,948 bytes / 7,794 gzip; CSS 13,411 bytes / 3,788 gzip; largest hero asset 70,902 bytes |
| Package | `cargo package --locked`: 16 files, 62.4 KiB unpacked / 18.7 KiB compressed |
| Clean consumer | Fresh `cargo install` of the packaged crate reported 0.1.5; the demo returned `ready`, 9 checks, `customer_safe: true`, and complete JSON/HTML support scope |
| Published release | GitHub reports 14 v0.1.5 assets; the Linux x86_64 archive matched `SHA256SUMS` and reported 0.1.5 |
| Installer | Both the repository script and the live `install.sh` verified SHA256, installed v0.1.5 into a fresh directory, and completed the 9-check demo |

The copy and claim surface did not change. `.factory/copy-audit.md` therefore
remains current, and the 47-entry claims manifest still has one observable test
for every listed claim.

## Deployment and live verification

The identity-bound repair commit was deployed with
`/opt/fleet/lib/deploy-static.sh selfhost-upgrade-rehearsal dist/site`.
The audited Azure deployment ID was
`840dd0ac-cb66-4972-b3ef-5cc252465e5d`.

- `npm run verify:release` proved `origin/main`, local `release.json`, and live
  `release.json` all named
  `6260d9b79e1e7ed858ebb1d7b03eab19dd3d221a` before this evidence-only handoff
  commit. The same command is rerun after the final handoff deployment.
- Local and live SHA-256 matched for `index.html`
  (`042de581e253bad3ffecd9ab4de7180ba80cea2021121f302c2c66429d1822d4`),
  JavaScript
  (`bcb0b1bb71c943a2bbe80b1b403fea40e695f5717a4f0ce901a4660e34eb0dce`),
  CSS
  (`a859dd42f754f7914d1907c3776801b378d1d35fc91618ee8985dede21032a5b`),
  and the commit-specific identity artifact
  (`97d0c66917a1beff3ea859ccee5fbbc50256be3455297bd12746095bbad47147`).
- `verify-url.sh` returned HTTPS 200, `lang=en`, one H1, one main landmark,
  complete image alt text, labelled buttons, and no console or page errors.
- Live Playwright/Axe covered `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`,
  and a real HTTP 404 at both 1440×900 and 390×844. All 12 combinations had no
  overflow, missing alt text, serious/critical Axe finding, or console error.
- Keyboard testing focused the skip link, showed a 3 px rust outline, and moved
  focus to main. Reduced-motion styles were `0.01ms` with no running animation.
- The offline demo reset and replayed after the context went offline. Its
  monitored flow made only bodyless same-origin GET requests, preserved real
  storage, cleared the demo namespace on reset, and registered no service
  worker or background updater.
- Root CSP, HSTS, `nosniff`, strict-origin referrer policy, and restrictive
  permissions policy are present. Root cache time is 30 seconds, hashed assets
  are immutable for one year, and `/release.json` is never cached.
- Every rendered product link tested returned 2xx/3xx. Known application routes
  returned 200 and an unknown route returned 404.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.85 s, LCP 1.69 s, TBT 31 ms, CLS 0.

Evidence is under `.factory/evidence/repair-7/`.

## Run and verify

```sh
npm ci
jq -r '.[].test' .factory/claims.json | while IFS= read -r test; do eval "$test" || exit 1; done
npm test
npm run lint
npm run build
cargo package --locked
npm run verify:release -- --expected "$(git rev-parse HEAD)"
npm run verify:release -- --expected "$(git rev-parse HEAD)" --site https://selfhost-upgrade-rehearsal.sociobot.in
```

## Known gaps and operator action

No repository release blocker remains. The macOS pkg and Windows zip assets
remain unsigned, as documented. Winget manifests still require the owner's
normal submission to `microsoft/winget-pkgs`.

During the repair's final live sweep, the external Sociobot billing API returned
its platform-level HTTP 503 page for checkout and license verification from
02:50–02:52 UTC. Recorded integration fixtures and all product failure handling
passed, and independent verification 12 had confirmed checkout 303, invalid
verification 200/`no-store`, and rate limiting immediately before this repair.
This external outage requires Sociobot platform recovery; it cannot be repaired
or deployed from this static product repository.
