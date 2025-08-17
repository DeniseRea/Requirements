import { test } from '@playwright/test';
import { percySnapshot } from '@percy/playwright';
import { EXACT_SHARED_CONFIG } from '../../helpers/crossToolHelpers.js';

test.describe('Percy StatusMessage App Tests - Exact Conditions', () => {
  test.beforeEach(async ({ page }) => {
    // Apply shared stabilization CSS
    await page.addStyleTag({
      content: EXACT_SHARED_CONFIG.stabilizationCSS
    });
  });

  const viewports = Object.values(EXACT_SHARED_CONFIG.viewports);
  
  for (const viewport of viewports) {
    test(`StatusMessage Success at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:5173', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Wait for app to load and add test StatusMessage
      await page.waitForSelector('body', { timeout: 10000 });
      
      // Inject StatusMessage for testing
      await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.padding = '20px';
        container.innerHTML = `
          <div class="alert alert-success alert-dismissible" role="alert">
            <span class="status-message-content">¡Operación exitosa! El documento ha sido firmado correctamente.</span>
            <button type="button" class="btn-close" aria-label="Close"></button>
          </div>
        `;
        document.body.appendChild(container);
      });

      await page.waitForTimeout(750); // Same network timeout as config

      await percySnapshot(page, `StatusMessage Success - ${viewport.width}x${viewport.height}`, {
        widths: [viewport.width],
        minHeight: viewport.height
      });
    });

    test(`StatusMessage Error at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:5173', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      await page.waitForSelector('body', { timeout: 10000 });
      
      await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.padding = '20px';
        container.innerHTML = `
          <div class="alert alert-danger alert-dismissible" role="alert">
            <span class="status-message-content">Error: No se pudo procesar el documento. Verifique el formato e intente nuevamente.</span>
            <button type="button" class="btn-close" aria-label="Close"></button>
          </div>
        `;
        document.body.appendChild(container);
      });

      await page.waitForTimeout(750);

      await percySnapshot(page, `StatusMessage Error - ${viewport.width}x${viewport.height}`, {
        widths: [viewport.width],
        minHeight: viewport.height
      });
    });

    test(`StatusMessage Warning at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:5173', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      await page.waitForSelector('body', { timeout: 10000 });
      
      await page.evaluate(() => {
        const container = document.createElement('div');
        container.style.padding = '20px';
        container.innerHTML = `
          <div class="alert alert-warning alert-dismissible" role="alert">
            <span class="status-message-content">Advertencia: El documento será válido por 30 días únicamente.</span>
            <button type="button" class="btn-close" aria-label="Close"></button>
          </div>
        `;
        document.body.appendChild(container);
      });

      await page.waitForTimeout(750);

      await percySnapshot(page, `StatusMessage Warning - ${viewport.width}x${viewport.height}`, {
        widths: [viewport.width],
        minHeight: viewport.height
      });
    });
  }
});
