declare namespace Cypress {
  interface Chainable<Subject = any> {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    loginFrontend(email: string, password: string): void;

    createGame(baseUrl: string, gameName: string, prefsID: string, gamePassword?: string): any;

    readyTopGame(): void;

    joinGame(gameID: string): void;

    deleteGame(baseUrl: string, gameID: string): void;

    enterGame(baseUrl: string, gameName: string): void;

    resign(password: string): void;
  }
}
