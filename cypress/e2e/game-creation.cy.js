const { it } = require("mocha")
import createGamePageSelectors from "../support/selectors/createGamePageSelectors";

describe('test-create-game', () => {
    let data;
    before(function () {
        cy.fixture('setup-data').then((fdata) => {
            data = fdata;
            cy.visit(data.TestURL);
        });
    })

    //TODO:
    // it('Users can create games through the frontend', function() {
    //     cy.loginFrontend(data.StandardAccount, data.StandardAccountPass);
    //     cy.visit("https://awbw.amarriner.com/create.php");
    //     cy.get(createGamePageSelectors.loadMapButton).first().click(); //your maps load button
    // })

    it('create game test api', function(){
        cy.loginFrontend(data.StandardAccount, data.StandardAccountPass);
        cy.createOneVsOneGame();
    })
  })