import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

const STORYBOOK_URL = 'http://localhost:6006';

test.describe('Percy - StatusMessage (Exact same conditions as Playwright)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Aplicar la misma estabilización CSS que Playwright
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
        
        /* Estabilizar elementos de Storybook */
        .sb-show-main, .sb-main-padded {
          background: white !important;
        }
      `
    });
  });

  test('Percy - StatusMessage All variants (exact stories)', async ({ page }) => {
    // Success Story - Exactamente igual que Playwright
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=shared-statusmessage--success`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await percySnapshot(page, 'StatusMessage - Success State');

    // Error Story - Exactamente igual que Playwright
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=shared-statusmessage--error`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await percySnapshot(page, 'StatusMessage - Error State');

    // Warning Story - Exactamente igual que Playwright
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=shared-statusmessage--warning`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await percySnapshot(page, 'StatusMessage - Warning State');

    // Info Story - Exactamente igual que Playwright
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=shared-statusmessage--info`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await percySnapshot(page, 'StatusMessage - Info State');

    // Without Close Button Story - Exactamente igual que Playwright
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=shared-statusmessage--without-close-button`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await percySnapshot(page, 'StatusMessage - Without Close Button');

    // Long Message Story (Responsive test) - Exactamente igual que Playwright
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=shared-statusmessage--long-message`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await percySnapshot(page, 'StatusMessage - Long Message');
  });

  test('Percy - StatusMessage Multi-viewport (identical to Playwright)', async ({ page }) => {
    // Usar exactamente los mismos viewports que Playwright
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },    // Mismo que Playwright
      { width: 768, height: 1024, name: 'Tablet' },   // Mismo que Playwright  
      { width: 1280, height: 720, name: 'Desktop' }   // Mismo que Playwright
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Test LongMessage para responsive - igual configuración que Playwright
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=shared-statusmessage--long-message`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await percySnapshot(page, `StatusMessage - Long Message - ${viewport.name}`);

      // Test Success state en diferentes viewports
      await page.goto(`${STORYBOOK_URL}/iframe.html?id=shared-statusmessage--success`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await percySnapshot(page, `StatusMessage - Success - ${viewport.name}`);
    }
  });
});
