import { test, expect } from '@playwright/test';

test.describe('Core User Journey', () => {
  test('should navigate to the homepage and render hero section', async ({ page }) => {
    await page.goto('/');
    // Check if the title has "Carbon" or something similar
    await expect(page).toHaveTitle(/Carbon|Wise/i);
    // Check for hero text
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('should redirect to sign-in when accessing protected dashboard route', async ({ page }) => {
    // Assuming /dashboard is protected by clerk
    await page.goto('/dashboard');
    // It should redirect to clerk sign-in page
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  test('skip to content link is present and works', async ({ page }) => {
    await page.goto('/');
    // The skip link should be in the DOM
    const skipLink = page.locator('text=Skip to content');
    // Initially visually hidden but exists
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
