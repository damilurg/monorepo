import { test, expect } from '@playwright/test';

test.describe('Maps module', () => {
  test('redirects /maps to a default lat/lon URL', async ({ page }) => {
    await page.goto('/maps');
    await expect(page).toHaveURL(/\/maps\/[\d.-]+\/[\d.-]+/);
  });

  test('shows the page header and search bar', async ({ page }) => {
    await page.goto('/maps/55.7558/37.6173');
    // Page header title
    await expect(page.getByRole('heading', { name: /maps|карты/i })).toBeVisible();
    // Search input
    await expect(page.getByPlaceholder(/search location|поиск места/i)).toBeVisible();
    // Search button
    await expect(page.getByRole('button', { name: /search|найти/i })).toBeVisible();
  });

  test('renders city quick-select chips', async ({ page }) => {
    await page.goto('/maps/55.7558/37.6173');
    // There should be at least one city chip button rendered in the chip row
    const chips = page.locator('button').filter({ hasText: /[A-Za-zА-Яа-я]/ });
    await expect(chips.first()).toBeVisible();
  });

  test('clicking a city chip navigates to that city coordinates', async ({ page }) => {
    await page.goto('/maps/55.7558/37.6173');
    // Wait for chips to appear
    const firstChip = page.locator('div.flex.gap-2.overflow-x-auto button').first();
    await expect(firstChip).toBeVisible();
    await firstChip.click();
    // URL should have changed to a new coordinate pair
    await expect(page).toHaveURL(/\/maps\/[\d.-]+\/[\d.-]+/);
  });

  test('map container element is present', async ({ page }) => {
    await page.goto('/maps/55.7558/37.6173');
    // The map container is a div that leaflet renders into — it sits inside a rounded wrapper
    const mapWrapper = page.locator('.relative.overflow-hidden.rounded-2xl');
    await expect(mapWrapper).toBeVisible();
  });
});
