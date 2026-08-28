import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const root = resolve(import.meta.dirname, '..');

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

test('@claim:demo-receipt demo shows and downloads a readiness receipt', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 2, name: 'Arbor Desk 1.8.4 → 2.0.0' })).toBeVisible();
  await expect(page.getByText('9 passed')).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download sample JSON' }).click();
  const file = await (await download).createReadStream();
  let text = '';
  for await (const chunk of file!) text += chunk.toString();
  expect(JSON.parse(text).status).toBe('ready');
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
  expect(shell.indexOf('sha256sum -c')).toBeLessThan(shell.indexOf('install -m 755'));
  expect(powershell.indexOf('Get-FileHash')).toBeLessThan(powershell.indexOf('Copy-Item'));
});

test('@claim:mit-core core CLI is MIT licensed', async () => {
  expect(await readFile(join(root, 'LICENSE'), 'utf8')).toContain('MIT License');
  expect(await readFile(join(root, 'Cargo.toml'), 'utf8')).toContain('license = "MIT"');
});

test('routes update title, focus, and history', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Demo', exact: true }).click();
  await expect(page).toHaveTitle('Demo — Self-Host Upgrade Rehearsal');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle('Self-Host Upgrade Rehearsal — test upgrades first');
});
