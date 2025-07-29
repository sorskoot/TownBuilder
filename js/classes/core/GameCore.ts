import { RetainEmitter, WonderlandEngine } from "@wonderlandengine/api";

export enum AssetsToLoad {
    TilePrefabs,
    ResourcePrefabs
}

export class GameCore {
    private static _instance: GameCore;
    private _initialized: boolean = false;

    public onLoaded = new RetainEmitter();

    private _assetsToLoad: Map<AssetsToLoad, boolean> = new Map([
        [AssetsToLoad.TilePrefabs, false],
        [AssetsToLoad.ResourcePrefabs, false]
    ]);

    static get instance(): GameCore {
        if (!GameCore._instance) {
            GameCore._instance = new GameCore();
        }
        return GameCore._instance;
    }

    private constructor() { }

    public init(config: GameConfig, engine: WonderlandEngine) {
        this._initialized = true;
    }

    public doneLoading(asset: AssetsToLoad) {
        if (!this._initialized) {
            throw new Error("GameCore must be initialized before calling doneLoading.");
        }

        this._assetsToLoad.set(asset, true);

        if (Array.from(this._assetsToLoad.values()).every(loaded => loaded)) {
            this.onLoaded.notify();
        }
    }
}

export type GameConfig = {

}