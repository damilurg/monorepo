import { test, expect } from '@playwright/test';

test.describe('Exchange module', () => {
  test('redirects from /exchange to default base', async ({ page }) => {
    await page.goto('/exchange');
    await expect(page).toHaveURL(/\/exchange\/base\//);
  });

  test('shows rates for EUR base', async ({ page }) => {
    await page.goto('/exchange/base/eur');

    await expect(page.getByTestId('base-currency')).toBeVisible();
    await expect(page.getByTestId('rates-list')).toBeVisible();
  });

  test('converter calculates result', async ({ page }) => {
    await page.goto('/exchange/base/eur');

    const amountInput = page.getByTestId('converter-amount');
    await amountInput.fill('100');

    await expect(page.getByTestId('converter-result')).toBeVisible();
  });

  test('switching base currency changes URL', async ({ page }) => {
    await page.goto('/exchange/base/eur');

    await page.getByTestId('currency-btn-usd').click();
    await expect(page).toHaveURL(/\/exchange\/base\/usd/);
  });
});
