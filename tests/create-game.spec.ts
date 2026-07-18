import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { setupData, loadAccountData, type AccountData } from './fixtures';
import { loginFrontend, createGame, deleteGame, enterGame, resign } from './support/commands';

let accountData: AccountData;

test.describe('create-game-tests', () => {
  test.beforeAll(() => {
    accountData = loadAccountData();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await loginFrontend(page, accountData.StandardAccount, accountData.StandardAccountPass);
  });

  // Note: If running this in production, delete the game after testing.
  test('Basic Create Game Test', async ({ page }) => {
    // createGame helper includes basic frontend assertions
    const gameId = await createGame(page, 'Normal_Game', setupData.MapOnePrefsId);
    // cleanup
    await deleteGame(page, gameId);
  });

  test('Basic Join and Resign Game Test', async ({ page }) => {
    const uuid = uuidv4();
    await createGame(page, uuid, setupData.MapOnePrefsId);
    await page.getByText('Join Again As Another Country (Hotseat)').click();
    await page.locator('.submit').click();
    await page.getByText('Start Game').click();
    await expect(page.getByText(uuid)).toBeVisible();

    await enterGame(page, uuid);
    await resign(page, accountData.StandardAccountPass);

    // assert initial resign message
    await expect(page.getByText(`${accountData.StandardAccount} has resigned!`)).toBeVisible();

    // long timeout since it waits for the final win message
    await expect(
      page.getByText(`The game is over! ${accountData.StandardAccount} is the winner!`)
    ).toBeVisible({ timeout: 10000 });
  });
});
