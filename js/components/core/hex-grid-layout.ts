import { Component, Object3D } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { HexagonGrid } from '../../classes/HexGrid.js';
import { HexagonTile } from '../../classes/HexagonTile.js';
import { MyCursor } from '../generic/my-cursor.js';
import { vec3 } from 'gl-matrix';
import {
    Noise,
} from '@sorskoot/wonderland-components';

import { GameCore } from '../../classes/core/GameCore.js';
import { StepsPipeline } from '../../classes/generator/core/StepsPipeline.ts';
import { BaseStepExec, StepContext } from '../../classes/generator/core/Steps.ts';
import { CreateHexagonGridExec, CreateHexagonGridParameters } from '../../classes/generator/steps/CreateHexagonGrid.ts';
import { RenderHexagonGridExec } from '../../classes/generator/steps/RenderHexagonGrid.ts';
import { FlattenAroundCastleExec, FlattenAroundCastleParameters } from '../../classes/generator/steps/FlattenAroundCastle.ts';
import { AddResourcesExec } from '../../classes/generator/steps/AddResources.ts';

/**
 * Component responsible for managing the hexagonal grid layout.
 */
export class HexGridLayout extends Component {
    static TypeName = 'hex-grid-layout';

    @property.object({ required: true })
    public cursorObject!: Object3D;

    @property.object({ required: true })
    public highlight!: Object3D;

    private _grid!: HexagonGrid;
    public get grid(): HexagonGrid {
        return this._grid;
    }
    private _myCursor!: MyCursor;
    private _hoveringTile: HexagonTile | null = null;

    private static _instance: HexGridLayout;
    static get instance(): HexGridLayout {
        return HexGridLayout._instance;
    }

    init() {
        if (HexGridLayout._instance) {
            throw new Error(
                'There can only be one instance of HexGridLayout Component'
            );
        }
        HexGridLayout._instance = this;
    }

    /**
     * Initializes the component and sets up the grid.
     */
    public start(): void {
        Noise.seed(Date.now());

        this._myCursor = this.cursorObject.getComponent(MyCursor)!;
        this.highlight.setScalingLocal([0, 0, 0]);
        GameCore.instance.onLoaded.add(this._onGameLoaded);
    }

    /**
     * Activates the component and adds event listeners.
     */
    public onActivate(): void {
        this._myCursor.onTileHover.add(this._onTileHover);
        this._myCursor.onTileClick.add(this._onTileClick);
    }

    /**
     * Deactivates the component and removes event listeners.
     */
    public onDeactivate(): void {
        this._myCursor.onTileHover.remove(this._onTileHover);
        this._myCursor.onTileClick.remove(this._onTileClick);
    }

    private _onGameLoaded = () => {
        this._createGrid();
    }

    /**
     * Creates the hexagonal grid and populates it with tiles.
     */
    private _createGrid(): void {
        const pipeline = new StepsPipeline<BaseStepExec>();

        pipeline.addStep(new CreateHexagonGridExec(
        ), new CreateHexagonGridParameters());

        const flattenParams = new FlattenAroundCastleParameters()
        flattenParams.startElevation = 0.75;
        pipeline.addStep(new FlattenAroundCastleExec(), flattenParams);

        pipeline.addStep(new AddResourcesExec());

        pipeline.addStep(new RenderHexagonGridExec());

        const context = new StepContext({
            rockThreshold: 0.3
        });

        const result = pipeline.execute(context);
    }


    /**
     * Handles tile click events.
     */
    private _onTileClick = (tilePos: { x: number; y: number; z: number }): void => {
        if (!this._grid) {
            return;
        }
        const tile = this._grid.getTile(tilePos.x, tilePos.y, tilePos.z);
    };

    /**
     * Handles tile hover events.
     */
    private _onTileHover = (tilePos: { x: number; y: number; z: number }): void => {
        if (!this._grid) {
            return;
        }
        const tile = this._grid.getTile(tilePos.x, tilePos.y, tilePos.z);
        if (tile) {
            //this.engine.canvas.style.cursor = 'none';
            this._hoveringTile = tile;
            const pos = vec3.create();
            tile.object.getPositionWorld(pos);
            this.highlight.setScalingLocal([1, 1, 1]);
            this.highlight.setPositionWorld(pos);
        } else {
            this.highlight.setScalingLocal([0, 0, 0]);
            //    this.engine.canvas.style.cursor = 'auto';
        }
    };
}
