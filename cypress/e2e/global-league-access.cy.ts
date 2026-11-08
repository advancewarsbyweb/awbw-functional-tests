import { it } from 'mocha';

describe('global-league-access', () => {
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

  it('User can access Global League and click on all the options', () => {
    // Step 1: Login
    cy.loginFrontend(accountData.StandardAccount, accountData.StandardAccountPass);

    // Step 2: Access Global League 
    cy.visit(data.TestURL + 'newleague.php');

    // Step 3: Interact with elements to set desired game count and game mode (excluding the 'Update' button)
    // Select the desired game count to 3
    cy.get('select[name="games"]').select('3');

    // Click the Standard, Fog of War, and High Funds checkboxes
    cy.get('input[name="game_type[]"][value="0"]').click(); // Standard
    cy.get('input[name="game_type[]"][value="1"]').click(); // Fog of War
    cy.get('input[name="game_type[]"][value="2"]').click(); // High Funds
    

    // Verify the Desired Game Count is equal to 3 AND Check the game mode checkboxes have been unchecked 
    cy.get('select[name="games"]').should('have.value', '3');
    cy.get('input[name="game_type[]"][value="0"]').should('not.be.checked');
    cy.get('input[name="game_type[]"][value="1"]').should('not.be.checked');
    cy.get('input[name="game_type[]"][value="2"]').should('not.be.checked');
  });
});