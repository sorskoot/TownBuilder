import {Object3D} from '@wonderlandengine/api';
import {TileType} from './TileType.js';
import {Tags} from './Tags.js';
import {TILE_SIZE} from './HexConstants.js';

/**
 * Represents a hexagonal tile in a 3D space using cube coordinates.
 */
export class HexagonTile {
    /**
     * The 3D object associated with this tile.
     */
    private _object!: Object3D;

    private _id: string;

    public get id(): string {
        return this._id;
    }

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
        public type: TileType = TileType.Grass,
        public elevation: number = 0
    ) {
        this._id = `${x},${y},${z}`;
    }

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
    public neighbors(): { x: number; y: number; z: number }[] {
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

    public addTag(tag: string): void {
        Tags.setTag(tag, this._id);
    }

    public hasTag(tag: string): boolean {
        return Tags.hasTag(tag, this._id);
    }

    equals(other: HexagonTile): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }


}
