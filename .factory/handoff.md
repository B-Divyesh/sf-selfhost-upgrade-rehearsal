# Review 6 handoff — FAIL

Adversarial review 6 is recorded in `.factory/review-6.md`. Product code was
not changed.

## Result

- F-6-1, blocking: `@claim:temporary-workspace` passes without observing a
  temporary workspace or the directories used by the promised hooks.
- F-6-2 / F-1-3 reopened, high: README promises that the CLI prints JSON and
  HTML receipt paths, but no manifest entry or test covers stdout.

## Verification

- Fresh 390×844 and 1440×900 live Chromium contexts.
- All 47 exact `.factory/claims.json` commands passed independently from fresh
  clone `ed30ad7e566a5ec80198ad42e22eb1a90a35fbc3`.
- Full suite passed: 6 Rust tests, 3 identity tests, and 123 Playwright tests;
  5 intentional skips.
- `npm run lint`, `npm run build`, and `cargo package --locked` passed.
- A CLI sample run in a new temporary directory produced READY JSON and HTML
  receipts with nine checks.
- Live demo Reset/offline/isolation, request logs, route metadata, back/focus,
  link crawl, Axe, URL verifier, release assets, Homebrew, Scoop, provenance,
  and checkout evidence were checked.

## Reproduce

```sh
npm ci
jq -r '.[].test' .factory/claims.json | while IFS= read -r test; do eval "$test" || exit 1; done
npm test
npm run lint
npm run build
cargo package --locked
```

## Next steps

Instrument the temporary-workspace claim as specified in F-6-1. Add a claim
and stdout assertion for the two printed receipt paths, or remove the README
sentence. Rerun the full review after both changes.
