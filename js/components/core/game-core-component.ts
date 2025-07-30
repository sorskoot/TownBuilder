import { Component, Object3D } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { TilePrefabs } from './tile-prefabs.js';
import { AssetsToLoad, GameCore } from '../../classes/core/GameCore.js';
import { ResourcePrefabs } from './resource-prefabs.ts';

export class GameCoreComponent extends Component {
    static TypeName = 'game-core-component';

    start() {
        TilePrefabs.instance.onPrefabsLoaded.add(this._onTilePrefabsLoaded);
        ResourcePrefabs.instance.onPrefabsLoaded.add(this._onResourcePrefabsLoaded);
    }

    private _onTilePrefabsLoaded = () => {
        GameCore.instance.doneLoading(AssetsToLoad.TilePrefabs);
    }

    private _onResourcePrefabsLoaded = () => {
        GameCore.instance.doneLoading(AssetsToLoad.ResourcePrefabs);
    }
}