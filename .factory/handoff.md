# Perfection-loop round 5 handoff — PASS

## Delivered repair

- Implementation commit: `a40c6d64d36a8a98d59fd573fbb36b4991d15f9e`
- Production: <https://selfhost-upgrade-rehearsal.sociobot.in>
- Deployment ID: `753d9ef2-fa7a-4b7e-881b-6de507bf7d01`
- Artifact class remains `cli-installers`; release `v0.1.4` remains the published binary release.

Round 5 closes every finding in reviews 1–5. The landing page now uses direct first-screen wording and a one-click isolated demo. Demo entry, reset, exit, offline behavior, real-data isolation, route focus, titles, metadata, 404 handling, legal links, mobile layout, release fallback, and commercial copy were verified in production.

The release claims now use current `v0.1.4` GitHub, Homebrew, Scoop, and provenance fixtures. Tests bind the package version, release tag, asset names, URLs, checksums, and attested subjects. The hook placeholder test executes a real hook with both `{source_dir}` and `{work_dir}`. The merchant claim is based on a recorded Sociobot checkout redirect and Dodo checkout footer; the unsupported refund-revocation sentence was removed.

## Clean-clone verification

Clean clone: `/tmp/rehearsal-polish5-clean-bcb3o6`

- `npm ci`: passed; 0 vulnerabilities.
- Every command in `.factory/claims.json`: 47/47 passed independently.
- `npm test`: 5 Rust tests and 121 Playwright tests passed; 5 intentional platform skips.
- `npm run lint`: passed.
- `npm run build`: passed and produced `dist/site`.
- `cargo package --locked`: passed, including packaged-crate verification.
- Initial JavaScript: 22,948 bytes raw / 7,780 bytes gzip.
- CSS: 13,411 bytes raw / 3,780 bytes gzip.

## Production verification

- Factory `verify-url.sh`: passed with no console errors; load time 634 ms.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.65 s, TBT 19 ms, CLS 0.
- Browser/Axe audit: `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200 with no serious or critical Axe issues; unknown routes returned the designed 404.
- Mobile 390 px: no horizontal overflow; first-screen action and three facts remain visible.
- Demo: sample receipt generated for Arbor Desk 1.8.4 → 2.0.0 with 9 checks; reset worked offline; exit cleared only `demo:` storage and preserved real-data sentinels.
- Privacy flow: browser requests during the demo were same-origin, bodyless GET requests only.
- Release API fallback: displayed `Open GitHub releases` with the correct destination and no console error.
- Release integrity: the downloaded Linux archive matched `SHA256SUMS`; live GitHub release assets and attestations matched recorded fixtures.
- Checkout: Sociobot returned a 303 to Dodo checkout, whose footer identifies Dodo Payments as merchant of record and handler of order inquiries and returns.
- Production HTML, JS, CSS, and installer scripts matched the deployed `dist/site` bytes.

Evidence and the finding-by-finding matrix are in `.factory/evidence/polish-5/` and `.factory/polish-5.md`.

## Run again

```sh
npm ci
npm test
npm run lint
npm run build
cargo package --locked
```

Run each exact command in `.factory/claims.json` to reproduce the 47 isolated claim checks.

## Known gaps and operator action

None. macOS and Windows artifacts remain intentionally unsigned, as documented for this product class. No secrets, billing, DNS, or other operator action is required for this repair.
