import { it } from 'mocha';

describe('find-maps', () => {
  let data: { TestURL: string };
  let accountData: { StandardAccount: string; StandardAccountPass: string };
  const mapName = 'Spann Island'; // Type the map you want to find
  before(function () {
    cy.fixture('personal-automation-account.json').then((fdata) => {
      accountData = fdata;
    });

    cy.fixture('setup-data').then((fdata) => {
      data = fdata;
      cy.visit(data.TestURL);
    });
  });

  it('Users can find maps through the Design Maps -> Search Maps UI', function () {
    // Step 1: Login
    cy.loginFrontend(accountData.StandardAccount, accountData.StandardAccountPass);

    // Step 2: Search Map (Feel free to add more values to add)
    cy.visit(data.TestURL + 'searchmaps.php');
    cy.get('input[name="name"]').type(mapName); // Map name
    cy.get('input[value="Search"]').click(); // Search button

    // Step 3: Click on Map Title
    cy.contains('#main a', new RegExp(`^${Cypress._.escapeRegExp(mapName)}$`)).click();

    //Map title is the same as the one that was typed in by the user
    cy.get('#game-header-table > div.bold.underline.game-header-header > b > a')
      .invoke('text')
      .should('equal', mapName);
  });
});
