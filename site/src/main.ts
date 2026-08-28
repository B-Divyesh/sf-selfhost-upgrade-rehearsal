import './styles.css';

const PRODUCT = 'Self-Host Upgrade Rehearsal';
const SLUG = 'selfhost-upgrade-rehearsal';
const REPO = 'B-Divyesh/sf-selfhost-upgrade-rehearsal';
const BILLING = `https://api.sociobot.in/api/v1/products/${SLUG}`;

type Route = '/' | '/demo' | '/privacy' | '/terms' | '/404';
type ReleaseAsset = { name: string; browser_download_url: string };

const app = document.querySelector<HTMLDivElement>('#app')!;
let terminalTimer: number | undefined;

const demoLines = [
  ['$ rehearsal demo', 'command'],
  ['Sample: Arbor Desk 1.8.4 → 2.0.0', 'muted'],
  ['✓ Preflight', 'pass'],
  ['✓ Start source', 'pass'],
  ['✓ Seed fixture · synthetic records', 'pass'],
  ['✓ Create backup', 'pass'],
  ['✓ Stop source', 'pass'],
  ['✓ Start target', 'pass'],
  ['✓ Restore backup', 'pass'],
  ['✓ Run health check', 'pass'],
  ['✓ Clean temporary services', 'pass'],
  ['SHR-8A71C042D591: READY', 'stamp-line'],
  ['JSON: report/readiness.json', 'muted'],
  ['HTML: report/readiness.html', 'muted']
] as const;

function header(): string {
  return `<header class="site-header">
    <a class="wordmark" href="/" data-link aria-label="Self-Host Upgrade Rehearsal home">
      <svg aria-hidden="true" viewBox="0 0 36 36"><path d="M18 31V13M18 23C11 22 7 18 6 11c7 0 11 4 12 10M19 19c2-7 6-11 13-11 0 7-4 11-12 12"/><path d="M10 31h17" class="ground"/></svg>
      <span>Upgrade<br>Rehearsal</span>
    </a>
    <nav aria-label="Main navigation">
      <a href="/demo" data-link>Demo</a>
      <a href="/#install">Install</a>
      <a href="/privacy" data-link>Privacy</a>
    </nav>
  </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <p><strong>${PRODUCT}</strong><br><span>Readiness receipts for self-hosted upgrades.</span></p>
    <nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://paramfactory.com" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
    <p class="build">v0.1.0 · build 2026.08.28</p>
  </footer>`;
}

function shell(content: string): string {
  return `${header()}<div id="route-status" class="sr-only" aria-live="polite"></div>${content}${footer()}`;
}

function landing(): string {
  return shell(`<main id="main">
    <section class="hero ruled-section" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">Field receipt no. 001 · upgrade proof kit</p>
        <h1 id="hero-title" tabindex="-1">Rehearse upgrades before customers do</h1>
        <p class="lede">For self-hosted product teams that need proof before each Compose or Kubernetes release.</p>
        <div class="hero-action">
          <a class="button primary" href="/demo" data-link>Try it with sample data</a>
          <span>Runs a complete synthetic upgrade and opens its receipt.</span>
        </div>
        <ul class="plain-facts" aria-label="Product facts">
          <li>No project data is uploaded.</li>
          <li>The bundled demo runs offline after this page loads.</li>
          <li>The core CLI is free under the MIT License.</li>
        </ul>
      </div>
      <figure class="specimen">
        <span class="plate-number">Plate I · known path</span>
        <img src="/specimen-upgrade.webp" width="840" height="840" fetchpriority="high" alt="A field-guide plant grows from stacked containers beside a specimen receipt." />
        <figcaption>Observe one declared path. Label everything outside it.</figcaption>
      </figure>
    </section>

    <section class="preview ruled-section" aria-labelledby="preview-title">
      <div class="section-heading"><p class="eyebrow">Live specimen</p><h2 id="preview-title">See the whole rehearsal</h2><p>This recording uses the same bundled sample as <code>rehearsal demo</code>.</p></div>
      ${terminal('landing-terminal')}
      <div class="receipt-strip" aria-label="Sample readiness summary">
        <div><span>Path</span><strong>1.8.4 → 2.0.0</strong></div>
        <div><span>Backup and restore</span><strong>Passed</strong></div>
        <div><span>Schema changes</span><strong>3 labelled</strong></div>
        <div class="mini-stamp">Ready</div>
      </div>
    </section>

    <section class="how ruled-section" aria-labelledby="how-title">
      <div class="section-heading"><p class="eyebrow">Method</p><h2 id="how-title">Move one upgrade through three checks</h2></div>
      <ol class="field-steps">
        <li><span>01</span><div><h3>Declare the path</h3><p>Name both versions, supported systems, resource minimums, schemas, and hook commands.</p></div></li>
        <li><span>02</span><div><h3>Run clean hooks</h3><p>The CLI uses a new temporary directory for seed, backup, restore, and health checks.</p></div></li>
        <li><span>03</span><div><h3>Give customers the receipt</h3><p>Share the HTML receipt. Keep the JSON receipt as your release gate.</p></div></li>
      </ol>
    </section>

    <section id="install" class="install ruled-section" aria-labelledby="install-title">
      <div class="section-heading"><p class="eyebrow">Field kit</p><h2 id="install-title">Install one binary</h2><p id="platform-note">Checking published downloads…</p></div>
      <div class="install-card">
        <a id="platform-download" class="button primary disabled" href="https://github.com/${REPO}/releases" rel="external">Downloads are being published</a>
        <p id="release-note">You can open the release page while packages are prepared.</p>
        <div class="command-tabs" role="group" aria-label="Installer commands">
          <button type="button" data-copy="curl -fsSL https://${SLUG}.sociobot.in/install.sh | sh">Copy macOS and Linux install</button>
          <button type="button" data-copy="irm https://${SLUG}.sociobot.in/install.ps1 | iex">Copy Windows install</button>
        </div>
        <pre><code id="install-command">curl -fsSL https://${SLUG}.sociobot.in/install.sh | sh</code></pre>
        <p class="fine-print">Installers verify SHA256 before placing the binary on your path. Published packages are unsigned.</p>
      </div>
      <div class="usage-note"><p class="eyebrow">First run</p><pre><code>rehearsal init compose
# edit rehearsal.yml
rehearsal check
rehearsal run --output release-proof</code></pre></div>
    </section>

    <section class="limits ruled-section" aria-labelledby="limits-title">
      <div class="section-heading"><p class="eyebrow">Specimen boundary</p><h2 id="limits-title">Know what the receipt does not prove</h2></div>
      <div class="limit-copy">
        <p>It does not connect to customer servers or collect customer data.</p>
        <p>It does not upgrade a customer installation.</p>
        <p>Each receipt covers only its listed versions and environments.</p>
      </div>
    </section>

    <section class="paid ruled-section" aria-labelledby="paid-title">
      <div class="paid-mark" aria-hidden="true">TEAM<br>FIELD<br>KIT</div>
      <div><p class="eyebrow">Optional paid kit</p><h2 id="paid-title">Reuse the check in release CI</h2><p>The $79 one-time Team kit adds a release-matrix workflow and six-month compatibility calendar.</p><ul><li>The CLI and both receipt formats stay free.</li><li>Sociobot is the merchant of record.</li><li>Refunds are handled through Sociobot.</li></ul></div>
      <div class="license-box">
        <a class="button primary" href="${BILLING}/checkout">Buy the Team kit — $79</a>
        <form id="license-form"><label for="license">Have a license? Paste it</label><div><input id="license" name="license" autocomplete="off" spellcheck="false"><button type="submit">Verify license</button></div></form>
        <p id="license-status" class="fine-print" aria-live="polite">Payment opens Sociobot checkout.</p>
        <button id="team-download" class="button secondary hidden" type="button">Download Team CI kit</button>
      </div>
    </section>
  </main>`);
}

function terminal(id: string): string {
  return `<div class="terminal-shell" aria-label="Terminal recording">
    <div class="terminal-bar"><span><i></i><i></i><i></i></span><strong>rehearsal · sample</strong><button type="button" data-terminal="${id}" aria-pressed="false">Play recording</button></div>
    <pre id="${id}" class="terminal" tabindex="0" aria-live="polite"><code></code></pre>
  </div>`;
}

function demo(): string {
  return shell(`<div class="demo-banner" role="status"><span><strong>Demo</strong> — sample data, nothing is saved</span><span><button id="reset-demo" type="button">Reset demo</button><a href="/#install" id="start-real">Start for real</a></span></div>
    <main id="main" class="demo-page">
      <section class="demo-intro"><p class="eyebrow">Bundled specimen · Arbor Desk</p><h1 tabindex="-1">Inspect a finished upgrade rehearsal</h1><p>This sample moves synthetic workspaces from 1.8.4 to 2.0.0.</p></section>
      <section aria-labelledby="demo-run-title"><h2 id="demo-run-title" class="sr-only">Sample terminal run</h2>${terminal('demo-terminal')}</section>
      <section class="full-receipt" aria-labelledby="receipt-title">
        <div class="receipt-head"><div><p class="eyebrow">Customer-safe receipt · SHR-8A71C042D591</p><h2 id="receipt-title">Arbor Desk 1.8.4 → 2.0.0</h2><p>Bundled fixture · linux/x86_64</p></div><span class="receipt-stamp">Ready</span></div>
        <div class="receipt-grid"><div><span>Memory</span><strong>768 MB</strong></div><div><span>Disk</span><strong>2,048 MB</strong></div><div><span>Checks</span><strong>9 passed</strong></div></div>
        <div class="receipt-body">
          <div><h3>Config schema changes</h3><ul class="change-list"><li><code>database.ssl</code><span>Removed</span></li><li><code>database.ssl_mode</code><span>Added</span></li><li><code>workers.count</code><span>Added</span></li></ul></div>
          <div><h3>Coverage limit</h3><p>This receipt covers only the versions and systems shown here.</p><p>Hook output and fixture contents are excluded.</p></div>
        </div>
        <button id="download-receipt" class="button secondary" type="button">Download sample JSON</button>
      </section>
    </main>`);
}

function privacy(): string {
  return legalPage('Privacy', 'Keep rehearsal data on your machine', `<p>The CLI runs on your machine. It does not send project files, hook output, or receipts to us.</p><h2>Website requests</h2><p>The website requests release metadata from GitHub. GitHub receives your IP address and browser details.</p><p>License checks send the license token to Sociobot. We store the token and a daily verdict in your browser.</p><h2>Demo storage</h2><p>The browser demo uses session storage keys that start with <code>demo:</code>. Closing the tab clears them.</p><h2>Payments</h2><p>Sociobot and Dodo process checkout details. This site does not receive card numbers.</p><h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with a privacy question.</p>`);
}

function terms(): string {
  return legalPage('Terms', 'Use receipts as tested evidence', `<p>Self-Host Upgrade Rehearsal is provided under the MIT License.</p><h2>Receipt scope</h2><p>A receipt describes one declared test. It does not promise success in an unlisted environment.</p><p>You remain responsible for backups, release decisions, and customer instructions.</p><h2>Team kit</h2><p>The Team kit costs $79 as a one-time purchase. Sociobot is the merchant of record.</p><p>Refunds are handled through Sociobot. A refund revokes the related license.</p><h2>Fair use</h2><p>Do not use the service to test systems you do not control.</p><h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> with a terms question.</p>`);
}

function legalPage(label: string, title: string, body: string): string {
  return shell(`<main id="main" class="legal"><p class="eyebrow">${label} · effective 28 August 2026</p><h1 tabindex="-1">${title}</h1>${body}</main>`);
}

function notFound(): string {
  return shell(`<main id="main" class="missing"><p class="eyebrow">Field note · 404</p><h1 tabindex="-1">This specimen is missing</h1><p>The page may have moved. The upgrade kit is still in the cabinet.</p><a class="button primary" href="/" data-link>Return to the upgrade kit</a></main>`);
}

function currentRoute(): Route {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return (['/', '/demo', '/privacy', '/terms'].includes(path) ? path : '/404') as Route;
}

const titleMap: Record<Route, string> = {
  '/': 'Self-Host Upgrade Rehearsal — test upgrades first',
  '/demo': 'Demo — Self-Host Upgrade Rehearsal',
  '/privacy': 'Privacy — Self-Host Upgrade Rehearsal',
  '/terms': 'Terms — Self-Host Upgrade Rehearsal',
  '/404': 'Page not found — Self-Host Upgrade Rehearsal'
};

function render(focus = false): void {
  window.clearInterval(terminalTimer);
  const route = currentRoute();
  document.title = titleMap[route];
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = `https://${SLUG}.sociobot.in${route === '/404' ? window.location.pathname : route}`;
  app.innerHTML = route === '/' ? landing() : route === '/demo' ? demo() : route === '/privacy' ? privacy() : route === '/terms' ? terms() : notFound();
  bindNavigation();
  if (route === '/') setupLanding();
  if (route === '/demo') setupDemo();
  if (focus) {
    const heading = document.querySelector<HTMLElement>('h1');
    heading?.focus();
    document.querySelector('#route-status')!.textContent = heading?.textContent ?? '';
    window.scrollTo(0, 0);
  }
}

function bindNavigation(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.pushState({}, '', link.href);
    render(true);
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-terminal]').forEach(button => button.addEventListener('click', () => playTerminal(button.dataset.terminal!, button)));
}

function playTerminal(id: string, button: HTMLButtonElement): void {
  const output = document.querySelector<HTMLElement>(`#${id} code`)!;
  const isPlaying = button.getAttribute('aria-pressed') === 'true';
  window.clearInterval(terminalTimer);
  if (isPlaying) {
    button.setAttribute('aria-pressed', 'false');
    button.textContent = 'Resume recording';
    return;
  }
  output.innerHTML = '';
  let index = 0;
  button.setAttribute('aria-pressed', 'true');
  button.textContent = 'Pause recording';
  const addLine = () => {
    const line = demoLines[index++];
    if (!line) {
      window.clearInterval(terminalTimer);
      button.setAttribute('aria-pressed', 'false');
      button.textContent = 'Replay recording';
      return;
    }
    const span = document.createElement('span');
    span.className = line[1];
    span.textContent = line[0];
    output.append(span, '\n');
  };
  addLine();
  terminalTimer = window.setInterval(addLine, 110);
}

function showCompleteTerminal(id: string): void {
  const output = document.querySelector<HTMLElement>(`#${id} code`);
  if (!output) return;
  output.innerHTML = '';
  demoLines.forEach(line => {
    const span = document.createElement('span');
    span.className = line[1];
    span.textContent = line[0];
    output.append(span, '\n');
  });
}

function setupLanding(): void {
  showCompleteTerminal('landing-terminal');
  setupCopyButtons();
  loadRelease();
  setupLicense();
}

function setupDemo(): void {
  sessionStorage.setItem('demo:active', '1');
  showCompleteTerminal('demo-terminal');
  document.querySelector('#reset-demo')?.addEventListener('click', () => {
    Object.keys(sessionStorage).filter(key => key.startsWith('demo:')).forEach(key => sessionStorage.removeItem(key));
    const button = document.querySelector<HTMLButtonElement>('[data-terminal="demo-terminal"]')!;
    playTerminal('demo-terminal', button);
  });
  document.querySelector('#start-real')?.addEventListener('click', () => {
    Object.keys(sessionStorage).filter(key => key.startsWith('demo:')).forEach(key => sessionStorage.removeItem(key));
  });
  document.querySelector('#download-receipt')?.addEventListener('click', downloadSample);
}

function setupCopyButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const command = button.dataset.copy!;
    document.querySelector('#install-command')!.textContent = command;
    try {
      await navigator.clipboard.writeText(command);
      button.textContent = 'Copied install command';
    } catch {
      button.textContent = 'Select the command below';
    }
  }));
}

function platformAsset(assets: ReleaseAsset[]): ReleaseAsset | undefined {
  const platform = navigator.userAgent.toLowerCase();
  const arch = platform.includes('arm') || platform.includes('aarch64') ? 'aarch64' : 'x86_64';
  const prefix = platform.includes('win') ? 'rehearsal-windows-x86_64' : platform.includes('mac') ? `rehearsal-macos-${arch}` : `rehearsal-linux-${arch}`;
  return assets.find(asset => asset.name.startsWith(prefix));
}

async function loadRelease(): Promise<void> {
  const button = document.querySelector<HTMLAnchorElement>('#platform-download')!;
  const note = document.querySelector('#release-note')!;
  const platformNote = document.querySelector('#platform-note')!;
  try {
    const cache = JSON.parse(localStorage.getItem('release:cache') || 'null');
    let release = cache?.time > Date.now() - 3_600_000 ? cache.value : null;
    if (!release) {
      const response = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=1`, { headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error('release unavailable');
      const releases = await response.json();
      release = releases[0];
      if (!release) throw new Error('release unavailable');
      localStorage.setItem('release:cache', JSON.stringify({ time: Date.now(), value: release }));
    }
    const asset = platformAsset(release.assets || []);
    if (!asset) throw new Error('platform package unavailable');
    button.href = asset.browser_download_url;
    button.textContent = `Download ${asset.name.replace('rehearsal-', '')}`;
    button.classList.remove('disabled');
    platformNote.textContent = `Release ${release.tag_name} is ready for this device.`;
    note.textContent = 'The download comes from the signed GitHub release record.';
  } catch {
    platformNote.textContent = 'Downloads are being published or this device is offline.';
    note.innerHTML = `Try again later or <a href="https://github.com/${REPO}/releases" rel="external">open the release page <span class="sr-only">(external site)</span></a>.`;
  }
}

function setupLicense(): void {
  const params = new URLSearchParams(location.search);
  const received = params.get('license');
  if (received) {
    localStorage.setItem(`sb_license:${SLUG}`, received);
    params.delete('license');
    history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
  }
  const form = document.querySelector<HTMLFormElement>('#license-form')!;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const token = new FormData(form).get('license')?.toString().trim();
    if (token) {
      localStorage.setItem(`sb_license:${SLUG}`, token);
      verifyLicense(token, true);
    }
  });
  document.querySelector('#team-download')?.addEventListener('click', downloadTeamKit);
  const token = localStorage.getItem(`sb_license:${SLUG}`);
  const verdict = JSON.parse(localStorage.getItem(`sb_license_verdict:${SLUG}`) || 'null');
  if (token && verdict?.valid) setLicensed(true, 'Team kit active.');
  if (token && (!verdict || verdict.time < Date.now() - 86_400_000)) verifyLicense(token, false);
}

async function verifyLicense(token: string, announced: boolean): Promise<void> {
  const status = document.querySelector('#license-status');
  if (announced && status) status.textContent = 'Checking this license…';
  try {
    const response = await fetch(`${BILLING}/verify?license=${encodeURIComponent(token)}`);
    const verdict = await response.json();
    localStorage.setItem(`sb_license_verdict:${SLUG}`, JSON.stringify({ valid: verdict.valid === true, time: Date.now() }));
    setLicensed(verdict.valid === true, verdict.valid ? 'Team kit active.' : 'License no longer active. You can buy a new license.');
  } catch {
    if (announced && status) status.textContent = 'The license check is offline. Try again when connected.';
  }
}

function setLicensed(valid: boolean, message: string): void {
  document.querySelector('#license-status')!.textContent = message;
  document.querySelector('#team-download')?.classList.toggle('hidden', !valid);
}

function downloadSample(): void {
  const receipt = { receipt_schema: 1, run_id: 'SHR-8A71C042D591', product: 'Arbor Desk', source_version: '1.8.4', target_version: '2.0.0', status: 'ready', required_resources: { memory_mb: 768, disk_mb: 2048 }, checks: demoLines.filter(line => line[0].startsWith('✓')).map(line => ({ name: line[0].slice(2), status: 'passed' })), customer_safe: true };
  downloadFile('arbor-desk-readiness.json', JSON.stringify(receipt, null, 2), 'application/json');
}

function downloadTeamKit(): void {
  const workflow = `name: Upgrade rehearsal\non: [workflow_dispatch]\njobs:\n  rehearse:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        path: [stable-to-current, previous-to-current]\n    steps:\n      - uses: actions/checkout@v4\n      - run: rehearsal run --file "rehearsals/\${{ matrix.path }}.yml" --output "receipts/\${{ matrix.path }}"\n      - uses: actions/upload-artifact@v4\n        with:\n          name: "readiness-\${{ matrix.path }}"\n          path: "receipts/\${{ matrix.path }}"\n`;
  downloadFile('rehearsal-team-ci.yml', workflow, 'text/yaml');
}

function downloadFile(name: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

window.addEventListener('popstate', () => render(true));
render();
