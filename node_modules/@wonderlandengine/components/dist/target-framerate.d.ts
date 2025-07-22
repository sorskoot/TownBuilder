/// <reference types="webxr" />
import { Component } from '@wonderlandengine/api';
/**
 * Sets the target framerate
 *
 * [Updates the target framerate](https://immersive-web.github.io/webxr/#dom-xrsession-updatetargetframerate)
 * to the closest [supported target framerate](https://immersive-web.github.io/webxr/#dom-xrsession-supportedFrameRates)
 * to the given `framerate`.
 *
 * The target framerate is used for the device's VR compositor as an indication of how often to refresh the
 * screen with new images. This means the app will be asked to produce frames in more regular intervals,
 * potentially spending less time on frames that are likely to be dropped.
 *
 * For apps with heavy load, setting a well matching target framerate can improve the apps rendering stability
 * and reduce stutter.
 *
 * Likewise, the target framerate can be used to enable 120Hz refresh rates on Oculus Quest 2 on simpler apps.
 */
export declare class TargetFramerate extends Component {
    static TypeName: string;
    framerate: number;
    onActivate(): void;
    onDeactivate(): void;
    setTargetFramerate: (s: XRSession) => void;
}
