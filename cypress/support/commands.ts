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
import homepageSelectors from './selectors/homepageSelectors';

Cypress.Commands.add('loginFrontend', (email, password) => {
  cy.get(homepageSelectors.loginDropdown).click();
  cy.get(homepageSelectors.userNameField).type(email);
  cy.get(homepageSelectors.passwordField).type(password); //DO NOT STORE NON-THROWAWAY ACCOUNT PASSWORDS IN THE SETUP-DATA FIXTURE.
  cy.get(homepageSelectors.loginButton).click();
});

Cypress.Commands.add('createGame', (baseUrl: string, gameName: string, prefsId: string) => {
  cy.visit(`${baseUrl}/create.php?prefs_id=${prefsId}`);
  cy.get('input[name="game_name"]').type(gameName);
  cy.get('input[name="create"]').click();
  cy.url()
    .should('include', '/yourgames.php#game_')
    .then((url) => {
      const gameID = new URL(url).hash.replace('#game_', '');
      cy.log(`Created gameID: ${gameID}`);
      return cy.wrap(gameID);
    });
});

// Note: Command might only work with one active game at a time.
Cypress.Commands.add('deleteGame', (baseUrl: string, gameID: string) => {
  cy.visit(`${baseUrl}/yourgames.php#game_${gameID}`);
  cy.xpath(`//b[text()='Delete Game']`).click({ multiple: true });
});
