/**
 * Helper functions for visual testing
 */

/**
 * Wait for all images and fonts to load
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
