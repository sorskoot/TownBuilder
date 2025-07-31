
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
} from '../core/Steps.js';
import { Object3D } from '@wonderlandengine/api';
import { TilePrefabs } from '../../../components/core/tile-prefabs.ts';
import { HexagonTile } from '../../HexagonTile.ts';
import { Easing, lerp } from '@sorskoot/wonderland-components';


export class FlattenAroundCastleExec extends BaseStepExec<StepInput, FlattenAroundCastleParameters> {
    private _context!: StepContext;

    execute(context: StepContext, input: StepInput, parameters: FlattenAroundCastleParameters): StepResult {
        this._context = context;
        const result = new StepResult();
        result.state = input.incomingResults[0].state;
        const grid = result.state.getState(HexagonGrid);

        if (!grid) {
            result.completionResult = CompletionResult.Failure;
            result.error = 'HexagonGrid not found in the state.';
            return result;
        }
        const castleTileID = Tags.getTileWithTag('castle')!;
        const castleTile = grid.getTileById(castleTileID)!;
        this._flattenNeighborsBFS(grid, castleTile, castleTile.elevation);

        result.completionResult = CompletionResult.Success; // Mark the step as successful
        return result;
    }

    private _flattenNeighborsBFS(grid: HexagonGrid, rootTile: HexagonTile, startElevation: number): void {
        const queue: { tile: HexagonTile; distance: number }[] = [
            { tile: rootTile, distance: 0 },
        ];
        const visitedTiles = new Set<string>();
        visitedTiles.add(rootTile.id);

        while (queue.length > 0) {
            const { tile, distance } = queue.shift()!;

            if (distance >= this._context.config.castleFlattenDistance) {
                continue; // Stop flattening after a certain distance
            }

            tile.elevation = lerp(
                startElevation,
                tile.elevation,
                distance / this._context.config.castleFlattenDistance,
                Easing.Hermite
            );
            tile.type = TileType.Grass; // Ensure the tile is grass

            for (const neighbor of tile.neighbors()) {
                const neighborTile = grid.getTile(neighbor.x, neighbor.y, neighbor.z);

                if (neighborTile && !visitedTiles.has(neighborTile.id)) {
                    visitedTiles.add(neighborTile.id);
                    queue.push({ tile: neighborTile, distance: distance + 1 });
                }
            }
        }
    }
}

export class FlattenAroundCastleParameters extends StepParameters {
    startElevation!: number;
}