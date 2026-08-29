# Repair handoff — Self-Host Upgrade Rehearsal

## Result

Perfection-loop round 1 is complete. All 17 findings in `.factory/review-1.md` and the earlier regressions it cites are fixed, tested, released, deployed, and checked cold on the live domain. The artifact remains a Rust single-binary CLI with a static Vite landing/docs site.

## Delivered

- Made `/?demo=1` the canonical one-click sample path while retaining `/demo` as an alias.
- Kept demo data isolated in the `demo:` session-storage namespace, with a persistent banner, reset, and start-for-real exit.
- Rebuilt the HTTP 404 page with the full site shell, legal links, metadata, focus affordances, and product visual system.
- Added route-specific titles, descriptions, canonicals, and Open Graph/Twitter metadata for landing, demo, Privacy, Terms, and 404.
- Registered 41 public claims and gave every claim exactly one tagged observable test.
- Rewrote every flagged phrase and standardized the visitor-facing term “sample demo.”
- Added a same-origin release manifest so a cold page does not emit GitHub API rate-limit errors; its links resolve to the exact published GitHub assets.
- Published release `v0.1.2` with macOS arm64/x64 archives and packages, Windows zip, Linux arm64/x64 archives, `.deb`, `.rpm`, Scoop, Winget, Homebrew formula, `latest.json`, and `SHA256SUMS`.
- Updated the Homebrew tap at commit `ff3e872`. Future release jobs now fail clearly if the cross-repository token is absent instead of silently skipping the tap.
- Updated `.factory/catalog-description.txt`, `.factory/copy-audit.md`, `.factory/demo.md`, and `.factory/polish-1.md`.

Implementation commits: `be7cf71`, `f741f23`, `ccef542`, and `6553be7`. Release workflow run: `33257395063`.

## Verification

Final clean-clone commands:

```sh
npm ci
npm test
npm run build
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo package
npm audit --audit-level=high
```

- Full suite: 97 passed, 2 intentional conditional skips; Rust unit tests: 5 passed.
- Claims: all 41 exact commands from `.factory/claims.json` passed independently from the final clean clone.
- Build: `dist/site/` produced; initial JavaScript 21.82 KB raw / 7.49 KB gzip and CSS 13.07 KB raw / 3.70 KB gzip.
- Package: `rehearsal` 0.1.2 packaged with 15 files, 54.6 KiB unpacked / 16.4 KiB compressed.
- Dependency audit: 0 vulnerabilities.
- Published Linux x64 archive: checksum matched `SHA256SUMS`; binary reported `rehearsal 0.1.2`; `demo --json` returned `ready`, `customer_safe: true`, and 9 checks.

Live verification at `https://selfhost-upgrade-rehearsal.sociobot.in`:

- Static deployment ID: `70bfba99-e215-497e-b805-ff468c07b326`.
- Cold verifier: HTTP 200 in 878 ms, correct title/lang/main, one H1, no missing alt text, no unlabeled buttons, and no console or page errors.
- Routes: `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, `/latest.json`, `/install.sh`, and `/install.ps1` returned 200; an unknown path returned the designed HTTP 404.
- Mobile: no horizontal overflow at 390 px on landing, demo, Privacy, Terms, or 404; 200% text reflow remained within the viewport.
- Accessibility: axe reported 0 serious/critical findings on every public route and 404. Keyboard route focus and back navigation passed.
- Demo: cold query entry showed the sample banner; reset cleared all `demo:` keys and replayed offline; Start for real removed demo state. The full demo flow made only same-origin requests.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 1.2 s, TBT 50 ms, CLS 0; transferred 82 KiB.
- Screenshots and verifier data are in `.factory/evidence/live/` and mapped per finding in `.factory/polish-1.md`.

## Run locally

```sh
npm ci
npm test
npm run build:site
npm run preview
```

Open `http://127.0.0.1:4173/?demo=1`.

## Deployment and release

The static site was deployed from `dist/site` through the work-order deployment helper. Release `v0.1.2` is available at `https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/tag/v0.1.2`.

The same-origin `/latest.json` is deliberate: the previous cold GitHub API lookup produced a rate-limit console error. The local manifest preserves exact release-asset links and a console-clean first load.

## Remaining work

No product or review work remains. Before a future version tag, the repository operator must keep `FACTORY_GITHUB_TOKEN` configured for the cross-repository Homebrew tap update; the current `v0.1.2` tap is already published and verified.
