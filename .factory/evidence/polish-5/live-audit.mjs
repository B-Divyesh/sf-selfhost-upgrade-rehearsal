import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = 'https://selfhost-upgrade-rehearsal.sociobot.in';
const output = new URL('./live/', import.meta.url);
await mkdir(output, { recursive: true });

const browser = await chromium.launch();
const report = { checked_at: new Date().toISOString(), base, routes: [], checks: {} };
const routes = [
  ['landing', '/', 200],
  ['demo-query', '/?demo=1', 200],
  ['demo-route', '/demo', 200],
  ['privacy', '/privacy', 200],
  ['terms', '/terms', 200],
  ['404', '/polish-5-cold-missing', 404]
];

for (const [name, path, expectedStatus] of routes) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => {
    if (message.type() === 'error' && !/Failed to load resource.*404/.test(message.text())) errors.push(message.text());
  });
  const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page }).analyze();
  const route = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    lang: document.documentElement.lang,
    h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length,
    header: document.querySelectorAll('header').length,
    footer: document.querySelectorAll('footer').length,
    privacy: [...document.querySelectorAll('a')].some(link => link.textContent?.trim() === 'Privacy'),
    terms: [...document.querySelectorAll('a')].some(link => link.textContent?.trim() === 'Terms'),
    overflow: document.documentElement.scrollWidth > innerWidth
  }));
  await page.screenshot({ path: new URL(`${name}-390.png`, output).pathname, fullPage: true });
  report.routes.push({
    name,
    path,
    status: response?.status(),
    expectedStatus,
    ...route,
    seriousCriticalAxe: axe.violations.filter(item => ['serious', 'critical'].includes(item.impact || '')).map(item => item.id),
    errors
  });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests = [];
  page.on('request', request => requests.push({ url: request.url(), method: request.method(), body: request.postData() }));
  await page.goto(`${base}/`);
  const firstScreen = await page.evaluate(() => ({
    heading: document.querySelector('h1')?.textContent?.trim(),
    action: document.querySelector('.hero-action .button')?.textContent?.trim(),
    actionHref: document.querySelector('.hero-action .button')?.getAttribute('href'),
    factCount: document.querySelectorAll('.plain-facts li').length,
    factsFit: [...document.querySelectorAll('.plain-facts li')].every(item => item.getBoundingClientRect().bottom <= innerHeight),
    overflow: document.documentElement.scrollWidth > innerWidth
  }));
  await page.evaluate(() => {
    localStorage.setItem('real:project', 'keep');
    sessionStorage.setItem('real:session', 'keep');
  });
  requests.length = 0;
  await page.goto(`${base}/?demo=1`);
  const storageAtEntry = await page.evaluate(() => ({
    realProject: localStorage.getItem('real:project'),
    realSession: sessionStorage.getItem('real:session'),
    demoKeys: Object.keys(sessionStorage).filter(key => key.startsWith('demo:'))
  }));
  await page.getByRole('button', { name: 'Download sample JSON' }).scrollIntoViewIfNeeded();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download sample JSON' }).click();
  const download = await downloadEvent;
  const stream = await download.createReadStream();
  let downloadText = '';
  for await (const chunk of stream) downloadText += chunk.toString();
  const downloadedReceipt = JSON.parse(downloadText);
  const banner = await page.locator('.demo-banner').evaluate(element => {
    const box = element.getBoundingClientRect();
    return { position: getComputedStyle(element).position, top: box.top, bottom: box.bottom, viewportHeight: innerHeight };
  });
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.locator('#demo-terminal').getByText('READY', { exact: false }).waitFor();
  await context.setOffline(false);
  const storageBeforeExit = await page.evaluate(() => ({
    realProject: localStorage.getItem('real:project'),
    realSession: sessionStorage.getItem('real:session'),
    demoKeys: Object.keys(sessionStorage).filter(key => key.startsWith('demo:'))
  }));
  await page.getByRole('link', { name: 'Install the CLI' }).click();
  const exit = await page.evaluate(() => ({
    url: location.href,
    focus: document.activeElement?.id,
    demoKeys: Object.keys(sessionStorage).filter(key => key.startsWith('demo:')),
    realProject: localStorage.getItem('real:project')
  }));
  await page.goto(`${base}/?demo=1`);
  await page.close();
  const reopened = await context.newPage();
  await reopened.goto(`${base}/`);
  const closeReopen = await reopened.evaluate(() => ({
    demoKeys: Object.keys(sessionStorage).filter(key => key.startsWith('demo:')),
    realProject: localStorage.getItem('real:project')
  }));
  report.checks.firstScreen = firstScreen;
  report.checks.demo = {
    banner,
    downloadedReceipt: {
      product: downloadedReceipt.product,
      source: downloadedReceipt.source_version,
      target: downloadedReceipt.target_version,
      status: downloadedReceipt.status,
      checks: downloadedReceipt.checks.length
    },
    storageAtEntry,
    storageBeforeExit,
    exit,
    closeReopen,
    requests: requests.map(item => ({ ...item, origin: new URL(item.url).origin })),
    onlySameOrigin: requests.every(item => new URL(item.url).origin === base && !item.body)
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/`);
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  const privacyFocus = await page.locator('h1').evaluate(element => document.activeElement === element);
  await page.goBack();
  const backFocus = await page.locator('h1').evaluate(element => document.activeElement === element);
  await page.getByRole('link', { name: 'Install', exact: true }).first().click();
  const install = await page.locator('#install').evaluate(element => ({ top: element.getBoundingClientRect().top, focus: document.activeElement?.id }));
  report.checks.navigation = { privacyFocus, backFocus, install, url: page.url() };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.route('https://api.github.com/repos/B-Divyesh/sf-selfhost-upgrade-rehearsal/releases/latest', route => route.fulfill({ status: 503, body: '{}' }));
  await page.goto(`${base}/`);
  await page.screenshot({ path: new URL('release-fallback-1440.png', output).pathname, fullPage: true });
  report.checks.releaseFallback = {
    label: await page.locator('#platform-download').textContent(),
    href: await page.locator('#platform-download').getAttribute('href'),
    note: await page.locator('#release-note').textContent()
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/`);
  await page.getByText('Release v0.1.4 is ready for this device.').waitFor();
  report.checks.currentRelease = {
    status: await page.locator('#platform-note').textContent(),
    label: await page.locator('#platform-download').textContent(),
    href: await page.locator('#platform-download').getAttribute('href'),
    source: await page.locator('#release-note').textContent()
  };
  await page.goto(`${base}/terms`);
  report.checks.commerce = {
    price: await page.getByText('The Team kit costs $79 as a one-time purchase.').textContent(),
    merchant: await page.getByText('Dodo Payments is the merchant of record. It handles order questions and returns.').textContent()
  };
  await context.close();
}

await browser.close();
await writeFile(new URL('live-browser-audit.json', output), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
