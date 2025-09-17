import { RetainEmitter, WonderlandEngine } from "@wonderlandengine/api";
import { ServiceLocator } from "@sorskoot/wonderland-components";

export enum AssetsToLoad {
    TilePrefabs,
    ResourcePrefabs
}

@ServiceLocator.register
export class GameCore {
    private _initialized: boolean = false;

    public onLoaded = new RetainEmitter();

    private _assetsToLoad: Map<AssetsToLoad, boolean> = new Map([
        [AssetsToLoad.TilePrefabs, false],
        [AssetsToLoad.ResourcePrefabs, false]
    ]);

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