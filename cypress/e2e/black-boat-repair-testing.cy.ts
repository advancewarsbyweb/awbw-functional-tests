import { v4 as uuidv4 } from 'uuid';

// On test_maps/TestMapBlackBoat_01 (6x5; AWBW needs 5x5 or more): a row of Sea on top; below it Orange Star's Port (0, 1),
// Base (2, 1) and HQ (0, 2), and Blue Moon's Base (4, 1) and HQ (5, 2). Orange Star owns three
// properties, Blue Moon two. Orange Star moves first.
const OS_PORT = { x: 0, y: 1 };
const OS_BASE = { x: 2, y: 1 };
const BM_BASE = { x: 4, y: 1 };
const BESIDE_PORT = { x: 1, y: 1 };
const BELOW_THAT = { x: 1, y: 2 };
const ANDY = 1;

describe('black-boat-repair-tests', () => {
  let data: { TestURL: string; BlackBoatMapId: string };
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

  // A Black Boat's Repair gives an adjacent unit 1 HP for 10% of its price. When the player
  // can't pay for that point, the unit gets no HP and nothing is charged (it is still
  // resupplied). With 1000 funds per property Orange Star earns 3000 a turn.
  // Note: if running this in production, delete the game after testing.
  it('Black Boat repair without the funds for 1 HP repairs nothing', function () {
    if (!data.BlackBoatMapId) {
      this.skip(); // needs test_maps/TestMapBlackBoat_01 uploaded and its id in setup-data
    }
    const uuid = uuidv4();
    cy.createGameWithFunds(data.TestURL, uuid, `maps_id=${data.BlackBoatMapId}`, 1000, 12000).then(
      (gameID: string) => {
        cy.joinAgainAsAnotherCountry(data.TestURL, gameID);
        cy.setCOForAllPlayers(data.TestURL, gameID, ANDY);
        cy.startGame(data.TestURL, gameID);
        cy.contains(uuid).should('be.visible');
        cy.enterGame(data.TestURL, uuid);

        // Day 1: Orange Star has 15000 and buys a Black Boat and a Tank, keeping 500
        cy.buildUnitAt(OS_PORT.x, OS_PORT.y, 'Black Boat');
        cy.buildUnitAt(OS_BASE.x, OS_BASE.y, 'Tank');
        cy.endTurn();
        cy.buildUnitAt(BM_BASE.x, BM_BASE.y, 'Tank');
        cy.endTurn();

        // Day 2: Orange Star's Tank steps next to the Port; Blue Moon's Tank hits it for 49-57%
        cy.moveUnitAndChoose(OS_BASE.x, OS_BASE.y, BESIDE_PORT.x, BESIDE_PORT.y, 'Wait');
        cy.endTurn();
        cy.reloadGame(); // so the moved Tank is found at its new position
        cy.moveUnitAndChoose(BM_BASE.x, BM_BASE.y, BELOW_THAT.x, BELOW_THAT.y, 'Fire');
        cy.fireAt(BESIDE_PORT.x, BESIDE_PORT.y);
        cy.endTurn();

        // Day 3: Orange Star has 6500 and spends 6000 on an Artillery, leaving 500, short of the
        // 700 that 1 HP of a Tank costs
        cy.reloadGame();
        cy.displayedHpAt(BESIDE_PORT.x, BESIDE_PORT.y).then((hpAfterHit) => {
          expect(hpAfterHit).to.be.within(5, 6);
          cy.buildUnitAt(OS_BASE.x, OS_BASE.y, 'Artillery');
          cy.actInPlace(OS_PORT.x, OS_PORT.y, 'Repair');
          cy.repairAt(BESIDE_PORT.x, BESIDE_PORT.y);
          cy.reloadGame();
          cy.fundsOf('os').should('equal', 500);
          cy.displayedHpAt(BESIDE_PORT.x, BESIDE_PORT.y).should('equal', hpAfterHit);
          cy.endTurn();
          cy.endTurn();

          // Day 4: with 3500 the repair goes through: 1 HP for 700
          cy.reloadGame();
          cy.actInPlace(OS_PORT.x, OS_PORT.y, 'Repair');
          cy.repairAt(BESIDE_PORT.x, BESIDE_PORT.y);
          cy.reloadGame();
          cy.fundsOf('os').should('equal', 2800);
          cy.displayedHpAt(BESIDE_PORT.x, BESIDE_PORT.y).should('equal', hpAfterHit + 1);
        });
      }
    );
  });
});
