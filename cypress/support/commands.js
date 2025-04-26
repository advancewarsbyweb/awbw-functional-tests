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
import homepageSelectors from "../support/selectors/homepageSelectors";
Cypress.Commands.add("login", (username, password) => {
  cy.visit("http://localhost");
  cy.get(homepageSelectors.loginDropdown).click();
  cy.get(homepageSelectors.userNameField).type(username);
  cy.get(homepageSelectors.passwordField).type(password);
  cy.get(homepageSelectors.loginButton).click();

  cy.get('#profile-menu > [title="' + username + '"]')
    .invoke("attr", "title")
    .should("equal", username);
});

Cypress.Commands.add("createGame", (gameName) => {
  cy.visit("http://localhost/create.php?prefs_id=1");
  //cy.get('#main > table > input[name="load_map2"]').click();
  cy.get('input[name="game_name"]').type(gameName);
  cy.get('input[name="create"]').click();
  //cy.url().should('include', '/create.php?maps_id=')
  cy.url()
    .should("include", "/yourgames.php#game_")
    .then((url) => {
      const gameID = new URL(url).hash.replace("#game_", "");
      cy.log(`Created gameID: ${gameID}`);
      return cy.wrap(gameID);
    });
});

Cypress.Commands.add("readyTopGame", () => {
  cy.visit("http://localhost/yourgames.php");
  cy.get(
    "#do-game-player-row > div.do-game-extras > div:nth-child(2) > div > .norm2",
  )
    .first()
    .click();
  cy.on("window:confirm", (message) => true);
  cy.url().should("include", "&ready=1");
});

Cypress.Commands.add("joinGame", (gameID) => {
  cy.visit(`http://localhost/join.php?games_id=${gameID}`);
  cy.get('input[name="JOIN"]').click();
  cy.url().should("include", `/yourgames.php#game_${gameID}`);
});

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
