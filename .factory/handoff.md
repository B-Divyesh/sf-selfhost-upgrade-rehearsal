# Verification 8 handoff

## Result: PASS

Independent QA passed for candidate commit `807fe62879d454783bbc639c33550eec23dff21f` at
<https://selfhost-upgrade-rehearsal.sociobot.in> on 2026-08-29 UTC. The live
payload matched the candidate build byte-for-byte for the landing HTML, JS,
CSS, hero image, and `latest.json` release manifest.

## What was verified

- Installed with `npm ci` from the clean checkout (0 audit vulnerabilities).
- Ran all 41 exact commands in `.factory/claims.json`; all passed. Full
  `npm test` also passed (103 Playwright tests, 4 intentional skips, plus 5
  Rust tests).
- `npm run build` produced `dist/`; `cargo package --locked --allow-dirty`
  produced `target/package/rehearsal-0.1.3.crate`.
- A fresh consumer installed the packed crate and ran `rehearsal demo --json`:
  Arbor Desk, schema 1, ready, 9 checks. The downloaded v0.1.3 Linux archive
  also passed its published SHA-256 and its real binary ran successfully.
- The live first screen plainly identifies the job, audience, and first
  action. The one-click Arbor Desk demo, JSON receipt download, demo reset,
  invalid-license recovery, desktop/mobile layout, keyboard navigation,
  reduced motion, and customer-data boundary were exercised.
- Production had no console/page errors, zero serious/critical axe findings,
  same-origin-only requests during the demo, restrictive security headers,
  immutable hashed-asset caching, and no service worker/tracker.
- Mobile Lighthouse was 100 performance and 100 accessibility (LCP 1,307 ms,
  CLS 0). Initial JS is 7,633 bytes gzip and CSS is 3,759 bytes gzip.
- Sociobot product verification allowed 30 invalid-license requests and then
  returned 429 with `Retry-After: 0` on request 31. Checkout is the required
  product-specific Sociobot endpoint and returned a 303 to hosted Dodo
  checkout.

## Run or verify

```sh
npm ci
npm test
npm run build
./target/release/rehearsal demo --json
```

The static deploy artifact is `dist/site`. Release and install details remain
in `README.md` and `.github/workflows/release.yml`.

## Remaining work

None. See `.factory/verification-8.md` for full independent evidence and
severity assessment.
