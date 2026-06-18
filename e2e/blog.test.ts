import { test, expect } from '@playwright/test';

test.describe('Blog module', () => {
  test('shows list of posts', async ({ page }) => {
    await page.goto('/blog');

    await expect(page.getByTestId('posts-list')).toBeVisible();
    const posts = page.getByTestId('post-card');
    await expect(posts.first()).toBeVisible();
  });

  test('navigates to post detail', async ({ page }) => {
    await page.goto('/blog');

    await page.getByTestId('post-card').first().click();
    await expect(page).toHaveURL(/\/blog\/post\/\d+/);
    await expect(page.getByTestId('post-title')).toBeVisible();
    await expect(page.getByTestId('post-body')).toBeVisible();
  });

  test('post detail shows comments', async ({ page }) => {
    await page.goto('/blog/post/1');

    await expect(page.getByTestId('comments-section')).toBeVisible();
    await expect(page.getByTestId('comment').first()).toBeVisible();
  });

  test('back link works', async ({ page }) => {
    await page.goto('/blog/post/1');

    await page.getByRole('link', { name: /назад/i }).click();
    await expect(page).toHaveURL('/blog');
  });
});
