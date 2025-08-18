/**
 * BackstopJS Configuration - CommonJS explícito
 * Configuración mínima para pruebas visuales estables
 */

const path = require('path');

module.exports = {
  "id": "FAESign_visual_tests_minimal",
  "viewports": [
    {
      "label": "desktop",
      "width": 1200,
      "height": 800
    }
  ],
  "onBeforeScript": path.join(__dirname, "tests/visual/backstop/scripts/onBefore.cjs"),
  "onReadyScript": path.join(__dirname, "tests/visual/backstop/scripts/onReady.cjs"),
  "scenarios": [
    {
      "label": "Static-Test-Page",
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
  "report": ["browser"],
  "engine": "puppeteer",
  "engineOptions": {
    "args": [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ],
    "ignoreHTTPSErrors": true,
    "gotoTimeout": 15000,
    "waitUntil": "networkidle0"
  },
  "asyncCaptureLimit": 1,
  "asyncCompareLimit": 1,
  "debug": true,
  "debugWindow": false,
  "misMatchThreshold": 0.1,
  "similarityThreshold": 0.2
};
