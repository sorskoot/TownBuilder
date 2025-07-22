import { WonderlandEngine } from '../engine.js';
import { Prefab } from '../prefab.js';
import { FirstConstructorParam } from '../types.js';
/** Interface for a resource class */
type ResourceConstructor<T extends SceneResource | Resource> = {
    new (host: FirstConstructorParam<T>, index: number): T;
};
/**
 * Base class for engine resources, such as:
 * - {@link Texture}
 * - {@link Mesh}
 * - {@link Material}
 *
 * @since 1.2.0
 */
export declare abstract class Resource {
    /** Relative index in the host. @hidden */
    readonly _index: number;
    /** For compatibility with SceneResource. @hidden */
    readonly _id: number;
    /** @hidden */
    private readonly _engine;
    constructor(engine: WonderlandEngine, index: number);
    /** Hosting engine instance. */
    get engine(): WonderlandEngine;
    /** Index of this resource in the {@link Scene}'s manager. */
    get index(): number;
    /**
     * Checks equality by comparing ids and **not** the JavaScript reference.
     *
     * @deprecated Use JavaScript reference comparison instead:
     *
     * ```js
     * const meshA = engine.meshes.create({vertexCount: 1});
     * const meshB = engine.meshes.create({vertexCount: 1});
     * const meshC = meshB;
     * console.log(meshA === meshB); // false
     * console.log(meshA === meshA); // true
     * console.log(meshB === meshC); // true
     * ```
     */
    equals(other: this | undefined | null): boolean;
    /**
     * `true` if the object is destroyed, `false` otherwise.
     *
     * If {@link WonderlandEngine.erasePrototypeOnDestroy} is `true`,
     * reading a class attribute / method will throw.
     */
    get isDestroyed(): boolean;
}
/**
 * Base class for scene resources, such as:
 *  * - {@link Texture}
 * - {@link Mesh}
 * - {@link Material}
 * - {@link Skin}
 * - {@link Animation}
 *
 * @since 1.2.0
 */
export declare abstract class SceneResource {
    /** @hidden */
    static _pack(scene: number, index: number): number;
    /** Relative index in the host. @hidden */
    readonly _index: number;
    /** For compatibility with SceneResource. @hidden */
    readonly _id: number;
    /** @hidden */
    protected readonly _scene: Prefab;
    constructor(scene: Prefab, index: number);
    /**
     * Checks equality by comparing ids and **not** the JavaScript reference.
     *
     * @deprecated Use JavaScript reference comparison instead:
     *
     * ```js
     * const meshA = engine.meshes.create({vertexCount: 1});
     * const meshB = engine.meshes.create({vertexCount: 1});
     * const meshC = meshB;
     * console.log(meshA === meshB); // false
     * console.log(meshA === meshA); // true
     * console.log(meshB === meshC); // true
     * ```
     */
    equals(other: this | undefined | null): boolean;
    /** Hosting instance. */
    get scene(): Prefab;
    /** Hosting engine instance. */
    get engine(): WonderlandEngine;
    /** Index of this resource in the {@link Scene}'s manager. */
    get index(): number;
    /**
     * `true` if the object is destroyed, `false` otherwise.
     *
     * If {@link WonderlandEngine.erasePrototypeOnDestroy} is `true`,
     * reading a class attribute / method will throw.
     */
    get isDestroyed(): boolean;
}
/**
 * Manager for resources.
 *
 * Resources are accessed via the engine they belong to.
 *
 * @see {@link WonderlandEngine.textures}, {@link WonderlandEngine.meshes},
 * and {@link WonderlandEngine.materials}.
 *
 * @since 1.2.0
 */
export declare class ResourceManager<T extends SceneResource | Resource> {
    /** @hidden */
    protected readonly _host: FirstConstructorParam<T>;
    /** Cache. @hidden */
    protected readonly _cache: (T | null)[];
    /** Resource class. @hidden */
    private readonly _template;
    /** Destructor proxy, used if {@link WonderlandEngine.erasePrototypeOnDestroy} is `true`. @hidden */
    private _destructor;
    private readonly _engine;
    /**
     * Create a new manager
     *
     * @param host The host containing the managed resources.
     * @param Class The class to instantiate when wrapping an index.
     *
     * @hidden
     */
    constructor(host: FirstConstructorParam<T>, Class: ResourceConstructor<T>);
    /**
     * Wrap the index into a resource instance.
     *
     * @note The index is relative to the host, i.e., doesn't pack the host index (if any).
     *
     * @param index The resource index.
     * @returns
     */
    wrap(index: number): T | null;
    /**
     * Retrieve the resource at the given index.
     *
     * @note The index is relative to the host, i.e., doesn't pack the host index.
     */
    get(index: number): T | null;
    /** Number of textures allocated in the manager. */
    get allocatedCount(): number;
    /**
     * Number of textures in the manager.
     *
     * @note For performance reasons, avoid calling this method when possible.
     */
    get count(): number;
    /** Hosting engine instance. */
    get engine(): WonderlandEngine;
    /**
     * Destroy the instance.
     *
     * @note This method takes care of the prototype destruction.
     *
     * @hidden
     */
    _destroy(instance: T): void;
    /**
     * Mark all instances as destroyed.
     *
     * @hidden
     */
    _clear(): void;
}
export {};
