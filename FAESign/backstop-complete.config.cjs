/**
 * BackstopJS Configuration - Configuración Completa
 * Incluye: múltiples viewports, frontend, Storybook y páginas estáticas
 * Compatible con multiserver y otras herramientas de testing visual
 */

const path = require('path');

module.exports = {
  "id": "FAESign_visual_tests_complete",
  "viewports": [
    {
      "label": "phone",
      "width": 375,
      "height": 667
    },
    {
      "label": "tablet", 
      "width": 768,
      "height": 1024
    },
    {
      "label": "desktop",
      "width": 1200,
      "height": 800
    },
    {
      "label": "desktop-large",
      "width": 1280,
      "height": 720
    },
    {
      "label": "desktop-xl",
      "width": 1920,
      "height": 1080
    }
  ],
  "onBeforeScript": path.join(__dirname, "tests/visual/backstop/scripts/onBefore.cjs"),
  "onReadyScript": path.join(__dirname, "tests/visual/backstop/scripts/onReady.cjs"),
  "scenarios": [
    // === FRONTEND SCENARIOS (localhost:5173) ===
    {
      "label": "Frontend-Homepage-Login",
      "url": "http://localhost:5173/",
      "delay": 3000,
      "selectors": ["body"],
      "hideSelectors": [
        "[data-testid='timestamp']",
        ".timestamp",
        ".date",
        ".current-time",
        ".document-date",
        ".user-timestamp",
        ".document-id",
        ".last-updated",
        ".loading-spinner",
        ".animation",
        "video",
        "iframe"
      ],
      "removeSelectors": [
        ".ad-banner",
        ".notification-popup"
      ],
      "misMatchThreshold": 0.5,
      "requireSameDimensions": false
    },
    {
      "label": "Frontend-Dashboard-Main",
      "url": "http://localhost:5173/dashboard", 
      "delay": 3000,
      "selectors": ["body"],
      "hideSelectors": [
        "[data-testid='timestamp']",
        ".timestamp",
        ".date",
        ".current-time",
        ".document-date",
        ".user-timestamp",
        ".document-id",
        ".last-updated",
        ".loading-spinner"
      ],
      "misMatchThreshold": 0.5,
      "requireSameDimensions": false
    },
    {
      "label": "Frontend-Creator-Dashboard",
      "url": "http://localhost:5173/creador",
      "delay": 3000,
      "selectors": ["body"],
      "hideSelectors": [
        "[data-testid='timestamp']",
        ".timestamp",
        ".date",
        ".current-time",
        ".document-date",
        ".user-timestamp",
        ".document-id",
        ".last-updated",
        ".loading-spinner"
      ],
      "misMatchThreshold": 0.5,
      "requireSameDimensions": false
    },
    
    // === STORYBOOK SCENARIOS (localhost:6006) ===
    {
      "label": "Storybook-StatusMessage-Success",
      "url": "http://localhost:6006/iframe.html?id=shared-statusmessage--success",
      "delay": 2000,
      "selectors": ["#storybook-root"],
      "hideSelectors": [
        ".timestamp",
        ".date",
        ".document-id"
      ],
      "misMatchThreshold": 0.3,
      "requireSameDimensions": false
    },
    {
      "label": "Storybook-StatusMessage-Error",
      "url": "http://localhost:6006/iframe.html?id=shared-statusmessage--error",
      "delay": 2000,
      "selectors": ["#storybook-root"],
      "hideSelectors": [
        ".timestamp",
        ".date",
        ".document-id"
      ],
      "misMatchThreshold": 0.3,
      "requireSameDimensions": false
    },
    {
      "label": "Storybook-StatusMessage-Warning",
      "url": "http://localhost:6006/iframe.html?id=shared-statusmessage--warning",
      "delay": 2000,
      "selectors": ["#storybook-root"],
      "hideSelectors": [
        ".timestamp",
        ".date", 
        ".document-id"
      ],
      "misMatchThreshold": 0.3,
      "requireSameDimensions": false
    },
    {
      "label": "Storybook-StatusMessage-Info",
      "url": "http://localhost:6006/iframe.html?id=shared-statusmessage--info",
      "delay": 2000,
      "selectors": ["#storybook-root"],
      "hideSelectors": [
        ".timestamp",
        ".date",
        ".document-id"
      ],
      "misMatchThreshold": 0.3,
      "requireSameDimensions": false
    },
    
    // === STATIC PAGES ===
    {
      "label": "Static-StatusMessage-TestPage",
      "url": `file:///${path.join(__dirname, "tests/visual/backstop/test-pages/statusmessage.html").replace(/\\/g, '/')}`,
      "delay": 1000,
      "selectors": [".container"],
      "misMatchThreshold": 0.3,
      "requireSameDimensions": false
    }
  ],
  "paths": {
    "bitmaps_reference": "tests/visual/backstop/backstop_data/bitmaps_reference",
    "bitmaps_test": "tests/visual/backstop/backstop_data/bitmaps_test", 
    "engine_scripts": "tests/visual/backstop/scripts",
    "html_report": "tests/visual/backstop/backstop_data/html_report",
    "ci_report": "tests/visual/backstop/backstop_data/ci_report"
  },
  "report": ["browser", "CI"],
  "engine": "puppeteer",
  "engineOptions": {
    "args": [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
      "--disable-features=VizDisplayCompositor"
    ],
    "ignoreHTTPSErrors": true,
    "gotoTimeout": 30000,
    "waitUntil": "networkidle0"
  },
  "asyncCaptureLimit": 3,
  "asyncCompareLimit": 10,
  "debug": false,
  "debugWindow": false,
  "misMatchThreshold": 0.1,
  "similarityThreshold": 0.2
};
