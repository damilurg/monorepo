import { test, expect } from '@playwright/test';

test.describe('Admin module', () => {
  test('visiting /admin redirects to the login page', async ({ page }) => {
    await page.goto('/admin');
    // Should land on /admin/login (or stay at /admin if login is inline)
    await expect(page).toHaveURL(/\/admin(\/login)?/);
    await expect(page.getByRole('heading', { name: /admin panel/i })).toBeVisible();
  });

  test('login page shows password field and submit button', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByLabel(/пароль/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /войти/i })).toBeVisible();
  });

  test('wrong password shows an error message', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel(/пароль/i).fill('wrongpassword');
    await page.getByRole('button', { name: /войти/i }).click();
    // Should stay on login and surface an error
    await expect(page).toHaveURL(/\/admin(\/login)?/);
    // The form action returns form.error which is rendered as a <p>
    await expect(page.locator('p.text-red-400')).toBeVisible();
  });

  test('login page has a back-to-home link', async ({ page }) => {
    await page.goto('/admin/login');
    const homeLink = page.getByRole('link', { name: /на главную/i });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute('href', '/');
  });
});
