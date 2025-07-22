import { WonderlandEngine } from './engine.js';
import { InstantiateGltfResult } from './scene.js';
import { Prefab } from './prefab.js';
import { Object3D } from './wonderland.js';
/** GLTF-specific loading options. */
export type GLTFOptions = {
    /** If `true`, extensions will be parsed. */
    extensions?: boolean;
};
/**
 * Extension data obtained from glTF files.
 */
export interface GLTFExtensionsInstance {
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
export declare class GLTFExtensions {
    objectCount: number;
    /** glTF root extensions object. JSON data indexed by extension name. */
    root: Record<string, any>;
    /**
     * Mesh extension objects. Key is the gltf index, value is JSON
     * data indexed by extension name.
     */
    mesh: Record<number, Record<string, any>>;
    /**
     * Node extension objects. Key is a glTF index, value is JSON
     * data indexed by extension name.
     */
    node: Record<number, Record<string, any>>;
    constructor(count: number);
}
/**
 * glTF scene.
 *
 * At the opposite of {@link Scene}, glTF scenes can be instantiated
 * in other scenes but can't:
 * - Be activated
 * - Be the destination of an instantiation
 *
 * #### Usage
 *
 * ```js
 * const prefab = await engine.loadGLTF('Zombie.glb');
 *
 * const scene = engine.scene;
 * for (let i = 0; i < 100; ++i) {
 *     scene.instantiate(prefab);
 * }
 * ```
 *
 * Since this class inherits from {@link Prefab}, you can use the shared
 * API to modify the glTF before an instantiation:
 *
 * ```js
 * const prefab = await engine.loadGLTF('Zombie.glb');
 * const zombie = prefab.findByName('Zombie')[0];
 *
 * // The mesh is too small, we scale the root
 * zombie.setScalingWorld([2, 2, 2]);
 * // Add a custom js 'health' component to the root
 * zombie.addComponent('health', {value: 100});
 *
 * // 'Zombie' is wrapped in a new root added during instantiation
 * const {root} = engine.scene.instantiate(prefab);
 * const instanceZombie = root.children[0];
 * console.log(instanceZombie.getScalingWorld()); // Prints '[2, 2, 2]'
 * ```
 *
 * @category scene
 * @since 1.2.0
 */
export declare class PrefabGLTF extends Prefab {
    /**
     * Raw extensions read from the glTF file.
     *
     * The extensions will be mapped to the hierarchy upon instantiation.
     * For more information, have a look at the {@link InstantiateGltfResult} type.
     *
     * @note The glTF must be loaded with `extensions` enabled. If not, this
     * field will be set to `null`. For more information, have a look at the
     * {@link GLTFOptions} type.
     */
    extensions: GLTFExtensions | null;
    /**
     * @note This api is meant to be used internally.
     *
     * @hidden
     */
    constructor(engine: WonderlandEngine, index: number);
    /**
     * Instantiate the glTF extensions on an active sub scene graph.
     *
     * @param id The root object id.
     * @param result The instantiation object result.
     *
     * @hidden
     */
    _processInstantiaton(dest: Prefab, root: Object3D, result: InstantiateGltfResult): null | undefined;
    /**
     * Unmarshalls gltf extensions.
     *
     * @hidden
     */
    private _readExtensions;
}
