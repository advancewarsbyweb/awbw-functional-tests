import { test, expect } from '@playwright/test';

/**
 * Verifies the Playwright harness is wired up correctly: it can launch a
 * browser, reach the configured baseURL, and see the homepage login button.
 * Replaces the previous initial-testing.cy.ts (which only visited the Cypress
 * example site) and needs no credentials.
 */
test('homepage loads and shows the login button', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#login-button')).toBeVisible();
});
