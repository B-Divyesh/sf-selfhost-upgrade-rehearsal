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
