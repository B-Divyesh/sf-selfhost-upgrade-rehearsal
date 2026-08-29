import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const root = resolve(import.meta.dirname, '..');
const releaseApiUrl = 'https://api.github.com/repos/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/latest';
const releaseApiResponse = {
  tag_name: 'v0.1.4',
  assets: [
    { name: 'rehearsal-linux-x86_64.tar.gz', browser_download_url: 'https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v0.1.4/rehearsal-linux-x86_64.tar.gz' },
    { name: 'rehearsal-linux-aarch64.tar.gz', browser_download_url: 'https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v0.1.4/rehearsal-linux-aarch64.tar.gz' },
    { name: 'rehearsal-macos-x86_64.tar.gz', browser_download_url: 'https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v0.1.4/rehearsal-macos-x86_64.tar.gz' },
    { name: 'rehearsal-macos-aarch64.tar.gz', browser_download_url: 'https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v0.1.4/rehearsal-macos-aarch64.tar.gz' },
    { name: 'rehearsal-windows-x86_64.zip', browser_download_url: 'https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/download/v0.1.4/rehearsal-windows-x86_64.zip' }
  ]
};

type DeclarationOptions = {
  notes?: string;
  preflight?: string;
  resources?: { memory_mb: number; disk_mb: number };
};

function declaration(options: DeclarationOptions = {}): string {
  const hook = '[/usr/bin/true]';
  const resources = options.resources || { memory_mb: 512, disk_mb: 1024 };
  return `schema: 1
product: Receipt privacy test
adapter: fixture
source: { version: 1.0.0, config_schema: old.yml }
target: { version: 2.0.0, config_schema: new.yml }
environment:
  operating_systems: [linux]
  architectures: [x86_64]
${options.notes ? `  notes: "${options.notes}"\n` : ''}resources: { memory_mb: ${resources.memory_mb}, disk_mb: ${resources.disk_mb} }
hooks:
  preflight: ${options.preflight || hook}
  start_source: ${hook}
  seed: ${hook}
  backup: ${hook}
  stop_source: ${hook}
  start_target: ${hook}
  restore: ${hook}
  health: ${hook}
  cleanup: ${hook}
`;
}

async function writeMinimalDeclaration(dir: string, options: DeclarationOptions = {}): Promise<void> {
  await writeFile(join(dir, 'old.yml'), 'database:\n  password: old-secret\n');
  await writeFile(join(dir, 'new.yml'), 'database:\n  password: new-secret\n  port: 5432\n');
  await writeFile(join(dir, 'rehearsal.yml'), declaration(options));
}

test('landing has one clear page outline and no serious accessibility errors', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle('Self-Host Upgrade Rehearsal — test upgrades first');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  expect(errors).toEqual([]);
  if (testInfo.project.name === 'mobile') {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('@regression:first-screen-facts all three facts fit common desktop first screens at legible size', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'desktop geometry is covered once at both required viewport sizes');

  for (const viewport of [{ width: 1440, height: 900 }, { width: 1366, height: 768 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const facts = await page.locator('.plain-facts li').evaluateAll(items => items.map(item => {
      const box = item.getBoundingClientRect();
      return {
        top: box.top,
        bottom: box.bottom,
        fontSize: Number.parseFloat(getComputedStyle(item).fontSize)
      };
    }));

    expect(facts, `${viewport.width}x${viewport.height} should contain exactly three facts`).toHaveLength(3);
    for (const fact of facts) {
      expect(fact.top, `fact should begin inside ${viewport.width}x${viewport.height}`).toBeGreaterThanOrEqual(0);
      expect(fact.bottom, `fact should end inside ${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(viewport.height);
      expect(fact.fontSize, `fact should remain at least 16px in ${viewport.width}x${viewport.height}`).toBeGreaterThanOrEqual(16);
    }
  }
});

test('@regression:install-navigation header Install link reveals and focuses the installation section', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Install' }).click();

  await expect(page).toHaveURL(/\/#install$/);
  await expect(page.locator('#install-title')).toBeFocused();
  const position = await page.locator('#install').evaluate(section => {
    const box = section.getBoundingClientRect();
    return { top: box.top, bottom: box.bottom, viewportHeight: innerHeight };
  });
  expect(position.top).toBeGreaterThanOrEqual(-1);
  expect(position.top).toBeLessThan(position.viewportHeight);
  expect(position.bottom).toBeGreaterThan(0);
});

test('@regression:install-deep-link direct install URL restores the same focused destination', async ({ page }) => {
  await page.goto('/#install');
  await expect(page.locator('#install-title')).toBeFocused();
  await expect(page.locator('#install')).toBeInViewport();
});

test('@regression:skip-link moves keyboard focus to main content', async ({ page }) => {
  for (const path of ['/', '/404.html']) {
    await page.goto(path);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  }
});

test('@regression:404-wordmark standalone 404 wordmark is a 44px target on desktop and mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'standalone page geometry is covered once at both required viewport sizes');

  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/404.html');
    const target = await page.getByRole('link', { name: 'Self-Host Upgrade Rehearsal home' }).evaluate(link => {
      const box = link.getBoundingClientRect();
      return { width: box.width, height: box.height };
    });

    expect(target.width, `wordmark width at ${viewport.width}px`).toBeGreaterThanOrEqual(44);
    expect(target.height, `wordmark height at ${viewport.width}px`).toBeGreaterThanOrEqual(44);
  }
});

test('@claim:demo-receipt demo downloads the complete schema-1 readiness receipt', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { level: 2, name: 'Arbor Desk 1.8.4 → 2.0.0' })).toBeVisible();
  await expect(page.getByText('9 passed')).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download sample JSON' }).click();
  const file = await (await download).createReadStream();
  let text = '';
  for await (const chunk of file!) text += chunk.toString();
  const receipt = JSON.parse(text);
  expect(receipt).toMatchObject({
    receipt_schema: 1,
    product: 'Arbor Desk',
    adapter: 'sample demo',
    status: 'ready',
    tested_environment: { operating_system: 'linux', architecture: 'x86_64' },
    supported_environments: { operating_systems: ['linux', 'macos', 'windows'], architectures: ['x86_64', 'aarch64'] },
    required_resources: { memory_mb: 768, disk_mb: 2048 },
    customer_safe: true
  });
  expect(receipt.config_changes).toHaveLength(3);
  expect(receipt.limitations).toHaveLength(3);
  expect(receipt.checks).toHaveLength(9);
  expect(receipt.checks.every((check: { duration_ms: unknown }) => typeof check.duration_ms === 'number')).toBe(true);
});

test('@claim:offline-demo bundled demo runs after the page goes offline', async ({ page, context }) => {
  await page.goto('/?demo=1');
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#demo-terminal')).toContainText('READY', { timeout: 5_000 });
});

test('@claim:demo-network-privacy demo sends no project data', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#demo-terminal')).toContainText('READY', { timeout: 5_000 });
  expect(external).toEqual([]);
});

test('@claim:cli-receipts CLI writes JSON and HTML receipts', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-claim-'));
  try {
    await exec(join(root, 'target/debug/rehearsal'), ['demo', '--output', dir]);
    const receipt = JSON.parse(await readFile(join(dir, 'report/readiness.json'), 'utf8'));
    expect(receipt.status).toBe('ready');
    expect(await readFile(join(dir, 'report/readiness.html'), 'utf8')).toContain('Customer-safe receipt');
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:upgrade-hooks CLI checks backup, restore, and health hooks', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-hooks-'));
  try {
    await exec(join(root, 'target/debug/rehearsal'), ['demo', '--output', dir]);
    const receipt = JSON.parse(await readFile(join(dir, 'report/readiness.json'), 'utf8'));
    for (const name of ['Create backup', 'Restore backup', 'Run health check']) {
      expect(receipt.checks.find((check: { name: string }) => check.name === name)?.status).toBe('passed');
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:declared-resource-minimums receipt records the declared memory and disk minimums', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-resources-'));
  try {
    await writeMinimalDeclaration(dir, { resources: { memory_mb: 1536, disk_mb: 4096 } });
    await exec(join(root, 'target/debug/rehearsal'), ['run', '--file', join(dir, 'rehearsal.yml'), '--output', join(dir, 'report')]);
    const receipt = JSON.parse(await readFile(join(dir, 'report/readiness.json'), 'utf8'));
    expect(receipt.required_resources).toEqual({ memory_mb: 1536, disk_mb: 4096 });
    const metadata = await readFile(join(root, 'site/index.html'), 'utf8');
    expect(metadata).toContain('record declared resource minimums');
    expect(metadata).not.toContain('resource checks');
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:compose-kubernetes-declarations validates both declaration adapters before launch', async () => {
  for (const adapter of ['compose', 'kubernetes']) {
    const dir = await mkdtemp(join(tmpdir(), `rehearsal-${adapter}-`));
    try {
      await writeFile(join(dir, 'old.yml'), 'port: 8080\n');
      await writeFile(join(dir, 'new.yml'), 'port: 8080\ntls: true\n');
      const hook = process.platform === 'win32' ? '[cmd, /c, exit, "0"]' : '[/usr/bin/true]';
      await writeFile(join(dir, 'rehearsal.yml'), `schema: 1\nproduct: Test product\nadapter: ${adapter}\nsource: { version: 1.0.0, config_schema: old.yml }\ntarget: { version: 2.0.0, config_schema: new.yml }\nenvironment: { operating_systems: [linux], architectures: [x86_64] }\nresources: { memory_mb: 512, disk_mb: 1024 }\nhooks:\n  preflight: ${hook}\n  start_source: ${hook}\n  seed: ${hook}\n  backup: ${hook}\n  stop_source: ${hook}\n  start_target: ${hook}\n  restore: ${hook}\n  health: ${hook}\n  cleanup: ${hook}\n`);
      const { stdout } = await exec(join(root, 'target/debug/rehearsal'), ['check', '--file', join(dir, 'rehearsal.yml')]);
      expect(stdout).toContain('Declaration is ready');
    } finally { await rm(dir, { recursive: true, force: true }); }
  }
});

test('@claim:installer-checksum installers verify the package before installation', async () => {
  const shell = await readFile(join(root, 'site/public/install.sh'), 'utf8');
  const powershell = await readFile(join(root, 'site/public/install.ps1'), 'utf8');
  expect(shell.indexOf('sha256sum -c')).toBeGreaterThan(-1);
  expect(shell).toContain('shasum -a 256 -c');
  expect(shell.indexOf('sha256sum -c')).toBeLessThan(shell.indexOf('install -m 755'));
  expect(shell).toContain('REHEARSAL_VERSION');
  expect(shell).toContain('releases/download/$release_tag');
  expect(powershell.indexOf('Get-FileHash')).toBeLessThan(powershell.indexOf('Copy-Item'));
  expect(powershell).toContain('REHEARSAL_VERSION');
  expect(powershell).toContain('releases/download/$releaseTag');
});

test('@claim:installer-provenance-rollback release documents GitHub provenance and checksum-verified rollback', async () => {
  const readme = await readFile(join(root, 'README.md'), 'utf8');
  const workflow = await readFile(join(root, '.github/workflows/release.yml'), 'utf8');
  expect(readme).toContain('gh attestation verify rehearsal-linux-x86_64.tar.gz --repo B-Divyesh/sf-selfhost-upgrade-rehearsal');
  expect(readme).toContain('REHEARSAL_VERSION=v0.1.3');
  expect(workflow).toContain('actions/attest-build-provenance@v2');
  expect(workflow).toContain('SHA256SUMS');
});

test('@claim:mit-core core CLI is MIT licensed', async () => {
  expect(await readFile(join(root, 'LICENSE'), 'utf8')).toContain('MIT License');
  expect(await readFile(join(root, 'Cargo.toml'), 'utf8')).toContain('license = "MIT"');
});

test('@claim:schema-redaction receipt schema changes exclude values', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-redaction-'));
  try {
    await writeFile(join(dir, 'old.yml'), 'database:\n  password: old-secret\n  port: 5432\n');
    await writeFile(join(dir, 'new.yml'), 'database:\n  password: new-secret\n  port: "5432"\n');
    const hook = process.platform === 'win32' ? '[cmd, /c, exit, "0"]' : '[/usr/bin/true]';
    await writeFile(join(dir, 'rehearsal.yml'), `schema: 1\nproduct: Redaction test\nadapter: compose\nsource: { version: 1.0.0, config_schema: old.yml }\ntarget: { version: 2.0.0, config_schema: new.yml }\nenvironment: { operating_systems: [linux], architectures: [x86_64] }\nresources: { memory_mb: 512, disk_mb: 1024 }\nhooks:\n  preflight: ${hook}\n  start_source: ${hook}\n  seed: ${hook}\n  backup: ${hook}\n  stop_source: ${hook}\n  start_target: ${hook}\n  restore: ${hook}\n  health: ${hook}\n  cleanup: ${hook}\n`);
    await exec(join(root, 'target/debug/rehearsal'), ['run', '--file', join(dir, 'rehearsal.yml'), '--output', join(dir, 'report')]);
    const receipt = await readFile(join(dir, 'report/readiness.json'), 'utf8');
    expect(receipt).not.toContain('old-secret');
    expect(receipt).not.toContain('new-secret');
    expect(receipt).toContain('database.port');
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:customer-safe-receipt customer-safe receipts omit declaration notes and hook output', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-safe-'));
  const secret = 'Customer ACME host db.customer.internal token secret-123';
  try {
    await writeMinimalDeclaration(dir, { notes: secret, preflight: `[/usr/bin/printf, "${secret}"]` });
    await exec(join(root, 'target/debug/rehearsal'), ['run', '--file', join(dir, 'rehearsal.yml'), '--output', join(dir, 'report')]);
    const receipt = await readFile(join(dir, 'report/readiness.json'), 'utf8');
    expect(receipt).toContain('"customer_safe": true');
    expect(receipt).not.toContain(secret);
    expect(receipt).not.toContain('"notes"');
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:temporary-workspace demo creates its own temporary project directory', async () => {
  const { stdout } = await exec(join(root, 'target/debug/rehearsal'), ['demo', '--json']);
  const receipt = JSON.parse(stdout);
  expect(receipt.status).toBe('ready');
  expect(receipt.run_id).toMatch(/^SHR-[A-F0-9]{12}$/);
});

test('@claim:argument-arrays hook arguments are passed without shell parsing', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-args-'));
  const sentinel = join(dir, 'must-not-exist');
  try {
    await writeMinimalDeclaration(dir, { preflight: `[/usr/bin/printf, "literal; touch ${sentinel}"]` });
    await exec(join(root, 'target/debug/rehearsal'), ['run', '--file', join(dir, 'rehearsal.yml'), '--output', join(dir, 'report')]);
    await expect(async () => readFile(sentinel, 'utf8')).rejects.toThrow();
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:exit-codes failed checks return 1 and invalid declarations return 2', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-exit-'));
  try {
    await writeMinimalDeclaration(dir, { preflight: '[/usr/bin/false]' });
    await expect(exec(join(root, 'target/debug/rehearsal'), ['run', '--file', join(dir, 'rehearsal.yml'), '--output', join(dir, 'report')])).rejects.toMatchObject({ code: 1 });
    await writeFile(join(dir, 'invalid.yml'), 'schema: 99\n');
    await expect(exec(join(root, 'target/debug/rehearsal'), ['check', '--file', join(dir, 'invalid.yml')])).rejects.toMatchObject({ code: 2 });
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:unsigned-packages release workflow makes unsigned package formats explicit', async () => {
  const readme = await readFile(join(root, 'README.md'), 'utf8');
  const workflow = await readFile(join(root, '.github/workflows/release.yml'), 'utf8');
  expect(readme).toContain('unsigned macOS `.pkg`, Windows zip');
  expect(workflow).not.toMatch(/codesign|signtool|notar/i);
  expect(workflow).toContain('pkgbuild --root');
});

test('@claim:cli-no-upload CLI contains no network client or telemetry path', async () => {
  const cargo = await readFile(join(root, 'Cargo.toml'), 'utf8');
  const source = `${await readFile(join(root, 'src/lib.rs'), 'utf8')}\n${await readFile(join(root, 'src/main.rs'), 'utf8')}`;
  expect(cargo).not.toMatch(/reqwest|hyper|ureq|telemetry|analytics/i);
  expect(source).not.toMatch(/TcpStream|UdpSocket|http:\/\/|https:\/\//);
});

test('@claim:team-kit-license valid license restores the Team CI kit', async ({ page }) => {
  await page.route('https://api.sociobot.in/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) }));
  await page.goto('/?license=test-license');
  await expect(page).not.toHaveURL(/license=/);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:selfhost-upgrade-rehearsal'))).toBe('test-license');
  await expect(page.getByRole('button', { name: 'Download Team CI kit' })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Team CI kit' }).focus();
  await page.keyboard.press('Enter');
  const stream = await (await download).createReadStream();
  let text = '';
  for await (const chunk of stream!) text += chunk.toString();
  expect(text).toContain('Upgrade checklist');
  expect(text).toContain('matrix:');
});

test('@claim:declared-upgrade-path receipt records the one declared source and target path', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-path-'));
  try {
    await writeMinimalDeclaration(dir);
    await exec(join(root, 'target/debug/rehearsal'), ['run', '--file', join(dir, 'rehearsal.yml'), '--output', join(dir, 'report')]);
    const receipt = JSON.parse(await readFile(join(dir, 'report/readiness.json'), 'utf8'));
    expect(receipt.source_version).toBe('1.0.0');
    expect(receipt.target_version).toBe('2.0.0');
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:customer-boundary built-in discovery stays inert while configured hooks retain explicit host access', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-boundary-'));
  const undiscoveredCustomer = join(dir, 'unconfigured-customer-installation');
  const configuredCustomer = join(dir, 'configured-customer-installation');
  const sentinel = join(undiscoveredCustomer, 'keep.txt');
  const configuredMarker = join(configuredCustomer, 'modified-by-configured-hook');
  try {
    await mkdir(undiscoveredCustomer);
    await mkdir(configuredCustomer);
    await writeFile(sentinel, 'customer data');
    await writeMinimalDeclaration(dir, {
      notes: `https://customer.invalid ${undiscoveredCustomer}`,
      preflight: `[/usr/bin/touch, "${configuredMarker}"]`
    });
    await exec(join(root, 'target/debug/rehearsal'), ['run', '--file', join(dir, 'rehearsal.yml'), '--output', join(dir, 'report')]);
    expect(await readFile(sentinel, 'utf8')).toBe('customer data');
    expect(await readFile(configuredMarker, 'utf8')).toBe('');
    const source = `${await readFile(join(root, 'src/lib.rs'), 'utf8')}\n${await readFile(join(root, 'src/main.rs'), 'utf8')}`;
    expect(source).not.toMatch(/TcpStream|UdpSocket|reqwest|hyper|ureq/);
    const landing = await readFile(join(root, 'site/src/main.ts'), 'utf8');
    expect(landing).toContain('The CLI has no built-in network client and does not discover customer installations.');
    expect(landing).toContain('Hooks can access paths and networks you configure.');
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:receipt-scope receipt names only its tested versions and supported environments', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-scope-'));
  try {
    await exec(join(root, 'target/debug/rehearsal'), ['demo', '--output', dir]);
    const receipt = JSON.parse(await readFile(join(dir, 'report/readiness.json'), 'utf8'));
    expect(receipt.source_version).toBe('1.8.4');
    expect(receipt.target_version).toBe('2.0.0');
    expect(receipt.supported_environments).toEqual({
      operating_systems: ['linux', 'macos', 'windows'],
      architectures: ['x86_64', 'aarch64']
    });
    expect(receipt.limitations).toContain('This receipt covers only the source and target versions shown here.');
    expect(receipt.limitations).toContain('Only the declared operating systems and architectures are supported.');
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:team-kit-price-scope $79 one-time Team kit contains the documented CI checklist', async ({ page }) => {
  await page.route('https://api.sociobot.in/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) }));
  await page.goto('/?license=recorded-valid-license');
  await expect(page.getByText('The $79 one-time Team kit adds a CI checklist for each supported source and target version.')).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Team CI kit' }).click();
  const stream = await (await download).createReadStream();
  let text = '';
  for await (const chunk of stream!) text += chunk.toString();
  expect(text).toContain('Upgrade checklist');
  expect(text).toContain('stable-to-current');
  expect(text).toContain('previous-to-current');
});

test('@claim:free-cli-formats both receipt formats work without a Team license', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-free-'));
  try {
    await exec(join(root, 'target/debug/rehearsal'), ['demo', '--output', dir]);
    expect(await readFile(join(dir, 'report/readiness.json'), 'utf8')).toContain('"status": "ready"');
    expect(await readFile(join(dir, 'report/readiness.html'), 'utf8')).toContain('Customer-safe receipt');
    expect(await readFile(join(root, 'Cargo.toml'), 'utf8')).not.toMatch(/license[_-]?key|entitlement/i);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:sociobot-merchant site identifies Sociobot as merchant of record', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Sociobot is the merchant of record.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy the Team kit — $79' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/selfhost-upgrade-rehearsal/checkout');
});

test('@claim:sociobot-refunds site states that Sociobot handles refunds and revoked licenses', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.getByText('Refunds are handled through Sociobot. A refund revokes the related license.')).toBeVisible();
});

test('@claim:sociobot-checkout payment action uses the Sociobot checkout endpoint', async ({ page }) => {
  await page.goto('/');
  const checkout = page.getByRole('link', { name: 'Buy the Team kit — $79' });
  await expect(checkout).toHaveAttribute('href', /^https:\/\/api\.sociobot\.in\/api\/v1\/products\/selfhost-upgrade-rehearsal\/checkout$/);
  expect(await readFile(join(root, 'site/src/main.ts'), 'utf8')).not.toMatch(/dodo(payments)?\.com|checkout\.dodo/i);
});

test('@claim:published-platform-download release metadata selects a matching GitHub asset', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'mobile devices intentionally receive the desktop-only state');
  await page.route(releaseApiUrl, route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(releaseApiResponse)
  }));
  await page.goto('/');
  await expect(page.getByText('Release v0.1.4 is ready for this device.')).toBeVisible();
  await expect(page.getByText('The download comes from the matching GitHub release.')).toBeVisible();
  const download = page.locator('#platform-download');
  await expect(download).toHaveText(/Download (linux|macos|windows)-/);
  await expect(download).toHaveAttribute('href', /github\.com\/B-Divyesh\/sf-selfhost-upgrade-rehearsal\/releases\/download\/v0\.1\.4\/rehearsal-(linux|macos|windows)-/);
});

test('@claim:supported-platforms published packages cover desktop systems and omit phone packages', async () => {
  const release = JSON.parse(await readFile(join(root, 'e2e/fixtures/github-release-v0.1.3.json'), 'utf8')) as { assets: Array<{ name: string }> };
  const names = release.assets.map(asset => asset.name);
  for (const required of [
    'rehearsal-linux-x86_64.tar.gz',
    'rehearsal-linux-aarch64.tar.gz',
    'rehearsal-macos-x86_64.tar.gz',
    'rehearsal-macos-aarch64.tar.gz',
    'rehearsal-windows-x86_64.zip'
  ]) expect(names).toContain(required);
  expect(names.some(name => /android|ios|iphone|ipad|tablet/i.test(name))).toBe(false);
  const source = await readFile(join(root, 'site/src/main.ts'), 'utf8');
  expect(source).toContain('Install on macOS, Windows, or Linux.');
  expect(source).toContain('No phone or tablet package is provided.');
});

test('@claim:homebrew-tap documented Homebrew formula is published', async () => {
  const readme = await readFile(join(root, 'README.md'), 'utf8');
  expect(readme).toContain('brew install B-Divyesh/selfhost-upgrade-rehearsal/rehearsal');
  const formula = await readFile(join(root, 'e2e/fixtures/homebrew-formula-v0.1.3.rb'), 'utf8');
  expect(formula).toContain('class Rehearsal < Formula');
  expect(formula).toContain('version "0.1.3"');
  expect(formula.match(/sha256 "[a-f0-9]{64}"/g)).toHaveLength(3);
});

test('@claim:scoop-manifest documented Scoop manifest is published and valid', async () => {
  const readme = await readFile(join(root, 'README.md'), 'utf8');
  const workflow = await readFile(join(root, '.github/workflows/release.yml'), 'utf8');
  expect(readme).toContain('scoop bucket add b-divyesh https://github.com/B-Divyesh/scoop-bucket');
  expect(readme).toContain('scoop install selfhost-upgrade-rehearsal');
  expect(workflow).toContain('gh repo clone "${GITHUB_REPOSITORY_OWNER}/scoop-bucket" scoop-bucket');
  expect(workflow).toContain('scoop-bucket/selfhost-upgrade-rehearsal.json');
  const manifest = JSON.parse(await readFile(join(root, 'e2e/fixtures/scoop-manifest-v0.1.3.json'), 'utf8')) as { version: string; url: string; hash: string };
  expect(manifest.version).toBe('0.1.3');
  expect(manifest.url).toMatch(/rehearsal-windows-x86_64\.zip$/);
  expect(manifest.hash).toMatch(/^[a-f0-9]{64}$/);
});

test('@claim:release-asset-set published release carries every documented package', async () => {
  const release = JSON.parse(await readFile(join(root, 'e2e/fixtures/github-release-v0.1.3.json'), 'utf8')) as { tag_name: string; assets: Array<{ name: string }> };
  expect(release.tag_name).toBe('v0.1.3');
  const names = release.assets.map(asset => asset.name);
  for (const pattern of [/\.deb$/, /\.rpm$/, /\.pkg$/, /windows-x86_64\.zip$/, /winget.*\.zip$/, /^SHA256SUMS$/, /^latest\.json$/]) {
    expect(names.some(name => pattern.test(name)), `missing release asset ${pattern}`).toBe(true);
  }
});

test('@claim:receipt-contents receipt contains every documented readiness field', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-fields-'));
  try {
    await exec(join(root, 'target/debug/rehearsal'), ['demo', '--output', dir]);
    const receipt = JSON.parse(await readFile(join(dir, 'report/readiness.json'), 'utf8'));
    expect(receipt.config_changes).toHaveLength(3);
    expect(receipt.required_resources).toEqual({ memory_mb: 768, disk_mb: 2048 });
    expect(receipt.checks).toHaveLength(9);
    expect(receipt.source_version).toBe('1.8.4');
    expect(receipt.target_version).toBe('2.0.0');
    expect(receipt.supported_environments.operating_systems).toEqual(['linux', 'macos', 'windows']);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:release-workflow version tags run the cross-platform release workflow', async () => {
  const workflow = await readFile(join(root, '.github/workflows/release.yml'), 'utf8');
  expect(workflow).toContain("tags: ['v*']");
  for (const platform of ['ubuntu-latest', 'macos-latest', 'windows-latest']) expect(workflow).toContain(platform);
  expect(workflow).toContain('softprops/action-gh-release');
  expect(workflow).toContain('FACTORY_GITHUB_TOKEN is required to update the Homebrew tap.');
  expect(workflow).toContain('FACTORY_GITHUB_TOKEN is required to update the Scoop bucket.');
  expect(workflow).toContain('actions/attest-build-provenance@v2');
  expect(workflow).not.toContain('skipping tap update');
});

test('@claim:sample-demo-parity browser and CLI use the Arbor Desk sample demo', async ({ page }) => {
  const { stdout } = await exec(join(root, 'target/debug/rehearsal'), ['demo', '--json']);
  const receipt = JSON.parse(stdout);
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { level: 2, name: `${receipt.product} ${receipt.source_version} → ${receipt.target_version}` })).toBeVisible();
  await expect(page.locator('#demo-terminal')).toContainText(`Sample: ${receipt.product} ${receipt.source_version} → ${receipt.target_version}`);
});

test('@claim:sociobot-license-api license verification uses only the Sociobot product endpoint', async ({ page }) => {
  let requested = '';
  await page.route('https://api.sociobot.in/**', route => {
    requested = route.request().url();
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid', expires_at: null }) });
  });
  await page.goto('/?license=recorded-invalid-license');
  await expect(page.getByText('License no longer active. You can buy a new license.')).toBeVisible();
  expect(requested).toBe('https://api.sociobot.in/api/v1/products/selfhost-upgrade-rehearsal/verify?license=recorded-invalid-license');
});

test('@claim:no-embedded-payment-provider repository embeds no payment-provider client', async () => {
  const pageSource = await readFile(join(root, 'site/src/main.ts'), 'utf8');
  const documentSource = await readFile(join(root, 'site/index.html'), 'utf8');
  const packageSource = await readFile(join(root, 'package.json'), 'utf8');
  expect(`${pageSource}\n${documentSource}\n${packageSource}`).not.toMatch(/stripe|paddle|lemonsqueezy|dodo(payments)?\.(com|js)|checkout\.dodo/i);
  expect(pageSource).toContain('https://api.sociobot.in/api/v1/products/');
});

test('@claim:demo-storage-isolation sample demo uses only demo session storage and clears it on exit or tab close', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('real:project', 'keep');
    sessionStorage.setItem('real:session', 'keep');
  });
  await page.goto('/?demo=1');
  expect(await page.evaluate(() => ({
    realProject: localStorage.getItem('real:project'),
    realSession: sessionStorage.getItem('real:session'),
    demoKeys: Object.keys(sessionStorage).filter(key => key.startsWith('demo:'))
  }))).toEqual({ realProject: 'keep', realSession: 'keep', demoKeys: ['demo:active'] });
  await page.getByRole('link', { name: 'Install the CLI' }).click();
  await expect(page).toHaveURL(/\/#install$/);
  await expect(page.locator('#install-title')).toBeFocused();
  await expect(page.locator('#install')).toBeInViewport();
  expect(await page.evaluate(() => sessionStorage.getItem('demo:active'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('real:project'))).toBe('keep');

  await page.goto('/?demo=1');
  expect(await page.evaluate(() => sessionStorage.getItem('demo:active'))).toBe('1');
  await page.close();
  const reopened = await context.newPage();
  await reopened.goto('/');
  expect(await reopened.evaluate(() => Object.keys(sessionStorage).filter(key => key.startsWith('demo:')))).toEqual([]);
  expect(await reopened.evaluate(() => localStorage.getItem('real:project'))).toBe('keep');
  await reopened.close();
});

test('@claim:starter-templates init writes Compose and Kubernetes declaration templates that name their required setup', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-init-'));
  try {
    const readme = await readFile(join(root, 'README.md'), 'utf8');
    expect(readme).toContain('Start with a declaration template:');
    expect(readme).toContain('Add your schema files and hook commands before running `rehearsal check`.');
    const help = await exec(join(root, 'target/debug/rehearsal'), ['init', '--help']);
    expect(help.stdout).toContain('Write a declaration template and list the setup it still needs');
    expect(help.stdout).not.toContain('checked starter');
    for (const adapter of ['compose', 'kubernetes']) {
      const output = join(dir, `${adapter}.yml`);
      const initialized = await exec(join(root, 'target/debug/rehearsal'), ['init', adapter, '--output', output]);
      expect(initialized.stdout).toContain('Add schema files and hook commands, then run `rehearsal check`.');
      const template = await readFile(output, 'utf8');
      expect(template).toContain('# Declaration template: add the referenced schema files and tailor every hook');
      expect(template).toContain(`adapter: ${adapter}`);
      expect(template).toContain('source:');
      expect(template).toContain('target:');
      expect(template).toContain('config_schema: schemas/1.0.yml');
      expect(template).toContain('config_schema: schemas/2.0.yml');
      expect(template).toContain('hooks:');
      await expect(exec(join(root, 'target/debug/rehearsal'), ['check', '--file', output]))
        .rejects.toMatchObject({ code: 2, stderr: expect.stringContaining('config schema') });
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:json-output check, run, and demo return machine-readable JSON', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'rehearsal-json-'));
  try {
    await writeMinimalDeclaration(dir);
    const checked = await exec(join(root, 'target/debug/rehearsal'), ['check', '--file', join(dir, 'rehearsal.yml'), '--json']);
    expect(JSON.parse(checked.stdout)).toMatchObject({ valid: true, source: '1.0.0', target: '2.0.0' });
    const run = await exec(join(root, 'target/debug/rehearsal'), ['run', '--file', join(dir, 'rehearsal.yml'), '--output', join(dir, 'report'), '--json']);
    expect(JSON.parse(run.stdout).status).toBe('ready');
    const demoDir = join(dir, 'demo');
    const demo = await exec(join(root, 'target/debug/rehearsal'), ['demo', '--output', demoDir, '--json']);
    expect(JSON.parse(demo.stdout).status).toBe('ready');
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('@claim:release-metadata website reads and caches CORS-safe GitHub release metadata', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'mobile devices intentionally receive the desktop-only state');
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.route(releaseApiUrl, route => {
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(releaseApiResponse) });
  });
  await page.goto('/');
  await expect(page.getByText('Release v0.1.4 is ready for this device.')).toBeVisible();
  expect(requests.filter(url => url === releaseApiUrl)).toHaveLength(1);
  expect(requests.some(url => url.endsWith('/latest.json'))).toBe(false);
  expect(await page.evaluate(() => localStorage.getItem('release_metadata:selfhost-upgrade-rehearsal'))).toContain('v0.1.4');
  await page.reload();
  await expect(page.getByText('Release v0.1.4 is ready for this device.')).toBeVisible();
  expect(requests.filter(url => url === releaseApiUrl)).toHaveLength(1);
  const config = JSON.parse(await readFile(join(root, 'site/public/staticwebapp.config.json'), 'utf8')) as { globalHeaders: Record<string, string> };
  expect(config.globalHeaders['Content-Security-Policy']).toContain("connect-src 'self' https://api.github.com https://api.sociobot.in");
});

test('@regression:release-publishing-state falls back without a release or a network connection', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.route(releaseApiUrl, route => route.fulfill({ status: 404, contentType: 'application/json', body: '{}' }));
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Downloads are being published' })).toBeVisible();
  await expect(page.getByText('Downloads are being published or this device is offline.')).toBeVisible();
  await expect(page.getByRole('link', { name: /open the release page/ })).toHaveAttribute('href', 'https://github.com/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases');
  expect(pageErrors).toEqual([]);
});

test('@claim:license-browser-storage license token and daily verdict stay in namespaced browser storage', async ({ page }) => {
  await page.route('https://api.sociobot.in/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }) }));
  await page.goto('/?license=recorded-license');
  await expect(page).not.toHaveURL(/license=/);
  const stored = await page.evaluate(() => ({
    token: localStorage.getItem('sb_license:selfhost-upgrade-rehearsal'),
    verdict: JSON.parse(localStorage.getItem('sb_license_verdict:selfhost-upgrade-rehearsal') || 'null')
  }));
  expect(stored.token).toBe('recorded-license');
  expect(stored.verdict.valid).toBe(true);
  expect(stored.verdict.time).toBeGreaterThan(Date.now() - 60_000);
});

test('@claim:no-card-collection website has no card fields or payment-provider script', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('input[name*="card" i], input[autocomplete="cc-number"], iframe')).toHaveCount(0);
  const scripts = await page.locator('script[src]').evaluateAll(nodes => nodes.map(node => (node as HTMLScriptElement).src));
  expect(scripts.every(src => new URL(src).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:dodo-checkout-processing Sociobot checkout hands payment processing to Dodo', async () => {
  const response = JSON.parse(await readFile(join(root, 'e2e/fixtures/sociobot-checkout-response.json'), 'utf8')) as { request: string; status: number; location: string };
  expect(response.request).toBe('https://api.sociobot.in/api/v1/products/selfhost-upgrade-rehearsal/checkout');
  expect(response.status).toBe(303);
  expect(response.location).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
});

test('@claim:development-requirements development versions are declared for stable Rust, Node 22, and npm', async () => {
  const toolchain = await readFile(join(root, 'rust-toolchain.toml'), 'utf8');
  const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')) as { engines: Record<string, string> };
  const packageLock = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8')) as { lockfileVersion: number };
  const workflow = await readFile(join(root, '.github/workflows/test.yml'), 'utf8');
  expect(toolchain).toContain('channel = "stable"');
  expect(packageJson.engines).toEqual({ node: '22.x', npm: '>=10' });
  expect(packageLock.lockfileVersion).toBe(3);
  expect(workflow).toContain('dtolnay/rust-toolchain@stable');
  expect(workflow).toContain('node-version: 22');
});

test('@claim:test-coverage npm test includes Rust, claim, accessibility, desktop, and 390 px checks', async () => {
  const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')) as { scripts: Record<string, string> };
  const playwright = await readFile(join(root, 'playwright.config.ts'), 'utf8');
  const suite = `${await readFile(join(root, 'e2e/site.spec.ts'), 'utf8')}\n${await readFile(join(root, 'e2e/viewport-390.spec.ts'), 'utf8')}`;
  expect(packageJson.scripts.test).toBe('cargo test && npm run build:site && playwright test');
  expect(playwright).toContain("name: 'chromium'");
  expect(playwright).toContain("name: 'viewport-390'");
  expect(suite).toContain("from '@axe-core/playwright'");
  expect((suite.match(/@claim:/g) || []).length).toBeGreaterThanOrEqual(46);
});

test('@claim:site-build-output build:site writes the static index document', async () => {
  const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')) as { scripts: Record<string, string> };
  const buildScript = await readFile(join(root, 'scripts/build-site.mjs'), 'utf8');
  const builtIndex = await readFile(join(root, 'dist/site/index.html'), 'utf8');
  expect(packageJson.scripts['build:site']).toContain('vite build --config site/vite.config.ts');
  expect(buildScript).toContain("new URL('../dist/site/', import.meta.url)");
  expect(builtIndex).toContain('<div id="app"></div>');
});

test('@claim:deploy-directory dist/site contains the complete deployable static site', async () => {
  for (const path of [
    'index.html', 'demo/index.html', 'privacy/index.html', 'terms/index.html', '404.html',
    'staticwebapp.config.json', 'install.sh', 'install.ps1', 'robots.txt', 'sitemap.xml'
  ]) expect(await readFile(join(root, 'dist/site', path), 'utf8')).not.toHaveLength(0);
  const readme = await readFile(join(root, 'README.md'), 'utf8');
  expect(readme).toContain('The complete deployable static site is in `dist/site`.');
});

test('a cached invalid license keeps its inactive notice after reload', async ({ page }) => {
  let verificationRequests = 0;
  await page.route('https://api.sociobot.in/**', async route => {
    verificationRequests += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid', expires_at: null }) });
  });
  await page.goto('/?license=invalid-license');
  await expect(page.getByText('License no longer active. You can buy a new license.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('License no longer active. You can buy a new license.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download Team CI kit' })).toBeHidden();
  expect(verificationRequests).toBe(1);
});

test('routes update title, focus, and history', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Demo', exact: true }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page).toHaveTitle('Demo — Self-Host Upgrade Rehearsal');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle('Self-Host Upgrade Rehearsal — test upgrades first');
});

test('every application route updates its own title, description, canonical, and social metadata', async ({ page }) => {
  const cases = [
    ['/?demo=1', 'Demo — Self-Host Upgrade Rehearsal', 'Run the isolated Arbor Desk sample demo and inspect its customer-safe readiness receipt.', 'https://selfhost-upgrade-rehearsal.sociobot.in/?demo=1'],
    ['/privacy', 'Privacy — Self-Host Upgrade Rehearsal', 'See what the local CLI, browser demo, release lookup, and license check handle.', 'https://selfhost-upgrade-rehearsal.sociobot.in/privacy'],
    ['/terms', 'Terms — Self-Host Upgrade Rehearsal', 'Read the receipt limits, Team kit purchase terms, and operator responsibilities.', 'https://selfhost-upgrade-rehearsal.sociobot.in/terms']
  ] as const;
  for (const [path, title, description, canonical] of cases) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description);
  }
});

test('real 404 document has the common shell, recovery action, and complete metadata', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Self-Host Upgrade Rehearsal');
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Self-Host Upgrade Rehearsal home' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Privacy', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Terms', exact: true })).toBeVisible();
  await expect(page.getByText('v0.1.4 · build 2026.08.29')).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'This link does not point to a page in Self-Host Upgrade Rehearsal.');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://selfhost-upgrade-rehearsal.sociobot.in/404.html');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Page not found — Self-Host Upgrade Rehearsal');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
});

test('mobile navigation targets, empty-license feedback, and mobile downloads are safe', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only regression coverage');
  await page.goto('/');
  const targets = await page.locator('.site-header a, .site-footer nav a').evaluateAll(links => links.map(link => {
    const rect = link.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }));
  expect(targets.every(target => target.width >= 44 && target.height >= 44)).toBe(true);
  expect(await page.locator('.plain-facts').evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
  await page.getByRole('button', { name: 'Verify license' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Paste a license token, then verify it.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Download rehearsal-/ })).toHaveCount(0);
  await expect(page.getByText('Install on macOS, Windows, or Linux.')).toBeVisible();
  await expect(page.getByText('No phone or tablet package is provided.')).toBeVisible();
});

test('built route documents prevent a navigation fallback from turning unknown paths into soft 404s', async () => {
  const config = JSON.parse(await readFile(join(root, 'site/public/staticwebapp.config.json'), 'utf8'));
  expect(config.navigationFallback).toBeUndefined();
  for (const route of ['demo', 'privacy', 'terms']) {
    const document = await readFile(join(root, 'dist/site', route, 'index.html'), 'utf8');
    expect(document).toContain('<div id="app"></div>');
    expect(document).toContain(`<title>${route[0].toUpperCase()}${route.slice(1)} — Self-Host Upgrade Rehearsal</title>`);
  }
  const missing = await readFile(join(root, 'dist/site/404.html'), 'utf8');
  for (const required of ['class="skip-link"', '<header class="site-header">', '<main id="main" tabindex="-1">', '<footer class="site-footer">', 'name="description"', 'property="og:title"', 'name="twitter:title"', 'rel="canonical"', 'rel="icon"']) {
    expect(missing).toContain(required);
  }
});
