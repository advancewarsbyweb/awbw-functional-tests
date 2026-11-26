declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject = any> {
    loginFrontend(email: string, password: string): void;

    logoutFrontend(): void;

    createGame(baseUrl: string, gameName: string, prefsID: string, gamePassword?: string): any;

    readyTopGame(): void;

    joinGame(gameID: string): void;

    deleteGame(baseUrl: string, gameID: string): void;

    enterGame(baseUrl: string, gameName: string): void;

    resign(password: string): void;

    endTurn(): void;

    buildUnitOnNthBuilding(position: number, unit?: string): void;

    moveNthUnitAndPerformActionOnNthBuilding(
      unitPosition: number,
      buildingPosition: number,
      actionNumber: number
    ): void;

    doubleClickNthUnitAndPerformAction(unitPosition: number, actionNumber: number): void;

    createGameWithFunds(
      baseUrl: string,
      gameName: string,
      mapQuery: string,
      funds: number,
      startingFunds: number,
      gamePassword?: string
    ): Chainable<string>;

    setCOForAllPlayers(baseUrl: string, gameID: string, coID: number): void;

    unitAt(x: number, y: number): Chainable<JQuery<HTMLElement>>;

    buildUnitAt(x: number, y: number, unit: string): void;

    waitForGameSocket(): void;

    reloadGame(): void;

    moveUnitTo(fromX: number, fromY: number, toX: number, toY: number): void;

    menuOptions(): Chainable<string[]>;

    chooseAction(action: string): void;

    clickMoveTo(fromX: number, fromY: number, toX: number, toY: number): void;

    waitUntilMovedFrom(x: number, y: number): void;

    moveUnitAndChoose(fromX: number, fromY: number, toX: number, toY: number, action: string): void;

    cargoAt(x: number, y: number): Chainable<string[]>;

    actInPlace(x: number, y: number, action: string): void;

    fireAt(x: number, y: number): void;

    repairAt(x: number, y: number): void;

    displayedHpAt(x: number, y: number): Chainable<number>;

    fundsOf(country: string): Chainable<number>;

    joinAgainAsAnotherCountry(baseUrl: string, gameID: string, coID?: number): void;

    startGame(baseUrl: string, gameID: string): void;
  }
}
