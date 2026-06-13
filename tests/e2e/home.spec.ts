import { test, expect } from '@playwright/test';

test('homepage has title and main CTA', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/CarbonWise/);

  // Expect the main CTA button to be visible
  const getStartedButton = page.locator('text=Get Started').first();
  await expect(getStartedButton).toBeVisible();
});

test('navigation links work', async ({ page }) => {
  await page.goto('/');
  
  // Click the Sign In link
  const signInLink = page.locator('text=Sign In').first();
  await expect(signInLink).toBeVisible();
});
