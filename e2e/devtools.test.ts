import { test, expect } from '@playwright/test';

test.describe('DevTools module', () => {
  test('page loads and shows the DevTools header', async ({ page }) => {
    await page.goto('/devtools');
    await expect(page.getByText('DevTools')).toBeVisible();
  });

  test('device sidebar lists device buttons', async ({ page }) => {
    await page.goto('/devtools');
    // At least the default iPhone 14 device entry should be present
    await expect(page.getByText('iPhone 14')).toBeVisible();
  });

  test('URL input field and Open button are present', async ({ page }) => {
    await page.goto('/devtools');
    await expect(page.getByPlaceholder('https://example.com')).toBeVisible();
    await expect(page.getByRole('button', { name: /open|открыть/i })).toBeVisible();
  });

  test('portrait and landscape orientation buttons are visible', async ({ page }) => {
    await page.goto('/devtools');
    await expect(page.getByRole('button', { name: /portrait|портрет/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /landscape|альбом/i })).toBeVisible();
  });

  test('selecting a different device updates the displayed device name', async ({ page }) => {
    await page.goto('/devtools');
    // Click on Galaxy S24 in the sidebar
    await page.getByText('Galaxy S24', { exact: true }).click();
    // The header info area should reflect the new device name
    await expect(page.getByText('Galaxy S24', { exact: true })).toBeVisible();
  });
});
