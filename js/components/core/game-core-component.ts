import { Component, Object3D } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { TilePrefabs } from './tile-prefabs.js';
import { AssetsToLoad, GameCore } from '../../classes/core/GameCore.js';

export class GameCoreComponent extends Component {
    static TypeName = 'game-core-component';

    start() {
        TilePrefabs.instance.onPrefabsLoaded.add(this._onTilePrefabsLoaded)
    }

    private _onTilePrefabsLoaded = () => {
        GameCore.instance.doneLoading(AssetsToLoad.TilePrefabs);
    }
}