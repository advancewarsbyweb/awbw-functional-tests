import { it } from 'mocha';

describe('search-user', () => {
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

  it('Users can search for users using the Community -> Search Users UI', function () {
    const targetUsername = accountData.StandardAccount; // Type the player you want to find

    // Step 1: Login
    cy.loginFrontend(accountData.StandardAccount, accountData.StandardAccountPass);

    // Step 2: Search Users 
    cy.visit(data.TestURL + 'users.php');
    cy.get('#search-text').type(targetUsername); // Type in the target username
    cy.wait(3000) // Wait for user profiles to load
    cy.get('a').contains(targetUsername).should('be.visible'); // Check that it can be found

    // Step 3: Click on Target Username (loads profile)
    cy.get('a').contains(targetUsername).click();

    // User profile loaded is the same as the one that was typed in by the user
    cy.url().should('contains', targetUsername);
  });
});
