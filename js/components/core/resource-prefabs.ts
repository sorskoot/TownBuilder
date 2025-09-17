import { PrefabsBase, ServiceLocator } from '@sorskoot/wonderland-components';

@ServiceLocator.registerComponent
export class ResourcePrefabs extends PrefabsBase {
    static TypeName = 'resource-prefabs';
    static InheritProperties = true;

    PrefabBinName(): string {
        return 'Resources.bin';
    }
}
