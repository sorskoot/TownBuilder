import { PrefabsBase } from '../../utils/PrefabBase.ts';

export class ResourcePrefabs extends PrefabsBase {
    static TypeName = 'resource-prefabs';
    static InheritProperties = true;

    PrefabBinName(): string {
        return 'Resources.bin';
    }

    private static _instance: ResourcePrefabs;
    static get instance(): ResourcePrefabs {
        return ResourcePrefabs._instance;
    }

    init() {
        if (ResourcePrefabs._instance) {
            console.error(
                'There can only be one instance of ResourcePrefabs Component'
            );
        }
        ResourcePrefabs._instance = this;
    }

}
