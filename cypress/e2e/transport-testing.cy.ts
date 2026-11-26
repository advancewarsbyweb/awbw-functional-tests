import { v4 as uuidv4 } from 'uuid';

// On test_maps/TestMapTransports_01 (8x6): two rows of Sea on top; below them Orange Star's Port
// (0, 2), Airport (2, 2), Bases (4, 2) and (4, 3) and HQ (0, 3), and Blue Moon's Base (7, 2)
// and HQ (7, 3). With 1000 funds per property Orange Star earns 5000 a turn and Blue Moon 2000.
// Orange Star moves first.
const OS_PORT = { x: 0, y: 2 };
const OS_AIRPORT = { x: 2, y: 2 };
const OS_BASE = { x: 4, y: 2 };
const OS_BASE_2 = { x: 4, y: 3 };
const BM_BASE = { x: 7, y: 2 };
const SEA_BY_PORT = { x: 0, y: 1 };
const SEA_BY_AIRPORT = { x: 2, y: 1 };
const PLAIN = { x: 1, y: 3 };
const BESIDE_BM_BASE = { x: 6, y: 2 };
const ANDY = 1;

describe('transport-tests', () => {
  let data: { TestURL: string; TransportMapId: string };
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
    cy.loginFrontend(accountData.StandardAccount, accountData.StandardAccountPass);
  });

  // Ends Orange Star's turn and then Blue Moon's, who does nothing. Pages reload only after a
  // move or a turn change, and wait to be ready, to keep the load on AWBW low.
  const endDay = () => {
    cy.endTurn();
    cy.endTurn();
    cy.reloadGame();
  };

  // A T-Copter (like a Lander or Black Boat) can't unload while it is over Sea or Reef, even next
  // to land its cargo could stand on. A Cruiser can unload its copters at sea.
  // Note: if running this in production, delete the game after testing.
  it('T-Copter over Sea has no Unload; Cruiser at sea does', function () {
    if (!data.TransportMapId) {
      this.skip(); // needs test_maps/TestMapTransports_01 uploaded and its id in setup-data
    }
    const uuid = uuidv4();
    cy.createGameWithFunds(data.TestURL, uuid, `maps_id=${data.TransportMapId}`, 1000, 20000).then(
      (gameID: string) => {
        cy.joinAgainAsAnotherCountry(data.TestURL, gameID);
        cy.setCOForAllPlayers(data.TestURL, gameID, ANDY);
        cy.startGame(data.TestURL, gameID);
        cy.contains(uuid).should('be.visible');
        cy.enterGame(data.TestURL, uuid);

        // Day 1: an Infantry and a T-Copter
        cy.buildUnitAt(OS_BASE.x, OS_BASE.y, 'Infantry');
        cy.buildUnitAt(OS_AIRPORT.x, OS_AIRPORT.y, 'T-Copter');
        endDay();

        // Day 2: the Infantry boards the T-Copter; a Cruiser is built
        cy.moveUnitAndChoose(OS_BASE.x, OS_BASE.y, OS_AIRPORT.x, OS_AIRPORT.y, 'Load');
        cy.reloadGame();
        cy.cargoAt(OS_AIRPORT.x, OS_AIRPORT.y).should('deep.equal', ['Infantry']);
        cy.buildUnitAt(OS_PORT.x, OS_PORT.y, 'Cruiser');
        endDay();

        // Day 3: the T-Copter flies out over the Sea beside the empty Airport and waits. Clicked
        // again, a moved transport opens an Unload menu where its cargo could get off; here none.
        cy.moveUnitAndChoose(
          OS_AIRPORT.x,
          OS_AIRPORT.y,
          SEA_BY_AIRPORT.x,
          SEA_BY_AIRPORT.y,
          'Wait'
        );
        cy.reloadGame();
        cy.unitAt(SEA_BY_AIRPORT.x, SEA_BY_AIRPORT.y).click();
        cy.menuOptions().should('deep.equal', []);
        cy.reloadGame();
        cy.moveUnitAndChoose(OS_PORT.x, OS_PORT.y, SEA_BY_PORT.x, SEA_BY_PORT.y, 'Wait');
        cy.reloadGame();
        cy.buildUnitAt(OS_AIRPORT.x, OS_AIRPORT.y, 'B-Copter');
        endDay();

        // Day 4: over land the same T-Copter gets Unload; a B-Copter boards the Cruiser at sea
        cy.moveUnitAndChoose(SEA_BY_AIRPORT.x, SEA_BY_AIRPORT.y, PLAIN.x, PLAIN.y, 'Wait');
        cy.reloadGame();
        cy.unitAt(PLAIN.x, PLAIN.y).click();
        cy.menuOptions().should('deep.equal', ['Unload']);
        cy.reloadGame();
        cy.moveUnitAndChoose(OS_AIRPORT.x, OS_AIRPORT.y, SEA_BY_PORT.x, SEA_BY_PORT.y, 'Load');
        cy.reloadGame();
        cy.cargoAt(SEA_BY_PORT.x, SEA_BY_PORT.y).should('deep.equal', ['B-Copter']);
        endDay();

        // Day 5: the Cruiser, at sea, can unload
        cy.unitAt(SEA_BY_PORT.x, SEA_BY_PORT.y).dblclick();
        cy.menuOptions().should('include', 'Unload');
      }
    );
  });

  // A transport carrying a unit can't join another of its kind, even a damaged one: moving onto it
  // offers no Join (here no menu at all). An empty one of the same kind can.
  // Note: if running this in production, delete the game after testing.
  it('A loaded APC has no Join; an empty one does', function () {
    if (!data.TransportMapId) {
      this.skip(); // needs test_maps/TestMapTransports_01 uploaded and its id in setup-data
    }
    const uuid = uuidv4();
    cy.createGameWithFunds(data.TestURL, uuid, `maps_id=${data.TransportMapId}`, 1000, 10000).then(
      (gameID: string) => {
        cy.joinAgainAsAnotherCountry(data.TestURL, gameID);
        cy.setCOForAllPlayers(data.TestURL, gameID, ANDY);
        cy.startGame(data.TestURL, gameID);
        cy.contains(uuid).should('be.visible');
        cy.enterGame(data.TestURL, uuid);

        // Day 1: Orange Star buys two APCs, Blue Moon a Tank
        cy.buildUnitAt(OS_BASE.x, OS_BASE.y, 'APC');
        cy.buildUnitAt(OS_BASE_2.x, OS_BASE_2.y, 'APC');
        cy.endTurn();
        cy.buildUnitAt(BM_BASE.x, BM_BASE.y, 'Tank');
        cy.endTurn();
        cy.reloadGame();

        // Day 2: one APC drives up to the Tank, which hits it from its Base
        cy.moveUnitAndChoose(OS_BASE.x, OS_BASE.y, BESIDE_BM_BASE.x, BESIDE_BM_BASE.y, 'Wait');
        cy.reloadGame();
        cy.buildUnitAt(OS_BASE.x, OS_BASE.y, 'Infantry');
        cy.endTurn();
        cy.reloadGame();
        cy.actInPlace(BM_BASE.x, BM_BASE.y, 'Fire');
        cy.fireAt(BESIDE_BM_BASE.x, BESIDE_BM_BASE.y);
        cy.endTurn();
        cy.reloadGame();
        cy.displayedHpAt(BESIDE_BM_BASE.x, BESIDE_BM_BASE.y).should('be.lessThan', 10);

        // Day 3: the Infantry boards the other APC, which then can't join the damaged one
        cy.moveUnitAndChoose(OS_BASE.x, OS_BASE.y, OS_BASE_2.x, OS_BASE_2.y, 'Load');
        cy.reloadGame();
        cy.cargoAt(OS_BASE_2.x, OS_BASE_2.y).should('deep.equal', ['Infantry']);
        cy.clickMoveTo(OS_BASE_2.x, OS_BASE_2.y, BESIDE_BM_BASE.x, BESIDE_BM_BASE.y);
        cy.menuOptions().should('deep.equal', []);
        cy.reloadGame();
        cy.buildUnitAt(OS_BASE.x, OS_BASE.y, 'APC');
        endDay();

        // Day 4: a new, empty APC moving onto the same damaged APC is offered Join
        cy.moveUnitTo(OS_BASE.x, OS_BASE.y, BESIDE_BM_BASE.x, BESIDE_BM_BASE.y);
        cy.menuOptions().should('include', 'Join');
      }
    );
  });
});
