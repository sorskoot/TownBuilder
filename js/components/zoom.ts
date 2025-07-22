import { Component, Object3D, ViewComponent } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';

export class Zoom extends Component {
    static TypeName = 'zoom';

    @property.int(25)
    defaultZoom = 25;

    @property.int(25)
    minZoom = 15;

    @property.int(100)
    maxZoom = 100;

    @property.float(0.5)
    zoomSensitivity = 0.5;

    private _zoom: number = 0;
    private _viewComponent: ViewComponent;

    init() {}

    start() {
        this._zoom = this.defaultZoom;
        this._viewComponent = this.object.getComponent(ViewComponent);
        this._updateCamera();
    }

    onActivate(): void {
        this.engine.canvas.addEventListener('wheel', this._onMouseScroll);
    }

    onDeactivate(): void {
        this.engine.canvas.removeEventListener('wheel', this._onMouseScroll);
    }

    private _onMouseScroll = (e: WheelEvent) => {
        e.preventDefault(); /* to prevent scrolling */

        this._zoom *= 1 - e.deltaY * this.zoomSensitivity * -0.001;
        this._zoom = Math.min(this.maxZoom, Math.max(this.minZoom, this._zoom));

        this._updateCamera();
    };

    private _updateCamera() {
        if (this._viewComponent) {
            if (this._viewComponent.extent !== this._zoom) {
                this._viewComponent.extent = this._zoom;
                this.engine.resize(
                    this.engine.canvas.clientWidth,
                    this.engine.canvas.clientHeight
                );
            }
        }
    }
}
