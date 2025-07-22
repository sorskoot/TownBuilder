import { Component } from '@wonderlandengine/api';
/**
 * Controls the camera orientation through mouse movement.
 *
 * Efficiently implemented to affect object orientation only
 * when the mouse moves.
 */
export declare class MouseLookComponent extends Component {
    static TypeName: string;
    /** Mouse look sensitivity */
    sensitity: number;
    /** Require a mouse button to be pressed to control view.
     * Otherwise view will allways follow mouse movement */
    requireMouseDown: boolean;
    /** If "moveOnClick" is enabled, mouse button which should
     * be held down to control view */
    mouseButtonIndex: number;
    /** Enables pointer lock on "mousedown" event on canvas */
    pointerLockOnClick: boolean;
    private currentRotationY;
    private currentRotationX;
    private mouseDown;
    onActivate(): void;
    onDeactivate(): void;
    requestPointerLock: () => void;
    onMouseDown: (e: MouseEvent) => false | undefined;
    onMouseUp: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
}
