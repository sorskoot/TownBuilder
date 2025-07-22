import {Component, Object3D, ViewComponent, Emitter} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import {vec3, mat4, quat} from 'gl-matrix';
import {HexagonTile} from '../classes/HexagonTile.js';

/**
 * A small epsilon value for float comparison.
 */
const EPSILON = 0.000001;

/**
 * Component for managing cursor interactions with the hexagonal grid.
 */
export class MyCursor extends Component {
    static TypeName = 'my-cursor';

    @property.object({required: true})
    public ray!: Object3D;

    public onTileHover = new Emitter<[{x: number; y: number; z: number}]>();
    public onTileClick = new Emitter<[{x: number; y: number; z: number}]>();

    private _lastTilePosition: {x: number; y: number; z: number} = {
        x: 0,
        y: 0,
        z: 0,
    };

    private _pointerDown: boolean = false;
    private _wasPointerDown: boolean = false;

    private _projectionMatrix: Float32Array = new Float32Array(16);
    private _viewComponent!: ViewComponent;
    private _lastPointerPos: vec3 = vec3.fromValues(-1, -1, 0);
    private _direction: vec3 = vec3.create();
    private _origin: vec3 = vec3.create();

    /**
     * Initializes the component and sets up the projection matrix.
     */
    public start(): void {
        this._viewComponent = this.object.getComponent(ViewComponent);
        this._viewComponent.getProjectionMatrix(this._projectionMatrix);
    }

    /**
     * Activates the component and adds event listeners.
     */
    public onActivate(): void {
        const canvas = this.engine.canvas;

        this.engine.onResize.add(this._onViewportResize);

        canvas.addEventListener('pointerdown', this._onPointerDown, {
            passive: false,
        });
        canvas.addEventListener('pointermove', this._onPointerMove, {
            passive: false,
        });
        canvas.addEventListener('pointerup', this._onPointerUp);

        this._pointerDown = false;
    }

    /**
     * Deactivates the component and removes event listeners.
     */
    public onDeactivate(): void {
        const canvas = this.engine.canvas;
        this.engine.onResize.remove(this._onViewportResize);
        canvas.removeEventListener('pointerdown', this._onPointerDown);
        canvas.removeEventListener('pointermove', this._onPointerMove);
        canvas.removeEventListener('pointerup', this._onPointerUp);

        this._pointerDown = false;
    }

    /**
     * Updates the cursor's direction and handles pointer events.
     * @param delta - The time elapsed since the last update.
     */
    public update(delta: number): void {
        this._updateDirection();
        if (this._pointerDown) {
            if (!this._wasPointerDown) {
                this._wasPointerDown = true;
                // Pointer is down and was not down before, so trigger event
                this.onTileClick.notify(this._lastTilePosition);
            }
        }
    }

    /**
     * Updates the direction vector based on the pointer position.
     */
    private _updateDirection(): void {
        this._direction[0] = 0;
        this._direction[1] = 0;
        this._direction[2] = -1;

        this._applyTransformAndProjectDirection();
    }

    /**
     * Applies the projection matrix to the direction vector.
     */
    private _applyTransformAndProjectDirection(): void {
        vec3.transformMat4(this._direction, this._direction, this._projectionMatrix);
        vec3.normalize(this._direction, this._direction);
        this._applyTransformToDirection();
    }

    /**
     * Transforms the direction vector into world space.
     */
    private _applyTransformToDirection(): void {
        this.object.transformVectorWorld(this._direction, this._direction);
        this.object.getPositionWorld(this._origin);

        const ndcX = (this._lastPointerPos[0] / window.innerWidth) * 2 - 1;
        const ndcY = 1 - (this._lastPointerPos[1] / window.innerHeight) * 2;
        const f = window.innerHeight / window.innerWidth;

        const v = this._viewComponent.extent / 2;
        const localPosition = vec3.fromValues(ndcX * v, ndcY * v * f, 50);

        const rotationQuat = quat.create();
        this.object.getRotationWorld(rotationQuat);

        vec3.transformQuat(localPosition, localPosition, rotationQuat);

        vec3.set(this._origin, localPosition[0], localPosition[1] + 1, localPosition[2]);
    }

    /**
     * Handles viewport resize events and updates the projection matrix.
     */
    private _onViewportResize = (): void => {
        if (!this._viewComponent) {
            return;
        }
        mat4.invert(this._projectionMatrix, this._viewComponent.projectionMatrix);
    };

    /**
     * Handles pointer down events.
     * @param e - The pointer event.
     */
    private _onPointerDown = (e: PointerEvent): void => {
        if (!e.isPrimary || e.button !== 0) {
            return;
        }
        this._pointerDown = true;
        this._wasPointerDown = false;
    };

    /**
     * Handles pointer move events.
     * @param e - The pointer event.
     */
    private _onPointerMove = (e: PointerEvent): void => {
        this._lastPointerPos[0] = e.clientX;
        this._lastPointerPos[1] = e.clientY;
        this._updateDirection();

        const hit = this.engine.physics.rayCast(this._origin, this._direction, 255, 100);
        if (hit.hitCount > 0) {
            const tilePos = HexagonTile.from2D(hit.locations[0][0], hit.locations[0][2]);
            if (
                !this._areFloatsEqual(tilePos.x, this._lastTilePosition.x) ||
                !this._areFloatsEqual(tilePos.y, this._lastTilePosition.y) ||
                !this._areFloatsEqual(tilePos.z, this._lastTilePosition.z)
            ) {
                this._lastTilePosition = tilePos;
                this.onTileHover.notify(tilePos);
            }
        }
    };

    /**
     * Handles pointer up events.
     * @param e - The pointer event.
     */
    private _onPointerUp = (e: PointerEvent): void => {
        if (!e.isPrimary || e.button !== 0) {
            return;
        }
        this._pointerDown = false;
    };

    /**
     * Compares two floating-point numbers for equality within a small epsilon.
     * @param a - The first number.
     * @param b - The second number.
     * @returns True if the numbers are approximately equal, false otherwise.
     */
    private _areFloatsEqual(a: number, b: number): boolean {
        return Math.abs(a - b) < EPSILON;
    }
}
