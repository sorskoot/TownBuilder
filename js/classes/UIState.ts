import { TileType } from './TileType.js';

export class UIState {
    tileToPlace = TileType.Grass;

    private static _instance: UIState;

    static get instance(): UIState {
        if (!UIState._instance) {
            UIState._instance = new UIState();
        }
        return UIState._instance;
    }

    private constructor() {}
}
