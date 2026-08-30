# Polish 6 handoff — complete

Self-Host Upgrade Rehearsal is repaired and deployed. The product code repair
is commit `0e1b92839c310e0cae06d10f2a2f82affd7a3f57` (`test: prove workspace
and receipt output claims`), pushed to `main` and deployed as Azure Static Web
Apps deployment `cb269a80-d28b-4e6c-a909-ab3776834ac9`.

## What changed

- The `temporary-workspace` claim now observes four real hook processes,
  proving seed, backup, restore, and health share a new OS-temp workspace and
  that a later rehearsal gets a different workspace.
- The README promise that `rehearsal demo` prints JSON and HTML paths now has
  its own observable `receipt-path-output` claim test.
- The manifest now has 48 one-to-one claim IDs/tests. The catalog sentence is
  verb-first, 73 characters, and says: “Rehearse self-hosted upgrades and
  issue customer-safe readiness receipts.”
- All cumulative review 1–6 fixes were rechecked. Their mapping and live
  evidence are in `.factory/polish-6.md`.

## Verification

From a fresh remote clone at the repair commit,
`/tmp/selfhost-upgrade-rehearsal-clean-33kD0E`, every one of the 48 exact
commands in `.factory/claims.json` completed independently. The manifest/tag
audit found 48 unique claim IDs and exactly 48 unique matching `@claim:` tags.

The local quality gate passed:

```sh
npm ci
npm test
npm run lint
npm run build
cargo package --locked
```

That includes 6 Rust tests, 3 release-identity tests, 126 passing Playwright
cases and 4 intentional project-condition skips. The production build writes
`dist/site`; initial JavaScript is 22.95 kB raw / 7.78 kB gzip and CSS is
13.41 kB raw / 3.78 kB gzip.

Cold production checks at <https://selfhost-upgrade-rehearsal.sociobot.in>
passed: HTTP 200; distinct route metadata; a real 404; one H1/main per route;
no mobile overflow; keyboard skip/install focus; persistent 390 px demo
banner; demo storage isolation/reset/offline replay; same-origin bodyless demo
requests; and zero serious/critical Playwright Axe violations on landing,
query demo, `/demo`, Privacy, Terms, and 404 at desktop and 390 px. The live
identity is no-store and names the repair commit. `verify-url.sh` evidence is
under `.factory/evidence/polish-6/live-verify/`; the complete browser audit,
screenshots, and 100/100/100/100 mobile Lighthouse report are under
`.factory/evidence/polish-6/`.

## Run and deploy

```sh
npm ci
npm test
npm run build:site
npm run dev
```

The static deployable directory is `dist/site`. Release the CLI by tagging a
`v*` version; the GitHub Actions workflow builds the documented packages and
updates release metadata. Run the sample locally with `cargo run -- demo` or
the browser sandbox with `npm run build:site && npm run preview`, then open
`/?demo=1`.

## Operator notes

There are no unresolved product findings. The macOS package and Windows zip
are intentionally unsigned and are labelled as such; the Team kit remains an
optional Sociobot/Dodo purchase and does not gate the free CLI or receipt
formats.
