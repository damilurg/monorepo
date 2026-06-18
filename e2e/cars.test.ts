import { test, expect } from '@playwright/test';

test.describe('Cars / VIN Decoder', () => {
  test('shows VIN input form', async ({ page }) => {
    await page.goto('/cars');

    await expect(page.getByTestId('vin-input')).toBeVisible();
    await expect(page.getByTestId('vin-submit')).toBeVisible();
  });

  test('decodes a valid VIN', async ({ page }) => {
    await page.goto('/cars');

    await page.getByTestId('vin-input').fill('1HGBH41JXMN109186');
    await page.getByTestId('vin-submit').click();

    await expect(page).toHaveURL('/cars/vin/1HGBH41JXMN109186');
    await expect(page.getByTestId('vehicle-make')).toBeVisible();
    await expect(page.getByTestId('vehicle-model')).toBeVisible();
    await expect(page.getByTestId('vehicle-year')).toBeVisible();
  });

  test('URL has uppercase VIN', async ({ page }) => {
    await page.goto('/cars');

    await page.getByTestId('vin-input').fill('1hgbh41jxmn109186');
    await page.getByTestId('vin-submit').click();

    await expect(page).toHaveURL('/cars/vin/1HGBH41JXMN109186');
  });
});
