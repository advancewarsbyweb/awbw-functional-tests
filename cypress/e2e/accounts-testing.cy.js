const { it } = require("mocha")

describe('test-login', () => {
    let data;
    before(function () {
        cy.fixture('setup-data').then((fdata) => {
            data = fdata;
            cy.visit(data.TestURL);
        });
    })

    it('Users can login to accounts through the UI', function() {
        cy.get('#login-button').click();
        cy.get('#login-tab > .login-form > .login-input[type="text"]').type(data.StandardAccount);
        cy.get('#login-tab > .login-form > .login-input[type="password"]').type(data.StandardAccountPass); //DO NOT STORE NON-THROWAWAY ACCOUNTS IN THE SETUP-DATA FIXTURE.
        cy.get('#login').click();
        cy.get('#profile-menu > [title="'+data.StandardAccount+'"]').invoke('attr', 'title').should('equal', data.StandardAccount);
    })
  })