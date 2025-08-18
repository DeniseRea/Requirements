/**
 * Script ejecutado antes de cada escenario BackstopJS
 * Configuración completa compatible con multiserver - CommonJS + Puppeteer API
 */

module.exports = async (page, scenario, vp) => {
  console.log('BACKSTOP > onBefore: Setting up page for visual testing');
  console.log('SCENARIO > ' + scenario.label);
  console.log('VIEWPORT > ' + vp.label);
  
  // Configurar viewport (Puppeteer API)
  await page.setViewport({
    width: vp.width,
    height: vp.height
  });
  
  // Configurar user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 BackstopJS');
  
  // Aplicar CSS de estabilización global (compatible con Percy/Playwright)
  await page.evaluateOnNewDocument(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Deshabilitar animaciones globalmente */
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }
      
      /* Ocultar elementos dinámicos que cambian entre ejecuciones */
      .timestamp, .date-time, .current-time,
      [data-testid="timestamp"], [data-testid="current-time"],
      .document-date, .user-timestamp, .document-id, .last-updated {
        visibility: hidden !important;
      }
      
      /* Estabilizar carruseles y sliders */
      .carousel, .slider, .swiper {
        animation-play-state: paused !important;
      }
      
      /* Ocultar cursores parpadeantes */
      .cursor, .blink {
        opacity: 0 !important;
      }
    `;
    document.head.appendChild(style);
    
    // Mockear Date para consistencia (igual que Percy)
    const mockDate = new Date('2024-01-15T10:00:00Z');
    Date.now = () => mockDate.getTime();
  });
  
  // Esperar según el tipo de página (con más tiempo y fallbacks)
  if (scenario.url.includes('5173')) {
    // Frontend - intentar múltiples selectores
    try {
      await page.waitForSelector('#root, [data-testid="app-root"], main, .app', { timeout: 15000 });
      console.log('Frontend app root found');
    } catch (e) {
      console.log('Frontend root not found, trying body...');
      try {
        await page.waitForSelector('body', { timeout: 5000 });
        console.log('Frontend body found as fallback');
      } catch (e2) {
        console.log('Frontend page load failed, continuing anyway...');
      }
    }
  } else if (scenario.url.includes('6006')) {
    // Storybook - intentar múltiples selectores y esperar más tiempo
    try {
      await page.waitForSelector('#storybook-root, .sb-main-padded, [data-testid="story-root"], body', { timeout: 15000 });
      console.log('Storybook component loaded');
    } catch (e) {
      console.log('Storybook root not found, trying iframe content...');
      try {
        await page.waitForSelector('body', { timeout: 5000 });
        console.log('Storybook iframe body found as fallback');
      } catch (e2) {
        console.log('Storybook page load failed, continuing anyway...');
      }
    }
  } else if (scenario.url.includes('file://')) {
    // Página estática - esperar body
    try {
      await page.waitForSelector('body', { timeout: 5000 });
      console.log('Static page loaded');
    } catch (e) {
      console.log('Static page load timeout, continuing...');
    }
  }
  
  console.log('BACKSTOP > onBefore: Page setup completed');
};
