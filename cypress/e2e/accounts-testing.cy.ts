import { it } from 'mocha';

describe('test-login', () => {
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

  it('Users can login to accounts through the UI', function () {
    cy.loginFrontend(accountData.StandardAccount, accountData.StandardAccountPass);

    // profile data that appears replacing login button
    cy.get('#profile-menu > [title="' + accountData.StandardAccount + '"]')
      .invoke('attr', 'title')
      .should('equal', accountData.StandardAccount);
  });
});
