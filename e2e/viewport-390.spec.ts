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
  const missing = await targetSize('/404.html', 'Return to the upgrade kit');
  for (const target of [privacy, terms, missing]) {
    expect(target.width).toBeGreaterThanOrEqual(44);
    expect(target.height).toBeGreaterThanOrEqual(44);
  }
});
