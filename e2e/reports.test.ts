import { test, expect } from '@playwright/test';

test.describe('Reports module', () => {
  test('overview page loads and shows stat cards', async ({ page }) => {
    await page.goto('/reports');
    // The layout header shows the active page name
    await expect(page.getByText(/overview|обзор/i).first()).toBeVisible();
    // Stat cards rendered by the overview page
    await expect(page.getByText(/world population/i)).toBeVisible();
  });

  test('sidebar navigation is visible with all four tabs', async ({ page }) => {
    await page.goto('/reports');
    await expect(page.getByRole('link', { name: /overview|обзор/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /crypto|крипто/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /countries|страны/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /exchange|валюты/i })).toBeVisible();
  });

  test('navigating to /reports/crypto shows cryptocurrency data', async ({ page }) => {
    await page.goto('/reports/crypto');
    await expect(page.getByText(/total market cap/i)).toBeVisible();
    await expect(page.getByText(/btc dominance/i)).toBeVisible();
  });

  test('navigating to /reports/countries shows the countries table', async ({ page }) => {
    await page.goto('/reports/countries');
    // The table has a "Country" column header
    await expect(page.getByRole('columnheader', { name: /country/i })).toBeVisible();
  });

  test('navigating to /reports/exchange shows exchange rates', async ({ page }) => {
    await page.goto('/reports/exchange');
    // The exchange page header shows something about exchange rates
    await expect(page.getByText(/exchange rates|валюты/i).first()).toBeVisible();
  });
});
