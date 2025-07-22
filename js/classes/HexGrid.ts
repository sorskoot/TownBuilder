import { HexagonTile } from './HexagonTile.js';
import { TileType } from './TileType.js';

/**
 * Represents a grid of hexagonal tiles.
 */
export class HexagonGrid {
    /**
     * A map storing hexagon tiles with their unique keys.
     */
    private _tiles: Map<string, HexagonTile>;

    /**
     * Creates a new HexagonGrid instance and initializes it with a center tile.
     */
    constructor() {
        this._tiles = new Map();
        // Add the center tile
        this.addTile(new HexagonTile(0, 0, 0, TileType.Castle));
    }

    /**
     * Generates a unique key for a hexagon tile based on its coordinates.
     * @param x - The x-coordinate of the tile.
     * @param y - The y-coordinate of the tile.
     * @param z - The z-coordinate of the tile.
     * @returns A unique string key for the tile.
     */
    private getKey(x: number, y: number, z: number): string {
        return `${x},${y},${z}`;
    }

    /**
     * Adds a new hexagon tile to the grid.
     * @param tile - The hexagon tile to add.
     */
    public addTile(tile: HexagonTile): void {
        const key: string = this.getKey(tile.x, tile.y, tile.z);
        if (!this._tiles.has(key)) {
            this._tiles.set(key, tile);
        }
    }

    /**
     * Retrieves a tile at specific cube coordinates.
     * @param x - The x-coordinate of the tile.
     * @param y - The y-coordinate of the tile.
     * @param z - The z-coordinate of the tile.
     * @returns The hexagon tile at the specified coordinates, or undefined if not found.
     */
    public getTile(x: number, y: number, z: number): HexagonTile | undefined {
        return this._tiles.get(this.getKey(x, y, z));
    }

    /**
     * Retrieves all tiles in the grid.
     * @returns An array of all hexagon tiles in the grid.
     */
    public getAllTiles(): HexagonTile[] {
        return Array.from(this._tiles.values());
    }
}
