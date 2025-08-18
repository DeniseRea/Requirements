/**
 * Configuración simplificada de Loki para testing visual multinavegador
 * Compatible con Storybook 8.x y las mismas condiciones que Percy/Playwright
 */

module.exports = {
  // Configuraciones de navegadores y viewports (idénticos a Percy/Playwright)
  configurations: {
    // Chrome configurations - mismos viewports que Percy
    "chrome.mobile": {
      target: "chrome.app",
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true
    },
    "chrome.tablet": {
      target: "chrome.app", 
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false
    },
    "chrome.desktop": {
      target: "chrome.app",
      width: 1280,
      height: 720,
      deviceScaleFactor: 1,
      mobile: false
    },
    // Firefox configurations - mismos viewports que Percy
    "firefox.mobile": {
      target: "firefox",
      width: 375,
      height: 667
    },
    "firefox.tablet": {
      target: "firefox",
      width: 768,
      height: 1024
    },
    "firefox.desktop": {
      target: "firefox",
      width: 1280,
      height: 720
    }
  },
  
  // URL de Storybook (igual que Percy y Playwright)
  storybookUrl: "http://localhost:6006",
  
  // Timeouts y tolerancias (estándares QA idénticos)
  chromeLoadTimeout: 30000,
  chromeTolerance: 0.3,
  stabilityTimeout: 1000,
  
  // Directorios organizados para resultados
  outputDir: "./tests/visual/loki/screenshots",
  referenceDir: "./tests/visual/loki/reference", 
  diffDir: "./tests/visual/loki/diffs",
  
  // Configuraciones de estabilidad visual
  chromeSelector: "body",
  chromeConcurrency: 1, // Reducido para evitar conflictos
  chromeRetries: 2,
  
  // URL específica para Storybook iframe
  reactUri: "http://localhost:6006/iframe.html",
  
  // Configuraciones de Chrome para estabilidad
  chromeCustomFlags: [
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows", 
    "--disable-renderer-backgrounding",
    "--no-sandbox",
    "--disable-web-security",
    "--disable-features=TranslateUI",
    "--disable-extensions",
    "--disable-component-extensions-with-background-pages"
  ]
};
