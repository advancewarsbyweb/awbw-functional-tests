import { test, expect } from '@playwright/test';
import { loadAccountData, type AccountData } from './fixtures';
import { loginFrontend } from './support/commands';

let accountData: AccountData;

test.describe('test-login', () => {
  test.beforeAll(() => {
    accountData = loadAccountData();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Users can login to accounts through the UI', async ({ page }) => {
    await loginFrontend(page, accountData.StandardAccount, accountData.StandardAccountPass);

    // profile data that appears replacing login button
    await expect(
      page.locator(`#profile-menu > [title="${accountData.StandardAccount}"]`)
    ).toHaveAttribute('title', accountData.StandardAccount);
  });
});
