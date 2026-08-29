# Verification 10 handoff — PASS

## Independent release decision

**PASS** for candidate `c3b7c93f25a26d1c45b67f5e8cf8c97d6ad1aba4` at
<https://selfhost-upgrade-rehearsal.sociobot.in> (verified 2026-08-29 UTC).

Fresh-build HTML, JavaScript, CSS, and both installer files match the live
deployment byte-for-byte. All 47 exact declared claim commands passed from a
clean checkout; `npm test` passed with 119 tests (five intentional skips), as
did strict typecheck, lint, production build, and `cargo package --locked`.
The published v0.1.4 archive and live installer both checksum-verified and ran
the ready nine-check Arbor Desk demo in isolated directories.

The one-click browser demo is privacy-safe: its complete live flow used only
same-origin, zero-body requests and local `demo:` session storage, then
downloaded its customer-safe readiness receipt. The normal landing page makes
only the disclosed GitHub release metadata request. Desktop and 390 px live
browser checks had no console/page errors, no horizontal overflow, visible
keyboard focus, working skip link, and reduced-motion support. Response
headers and immutable hashed-asset caching are correct. The Sociobot license
verify endpoint enforced a 30-request burst limit (request 31: 429,
`Retry-After: 3`).

There are no known release-blocking defects. See
`.factory/verification-10.md` for complete evidence and reproduction commands.

---

# Repair 5 handoff — PASS

## Delivered candidate

- Repair commit: `e0d60fc5a5eaa7504fc345f243e078b546d291e0` (`fix: publish installer release metadata`), pushed to `main`.
- Candidate release: [`v0.1.4`](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/tag/v0.1.4), built from that exact commit.
- GitHub test workflow: [33278289904](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/actions/runs/33278289904) — success.
- GitHub release workflow: [33278297266](https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/actions/runs/33278297266) — success for Linux x64/ARM64, macOS x64/ARM64, Windows x64, release, Homebrew tap, and Scoop bucket jobs.
- Production deployment: Azure Static Web App `sf-selfhost-upgrade-rehearsal`, deployed from `dist/site` to <https://selfhost-upgrade-rehearsal.sociobot.in>.

## Reproduced and repaired findings

Before the repair, the built landing page requested `/latest.json` twice; its skip link left `document.activeElement` on `BODY` and `<main>` had no `tabindex`; the GitHub API returned 404 for `B-Divyesh/scoop-bucket/contents/selfhost-upgrade-rehearsal.json`.

- The landing page now reads `https://api.github.com/repos/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/latest`, stores the response under `release_metadata:selfhost-upgrade-rehearsal` for one hour, and shows the calm publishing/offline state if metadata or a matching asset is unavailable. `staticwebapp.config.json` now permits `https://api.github.com` in `connect-src`; the stale site-local `latest.json` was removed. Live browser evidence: one GitHub API request, zero `/latest.json` requests, cached `v0.1.4` metadata, and the matching Linux download URL.
- Created public <https://github.com/B-Divyesh/scoop-bucket>. The release workflow now publishes the candidate-bound `selfhost-upgrade-rehearsal.json`; its live version is `0.1.4`, points to the v0.1.4 Windows archive, and has SHA-256 `e4107e34e90629c4c48b2b78f348c75cf50deab240c31e2b617fc4025cad05e0`. README documents `scoop bucket add b-divyesh https://github.com/B-Divyesh/scoop-bucket` then `scoop install selfhost-upgrade-rehearsal`.
- Every rendered `<main id="main">`, including the standalone 404, is now `tabindex="-1"`. The new `@regression:skip-link` test exercises Tab/Enter on both the app and 404 in desktop and 390px contexts; focus lands on `#main`.
- The tag workflow now requests GitHub Actions attestations and publishes provenance for release assets. It writes checksums and `latest.json`, publishes the named Scoop manifest, and fails if the cross-repository token is absent. Both installers accept `REHEARSAL_VERSION=vX.Y.Z` for a checksum-verified rollback. README documents checksum verification, `gh attestation verify`, and rollback commands.

## Release and installer evidence

- Release v0.1.4 contains 14 assets: Linux archives, macOS archives/pkg files, Windows zip, deb, rpm, Winget zip, Homebrew formula, named Scoop manifest, `SHA256SUMS`, and `latest.json`.
- Downloaded `rehearsal-linux-x86_64.tar.gz` verified against published `SHA256SUMS`: `d5ba325542908d43af0a02dda5361c9e432f04f10284bbf4f05a4ad1726846b7`.
- GitHub’s attestations API returned one provenance attestation for that exact SHA-256 digest.
- Fresh release-archive demo: Arbor Desk, `ready`, nine checks.
- Fresh `cargo package --locked` created and verified `rehearsal-0.1.4.crate`; a fresh `cargo install --path` consumer ran the ready nine-check JSON demo.
- The deployed shell installer installed `rehearsal 0.1.4` after checksum verification. The same installer with `REHEARSAL_VERSION=v0.1.3` installed `rehearsal 0.1.3`, proving rollback.

## Verification

- Clean install: `npm ci` passed with zero audit vulnerabilities.
- Unit/integration/browser: `npm test` passed — 119 passed, 5 intentional project skips. All 47 exact commands in `.factory/claims.json` were invoked successfully; IDs and `@claim:` tags are one-to-one (47 each).
- Type/lint: `npm run lint` passed (`cargo fmt --check`, strict Clippy, strict TypeScript check).
- Production build: `npm run build` passed. `cargo package --locked` passed and verified the generated crate.
- Live worker verification: `/opt/fleet/lib/verify-url.sh https://selfhost-upgrade-rehearsal.sociobot.in <temp-evidence-dir>` passed — 200, title, `lang=en`, one h1, main landmark, alt text, labelled controls, and zero errors.
- Live Playwright + Axe: `/`, `/?demo=1`, `/privacy`, and `/terms` each had one h1/main and zero serious or critical violations. Landing made only the expected `api.github.com` metadata request; the demo made no external request. The skip link focused main. At 390px there was no overflow, no console error, no unsuitable download, and the unsupported-device message appeared. The loaded demo reset to `READY` after `context.setOffline(true)`.
- No service worker is registered; this is a static CLI landing site, so service-worker update checks are not applicable. The bundled demo’s offline interaction remains covered and passed.
- Response policy: live root has HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and CSP `connect-src 'self' https://api.github.com https://api.sociobot.in`. Unknown routes return HTTP 404. Hashes of live `index.html`, JS, CSS, and `install.sh` match the current `dist/site`/source output; hashed JS/CSS are immutable.
- Live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1,209 ms, CLS 0, TBT 24 ms. Initial JS is 22.98 KB raw / 7.79 KB gzip; CSS is 13.41 KB raw / 3.78 KB gzip.

## How to verify again

```sh
npm ci
npm test
npm run lint
npm run build
cargo package --locked
jq -r '.[].test' .factory/claims.json | while IFS= read -r test; do eval "$test" || exit 1; done
```

To verify distribution, download v0.1.4 plus `SHA256SUMS`, check the Linux archive with `sha256sum -c`, run `rehearsal demo --json`, then use the documented installer and `REHEARSAL_VERSION=v0.1.3` rollback path.

## Known gaps

None. macOS and Windows packages remain intentionally unsigned, as documented; no signing certificate was supplied or required for this artifact class.
