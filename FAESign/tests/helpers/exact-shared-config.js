/**
 * Configuraciones compartidas entre Playwright, Percy y Loki
 * para garantizar resultados exactamente comparables
 * 
 * @version 1.0.0
 * @author QA Team - Visual Testing Standards
 */

export const EXACT_SHARED_CONFIG = {
  // Viewports idénticos para todas las herramientas de testing visual
  viewports: {
    mobile: { width: 375, height: 667, name: 'Mobile' },
    tablet: { width: 768, height: 1024, name: 'Tablet' },
    desktop: { width: 1280, height: 720, name: 'Desktop' }
  },
  
  // URLs de Storybook consistentes entre herramientas
  storybook: {
    baseUrl: 'http://localhost:6006',
    statusMessageStories: {
      success: '/iframe.html?args=&id=shared-statusmessage--success',
      error: '/iframe.html?args=&id=shared-statusmessage--error', 
      warning: '/iframe.html?args=&id=shared-statusmessage--warning',
      info: '/iframe.html?args=&id=shared-statusmessage--info',
      withoutClose: '/iframe.html?args=&id=shared-statusmessage--without-close-button',
      longMessage: '/iframe.html?args=&id=shared-statusmessage--long-message'
    }
  },
  
  // Stories específicas para Loki (formato de identificadores)
  lokiStories: [
    'shared-statusmessage--success',
    'shared-statusmessage--error',
    'shared-statusmessage--warning', 
    'shared-statusmessage--info',
    'shared-statusmessage--without-close-button',
    'shared-statusmessage--long-message'
  ],
  
  // CSS para estabilización visual (idéntico en todas las herramientas)
  stabilizationCSS: `
    /* Desactivar animaciones para consistencia visual */
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
    
    /* Ocultar elementos dinámicos para consistencia */
    .document-date, 
    .user-timestamp, 
    .document-id,
    .current-time,
    .last-updated,
    .timestamp,
    .date {
      visibility: hidden !important;
    }
    
    /* Fix loading states */
    .loading,
    .spinner {
      display: none !important;
    }
  `,
  
  // Timeouts consistentes entre herramientas
  timeouts: {
    networkIdle: 750,
    stabilization: 1000,
    navigation: 30000,
    storybook: 10000
  },

  // Tolerancia de diferencias visual (estándar QA)
  visualThreshold: 0.3,
  
  // Configuraciones de navegadores para testing multibrowser
  browsers: {
    chrome: {
      name: 'chrome',
      target: 'chrome.app',
      userAgent: 'Chrome/120.0 Loki Testing'
    },
    firefox: {
      name: 'firefox', 
      target: 'firefox',
      userAgent: 'Firefox/120.0 Loki Testing'
    },
    webkit: {
      name: 'webkit',
      target: 'webkit', 
      userAgent: 'Safari/17.0 Loki Testing'
    }
  }
};

/**
 * Generar configuración Loki basada en configuración compartida
 * Garantiza que Loki use exactamente los mismos viewports que Percy y Playwright
 */
export function generateLokiConfig() {
  const configurations = {};
  const browsers = ['chrome', 'firefox'];
  const viewportNames = Object.keys(EXACT_SHARED_CONFIG.viewports);
  
  // Generar configuraciones para cada combinación browser/viewport
  browsers.forEach(browser => {
    viewportNames.forEach(viewportName => {
      const viewport = EXACT_SHARED_CONFIG.viewports[viewportName];
      const configName = `${browser}.${viewportName}`;
      
      configurations[configName] = {
        target: browser === 'chrome' ? 'chrome.app' : 'firefox',
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewportName === 'mobile' ? 2 : 1,
        mobile: viewportName === 'mobile',
        // Configuraciones adicionales para estabilidad
        userAgent: EXACT_SHARED_CONFIG.browsers[browser].userAgent
      };
    });
  });
  
  return {
    configurations,
    storybookUrl: EXACT_SHARED_CONFIG.storybook.baseUrl,
    chromeLoadTimeout: EXACT_SHARED_CONFIG.timeouts.navigation,
    chromeTolerance: EXACT_SHARED_CONFIG.visualThreshold,
    stabilityTimeout: EXACT_SHARED_CONFIG.timeouts.stabilization,
    outputDir: "./tests/visual/loki/screenshots",
    referenceDir: "./tests/visual/loki/reference",
    diffDir: "./tests/visual/loki/diffs",
    // CSS personalizado para estabilización
    chromeSelector: "body",
    // Stories específicas a testear
    stories: EXACT_SHARED_CONFIG.lokiStories
  };
}

/**
 * Validar que Storybook esté disponible antes de ejecutar tests
 * Usado por todas las herramientas que dependen de Storybook
 */
export async function validateStorybookAvailable() {
  try {
    const response = await fetch(EXACT_SHARED_CONFIG.storybook.baseUrl);
    return response.ok;
  } catch (error) {
    console.warn('Storybook no está disponible:', error.message);
    return false;
  }
}

/**
 * Generar configuración Percy usando configuración compartida
 */
export function generatePercyConfig() {
  return {
    version: 2,
    discovery: {
      'allowed-hostnames': ['localhost:5173', 'localhost:6006']
    },
    snapshot: {
      widths: Object.values(EXACT_SHARED_CONFIG.viewports).map(v => v.width),
      'min-height': Math.min(...Object.values(EXACT_SHARED_CONFIG.viewports).map(v => v.height)),
      'percy-css': EXACT_SHARED_CONFIG.stabilizationCSS,
      'enable-javascript': true,
      'network-idle-timeout': EXACT_SHARED_CONFIG.timeouts.networkIdle
    }
  };
}
