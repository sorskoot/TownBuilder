import { Component, Texture, Material } from '@wonderlandengine/api';
/**
 * Downloads a video from URL and applies it as `diffuseTexture` or `flatTexture`
 * on given material.
 *
 * Video textures need to be updated regularly whenever
 * a new frame is available. This component handles the
 * detection of a new frame and updates the texture to
 * reflect the video's current frame.
 *
 * Materials from the following shaders are supported:
 *  - "Phong Opaque Textured"
 *  - "Flat Opaque Textured"
 *  - "Background"
 *  - "Physical Opaque Textured"
 *  - "Foliage"
 *
 * The video can be accessed through `this.video`:
 *
 * ```js
 *   let videoTexture = this.object.getComponent('video-texture');
 *   videoTexture.video.play();
 *   videoTexture.video.pause();
 * ```
 *
 * See [Video Example](/showcase/video).
 */
export declare class VideoTexture extends Component {
    static TypeName: string;
    /** URL to download video from */
    url: string;
    /** Material to apply the video texture to */
    material: Material;
    /** Whether to loop the video */
    loop: boolean;
    /** Whether to automatically start playing the video */
    autoplay: boolean;
    /** Whether to mute sound */
    muted: boolean;
    /** Name of the texture property to set */
    textureProperty: string;
    loaded: boolean;
    frameUpdateRequested: boolean;
    video?: HTMLVideoElement;
    texture?: Texture;
    start(): void;
    onDestroy(): void;
    applyTexture(): void;
    update(dt: number): void;
    updateVideo(): void;
    playAfterUserGesture: () => void;
}
