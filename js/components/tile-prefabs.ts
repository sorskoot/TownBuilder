import { PrefabsBase } from '@sorskoot/wonderland-components';

// export abstract class PrefabsBase extends Component {
//     static TypeName = 'prefabs-base';

//     // Singleton
//     private static _instance: PrefabsBase;
//     static get instance(): PrefabsBase {
//         return PrefabsBase._instance;
//     }

//     prefabs!: Object3D;
//     onPrefabsLoaded = new RetainEmitter<[Object3D]>();

//     abstract get PrefabBinName(): string;

//     private _isLoaded = false;
//     get isLoaded() {
//         return this._isLoaded;
//     }

//     init(): void {
//         PrefabsBase._instance = this;
//     }

//     async start() {
//         const s = await this.engine.loadPrefab(this.PrefabBinName);
//         const r = this.engine.scene.instantiate(s);

//         this.prefabs = r.root;
//         this.prefabs.parent = this.object;

//         WLUtils.setActive(this.prefabs, false);
//         this._isLoaded = true;
//         setTimeout(() => this.onPrefabsLoaded.notify(this.prefabs), 0);
//     }
//     /**
//      * Spawns an objecy with the given name
//      * @param name Name of the prefab to spawn
//      * @param parent Optional parent object of the spawned object
//      * @param startActive Optional boolean to set the active state of the spawned object; default is true
//      * @returns The spawned object or null if spawn failed
//      */
//     spawn(name: string, parent: Object3D | null = null, startActive = true) {
//         if (!this.prefabs) {
//             console.warn(`Spawning Failed. Prefabs not loaded`);
//             return null;
//         }

//         const prefab = this.prefabs.findByName(name)[0];

//         if (!prefab) {
//             console.warn(`Spawning Failed. Prefab with name ${name} not found`);
//             return null;
//         }

//         const clonedPrefab = prefab.clone(parent);

//         if (startActive) {
//             WLUtils.setActive(clonedPrefab, true);
//         }

//         clonedPrefab.resetPositionRotation();
//         return clonedPrefab;
//     }
// }

export class TilePrefabs extends PrefabsBase {
    static TypeName = 'tile-prefabs';
    static InheritProperties = true;

    get PrefabBinName(): string {
        return 'Tiles.bin';
    }
}
//     static TypeName = 'tile-prefabs';

//     // Singleton
//     private static _instance: TilePrefabs;
//     static get instance(): TilePrefabs {
//         return TilePrefabs._instance;
//     }
//     tilePrefabs!: Object3D;
//     onPrefabsLoaded = new RetainEmitter<[Object3D]>();

//     private _isLoaded = false;
//     get isLoaded() {
//         return this._isLoaded;
//     }

//     init(): void {
//         TilePrefabs._instance = this;
//     }

//     async start() {
//         const s = await this.engine.loadPrefab('Tiles.bin');
//         const r = this.engine.scene.instantiate(s);

//         this.tilePrefabs = r.root;
//         this.tilePrefabs.parent = this.object;

//         this._isLoaded = true;
//         setTimeout(() => this.onPrefabsLoaded.notify(this.tilePrefabs), 0);
//     }

//     /**
//      * Spawns a tile with the given name
//      * @param name Name of the tile to spawn
//      * @param parent Optional parent object of the tile
//      * @param startActive Optional boolean to set the active state of the tile; default is true
//      * @returns The spawned tile object or null if spawn failed
//      */
//     spawn(name: string, parent: Object3D | null = null, startActive = true) {
//         const tile = this.tilePrefabs.findByName(name)[0];

//         if (!tile) {
//             console.error(
//                 `Spawning tile Failed. tile with name ${name} not found`
//             );
//             return null;
//         }

//         const clonedTile = tile.clone(parent);

//         if (startActive) {
//             WLUtils.setActive(clonedTile, true);
//         }

//         clonedTile.resetPositionRotation();
//         return clonedTile;
//     }
// }
