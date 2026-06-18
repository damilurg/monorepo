import { test, expect } from '@playwright/test';

test.describe('Content / Quotes', () => {
  test('shows default quotes list', async ({ page }) => {
    await page.goto('/content');

    await expect(page.getByTestId('quotes-list')).toBeVisible();
    await expect(page.getByTestId('quote-card').first()).toBeVisible();
  });

  test('search navigates to search URL', async ({ page }) => {
    await page.goto('/content');

    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('life');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/content\/search\/life/);
  });

  test('search results page shows filtered quotes', async ({ page }) => {
    await page.goto('/content/search/love');

    await expect(page.getByTestId('search-query')).toBeVisible();
    await expect(page.getByTestId('quotes-list')).toBeVisible();
  });
});
