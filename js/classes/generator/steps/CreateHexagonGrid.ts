
import { Mathf, Noise } from '@sorskoot/wonderland-components';
import { HexagonTile } from '../../HexagonTile.ts';
import { HexagonGrid } from '../../HexGrid.ts';
import { TileType } from '../../TileType.ts';
import {
    BaseStepExec,
    NoStepInput,
    StepContext,
    StepResult,
    CompletionResult,
    StepParameters,
} from '../core/Steps.js';


export class CreateHexagonGridExec extends BaseStepExec<NoStepInput, CreateHexagonGridParameters> {
    private _context!: StepContext;

    execute(
        context: StepContext,
        input: NoStepInput,
        parameters: CreateHexagonGridParameters
    ): StepResult {

        this._context = context;

        const grid = new HexagonGrid();
        const center = new HexagonTile(0, 0, 0, TileType.Grass, 0.75);
        center.addTag('castle'); // Tag the center tile as a castle
        grid.addTile(center);
        let layer: HexagonTile[] = [center];
        for (let i = 0; i < parameters.size; i++) {
            layer = this._expand(grid, layer);
        }
        const result = new StepResult();
        result.state.setState(HexagonGrid, grid);
        result.completionResult = CompletionResult.Success; // Mark the step as successful
        return result;
    }

    /**
     * Expands the grid by adding new tiles around the given tiles.
     * @param tiles - The tiles to expand around.
     * @returns The newly added tiles.
     */
    private _expand(grid: HexagonGrid, tiles: HexagonTile[]): HexagonTile[] {
        const newTiles: HexagonTile[] = [];
        tiles.forEach((tile) => {
            for (const neighborCoords of tile.neighbors()) {
                if (
                    !grid.getTile(
                        neighborCoords.x,
                        neighborCoords.y,
                        neighborCoords.z
                    )
                ) {
                    const pos = tile.to2D();
                    let value = Noise.simplex2(
                        pos.x / this._context.config.noiseScale + this._context.config.noiseOffset,
                        pos.y / this._context.config.noiseScale + this._context.config.noiseOffset
                    );
                    value = (value + 1) / 2; // Normalize to [0, 1]
                    const newTile = new HexagonTile(
                        neighborCoords.x,
                        neighborCoords.y,
                        neighborCoords.z,
                        value > this._context.config.waterLevel ? TileType.Grass : TileType.Water,
                        Mathf.clamp(value, this._context.config.waterLevel, 1) -
                        this._context.config.waterLevel
                    );

                    grid.addTile(newTile);
                    newTiles.push(newTile);
                }
            }
        });
        return newTiles;
    }
}

/**
 * Defines the parameters for the {@link CreateHexagonGridExec}.
 */
export class CreateHexagonGridParameters extends StepParameters {

    public size: number = 20;

}
