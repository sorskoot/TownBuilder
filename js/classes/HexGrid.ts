import { HexagonTile } from './HexagonTile.js';
import { TileType } from './TileType.js';

export class HexagonGrid {
    private tiles: Map<string, HexagonTile>;

    constructor() {
        this.tiles = new Map();
        // Add the center tile
        this.addTile(new HexagonTile(0, 0, 0, TileType.Castle));
    }

    // Helper method to generate a unique key for each hexagon
    private getKey(x: number, y: number, z: number): string {
        return `${x},${y},${z}`;
    }

    // Add a new hexagon tile to the grid
    addTile(tile: HexagonTile): void {
        const key = this.getKey(tile.x, tile.y, tile.z);
        if (!this.tiles.has(key)) {
            this.tiles.set(key, tile);
        }
    }

    // Get a tile at specific coordinates
    getTile(x: number, y: number, z: number): HexagonTile | undefined {
        return this.tiles.get(this.getKey(x, y, z));
    }

    getTiles(): HexagonTile[] {
        return Array.from(this.tiles.values());
    }

    // // Place road tiles, ensuring they are connected
    // placeRoad(x: number, y: number, z: number): boolean {
    //     const neighbors = new HexagonTile(x, y, z).neighbors();
    //     if (
    //         neighbors.some(
    //             (tile) =>
    //                 this.tiles.get(this.getKey(tile.x, tile.y, tile.z))
    //                     ?.type === TileType.Road
    //         )
    //     ) {
    //         this.addTile(new HexagonTile(x, y, z, TileType.Road));
    //         return true;
    //     }
    //     console.warn('Road must be placed next to an existing road.');
    //     return false;
    // }

    // // Place river tiles, ensuring they are connected
    // placeRiver(x: number, y: number, z: number): boolean {
    //     const neighbors = new HexagonTile(x, y, z).neighbors();
    //     if (
    //         neighbors.some(
    //             (tile) =>
    //                 this.tiles.get(this.getKey(tile.x, tile.y, tile.z))
    //                     ?.type === TileType.River
    //         )
    //     ) {
    //         this.addTile(new HexagonTile(x, y, z, TileType.River));
    //         return true;
    //     }
    //     console.warn('River must be placed next to an existing river.');
    //     return false;
    // }
}
