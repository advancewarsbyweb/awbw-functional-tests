// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import homepageSelectors from "./selectors/homepageSelectors";
import * as data from "../fixtures/setup-data"

Cypress.Commands.add('loginFrontend', (email, password) => {
        cy.get(homepageSelectors.loginDropdown).click();
        cy.get(homepageSelectors.userNameField).type(data.StandardAccount);
        cy.get(homepageSelectors.passwordField).type(data.StandardAccountPass); //DO NOT STORE NON-THROWAWAY ACCOUNT PASSWORDS IN THE SETUP-DATA FIXTURE.
        cy.get(homepageSelectors.loginButton).click();
});

Cypress.Commands.add('createOneVsOneGame', () => {
    cy.request('POST', 
        "https://awbw.amarriner.com/create.php?maps_id=178725",
        "game_name=a&game_password=&comment=&maps_id=178725&weather=Clear&fog=N&co_powers=on&funds=1000&starting_funds=0&capture=1000&days=0&unit_limit=50&initialclock=7&unit_initial=days&increment=1&unit_increment=days&maxturn=7&unit_maxturn=days&main_co_tier=0&create=Create+Game&prefs_name=").then(res =>{
            cy.log(res)
        });
});