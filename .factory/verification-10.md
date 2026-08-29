# Independent verification 10 — PASS

**Candidate commit:** `c3b7c93f25a26d1c45b67f5e8cf8c97d6ad1aba4`  
**Live URL:** <https://selfhost-upgrade-rehearsal.sociobot.in>  
**Verified:** 2026-08-29 UTC

## Verdict

**PASS.** The deployed static site is byte-identical to a fresh production build
of the candidate. The distributable CLI, one-click browser demo, privacy
boundary, release artifact, installer, keyboard/mobile behaviour, and required
quality gates all passed. No release-blocking defects were found.

## Cold first read

The first screen plainly says: “Rehearse upgrades before customers do.” It
identifies the audience as self-hosted product teams preparing a Compose or
Kubernetes release, and its first action is **Try it with sample data**, with
the adjacent explanation that it opens the bundled sample receipt. One click
opens the isolated Arbor Desk 1.8.4 → 2.0.0 receipt. This satisfies the
plain-words and one-click-demo acceptance gate.

## Mandatory claim run — 47/47 PASS

From this clean checkout, after `npm ci`, I invoked **every exact `test` value**
in `.factory/claims.json` separately, in manifest order, using
`npm test -- --grep @claim:<id>`. All passed against the product's local demo
entry point; a failure of any one would have failed this verification.

| Claim ID | Result |
| --- | --- |
| demo-receipt | PASS |
| offline-demo | PASS |
| demo-network-privacy | PASS |
| cli-receipts | PASS |
| upgrade-hooks | PASS |
| declared-resource-minimums | PASS |
| compose-kubernetes-declarations | PASS |
| installer-checksum | PASS |
| installer-provenance-rollback | PASS |
| mit-core | PASS |
| schema-redaction | PASS |
| customer-safe-receipt | PASS |
| temporary-workspace | PASS |
| argument-arrays | PASS |
| exit-codes | PASS |
| unsigned-packages | PASS |
| cli-no-upload | PASS |
| team-kit-license | PASS |
| declared-upgrade-path | PASS |
| customer-boundary | PASS |
| receipt-scope | PASS |
| team-kit-price-scope | PASS |
| free-cli-formats | PASS |
| sociobot-merchant | PASS |
| sociobot-refunds | PASS |
| sociobot-checkout | PASS |
| published-platform-download | PASS |
| supported-platforms | PASS |
| homebrew-tap | PASS |
| scoop-manifest | PASS |
| release-asset-set | PASS |
| receipt-contents | PASS |
| release-workflow | PASS |
| sample-demo-parity | PASS |
| sociobot-license-api | PASS |
| no-embedded-payment-provider | PASS |
| demo-storage-isolation | PASS |
| starter-templates | PASS |
| json-output | PASS |
| release-metadata | PASS |
| license-browser-storage | PASS |
| no-card-collection | PASS |
| dodo-checkout-processing | PASS |
| development-requirements | PASS |
| test-coverage | PASS |
| site-build-output | PASS |
| deploy-directory | PASS |

## Clean local gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 33 packages installed, 0 vulnerabilities reported |
| `npm test` | PASS; 119 passed, 5 intentional project skips, 49.3 s |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS: rustfmt, Clippy with `-D warnings`, strict TypeScript |
| `npm run build` | PASS; Rust release binary plus `dist/site` |
| `cargo package --locked` | PASS; packaged and verified `rehearsal-0.1.4` |

The production bundle is well inside the static budget: JS 22,979 bytes raw /
7.79 KB gzip and CSS 13,411 bytes raw / 3.78 KB gzip. The largest deployed
visual is the original Open Graph WebP at 57,158 bytes; the product specimen
WebP is 70,902 bytes.

## End-to-end CLI and installer evidence

- Downloaded published `v0.1.4` Linux x86_64 archive and verified it against
  the release `SHA256SUMS`: `d5ba325542908d43af0a02dda5361c9e432f04f10284bbf4f05a4ad1726846b7`.
  Its `--help` exposes `init`, `check`, `run`, and `demo`.
- The published binary's `rehearsal demo --output … --json` produced JSON and
  HTML receipts. The customer-safe receipt is `ready` for Arbor Desk
  1.8.4 → 2.0.0, lists 768 MB / 2,048 MB, three schema changes, supported
  operating systems/architectures, and nine passed checks.
- Installed the packed crate into a new isolated `CARGO_INSTALL_ROOT` and
  exercised its public CLI. `init kubernetes` gave the setup guidance; malformed
  input returned exit 2 with an actionable error; `demo` again produced both
  receipt formats and the ready nine-check result.
- Ran the **live** `install.sh` with a temporary install target and
  `REHEARSAL_VERSION=v0.1.4`. It printed the SHA-256 success before installing,
  installed `rehearsal 0.1.4`, and its installed `demo --json` returned the
  ready Arbor Desk receipt.
- GitHub release `v0.1.4` exposes Linux archives plus deb/rpm, macOS
  x86_64/aarch64 archives and unsigned pkg files, Windows zip, Winget,
  Homebrew formula, Scoop manifest, `SHA256SUMS`, and `latest.json`.

## Live browser, privacy, accessibility, and deployment evidence

- Fresh local `dist/site/index.html`, hashed JS, and CSS exactly matched the
  live bytes (SHA-256 `ba4d…9bd4`, `a859…32a5`, and `5b87…85b6`, respectively).
  The live `install.sh` and `install.ps1` also matched candidate source bytes.
- Complete Playwright demo flow at `/?demo=1` requested only the same-origin
  document, JS, and CSS; every request had a zero-byte body. Its downloaded
  receipt was `ready`, customer-safe, and had nine checks. It made no analytics,
  font, payment, project-data, or third-party request. Before reset, storage
  was only `sessionStorage["demo:active"]`; reset left both localStorage and
  sessionStorage empty.
- The ordinary landing page requested only its same-origin assets, the
  same-origin specimen image, and the disclosed public GitHub release API. No
  console or page errors occurred on desktop or 390 px mobile.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, title, `lang=en`, one H1,
  `main`, alt text, labelled controls, and no errors. The complete local
  Playwright suite runs Axe and passed zero serious/critical findings at desktop
  and mobile. Manual live keyboard checks found a visible `rgb(166,58,36)`
  3 px focus outline; the 44+ px skip link moves focus to `main`; all tested
  controls remained reachable. At 390 px, `scrollWidth === innerWidth === 390`.
  In reduced-motion emulation, the recording animation is finished and CSS
  transition duration is reduced to `0.00001s`.
- The live root, demo, privacy, terms, and designed 404 route have the expected
  document behaviour; an unknown route responds with actual HTTP 404. HTML is
  short-cacheable; hashed JS and CSS are `max-age=31536000, immutable`.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin
  referrer policy, restrictive permissions policy, and a CSP with only `self`,
  `api.github.com`, and `api.sociobot.in` where required. The product is a
  static CLI landing site rather than a PWA or backend, so service-worker,
  server persistence, and health-endpoint checks do not apply.
- The Sociobot product verification endpoint was rate-limit checked with a
  single invalid-license client: requests 1–30 returned 200 invalid; request
  31 returned **429** with `Retry-After: 3`. Thus the observed allowance is a
  30-request burst, and enforcement is present. No sign-in is required.

## Defects by severity

None found.

## Reproduce

```sh
npm ci
jq -r '.[].test' .factory/claims.json | while IFS= read -r test; do eval "$test" || exit 1; done
npm test
npm run typecheck
npm run lint
npm run build
cargo package --locked
```

