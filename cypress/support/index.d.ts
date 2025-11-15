declare namespace Cypress {
    interface Chainable<Subject = any> {
        loginFrontend(email: any, password: any): void
    }
}