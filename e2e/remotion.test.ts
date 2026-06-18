import { test, expect } from '@playwright/test';

test.describe('Remotion module', () => {
  test('page loads and shows the Remotion heading', async ({ page }) => {
    await page.goto('/remotion');
    await expect(
      page.getByRole('heading', { name: /remotion/i })
    ).toBeVisible();
  });

  test('composition selector panel is visible with grouped sections', async ({ page }) => {
    await page.goto('/remotion');
    // Group labels: Portal, Modules, Classic
    await expect(page.getByText(/portal/i).first()).toBeVisible();
    await expect(page.getByText(/classic/i).first()).toBeVisible();
  });

  test('Hello World composition is listed and can be selected', async ({ page }) => {
    await page.goto('/remotion');
    const helloWorld = page.getByRole('button', { name: /hello world/i });
    await expect(helloWorld).toBeVisible();
    await helloWorld.click();
    // After clicking the button should be highlighted (bg-indigo-600)
    await expect(helloWorld).toHaveClass(/bg-indigo-600/);
  });

  test('Generate video button is present', async ({ page }) => {
    await page.goto('/remotion');
    await expect(
      page.getByRole('button', { name: /generate video|сгенерировать видео/i })
    ).toBeVisible();
  });

  test('portal context cards link to their respective routes', async ({ page }) => {
    await page.goto('/remotion');
    // The portal context section should show module cards — check /exchange link
    const exchangeLink = page.getByRole('link', { name: /exchange|обменник/i });
    await expect(exchangeLink).toBeVisible();
    await expect(exchangeLink).toHaveAttribute('href', '/exchange');
  });
});
