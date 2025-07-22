import { Component, Object3D } from '@wonderlandengine/api';
/**
 * Basic movement with W/A/S/D keys.
 */
export declare class WasdControlsComponent extends Component {
    static TypeName: string;
    /** Movement speed in m/s. */
    speed: number;
    /** Flag for only moving the object on the global x & z planes */
    lockY: boolean;
    /** Object of which the orientation is used to determine forward direction */
    headObject: Object3D | null;
    right: boolean;
    down: boolean;
    left: boolean;
    up: boolean;
    start(): void;
    onActivate(): void;
    onDeactivate(): void;
    update(): void;
    press: (e: KeyboardEvent) => void;
    release: (e: KeyboardEvent) => void;
    handleKey(e: KeyboardEvent, b: boolean): void;
}
