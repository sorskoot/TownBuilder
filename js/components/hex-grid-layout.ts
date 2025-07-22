import { Component, Object3D } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { HexagonGrid } from '../classes/HexGrid.js';
import { HexagonTile } from '../classes/HexagonTile.js';
import { TileType } from '../classes/TileType.js';
import { TilePrefabs } from './tile-prefabs.js';
import { MyCursor } from './my-cursor.js';
import { vec3 } from 'gl-matrix';
import { UIState } from '../classes/UIState.js';

export class HexGridLayout extends Component {
    static TypeName = 'hex-grid-layout';

    @property.object({ required: true })
    cursorObject: Object3D;

    @property.object({ required: true })
    highlight: Object3D;

    private _tileMap: Map<TileType, string> = new Map([
        [TileType.Grass, 'TileGrass'],
        [TileType.Water, 'TileWater'],
        [TileType.Empty, 'TileEmpty'],
        [TileType.Road, 'TileRoad'],
    ]);

    private _grid: HexagonGrid;
    private _myCursor: MyCursor;

    start() {
        this._myCursor = this.cursorObject.getComponent(MyCursor);
        this.highlight.setScalingLocal([0, 0, 0]);
        setTimeout(() => {
            this.createGrid();
        }, 1000); //For now delay for a second... This will be from the menu later...
    }

    onActivate() {
        this._myCursor.onTileHover.add(this._onOnTileHover);
        this._myCursor.onTileClick.add(this._onOnTileClick);
    }
    onDeactivate(): void {
        this._myCursor.onTileHover.remove(this._onOnTileHover);
        this._myCursor.onTileClick.remove(this._onOnTileClick);
    }

    private createGrid() {
        this._grid = new HexagonGrid();
        const center = new HexagonTile(0, 0, 0);
        this._grid.addTile(center);
        let layer = [center];
        for (let i = 0; i < 50; i++) {
            layer = this._expand(layer);
        }
        const tile = this._grid.getTiles();
        for (const t of tile) {
            const pos = t.to2D();
            let hex;
            switch (t.type) {
                case TileType.Empty:
                    hex = TilePrefabs.instance.spawn(
                        this._tileMap.get(TileType.Empty)
                    );
                    hex.setPositionWorld([pos.x, -0.5, pos.y]);
                    break;
                case TileType.Water:
                    hex = TilePrefabs.instance.spawn(
                        this._tileMap.get(TileType.Water)
                    );
                    hex.setPositionWorld([pos.x, -0.5, pos.y]);
                    break;
                default:
                    hex = TilePrefabs.instance.spawn(
                        this._tileMap.get(TileType.Grass)
                    );
                    hex.setPositionWorld([pos.x, 0, pos.y]);
                    break;
            }
            t.object = hex;
            hex.setPositionWorld([pos.x, 0, pos.y]);
        }
        this._addPossibleTargets();
    }

    /**
     * This function runs through all tiles and adds a empty tile to its neighbors if the tile is not empty
     */
    private _addPossibleTargets() {
        const tiles = this._grid.getTiles();
        for (const t of tiles) {
            if (t.type === TileType.Empty) {
                continue;
            }
            for (const n of t.neighbors()) {
                const neighbor = this._grid.getTile(n.x, n.y, n.z);
                if (!neighbor) {
                    const newTile = new HexagonTile(
                        n.x,
                        n.y,
                        n.z,
                        TileType.Empty
                    );
                    this._grid.addTile(newTile);
                    const pos = newTile.to2D();
                    const hex = TilePrefabs.instance.spawn(
                        this._tileMap.get(TileType.Empty)
                    );
                    newTile.object = hex;
                    hex.setPositionWorld([pos.x, 0, pos.y]);
                }
            }
        }
    }

    private _expand(tiles: HexagonTile[]): HexagonTile[] {
        let newTiles = [];
        tiles.forEach((t) => {
            for (const n of t.neighbors()) {
                if (!this._grid.getTile(n.x, n.y, n.z)) {
                    const t = new HexagonTile(
                        n.x,
                        n.y,
                        n.z,
                        Math.random() > 0.5 ? TileType.Grass : TileType.Water
                    );
                    this._grid.addTile(t);
                    newTiles.push(t);
                }
            }
        });
        return newTiles;
    }

    hoveringTile: HexagonTile = null;

    _onOnTileClick = (tilePos: { x: number; y: number; z: number }) => {
        if (!this._grid) return;
        const tile = this._grid.getTile(tilePos.x, tilePos.y, tilePos.z);
        if (tile) {
            if (tile.type === TileType.Empty) {
                tile.type = UIState.instance.tileToPlace;
                tile.object.destroy();
                const pos = tile.to2D();
                const hex = TilePrefabs.instance.spawn(
                    this._tileMap.get(UIState.instance.tileToPlace)
                );
                tile.object = hex;
                hex.setPositionWorld([pos.x, 0, pos.y]);
                this._addPossibleTargets();
            }
        }
    };

    _onOnTileHover = (tilePos: { x: number; y: number; z: number }) => {
        if (!this._grid) return;
        const tile = this._grid.getTile(tilePos.x, tilePos.y, tilePos.z);
        //const pos = HexagonTile.roundCube(tilePos.x, tilePos.y, tilePos.z);
        //console.log('Tile Hovered:', tilePos);
        // if (this.hoveringTile) {
        //     this.hoveringTile.object.translateLocal([0, -0.5, 0]);
        // }
        if (tile) {
            this.engine.canvas.style.cursor = 'none';
            this.hoveringTile = tile;
            const pos = vec3.create();
            tile.object.getPositionWorld(pos);
            this.highlight.setScalingLocal([1, 1, 1]);
            this.highlight.setPositionWorld(pos);
            //this.hoveringTile.object.translateLocal([0, 0.5, 0]);
        } else {
            this.highlight.setScalingLocal([0, 0, 0]);
            this.engine.canvas.style.cursor = 'auto';
            //  this.hoveringTile = null;
        }
    };
}
