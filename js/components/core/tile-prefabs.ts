import { PrefabsBase, ServiceLocator } from '@sorskoot/wonderland-components';

@ServiceLocator.registerComponent
export class TilePrefabs extends PrefabsBase {
    static TypeName = 'tile-prefabs';
    static InheritProperties = true;

    PrefabBinName(): string {
        return 'Tiles.bin';
    }
}
