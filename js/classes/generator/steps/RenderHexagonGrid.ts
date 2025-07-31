
import { HexagonGrid } from '../../HexGrid.ts';
import { TileType } from '../../TileType.ts';
import { Tags } from '../../Tags.ts';
import {
    BaseStepExec,
    StepContext,
    StepResult,
    CompletionResult,
    StepParameters,
    StepInput,
    NoStepParameters,
} from '../core/Steps.js';
import { Object3D } from '@wonderlandengine/api';
import { TilePrefabs } from '../../../components/core/tile-prefabs.ts';
import { ResourcePrefabs } from '../../../components/core/resource-prefabs.ts';

const orientations = [0, 60, 120, 180, 240, 300];


export class RenderHexagonGridExec extends BaseStepExec<StepInput, NoStepParameters> {

    private _tileMap: Map<TileType, string> = new Map([
        [TileType.Grass, 'TileGrass'],
        [TileType.Water, 'TileWater'],
        [TileType.Empty, 'TileEmpty'],
        [TileType.Road, 'TileRoad'],
    ]);

    execute(context: StepContext,
        input: StepInput,
        parameters: NoStepParameters): StepResult {

        const result = new StepResult();
        result.state = input.incomingResults[0].state;
        const grid = result.state.getState(HexagonGrid);

        if (!grid) {
            result.completionResult = CompletionResult.Failure;
            result.error = 'HexagonGrid not found in the state.';
            return result;
        }

        const tiles = grid.getAllTiles();

        // Render the tiles.
        for (const tile of tiles) {
            const pos = tile.to2D();
            let hex: Object3D;
            switch (tile.type) {
                case TileType.Empty: {
                    hex = TilePrefabs.instance.spawn(this._tileMap.get(TileType.Empty)!)!;
                    hex.setPositionWorld([pos.x, -0.25, pos.y]);
                    break;
                }
                case TileType.Water: {
                    hex = TilePrefabs.instance.spawn(this._tileMap.get(TileType.Water)!)!;
                    hex.setPositionWorld([pos.x, -0.25, pos.y]);
                    break;
                }
                default: {
                    hex = TilePrefabs.instance.spawn(this._tileMap.get(TileType.Grass)!)!;
                    hex.setPositionWorld([
                        pos.x,
                        tile.elevation * context.config.heightScale,
                        pos.y,
                    ]);
                    break;
                }
            }
            if (tile.hasTag('treeDense')) {
                const tree = ResourcePrefabs.instance.spawn('ResourceTreeDense')!;
                tree.rotateAxisAngleDegLocal([0, 1, 0], context.random.getItem(orientations));
                tree.setPositionWorld([pos.x, tile.elevation * context.config.heightScale, pos.y]);
            } else if (tile.hasTag('treeSparse')) {
                const tree = ResourcePrefabs.instance.spawn('ResourceTreeSparse')!;
                tree.rotateAxisAngleDegLocal([0, 1, 0], context.random.getItem(orientations));
                tree.setPositionWorld([pos.x, tile.elevation * context.config.heightScale, pos.y]);
            } else if (tile.hasTag('rock')) {
                const rock = ResourcePrefabs.instance.spawn('ResourceRock')!;
                rock.rotateAxisAngleDegLocal([0, 1, 0], context.random.getItem(orientations));
                rock.setPositionWorld([pos.x, tile.elevation * context.config.heightScale, pos.y]);
            }
            tile.object = hex;
        }

        // Add Castle
        const castleTileID = Tags.getTilesWithTag('castle')[0];
        const castleTile = grid.getTileById(castleTileID);
        if (!castleTile) {
            throw new Error('Castle tile not found in the grid. The castle is probably not created.');
        }

        const castleObject = TilePrefabs.instance.spawn(
            'BuildingCastle',
            castleTile.object
        );

        result.completionResult = CompletionResult.Success;
        return result;
    }

}
