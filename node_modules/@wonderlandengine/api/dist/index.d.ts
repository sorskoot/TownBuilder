import { WonderlandEngine } from './engine.js';
import { XROfferSessionOptions } from './webxr.js';
import { LogLevel } from './utils/logger.js';
export * from './utils/index.js';
export * from './decorators.js';
export { NativeComponents } from './component.js';
export * from './wonderland.js';
export * from './engine.js';
export * from './webxr.js';
export * from './property.js';
export * from './prefab.js';
export * from './scene.js';
export * from './scene-gltf.js';
export * from './resources/resource.js';
export * from './resources/material-manager.js';
export * from './resources/mesh-manager.js';
export { TextureManager } from './resources/texture-manager.js';
export * from './types.js';
export * from './version.js';
export * from './wasm.js';
/**
 * Options to forward to {@link loadRuntime}
 */
export interface LoadRuntimeOptions {
    /**
     * @deprecated Ignored, SIMD in the runtime is always enabled as it's supported on
     * all modern browsers.
     */
    simd: boolean;
    /**
     * If `true`, forces the runtime to load the threads-compatible version.
     * If `undefined`, performs browser feature detection to check whether threads are supported or not.
     */
    threads: boolean;
    /**
     * If `true`, forces the runtime to load the webgpu-compatible version.
     */
    webgpu: boolean;
    /**
     * If `true`, forces the runtime to load a physx-compatible version.
     *
     * **Note**: If your scene uses physx, you **must** enable this option.
     */
    physx: boolean;
    /**
     * If `true`, forces the runtime to load a loader-compatible version.
     *
     * This option allows to load gltf data at runtime.
     */
    loader: boolean;
    /**
     * Whether to instantiate the runtime with a renderer.
     *
     * Disabling this is mostly meant for testing purposes (increased speed).
     *
     * @hidden
     */
    renderer: boolean;
    /**
     * Path to the loading screen. If `undefined`, defaults to 'WonderlandRuntime-LoadingScreen.bin'.
     * Beware that these are special .bin files signed by Wonderland. Customizing
     * requires an enterprise license, please reach out for more information.
     */
    loadingScreen: string;
    /**
     * Default framebuffer scale factor. This can later be changed using
     * {@link WonderlandEngine.xrFramebufferScaleFactor}
     */
    xrFramebufferScaleFactor: number;
    /**
     * Whether to advertise AR/VR session support to the browser.
     *
     * Adds an interactive UI element to the browser interface to start an XR
     * session. Browser support is optional, so it's advised to still allow
     * requesting a session with a UI element on the website itself.
     *
     * If `undefined`, no XR session is automatically offered to the browser.
     *
     * @since 1.1.5
     */
    xrOfferSession: XROfferSessionOptions;
    /**
     * Canvas id or element. If this is `undefined`, looks for a canvas with id 'canvas'.
     */
    canvas: string;
    /**
     * Logging level(s) to enable.
     *
     * By default, all levels are enabled.
     */
    logs: LogLevel[];
}
/**
 * Load the runtime using the WASM and JS files.
 *
 * @param runtime The runtime base string, e.g,: `WonderlandRuntime-loader-physx`.
 * @param options Options to modify the loading behaviour.
 *
 * @returns A promise that resolves when the engine is ready to be used.
 */
export declare function loadRuntime(runtime: string, options?: Partial<LoadRuntimeOptions>): Promise<WonderlandEngine>;
