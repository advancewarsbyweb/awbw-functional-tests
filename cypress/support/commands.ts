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
  cy.get(homepageSelectors.passwordField).type(password, { log: false }); //DO NOT STORE NON-THROWAWAY ACCOUNT PASSWORDS IN THE SETUP-DATA FIXTURE.
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

Cypress.Commands.add('enterGame', (baseUrl: string, gameName: string) => {
  cy.visit(`${baseUrl}/yourgames.php`);
  cy.contains(gameName).click();
  cy.url().should('include', '/game.php');
});

Cypress.Commands.add('resign', (password: string) => {
  cy.contains('Menu').click();
  cy.contains('Resign').click();
  cy.get('input[type="password"]').type(password, { log: false });
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

// Wait until the game page's socket is open and its damage table has loaded
Cypress.Commands.add('waitForGameSocket', () => {
  cy.window({ timeout: 20000 }).should((win) => {
    expect((win as unknown as { webSocket?: WebSocket }).webSocket?.readyState).to.equal(1);
    const damage = (win as unknown as { eval: (code: string) => unknown }).eval(
      'typeof baseDamageValues === "undefined" ? undefined : baseDamageValues'
    );
    expect(damage, 'damage table loaded').to.have.property('ATTACK1');
  });
});

// Reload and wait for the page to finish setting up (menus opened before then get closed)
Cypress.Commands.add('reloadGame', () => {
  cy.intercept('POST', '**/api/game/fetch_actions.php').as('fetchActions');
  cy.reload();
  cy.wait('@fetchActions', { timeout: 20000 });
  cy.waitForGameSocket();
  cy.wait(1000);
});

Cypress.Commands.add('endTurn', () => {
  cy.waitForGameSocket();
  cy.get(`#end-turn`).click();
  cy.get(`.end-turn-conf-btn`).click();
  cy.wait(6000); // end turn popup cycle
});

// Like createGame, with funds settings. mapQuery is e.g. `maps_id=12345`
Cypress.Commands.add(
  'createGameWithFunds',
  (
    baseUrl: string,
    gameName: string,
    mapQuery: string,
    funds: number,
    startingFunds: number,
    gamePassword: string = 'asdf'
  ) => {
    cy.visit(`${baseUrl}/create.php?${mapQuery}`);
    // Changing funds reloads the form, unless it's already selected
    cy.get('select[name="funds"]').then((sel) => {
      if (sel.val() === String(funds)) return;
      cy.window().then(
        (win) => ((win as unknown as { beforeReload?: boolean }).beforeReload = true)
      );
      cy.get('select[name="funds"]').select(String(funds));
      cy.window().should((win) => {
        expect((win as unknown as { beforeReload?: boolean }).beforeReload).to.equal(undefined);
      });
    });
    cy.get('select[name="funds"]').should('have.value', String(funds));
    cy.get('select[name="starting_funds"]').select(String(startingFunds));
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

// Set every player's CO before the game starts (1 is Andy)
Cypress.Commands.add('setCOForAllPlayers', (baseUrl: string, gameID: string, coID: number) => {
  cy.visit(`${baseUrl}/yourgames.php#game_${gameID}`);
  cy.get(`[id^="game_${gameID}_p_"][id$="_co_selector"]`).each(($selector) => {
    const playerID = Number($selector.attr('id')!.split('_')[3]);
    cy.request('POST', `${baseUrl}/api/game/info.php`, {
      method: 'updateCO',
      id: Number(gameID),
      coID,
      playerID,
    })
      .its('body')
      .should('equal', true);
  });
  cy.reload();
});

// The page's unitsInfo, read with eval since it's declared with `let`
type UnitsInfo = Record<string, Record<string, unknown> & { units_x: number; units_y: number }>;
const unitsInfoOf = (win: Window): UnitsInfo | undefined =>
  (win as unknown as { eval: (code: string) => UnitsInfo | undefined }).eval(
    'typeof unitsInfo === "undefined" ? undefined : unitsInfo'
  );

// data-x/data-y go stale after moves, so find the unit through unitsInfo
Cypress.Commands.add('unitAt', (x: number, y: number) => {
  const idAt = (win: Window) => {
    const units = unitsInfoOf(win) ?? {};
    return Object.keys(units).find(
      // skip units inside transports
      (k) =>
        units[k] &&
        units[k].units_carried !== 'Y' &&
        +units[k].units_x === x &&
        +units[k].units_y === y
    );
  };
  return cy
    .window()
    .should((win) => {
      expect(idAt(win), `a unit at (${x}, ${y})`).not.to.equal(undefined);
    })
    .then((win) => cy.get(`span[data-unit-id="${idAt(win)}"]`));
});

Cypress.Commands.add('buildUnitAt', (x: number, y: number, unit: string) => {
  cy.waitForGameSocket();
  cy.get('body').then(($body) => {
    const before = $body.find('.game-unit').length;
    // force: the HQ image can overlap the next tile
    cy.get(`.game-building[data-x="${x}"][data-y="${y}"]`).click({ force: true });
    // exact name, so 'Tank' doesn't match Md.Tank
    cy.get('.build-options-game li.menu-option')
      .filter(shown)
      .contains(new RegExp(`^\\s*${unit}\\s*\\d`))
      .click({ force: true });
    cy.get('.game-unit', { timeout: 15000 }).should('have.length', before + 1);
  });
  cy.unitAt(x, y).should('exist');
});

// Visible menu options. Click them with force: Cypress calls menus near the map edge hidden
const shown = (_: number, el: HTMLElement) => el.offsetParent !== null;

// Select a unit and click a tile to move to. The page builds the path from mouse position,
// so send a positioned mousemove first
Cypress.Commands.add('clickMoveTo', (fromX: number, fromY: number, toX: number, toY: number) => {
  cy.waitForGameSocket();
  cy.unitAt(fromX, fromY).click();
  const tile = `.movement-tile[style*="left: ${toX * 16 - 1}px"][style*="top: ${toY * 16 - 1}px"]`;
  cy.get(tile).should('exist');
  cy.window().then((w) => {
    const r = w.document.querySelector('#map-background')!.getBoundingClientRect();
    const [x, y] = [r.left + toX * 16 + 8, r.top + toY * 16 + 8];
    cy.get('#gamemap').trigger('mousemove', {
      eventConstructor: 'MouseEvent',
      clientX: x,
      clientY: y,
      pageX: x + w.scrollX,
      pageY: y + w.scrollY,
      force: true,
    });
  });
  cy.get(tile).first().click({ force: true });
});

// Move a unit and leave its action menu open
Cypress.Commands.add('moveUnitTo', (fromX: number, fromY: number, toX: number, toY: number) => {
  cy.clickMoveTo(fromX, fromY, toX, toY);
  cy.get('.unit-options-game .menu-option').filter(shown).should('not.have.length', 0);
});

// Names of the open menu's options ([] if none)
Cypress.Commands.add('menuOptions', () => {
  return cy
    .get('.unit-options-game')
    .then(($menus) =>
      Cypress._.map($menus.find('.menu-option').filter(shown), (o) => o.innerText.trim())
    );
});

// Pick an action in the open unit menu
Cypress.Commands.add('chooseAction', (action: string) => {
  cy.get('.unit-options-game .menu-option').filter(shown).contains(action).click({ force: true });
});

// Wait for the server to apply a move; reloading earlier loses it
Cypress.Commands.add('waitUntilMovedFrom', (x: number, y: number) => {
  cy.window({ timeout: 15000 }).should((win) => {
    const units = unitsInfoOf(win) ?? {};
    const left = Object.values(units).some(
      (u) => u && u.units_carried !== 'Y' && +u.units_x === x && +u.units_y === y
    );
    expect(left, `unit gone from (${x}, ${y})`).to.equal(false);
  });
});

// Move a unit and pick an action
Cypress.Commands.add(
  'moveUnitAndChoose',
  (fromX: number, fromY: number, toX: number, toY: number, action: string) => {
    cy.moveUnitTo(fromX, fromY, toX, toY);
    cy.chooseAction(action);
    // Fire waits for fireAt
    if (action !== 'Fire') {
      cy.waitUntilMovedFrom(fromX, fromY);
    }
  }
);

// Names of the units a transport carries
Cypress.Commands.add('cargoAt', (x: number, y: number) => {
  return cy.unitAt(x, y).then(($unit) =>
    cy.window().then((win) => {
      const units = unitsInfoOf(win) ?? {};
      const transport: Record<string, unknown> = units[$unit.attr('data-unit-id')!] ?? {};
      return ['units_cargo1_units_id', 'units_cargo2_units_id']
        .map((k) => transport[k])
        .filter((id) => id && Number(id) > 0)
        .map((id) => String(units[String(id)]?.units_name));
    })
  );
});

// Pick an action without moving
Cypress.Commands.add('actInPlace', (x: number, y: number, action: string) => {
  cy.waitForGameSocket();
  cy.unitAt(x, y).dblclick();
  cy.chooseAction(action);
});

// After choosing Fire, click the target
Cypress.Commands.add('fireAt', (x: number, y: number) => {
  cy.unitAt(x, y)
    .invoke('attr', 'data-unit-id')
    .then((targetID) => {
      cy.get(`.dmg-square[data-attack-uid="${targetID}"]`).click({ force: true });
      // the HP icon appears once the damaged target is below 10
      cy.get(`.game-unit[data-unit-id="${targetID}"] .unit-ricon`).should('be.visible');
    });
});

// After choosing Repair, click the unit
Cypress.Commands.add('repairAt', (x: number, y: number) => {
  cy.unitAt(x, y)
    .invoke('attr', 'data-unit-id')
    .then((targetID) => {
      cy.get(`.repair-square[data-repair-id="${targetID}"]`).click({ force: true });
      cy.get('.repair-square').should('not.exist');
      // a refused repair changes nothing on the page, so just wait
      cy.wait(3000);
    });
});

// HP shown on the map (no icon means 10)
Cypress.Commands.add('displayedHpAt', (x: number, y: number) => {
  return cy
    .unitAt(x, y)
    .find('.unit-ricon')
    .then(($icon) => {
      if (!$icon.is(':visible')) return 10;
      const hp = /\/(\d+)\.gif/.exec($icon.attr('src') ?? '');
      expect(hp, 'HP icon').to.not.equal(null);
      return Number(hp![1]);
    });
});

// Funds of a country by code: 'os', 'bm', ...
Cypress.Commands.add('fundsOf', (country: string) => {
  return cy
    .get(`img.player-country-logo[src*="/${country}logo"]`)
    .closest('.player-overview-container')
    .find('.player-funds')
    .invoke('text')
    .then((text) => Number(text.replace(/\D/g, '')));
});

// Join a game again as the next country (hot seat)
Cypress.Commands.add(
  'joinAgainAsAnotherCountry',
  (baseUrl: string, gameID: string, coID: number = 1) => {
    cy.visit(`${baseUrl}/yourgames.php#game_${gameID}`);
    cy.get(`a[href^="join.php?games_id=${gameID}&"]`)
      .contains('Join Again As Another Country (Hotseat)')
      .click();
    cy.get('input[name="co_id"]').invoke('val', String(coID));
    cy.get('.submit').click();
    cy.url().should('not.include', 'join.php');
  }
);

Cypress.Commands.add('startGame', (baseUrl: string, gameID: string) => {
  cy.visit(`${baseUrl}/yourgames.php#game_${gameID}`);
  cy.get(`a[onclick*="startURL${gameID})"]`).contains('Start Game').click();
});
