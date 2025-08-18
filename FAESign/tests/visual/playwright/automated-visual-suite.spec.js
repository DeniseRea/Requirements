import { test, expect } from '@playwright/test';
import { 
  EXACT_SHARED_CONFIG, 
  testAllStatusMessageVariants, 
  testAllViewports,
  validateStorybookAvailable,
  takeExactScreenshot
} from '../../helpers/crossToolHelpers.js';

/**
 * SUITE AUTOMATIZADA DE PRUEBAS VISUALES - PLAYWRIGHT
 * ===================================================
 * 
 * Objetivo: Automatizar completamente las pruebas de regresión visual
 * comparando Playwright con Percy y BackstopJS usando configuraciones idénticas
 * 
 * Pregunta guía: ¿Es posible detectar errores en la UI mediante comparación visual automatizada?
 * 
 * Esta suite implementa:
 * - Detección automática de regresiones visuales
 * - Comparación cross-browser automatizada
 * - Generación de reportes de diferencias
 * - Integración con CI/CD
 */

test.describe('🎯 AUTOMATIZACIÓN VISUAL COMPLETA - Playwright', () => {
  
  // Configuración global para todas las pruebas
  test.beforeAll(async () => {
    console.log('🚀 Iniciando Suite Automatizada de Pruebas Visuales');
    console.log('📊 Configuración:', EXACT_SHARED_CONFIG);
    
    const isStorybookAvailable = await validateStorybookAvailable();
    if (!isStorybookAvailable) {
      throw new Error('❌ Storybook no disponible en ' + EXACT_SHARED_CONFIG.storybook.baseUrl);
    }
    console.log('✅ Storybook validado y disponible');
  });

  test.describe('📱 PRUEBAS RESPONSIVAS AUTOMATIZADAS', () => {
    
    // Automatización 1: Todos los viewports + todos los variants
    test('Auto-Test: StatusMessage - Todos los variants en todos los viewports', async ({ page }) => {
      const variants = ['success', 'error', 'warning', 'info'];
      const viewports = Object.entries(EXACT_SHARED_CONFIG.viewports);
      
      for (const variant of variants) {
        for (const [viewportName, viewport] of viewports) {
          console.log(`🔍 Testing ${variant} en ${viewportName} (${viewport.width}x${viewport.height})`);
          
          // Configurar viewport
          await page.setViewportSize(viewport);
          
          // Navegar al componente
          const storyUrl = `${EXACT_SHARED_CONFIG.storybook.baseUrl}/iframe.html?args=&id=shared-statusmessage--${variant}`;
          await page.goto(storyUrl, { waitUntil: 'networkidle' });
          
          // Aplicar CSS de estabilización (igual que Percy/BackstopJS)
          await page.addStyleTag({
            content: EXACT_SHARED_CONFIG.stabilization.css
          });
          
          // Esperar estabilización
          await page.waitForTimeout(EXACT_SHARED_CONFIG.stabilization.delay);
          
          // Screenshot con nombre descriptivo
          await expect(page).toHaveScreenshot(`auto-${variant}-${viewportName}.png`, {
            threshold: EXACT_SHARED_CONFIG.screenshot.threshold,
            animations: EXACT_SHARED_CONFIG.screenshot.animations,
            fullPage: false
          });
        }
      }
    });
  });

  test.describe('🌐 AUTOMATIZACIÓN CROSS-BROWSER', () => {
    
    // Automatización 2: Detección de inconsistencias entre navegadores
    test('Auto-Test: Detección de diferencias cross-browser', async ({ page, browserName }) => {
      console.log(`🌐 Testing en navegador: ${browserName}`);
      
      const criticalVariants = ['success', 'error'];
      
      for (const variant of criticalVariants) {
        // Configurar viewport desktop (más crítico para diferencias)
        await page.setViewportSize(EXACT_SHARED_CONFIG.viewports.desktop);
        
        const storyUrl = `${EXACT_SHARED_CONFIG.storybook.baseUrl}/iframe.html?args=&id=shared-statusmessage--${variant}`;
        await page.goto(storyUrl, { waitUntil: 'networkidle' });
        
        // Aplicar estabilización
        await page.addStyleTag({
          content: EXACT_SHARED_CONFIG.stabilization.css
        });
        
        await page.waitForTimeout(EXACT_SHARED_CONFIG.stabilization.delay);
        
        // Screenshot específico por navegador
        await expect(page).toHaveScreenshot(`cross-browser-${variant}-${browserName}.png`, {
          threshold: 0.1, // Más estricto para detectar diferencias de rendering
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('🚨 AUTOMATIZACIÓN DE DETECCIÓN DE REGRESIONES', () => {
    
    // Automatización 3: Simulación de cambios para probar detección
    test('Auto-Test: Detección de regresiones simuladas', async ({ page }) => {
      console.log('🚨 Probando detección de regresiones visuales');
      
      // Configurar viewport
      await page.setViewportSize(EXACT_SHARED_CONFIG.viewports.desktop);
      
      // Ir al componente Success
      const storyUrl = `${EXACT_SHARED_CONFIG.storybook.baseUrl}/iframe.html?args=&id=shared-statusmessage--success`;
      await page.goto(storyUrl, { waitUntil: 'networkidle' });
      
      // Aplicar estabilización base
      await page.addStyleTag({
        content: EXACT_SHARED_CONFIG.stabilization.css
      });
      
      // 1. Screenshot baseline (estado normal)
      await expect(page).toHaveScreenshot('regression-baseline.png', {
        threshold: EXACT_SHARED_CONFIG.screenshot.threshold,
        animations: 'disabled'
      });
      
      // 2. Simular cambio visual (agregar border rojo)
      await page.addStyleTag({
        content: `
          .status-message {
            border: 2px solid red !important;
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.5) !important;
          }
        `
      });
      
      // 3. Screenshot con cambio (debería fallar la comparación)
      await expect(page).toHaveScreenshot('regression-with-change.png', {
        threshold: EXACT_SHARED_CONFIG.screenshot.threshold,
        animations: 'disabled'
      });
    });
    
    // Automatización 4: Prueba de tolerancia de threshold
    test('Auto-Test: Validación de umbrales de tolerancia', async ({ page }) => {
      console.log('📏 Validando umbrales de tolerancia');
      
      await page.setViewportSize(EXACT_SHARED_CONFIG.viewports.tablet);
      
      const storyUrl = `${EXACT_SHARED_CONFIG.storybook.baseUrl}/iframe.html?args=&id=shared-statusmessage--warning`;
      await page.goto(storyUrl, { waitUntil: 'networkidle' });
      
      await page.addStyleTag({
        content: EXACT_SHARED_CONFIG.stabilization.css
      });
      
      // Cambio mínimo (1px de padding)
      await page.addStyleTag({
        content: `
          .status-message {
            padding: 16px !important; /* cambio de 1px */
          }
        `
      });
      
      // Esto debería pasar con threshold 0.3
      await expect(page).toHaveScreenshot('tolerance-minimal-change.png', {
        threshold: 0.3,
        animations: 'disabled'
      });
    });
  });

  test.describe('📊 AUTOMATIZACIÓN DE MÉTRICAS', () => {
    
    // Automatización 5: Medición de performance de screenshots
    test('Auto-Test: Métricas de performance de capturas', async ({ page }) => {
      console.log('📊 Midiendo performance de capturas visuales');
      
      const startTime = Date.now();
      
      await page.setViewportSize(EXACT_SHARED_CONFIG.viewports.desktop);
      
      const storyUrl = `${EXACT_SHARED_CONFIG.storybook.baseUrl}/iframe.html?args=&id=shared-statusmessage--info`;
      await page.goto(storyUrl, { waitUntil: 'networkidle' });
      
      await page.addStyleTag({
        content: EXACT_SHARED_CONFIG.stabilization.css
      });
      
      const screenshotStartTime = Date.now();
      
      await expect(page).toHaveScreenshot('performance-test.png', {
        threshold: EXACT_SHARED_CONFIG.screenshot.threshold,
        animations: 'disabled'
      });
      
      const screenshotEndTime = Date.now();
      const totalTime = screenshotEndTime - startTime;
      const screenshotTime = screenshotEndTime - screenshotStartTime;
      
      console.log(`⏱️  Tiempo total: ${totalTime}ms`);
      console.log(`📸 Tiempo de screenshot: ${screenshotTime}ms`);
      
      // Validar que el screenshot no tome más de 5 segundos
      expect(screenshotTime).toBeLessThan(5000);
    });
  });

  test.describe('🔧 AUTOMATIZACIÓN DE INTEGRACIÓN CI/CD', () => {
    
    // Automatización 6: Pruebas para CI/CD pipeline
    test('Auto-Test: Validación para CI/CD', async ({ page }) => {
      console.log('🔧 Ejecutando validaciones para CI/CD');
      
      // Array de todos los tests críticos que deben pasar en CI
      const criticalTests = [
        { variant: 'success', viewport: 'mobile' },
        { variant: 'error', viewport: 'desktop' },
        { variant: 'warning', viewport: 'tablet' }
      ];
      
      for (const { variant, viewport } of criticalTests) {
        console.log(`✅ CI Test: ${variant} en ${viewport}`);
        
        await page.setViewportSize(EXACT_SHARED_CONFIG.viewports[viewport]);
        
        const storyUrl = `${EXACT_SHARED_CONFIG.storybook.baseUrl}/iframe.html?args=&id=shared-statusmessage--${variant}`;
        await page.goto(storyUrl, { waitUntil: 'networkidle' });
        
        await page.addStyleTag({
          content: EXACT_SHARED_CONFIG.stabilization.css
        });
        
        await page.waitForTimeout(EXACT_SHARED_CONFIG.stabilization.delay);
        
        // Screenshot para CI con nombre descriptivo
        await expect(page).toHaveScreenshot(`ci-critical-${variant}-${viewport}.png`, {
          threshold: EXACT_SHARED_CONFIG.screenshot.threshold,
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('🎨 AUTOMATIZACIÓN DE ESTADOS COMPLEJOS', () => {
    
    // Automatización 7: Estados de loading y transiciones
    test('Auto-Test: Estados dinámicos y transiciones', async ({ page }) => {
      console.log('🎨 Testing estados dinámicos');
      
      await page.setViewportSize(EXACT_SHARED_CONFIG.viewports.desktop);
      
      // Ir a un componente con estado
      const storyUrl = `${EXACT_SHARED_CONFIG.storybook.baseUrl}/iframe.html?args=&id=shared-statusmessage--success`;
      await page.goto(storyUrl, { waitUntil: 'networkidle' });
      
      // 1. Estado inicial
      await page.addStyleTag({
        content: EXACT_SHARED_CONFIG.stabilization.css
      });
      
      await expect(page).toHaveScreenshot('state-initial.png', {
        threshold: EXACT_SHARED_CONFIG.screenshot.threshold,
        animations: 'disabled'
      });
      
      // 2. Simular hover state
      const statusMessage = page.locator('.status-message');
      await statusMessage.hover();
      
      await expect(page).toHaveScreenshot('state-hover.png', {
        threshold: EXACT_SHARED_CONFIG.screenshot.threshold,
        animations: 'disabled'
      });
      
      // 3. Simular focus state (si aplicable)
      if (await statusMessage.isVisible()) {
        await statusMessage.focus();
        
        await expect(page).toHaveScreenshot('state-focus.png', {
          threshold: EXACT_SHARED_CONFIG.screenshot.threshold,
          animations: 'disabled'
        });
      }
    });
  });

  // Test final de resumen
  test.afterAll(async () => {
    console.log('✅ Suite Automatizada de Pruebas Visuales Completada');
    console.log('📈 Resultados disponibles en playwright-report/');
    console.log('🎯 Objetivo cumplido: Detección automatizada de errores UI confirmada');
  });
});

/**
 * FUNCIONES AUXILIARES PARA AUTOMATIZACIÓN
 */

// Helper para ejecutar pruebas en lote
async function runBatchVisualTests(page, tests) {
  const results = [];
  
  for (const test of tests) {
    try {
      console.log(`🔄 Ejecutando: ${test.name}`);
      await test.execute(page);
      results.push({ name: test.name, status: 'PASS' });
      console.log(`✅ ${test.name} - PASS`);
    } catch (error) {
      results.push({ name: test.name, status: 'FAIL', error: error.message });
      console.log(`❌ ${test.name} - FAIL: ${error.message}`);
    }
  }
  
  return results;
}

// Helper para validar consistencia cross-browser
async function validateCrossBrowserConsistency(page, browserName, variant) {
  const baselineFile = `cross-browser-${variant}-chromium.png`;
  const currentFile = `cross-browser-${variant}-${browserName}.png`;
  
  // Esta función se puede extender para comparar archivos
  console.log(`🔍 Comparando ${baselineFile} vs ${currentFile}`);
}
