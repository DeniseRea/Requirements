import { test, expect } from '@playwright/test';
import { setupVisualTest, waitForVisualStability } from '../../helpers/visualTestHelpers.js';
import { mockUsers } from '../../fixtures/mockData.js';

test.describe('Dashboard Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup consistent test environment
    await setupVisualTest(page, {
      viewport: { width: 1366, height: 768 },
      user: mockUsers[0], // María García - Creator role
      hideVolatile: true
    });
  });

  test('Login page renders correctly', async ({ page }) => {
    await page.goto('/');
    await waitForVisualStability(page);
    
    // Verify login page elements are visible
    await expect(page.locator('h1, .login-title')).toBeVisible();
    await expect(page.locator('input[type="email"], input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], .login-button')).toBeVisible();
    
    // Take screenshot for visual regression
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Dashboard loads after navigation', async ({ page }) => {
    await page.goto('/');
    await waitForVisualStability(page);
    
    // Try to navigate to dashboard (assuming direct navigation or mock auth)
    await page.goto('/dashboard');
    await waitForVisualStability(page);
    
    // Verify dashboard elements
    await expect(page.locator('.dashboard, #dashboard, [data-testid="dashboard"]')).toBeVisible();
    
    // Take screenshot
    await expect(page).toHaveScreenshot('dashboard-main.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Mobile viewport - Login page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await waitForVisualStability(page);
    
    await expect(page).toHaveScreenshot('login-page-mobile.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });
});
