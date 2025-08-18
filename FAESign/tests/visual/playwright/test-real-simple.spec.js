import { test, expect } from '@playwright/test';

test.describe('Prueba Simple Real App', () => {
  test('Verificar landing page FAESign', async ({ page }) => {
    console.log('🚀 Iniciando prueba de landing page...');
    
    await page.goto('http://localhost:5174/');
    
    // Esperar a que la página cargue
    await page.waitForLoadState('networkidle');
    
    // Verificar título
    const title = await page.title();
    console.log(`📄 Título de página: ${title}`);
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test-results/real-app-landing.png',
      fullPage: true 
    });
    
    console.log('✅ Prueba completada');
  });
});
