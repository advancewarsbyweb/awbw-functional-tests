const { it } = require("mocha")

describe('test-login', () => {
    before(function () {
        cy.fixture('setup-data').then((data) => {
          cy.visit(data.TestURL)
        })
    })

    it('Users can create accounts through the UI', () => {
        cy.fixture('setup-data').then((data) => {
            cy.get("#login-box-button").click()
            cy.get('.login-input')
        })
    })
  })