import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const exec = promisify(execFile);
const base = 'https://selfhost-upgrade-rehearsal.sociobot.in';
const output = new URL('./live/', import.meta.url);
const { stdout } = await exec('git', ['rev-parse', 'HEAD']);
const expectedCommit = stdout.trim();
await mkdir(output, { recursive: true });

const browser = await chromium.launch();
const report = { checkedAt: new Date().toISOString(), base, expectedCommit, routes: [], checks: {} };
const routes = [
  ['landing', '/', 200],
  ['demo-query', '/?demo=1', 200],
  ['demo-route', '/demo', 200],
  ['privacy', '/privacy', 200],
  ['terms', '/terms', 200],
  ['not-found', '/repair-7-missing', 404]
];

try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
    for (const [name, path, expectedStatus] of routes) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      page.on('console', message => {
        if (message.type() === 'error' && !/Failed to load resource.*404/.test(message.text())) errors.push(message.text());
      });
      const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      const axe = await new AxeBuilder({ page }).analyze();
      const state = await page.evaluate(() => ({
        title: document.title,
        lang: document.documentElement.lang,
        h1: document.querySelectorAll('h1').length,
        main: document.querySelectorAll('main').length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        missingAlt: [...document.querySelectorAll('img')].filter(image => !image.hasAttribute('alt')).length
      }));
      const seriousCriticalAxe = axe.violations
        .filter(item => ['serious', 'critical'].includes(item.impact || ''))
        .map(item => item.id);
      report.routes.push({ viewport: viewport.name, name, path, status: response?.status(), expectedStatus, ...state, seriousCriticalAxe, errors });
      assert.equal(response?.status(), expectedStatus, `${viewport.name} ${path} status`);
      assert.equal(state.lang, 'en', `${viewport.name} ${path} lang`);
      assert.equal(state.h1, 1, `${viewport.name} ${path} h1`);
      assert.equal(state.main, 1, `${viewport.name} ${path} main`);
      assert.equal(state.overflow, false, `${viewport.name} ${path} overflow`);
      assert.equal(state.missingAlt, 0, `${viewport.name} ${path} image alt`);
      assert.deepEqual(seriousCriticalAxe, [], `${viewport.name} ${path} Axe`);
      assert.deepEqual(errors, [], `${viewport.name} ${path} console`);
      if (viewport.name === 'mobile') {
        await page.screenshot({ path: new URL(`${name}-390.png`, output).pathname, fullPage: true });
      }
      await context.close();
    }
  }

  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(`${base}/`);
    await page.keyboard.press('Tab');
    const skip = await page.locator('.skip-link').evaluate(element => {
      const style = getComputedStyle(element);
      return {
        focused: document.activeElement === element,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineColor: style.outlineColor
      };
    });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(50);
    const mainFocused = await page.locator('main').evaluate(element => document.activeElement === element);
    const reducedMotion = await page.locator('.ruled-section').first().evaluate(element => ({
      animationDuration: getComputedStyle(element).animationDuration,
      transitionDuration: getComputedStyle(element).transitionDuration,
      runningAnimations: document.getAnimations().filter(animation => animation.playState === 'running').length
    }));
    assert.equal(skip.focused, true);
    assert.notEqual(skip.outlineStyle, 'none');
    assert.ok(Number.parseFloat(skip.outlineWidth) >= 3);
    assert.equal(mainFocused, true);
    assert.equal(reducedMotion.runningAnimations, 0);
    report.checks.keyboardAndMotion = { skip, mainFocused, reducedMotion };
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const requests = [];
    page.on('request', request => requests.push({ url: request.url(), method: request.method(), body: request.postData() }));
    await page.goto(`${base}/?demo=1`);
    await page.evaluate(() => {
      localStorage.setItem('real:project', 'keep');
      sessionStorage.setItem('real:session', 'keep');
    });
    const demoKeysBeforeReset = await page.evaluate(() => Object.keys(sessionStorage).filter(key => key.startsWith('demo:')));
    requests.length = 0;
    await page.getByRole('button', { name: 'Reset demo' }).click();
    await page.locator('#demo-terminal').getByText('READY', { exact: false }).waitFor();
    await context.setOffline(true);
    await page.getByRole('button', { name: 'Reset demo' }).click();
    await page.locator('#demo-terminal').getByText('READY', { exact: false }).waitFor();
    const demoState = await page.evaluate(async () => ({
      realProject: localStorage.getItem('real:project'),
      realSession: sessionStorage.getItem('real:session'),
      demoKeys: Object.keys(sessionStorage).filter(key => key.startsWith('demo:')),
      serviceWorkers: (await navigator.serviceWorker?.getRegistrations() || []).length
    }));
    const sameOriginBodyless = requests.every(request => new URL(request.url).origin === base && request.method === 'GET' && !request.body);
    assert.equal(sameOriginBodyless, true);
    assert.equal(demoState.realProject, 'keep');
    assert.equal(demoState.realSession, 'keep');
    assert.deepEqual(demoKeysBeforeReset, ['demo:active']);
    assert.deepEqual(demoState.demoKeys, []);
    assert.equal(demoState.serviceWorkers, 0);
    report.checks.offlinePrivacy = { sameOriginBodyless, requests, demoKeysBeforeReset, demoState };
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${base}/`);
    await page.getByText('Release v0.1.5 is ready for this device.').waitFor();
    const release = {
      note: await page.locator('#platform-note').textContent(),
      href: await page.locator('#platform-download').getAttribute('href')
    };
    assert.match(release.href || '', /releases\/download\/v0\.1\.5\//);
    report.checks.releaseUpdate = release;
    await context.close();
  }

  const identityResponse = await fetch(`${base}/release.json?verify=${Date.now()}`, { cache: 'no-store' });
  const identity = await identityResponse.json();
  assert.equal(identityResponse.status, 200);
  assert.equal(identityResponse.headers.get('cache-control'), 'no-store');
  assert.equal(identity.commit, expectedCommit);
  report.checks.releaseIdentity = { status: identityResponse.status, cacheControl: identityResponse.headers.get('cache-control'), ...identity };
} finally {
  await browser.close();
}

await writeFile(new URL('live-browser-audit.json', output), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
