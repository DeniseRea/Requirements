import { test } from '@playwright/test';

// Mock Percy para desarrollo local sin token
const mockPercySnapshot = async (page, name, options = {}) => {
  console.log(`📸 Percy Snapshot: ${name}`);
  
  // Tomar screenshot local para comparación
  await page.screenshot({
    path: `percy-screenshots/${name.replace(/[^a-zA-Z0-9]/g, '-')}.png`,
    fullPage: true,
    animations: 'disabled'
  });
};

test.describe('Percy Local Demo - Core Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Crear directorio para screenshots si no existe
    await page.addInitScript(() => {
      console.log('Percy Local Mode: Capturing screenshots locally');
    });

    // Configurar entorno estable
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
        .timestamp, .date, .current-time { visibility: hidden !important; }
      `
    });
  });

  test('Percy Local - Homepage/Login Page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    await mockPercySnapshot(page, 'Homepage - Login Page');
  });

  test('Percy Local - Dashboard View', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    
    await mockPercySnapshot(page, 'Dashboard - Main View');
  });

  test('Percy Local - Creator Dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/creador');
    await page.waitForLoadState('networkidle');
    
    await mockPercySnapshot(page, 'Creator Dashboard');
  });

  test('Percy Local - Responsive Mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    await mockPercySnapshot(page, 'Mobile - Homepage');
  });

  test('Percy Local - Responsive Tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    
    await mockPercySnapshot(page, 'Tablet - Dashboard');
  });
});
