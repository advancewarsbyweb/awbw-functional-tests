declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject = any> {
    loginFrontend(email: string, password: string): void;

    createGame(baseUrl: string, gameName: string, prefsID: string, gamePassword?: string): any;

    readyTopGame(): void;

    joinGame(gameID: string): void;

    deleteGame(baseUrl: string, gameID: string): void;

    enterGame(baseUrl: string, gameName: string): void;

    resign(password: string): void;

    endTurn(): void;

    buildUnitOnNthBuilding(position: number, unit?: string): void;

    moveNthUnitAndPerformActionOnNthBuilding(unitPosition: number, buildingPosition: number, actionNumber: number): void

    doubleClickNthUnitAndPerformAction(unitPosition: number, actionNumber: number): void
  }
}
