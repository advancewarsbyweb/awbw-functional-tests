const { it } = require("mocha");
import homepageSelectors from "../support/selectors/homepageSelectors";

describe("test-login", () => {
  let data;
  before(function () {
    cy.fixture("setup-data").then((fdata) => {
      data = fdata;
      cy.visit(data.TestURL);
    });
  });

  it("Users can login to accounts through the UI", function () {
    cy.login(data.StandardAccount, data.StandardAccountPass);
    cy.task("log", "Logging...");
  });
  //  cy.get(homepageSelectors.loginDropdown).click();
  //  cy.get(homepageSelectors.userNameField).type(data.StandardAccount);
  //  cy.get(homepageSelectors.passwordField).type(data.StandardAccountPass); //DO NOT STORE NON-THROWAWAY ACCOUNT PASSWORDS IN THE SETUP-DATA FIXTURE.
  //  cy.get(homepageSelectors.loginButton).click();
  //
  //  //profile data that appears replacing login button
  //  cy.get('#profile-menu > [title="' + data.StandardAccount + '"]')
  //    .invoke("attr", "title")
  //    .should("equal", data.StandardAccount);
  //});
});

describe("test-gameplay", () => {
  it("Create a game", () => {
    cy.login("dev3", "dev");

    let gameID = null;
    cy.createGame("Cypress Test Game").then((id) => {
      gameID = id;
      console.log(`Got gameID ${id}`);

      // P1 ready
      cy.readyTopGame();

      // P2 login, join, ready
      cy.clearCookies();
      cy.login("dev4", "dev");
      cy.joinGame(gameID);
      cy.readyTopGame();

      // Force start game
      //cy.visit("http://localhost/yourgames.php");
      //cy.get("#do-game-row-container > div > div > .norm2").click();

      // Websockets
      // Celeste

      // P1 build infantry
      cy.clearCookies();
      cy.login("dev3", "dev");
      cy.visit(`http://localhost/game.php?games_id=${gameID}`);

      cy.get(".player-overview-container")
        .first()
        .then(($el) => {
          const p1ID = $el.attr("id").replace("player", "");
          return p1ID;
        })
        .then((p1ID) => {
          return cy.window().then((win) => {
            const webSocket = win.getCurrentSocket();
            webSocket.addEventListener("error", (e) => {
              cy.task("log", "WebSocket error: " + JSON.stringify(e));
            });

            webSocket.addEventListener("message", (e) => {
              cy.task("log", "WebSocket message: " + e.data);
            });

            return { win, webSocket, p1ID };
          });
        })
        .then(({ win, webSocket, p1ID }) => {
          return cy.task("log", "WebSocket opened!").then(() => {
            const nextBase = win.openBaseCheck(p1ID);

            return cy
              .task("log", "nextBase=" + JSON.stringify(nextBase))
              .then(() => {
                const buildData = {
                  action: "Build",
                  playerID: p1ID,
                  unitID: 1,
                  buildingID: nextBase.buildings_id,
                };

                return cy
                  .task(
                    "log",
                    "Sending: " +
                      JSON.stringify(buildData) +
                      ", to" +
                      webSocket.readyState,
                  )
                  .then(() => {
                    win.emitData(webSocket, buildData);
                    cy.wait(1000);
                  });
              });
          });
        });
    }); // end createGame
  }); // end it
}); // end describe
