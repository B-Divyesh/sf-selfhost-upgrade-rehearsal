# Review 4 handoff

## Result: FAIL

Completed the adversarial first-read review at
<https://selfhost-upgrade-rehearsal.sociobot.in> on 2026-08-29 UTC and wrote
`.factory/review-4.md`. Product code was not changed.

## Verification performed

- Used fresh 390×844 and 1440×900 browser contexts for the cold first screen.
- Exercised the one-click demo, receipt download, Reset, offline replay, Start
  for real, request log, and real-storage sentinels.
- Checked all routes, metadata, history/focus behavior, HTTP status, headers,
  links, 404, horizontal overflow, and axe results at both viewport sizes.
- Cloned commit `5ea4bf4164881da3682c8b0ed42c8acf5fde005d`
  to a separate temporary directory and ran every one of the 41 commands in
  `.factory/claims.json`; all exited 0.
- Ran the unfiltered clean-clone suite: 5 Rust tests and 103 Playwright tests
  passed, with 4 intentional skips.
- Ran `npm run build`; it produced the release binary and `dist/site`.
- Confirmed the live landing HTML, JS, CSS, and release manifest match the
  clean build byte-for-byte.

## Open findings

- F-4-1 / F-1-2 reopened (blocking): configured hooks can modify arbitrary
  customer paths despite the absolute landing/manifest claim; the registered
  test does not exercise a hostile hook.
- F-4-2 (blocking): the demo banner is not sticky at 390px and disappears while
  the user inspects/downloads the result.
- F-4-3 / F-1-4 reopened (blocking): README calls the sample demo “the bundled
  upgrade”.
- F-4-4 through F-4-7: unlisted demo, platform, privacy, and README development
  claims.
- F-4-8: “Start for real” does not name its installation result.

## Reproduce the key failures

At 390px, open `/?demo=1`, scroll to **Download sample JSON**, and inspect the
demo banner: the mobile CSS changes it to `position: relative`, leaving it
outside the viewport.

For the boundary issue, run a valid declaration whose hook command writes a
marker to an absolute path outside `REHEARSAL_WORK_DIR`. The CLI executes the
hook and can still issue a `ready` receipt. The existing
`@claim:customer-boundary` fixture puts its customer path only in `notes`, so
it cannot detect this behavior.

See `.factory/review-4.md` for exact quotes, rewrites, claim results, complete
copy counts, and the earlier-finding audit.
