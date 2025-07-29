import { HexagonTile } from './HexagonTile.js';
import { TILE_SIZE } from './HexConstants.js';

export class HexUtils {
    /**
     * Converts the cube coordinates to 2D coordinates.
     * @param tile - The hexagon tile to convert.
     * @returns The 2D position of the tile.
     */
    public static to2D(tile: HexagonTile): { x: number; y: number };
    /**
     * Converts the cube coordinates to 2D coordinates.
     * @param x - The x-coordinate in cube space.
     * @param z - The z-coordinate in cube space.
     * @note The y-coordinate is not used.
     * @returns The 2D position of the tile.
     */
    public static to2D(x: number, z: number): { x: number; y: number };
    public static to2D(tileOrX: HexagonTile | number, z?: number): { x: number; y: number } {
        let x: number;
        if (typeof tileOrX === 'object') {
            x = tileOrX.x;
            z = tileOrX.z;
        } else {
            x = tileOrX;
        }

        const x2D = TILE_SIZE * Math.sqrt(3) * (x + z! / 2);
        const y2D = TILE_SIZE * (3 / 2) * z!;
        return { x: x2D, y: y2D };
    }

    /**
     * Converts 2D coordinates to cube coordinates and rounds to the nearest hex tile.
     * @param x2D - The x-coordinate in 2D space.
     * @param y2D - The y-coordinate in 2D space.
     * @returns The cube coordinates of the nearest hex tile.
     */
    public static from2D(x2D: number, y2D: number): { x: number; y: number; z: number } {
        const q = ((x2D * Math.sqrt(3)) / 3 - y2D / 3) / TILE_SIZE;
        const r = (y2D * 2) / 3 / TILE_SIZE;
        const [x, y, z] = HexUtils.roundCube(q, -q - r, r);
        return { x, y, z };
    }

    /**
     * Rounds cube coordinates to the nearest hex tile.
     * @param x - The x-coordinate in cube space.
     * @param y - The y-coordinate in cube space.
     * @param z - The z-coordinate in cube space.
     * @returns The rounded cube coordinates.
     */
    public static roundCube(x: number, y: number, z: number): [number, number, number] {
        let rx = Math.round(x);
        let ry = Math.round(y);
        let rz = Math.round(z);

        const xDiff = Math.abs(rx - x);
        const yDiff = Math.abs(ry - y);
        const zDiff = Math.abs(rz - z);

        if (xDiff > yDiff && xDiff > zDiff) {
            rx = -ry - rz;
        } else if (yDiff > zDiff) {
            ry = -rx - rz;
        } else {
            rz = -rx - ry;
        }

        return [rx, ry, rz];
    }
}
