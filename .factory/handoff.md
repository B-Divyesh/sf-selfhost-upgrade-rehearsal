# Review 1 handoff — Self-Host Upgrade Rehearsal

## Result: FAIL

No product code was changed. The independent adversarial review is recorded in
`.factory/review-1.md` and finds 17 issues: two HIGH contract failures (the
incomplete real 404 route and non-exhaustive claims), route metadata drift,
and copy/terminology issues.

## Verified

- fresh live first-read at 390px and desktop: clear first action;
- one-click demo: complete sample receipt, reset/exit namespace isolation, and
  offline completion;
- CLI demo in a fresh temporary workspace: READY, customer-safe, 9 checks;
- all 17 listed claim commands and full `npm test`: passed (46 passed,
  1 intentional skip);
- `npm run build`: passed;
- live routes, link crawl, metadata, headers, mobile overflow, axe sweep,
  keyboard route behavior, and request/storage behavior.

## Required next work

1. Give the real 404 page the complete site header/footer and route metadata.
2. Add sandbox tests and claim-manifest entries for every public promise, or
   remove the untestable promises.
3. Apply the plain-language, terminology, and per-route metadata rewrites in
   `.factory/review-1.md`.

## Reproduce

```sh
npm ci
npm test
npm run build
```
