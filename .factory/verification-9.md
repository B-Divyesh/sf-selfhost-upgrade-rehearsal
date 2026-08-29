# Independent verification 9 — FAIL

**Candidate:** `5e7ca90861b101bac2708c9da165bcb9ee5c6209`  
**Live URL:** <https://selfhost-upgrade-rehearsal.sociobot.in>  
**Verified:** 2026-08-29 UTC

## Verdict

**FAIL.** The deployment matches this candidate and the core product works, but
the candidate misses two mandatory `cli-installers` release-delivery
requirements and has a keyboard skip-link defect.

## Defects

### HIGH — Landing download metadata bypasses the required GitHub API

`site/src/main.ts` uses `fetch('/latest.json')` in `loadRelease()` and builds
the download button from a checked-in static manifest. The installer contract
requires the GitHub release API
`https://api.github.com/repos/<owner>/<repo>/releases/latest`, an hour cache,
and `https://api.github.com` in `connect-src`. The live CSP is
`connect-src 'self' https://api.sociobot.in`; it cannot support that required
API path. The current manifest happens to match v0.1.3, but future release
metadata can become stale independently of the release.

### HIGH — Required Scoop bucket is neither published nor documented

The required `scoop-bucket/selfhost-upgrade-rehearsal.json` is absent from this
repository. Fresh GitHub API evidence for
`B-Divyesh/scoop-bucket/contents/selfhost-upgrade-rehearsal.json` is `404 Not
Found`. README uses a direct release asset URL, rather than the required
`scoop bucket add … && scoop install …` flow. The release asset exists, but it
is not a maintained Scoop bucket.

### MEDIUM — Skip link does not move keyboard focus to main content

Tab correctly reveals “Skip to main content” with a visible 3px outline.
Pressing Enter leaves `document.activeElement` as `BODY`: the target is
`<main id="main">` without a focusable target. Keyboard users must tab through
header controls again instead of arriving at the main content.

## Claim and local gates

After `npm ci` in this clean checkout, all 46 exact commands in
`.factory/claims.json` passed independently (`claims_status=0`); entries and
tags are one-to-one (46 each). `npm test` passed with 114 tests and four
intentional project-specific skips. `cargo fmt --check`,
`cargo clippy --all-targets -- -D warnings`, `npm run build`, and
`cargo package --locked` all passed.

I unpacked the package into a new temporary consumer directory and installed
it using an isolated `CARGO_INSTALL_ROOT`. `--help`, `init compose`, invalid
`check` recovery (exit 2 and missing-schema explanation), and `demo --json`
worked; the demo produced a ready Arbor Desk receipt with nine checks. The
published Linux x86_64 archive verified against release `SHA256SUMS` and ran.
The live `install.sh`, installed into a temporary target, verified SHA-256 and
ran the ready sample demo.

## Live QA evidence

Cold first read passed: the hero says what it does, names self-hosted Compose/
Kubernetes teams, and exposes “Try it with sample data” with its result. The
one-click demo immediately shows the Arbor Desk 1.8.4 → 2.0.0 receipt.

- Demo download produced `arbor-desk-readiness.json`; offline Reset reached
  `READY`.
- The complete demo flow requested only its initial same-origin document, JS,
  and CSS. It sent no project data and loaded no analytics, remote fonts, or
  third-party scripts. Browser storage was empty after reset.
- `/opt/fleet/lib/verify-url.sh` passed: 200, title, `lang=en`, one H1, main,
  alt text, labelled controls, and no console errors.
- Playwright Axe found zero serious/critical violations on `/`, `/?demo=1`,
  `/privacy`, and `/terms`.
- At 390×844 there was no horizontal overflow; demo controls were 44px high;
  reduced motion was applied; there were no mobile console errors.
- Lighthouse live result: performance 99, accessibility 100, best practices
  100, SEO 100; LCP 1,300ms, CLS 0, TBT 96ms.

Fresh local build files were byte-identical to live root/404 documents, hashed
JS/CSS, manifest, images, installers, robots, and sitemap. Live routes had
the expected 200/404 behavior, HSTS, `nosniff`, referrer policy,
`frame-ancestors 'none'`, and immutable caching for hashed assets. JS is
22,412 bytes raw / 7.61KB gzip; CSS is 13,411 bytes raw / 3.78KB gzip; the hero
WebP is 70,902 bytes.

The release API reports v0.1.3 with Linux, macOS, Windows, deb, rpm, Winget,
Homebrew, checksums, and manifest assets. The Homebrew formula exists at
version 0.1.3. The Sociobot verify endpoint allowed 31 requests from one
client, then returned `429 Retry-After: 3` on request 32; CORS and no-store
behavior were correct. Checkout returned a 303 to Dodo.

## Retest

```sh
npm ci
jq -r '.[].test' .factory/claims.json | while IFS= read -r test; do eval "$test" || exit 1; done
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
cargo package --locked
```

Replace static-manifest discovery with cached GitHub release API discovery and
its CSP allowance, publish/document the Scoop bucket, and make the skip-link
destination focusable before re-verification.
