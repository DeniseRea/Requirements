const { test, expect } = require('@playwright/test');

test('Prueba básica aplicación FAESign', async ({ page }) => {
  console.log('🚀 Iniciando prueba básica...');
  
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  
  const title = await page.title();
  console.log('Título:', title);
  
  await page.screenshot({ path: 'test-results/basic-test.png' });
  
  console.log('✅ Prueba básica completada');
});
