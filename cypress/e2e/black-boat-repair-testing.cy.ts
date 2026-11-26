import { v4 as uuidv4 } from 'uuid';

// Tiles on test_maps/TestMapBlackBoat_01 (x, y from the top left)
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

  it('Black Boat repair without the funds for 1 HP repairs nothing', function () {
    if (!data.BlackBoatMapId) {
      this.skip();
    }
    const uuid = uuidv4();
    cy.createGameWithFunds(data.TestURL, uuid, `maps_id=${data.BlackBoatMapId}`, 1000, 12000).then(
      (gameID: string) => {
        cy.joinAgainAsAnotherCountry(data.TestURL, gameID);
        cy.setCOForAllPlayers(data.TestURL, gameID, ANDY);
        cy.startGame(data.TestURL, gameID);
        cy.contains(uuid).should('be.visible');
        cy.enterGame(data.TestURL, uuid);

        // Day 1
        cy.buildUnitAt(OS_PORT.x, OS_PORT.y, 'Black Boat');
        cy.buildUnitAt(OS_BASE.x, OS_BASE.y, 'Tank');
        cy.endTurn();
        cy.buildUnitAt(BM_BASE.x, BM_BASE.y, 'Tank');
        cy.endTurn();

        // Day 2
        cy.moveUnitAndChoose(OS_BASE.x, OS_BASE.y, BESIDE_PORT.x, BESIDE_PORT.y, 'Wait');
        cy.endTurn();
        cy.reloadGame(); // so the moved Tank is found at its new position
        cy.moveUnitAndChoose(BM_BASE.x, BM_BASE.y, BELOW_THAT.x, BELOW_THAT.y, 'Fire');
        cy.fireAt(BESIDE_PORT.x, BESIDE_PORT.y);
        cy.endTurn();

        // Day 3: 500 funds left, less than the 700 that 1 HP of a Tank costs
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

          // Day 4: now it can pay
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
