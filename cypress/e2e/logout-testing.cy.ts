import { it } from 'mocha';

describe('test-logout', () => {
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

  it('Users can logout from their account through the UI', function () {
    // First login
    cy.loginFrontend(accountData.StandardAccount, accountData.StandardAccountPass);

    // Verify user is logged in by checking profile menu exists with username
    cy.get('#profile-menu > [title="' + accountData.StandardAccount + '"]')
      .invoke('attr', 'title')
      .should('equal', accountData.StandardAccount);

    // Perform logout
    cy.logoutFrontend();

    // Verify user is logged out by checking login button is visible again
    cy.get('#login-button').should('be.visible');
  });
});
