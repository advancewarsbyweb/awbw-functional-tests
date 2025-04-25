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
    cy.get(homepageSelectors.loginDropdown).click();
    cy.get(homepageSelectors.userNameField).type(data.StandardAccount);
    cy.get(homepageSelectors.passwordField).type(data.StandardAccountPass); //DO NOT STORE NON-THROWAWAY ACCOUNT PASSWORDS IN THE SETUP-DATA FIXTURE.
    cy.get(homepageSelectors.loginButton).click();

    //profile data that appears replacing login button
    cy.get('#profile-menu > [title="' + data.StandardAccount + '"]')
      .invoke("attr", "title")
      .should("equal", data.StandardAccount);
  });
});

