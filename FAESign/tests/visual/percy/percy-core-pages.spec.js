import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Percy Visual Tests - Core Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar el entorno para capturas consistentes
    await page.addStyleTag({
      content: `
        /* Percy CSS - Disable animations and hide dynamic content */
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
        
        /* Hide dynamic elements */
        .document-date,
        .user-timestamp,
        .document-id,
        .current-time,
        .last-updated {
          visibility: hidden !important;
        }
      `
    });
  });

  test('Percy - Homepage/Login Page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Tomar snapshot con Percy
    await percySnapshot(page, 'Homepage - Login Page');
  });

  test('Percy - Dashboard View', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Tomar snapshot del dashboard
    await percySnapshot(page, 'Dashboard - Main View');
  });

  test('Percy - Creator Dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/creador');
    await page.waitForLoadState('networkidle');
    
    await percySnapshot(page, 'Creator Dashboard');
  });

  test('Percy - Signer Dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/firmante');
    await page.waitForLoadState('networkidle');
    
    await percySnapshot(page, 'Signer Dashboard');
  });

  test('Percy - Admin Dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');
    await page.waitForLoadState('networkidle');
    
    await percySnapshot(page, 'Admin Dashboard');
  });

  test('Percy - Auditor Dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/auditor');
    await page.waitForLoadState('networkidle');
    
    await percySnapshot(page, 'Auditor Dashboard');
  });
});
