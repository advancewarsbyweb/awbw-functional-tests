import { it } from 'mocha';
import { v4 as uuidv4 } from 'uuid';

describe('activate-powers', () => {
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
    // Step 0: Login
    cy.visit(data.TestURL);
    cy.loginFrontend(accountData.StandardAccount, accountData.StandardAccountPass);
  });

  it('User can activate COP', () => {
    const uuid = uuidv4();
    // Step 1: Create a game and Join in
    cy.createGame(data.TestURL, uuid, data.MapOnePrefsId);
    cy.contains('Join Again As Another Country (Hotseat)').click();
    cy.get('.submit').click();
    cy.selectCO(data.TestURL, uuid, ["Adder", "Koal"])
    cy.contains('Start Game').click();
    cy.contains(uuid).should('be.visible');
    cy.enterGame(data.TestURL, uuid);

    // Step 2: Build up charge
    // Note: Unit Positions are randomly valued, so it has to select the friendly units by RNG
    cy.attackWithNthUnit(0);
    cy.attackWithNthUnit(1);
    cy.attackWithNthUnit(2);
    cy.attackWithNthUnit(3);
    cy.attackWithNthUnit(4);
    

    // Step 3: Activate powers (choose which one you want it to click) and resign
    cy.get('.cop-button').first().click() // COP
    //cy.get('.scop-button').first().click() // SCOP
    cy.resign(accountData.StandardAccountPass);


    // Check that Active Power is shown on screen
    cy.contains('Power').should('be.visible'); // To check for COP
    //cy.contains('Super').should('be.visible'); // To check for SCOP
  });
});
