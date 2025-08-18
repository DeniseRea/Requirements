import { test, expect } from '@playwright/test';

test.describe('🚀 AUTOMATIZACIÓN REAL FAESIGN - WORKING VERSION', () => {
  
  test('Landing Page - Aplicación Real Puerto 5173', async ({ page }) => {
    console.log('🔍 Iniciando test de aplicación real...');
    
    // Navegar a la aplicación real
    await page.goto('http://localhost:5173/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Verificar que carga correctamente
    const title = await page.title();
    console.log(`📄 Título: ${title}`);
    
    // Screenshot de evidencia
    await page.screenshot({ 
      path: 'test-results/real-app-working.png',
      fullPage: true 
    });
    
    // Verificar que hay contenido
    const bodyText = await page.textContent('body');
    expect(bodyText.length).toBeGreaterThan(10);
    
    console.log('✅ Aplicación real funcionando correctamente');
  });
  
  test('Responsividad - Mobile', async ({ page }) => {
    console.log('📱 Probando vista móvil...');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'test-results/real-app-mobile.png',
      fullPage: true 
    });
    
    console.log('✅ Vista móvil capturada');
  });
  
  test('Responsividad - Desktop', async ({ page }) => {
    console.log('🖥️ Probando vista desktop...');
    
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'test-results/real-app-desktop.png',
      fullPage: true 
    });
    
    console.log('✅ Vista desktop capturada');
  });
});
