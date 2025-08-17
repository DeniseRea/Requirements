import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { 
  EXACT_SHARED_CONFIG, 
  testAllStatusMessageVariants, 
  testAllViewports,
  validateStorybookAvailable 
} from '../../helpers/crossToolHelpers.js';

test.describe('Percy - StatusMessage (Using Exact Helper)', () => {
  
  test.beforeAll(async () => {
    // Validar que Storybook esté disponible
    const isStorybookAvailable = await validateStorybookAvailable();
    if (!isStorybookAvailable) {
      throw new Error('Storybook is not available at ' + EXACT_SHARED_CONFIG.storybook.baseUrl);
    }
  });

  test('Percy - All StatusMessage variants with exact helper', async ({ page }) => {
    await testAllStatusMessageVariants(page, async (page, variant) => {
      // Usar Percy snapshot con nombre consistente
      await percySnapshot(page, `StatusMessage - ${variant.name} - Exact Helper`);
    });
  });

  test('Percy - StatusMessage responsive with exact helper', async ({ page }) => {
    // Probar el variant LongMessage en todos los viewports
    await testAllViewports(page, 'longMessage', async (page, viewportName, viewport) => {
      await percySnapshot(page, `StatusMessage - LongMessage - ${viewportName} - Exact Helper`);
    });
  });

  test('Percy - StatusMessage Success across viewports', async ({ page }) => {
    // Probar el variant Success en todos los viewports
    await testAllViewports(page, 'success', async (page, viewportName, viewport) => {
      await percySnapshot(page, `StatusMessage - Success - ${viewportName} - Exact Helper`);
    });
  });

  test('Percy - StatusMessage Error state consistency', async ({ page }) => {
    // Probar específicamente el estado Error en desktop
    await page.setViewportSize(EXACT_SHARED_CONFIG.viewports.desktop);
    
    // Navegar al estado Error
    const errorStoryUrl = `${EXACT_SHARED_CONFIG.storybook.baseUrl}${EXACT_SHARED_CONFIG.storybook.statusMessageStories.error}`;
    await page.goto(errorStoryUrl);
    
    // Aplicar estabilización exacta
    await page.addStyleTag({ content: EXACT_SHARED_CONFIG.stabilizationCSS });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(EXACT_SHARED_CONFIG.timeouts.stabilization);
    
    // Tomar snapshot
    await percySnapshot(page, 'StatusMessage - Error - Desktop - Manual Config');
  });
});
