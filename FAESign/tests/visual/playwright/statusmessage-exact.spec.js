import { test, expect } from '@playwright/test';
import { 
  EXACT_SHARED_CONFIG, 
  testAllStatusMessageVariants, 
  testAllViewports,
  validateStorybookAvailable,
  takeExactScreenshot
} from '../../helpers/crossToolHelpers.js';

test.describe('Playwright - StatusMessage (Using Exact Same Helper)', () => {
  
  test.beforeAll(async () => {
    // Validar que Storybook esté disponible
    const isStorybookAvailable = await validateStorybookAvailable();
    if (!isStorybookAvailable) {
      throw new Error('Storybook is not available at ' + EXACT_SHARED_CONFIG.storybook.baseUrl);
    }
  });

  test('Playwright - All StatusMessage variants with exact helper', async ({ page }) => {
    await testAllStatusMessageVariants(page, async (page, variant) => {
      // Usar Playwright screenshot con mismo helper que Percy
      await expect(page).toHaveScreenshot(`statusmessage-${variant.name}-playwright.png`, {
        threshold: EXACT_SHARED_CONFIG.screenshot.threshold,
        animations: EXACT_SHARED_CONFIG.screenshot.animations
      });
    });
  });

  test('Playwright - StatusMessage responsive with exact helper', async ({ page }) => {
    // Probar el variant LongMessage en todos los viewports (igual que Percy)
    await testAllViewports(page, 'longMessage', async (page, viewportName, viewport) => {
      await expect(page).toHaveScreenshot(`statusmessage-longmessage-${viewportName}-playwright.png`, {
        threshold: EXACT_SHARED_CONFIG.screenshot.threshold,
        animations: EXACT_SHARED_CONFIG.screenshot.animations
      });
    });
  });

  test('Playwright - StatusMessage Success across viewports', async ({ page }) => {
    // Probar el variant Success en todos los viewports (igual que Percy)
    await testAllViewports(page, 'success', async (page, viewportName, viewport) => {
      await expect(page).toHaveScreenshot(`statusmessage-success-${viewportName}-playwright.png`, {
        threshold: EXACT_SHARED_CONFIG.screenshot.threshold,
        animations: EXACT_SHARED_CONFIG.screenshot.animations
      });
    });
  });

  test('Playwright - StatusMessage Error state consistency', async ({ page }) => {
    // Probar específicamente el estado Error en desktop (igual que Percy)
    await page.setViewportSize(EXACT_SHARED_CONFIG.viewports.desktop);
    
    // Navegar al estado Error
    const errorStoryUrl = `${EXACT_SHARED_CONFIG.storybook.baseUrl}${EXACT_SHARED_CONFIG.storybook.statusMessageStories.error}`;
    await page.goto(errorStoryUrl);
    
    // Aplicar estabilización exacta (igual que Percy)
    await page.addStyleTag({ content: EXACT_SHARED_CONFIG.stabilizationCSS });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(EXACT_SHARED_CONFIG.timeouts.stabilization);
    
    // Tomar screenshot
    await expect(page).toHaveScreenshot('statusmessage-error-desktop-manual-playwright.png', {
      threshold: EXACT_SHARED_CONFIG.screenshot.threshold,
      animations: EXACT_SHARED_CONFIG.screenshot.animations
    });
  });

  test('Playwright - Component accessibility check', async ({ page }) => {
    // Test adicional para verificar accesibilidad del componente
    await testAllStatusMessageVariants(page, async (page, variant) => {
      // Verificar que el componente sea visible
      const component = page.locator('.status-message');
      await expect(component).toBeVisible();
      
      // Verificar que tenga el texto correcto según la story
      const expectedMessages = {
        success: 'Documento subido correctamente',
        error: 'Error al procesar el documento',
        warning: 'El documento requiere firma adicional',
        info: 'Documento enviado para revisión',
        withoutCloseButton: 'Mensaje sin botón de cierre',
        longMessage: 'Este es un mensaje muy largo'
      };
      
      if (expectedMessages[variant.name]) {
        await expect(component).toContainText(expectedMessages[variant.name]);
      }
    });
  });
});
