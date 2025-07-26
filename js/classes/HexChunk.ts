import { HexagonTile } from './HexagonTile.js';
import { Object3D } from '@wonderlandengine/api';

export class HexChunk {
    private _tiles: Map<string, HexagonTile> = new Map();

    private _isLoaded: boolean = false;
    private _chunkRoot: Object3D | null = null;

    constructor(private _centerX: number, private _centerY: number, private _centerZ: number, private _chunkRadius: number) {

    }

    get id(): string {
        return `C${this._centerX},${this._centerY},${this._centerZ}`;
    }

    get isLoaded(): boolean {
        return this._isLoaded;
    }

    get tiles(): Map<string, HexagonTile> {
        return this._tiles;
    }

    get chunkRoot(): Object3D | null {
        return this._chunkRoot;
    }

    set chunkRoot(root: Object3D | null) {
        this._chunkRoot = root;
    }

    containsTile(q: number, r: number): boolean {
        const s = -q - r;
        const distance = Math.max(
            Math.abs(q - this._centerX),
            Math.abs(r - this._centerY),
            Math.abs(s - (-this._centerX - this._centerY))
        );
        return distance <= this._chunkRadius;
    }

    load(): void {
        this._isLoaded = true;
    }

    unload(): void {
        this._isLoaded = false;
        this._tiles.clear();
        if (this._chunkRoot) {
            this._chunkRoot.destroy();
            this._chunkRoot = null;
        }
    }
}
