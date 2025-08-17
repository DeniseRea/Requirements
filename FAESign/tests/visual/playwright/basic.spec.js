import { test, expect } from '@playwright/test';

test.describe('Basic Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Disable animations and transitions for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
        
        /* Hide any dynamic content that might change */
        .current-time, .timestamp, .date {
          visibility: hidden !important;
        }
      `
    });
  });

  test('Homepage loads successfully', async ({ page }) => {
    // Go to the homepage
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Wait for any lazy-loaded content
    await page.waitForTimeout(1000);
    
    // Simple check that the page loads
    await expect(page).toHaveTitle(/FAESign|Firma|Sign/);
    
    // Take a basic screenshot with more lenient threshold for tablet
    await expect(page).toHaveScreenshot('homepage-basic.png', {
      threshold: 0.3, // Allow some differences
      animations: 'disabled'
    });
  });

  test('Page has no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for JavaScript errors
    expect(errors).toHaveLength(0);
  });
});
