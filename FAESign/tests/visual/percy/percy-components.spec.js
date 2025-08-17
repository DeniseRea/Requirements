import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Percy Visual Tests - Components & States', () => {
  test.beforeEach(async ({ page }) => {
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
        .timestamp, .date, .document-id { visibility: hidden !important; }
      `
    });
  });

  test('Percy - Document Upload Modal', async ({ page }) => {
    await page.goto('http://localhost:5173/creador');
    await page.waitForLoadState('networkidle');
    
    // Intentar abrir modal de carga de documentos (si existe botón)
    const uploadButton = page.locator('button:has-text("Subir"), button:has-text("Upload"), .upload-btn, #upload-btn');
    
    if (await uploadButton.first().isVisible()) {
      await uploadButton.first().click();
      await page.waitForTimeout(500);
      
      await percySnapshot(page, 'Document Upload Modal - Open');
    } else {
      // Si no hay modal, capturar el dashboard del creador
      await percySnapshot(page, 'Creator Dashboard - No Modal');
    }
  });

  test('Percy - Document Preview States', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Buscar tarjetas de documentos con diferentes estados
    const documentCards = page.locator('.document-card, .card, .document-item');
    
    if (await documentCards.first().isVisible()) {
      await percySnapshot(page, 'Document Cards - Various States');
    } else {
      await percySnapshot(page, 'Dashboard - Empty State');
    }
  });

  test('Percy - Navigation States', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Capturar la navegación principal
    await percySnapshot(page, 'Navigation - Main Menu');
    
    // Si hay menú móvil, intentar abrirlo
    const mobileMenuButton = page.locator('.navbar-toggler, .menu-toggle, .hamburger');
    
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(300);
      await percySnapshot(page, 'Navigation - Mobile Menu Open');
    }
  });

  test('Percy - Form States', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Capturar formulario de login en estado inicial
    await percySnapshot(page, 'Login Form - Initial State');
    
    // Llenar campos si existen
    const emailInput = page.locator('input[type="email"], input[name="email"], #email');
    const passwordInput = page.locator('input[type="password"], input[name="password"], #password');
    
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      
      await percySnapshot(page, 'Login Form - Filled State');
    }
  });

  test('Percy - Error States', async ({ page }) => {
    await page.goto('http://localhost:5173/nonexistent-page');
    await page.waitForLoadState('networkidle');
    
    // Capturar página 404 o error
    await percySnapshot(page, '404 Error Page');
  });
});
