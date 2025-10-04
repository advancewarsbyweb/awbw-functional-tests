const { it } = require("mocha")
import homepageSelectors from "../support/selectors/homepageSelectors";

describe('test-login', () => {
    let data;
    let accountData;
    before(function () {
        cy.fixture('personal-automation-account.json').then((fdata) => {
            accountData = fdata;
        });

        cy.fixture('setup-data').then((fdata) => {
            data = fdata;
            cy.visit(data.TestURL);
        });
    })

    it('Users can login to accounts through the UI', function() {
        cy.get(homepageSelectors.loginDropdown).click();
        cy.get(homepageSelectors.userNameField).type(accountData.StandardAccount);
        cy.get(homepageSelectors.passwordField).type(accountData.StandardAccountPass); //DO NOT STORE NON-THROWAWAY ACCOUNT PASSWORDS IN THE SETUP-DATA FIXTURE.
        cy.get(homepageSelectors.loginButton).click();
        
        //profile data that appears replacing login button
        cy.get('#profile-menu > [title="'+accountData.StandardAccount+'"]').invoke('attr', 'title').should('equal', accountData.StandardAccount);
    })
  })