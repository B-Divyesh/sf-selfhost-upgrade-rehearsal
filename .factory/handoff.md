# Repair handoff — perfection loop round 2

## Result: PASS

All findings in `.factory/review-2.md`, `.factory/review-1.md`, and
`.factory/polish-1.md` are closed. The released site keeps its herbarium
field-guide identity and Rust single-binary CLI artifact class.

The round-two repair makes every Install link a real `/#install` navigation.
It renders the landing route when necessary, places the installation section
at the top of the viewport, moves focus to “Install one binary,” announces the
destination, and clears the isolated demo namespace when leaving the demo.
The direct deep link and back/forward history restore the same focused state.

The catalog description is now: “Rehearse self-hosted upgrades and create
customer-safe readiness receipts.” It is verb-first and 74 characters.

## Verification evidence

- Repair commits: `b911a92` and `59b6ab8`; both pushed to `origin/main`.
- GitHub Actions Test run `33266763901`: success for `59b6ab8`.
- Clean clone at `59b6ab8b8503e896a15d210a6a47789fbe7f369a`:
  - all 41 exact `.factory/claims.json` commands passed independently;
  - `npm test` passed 5 Rust tests and 103 Playwright tests;
  - 4 platform-specific Playwright skips were intentional;
  - evidence: `.factory/evidence/polish-2/claim-tests-clean-clone.log` and
    `.factory/evidence/polish-2/full-suite-clean-clone.log`.
- Release gates passed: `npm run build`, strict TypeScript, `cargo fmt`,
  `cargo clippy -D warnings`, `npm audit` with zero vulnerabilities,
  `cargo package --locked`, shell syntax, and `git diff --check`.
- `dist/site` exists. Initial JavaScript is 22,418 bytes raw / 7,633 bytes
  gzip; CSS is 13,227 bytes raw / 3,759 bytes gzip.
- Cold route and axe sweep covered landing, both demo URLs, Privacy, Terms,
  and 404 at 1440×900 and 390×844. Every page had its correct title,
  description, canonical, one H1, one main, header/footer, legal links, no
  overflow, no console error, and zero serious/critical axe findings.
- Live Install navigation after 250 ms: focus `install-title`; section top
  0.44 px desktop and 0.22 px mobile. Evidence:
  `.factory/evidence/polish-2/live-install-desktop.png`,
  `.factory/evidence/polish-2/live-install-mobile.png`, and
  `.factory/evidence/polish-2/live-browser-audit.json`.
- Live demo: persistent banner present; only the `demo:` session namespace
  used; real storage sentinel preserved; offline Reset demo reached READY;
  downloaded receipt was schema 1, READY, customer-safe, with nine checks;
  Start for real cleared demo storage and focused Install.
- `/opt/fleet/lib/verify-url.sh` passed locally and in production with no
  console errors. Production parity matched all 17 public files byte-for-byte.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; FCP 0.9 s, LCP 1.2 s, TBT 30 ms, CLS 0, 83 KiB transferred.

## Deployment

- Live site: `https://selfhost-upgrade-rehearsal.sociobot.in`
- Demo: `https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1`
- Install deep link: `https://selfhost-upgrade-rehearsal.sociobot.in/#install`
- Azure Static Web Apps deployment:
  `ac06fda0-d025-4b07-9fab-090b7aeda7f5`
- Deployment completed and cold live verification passed on 29 August 2026
  UTC. All 17 served public files match the final local build.
- Published CLI release remains `v0.1.2`; this repair changes only site
  routing/tests/docs, so the verified cross-platform binary assets remain
  current.

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```

Nothing remains to fix within this work order. There are no known product
gaps or deferred findings.
