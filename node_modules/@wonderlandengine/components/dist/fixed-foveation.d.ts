import { Component } from '@wonderlandengine/api';
/**
 * Applies [fixed foveation](https://www.w3.org/TR/webxrlayers-1/#dom-xrcompositionlayer-fixedfoveation)
 * once a WebXR session is started
 *
 * Fixed foveation reduces shading cost at the periphery by rendering at lower resolutions at the
 * edges of the users vision.
 */
export declare class FixedFoveation extends Component {
    static TypeName: string;
    /** Amount to apply from 0 (none) to 1 (full) */
    fixedFoveation: number;
    onActivate(): void;
    onDeactivate(): void;
    setFixedFoveation: () => void;
}
