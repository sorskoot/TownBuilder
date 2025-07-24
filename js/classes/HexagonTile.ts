import {Object3D} from '@wonderlandengine/api';
import {TileType} from './TileType.js';

/**
 * The size of a hexagon tile, calculated based on the hexagon geometry.
 */
const TILE_SIZE = 2 / Math.sqrt(3);

/**
 * Represents a hexagonal tile in a 3D space using cube coordinates.
 */
export class HexagonTile {
    /**
     * The 3D object associated with this tile.
     */
    private _object!: Object3D;

    elevation: number = 0;

    /**
     * Creates a new HexagonTile instance.
     * @param x - The x-coordinate in cube coordinates.
     * @param y - The y-coordinate in cube coordinates.
     * @param z - The z-coordinate in cube coordinates.
     * @param type - The type of the tile (default is `TileType.Grass`).
     */
    constructor(
        public x: number,
        public y: number,
        public z: number,
        public type: TileType = TileType.Grass
    ) {}

    /**
     * Gets the 3D object associated with this tile.
     */
    public get object(): Object3D {
        return this._object;
    }

    /**
     * Sets the 3D object associated with this tile.
     * @param value - The 3D object to associate with this tile.
     */
    public set object(value: Object3D) {
        this._object = value;
    }

    /**
     * Calculates the neighboring tiles in cube coordinates.
     * @returns An array of neighboring tiles' cube coordinates.
     */
    public neighbors(): {x: number; y: number; z: number}[] {
        const directions: [number, number, number][] = [
            [1, -1, 0],
            [1, 0, -1],
            [0, 1, -1],
            [-1, 1, 0],
            [-1, 0, 1],
            [0, -1, 1],
        ];
        return directions.map((a) => {
            return {
                x: this.x + a[0],
                y: this.y + a[1],
                z: this.z + a[2],
            };
        });
    }

    /**
     * Converts the cube coordinates of this tile to 2D coordinates.
     * @returns The 2D position of the tile.
     */
    public to2D(): {x: number; y: number} {
        const x2D = TILE_SIZE * Math.sqrt(3) * (this.x + this.z / 2);
        const y2D = TILE_SIZE * (3 / 2) * this.z;
        return {x: x2D, y: y2D};
    }

    /**
     * Converts 2D coordinates to cube coordinates and rounds to the nearest hex tile.
     * @param x2D - The x-coordinate in 2D space.
     * @param y2D - The y-coordinate in 2D space.
     * @returns The cube coordinates of the nearest hex tile.
     */
    public static from2D(x2D: number, y2D: number): {x: number; y: number; z: number} {
        const q = ((x2D * Math.sqrt(3)) / 3 - y2D / 3) / TILE_SIZE;
        const r = (y2D * 2) / 3 / TILE_SIZE;
        const [x, y, z] = HexagonTile.roundCube(q, -q - r, r);
        return {x, y, z};
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
