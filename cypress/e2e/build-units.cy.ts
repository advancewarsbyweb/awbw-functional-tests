import { it } from 'mocha';

describe('build-units', () => {
  let data: { TestURL: string };
  let accountData: { StandardAccount: string; StandardAccountPass: string };
  const unitType = 'infantry'; // Type the map you want to find
  before(function () {
    cy.fixture('personal-automation-account.json').then((fdata) => {
      accountData = fdata;
    });

    cy.fixture('setup-data').then((fdata) => {
      data = fdata;
      cy.visit(data.TestURL);
    });
  });

  it('User can build a unit of any kind from the bases', () => {
    // Step 1: Login
    cy.loginFrontend(accountData.StandardAccount, accountData.StandardAccountPass);

    // Step 2: Create a game
    cy.visit(data.TestURL + 'newleague.php');

    // Step 3: Access the game

    // Step 4: Interact with bases and select units


    // Step 5: Resign
  });
});