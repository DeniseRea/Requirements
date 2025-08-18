/**
 * 🚀 AUTOMATIZACIÓN FAESIGN - VERSIÓN FUNCIONAL
 * =============================================
 * 
 * Pruebas automatizadas estables para aplicación real FAESign
 * Probado y funcionando con localhost:5173
 */

import { test, expect } from '@playwright/test';
import { 
  waitForVisualStability, 
  FAESIGN_REAL_URLS,
  VISUAL_CONFIG 
} from '../../helpers/visualTestHelpers.js';

// Configuración base
const BASE_URL = 'http://localhost:5173';
const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 }
};

test.describe('🚀 AUTOMATIZACIÓN FAESIGN - APLICACIÓN REAL', () => {

  test.beforeEach(async ({ page }) => {
    console.log('\n🎯 INICIANDO PRUEBA DE APLICACIÓN REAL FAESIGN');
    console.log('======================================================================');
    console.log(`🌐 URL Base: ${BASE_URL}/`);
    console.log('🚫 NO usa Storybook - Solo aplicación real');
    console.log('📱 Viewports: mobile, tablet, desktop');
    console.log('🌍 Navegador: Chromium');
    
    // Validar que la aplicación esté corriendo
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      const title = await page.title();
      console.log(`✅ Aplicación real detectada: "${title}"`);
    } catch (error) {
      console.log('❌ ERROR: Aplicación no disponible en puerto 5173');
      throw new Error('Aplicación FAESign no está corriendo en localhost:5173');
    }
  });

  test('🏠 Landing Page - Validación Real', async ({ page }) => {
    console.log('\n🔍 Iniciando validación de landing page...');
    
    await page.goto(BASE_URL);
    await waitForVisualStability(page);
    
    // Verificar que la página principal cargó
    const title = await page.title();
    expect(title).toContain('FAESign');
    console.log(`📄 Título detectado: "${title}"`);
    
    // Verificar contenido básico
    const bodyText = await page.textContent('body');
    const hasContent = bodyText && bodyText.length > 100;
    expect(hasContent).toBeTruthy();
    console.log(`📝 Contenido detectado: ${bodyText?.length || 0} caracteres`);
    
    // Screenshot de la página real
    await expect(page).toHaveScreenshot('landing-page-real.png', {
      fullPage: true,
      animations: 'disabled'
    });
    
    console.log('✅ Landing page validada correctamente');
  });

  test('📱 Responsividad Mobile - Aplicación Real', async ({ page }) => {
    console.log('\n📱 Probando responsividad móvil...');
    
    // Configurar viewport móvil
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto(BASE_URL);
    await waitForVisualStability(page);
    
    // Analizar elementos en móvil
    const mobileAnalysis = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button').length;
      const links = document.querySelectorAll('a').length;
      const inputs = document.querySelectorAll('input').length;
      return { buttons, links, inputs };
    });
    
    console.log(`📊 Elementos móviles - Buttons: ${mobileAnalysis.buttons}, Links: ${mobileAnalysis.links}, Inputs: ${mobileAnalysis.inputs}`);
    
    // Screenshot móvil
    await expect(page).toHaveScreenshot('mobile-view-real.png', {
      animations: 'disabled'
    });
    
    console.log('✅ Vista móvil capturada y analizada');
  });

  test('🖥️ Responsividad Desktop - Aplicación Real', async ({ page }) => {
    console.log('\n🖥️ Probando responsividad desktop...');
    
    // Configurar viewport desktop
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto(BASE_URL);
    await waitForVisualStability(page);
    
    // Analizar elementos en desktop
    const desktopAnalysis = await page.evaluate(() => {
      const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
      const nav = document.querySelectorAll('nav').length;
      const forms = document.querySelectorAll('form').length;
      return { headers, nav, forms };
    });
    
    console.log(`📊 Elementos desktop - Headers: ${desktopAnalysis.headers}, Nav: ${desktopAnalysis.nav}, Forms: ${desktopAnalysis.forms}`);
    
    // Screenshot desktop
    await expect(page).toHaveScreenshot('desktop-view-real.png', {
      animations: 'disabled'
    });
    
    console.log('✅ Vista desktop capturada y analizada');
  });

  test('⚡ Performance - Aplicación Real', async ({ page }) => {
    console.log('\n⚡ Midiendo performance de aplicación real...');
    
    const startTime = Date.now();
    
    // Navegar y medir tiempo de carga
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await waitForVisualStability(page);
    
    const loadTime = Date.now() - startTime;
    console.log(`🚀 Tiempo de carga: ${loadTime}ms`);
    
    // Validar que cargó en tiempo razonable
    expect(loadTime).toBeLessThan(10000); // Menos de 10 segundos
    
    // Análisis de recursos
    const resourceAnalysis = await page.evaluate(() => {
      const images = document.querySelectorAll('img').length;
      const scripts = document.querySelectorAll('script').length;
      const links = document.querySelectorAll('link').length;
      return { images, scripts, links };
    });
    
    console.log(`📊 Recursos cargados - Images: ${resourceAnalysis.images}, Scripts: ${resourceAnalysis.scripts}, Links: ${resourceAnalysis.links}`);
    console.log(`✅ Performance medida: ${loadTime}ms`);
  });

  test('🔍 Estructura de Aplicación - Análisis Real', async ({ page }) => {
    console.log('\n🔍 Analizando estructura de la aplicación...');
    
    await page.goto(BASE_URL);
    await waitForVisualStability(page);
    
    // Análisis completo de la estructura
    const structureAnalysis = await page.evaluate(() => {
      const analysis = {
        rootElements: document.querySelectorAll('#root, #app, .app, main').length,
        containers: document.querySelectorAll('.container, .wrapper, .content').length,
        buttons: document.querySelectorAll('button').length,
        inputs: document.querySelectorAll('input, textarea, select').length,
        links: document.querySelectorAll('a').length,
        forms: document.querySelectorAll('form').length,
        images: document.querySelectorAll('img').length
      };
      return analysis;
    });
    
    console.log('📊 Análisis de estructura:');
    Object.entries(structureAnalysis).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    
    // Verificar que tiene estructura mínima
    expect(structureAnalysis.rootElements + structureAnalysis.containers).toBeGreaterThan(0);
    
    console.log('✅ Estructura analizada correctamente');
  });

  test('📸 Screenshots Comparativos - Múltiples Viewports', async ({ page }) => {
    console.log('\n📸 Capturando screenshots comparativos...');
    
    for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
      console.log(`📱 Capturando vista ${viewportName} (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize(viewport);
      await page.goto(BASE_URL);
      await waitForVisualStability(page);
      
      // Screenshot específico por viewport
      await expect(page).toHaveScreenshot(`faesign-${viewportName}-real.png`, {
        fullPage: true,
        animations: 'disabled'
      });
    }
    
    console.log('✅ Screenshots comparativos completados');
  });

});

test.describe('🎯 VALIDACIÓN FINAL - APLICACIÓN REAL', () => {
  
  test('🔗 Interacciones Básicas - Aplicación Real', async ({ page }) => {
    console.log('\n🔗 Probando interacciones básicas...');
    
    await page.goto(BASE_URL);
    await waitForVisualStability(page);
    
    // Buscar elementos interactivos
    const buttons = await page.locator('button').all();
    const links = await page.locator('a').all();
    
    console.log(`🎯 Encontrados ${buttons.length} botones y ${links.length} enlaces`);
    
    // Probar hover en primer botón si existe
    if (buttons.length > 0) {
      await buttons[0].hover();
      console.log('✅ Interacción hover exitosa');
    }
    
    // Screenshot final
    await expect(page).toHaveScreenshot('interactions-real.png', {
      animations: 'disabled'
    });
    
    console.log('✅ Interacciones básicas validadas');
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log('\n📈 REPORTE FINAL - APLICACIÓN REAL FAESIGN');
    console.log('======================================================================');
    
    if (testInfo.status === 'passed') {
      console.log('🎉 PRUEBA COMPLETADA CON ÉXITO');
    } else {
      console.log('❌ Prueba falló - revisar logs');
    }
    
    console.log('======================================================================');
  });

});
