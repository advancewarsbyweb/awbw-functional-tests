declare namespace Cypress {
    interface Chainable<Subject = any> {
        loginFrontend(email: any, password: any): void

        createGame(baseUrl: string, gameName: string, prefsID: any): any

        readyTopGame(): void

        joinGame(gameID: any): void

        deleteGame(baseUrl: string, gameID: string): void
    }
}