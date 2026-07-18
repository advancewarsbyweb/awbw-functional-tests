import { test, expect } from '@playwright/test';
import { loadAccountData, type AccountData } from './fixtures';
import { loginFrontend, logoutFrontend } from './support/commands';

let accountData: AccountData;

test.describe('test-logout', () => {
  test.beforeAll(() => {
    accountData = loadAccountData();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Users can logout from their account through the UI', async ({ page }) => {
    // First login
    await loginFrontend(page, accountData.StandardAccount, accountData.StandardAccountPass);

    // Verify user is logged in by checking profile menu exists with username
    await expect(
      page.locator(`#profile-menu > [title="${accountData.StandardAccount}"]`)
    ).toHaveAttribute('title', accountData.StandardAccount);

    // Perform logout
    await logoutFrontend(page);

    // Verify user is logged out by checking login button is visible again
    await expect(page.locator('#login-button')).toBeVisible();
  });
});
