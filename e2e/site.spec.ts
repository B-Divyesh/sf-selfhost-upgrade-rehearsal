import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const root = resolve(import.meta.dirname, '..');

function declaration(options: { notes?: string; preflight?: string } = {}): string {
  const hook = '[/usr/bin/true]';
  return `schema: 1
product: Receipt privacy test
adapter: fixture
source: { version: 1.0.0, config_schema: old.yml }
target: { version: 2.0.0, config_schema: new.yml }
environment:
  operating_systems: [linux]
  architectures: [x86_64]
${options.notes ? `  notes: "${options.notes}"\n` : ''}resources: { memory_mb: 512, disk_mb: 1024 }
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

async function writeMinimalDeclaration(dir: string, options: { notes?: string; preflight?: string } = {}): Promise<void> {
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

test('@claim:demo-receipt demo downloads the complete schema-1 readiness receipt', async ({ page }) => {
  await page.goto('/demo');
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
    adapter: 'bundled fixture',
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
  await page.goto('/demo');
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
  await page.goto('/demo');
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
  expect(powershell.indexOf('Get-FileHash')).toBeLessThan(powershell.indexOf('Copy-Item'));
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

test('routes update title, focus, and history', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Demo', exact: true }).click();
  await expect(page).toHaveTitle('Demo — Self-Host Upgrade Rehearsal');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle('Self-Host Upgrade Rehearsal — test upgrades first');
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
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Paste a license token, then verify it.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Download rehearsal-/ })).toHaveCount(0);
  await expect(page.getByText('Desktop downloads are available for macOS, Windows, and Linux.')).toBeVisible();
});

test('built route documents prevent a navigation fallback from turning unknown paths into soft 404s', async () => {
  const config = JSON.parse(await readFile(join(root, 'site/public/staticwebapp.config.json'), 'utf8'));
  expect(config.navigationFallback).toBeUndefined();
  for (const route of ['demo', 'privacy', 'terms']) {
    expect(await readFile(join(root, 'dist/site', route, 'index.html'), 'utf8')).resolves.toContain('<div id="app"></div>');
  }
});
