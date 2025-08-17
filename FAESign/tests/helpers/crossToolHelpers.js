/**
 * Configuraciones exactas compartidas entre Playwright, Percy y Loki
 * Basadas en el archivo StatusMessage.stories.js real
 * Para garantizar análisis comparativo válido
 */

export const EXACT_SHARED_CONFIG = {
  // Viewports idénticos para todas las herramientas (tomados de Playwright)
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 }
  },
  
  // URLs exactas de las stories definidas en StatusMessage.stories.js
  storybook: {
    baseUrl: 'http://localhost:6006',
    statusMessageStories: {
      // Usando exactamente los nombres de export del archivo stories
      success: '/iframe.html?id=shared-statusmessage--success',
      error: '/iframe.html?id=shared-statusmessage--error', 
      warning: '/iframe.html?id=shared-statusmessage--warning',
      info: '/iframe.html?id=shared-statusmessage--info',
      withoutCloseButton: '/iframe.html?id=shared-statusmessage--without-close-button',
      longMessage: '/iframe.html?id=shared-statusmessage--long-message'
    }
  },
  
  // CSS de estabilización exacto (mismo que Playwright)
  stabilizationCSS: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
    
    /* Estabilizar elementos de Storybook */
    .sb-show-main, .sb-main-padded {
      background: white !important;
    }
  `,
  
  // Timeouts exactos (mismo que Playwright)
  timeouts: {
    networkIdle: 750,      // networkidle timeout
    stabilization: 1000,   // estabilización post-carga
    navigation: 30000      // timeout navegación
  },
  
  // Configuración de screenshots (mismo que Playwright)
  screenshot: {
    fullPage: true,
    threshold: 0.3,        // Mismo threshold que Playwright
    animations: 'disabled' // Mismo que Playwright
  },
  
  // Stories exactas del componente StatusMessage
  statusMessageVariants: [
    { name: 'success', story: 'success', description: 'Success state with green styling' },
    { name: 'error', story: 'error', description: 'Error state with red styling' },
    { name: 'warning', story: 'warning', description: 'Warning state with yellow styling' },
    { name: 'info', story: 'info', description: 'Info state with blue styling' },
    { name: 'withoutCloseButton', story: 'without-close-button', description: 'No close button variant' },
    { name: 'longMessage', story: 'long-message', description: 'Long text for responsive testing' }
  ]
};

/**
 * Aplicar configuración exacta de estabilización visual
 * Exactamente igual que en las pruebas Playwright
 */
export async function applyExactStabilization(page) {
  await page.addStyleTag({ content: EXACT_SHARED_CONFIG.stabilizationCSS });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(EXACT_SHARED_CONFIG.timeouts.stabilization);
}

/**
 * Navegar a story específica con configuración idéntica
 */
export async function navigateToExactStory(page, storyName) {
  const storyPath = EXACT_SHARED_CONFIG.storybook.statusMessageStories[storyName];
  if (!storyPath) {
    throw new Error(`Story '${storyName}' not found in exact configuration`);
  }
  
  const fullUrl = `${EXACT_SHARED_CONFIG.storybook.baseUrl}${storyPath}`;
  await page.goto(fullUrl);
  await applyExactStabilization(page);
}

/**
 * Configurar viewport exacto (mismo que Playwright)
 */
export async function setExactViewport(page, viewportName) {
  const viewport = EXACT_SHARED_CONFIG.viewports[viewportName];
  if (!viewport) {
    throw new Error(`Viewport '${viewportName}' not found in exact configuration`);
  }
  
  await page.setViewportSize(viewport);
}

/**
 * Tomar screenshot con configuración exacta (mismo que Playwright)
 */
export async function takeExactScreenshot(page, name, tool = 'playwright') {
  return await page.screenshot({
    path: `tests/visual/${tool}/screenshots/${name}-${tool}.png`,
    fullPage: EXACT_SHARED_CONFIG.screenshot.fullPage,
    animations: EXACT_SHARED_CONFIG.screenshot.animations
  });
}

/**
 * Ejecutar todas las variantes de StatusMessage con configuración exacta
 */
export async function testAllStatusMessageVariants(page, testFunction) {
  for (const variant of EXACT_SHARED_CONFIG.statusMessageVariants) {
    console.log(`Testing variant: ${variant.name} - ${variant.description}`);
    await navigateToExactStory(page, variant.name);
    await testFunction(page, variant);
  }
}

/**
 * Ejecutar pruebas multi-viewport con configuración exacta
 */
export async function testAllViewports(page, storyName, testFunction) {
  for (const [viewportName, viewport] of Object.entries(EXACT_SHARED_CONFIG.viewports)) {
    console.log(`Testing viewport: ${viewportName} (${viewport.width}x${viewport.height})`);
    await setExactViewport(page, viewportName);
    await navigateToExactStory(page, storyName);
    await testFunction(page, viewportName, viewport);
  }
}

/**
 * Validar que Storybook esté disponible
 */
export async function validateStorybookAvailable() {
  try {
    const response = await fetch(EXACT_SHARED_CONFIG.storybook.baseUrl);
    return response.ok;
  } catch (error) {
    return false;
  }
}
