import { test, expect } from '@playwright/test';

test.describe('Bank module', () => {
  test('landing page loads and shows the hero heading', async ({ page }) => {
    await page.goto('/bank');
    await expect(page.getByRole('heading', { name: /banking that works/i })).toBeVisible();
  });

  test('hero section has Get Started CTA linking to /bank/dashboard', async ({ page }) => {
    await page.goto('/bank');
    const cta = page.getByRole('link', { name: /get started free/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/bank/dashboard');
  });

  test('features section is visible with at least one feature card', async ({ page }) => {
    await page.goto('/bank');
    await expect(page.getByRole('heading', { name: /everything you need/i })).toBeVisible();
    // Each feature card has an h3
    const featureHeadings = page.getByRole('heading', { name: /instant transfers/i });
    await expect(featureHeadings).toBeVisible();
  });

  test('pricing section shows three plans', async ({ page }) => {
    await page.goto('/bank');
    await expect(page.getByRole('heading', { name: /simple, transparent pricing/i })).toBeVisible();
    // Three plan name headings: Free, Pro, Business
    await expect(page.getByRole('heading', { name: 'Free' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pro' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Business' })).toBeVisible();
  });

  test('testimonials section renders customer quotes', async ({ page }) => {
    await page.goto('/bank');
    await expect(page.getByRole('heading', { name: /loved by millions/i })).toBeVisible();
    // At least one testimonial card shows a star rating
    await expect(page.locator('text=⭐⭐⭐⭐⭐').first()).toBeVisible();
  });
});
