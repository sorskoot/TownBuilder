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

}
