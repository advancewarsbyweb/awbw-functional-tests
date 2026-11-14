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

Cypress.Commands.add('logoutFrontend', () => {
  cy.get(homepageSelectors.profileMenu).realHover();
  cy.get(homepageSelectors.logoutLink).should('be.visible').click();
});

Cypress.Commands.add(
  'createGame',
  (baseUrl: string, gameName: string, prefsId: string, gamePassword: string = 'asdf') => {
    cy.visit(`${baseUrl}/create.php?prefs_id=${prefsId}`);
    cy.get('input[name="game_name"]').type(gameName);
    cy.get('input[name="game_password"]').type(gamePassword);
    cy.get('input[name="create"]').click();
    cy.url()
      .should('include', '/yourgames.php#game_')
      .then((url) => {
        const gameID = new URL(url).hash.replace('#game_', '');
        cy.log(`Created gameID: ${gameID}`);
        return cy.wrap(gameID);
      });
  }
);

// Note: Command might only work with one active game at a time.
Cypress.Commands.add('deleteGame', (baseUrl: string, gameID: string) => {
  cy.visit(`${baseUrl}/yourgames.php#game_${gameID}`);
  cy.xpath(`//b[text()='Delete Game']`).click({ multiple: true });
});

// For Selecting a Specific CO after creating a game
Cypress.Commands.add('selectCO', (baseUrl: string, gameName: string, coNames: string[]) => {
  cy.visit(`${baseUrl}/yourgames.php`);

  cy.get('[id^="game_"][id$="_co_selector"]')
    .should('have.length', coNames.length)
    // Process done for each Player (This assumes a hotseat game where the bot is both P1 and P2)
    .each(($selector, index) => {
      const sel = `#${$selector.attr('id')}`;
      const coName = coNames[index];

      // Wait until Vue has mounted and rendered the current CO
      cy.get(`${sel} .do-game-co-image .co-tooltip-title`)
        .should(($title) => {
          expect($title.text().trim(), 'CO data rendered').to.not.be.empty;
        })
        .then(($title) => {
          // Case 1: CO selected is the one we already want
          if ($title.text().trim() === coName) return;

          // Case 2: CO must be selected from the CO Select Window
          cy.get(`${sel} .do-game-co-image img.co_portrait`).click();
          cy.get(`${sel} .co_selector_window`)
            .should('be.visible')
            .find('.co-tooltip-title')
            .filter((_i, el) => el.textContent?.trim() === coName)
            .should('have.length', 1)
            .closest('a')
            .click();
        });

      // Check that CO selected is the correct one
      cy.get(`${sel} .do-game-co-image .co-tooltip-title`).should(($title) => {
        expect($title.text().trim()).to.eq(coName);
      });
      // Close down the CO Select Window
      cy.get(`${sel} .co_selector_window`).should('not.exist');
    });
});

Cypress.Commands.add('enterGame', (baseUrl: string, gameName: string) => {
  cy.visit(`${baseUrl}/yourgames.php`);
  cy.contains(gameName).click();
  cy.url().should('include', '/game.php');
});

Cypress.Commands.add('resign', (password: string) => {
  cy.contains('Menu').click();
  cy.contains('Resign').click();
  cy.get('input[type="password"]').type(password);
  cy.get('.resign-conf-btn').click();
});

// unit string REQUIRED for airports
Cypress.Commands.add('buildUnitOnNthBuilding', (position: number, unit: string = 'Infantry') => {
  cy.get(`.game-building`).eq(position).click();
  cy.contains(unit).click();
});

// useful for making infantry capture specific properties
Cypress.Commands.add(
  'moveNthUnitAndPerformActionOnNthBuilding',
  (unitPosition: number, buildingPosition: number, actionNumber: number) => {
    cy.get(`.game-unit`).eq(unitPosition).click();
    cy.get(`.movement-tile`).invoke('css', 'display', 'none');
    cy.get(`.game-building`).eq(buildingPosition).click();
    cy.get(`.menu-option`).eq(actionNumber).click(); // capt button
  }
);

// to be used for tests such as deleting units
Cypress.Commands.add(
  'doubleClickNthUnitAndPerformAction',
  (unitPosition: number, actionNumber: number) => {
    cy.get(`.game-unit`).eq(unitPosition).dblclick();
    cy.get(`.menu-option`).eq(actionNumber).click(); // capt button
  }
);

// To be used for attacking
Cypress.Commands.add(
  'attackWithNthUnit',
  (unitPosition: number) => {
    cy.get('.game-unit')
    .eq(unitPosition)
    .click() // First select the unit
    .then(($unit) => {
      const before = $unit[0].outerHTML;

      // Attack the first enemy unit it detects (My guess is it registers top-left to bottom right and going through rows)
      cy.get('.dmg-square').first().dblclick();

      // Checks Sprite changes in the unit (In Waited mode)
      cy.get('.game-unit')
        .eq(unitPosition)
        .should(($after) => {
          expect($after[0].outerHTML, 'unit changed after attack').to.not.eq(before);
        });
    });
  }
);


Cypress.Commands.add('endTurn', () => {
  cy.get(`#end-turn`).click();
  cy.get(`.end-turn-conf-btn`).click();
  cy.wait(6000); // end turn popup cycle
});
