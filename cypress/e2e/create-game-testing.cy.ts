import { it } from 'mocha';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

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
    cy.createGame(data.TestURL, 'Normal_Game', '22313').then((game_id: string) => {
      // cleanup
      cy.deleteGame(data.TestURL, game_id);
    });
  });

  it('Basic Join and Resign Game Test', () => {
    var uuid = uuidv4();
    cy.loginFrontend(accountData.StandardAccount, accountData.StandardAccountPass);
    cy.createGame(data.TestURL, uuid, '22313');
    cy.contains('Join Again As Another Country (Hotseat)').click();
    cy.get('.submit').click();
    cy.contains('Start Game').click();
    cy.contains(uuid).should('be.visible');

    // @ts-ignore
    cy.enterGame(data.TestURL, uuid);
    // @ts-ignore
    cy.resign(accountData.StandardAccountPass);
  });
});
