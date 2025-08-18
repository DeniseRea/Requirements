import { test, expect } from '@playwright/test';

test.describe('🚀 AUTOMATIZACIÓN REAL FAESIGN - DEBUG', () => {
  
  test('DEBUG: Verificar conectividad con aplicación real', async ({ page }) => {
    console.log('🔍 DEBUG: Iniciando prueba de conectividad...');
    
    try {
      // Navegar a la aplicación real en puerto 5173
      console.log('🌐 Navegando a http://localhost:5173/');
      await page.goto('http://localhost:5173/', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Verificar que la página responde
      const title = await page.title();
      console.log(`📄 Título detectado: "${title}"`);
      
      // Verificar contenido básico
      const bodyText = await page.textContent('body');
      console.log(`📝 Contenido detectado: ${bodyText.length} caracteres`);
      
      // Tomar screenshot de evidencia
      await page.screenshot({ 
        path: 'test-results/debug-real-app-connection.png',
        fullPage: true 
      });
      
      // Validar que hay contenido
      expect(bodyText.length).toBeGreaterThan(10);
      
      console.log('✅ DEBUG: Conectividad con aplicación real confirmada');
      
    } catch (error) {
      console.error('❌ DEBUG: Error en conectividad:', error.message);
      throw error;
    }
  });
  
  test('DEBUG: Analizar estructura de la aplicación', async ({ page }) => {
    console.log('🔍 DEBUG: Analizando estructura...');
    
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Verificar elementos básicos de React
    const rootDiv = await page.locator('#root').count();
    const appDiv = await page.locator('[class*="App"], [id*="app"]').count();
    const headers = await page.locator('h1, h2, h3, header').count();
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    const inputs = await page.locator('input').count();
    
    console.log('📊 Análisis de estructura:');
    console.log(`   Root element (#root): ${rootDiv}`);
    console.log(`   App containers: ${appDiv}`);
    console.log(`   Headers: ${headers}`);
    console.log(`   Buttons: ${buttons}`);
    console.log(`   Links: ${links}`);
    console.log(`   Inputs: ${inputs}`);
    
    // Verificar que hay elementos básicos de una aplicación web
    const totalElements = rootDiv + appDiv + headers + buttons + links;
    expect(totalElements).toBeGreaterThan(0);
    
    console.log('✅ DEBUG: Estructura analizada correctamente');
  });
  
  test('DEBUG: Prueba de responsividad básica', async ({ page }) => {
    console.log('🔍 DEBUG: Probando responsividad...');
    
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1280, height: 720 }
    ];
    
    for (const viewport of viewports) {
      console.log(`📱 Probando viewport ${viewport.name}: ${viewport.width}x${viewport.height}`);
      
      await page.setViewportSize({ 
        width: viewport.width, 
        height: viewport.height 
      });
      
      await page.goto('http://localhost:5173/');
      await page.waitForLoadState('networkidle');
      
      // Tomar screenshot para cada viewport
      await page.screenshot({ 
        path: `test-results/debug-${viewport.name}-${viewport.width}x${viewport.height}.png`,
        fullPage: true 
      });
      
      console.log(`✅ Screenshot tomado para ${viewport.name}`);
    }
    
    console.log('✅ DEBUG: Responsividad probada en todos los viewports');
  });
});
