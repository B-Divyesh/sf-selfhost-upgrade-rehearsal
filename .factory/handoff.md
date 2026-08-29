# Review 3 repair handoff

## Result: PASS

Round 3 closes every finding in `.factory/review-1.md`, `.factory/review-2.md`, and `.factory/review-3.md`. The complete finding map is in `.factory/polish-3.md`. Nothing is deferred.

## What changed

- Rewrote the inaccurate “checked template” promise as a declaration template that still needs schema files and hook commands. The README, CLI help, generated Compose/Kubernetes templates, copy audit, claims manifest, and exact `@claim:starter-templates` test agree on that behavior.
- Released the corrected CLI as `v0.1.3`; its Homebrew formula, Scoop manifest, Windows/Linux/macOS archives, checksums, and release manifest are published.
- Made the release workflow’s Homebrew tap update idempotent and configured its factory credential so the complete cross-platform release workflow succeeds.
- Redeployed the static site with its `v0.1.3` release manifest and refreshed cold live route, demo, accessibility, privacy, and mobile evidence.
- Updated the catalog sentence to: “Rehearse self-hosted upgrades and issue customer-safe readiness receipts.”

Repair commits:

- `06e27808d7ce9997dc3961201009ab5f6497196c` — truthful declaration-template copy and its claim test.
- `81c6c74972f4e0802f17a6f89cfbabc919b33b47` — `v0.1.3` release contents.
- `5288362815a4da33c8e76f661164ef8493a71e15` and `fcf5d85ef7f26dba41d2a8ccd8e418eebf13115d` — reliable Homebrew tap release publication and recorded release fixtures.

## Verification

Final clean clone: `/tmp/selfhost-upgrade-rehearsal-final-1RGna9` at `fcf5d85ef7f26dba41d2a8ccd8e418eebf13115d`.

- `npm ci` completed without vulnerabilities.
- The claims manifest has 41 unique IDs and exactly one matching `@claim:` test per ID. Every command listed in `.factory/claims.json` was run as `npm test -- --grep @claim:<id>` from the clean clone; all passed.
- Full `npm test` passed: 5 Rust tests and 103 Playwright tests, with 4 intentional project skips.
- `npm run build` and `npm run build:site` passed; `dist/site` contains a 7.60 KB gzip initial JavaScript asset and 3.75 KB gzip stylesheet.
- `npx tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --strict --skipLibCheck site/src/main.ts`, `cargo fmt --check`, `cargo clippy -- -D warnings`, and `cargo package --locked --allow-dirty` passed.
- `bash -n site/public/install.sh` passed. PowerShell is not installed in this Linux worker; the Windows installer remains covered by the browser/release tests and the published release manifest checks.
- The v0.1.3 Linux archive SHA-256 is `84676836384b1d87e7a590147989656f82e77d6e2c73e24222cf984c7d8e03ca`, matching the published `SHA256SUMS`. Its binary reports `rehearsal 0.1.3`, writes the new setup instruction, and `rehearsal check --file <template>` rejects its missing schema with exit 2 as promised.
- Successful cross-platform release workflow: [run 33271824772](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/actions/runs/33271824772). The Homebrew tap formula is v0.1.3 at commit `6757ef97bc11360313975f36ec1002e019f45e49`.
- Static deployment `3a98bd01-bc78-49a9-a07f-a060a16016fc` completed to [selfhost-upgrade-rehearsal.sociobot.in](https://selfhost-upgrade-rehearsal.sociobot.in). `verify-url.sh` reports HTTP 200, title/lang/one H1/main/alt text, and no load errors. The cold Playwright+Axe live audit covers `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a real 404 at 390×844: zero Axe violations, zero product console/page errors, no horizontal overflow, isolated demo storage, offline reset, same-origin-only demo requests, and correct install focus. See `.factory/evidence/polish-3/`.
- The existing mobile Lighthouse baseline remains Performance 100, Accessibility 100, Best Practices 100, and SEO 100; this repair changes no landing runtime payload beyond the already-budgeted release metadata.

## Run and deploy

```sh
npm ci
npm test
npm run build
./target/release/rehearsal --help
```

The static deployment build is `npm ci && npm run build:site`, publishing `dist/site`. Release builds run from `.github/workflows/release.yml` on a `v*` tag or manual dispatch.

## Remaining work

None.
