import { Object3D } from '@wonderlandengine/api';
import { TileType } from './TileType.js';

const TILE_SIZE = 2 / Math.sqrt(3);

export class HexagonTile {
    object: Object3D;

    constructor(
        public x: number,
        public y: number,
        public z: number,
        public type: TileType = TileType.Grass
    ) {}

    // Calculate neighbors in cube coordinates
    neighbors(): { x: number; y: number; z: number }[] {
        const directions = [
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

    // Convert cube coordinates to 2D position
    to2D(): { x: number; y: number } {
        const x2D = TILE_SIZE * Math.sqrt(3) * (this.x + this.z / 2);
        const y2D = TILE_SIZE * (3 / 2) * this.z;
        return { x: x2D, y: y2D };
    }

    // Convert 2D position to cube coordinates and round to nearest hex tile
    static from2D(
        x2D: number,
        y2D: number
    ): { x: number; y: number; z: number } {
        const q = ((x2D * Math.sqrt(3)) / 3 - y2D / 3) / TILE_SIZE;
        const r = (y2D * 2) / 3 / TILE_SIZE;
        const [x, y, z] = HexagonTile.roundCube(q, -q - r, r);
        return { x, y, z };
    }

    // Round cube coordinates to nearest hex tile
    static roundCube(
        x: number,
        y: number,
        z: number
    ): [number, number, number] {
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
