/**
 * Percy Helper Functions
 * Utilities for consistent Percy visual testing
 */

/**
 * Standard Percy setup for consistent snapshots
 * @param {Page} page - Playwright page object
 */
export async function setupPercyEnvironment(page) {
  // Add Percy-specific CSS
  await page.addStyleTag({
    content: `
      /* Percy Stabilization CSS */
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
      
      /* Hide dynamic content */
      .document-date,
      .user-timestamp,
      .document-id,
      .current-time,
      .last-updated,
      .timestamp,
      .date,
      .loading,
      .spinner {
        visibility: hidden !important;
      }
      
      /* Stabilize hover states */
      *:hover {
        transition: none !important;
      }
    `
  });

  // Wait for fonts and images
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => document.fonts.ready);
  
  // Additional stability wait
  await page.waitForTimeout(500);
}

/**
 * Take Percy snapshot with consistent settings
 * @param {Page} page - Playwright page object
 * @param {string} name - Snapshot name
 * @param {Object} options - Percy options
 */
export async function takePercySnapshot(page, name, options = {}) {
  const defaultOptions = {
    widths: [375, 768, 1280, 1920],
    minHeight: 1024,
    ...options
  };

  const percySnapshot = (await import('@percy/playwright')).default;
  await percySnapshot(page, name, defaultOptions);
}

/**
 * Mock consistent data for Percy tests
 * @param {Page} page - Playwright page object
 */
export async function mockPercyData(page) {
  await page.addInitScript(() => {
    // Mock localStorage for consistent state
    const mockData = {
      currentUser: {
        id: 'percy-user-001',
        name: 'Percy Test User',
        email: 'percy@test.com',
        role: 'creator'
      },
      documents: [
        {
          id: 'DOC-PERCY-001',
          name: 'Test Document 1',
          status: 'draft',
          createdAt: '2025-01-15T10:00:00Z'
        },
        {
          id: 'DOC-PERCY-002',
          name: 'Test Document 2', 
          status: 'signed',
          createdAt: '2025-01-14T15:30:00Z'
        }
      ]
    };

    window.localStorage.setItem('percyTestData', JSON.stringify(mockData));
    window.localStorage.setItem('isAuthenticated', 'true');
  });
}

/**
 * Standard viewport configurations for Percy
 */
export const PERCY_VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  large: { width: 1920, height: 1080 }
};
