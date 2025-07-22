import { Component } from '@wonderlandengine/api';
/**
 * Retrieve device orientation from a mobile device and set the object's
 * orientation accordingly.
 *
 * Useful for magic window experiences.
 */
export declare class DeviceOrientationLook extends Component {
    static TypeName: string;
    static Properties: {};
    rotationX: number;
    rotationY: number;
    lastClientX: number;
    lastClientY: number;
    deviceOrientation: number[];
    screenOrientation: number;
    private _origin;
    onActivate(): void;
    onDeactivate(): void;
    update(): void;
    onDeviceOrientation: (e: DeviceOrientationEvent) => void;
    onOrientationChange: () => void;
}
