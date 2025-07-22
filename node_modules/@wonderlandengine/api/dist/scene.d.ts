import { WonderlandEngine } from './engine.js';
import { Emitter } from './utils/event.js';
import { Object3D, RayHit, Environment, ViewComponent, InputType } from './wonderland.js';
import { NumberArray } from './types.js';
import { Material } from './resources/material-manager.js';
import { Prefab, SceneLoadOptions } from './prefab.js';
import { GLTFExtensionsInstance, PrefabGLTF } from './scene-gltf.js';
export interface InstantiateResult {
    root: Object3D;
}
export interface InstantiateGltfResult extends InstantiateResult {
    extensions: GLTFExtensionsInstance | null;
}
/** Options for scene activation. */
export interface ActivateOptions {
    /** If `true`, dispatches a ready event in the document. */
    dispatchReadyEvent?: boolean;
    /**
     * If `true`, the promise will resolve only once all dependencies are downloaded.
     *
     * If `false`, resolves as soon as possible, e.g., when the lowest
     * resolution textures are available.
     */
    waitForDependencies?: boolean;
    /** @hidden */
    legacyLoaded?: boolean;
}
/**
 * Legacy gltf extension type.
 *
 * @deprecated Use the new {@link WonderlandEngine.loadGLTF} API.
 */
export interface GLTFExtensionsLegacy {
    /** glTF root extensions object. JSON data indexed by extension name. */
    root: Record<string, Record<string, any>>;
    /**
     * Mesh extension objects. Key is {@link Object3D.objectId}, value is JSON
     * data indexed by extension name.
     */
    mesh: Record<number, Record<string, Record<string, any>>>;
    /**
     * Node extension objects. Key is {@link Object3D.objectId}, value is JSON
     * data indexed by extension name.
     */
    node: Record<number, Record<string, Record<string, any>>>;
    /** Remapping from glTF node index to {@link Object3D.objectId}. */
    idMapping: number[];
}
/** Options for {@link Scene.append}. */
export interface SceneAppendParameters {
    /** Whether to load glTF extension data */
    loadGltfExtensions: boolean;
    baseURL: string | undefined;
}
/**
 * Result obtained when appending a scene with {@link Scene.append} with gltf extensions.
 */
export type SceneAppendResultWithExtensions = {
    root: Object3D | null;
    extensions: GLTFExtensionsLegacy;
};
/**
 * Result obtained when appending a scene with {@link Scene.append}.
 */
export type SceneAppendResult = (Object3D | null) | SceneAppendResultWithExtensions;
/**
 * Scene type to load with {@link ChunkedSceneLoadSink}.
 *
 * @since 1.2.1
 * @hidden
 */
export declare enum SceneType {
    Prefab = 0,
    Main = 1,
    Dependency = 2
}
/**
 * Sink for `WritableStream` that loads the data as a .bin file.
 *
 * Data is loaded chunk by chunk to minimize the total WASM allocation size.
 *
 * @since 1.2.1
 * @hidden
 */
export declare class ChunkedSceneLoadSink implements UnderlyingSink<Uint8Array> {
    #private;
    _loadIndex: number;
    sceneIndex: number;
    /** @overload */
    constructor(engine: WonderlandEngine, type: SceneType.Prefab, url: string);
    /** @overload */
    constructor(engine: WonderlandEngine, type: SceneType.Main, url: string);
    /** @overload */
    constructor(engine: WonderlandEngine, type: SceneType.Dependency, url: string, dependentSceneIndex: number);
    private _resizeBuffer;
    private _throwError;
    /**
     * Write a single blob of data.
     *
     * @param blob Data to parse
     */
    write(blob: Uint8Array): void;
    /** Called when all blobs of data have been written */
    close(): void;
    /** Called when the stream is aborted */
    abort(): void;
    /** Staging buffer size */
    get size(): number;
}
/**
 * Wonderland Engine (.bin) scene.
 *
 * Wonderland Engine packages two types of scene:
 * - Activatable scene: Contains objects, components, views, resources, and rendering data
 * - Streamable scene: Contains objects, components, and resources
 *
 * #### Activation
 *
 * Some scenes are **activatable**, they can thus be attached to the renderer
 * to be updated and rendered on the canvas.
 *
 * For more information, have a look at the {@link WonderlandEngine.switchTo} method.
 *
 * #### Instantiation
 *
 * Besides activation, a scene can instantiate the content of another scene.
 *
 * For more information, have a look at the {@link Scene#instantiate} method.
 *
 * @category scene
 */
export declare class Scene extends Prefab {
    /** Called before rendering the scene */
    readonly onPreRender: Emitter<void[]>;
    /** Called after the scene has been rendered */
    readonly onPostRender: Emitter<void[]>;
    /** Ray hit pointer in WASM heap. @hidden */
    private _rayHit;
    /** Ray hit. @hidden */
    private _hit;
    /** @hidden */
    private _environment;
    constructor(engine: WonderlandEngine, index: number);
    /** @overload */
    instantiate(scene: PrefabGLTF): InstantiateGltfResult;
    /**
     * Instantiate `scene` into this instance.
     *
     * Any scene can be instantiated into one another. It's thus possible
     * to instantiate a {@link PrefabGLTF} into this instance, or another
     * {@link Scene} instance.
     *
     * #### Usage
     *
     * ```js
     * const prefabScene = await engine.loadScene('Prefab.bin');
     * // Instantiate `prefabScene` into `scene`
     * engine.scene.instantiate(prefabScene);
     * ```
     *
     * #### Shared Resources
     *
     * Instantiating **does not** duplicate resources. Each instance will
     * reference the same assets stored in the {@link Scene}, e.g.,
     *
     * ```js
     * // `zombie` has one mesh and one material
     * const zombie = await engine.loadScene('Zombie.bin');
     *
     * for (let i = 0; i < 100; ++i) {
     *     engine.scene.instantiate(zombie);
     * }
     *
     * console.log(engine.meshes.count) // Prints '1'
     * console.log(engine.materials.count) // Prints '1'
     * ```
     *
     * #### glTF extensions
     *
     * Instantiating a prefab loaded from a .glb automatically retargets the extensions
     * to the created hierarchy:
     *
     * ```js
     * const gltf = await engine.loadGLTF({url: 'Model.glb', extensions: true});
     * const {root, extensions} = engine.scene.instantiate(gltf);
     *
     * // Retrieve Object3D instance from extension nodes list
     * for (const key in extensions.node) {
     *     const object3d = engine.scene.wrap(extensions.node[key]);
     * }
     * ```
     *
     * @param scene The scene to instantiate.
     * @returns An object containing the instantiated root {@link Object3D}.
     *     When a glTF is instantiated, the result can contain extra metadata.
     *     For more information, have a look at the {@link InstantiateResult} type.
     *
     * @since 1.2.0
     */
    instantiate(prefab: Prefab): InstantiateResult;
    /** @todo: Add `instantiateBatch` to instantiate multiple chunks in a row. */
    /**
     * @todo Provide an API to delete all resources linked to a scene.
     *
     * Example:
     *
     * ```ts
     * const scene = await engine.loadScene('Scene.bin');
     * ...
     * scene.destroy({removeResources: true});
     * ```
     */
    /**
     * Destroy this scene and remove it from the engine.
     *
     * @note Destroying a scene **doesn't** remove the materials, meshes,
     * and textures it references in the engine. Those should be cleaned up either by loading
     * another main scene via {@link WonderlandEngine.loadMainScene}, or manually using {@link Mesh.destroy}.
     *
     * @throws If the scene is currently active.
     * */
    destroy(): void;
    /**
     * View components.
     */
    get views(): ViewComponent[];
    /**
     * Active view components.
     */
    get activeViews(): ViewComponent[];
    /** Main view. */
    get mainView(): ViewComponent | null;
    /** Set the current non-VR view. */
    set mainView(view: ViewComponent | null);
    /**
     * Left eye view.
     */
    get leftEyeView(): ViewComponent | null;
    /**
     * Right eye view.
     */
    get rightEyeView(): ViewComponent | null;
    /**
     * Set input transformation.
     *
     * @hidden
     */
    _setInputTransformation(type: InputType, position: Readonly<NumberArray>, orientation: Readonly<NumberArray>): void;
    /**
     * Cast a ray through the scene and find intersecting collision components.
     *
     * The resulting ray hit will contain **up to 4** closest ray hits,
     * sorted by increasing distance.
     *
     * Example:
     *
     * ```js
     * const hit = engine.scene.rayCast(
     *     [0, 0, 0],
     *     [0, 0, 1],
     *     1 << 0 | 1 << 4, // Only check against components in groups 0 and 4
     *     25
     * );
     * if (hit.hitCount > 0) {
     *     const locations = hit.getLocations();
     *     console.log(`Object hit at: ${locations[0][0]}, ${locations[0][1]}, ${locations[0][2]}`);
     * }
     * ```
     *
     * @param o Ray origin.
     * @param d Ray direction.
     * @param groupMask Bitmask of collision groups to filter by: only objects
     *        that are part of given groups are considered for the raycast.
     * @param maxDistance Maximum **inclusive** hit distance. Defaults to `100`.
     *
     * @returns The {@link RayHit} instance, cached by this class.
     *
     * @note The returned {@link RayHit} object is owned by the {@link Scene}
     *       instance and will be reused with the next {@link Scene#rayCast} call.
     */
    rayCast(o: Readonly<NumberArray>, d: Readonly<NumberArray>, groupMask: number, maxDistance?: number): RayHit;
    /**
     * Set the background clear color.
     *
     * @param color new clear color (RGBA).
     * @since 0.8.5
     */
    set clearColor(color: number[]);
    /**
     * Set whether to clear the color framebuffer before drawing.
     *
     * This function is useful if an external framework (e.g. an AR tracking
     * framework) is responsible for drawing a camera frame before Wonderland
     * Engine draws the scene on top of it.
     *
     * @param b Whether to enable color clear.
     * @since 0.9.4
     */
    set colorClearEnabled(b: boolean);
    /**
     * Load a scene file (.bin).
     *
     * Will replace the currently active scene with the one loaded
     * from given file. It is assumed that JavaScript components required by
     * the new scene were registered in advance.
     *
     * Once the scene is loaded successfully and initialized,
     * {@link WonderlandEngine.onSceneLoaded} is notified.
     *
     * #### ArrayBuffer
     *
     * The `load()` method accepts an in-memory buffer:
     *
     * ```js
     * scene.load({
     *     buffer: new ArrayBuffer(...),
     *     baseURL: 'https://my-website/assets'
     * })
     * ```
     *
     * @note The `baseURL` is mandatory. It's used to fetch images and languages.
     *
     * Use {@link Scene.setLoadingProgress} to update the loading progress bar
     * when using an ArrayBuffer.
     *
     * @deprecated Use the new {@link WonderlandEngine.loadMainScene} API.
     *
     * @param options Path to the file to load, or an option object.
     *     For more information about the options, see the {@link SceneLoadOptions} documentation.
     * @returns Promise that resolves when the scene was loaded.
     */
    load(options: string | SceneLoadOptions): Promise<Scene>;
    /**
     * Append a scene file.
     *
     * Loads and parses the file and its images and appends the result
     * to the currently active scene.
     *
     * Supported formats are streamable Wonderland scene files (.bin) and glTF
     * 3D scenes (.gltf, .glb).
     *
     * ```js
     * WL.scene.append(filename).then(root => {
     *     // root contains the loaded scene
     * });
     * ```
     *
     * In case the `loadGltfExtensions` option is set to true, the response
     * will be an object containing both the root of the loaded scene and
     * any glTF extensions found on nodes, meshes and the root of the file.
     *
     * ```js
     * WL.scene.append(filename, { loadGltfExtensions: true }).then(({root, extensions}) => {
     *     // root contains the loaded scene
     *     // extensions.root contains any extensions at the root of glTF document
     *     const rootExtensions = extensions.root;
     *     // extensions.mesh and extensions.node contain extensions indexed by Object id
     *     const childObject = root.children[0];
     *     const meshExtensions = root.meshExtensions[childObject.objectId];
     *     const nodeExtensions = root.nodeExtensions[childObject.objectId];
     *     // extensions.idMapping contains a mapping from glTF node index to Object id
     * });
     * ```
     *
     * If the file to be loaded is located in a subfolder, it might be useful
     * to define the `baseURL` option. This will ensure any bin files
     * referenced by the loaded bin file are loaded at the correct path.
     *
     * ```js
     * WL.scene.append(filename, { baseURL: 'scenes' }).then(({root, extensions}) => {
     *     // do stuff
     * });
     * ```
     *
     * @deprecated Use the new {@link Prefab} and {@link Scene} API.
     *
     * @param file The .bin, .gltf or .glb file to append. Should be a URL or
     *   an `ArrayBuffer` with the file content.
     * @param options Additional options for loading.
     * @returns Promise that resolves when the scene was appended.
     */
    append(file: string | ArrayBuffer, options?: Partial<SceneAppendParameters>): Promise<SceneAppendResult>;
    /**
     * Update the loading screen progress bar.
     *
     * @param value Current loading percentage, in the range [0; 1].
     *
     * @deprecated Use {@link WonderlandEngine.setLoadingProgress}.
     */
    setLoadingProgress(percentage: number): void;
    /**
     * Dispatch an event 'wle-scene-ready' in the document.
     *
     * @note This is used for automatic testing.
     */
    dispatchReadyEvent(): void;
    /**
     * Set the current material to render the sky.
     *
     * @note The sky needs to be enabled in the editor when creating the scene.
     * For more information, please refer to the background [tutorial](https://wonderlandengine.com/tutorials/background-effect/).
     */
    set skyMaterial(material: Material | null);
    /** Current sky material, or `null` if no sky is set. */
    get skyMaterial(): Material | null;
    /**
     * Environment lighting properties.
     *
     * @since 1.2.3
     */
    get environment(): Environment;
    /**
     * Relative url to the js components bundle
     *
     * Returns `null` if the scene was built without a components bundle.
     */
    get componentsBundle(): string | null;
    /**
     * Reset the scene.
     *
     * This method deletes all used and allocated objects, and components.
     *
     * @deprecated Load a new scene and activate it instead.
     */
    reset(): void;
    /**
     * Download and apply queued dependency files (.bin).
     *
     * @hidden
     */
    _downloadDependency(url: string): Promise<void>;
    /**
     * Download and apply queued dependency files (.bin).
     *
     * @hidden
     */
    _downloadDependencies(): Promise<void | void[]>;
}
