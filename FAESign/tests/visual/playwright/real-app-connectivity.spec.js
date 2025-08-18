import { test, expect } from '@playwright/test';

test.describe('🚀 AUTOMATIZACIÓN REAL FAESIGN', () => {
  
  test('Verificar aplicación en puerto 5173', async ({ page }) => {
    console.log('🚀 Probando conectividad con aplicación real...');
    
    // Navegar a la aplicación real
    await page.goto('http://localhost:5173/');
    
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Verificar que la página responde
    const title = await page.title();
    console.log(`📄 Título detectado: ${title}`);
    
    // Tomar screenshot para evidencia
    await page.screenshot({ 
      path: 'test-results/real-app-basic-test.png',
      fullPage: true 
    });
    
    // Verificar que hay contenido en la página
    const bodyText = await page.textContent('body');
    expect(bodyText.length).toBeGreaterThan(0);
    
    console.log('✅ Aplicación real respondiendo correctamente en puerto 5173');
  });
  
  test('Verificar estructura básica de la aplicación', async ({ page }) => {
    console.log('🔍 Analizando estructura de la aplicación...');
    
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Buscar elementos comunes de una aplicación React
    const reactRoot = await page.locator('#root').count();
    const appDiv = await page.locator('[id*="app"], [class*="app"]').count();
    const headers = await page.locator('header, h1, h2').count();
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    
    console.log(`📊 Análisis de estructura:`);
    console.log(`   Root elements: ${reactRoot}`);
    console.log(`   App containers: ${appDiv}`);
    console.log(`   Headers: ${headers}`);
    console.log(`   Buttons: ${buttons}`);
    console.log(`   Links: ${links}`);
    
    // Verificar que hay elementos básicos
    expect(reactRoot + appDiv + headers).toBeGreaterThan(0);
    
    console.log('✅ Estructura básica verificada');
  });
});
