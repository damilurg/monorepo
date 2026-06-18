import { test, expect } from '@playwright/test';

test.describe('Weather module', () => {
  test('redirects from /weather to default city', async ({ page }) => {
    await page.goto('/weather');
    await expect(page).toHaveURL(/\/weather\/city\//);
  });

  test('shows weather for Moscow', async ({ page }) => {
    await page.goto('/weather/city/moscow');

    await expect(page.getByTestId('city-name')).toBeVisible();
    await expect(page.getByTestId('temperature')).toBeVisible();
    await expect(page.getByTestId('forecast')).toBeVisible();
  });

  test('can switch to another city', async ({ page }) => {
    await page.goto('/weather/city/moscow');

    const cityChip = page.getByTestId('city-chip').first();
    await cityChip.click();

    await expect(page).toHaveURL(/\/weather\/city\//);
  });

  test('shows error state for invalid city', async ({ page }) => {
    await page.goto('/weather/city/xyzinvalidcity12345');
    await expect(page.getByTestId('error-state')).toBeVisible();
  });

  test('city URL is lowercase', async ({ page }) => {
    await page.goto('/weather/city/Paris');
    const url = page.url();
    expect(url.toLowerCase()).toContain('/weather/city/');
  });
});
