/**
 * HELPERS PARA AUTOMATIZACIÓN DE PRUEBAS VISUALES
 * ===============================================
 * 
 * Funciones auxiliares reutilizables para automatización completa
 * de pruebas de regresión visual con Playwright
 */

// Configuración estandardizada
export const VISUAL_CONFIG = {
  storybook: {
    baseUrl: 'http://localhost:6006',
    iframeUrl: 'http://localhost:6006/iframe.html'
  },
  app: {
    baseUrl: 'http://localhost:5173'
  },
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 }
  },
  browsers: ['chromium', 'firefox', 'webkit'],
  timeouts: {
    navigation: 30000,
    element: 10000,
    screenshot: 5000
  }
};

// CSS de estabilización universal
export const STABILIZATION_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }
  
  .timestamp, .date, .current-time, .loading, .spinner {
    visibility: hidden !important;
  }
  
  [class*="fade"], [class*="slide"], [class*="bounce"] {
    animation: none !important;
  }
  
  input, textarea, select {
    caret-color: transparent !important;
  }
  
  :focus {
    outline: none !important;
  }
`;

// StatusMessage variants para testing
export const STATUS_MESSAGE_VARIANTS = {
  success: {
    id: 'shared-statusmessage--success',
    story: 'shared-statusmessage--success',
    url: '/iframe.html?id=shared-statusmessage--success&viewMode=story',
    expectedText: 'Success',
    expectedColor: 'green'
  },
  error: {
    id: 'shared-statusmessage--error',
    story: 'shared-statusmessage--error', 
    url: '/iframe.html?id=shared-statusmessage--error&viewMode=story',
    expectedText: 'Error',
    expectedColor: 'red'
  },
  warning: {
    id: 'shared-statusmessage--warning',
    story: 'shared-statusmessage--warning',
    url: '/iframe.html?id=shared-statusmessage--warning&viewMode=story',
    expectedText: 'Warning',
    expectedColor: 'yellow'
  },
  info: {
    id: 'shared-statusmessage--info',
    story: 'shared-statusmessage--info',
    url: '/iframe.html?id=shared-statusmessage--info&viewMode=story',
    expectedText: 'Info',
    expectedColor: 'blue'
  }
};

// Páginas principales de FAESign para testing comprehensivo
export const FAESIGN_PAGES = {
  home: {
    url: '/',
    title: 'FAESign - Home',
    selector: 'main'
  },
  dashboard: {
    url: '/dashboard',
    title: 'FAESign - Dashboard', 
    selector: '.dashboard-container'
  },
  profile: {
    url: '/profile',
    title: 'FAESign - Profile',
    selector: '.profile-section'
  },
  documents: {
    url: '/documents',
    title: 'FAESign - Documents',
    selector: '.documents-list'
  }
};

/**
 * Wait for all images and fonts to load - MEJORADO
 * @param {Page} page - Playwright page object
 */
export async function waitForVisualStability(page) {
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  
  // Wait for all images to load
  await page.waitForFunction(() => {
    const images = Array.from(document.images);
    return images.every(img => img.complete);
  });
  
  // Wait for fonts to load
  await page.waitForFunction(() => document.fonts.ready);
  
  // Esperar a que las animaciones se estabilicen
  await page.waitForTimeout(1000);
}

/**
 * Validar que Storybook esté disponible
 */
export async function validateStorybookAvailable() {
  try {
    const response = await fetch(VISUAL_CONFIG.storybook.baseUrl);
    return response.ok;
  } catch (error) {
    console.error('Storybook no disponible:', error.message);
    return false;
  }
}

/**
 * Validar que el servidor de desarrollo esté disponible
 */
export async function validateDevServerAvailable() {
  try {
    const response = await fetch(VISUAL_CONFIG.app.baseUrl);
    return response.ok;
  } catch (error) {
    console.error('Servidor de desarrollo no disponible:', error.message);
    return false;
  }
}

/**
 * Aplicar estabilización CSS a una página
 */
export async function applyStabilization(page) {
  await page.addStyleTag({ content: STABILIZATION_CSS });
  
  // Esperar a que las animaciones se estabilicen
  await page.waitForTimeout(1000);
  
  // Ocultar cursores y elementos dinámicos
  await page.evaluate(() => {
    document.body.style.caretColor = 'transparent';
    const dynamicElements = document.querySelectorAll('[data-testid*="dynamic"], .loading, .spinner');
    dynamicElements.forEach(el => el.style.visibility = 'hidden');
  });
}

/**
 * Configurar viewport y estabilización
 */
export async function setupViewport(page, viewportName) {
  const viewport = VISUAL_CONFIG.viewports[viewportName];
  if (!viewport) {
    throw new Error(`Viewport '${viewportName}' no encontrado`);
  }
  
  await page.setViewportSize(viewport);
  await applyStabilization(page);
  
  return viewport;
}

/**
 * Tomar screenshot estabilizado
 */
export async function takeStabilizedScreenshot(page, screenshotName, options = {}) {
  // Esperar a que el contenido esté completamente cargado
  await page.waitForLoadState('networkidle');
  
  // Aplicar estabilización adicional
  await applyStabilization(page);
  
  // Esperar un momento para que todo se estabilice
  await page.waitForTimeout(500);
  
  // Configuración de screenshot optimizada
  const screenshotOptions = {
    fullPage: true,
    threshold: 0.3,
    animations: 'disabled',
    ...options
  };
  
  return await page.screenshot({
    path: screenshotName,
    ...screenshotOptions
  });
}

/**
 * Navegar a componente de Storybook con estabilización
 */
export async function navigateToStorybook(page, variant) {
  const variantConfig = STATUS_MESSAGE_VARIANTS[variant];
  if (!variantConfig) {
    throw new Error(`Variant '${variant}' no encontrado`);
  }
  
  const fullUrl = VISUAL_CONFIG.storybook.baseUrl + variantConfig.url;
  
  await page.goto(fullUrl, { 
    waitUntil: 'networkidle',
    timeout: VISUAL_CONFIG.timeouts.navigation 
  });
  
  // Esperar a que el componente se renderice
  await page.waitForSelector('[data-testid], .sb-show-main, #storybook-root', {
    timeout: VISUAL_CONFIG.timeouts.element
  });
  
  await applyStabilization(page);
  
  return fullUrl;
}

/**
 * Navegar a página de FAESign con estabilización
 */
export async function navigateToFAESignPage(page, pageName) {
  const pageConfig = FAESIGN_PAGES[pageName];
  if (!pageConfig) {
    throw new Error(`Page '${pageName}' no encontrada`);
  }
  
  const fullUrl = VISUAL_CONFIG.app.baseUrl + pageConfig.url;
  
  await page.goto(fullUrl, { 
    waitUntil: 'networkidle',
    timeout: VISUAL_CONFIG.timeouts.navigation 
  });
  
  // Esperar a que el elemento principal se cargue
  if (pageConfig.selector) {
    await page.waitForSelector(pageConfig.selector, {
      timeout: VISUAL_CONFIG.timeouts.element
    });
  }
  
  await applyStabilization(page);
  
  return fullUrl;
}

/**
 * Inyectar regresión CSS para testing
 */
export async function injectRegression(page, regressionType = 'color') {
  const regressions = {
    color: `
      .status-message { 
        background-color: red !important; 
        color: white !important; 
      }
    `,
    layout: `
      .status-message { 
        transform: translateX(50px) !important; 
        width: 50% !important; 
      }
    `,
    typography: `
      .status-message { 
        font-size: 24px !important; 
        font-family: Times !important; 
      }
    `,
    spacing: `
      .status-message { 
        margin: 50px !important; 
        padding: 50px !important; 
      }
    `,
    visibility: `
      .status-message { 
        opacity: 0.5 !important; 
      }
    `
  };
  
  const regressionCSS = regressions[regressionType];
  if (!regressionCSS) {
    throw new Error(`Regression type '${regressionType}' no encontrado`);
  }
  
  await page.addStyleTag({ content: regressionCSS });
  
  return regressionType;
}

/**
 * Medir performance de screenshot
 */
export async function measureScreenshotPerformance(page, testName) {
  const startTime = Date.now();
  
  await takeStabilizedScreenshot(page, `temp-${testName}.png`);
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  return {
    testName,
    duration,
    timestamp: new Date().toISOString()
  };
}

/**
 * Generar reporte de métricas
 */
export function generateMetricsReport(metrics) {
  const report = {
    totalTests: metrics.length,
    averageTime: metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length,
    minTime: Math.min(...metrics.map(m => m.duration)),
    maxTime: Math.max(...metrics.map(m => m.duration)),
    timestamp: new Date().toISOString()
  };
  
  console.log('📊 REPORTE DE MÉTRICAS:');
  console.log(`   Total de pruebas: ${report.totalTests}`);
  console.log(`   Tiempo promedio: ${report.averageTime.toFixed(2)}ms`);
  console.log(`   Tiempo mínimo: ${report.minTime}ms`);
  console.log(`   Tiempo máximo: ${report.maxTime}ms`);
  
  return report;
}
  
  // Give a small buffer for any final renders
  await page.waitForTimeout(100);
}

/**
 * Hide dynamic content that changes between test runs
 * @param {Page} page - Playwright page object
 */
export async function hideVolatileElements(page) {
  await page.addStyleTag({
    content: `
      .document-date,
      .user-timestamp,
      .document-id,
      .current-time,
      .last-updated,
      .random-id {
        visibility: hidden !important;
      }
      
      /* Disable animations for consistent screenshots */
      *,
      *::before,
      *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
}

/**
 * Mock authentication state
 * @param {Page} page - Playwright page object
 * @param {Object} user - User object from mockData
 */
export async function mockAuthState(page, user) {
  await page.addInitScript((userData) => {
    window.localStorage.setItem('currentUser', JSON.stringify(userData));
    window.localStorage.setItem('isAuthenticated', 'true');
    window.localStorage.setItem('userRole', userData.role);
  }, user);
}

/**
 * Set fixed viewport and device pixel ratio
 * @param {Page} page - Playwright page object
 * @param {Object} viewport - Viewport dimensions
 */
export async function setConsistentViewport(page, viewport = { width: 1366, height: 768 }) {
  await page.setViewportSize(viewport);
  await page.emulateMedia({ reducedMotion: 'reduce' });
}

/**
 * Common setup for visual tests
 * @param {Page} page - Playwright page object
 * @param {Object} options - Configuration options
 */
export async function setupVisualTest(page, options = {}) {
  const {
    viewport = { width: 1366, height: 768 },
    user = null,
    hideVolatile = true
  } = options;
  
  await setConsistentViewport(page, viewport);
  
  if (user) {
    await mockAuthState(page, user);
  }
  
  if (hideVolatile) {
    await hideVolatileElements(page);
  }
}

/**
 * Take a full page screenshot with consistent settings
 * @param {Page} page - Playwright page object
 * @param {string} name - Screenshot name
 */
export async function takeConsistentScreenshot(page, name) {
  await waitForVisualStability(page);
  
  return await page.screenshot({
    path: `screenshots/${name}.png`,
    fullPage: true,
    animations: 'disabled',
    caret: 'hide'
  });
}
