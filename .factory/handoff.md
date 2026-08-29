# Independent verification handoff — round 6

## Result: PASS

Candidate `33d92aa9a7d0a1017918fb7ac2f5d9b2c29e3645` passed independent product QA on 29 August 2026 UTC against <https://selfhost-upgrade-rehearsal.sociobot.in>.

The previously reported deployment-only failure is not present. Production is healthy and all 17 publicly deployable files from the candidate build match production byte-for-byte. The desktop first-screen facts and standalone 404 target defects from verification 5 are fixed and covered by passing regressions.

Defects found in this round:

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

Full evidence and acceptance reasoning are in `.factory/verification-6.md`.

## What was verified

- Mandatory cold first read and one-click isolated Arbor Desk sample demo.
- All 41 exact `.factory/claims.json` commands after locked dependency installation: 41 passed, 0 failed.
- Complete suite: 5 Rust tests and 99 Playwright tests passed; 4 intentional project-specific skips.
- Strict TypeScript, Rust format, strict Clippy, npm audit, production build, shell syntax, and diff checks.
- Locked Cargo package, fresh consumer install, public CLI/help/demo, normal, boundary, invalid-input, and recovery cases.
- Published v0.1.2 assets, SHA256, live installer, Homebrew tap, Scoop, Winget, and release manifest.
- Candidate/live byte parity, routes, links, real 404, security headers, ETag revalidation, and cache policy.
- Desktop and 390 px rendering, 200% text, keyboard-only use, focus, touch targets, reduced motion, console/page errors, and axe serious/critical findings.
- Demo request log, offline reset/download, storage isolation, service-worker absence, invalid-license storage/cache behavior, and checkout handoff.
- Sociobot verification allowance: 30 HTTP 200 responses; request 31 returned 429 with `Retry-After: 3`.
- Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.25 s, TBT 88 ms, CLS 0, 84,399 bytes transferred.

## Reproduce the core verification

```sh
npm ci
npm test
npm run build
npx tsc --noEmit --strict --target es2022 --moduleResolution bundler --module esnext site/src/main.ts
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
npm audit --audit-level=high
cargo package --locked
```

Fresh consumer check:

```sh
consumer_root="$(mktemp -d)"
cargo install --path target/package/rehearsal-0.1.2 --root "$consumer_root" --locked
"$consumer_root/bin/rehearsal" --help
"$consumer_root/bin/rehearsal" demo --json
```

## Known verification boundary

Docker, Podman, kubectl, and kind were unavailable in this container, so no real container engine or cluster was launched. This is not a release defect: all hook phases ran through the packaged fixture, both declaration adapters were validated, and the brief assigns actual migration/health commands to vendor-supplied hooks.

No sign-in, PWA service worker, first-party backend, or persistence surface exists, so the related conditional checks do not apply.

## Operator action

No repair or deployment action is required for this candidate. It is ready for release acceptance.
