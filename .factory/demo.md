# Demo sandbox

- Browser entry: `https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1`
- Browser alias: `https://selfhost-upgrade-rehearsal.sociobot.in/demo`
- CLI entry: `rehearsal demo`
- Local browser entry: `http://127.0.0.1:4173/?demo=1` after `npm run build:site && npm run preview`

The sample demo is Arbor Desk upgrading from 1.8.4 to 2.0.0. It includes configuration schemas and sample commands for backup, restore, and health checks. No real project data is present.

The CLI makes a new directory under the operating system's temporary directory unless `--output` is given. It prints both receipt paths. The browser demo uses only `sessionStorage` keys prefixed with `demo:`. It never reads the real license during the demo.

Use **Reset demo** to clear all `demo:` keys and replay the terminal. Use **Install the CLI** to clear the demo namespace and open the install section. Closing the tab also clears the demo session namespace.
