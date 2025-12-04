import { it } from 'mocha';

describe('create-game-tests', () => {
  let data: { TestURL: string };
  let accountData: { StandardAccount: string; StandardAccountPass: string };
  before(function () {
    cy.fixture('personal-automation-account.json').then((fdata) => {
      accountData = fdata;
    });

    cy.fixture('setup-data').then((fdata) => {
      data = fdata;
      cy.visit(data.TestURL);
    });
  });

  beforeEach(function () {
    cy.visit(data.TestURL);
  });

  // Note: If running this in production, delete the game after testing.
  it('Basic Create Game Test', () => {
    cy.loginFrontend(accountData.StandardAccount, accountData.StandardAccountPass);

    // create game method includes basic frontend assertions
    cy.createGame(data.TestURL, 'Normal_Game', '22313').then((game_id) => {
      // cleanup
      cy.deleteGame(data.TestURL, game_id);
    });
  });
});
