/**
 * BackstopJS Configuration - Staging (Optimizado)
 * Configuración limpia y estable para Frontend + Static
 */

const path = require('path');

module.exports = {
  "id": "FAESign_visual_tests_staging",
  "viewports": [
    {"label": "phone", "width": 375, "height": 667},
    {"label": "tablet", "width": 768, "height": 1024},
    {"label": "desktop", "width": 1200, "height": 800}
  ],
  "onBeforeScript": path.join(__dirname, "tests/visual/backstop/scripts/onBefore.cjs"),
  "onReadyScript": path.join(__dirname, "tests/visual/backstop/scripts/onReady.cjs"),
  "scenarios": [
    {
      "label": "Frontend-Homepage-Login",
      "url": "http://localhost:5173/",
      "delay": 3000,
      "selectors": ["body"],
      "hideSelectors": [".timestamp", ".date", ".loading-spinner"],
      "misMatchThreshold": 0.5,
      "requireSameDimensions": false
    },
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
    "html_report": "tests/visual/backstop/backstop_data/html_report",
    "ci_report": "tests/visual/backstop/backstop_data/ci_report"
  },
  "report": ["browser"],
  "engine": "puppeteer",
  "engineOptions": {
    "args": ["--no-sandbox", "--disable-setuid-sandbox"],
    "ignoreHTTPSErrors": true,
    "gotoTimeout": 15000,
    "waitUntil": "networkidle0"
  },
  "asyncCaptureLimit": 1,
  "debug": false,
  "misMatchThreshold": 0.3
};
