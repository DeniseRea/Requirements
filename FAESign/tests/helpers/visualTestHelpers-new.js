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
 */
export async function waitForVisualStability(page) {
  await page.waitForLoadState('networkidle');
  
  await page.waitForFunction(() => {
    const images = Array.from(document.images);
    return images.every(img => img.complete);
  });
  
  await page.waitForFunction(() => document.fonts.ready);
  
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
  
  await page.waitForTimeout(1000);
  
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
  await page.waitForLoadState('networkidle');
  
  await applyStabilization(page);
  
  await page.waitForTimeout(500);
  
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

export default {
  VISUAL_CONFIG,
  STABILIZATION_CSS,
  STATUS_MESSAGE_VARIANTS,
  FAESIGN_PAGES,
  waitForVisualStability,
  validateStorybookAvailable,
  validateDevServerAvailable,
  applyStabilization,
  setupViewport,
  takeStabilizedScreenshot,
  navigateToStorybook,
  navigateToFAESignPage,
  injectRegression,
  measureScreenshotPerformance,
  generateMetricsReport
};
