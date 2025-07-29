export class GameCore {
    private static _instance: GameCore;

    static get instance(): GameCore {
        if (!GameCore._instance) {
            GameCore._instance = new GameCore();
        }
        return GameCore._instance;
    }

    private constructor() { }


}