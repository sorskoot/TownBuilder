import { Component } from '@wonderlandengine/api';
import { TilePrefabs } from './tile-prefabs.js';
import { AssetsToLoad, GameCore } from '@/classes/core/GameCore.js';
import { ResourcePrefabs } from './resource-prefabs.ts';
import { ServiceLocator } from '@sorskoot/wonderland-components';

export class GameCoreComponent extends Component {
    static TypeName = 'game-core-component';

    start() {
        ServiceLocator.get(TilePrefabs).onPrefabsLoaded.add(this._onTilePrefabsLoaded);
        ServiceLocator.get(ResourcePrefabs).onPrefabsLoaded.add(this._onResourcePrefabsLoaded);
    }

    private _onTilePrefabsLoaded = () => {
        ServiceLocator.get(GameCore).doneLoading(AssetsToLoad.TilePrefabs);
    }

    private _onResourcePrefabsLoaded = () => {
        ServiceLocator.get(GameCore).doneLoading(AssetsToLoad.ResourcePrefabs);
    }
}