import { Component } from '@wonderlandengine/api';
import { quat, vec3 } from 'gl-matrix';
/**
 * OrbitalCamera component allows the user to orbit around a target point, which
 * is the position of the object itself. It rotates at the specified distance.
 *
 * @remarks
 * The component works using mouse or touch. Therefor it does not work in VR.
 */
export declare class OrbitalCamera extends Component {
    static TypeName: string;
    mouseButtonIndex: number;
    radial: number;
    minElevation: number;
    maxElevation: number;
    minZoom: number;
    maxZoom: number;
    xSensitivity: number;
    ySensitivity: number;
    zoomSensitivity: number;
    damping: number;
    private _mouseDown;
    private _origin;
    private _azimuth;
    private _polar;
    private _initialPinchDistance;
    private _touchStartX;
    private _touchStartY;
    private _azimuthSpeed;
    private _polarSpeed;
    init(): void;
    start(): void;
    onActivate(): void;
    onDeactivate(): void;
    update(): void;
    /**
     * Get the closest position to the given position on the orbit sphere of the camera.
     * This can be used to get a position and rotation to transition to.
     *
     * You pass this a position object. The method calculates the closest positition and updates the position parameter.
     * It also sets the rotation parameter to reflect the rotate the camera will have when it is on the orbit sphere,
     * pointing towards the center.
     * @param position the position to get the closest position to
     * @param rotation the rotation to get the closest position to
     */
    getClosestPosition(position: vec3, rotation: quat): void;
    /**
     * Set the camera position based on the given position and calculate the rotation.
     * @param cameraPosition the position to set the camera to
     */
    setPosition(cameraPosition: vec3): void;
    /**
     * Update the camera position based on the current azimuth,
     * polar and radial values
     */
    private _updateCamera;
    private _onMouseDown;
    private _onMouseUp;
    private _onMouseMove;
    private _onMouseScroll;
    private _onTouchStart;
    private _onTouchMove;
    private _onTouchEnd;
    /**
     * Helper function to calculate the distance between two touch points
     * @param touches list of touch points
     * @returns distance between the two touch points
     */
    private _getDistanceBetweenTouches;
}
