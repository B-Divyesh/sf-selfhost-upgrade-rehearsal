# Perfection-loop round 4 handoff

## Result: PASS

All findings in reviews 1–4 are closed. The repair is live at <https://selfhost-upgrade-rehearsal.sociobot.in>. The implementation commit is `fdf7229a2d9f38d529664d93f8b21c6c28391c9d`; Azure Static Web Apps deployment is `a8f36e13-4fca-44c7-8196-b338f5e0a514`.

## What changed

- Replaced the false customer-installation guarantee with the enforceable boundary: no built-in client or discovery, while configured hooks retain host access. The hostile claim test now writes through an explicitly configured hook and proves an unconfigured customer path stays untouched.
- Kept the 390px demo banner sticky through the receipt, with visible 44px Reset and Install controls.
- Renamed the demo exit to **Install the CLI**, removed the unproved workspace count, and standardized README wording to **sample demo**.
- Added exact claim coverage for desktop package support, demo tab lifetime, stable Rust/Node/npm requirements, test coverage, site output, and deployment directory. `.factory/claims.json` now has 46 IDs and exactly one matching test tag per ID.
- Declared Node/npm engines and the stable Rust toolchain.
- Updated the catalog line to “Rehearse self-hosted upgrades and issue customer-safe receipts.” (63 characters, verb first).
- Preserved the herbarium-sheet identity, static deployment class, Rust CLI, v0.1.3 installers, and published cross-platform release assets.

The complete finding map is in `.factory/polish-4.md`; the full wording inventory is in `.factory/copy-audit.md`.

## Exact verification

Clean clone `/tmp/rehearsal-claims-nIg6AT` at `fdf7229a2d9f38d529664d93f8b21c6c28391c9d`:

- `npm ci`: passed; 0 audit vulnerabilities.
- Every one of the 46 exact `test` commands in `.factory/claims.json`: passed independently.
- `npm test`: passed; 5 Rust tests and 114 Playwright tests, with 4 intentional project-specific skips.
- `npm run build`: passed; wrote the release binary and `dist/site`.
- `cargo fmt --check`: passed.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `cargo package --locked`: passed; packaged and verified `rehearsal 0.1.3`.

Accessibility, privacy, offline, and performance:

- Playwright axe: zero serious/critical findings.
- `npx @axe-core/cli` on `/`, `/?demo=1`, `/privacy`, and `/terms`: 0 violations on all four pages.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, one H1, one main, `lang=en`, complete image alt text, no unlabeled buttons, no console errors.
- Live demo at 390×844: sticky banner top/bottom `0/81.1875px` after scrolling to the receipt; both controls are 44px high; no horizontal overflow.
- Live offline Reset reached `READY`; request logging found no external request during the demo flow.
- Live tab-close check removed all `demo:` keys and preserved `localStorage["real:project"]`.
- Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 770ms, LCP 1,207ms, TBT 26ms, CLS 0.
- Initial assets: JS 22,412 bytes raw / 7.61KB gzip; CSS 13,411 bytes raw / 3.78KB gzip; hero WebP 70,902 bytes.

Production checks after deployment:

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms`: HTTP 200, route-specific title/canonical, one H1, and one main.
- `/round-4-missing`: HTTP 404 with the complete product header/footer, legal links, title, and recovery copy.
- `/#install`: focuses `install-title`, places the section at `0.21875px`, and clears demo state.
- iPhone context: “Install on macOS, Windows, or Linux.” and “No phone or tablet package is provided.”
- Live HTML, hashed JS/CSS, hero image, release manifest, and Demo/Privacy/Terms documents match `dist/site` byte-for-byte.
- GitHub release `v0.1.3` still exposes Linux x86_64/aarch64, macOS x86_64/aarch64, Windows x86_64, deb, rpm, pkg, Scoop, Winget, Homebrew, `SHA256SUMS`, and `latest.json` assets.

Evidence is under `.factory/evidence/polish-4/`, including live mobile screenshots, `verify.json`, `live-audit.json`, and `lighthouse.json`.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --locked
```

Deployable site root: `dist/site`. Browser demo: `/?demo=1`. CLI demo: `rehearsal demo`.

## Known gaps and next steps

None for this work order. No release rebuild is needed because the Rust CLI and v0.1.3 installer payloads did not change; this repair changes the site, documentation, tests, and claim contract.
