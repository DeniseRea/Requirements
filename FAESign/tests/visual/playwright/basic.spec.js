import { test, expect } from '@playwright/test';

test.describe('🚀 APLICACIÓN REAL FAESIGN - Puerto 5173', () => {
  test.beforeEach(async ({ page }) => {
    // Disable animations and transitions for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
        
        /* Hide any dynamic content that might change */
        .current-time, .timestamp, .date {
          visibility: hidden !important;
        }
      `
    });
  });

  test('🏠 Landing Page - Aplicación Real', async ({ page }) => {
    console.log('🚀 DEPURACIÓN: Iniciando test de aplicación real en puerto 5173...');
    
    // Navegar a la aplicación real
    await page.goto('http://localhost:5173/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Verificar que carga correctamente
    const title = await page.title();
    console.log(`📄 Título detectado: "${title}"`);
    
    // Verificar que hay contenido en la página
    const bodyText = await page.textContent('body');
    console.log(`📝 Contenido detectado: ${bodyText.length} caracteres`);
    
    // Screenshot de evidencia
    await page.screenshot({ 
      path: 'test-results/real-app-working-debug.png',
      fullPage: true 
    });
    
    // Validar que hay contenido
    expect(bodyText.length).toBeGreaterThan(10);
    
    console.log('✅ DEPURACIÓN: Aplicación real funcionando correctamente en puerto 5173');
  });
  
  test('📱 Responsividad Mobile - Aplicación Real', async ({ page }) => {
    console.log('📱 DEPURACIÓN: Probando vista móvil...');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Análisis de estructura móvil
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    const inputs = await page.locator('input').count();
    
    console.log(`📊 Elementos móviles - Buttons: ${buttons}, Links: ${links}, Inputs: ${inputs}`);
    
    await page.screenshot({ 
      path: 'test-results/real-app-mobile-debug.png',
      fullPage: true 
    });
    
    console.log('✅ DEPURACIÓN: Vista móvil capturada y analizada');
  });
  
  test('🖥️ Responsividad Desktop - Aplicación Real', async ({ page }) => {
    console.log('🖥️ DEPURACIÓN: Probando vista desktop...');
    
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Análisis de estructura desktop
    const headers = await page.locator('h1, h2, h3, header').count();
    const navElements = await page.locator('nav, [role="navigation"]').count();
    const formElements = await page.locator('form').count();
    
    console.log(`📊 Elementos desktop - Headers: ${headers}, Nav: ${navElements}, Forms: ${formElements}`);
    
    await page.screenshot({ 
      path: 'test-results/real-app-desktop-debug.png',
      fullPage: true 
    });
    
    console.log('✅ DEPURACIÓN: Vista desktop capturada y analizada');
  });
});
