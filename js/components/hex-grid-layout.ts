import { Component, Object3D } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { HexagonGrid } from '../classes/HexGrid.js';
import { HexagonTile } from '../classes/HexagonTile.js';
import { TileType } from '../classes/TileType.js';
import { TilePrefabs } from './tile-prefabs.js';
import { MyCursor } from './my-cursor.js';
import { vec3 } from 'gl-matrix';
import { UIState } from '../classes/UIState.js';

/**
 * Component responsible for managing the hexagonal grid layout.
 */
export class HexGridLayout extends Component {
    static TypeName = 'hex-grid-layout';

    @property.object({ required: true })
    public cursorObject!: Object3D;

    @property.object({ required: true })
    public highlight!: Object3D;

    private _tileMap: Map<TileType, string> = new Map([
        [TileType.Grass, 'TileGrass'],
        [TileType.Water, 'TileWater'],
        [TileType.Empty, 'TileEmpty'],
        [TileType.Road, 'TileRoad'],
    ]);

    private _grid!: HexagonGrid;
    private _myCursor!: MyCursor;
    private _hoveringTile: HexagonTile | null = null;

    /**
     * Initializes the component and sets up the grid.
     */
    public start(): void {
        this._myCursor = this.cursorObject.getComponent(MyCursor);
        this.highlight.setScalingLocal([0, 0, 0]);
        setTimeout(() => {
            this._createGrid();
        }, 1000); // Temporary delay for initialization
    }

    /**
     * Activates the component and adds event listeners.
     */
    public onActivate(): void {
        this._myCursor.onTileHover.add(this._onTileHover);
        this._myCursor.onTileClick.add(this._onTileClick);
    }

    /**
     * Deactivates the component and removes event listeners.
     */
    public onDeactivate(): void {
        this._myCursor.onTileHover.remove(this._onTileHover);
        this._myCursor.onTileClick.remove(this._onTileClick);
    }

    /**
     * Creates the hexagonal grid and populates it with tiles.
     */
    private _createGrid(): void {
        this._grid = new HexagonGrid();
        const center = new HexagonTile(0, 0, 0);
        this._grid.addTile(center);
        let layer: HexagonTile[] = [center];
        for (let i = 0; i < 50; i++) {
            layer = this._expand(layer);
        }
        const tiles = this._grid.getAllTiles();
        for (const tile of tiles) {
            const pos = tile.to2D();
            let hex: Object3D;
            switch (tile.type) {
                case TileType.Empty: {
                    hex = TilePrefabs.instance.spawn(
                        this._tileMap.get(TileType.Empty)!
                    );
                    hex.setPositionWorld([pos.x, -0.5, pos.y]);
                    break;
                }
                case TileType.Water: {
                    hex = TilePrefabs.instance.spawn(
                        this._tileMap.get(TileType.Water)!
                    );
                    hex.setPositionWorld([pos.x, -0.5, pos.y]);
                    break;
                }
                default: {
                    hex = TilePrefabs.instance.spawn(
                        this._tileMap.get(TileType.Grass)!
                    );
                    hex.setPositionWorld([pos.x, 0, pos.y]);
                    break;
                }
            }
            tile.object = hex;
        }
        this._addPossibleTargets();
    }

    /**
     * Adds empty tiles to the neighbors of non-empty tiles.
     */
    private _addPossibleTargets(): void {
        const tiles = this._grid.getAllTiles();
        for (const tile of tiles) {
            if (tile.type === TileType.Empty) {
                continue;
            }
            for (const neighborCoords of tile.neighbors()) {
                const neighbor = this._grid.getTile(
                    neighborCoords.x,
                    neighborCoords.y,
                    neighborCoords.z
                );
                if (!neighbor) {
                    const newTile = new HexagonTile(
                        neighborCoords.x,
                        neighborCoords.y,
                        neighborCoords.z,
                        TileType.Empty
                    );
                    this._grid.addTile(newTile);
                    const pos = newTile.to2D();
                    const hex = TilePrefabs.instance.spawn(
                        this._tileMap.get(TileType.Empty)!
                    );
                    newTile.object = hex;
                    hex.setPositionWorld([pos.x, 0, pos.y]);
                }
            }
        }
    }

    /**
     * Expands the grid by adding new tiles around the given tiles.
     * @param tiles - The tiles to expand around.
     * @returns The newly added tiles.
     */
    private _expand(tiles: HexagonTile[]): HexagonTile[] {
        const newTiles: HexagonTile[] = [];
        tiles.forEach((tile) => {
            for (const neighborCoords of tile.neighbors()) {
                if (
                    !this._grid.getTile(
                        neighborCoords.x,
                        neighborCoords.y,
                        neighborCoords.z
                    )
                ) {
                    const newTile = new HexagonTile(
                        neighborCoords.x,
                        neighborCoords.y,
                        neighborCoords.z,
                        Math.random() > 0.5 ? TileType.Grass : TileType.Water
                    );
                    this._grid.addTile(newTile);
                    newTiles.push(newTile);
                }
            }
        });
        return newTiles;
    }

    /**
     * Handles tile click events.
     */
    private _onTileClick = (tilePos: {
        x: number;
        y: number;
        z: number;
    }): void => {
        if (!this._grid) {
            return;
        }
        const tile = this._grid.getTile(tilePos.x, tilePos.y, tilePos.z);
        if (tile && tile.type === TileType.Empty) {
            tile.type = UIState.instance.tileToPlace;
            tile.object.destroy();
            const pos = tile.to2D();
            const hex = TilePrefabs.instance.spawn(
                this._tileMap.get(UIState.instance.tileToPlace)!
            );
            tile.object = hex;
            hex.setPositionWorld([pos.x, 0, pos.y]);
            this._addPossibleTargets();
        }
    };

    /**
     * Handles tile hover events.
     */
    private _onTileHover = (tilePos: {
        x: number;
        y: number;
        z: number;
    }): void => {
        if (!this._grid) {
            return;
        }
        const tile = this._grid.getTile(tilePos.x, tilePos.y, tilePos.z);
        if (tile) {
            this.engine.canvas.style.cursor = 'none';
            this._hoveringTile = tile;
            const pos = vec3.create();
            tile.object.getPositionWorld(pos);
            this.highlight.setScalingLocal([1, 1, 1]);
            this.highlight.setPositionWorld(pos);
        } else {
            this.highlight.setScalingLocal([0, 0, 0]);
            this.engine.canvas.style.cursor = 'auto';
        }
    };
}
