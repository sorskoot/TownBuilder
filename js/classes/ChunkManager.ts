import { HexChunk } from './HexChunk.js';
import { HexagonTile } from './HexagonTile.js';
import { HexagonGrid } from './HexGrid.js';
import { TileType } from './TileType.js';
import { Object3D } from '@wonderlandengine/api';
import { vec3 } from 'gl-matrix';
import { Noise, Mathf } from '@sorskoot/wonderland-components';
import { TilePrefabs } from '../components/core/tile-prefabs.js';
import { HexUtils } from './HexUtils.js';

export class ChunkManager {
    private _chunks: Map<string, HexChunk> = new Map();
    private _grid: HexagonGrid;
    private _chunkRadius: number = 10; // Hexagons per chunk radius
    private _viewDistance: number = 3; // Chunks to load around player
    private _worldRoot: Object3D;
    private _globalConfig: any;

    private _tileMap: Map<TileType, string> = new Map([
        [TileType.Grass, 'TileGrass'],
        [TileType.Water, 'TileWater'],
        [TileType.Empty, 'TileEmpty'],
        [TileType.Road, 'TileRoad'],
    ]);

    constructor(grid: HexagonGrid, worldRoot: Object3D, globalConfig: any) {
        this._grid = grid;
        this._worldRoot = worldRoot;
        this._globalConfig = globalConfig;
    }

    /**
     * Convert world position to chunk coordinates
     */
    public worldToChunkCoords(worldX: number, worldZ: number): { q: number; r: number } {
        // Convert world to hex coordinates first
        const hexCoords = HexUtils.from2D(worldX, worldZ);

        // Calculate chunk size in hex coordinates
        const chunkDiameter = this._chunkRadius * 2 + 1;

        // Convert hex coordinates to chunk coordinates
        // We need to account for the hexagonal offset pattern
        const chunkQ = Math.floor(hexCoords.x / chunkDiameter);
        const chunkR = Math.floor(hexCoords.z / chunkDiameter);

        // Adjust for hexagonal offset based on the chunk row
        const offsetQ = Math.floor(chunkR / 2);
        const adjustedChunkQ = chunkQ - offsetQ;

        return { q: adjustedChunkQ, r: chunkR };
    }

    /**
     * Get or create a chunk at the specified chunk coordinates
     */
    private _getOrCreateChunk(chunkX: number, chunkY: number): HexChunk {
        const chunkId = `${chunkX},${chunkY}`;

        if (!this._chunks.has(chunkId)) {
            // Calculate the center hex coordinates for this chunk
            const chunkDiameter = this._chunkRadius * 2 + 1;

            // Apply hexagonal offset for chunk positioning
            const offsetQ = Math.floor(chunkY / 2);
            const centerQ = (chunkX + offsetQ) * chunkDiameter;
            const centerR = chunkY * chunkDiameter;

            const chunk = new HexChunk(centerQ, 0, centerR, this._chunkRadius);
            this._chunks.set(chunkId, chunk);
        }

        return this._chunks.get(chunkId)!;
    }

    /**
     * Generate tiles for a chunk
     */
    private _generateChunkTiles(chunk: HexChunk): void {
        const centerQ = chunk['_centerQ'];
        const centerR = chunk['_centerR'];
        const radius = chunk['_chunkRadius'];

        // Create chunk root object
        const chunkRoot = this._worldRoot.engine.scene.addObject(this._worldRoot);
        chunkRoot.name = `Chunk_${chunk.id}`;
        chunk.chunkRoot = chunkRoot;

        // Generate tiles in a hexagonal pattern
        for (let q = -radius; q <= radius; q++) {
            for (
                let r = Math.max(-radius, -q - radius);
                r <= Math.min(radius, -q + radius);
                r++
            ) {
                const worldQ = centerQ + q;
                const worldR = centerR + r;
                const worldS = -worldQ - worldR;

                // Check if tile already exists in grid
                let tile = this._grid.getTile(worldQ, worldS, worldR);

                if (!tile) {
                    // Generate new tile
                    tile = this._generateTile(worldQ, worldS, worldR);
                    this._grid.addTile(tile);
                }

                // Render the tile if it doesn't have an object yet
                if (!tile.object) {
                    this._renderTile(tile, chunkRoot);
                }

                chunk.tiles.set(tile.id, tile);
            }
        }
    }

    /**
     * Generate a single tile based on noise
     */
    private _generateTile(q: number, s: number, r: number): HexagonTile {
        const pos2D = HexUtils.to2D(q, r);

        let value = Noise.simplex2(
            pos2D.x / this._globalConfig.noiseScale + this._globalConfig.noiseOffset,
            pos2D.y / this._globalConfig.noiseScale + this._globalConfig.noiseOffset
        );
        value = (value + 1) / 2; // Normalize to [0, 1]

        return new HexagonTile(
            q,
            s,
            r,
            value > this._globalConfig.waterLevel ? TileType.Grass : TileType.Water,
            Mathf.clamp(value, this._globalConfig.waterLevel, 1) -
            this._globalConfig.waterLevel
        );
    }

    /**
     * Render a tile by spawning the appropriate prefab
     */
    private _renderTile(tile: HexagonTile, parent: Object3D): void {
        const pos = HexUtils.to2D(tile);
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
            case TileType.Road: {
                hex = TilePrefabs.instance.spawn(this._tileMap.get(TileType.Road)!);
                hex.setPositionWorld([pos.x, 0, pos.y]);
                break;
            }
            default: {
                hex = TilePrefabs.instance.spawn(this._tileMap.get(TileType.Grass)!);
                hex.setPositionWorld([
                    pos.x,
                    0, //tile.elevation * this._globalConfig.heightScale,
                    pos.y,
                ]);
                break;
            }
        }

        // Parent to chunk root for easier unloading
        hex.parent = parent;
        tile.object = hex;
    }

    /**
     * Update loaded chunks based on player position
     */
    public updateLoadedChunks(playerWorldPos: vec3): void {
        const playerChunk = this.worldToChunkCoords(playerWorldPos[0], playerWorldPos[2]);
        const loadedChunks = new Set<string>();

        // Determine which chunks should be loaded using hexagonal pattern
        for (let q = -this._viewDistance; q <= this._viewDistance; q++) {
            for (
                let r = Math.max(-this._viewDistance, -q - this._viewDistance);
                r <= Math.min(this._viewDistance, -q + this._viewDistance);
                r++
            ) {
                const chunkQ = playerChunk.q + q;
                const chunkR = playerChunk.r + r;
                const chunkId = `${chunkQ},${chunkR}`;

                loadedChunks.add(chunkId);

                const chunk = this._getOrCreateChunk(chunkQ, chunkR);

                if (!chunk.isLoaded) {
                    this._loadChunk(chunk);
                }
            }
        }

        // Unload chunks that are too far
        for (const [chunkId, chunk] of this._chunks) {
            if (!loadedChunks.has(chunkId) && chunk.isLoaded) {
                this._unloadChunk(chunk);
            }
        }
    }

    private _loadChunk(chunk: HexChunk): void {
        if (chunk.tiles.size === 0) {
            this._generateChunkTiles(chunk);
        } else {
            // Re-render existing tiles
            const chunkRoot = this._worldRoot.engine.scene.addObject(this._worldRoot);
            chunkRoot.name = `Chunk_${chunk.id}`;
            chunk.chunkRoot = chunkRoot;

            for (const [_, tile] of chunk.tiles) {
                if (!tile.object) {
                    this._renderTile(tile, chunkRoot);
                }
            }
        }

        chunk.load();
    }

    private _unloadChunk(chunk: HexChunk): void {
        chunk.unload();
    }

    /**
     * Re-render a specific tile (useful when tile type changes)
     */
    public rerenderTile(tile: HexagonTile): void {
        if (tile.object) {
            tile.object.destroy();
            tile.object = null;
        }

        // Find which chunk contains this tile using cube coordinates
        const chunkDiameter = this._chunkRadius * 2 + 1;
        const chunkR = Math.floor(tile.z / chunkDiameter);
        const offsetQ = Math.floor(chunkR / 2);
        const chunkQ = Math.floor(tile.x / chunkDiameter) - offsetQ;

        const chunkId = `${chunkQ},${chunkR}`;
        const chunk = this._chunks.get(chunkId);

        if (chunk && chunk.isLoaded && chunk.chunkRoot) {
            this._renderTile(tile, chunk.chunkRoot);
        }
    }
}
