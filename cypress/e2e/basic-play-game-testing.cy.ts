import { it } from 'mocha';
import { v4 as uuidv4 } from 'uuid';

describe('gameplay-tests', () => {
  let data: { TestURL: string; MapOnePrefsId: string };
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
    cy.loginFrontend(accountData.StandardAccount, accountData.StandardAccountPass);
  });

  it('Basic Build, Move, and HQ Win Test', () => {
    const uuid = uuidv4();
    // game creation and joining
    cy.createGame(data.TestURL, uuid, data.MapOnePrefsId);
    cy.contains('Join Again As Another Country (Hotseat)').click();
    cy.get('.submit').click();
    cy.contains('Start Game').click();
    cy.contains(uuid).should('be.visible');
    cy.enterGame(data.TestURL, uuid);

    // building and moving units
    cy.buildUnitOnNthBuilding(0);
    cy.endTurn();
    cy.endTurn();
    cy.moveNthUnitAndPerformActionOnNthBuilding(0, 1, 0) // capture HQ
    cy.endTurn()
    cy.endTurn()
    cy.doubleClickNthUnitAndPerformAction(0, 0) //capture HQ
    cy.contains(`Victory`).should('be.visible');
  });
});
