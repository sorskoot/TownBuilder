import {PrefabsBase} from '@sorskoot/wonderland-components';

export class TilePrefabs extends PrefabsBase {
    static TypeName = 'tile-prefabs';
    static InheritProperties = true;

    PrefabBinName(): string {
        return 'Tiles.bin';
    }
}
