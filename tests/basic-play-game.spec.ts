import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { setupData, loadAccountData, type AccountData } from './fixtures';
import {
  loginFrontend,
  createGame,
  enterGame,
  buildUnitOnNthBuilding,
  endTurn,
  moveNthUnitAndPerformActionOnNthBuilding,
  doubleClickNthUnitAndPerformAction,
} from './support/commands';

let accountData: AccountData;

test.describe('gameplay-tests', () => {
  test.beforeAll(() => {
    accountData = loadAccountData();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await loginFrontend(page, accountData.StandardAccount, accountData.StandardAccountPass);
  });

  test('Basic Build, Move, and HQ Win Test', async ({ page }) => {
    const uuid = uuidv4();
    // game creation and joining
    await createGame(page, uuid, setupData.MapOnePrefsId);
    await page.getByText('Join Again As Another Country (Hotseat)').click();
    await page.locator('.submit').click();
    await page.getByText('Start Game').click();
    await expect(page.getByText(uuid)).toBeVisible();
    await enterGame(page, uuid);

    // building and moving units
    await buildUnitOnNthBuilding(page, 0);
    await endTurn(page);
    await endTurn(page);
    await moveNthUnitAndPerformActionOnNthBuilding(page, 0, 1, 0); // capture HQ
    await endTurn(page);
    await endTurn(page);
    await doubleClickNthUnitAndPerformAction(page, 0, 0); // capture HQ
    await expect(page.getByText('Victory')).toBeVisible();
  });
});
