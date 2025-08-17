import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { setupVisualTest, waitForVisualStability } from '../../helpers/visualTestHelpers.js';
import { mockUsers } from '../../fixtures/mockData.js';

test.describe('Percy Visual Tests', () => {
  test('Percy - Login page snapshot', async ({ page }) => {
    await setupVisualTest(page);
    await page.goto('/');
    await waitForVisualStability(page);
    
    await percySnapshot(page, 'Login Page');
  });

  test('Percy - Dashboard snapshot', async ({ page }) => {
    await setupVisualTest(page, {
      user: mockUsers[0] // María García - Creator
    });
    
    await page.goto('/dashboard');
    await waitForVisualStability(page);
    
    await percySnapshot(page, 'Dashboard - Creator View');
  });

  test('Percy - Mobile login snapshot', async ({ page }) => {
    await setupVisualTest(page, {
      viewport: { width: 375, height: 667 }
    });
    
    await page.goto('/');
    await waitForVisualStability(page);
    
    await percySnapshot(page, 'Login Page - Mobile');
  });

  test('Percy - Tablet dashboard snapshot', async ({ page }) => {
    await setupVisualTest(page, {
      viewport: { width: 768, height: 1024 },
      user: mockUsers[2] // Ana López - Auditor
    });
    
    await page.goto('/dashboard');
    await waitForVisualStability(page);
    
    await percySnapshot(page, 'Dashboard - Tablet - Auditor View');
  });
});
