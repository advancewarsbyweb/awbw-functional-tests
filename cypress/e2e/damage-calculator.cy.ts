import calc from '../support/selectors/calculatorSelectors';

type Side = {
  co?: keyof typeof calc.co;
  power?: 'N' | 'Y' | 'S';
  unit: keyof typeof calc.unit;
  hp: number;
  terrain: keyof typeof calc.terrain;
};

// Fill one side ('a' attacker, 'd' defender) of the damage calculator form
function fillSide(prefix: 'a' | 'd', side: Side) {
  cy.get(`input[name="${prefix}_co"][value="${calc.co[side.co ?? 'Andy']}"]`).check();
  cy.get(`select[name="${prefix}_power"]`).select(side.power ?? 'N');
  cy.get(`input[name="${prefix}_unit"][value="${calc.unit[side.unit]}"]`).check();
  cy.get(`select[name="${prefix}_unit_hit_points"]`).select(String(side.hp));
  cy.get(`input[name="${prefix}_terrain"][value="${calc.terrain[side.terrain]}"]`).check();
}

// The results box covers part of the form once shown (the page also remembers the last
// result), so hide it before filling the form in again
function calculate(attacker: Side, defender: Side) {
  cy.get('body').then(($body) => {
    if ($body.find(`${calc.results}:visible`).length) {
      // What its [Hide Results] link does (the link's own href throws a script error)
      cy.get(calc.results).invoke('css', 'visibility', 'hidden');
    }
  });
  fillSide('a', attacker);
  fillSide('d', defender);
  cy.get('input[name="calculate"]').click();
  cy.get(calc.results).should('be.visible'); // the new page's box, not the hidden old one
}

// The damage calculator page needs no login. Each case below sits on a rounding or CO rule
// that is easy to get wrong when reimplementing the damage formula.
describe('damage-calculator', () => {
  let data: { TestURL: string };
  before(function () {
    cy.fixture('setup-data').then((fdata) => {
      data = fdata;
    });
  });

  beforeEach(function () {
    cy.visit(data.TestURL + 'calculator.php');
  });

  it('Damage at or above x.95 rounds up to the next whole percent', () => {
    // Best luck: 0.8 * (55 + 9) * 0.8 = 40.96, shown as 41 (truncating would give 40)
    calculate({ unit: 'Tank', hp: 8, terrain: 'Plain' }, { unit: 'Tank', hp: 10, terrain: 'Wood' });
    cy.get(calc.results).should('contain', 'Attack: 35% - 41%');
  });

  it('A hit worth 0.99 still does 1%', () => {
    // No luck: 1 * 1.0 * 0.99 (one star under a 1 HP defender) = 0.99, shown as 1
    calculate(
      { unit: 'Infantry', hp: 10, terrain: 'Plain' },
      { unit: 'Md.Tank', hp: 1, terrain: 'Plain' }
    );
    cy.get(calc.results).should('contain', 'Attack: 1% - 9%');
  });

  it('An exact x.95 on paper can fall just short in floating point', () => {
    // Best luck: 0.5 * (125 + 9) * 0.85 = 56.95 on paper, shown as 56
    calculate(
      { unit: 'Neotank', hp: 5, terrain: 'Plain' },
      { unit: 'Infantry', hp: 5, terrain: 'City' }
    );
    cy.get(calc.results).should('contain', 'Attack: 53% - 56%');

    // No luck: 0.5 * 85 * 0.94 = 39.95 on paper, shown as 39
    calculate(
      { unit: 'Tank', hp: 5, terrain: 'Plain' },
      { unit: 'Recon', hp: 6, terrain: 'Plain' }
    );
    cy.get(calc.results).should('contain', 'Attack: 39% - 44%');
  });

  it("Javier's defence against indirect fire stacks under Tower of Power", () => {
    calculate(
      { unit: 'Artillery', hp: 10, terrain: 'Plain' },
      { co: 'Javier', unit: 'Tank', hp: 10, terrain: 'Road' }
    );
    cy.get(calc.results).should('contain', 'Attack: 56% - 63%');

    calculate(
      { unit: 'Artillery', hp: 10, terrain: 'Plain' },
      { co: 'Javier', power: 'S', unit: 'Tank', hp: 10, terrain: 'Road' }
    );
    cy.get(calc.results).should('contain', 'Attack: 7% - 7%');
  });

  it("Max's and Sensei's Rockets both take -10% attack", () => {
    calculate(
      { unit: 'Rocket', hp: 10, terrain: 'Plain' },
      { unit: 'Md.Tank', hp: 10, terrain: 'Plain' }
    );
    cy.get(calc.results).should('contain', 'Attack: 49% - 57%');

    // Max: his indirect penalty. Sensei: the penalty on her vehicles covers Rockets too.
    for (const co of ['Max', 'Sensei'] as const) {
      calculate(
        { co, unit: 'Rocket', hp: 10, terrain: 'Plain' },
        { unit: 'Md.Tank', hp: 10, terrain: 'Plain' }
      );
      cy.get(calc.results).should('contain', 'Attack: 44% - 52%');
    }
  });
});
