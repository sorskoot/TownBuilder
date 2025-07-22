import {
    Component,
    Object3D,
    InputComponent,
    ViewComponent,
    Emitter,
    WonderlandEngine,
    RayHit,
    PhysXComponent,
} from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { vec3, mat4, quat } from 'gl-matrix';
import { HexagonTile } from '../classes/HexagonTile.js';

const EPSILON = 0.000001;

export class MyCursor extends Component {
    static TypeName = 'my-cursor';

    @property.object({ required: true })
    ray: Object3D;

    onTileHover = new Emitter<[{ x: number; y: number; z: number }]>();
    onTileClick = new Emitter<[{ x: number; y: number; z: number }]>();

    private _lastTilePosition: { x: number; y: number; z: number } = {
        x: 0,
        y: 0,
        z: 0,
    };

    private _pointerPressed: boolean;
    private _pointerDown: boolean;
    private _pointerUp: boolean;
    private _pointerPos: number[] = [-1, -1];
    private _previousPointerPos: number[] = [-1, -1];
    private _wasPointerDown = false;
    private _wasPointerUp = false;
    private _pointerMoved: boolean;
    private _wasPointerMoved: boolean;

    private _projectionMatrix = new Float32Array(16);
    private _viewComponent: ViewComponent;
    private _lastPointerPos: vec3 = [-1, -1, 0];
    private _direction: vec3 = [0, 0, 0];
    private _origin: vec3 = [0, 0, 0];

    start(): void {
        this._viewComponent = this.object.getComponent(ViewComponent);
        this._viewComponent.getProjectionMatrix(this._projectionMatrix);
    }

    onActivate(): void {
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
        this._pointerPressed = false;
        this._pointerUp = false;
    }

    onDeactivate(): void {
        const canvas = this.engine.canvas;
        this.engine.onResize.remove(this._onViewportResize);
        canvas.removeEventListener('pointerdown', this._onPointerDown);
        canvas.removeEventListener('pointermove', this._onPointerMove);
        canvas.removeEventListener('pointerup', this._onPointerUp);

        this._pointerDown = false;
        this._pointerPressed = false;
        this._pointerUp = false;
    }

    update(delta: number): void {
        this.updateDirection();
        if (this._pointerDown) {
            if (!this._wasPointerDown) {
                this._wasPointerDown = true;
                // pointer is down and was not down before, so trigger event
                this.onTileClick.notify(this._lastTilePosition);
            }
        }
    }
    private updateDirection() {
        const bounds = this.engine.canvas!.getBoundingClientRect();
        /* Get direction in normalized device coordinate space from mouse position */
        const left = this._lastPointerPos[0] / bounds.width;
        const top = this._lastPointerPos[1] / bounds.height;
        this._direction[0] = 0; //left * 2 - 1;
        this._direction[1] = 0; //-top * 2 + 1;
        this._direction[2] = -1;

        this.applyTransformAndProjectDirection();
    }

    private applyTransformAndProjectDirection() {
        /* Reverse-project the direction into view space */
        vec3.transformMat4(
            this._direction,
            this._direction,
            this._projectionMatrix
        );
        vec3.normalize(this._direction, this._direction);
        this.applyTransformToDirection();
    }

    private applyTransformToDirection() {
        this.object.transformVectorWorld(this._direction, this._direction);
        this.object.getPositionWorld(this._origin);

        const ndcX = (this._lastPointerPos[0] / window.innerWidth) * 2 - 1;
        const ndcY = 1 - (this._lastPointerPos[1] / window.innerHeight) * 2;
        const f = window.innerHeight / window.innerWidth;

        // Calculate the local position based on NDC
        const v = this._viewComponent.extent / 2;
        const localPosition = vec3.fromValues(ndcX * v, ndcY * v * f, 50);

        // Get the object's world rotation
        const rotationQuat = quat.create();
        this.object.getRotationWorld(rotationQuat);

        // Transform the local position by the object's rotation
        vec3.transformQuat(localPosition, localPosition, rotationQuat);

        // Set the transformed position to `_origin`
        vec3.set(
            this._origin,
            localPosition[0],
            localPosition[1] + 1,
            localPosition[2]
        );
    }
    private _onViewportResize = () => {
        if (!this._viewComponent) return;
        /* Projection matrix will change if the viewport is resized, which will affect the
         * projection matrix because of the aspect ratio. */
        mat4.invert(
            this._projectionMatrix,
            this._viewComponent.projectionMatrix
        );
    };

    // /* Pointer event handlers */
    private _onPointerDown = (e: PointerEvent) => {
        if (!e.isPrimary || e.button !== 0) {
            return;
        }
        this._pointerDown = true;
        this._wasPointerDown = false;
        this._pointerUp = false;
    };

    private _getDirectionFromQuaternion(rotationQuat: quat): vec3 {
        const forward = vec3.fromValues(0, 0, -1); // Default forward direction
        const direction = vec3.create();

        // Transform the forward direction vector using the rotation quaternion
        vec3.transformQuat(direction, forward, rotationQuat);

        return direction;
    }

    private _onPointerMove = (e: PointerEvent) => {
        this._lastPointerPos[0] = e.clientX;
        this._lastPointerPos[1] = e.clientY;
        this.updateDirection();
        // console.log(this._direction);
        // const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
        // const ndcY = 1 - (e.clientY / window.innerHeight) * 2;
        // const f = window.innerHeight / window.innerWidth;
        // const pos = [ndcX * 12.5, ndcY * 12.5 * f, 0];

        // get direction from camera rotation
        // const q = quat.create();
        // this.object.getRotationWorld(q);
        // const dir = this._getDirectionFromQuaternion(q);
        //this.ray.setScalingWorld([1, 1, 1]);

        const hit = this.engine.physics.rayCast(
            this._origin,
            this._direction,
            255,
            100
        );
        if (hit.hitCount > 0) {
            // this.ray.setPositionWorld([
            //     hit.locations[0][0],
            //     1,
            //     hit.locations[0][2],
            // ]);
            // console.log();
            const tilePos = HexagonTile.from2D(
                hit.locations[0][0],
                hit.locations[0][2]
            );
            // compare position with current position
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

    private _onPointerUp = (e: PointerEvent) => {
        // Only handle primary button
        if (!e.isPrimary || e.button !== 0) {
            return;
        }
        this._pointerUp = true;
        this._wasPointerUp = false;
        this._pointerDown = false;
    };

    private _areFloatsEqual(a: number, b: number): boolean {
        return Math.abs(a - b) < EPSILON;
    }
}
