import { defineConfig, devices } from '@playwright/test';

/**
 * CONFIGURACIÓN OPTIMIZADA PARA AUTOMATIZACIÓN DE PRUEBAS VISUALES
 * =================================================================
 * 
 * Configuración especializada para testing visual automatizado
 * Incluye optimizaciones para detección de regresiones y CI/CD
 */
export default defineConfig({
  testDir: './tests/visual/playwright',
  
  /* Configuración para pruebas visuales automatizadas */
  fullyParallel: false, // Secuencial para pruebas visuales más estables
  
  /* Configuración CI/CD optimizada */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1, // Más reintentos para pruebas visuales
  workers: process.env.CI ? 1 : 2, // Reducido para estabilidad visual
  
  /* Timeout extendido para pruebas visuales */
  timeout: 60000, // 60 segundos para operaciones de screenshot
  expect: {
    timeout: 15000, // 15 segundos para aserciones visuales
    toHaveScreenshot: {
      // Configuración global para screenshots
      threshold: 0.3,
      mode: 'default',
      animations: 'disabled'
    }
  },
  
  /* Reportes especializados para pruebas visuales */
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: process.env.CI ? 'never' : 'on-failure'
    }],
    ['json', { outputFile: 'playwright-report/visual-results.json' }],
    ['junit', { outputFile: 'playwright-report/visual-junit.xml' }],
    ['line'] // Para logs detallados durante automatización
  ],
  
  /* Configuración base optimizada para pruebas visuales */
  use: {
    baseURL: 'http://localhost:5173',
    
    /* Configuración de trace optimizada para debugging visual */
    trace: 'retain-on-failure',
    
    /* Screenshots para todas las fallas */
    screenshot: 'only-on-failure',
    
    /* Video solo en fallas para análisis posterior */
    video: 'retain-on-failure',
    
    /* Configuraciones para estabilidad visual */
    waitForLoadState: 'networkidle',
    
    /* Configuraciones adicionales para pruebas visuales */
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    /* Configuración de viewport por defecto */
    viewport: { width: 1280, height: 720 },
    
    /* Configuraciones de calidad para screenshots */
    launchOptions: {
      args: [
        '--disable-web-security',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows'
      ]
    }
  },

  /* Proyectos optimizados para automatización visual cross-browser */
  projects: [
    {
      name: 'chromium-visual',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
      testMatch: '**/automated-visual-suite.spec.js'
    },
    {
      name: 'firefox-visual',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
      testMatch: '**/automated-visual-suite.spec.js'
    },
    {
      name: 'webkit-visual',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
      testMatch: '**/automated-visual-suite.spec.js'
    },
    
    /* Proyecto específico para pruebas responsivas automatizadas */
    {
      name: 'responsive-mobile',
      use: { 
        ...devices['iPhone 13'],
        viewport: { width: 375, height: 667 }
      },
      testMatch: '**/automated-visual-suite.spec.js'
    },
    {
      name: 'responsive-tablet',
      use: { 
        ...devices['iPad'],
        viewport: { width: 768, height: 1024 }
      },
      testMatch: '**/automated-visual-suite.spec.js'
    },
    
    /* Proyecto para pruebas legacy (compatibilidad) */
    {
      name: 'legacy-tests',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/statusmessage-exact.spec.js'
    },
    
    /* Proyecto para automatización de aplicación real */
    {
      name: 'real-app-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
      testMatch: ['**/basic.spec.js', '**/automated-faesign-real-app.spec.js', '**/real-app-*.spec.js', '**/faesign-working-automation.spec.js']
    },
    {
      name: 'real-app-firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
      testMatch: ['**/basic.spec.js', '**/automated-faesign-real-app.spec.js', '**/real-app-*.spec.js']
    },
    {
      name: 'real-app-mobile',
      use: { 
        ...devices['iPhone 13'],
        viewport: { width: 375, height: 667 }
      },
      testMatch: ['**/basic.spec.js', '**/automated-faesign-real-app.spec.js', '**/real-app-*.spec.js']
    }
  ],

  /* Configuración del servidor web local */
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
