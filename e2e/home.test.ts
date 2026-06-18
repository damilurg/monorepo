import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('shows all module cards', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /automotive portal/i })).toBeVisible();

    for (const name of ['Обменник', 'Блог', 'Контент', 'Погода', 'Авто']) {
      await expect(page.getByText(name)).toBeVisible();
    }
  });

  test('module cards link to correct routes', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Погода').click();
    await expect(page).toHaveURL(/\/weather/);
  });

  test('works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.getByText('Обменник')).toBeVisible();
  });
});
