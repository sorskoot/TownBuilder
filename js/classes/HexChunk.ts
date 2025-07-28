import { HexagonTile } from './HexagonTile.js';
import { Object3D } from '@wonderlandengine/api';

export class HexChunk {
    private _centerQ: number;
    private _centerR: number;
    private _centerS: number;
    private _chunkRadius: number;

    public tiles: Map<string, HexagonTile> = new Map();
    public isLoaded: boolean = false;
    public chunkRoot: Object3D | null = null;

    constructor(centerQ: number, centerS: number, centerR: number, radius: number) {
        this._centerQ = centerQ;
        this._centerS = centerS;
        this._centerR = centerR;
        this._chunkRadius = radius;

        // Verify cube coordinate constraint
        if (this._centerQ + this._centerR + this._centerS !== 0) {
            throw new Error('HexChunk: Invalid cube coordinates - q + r + s must equal 0');
        }
    }

    get id(): string {
        return `${this._centerQ},${this._centerR},${this._centerS}`;
    }

    containsTile(q: number, r: number): boolean {
        const s = -q - r;
        const distance = Math.max(
            Math.abs(q - this._centerQ),
            Math.abs(r - this._centerR),
            Math.abs(s - (-this._centerQ - this._centerR))
        );
        return distance <= this._chunkRadius;
    }

    load(): void {
        this.isLoaded = true;
    }

    unload(): void {
        this.isLoaded = false;
        this.tiles.clear();
        if (this.chunkRoot) {
            this.chunkRoot.destroy();
            this.chunkRoot = null;
        }
    }
}
