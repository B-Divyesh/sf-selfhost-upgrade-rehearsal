import { test, expect } from '@playwright/test';

test('@regression:viewport-390 install layout stays within a 390 CSS-pixel viewport', async ({ page }) => {
  await page.goto('/');

  const layout = await page.locator('#install').evaluate(section => {
    const measured = ['.section-heading', '.install-card', '.usage-note'].map(selector => {
      const rect = section.querySelector(selector)!.getBoundingClientRect();
      return { selector, left: rect.left, right: rect.right, width: rect.width };
    });
    return {
      viewport: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      measured
    };
  });

  expect(layout.viewport).toBe(390);
  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewport);
  expect(layout.bodyWidth).toBeLessThanOrEqual(layout.viewport);
  for (const element of layout.measured) {
    expect(element.left, `${element.selector} should begin inside the viewport`).toBeGreaterThanOrEqual(0);
    expect(element.right, `${element.selector} should end inside the viewport`).toBeLessThanOrEqual(layout.viewport);
  }

  await page.getByRole('button', { name: 'Copy Windows install' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('.install-card pre')).toBeFocused();
  await expect(page.locator('.install-card pre')).toHaveAttribute('aria-label', 'Install command');
});

test('@regression:viewport-390 200 percent text resize keeps the landing header and action in view', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });

  const layout = await page.evaluate(() => {
    const rect = (selector: string) => {
      const box = document.querySelector(selector)!.getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
    };
    return {
      viewport: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      wordmark: rect('.wordmark'),
      navigation: rect('.site-header nav'),
      heading: rect('h1'),
      action: rect('.hero-action .button')
    };
  });

  expect(layout.viewport).toBe(390);
  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewport);
  expect(layout.bodyWidth).toBeLessThanOrEqual(layout.viewport);
  expect(layout.wordmark.bottom).toBeLessThanOrEqual(layout.navigation.top);
  for (const element of [layout.heading, layout.action]) {
    expect(element.left).toBeGreaterThanOrEqual(0);
    expect(element.right).toBeLessThanOrEqual(layout.viewport);
  }
});

test('@regression:viewport-390 legal contacts and the standalone 404 recovery link are 44px targets', async ({ page }) => {
  const targetSize = async (url: string, name: string) => {
    await page.goto(url);
    return page.getByRole('link', { name }).evaluate(link => {
      const box = link.getBoundingClientRect();
      return { width: box.width, height: box.height };
    });
  };

  const privacy = await targetSize('/privacy', 'privacy@sociobot.in');
  const terms = await targetSize('/terms', 'support@sociobot.in');
  const missing = await targetSize('/404.html', 'Return home');
  for (const target of [privacy, terms, missing]) {
    expect(target.width).toBeGreaterThanOrEqual(44);
    expect(target.height).toBeGreaterThanOrEqual(44);
  }
});

test('@regression:demo-banner-mobile demo disclosure and controls stay visible at the receipt', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: 'Download sample JSON' }).scrollIntoViewIfNeeded();

  const layout = await page.locator('.demo-banner').evaluate(banner => {
    const box = banner.getBoundingClientRect();
    const controls = Array.from(banner.querySelectorAll('button, a')).map(control => {
      const rect = control.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
    });
    return { position: getComputedStyle(banner).position, top: box.top, bottom: box.bottom, viewportHeight: innerHeight, controls };
  });

  expect(layout.position).toBe('sticky');
  expect(layout.top).toBeGreaterThanOrEqual(-1);
  expect(layout.bottom).toBeLessThanOrEqual(layout.viewportHeight);
  expect(layout.controls).toHaveLength(2);
  for (const control of layout.controls) {
    expect(control.top).toBeGreaterThanOrEqual(0);
    expect(control.bottom).toBeLessThanOrEqual(layout.viewportHeight);
    expect(control.width).toBeGreaterThanOrEqual(44);
    expect(control.height).toBeGreaterThanOrEqual(44);
  }
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Install the CLI' })).toBeVisible();
});
