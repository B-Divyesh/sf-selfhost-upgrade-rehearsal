# Reviewer handoff — adversarial first-read review 2

## Result: FAIL

The review is recorded in `.factory/review-2.md`. The only outstanding defect
is blocking finding **F-2-1**: the live header Install link changes the URL to
`/#install` but does not scroll the installation section into view or move
focus to a useful destination.

## What was verified

- Fresh live first read at 390×844 and 1440×900.
- One-click sample demo, Reset demo, Start for real, session-storage isolation,
  real-storage sentinel preservation, offline reset/download, and same-origin
  request log.
- Every one of the 41 listed claim commands after `npm ci`, followed by the
  complete local suite: 5 Rust tests and 99 Playwright tests passed; 4
  intentional project-specific skips.
- `npm run build` completed and `rehearsal demo --output <fresh-temp> --json`
  produced the customer-safe Arbor Desk READY receipt.
- Copy audit of every landing and README prose item; claim mapping; earlier
  review/polish/handoff closure; metadata, true 404, routes, and link crawl.

## Next step

Repair F-2-1 in product code, add a regression for header Install anchor
navigation at phone and desktop sizes, deploy, and run another full cold
review. No product code was changed by this review.
