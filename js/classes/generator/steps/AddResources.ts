
import { HexagonGrid } from '../../HexGrid.ts';
import { TileType } from '../../TileType.ts';
import {
    BaseStepExec,
    StepContext,
    StepResult,
    CompletionResult,
    StepParameters,
    StepInput,
    NoStepParameters,
} from '../core/Steps.js';
import { Noise } from '@sorskoot/wonderland-components';

export class AddResourcesExec extends BaseStepExec<StepInput, NoStepParameters> {
    execute(context: StepContext, input: StepInput, parameters: NoStepParameters): StepResult {

        const result = new StepResult();
        result.state = input.incomingResults[0].state;
        const grid = result.state.getState(HexagonGrid);

        if (!grid) {
            result.completionResult = CompletionResult.Failure;
            result.error = 'HexagonGrid not found in the state.';
            return result;
        }

        const tiles = grid.getAllTiles();

        // Add trees
        for (const tile of tiles) {
            if (tile.type === TileType.Grass && !tile.hasTag('castle')) {
                const pos = tile.to2D();
                let value = Noise.perlin2(
                    pos.x / context.config.treeNoiseScale + context.config.treeNoiseOffset,
                    pos.y / context.config.treeNoiseScale + context.config.treeNoiseOffset
                );
                value = (value + 1) / 2; // Normalize to [0, 1]
                if (value > context.config.treeThreshold) {
                    tile.addTag('treeDense');
                } else if (value > context.config.treeSparseThreshold) {
                    tile.addTag('treeSparse');
                } else if (value < context.config.rockThreshold) {
                    tile.addTag('rock');
                }
            }
        }

        result.completionResult = CompletionResult.Success; // Mark the step as successful
        return result;
    }

}
