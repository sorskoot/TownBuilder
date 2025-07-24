import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {HexagonGrid} from '../../classes/HexGrid.js';
import {HexagonTile} from '../../classes/HexagonTile.js';
import {TileType} from '../../classes/TileType.js';
import {TilePrefabs} from './tile-prefabs.js';
import {MyCursor} from '../generic/my-cursor.js';
import {vec3} from 'gl-matrix';
import {UIState} from '../../classes/UIState.js';
import {
    Easing,
    lerp,
    Mathf,
    Noise,
    rng,
    RNG,
    wlUtils,
} from '@sorskoot/wonderland-components';

import {Tags} from '../../classes/Tags.js';

const globalConfig = {
    noiseScale: 25,
    noiseOffset: 0,
    heightScale: 4,
    waterLevel: 0.3,
    castleFlattenDistance: 5,
};

/**
 * Component responsible for managing the hexagonal grid layout.
 */
export class HexGridLayout extends Component {
    static TypeName = 'hex-grid-layout';

    @property.object({required: true})
    public cursorObject!: Object3D;

    @property.object({required: true})
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
        Noise.seed(+new Date());

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
        const center = new HexagonTile(0, 0, 0, TileType.Grass, 0.75);
        center.addTag('castle'); // Tag the center tile as a castle

        this._grid.addTile(center);
        let layer: HexagonTile[] = [center];
        for (let i = 0; i < 20; i++) {
            layer = this._expand(layer);
        }
        // flatten around castle
        this._flattenNeighborsBFS(center, center.elevation);

        // Wave Function Collapse:
        // loop and loop and loop until all tiles are settled.

        // Render the tiles.
        const tiles = this._grid.getAllTiles();
        for (const tile of tiles) {
            const pos = tile.to2D();
            let hex: Object3D;
            switch (tile.type) {
                case TileType.Empty: {
                    hex = TilePrefabs.instance.spawn(this._tileMap.get(TileType.Empty)!);
                    hex.setPositionWorld([pos.x, -0.25, pos.y]);
                    break;
                }
                case TileType.Water: {
                    hex = TilePrefabs.instance.spawn(this._tileMap.get(TileType.Water)!);
                    hex.setPositionWorld([pos.x, -0.25, pos.y]);
                    break;
                }
                default: {
                    hex = TilePrefabs.instance.spawn(this._tileMap.get(TileType.Grass)!);
                    hex.setPositionWorld([
                        pos.x,
                        tile.elevation * globalConfig.heightScale,
                        pos.y,
                    ]);
                    break;
                }
            }
            tile.object = hex;
        }

        // Add Castle
        const castleTileID = Tags.getTilesWithTag('castle')[0];
        const castleTile = this._grid.getTileById(castleTileID);
        const castleObject = TilePrefabs.instance.spawn(
            'BuildingCastle',
            castleTile.object
        );
        //this._addPossibleTargets();
    }

    private _flattenNeighborsBFS(rootTile: HexagonTile, startElevation: number): void {
        const queue: {tile: HexagonTile; distance: number}[] = [
            {tile: rootTile, distance: 0},
        ];
        const visitedTiles = new Set<string>();
        visitedTiles.add(rootTile.id);

        while (queue.length > 0) {
            const {tile, distance} = queue.shift()!;

            if (distance >= globalConfig.castleFlattenDistance) {
                continue; // Stop flattening after a certain distance
            }

            tile.elevation = lerp(
                startElevation,
                tile.elevation,
                distance / globalConfig.castleFlattenDistance,
                Easing.Hermite //.InOutQuad
            );
            tile.type = TileType.Grass; // Ensure the tile is grass

            for (const neighbor of tile.neighbors()) {
                const neighborTile = this._grid.getTile(neighbor.x, neighbor.y, neighbor.z);

                if (neighborTile && !visitedTiles.has(neighborTile.id)) {
                    visitedTiles.add(neighborTile.id);
                    queue.push({tile: neighborTile, distance: distance + 1});
                }
            }
        }
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
                    const pos = tile.to2D();
                    let value = Noise.simplex2(
                        pos.x / globalConfig.noiseScale + globalConfig.noiseOffset,
                        pos.y / globalConfig.noiseScale + globalConfig.noiseOffset
                    );
                    value = (value + 1) / 2; // Normalize to [0, 1]
                    const newTile = new HexagonTile(
                        neighborCoords.x,
                        neighborCoords.y,
                        neighborCoords.z,
                        value > globalConfig.waterLevel ? TileType.Grass : TileType.Water,
                        Mathf.clamp(value, globalConfig.waterLevel, 1) -
                            globalConfig.waterLevel
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
    private _onTileClick = (tilePos: {x: number; y: number; z: number}): void => {
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
    private _onTileHover = (tilePos: {x: number; y: number; z: number}): void => {
        if (!this._grid) {
            return;
        }
        const tile = this._grid.getTile(tilePos.x, tilePos.y, tilePos.z);
        if (tile) {
            //this.engine.canvas.style.cursor = 'none';
            this._hoveringTile = tile;
            const pos = vec3.create();
            tile.object.getPositionWorld(pos);
            this.highlight.setScalingLocal([1, 1, 1]);
            this.highlight.setPositionWorld(pos);
        } else {
            this.highlight.setScalingLocal([0, 0, 0]);
            //    this.engine.canvas.style.cursor = 'auto';
        }
    };
}
