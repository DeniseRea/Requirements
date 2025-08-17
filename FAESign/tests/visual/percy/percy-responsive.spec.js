import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Percy Visual Tests - Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    // Configuración base para Percy
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
        .timestamp, .date, .current-time { visibility: hidden !important; }
      `
    });
  });

  test('Percy - Mobile Login (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    await percySnapshot(page, 'Mobile Login - iPhone', {
      widths: [375]
    });
  });

  test('Percy - Tablet Dashboard (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    
    await percySnapshot(page, 'Tablet Dashboard - iPad', {
      widths: [768]
    });
  });

  test('Percy - Desktop Dashboard (1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    
    await percySnapshot(page, 'Desktop Dashboard - Standard', {
      widths: [1280]
    });
  });

  test('Percy - Large Desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    
    await percySnapshot(page, 'Large Desktop Dashboard - Full HD', {
      widths: [1920]
    });
  });
});
