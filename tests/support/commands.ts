import { expect, type Page } from '@playwright/test';
import homepageSelectors from '../selectors/homepageSelectors';

/**
 * Ported from the previous Cypress custom commands (cypress/support/commands.ts).
 * Each former `cy.*` command is now an async helper that takes the Playwright
 * `page` and uses the project `baseURL` (so there is no more baseUrl argument).
 * Selectors and flows are intentionally unchanged: they were already proven
 * against the live AWBW site.
 */

export async function loginFrontend(page: Page, email: string, password: string): Promise<void> {
  await page.locator(homepageSelectors.loginDropdown).click();
  await page.locator(homepageSelectors.userNameField).fill(email);
  // DO NOT STORE NON-THROWAWAY ACCOUNT PASSWORDS IN THE SETUP-DATA FIXTURE.
  await page.locator(homepageSelectors.passwordField).fill(password);
  await page.locator(homepageSelectors.loginButton).click();
}

export async function logoutFrontend(page: Page): Promise<void> {
  // Native hover replaces the previous cypress-real-events realHover().
  await page.locator(homepageSelectors.profileMenu).hover();
  await page.locator(homepageSelectors.logoutLink).click();
}

export async function createGame(
  page: Page,
  gameName: string,
  prefsId: string,
  gamePassword = 'asdf'
): Promise<string> {
  await page.goto(`/create.php?prefs_id=${prefsId}`);
  await page.locator('input[name="game_name"]').fill(gameName);
  await page.locator('input[name="game_password"]').fill(gamePassword);
  await page.locator('input[name="create"]').click();

  await page.waitForURL(/yourgames\.php#game_/);
  const gameId = new URL(page.url()).hash.replace('#game_', '');
  console.log(`Created gameID: ${gameId}`);
  return gameId;
}

// Note: Command might only work with one active game at a time.
export async function deleteGame(page: Page, gameID: string): Promise<void> {
  await page.goto(`/yourgames.php#game_${gameID}`);
  // The previous command clicked every "//b[text()='Delete Game']" match
  // ({ multiple: true }). With a single active game there is exactly one, so
  // .first() mirrors that behaviour without tripping Playwright strict mode.
  await page.getByText('Delete Game', { exact: true }).first().click();
}

export async function enterGame(page: Page, gameName: string): Promise<void> {
  await page.goto('/yourgames.php');
  await page.getByText(gameName).first().click();
  await expect(page).toHaveURL(/game\.php/);
}

export async function resign(page: Page, password: string): Promise<void> {
  await page.getByText('Menu', { exact: true }).first().click();
  await page.getByText('Resign', { exact: true }).first().click();
  await page.locator('input[type="password"]').fill(password);
  await page.locator('.resign-conf-btn').click();
}

// unit string REQUIRED for airports
export async function buildUnitOnNthBuilding(
  page: Page,
  position: number,
  unit = 'Infantry'
): Promise<void> {
  await page.locator('.game-building').nth(position).click();
  await page.getByText(unit, { exact: true }).first().click();
}

// useful for making infantry capture specific properties
export async function moveNthUnitAndPerformActionOnNthBuilding(
  page: Page,
  unitPosition: number,
  buildingPosition: number,
  actionNumber: number
): Promise<void> {
  await page.locator('.game-unit').nth(unitPosition).click();
  // Hide the movement overlay so the building underneath is clickable.
  // Replaces the Cypress .invoke('css', 'display', 'none') on .movement-tile.
  await page.locator('.movement-tile').evaluateAll((els) => {
    for (const el of els) el.style.display = 'none';
  });
  await page.locator('.game-building').nth(buildingPosition).click();
  await page.locator('.menu-option').nth(actionNumber).click(); // capt button
}

// to be used for tests such as deleting units
export async function doubleClickNthUnitAndPerformAction(
  page: Page,
  unitPosition: number,
  actionNumber: number
): Promise<void> {
  await page.locator('.game-unit').nth(unitPosition).dblclick();
  await page.locator('.menu-option').nth(actionNumber).click(); // capt button
}

export async function endTurn(page: Page): Promise<void> {
  await page.locator('#end-turn').click();
  await page.locator('.end-turn-conf-btn').click();
  // Matches the original Cypress command's end-turn popup cycle wait.
  // Could be tightened to wait for the end-turn screen to close instead.
  await page.waitForTimeout(6000);
}
