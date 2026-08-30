# Independent verification 11 handoff — FAIL

## Result

**FAIL** for candidate `871da0650d35b1f628a868de820a437691753e57` at
<https://selfhost-upgrade-rehearsal.sociobot.in>, verified 2026-08-30 UTC.

The live deployment is byte-identical to the candidate and nearly every quality
gate passes, but the customer-facing HTML readiness receipt omits the declared
supported environments and their scope limitation. This is release blocking
because the product tells vendors to share that HTML receipt with customers,
while the brief requires reports to separate tested scope from unsupported
environments.

Full evidence is in `.factory/verification-11.md`.

## Verification summary

- Mandatory `.factory/claims.json` run: **47/47 exact commands passed**.
- Cold first-read and one-click sample demo: passed.
- `npm ci`, `npm test`, `npm run lint`, `npm run build`, and
  `cargo package --locked`: passed.
- Packaged-crate consumer install, CLI normal/invalid/failure/recovery cases,
  live checksum-verifying installer, release archive checksum, Homebrew/Scoop
  metadata, and GitHub provenance lookup: passed.
- Live desktop/390 px, keyboard, focus, reduced motion, route metadata, links,
  privacy request log, storage isolation, security headers, caching, and Axe:
  passed.
- Mobile Lighthouse: 97 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.7 s, TBT 180 ms, CLS 0.
- License verification allowance: 30 successful requests in one burst; request
  31 returned 429 with `Retry-After: 4`.
- Live root, route documents, JS/CSS, installers, images, and 404 bytes match the
  candidate exactly.

## Release-blocking defect

`readiness.json` contains separate `tested_environment` and
`supported_environments` fields plus the declared-environment limitation.
`readiness.html` contains only the tested Linux/x86_64 sentence. It omits macOS,
Windows, aarch64, and the limitation that only declared systems and architectures
are supported. Existing receipt-scope and receipt-contents claim tests inspect
only JSON, so all claim commands pass without proving the customer HTML output.

## Required next step

Render tested and declared-supported environments separately in
`receipt_html`, include the environment limitation, and extend the relevant
claim tests to assert both JSON and HTML. Then rebuild, publish a new candidate,
and rerun independent verification.

No product code was changed during this verification.
