import { test, expect } from '@playwright/test';

test.describe('Core E2E User Flows', () => {

  test('Navigation Layout and UI Modes load properly', async ({ page }) => {
    await page.goto('/');

    // Check Navigation
    await expect(page.getByRole('navigation', { name: 'Main Navigation' })).toBeVisible();

    // Check Theme Toggle
    const themeButton = page.getByRole('button', { name: 'Toggle dark mode' });
    await expect(themeButton).toBeVisible();
    
    // Toggle theme
    await themeButton.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('Protected Routes block unauthenticated users safely', async ({ page }) => {
    // Attempt to access a protected route without being logged in
    await page.goto('/dashboard');

    // Clerk should intercept and redirect to sign-in securely
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

});
