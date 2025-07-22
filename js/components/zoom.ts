import {Component, Object3D, ViewComponent} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

/**
 * Component for managing zoom functionality in the camera view.
 */
export class Zoom extends Component {
    static TypeName = 'zoom';

    /**
     * The default zoom level.
     */
    @property.int(25)
    public defaultZoom: number = 25;

    /**
     * The minimum zoom level.
     */
    @property.int(25)
    public minZoom: number = 15;

    /**
     * The maximum zoom level.
     */
    @property.int(100)
    public maxZoom: number = 100;

    /**
     * The sensitivity of the zoom when scrolling.
     */
    @property.float(0.5)
    public zoomSensitivity: number = 0.5;

    private _zoom: number = 0;
    private _viewComponent!: ViewComponent;

    /**
     * Initializes the component. Currently unused.
     */
    public init(): void {}

    /**
     * Sets up the initial zoom level and retrieves the view component.
     */
    public start(): void {
        this._zoom = this.defaultZoom;
        this._viewComponent = this.object.getComponent(ViewComponent);
        this._updateCamera();
    }

    /**
     * Activates the component and adds the mouse scroll event listener.
     */
    public onActivate(): void {
        this.engine.canvas.addEventListener('wheel', this._onMouseScroll);
    }

    /**
     * Deactivates the component and removes the mouse scroll event listener.
     */
    public onDeactivate(): void {
        this.engine.canvas.removeEventListener('wheel', this._onMouseScroll);
    }

    /**
     * Handles mouse scroll events to adjust the zoom level.
     * @param e - The wheel event triggered by scrolling.
     */
    private _onMouseScroll = (e: WheelEvent): void => {
        e.preventDefault(); // Prevent default scrolling behavior

        this._zoom *= 1 - e.deltaY * this.zoomSensitivity * -0.001;
        this._zoom = Math.min(this.maxZoom, Math.max(this.minZoom, this._zoom));

        this._updateCamera();
    };

    /**
     * Updates the camera's zoom level by adjusting the view component's extent.
     */
    private _updateCamera(): void {
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
