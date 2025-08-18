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

// URLs reales de la aplicación FAESign
export const FAESIGN_REAL_URLS = {
  landing: 'http://localhost:5173/',
  login: 'http://localhost:5173/login',
  dashboard: 'http://localhost:5173/dashboard',
  profile: 'http://localhost:5173/profile',
  documents: 'http://localhost:5173/documents',
  settings: 'http://localhost:5173/settings'
};

// Selectores reales de la aplicación para automatización
export const FAESIGN_REAL_SELECTORS = {
  // Landing page elements
  landingHeader: 'header, .header, [data-testid="header"]',
  landingNav: 'nav, .navigation, [data-testid="nav"]',
  landingHero: '.hero-section, .main-banner, [data-testid="hero"], .hero',
  landingCTA: '.cta-button, [data-testid="cta"], .get-started, .primary-button',
  
  // Navigation elements
  loginButton: '[data-testid="login"], .login-btn, a[href*="login"], button:has-text("Login")',
  signupButton: '[data-testid="signup"], .signup-btn, a[href*="signup"], button:has-text("Sign")',
  
  // Form elements
  emailInput: '[data-testid="email"], input[type="email"], #email, input[name="email"]',
  passwordInput: '[data-testid="password"], input[type="password"], #password, input[name="password"]',
  submitButton: '[data-testid="submit"], button[type="submit"], .submit-btn, .login-submit',
  
  // Application sections
  dashboardContainer: '[data-testid="dashboard"], .dashboard, .main-content, main',
  userProfile: '[data-testid="user-profile"], .user-info, .profile-section',
  documentsSection: '[data-testid="documents"], .documents-list, .file-list',
  
  // Status messages in real context
  statusMessage: '[data-testid="status"], .status-message, .notification, .alert',
  statusSuccess: '[data-testid="status-success"], .status-success, .success, .alert-success',
  statusError: '[data-testid="status-error"], .status-error, .error, .alert-error',
  statusWarning: '[data-testid="status-warning"], .status-warning, .warning, .alert-warning'
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

/**
 * FUNCIONES ESPECÍFICAS PARA APLICACIÓN REAL FAESIGN
 * ==================================================
 */

/**
 * Navegar a página real de FAESign con validación robusta
 */
export async function navigateToRealFAESignPage(page, pageName) {
  const pageUrl = FAESIGN_REAL_URLS[pageName] || FAESIGN_REAL_URLS.landing;
  
  console.log(`🌐 Navegando a página real: ${pageName} (${pageUrl})`);
  
  try {
    await page.goto(pageUrl, { 
      waitUntil: 'networkidle',
      timeout: VISUAL_CONFIG.timeouts.navigation 
    });
    
    // Esperar a que la página se estabilice
    await waitForVisualStability(page);
    
    // Aplicar estabilización específica para la app real
    await applyStabilization(page);
    
    return pageUrl;
    
  } catch (error) {
    console.warn(`⚠️  Error navegando a ${pageName}: ${error.message}`);
    
    // Fallback a landing page
    if (pageName !== 'landing') {
      console.log('🔄 Intentando fallback a landing page...');
      return await navigateToRealFAESignPage(page, 'landing');
    }
    
    throw error;
  }
}

/**
 * Buscar y hacer clic en elemento con múltiples selectores
 */
export async function clickElementWithFallbacks(page, selectorsArray, elementDescription = 'elemento') {
  for (const selector of selectorsArray) {
    try {
      const element = page.locator(selector).first();
      const count = await element.count();
      
      if (count > 0) {
        console.log(`✅ Encontrado ${elementDescription}: ${selector}`);
        await element.click();
        return true;
      }
    } catch (error) {
      console.log(`   Probando siguiente selector para ${elementDescription}...`);
    }
  }
  
  console.warn(`⚠️  No se encontró ${elementDescription} con ningún selector`);
  return false;
}

/**
 * Llenar formulario con detectión automática de campos
 */
export async function fillFormWithAutoDetection(page, formData) {
  const results = {};
  
  for (const [fieldName, value] of Object.entries(formData)) {
    const selectors = FAESIGN_REAL_SELECTORS[`${fieldName}Input`] || 
                     `[data-testid="${fieldName}"], input[name="${fieldName}"], #${fieldName}`;
    
    try {
      const input = page.locator(selectors).first();
      const count = await input.count();
      
      if (count > 0) {
        await input.fill(value);
        results[fieldName] = { success: true, value };
        console.log(`✅ Campo ${fieldName} llenado: ${value}`);
      } else {
        results[fieldName] = { success: false, error: 'Campo no encontrado' };
        console.warn(`⚠️  Campo ${fieldName} no encontrado`);
      }
    } catch (error) {
      results[fieldName] = { success: false, error: error.message };
      console.warn(`⚠️  Error llenando ${fieldName}: ${error.message}`);
    }
  }
  
  return results;
}

/**
 * Detectar y verificar estados de StatusMessage en contexto real
 */
export async function detectRealStatusMessage(page, expectedType = null) {
  const statusTypes = ['success', 'error', 'warning', 'info'];
  const results = {};
  
  for (const type of statusTypes) {
    const selector = FAESIGN_REAL_SELECTORS[`status${type.charAt(0).toUpperCase() + type.slice(1)}`];
    
    try {
      const element = page.locator(selector).first();
      const count = await element.count();
      const isVisible = count > 0 ? await element.isVisible() : false;
      
      results[type] = {
        found: count > 0,
        visible: isVisible,
        selector: selector
      };
      
      if (isVisible) {
        const text = await element.textContent();
        results[type].text = text?.trim();
        console.log(`✅ StatusMessage ${type} detectado: "${text?.trim()}"`);
      }
    } catch (error) {
      results[type] = {
        found: false,
        visible: false,
        error: error.message
      };
    }
  }
  
  // Si se especificó un tipo esperado, validarlo
  if (expectedType && results[expectedType]) {
    return results[expectedType];
  }
  
  return results;
}

/**
 * Provocar estados reales de la aplicación
 */
export async function triggerRealAppState(page, stateType) {
  console.log(`🎭 Provocando estado real: ${stateType}`);
  
  switch (stateType) {
    case 'login-error':
      // Intentar login con datos inválidos
      const loginSelectors = FAESIGN_REAL_SELECTORS.loginButton.split(', ');
      const loginClicked = await clickElementWithFallbacks(page, loginSelectors, 'botón login');
      
      if (loginClicked) {
        await page.waitForTimeout(1000);
        
        // Intentar submit sin datos
        const submitSelectors = FAESIGN_REAL_SELECTORS.submitButton.split(', ');
        await clickElementWithFallbacks(page, submitSelectors, 'botón submit');
        
        await page.waitForTimeout(1000);
        return await detectRealStatusMessage(page, 'error');
      }
      break;
      
    case 'form-validation':
      // Buscar cualquier formulario y provocar validación
      const forms = page.locator('form');
      const formCount = await forms.count();
      
      if (formCount > 0) {
        const submitBtn = forms.first().locator('button[type="submit"], .submit-btn').first();
        const submitCount = await submitBtn.count();
        
        if (submitCount > 0) {
          await submitBtn.click();
          await page.waitForTimeout(1000);
          return await detectRealStatusMessage(page);
        }
      }
      break;
      
    case 'navigation-hover':
      // Hacer hover en elementos de navegación
      const navElements = page.locator('nav a, .nav-link, header a').first();
      const navCount = await navElements.count();
      
      if (navCount > 0) {
        await navElements.hover();
        await page.waitForTimeout(500);
        return { success: true, action: 'hover', element: 'navigation' };
      }
      break;
      
    default:
      console.warn(`⚠️  Estado ${stateType} no implementado`);
      return { success: false, error: 'Estado no implementado' };
  }
  
  return { success: false, error: 'No se pudo provocar el estado' };
}

/**
 * Validar estructura de página real
 */
export async function validateRealPageStructure(page) {
  const structure = {
    header: await page.locator('header, .header').count(),
    nav: await page.locator('nav, .navigation').count(),
    main: await page.locator('main, .main-content').count(),
    footer: await page.locator('footer, .footer').count(),
    forms: await page.locator('form').count(),
    buttons: await page.locator('button:visible').count(),
    links: await page.locator('a:visible').count(),
    inputs: await page.locator('input:visible').count()
  };
  
  const totalElements = Object.values(structure).reduce((sum, count) => sum + count, 0);
  
  console.log(`📊 Estructura de página detectada:`);
  console.log(`   Header: ${structure.header}, Nav: ${structure.nav}, Main: ${structure.main}`);
  console.log(`   Footer: ${structure.footer}, Forms: ${structure.forms}`);
  console.log(`   Buttons: ${structure.buttons}, Links: ${structure.links}, Inputs: ${structure.inputs}`);
  console.log(`   Total elementos: ${totalElements}`);
  
  return {
    structure,
    totalElements,
    hasBasicStructure: structure.header > 0 || structure.nav > 0 || structure.main > 0,
    hasInteractiveElements: structure.buttons > 0 || structure.links > 0 || structure.forms > 0
  };
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
