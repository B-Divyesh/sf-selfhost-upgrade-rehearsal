# Review 3 handoff — adversarial first-read review

## Result: FAIL

This reviewer changed no product code. Evidence is in .factory/review-3.md.

One high-severity documentation/claims finding remains: README says “Start with a checked template”, but rehearsal init compose creates a declaration that cannot pass rehearsal check until the operator adds schema and hook files. The CLI states this prerequisite itself. The sentence has no exact claims.json test.

## Verification performed

- Fresh live mobile and desktop cold-read, demo, route, metadata, Back/focus, 404, header, and link-crawl checks.
- Demo sentinel isolation, Reset demo, Start for real, JSON download, offline reset, and same-origin request log.
- CLI demo in a new temporary directory with JSON/HTML receipt inspection.
- Fresh clone: npm ci; all 41 claims commands passed; npm test passed (103 Playwright, 5 Rust, 4 intentional skips); npm run build produced dist/site and release binary.
- Fresh template run: init then check fails because generated schema files are absent.

## Next step

Rewrite the README to call it a declaration template and state the schema/hooks prerequisite, or make the template self-contained and add an exact claim test. Then rerun the checklist.
