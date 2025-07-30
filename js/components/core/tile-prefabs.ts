import { PrefabsBase } from '../../utils/PrefabBase.ts';

export class TilePrefabs extends PrefabsBase {
    static TypeName = 'tile-prefabs';
    static InheritProperties = true;

    PrefabBinName(): string {
        return 'Tiles.bin';
    }

    private static _instance: TilePrefabs;
    static get instance(): TilePrefabs {
        return TilePrefabs._instance;
    }

    init() {
        if (TilePrefabs._instance) {
            console.error(
                'There can only be one instance of TilePrefabs Component'
            );
        }
        TilePrefabs._instance = this;
    }


}
