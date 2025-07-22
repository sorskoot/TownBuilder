import { Prefab } from './prefab.js';
import { ComponentProperty, PropertyRecord } from './property.js';
import { AnimationComponent, CollisionComponent, Component, ComponentConstructor, InputComponent, LightComponent, MeshComponent, PhysXComponent, TextComponent, ViewComponent, ParticleEffectComponent } from './wonderland.js';
import { CBORReader } from './utils/cbor.js';
/** Native components list */
export interface NativeComponents {
    'collision': CollisionComponent;
    'text': TextComponent;
    'view': ViewComponent;
    'mesh': MeshComponent;
    'input': InputComponent;
    'light': LightComponent;
    'animation': AnimationComponent;
    'physx': PhysXComponent;
    'particle-effect': ParticleEffectComponent;
}
/**
 * Manage all component managers in a scene.
 *
 * @hidden
 */
export declare class ComponentManagers {
    /** Animation manager index. */
    readonly animation: number;
    /** Collision manager index. */
    readonly collision: number;
    /** JavaScript manager index. */
    readonly js: number;
    /** Physx manager index. */
    readonly physx: number;
    /** View manager index. */
    readonly view: number;
    /**
     * Component class instances per type to avoid GC.
     *
     * @note Maps the manager index to the list of components.
     *
     * @todo: Refactor ResourceManager and re-use for components.
     */
    private readonly _cache;
    /** Manager index to component class. */
    private readonly _constructors;
    private readonly _nativeManagers;
    /** Host instance. */
    private readonly _scene;
    constructor(scene: Prefab);
    createJs(index: number, id: number, type: number, object: number): Component;
    /**
     * Get components of type T.
     *
     * @param type Component class.
     * @returns An array containing all components in this scene.
     */
    components<T extends Component>(type: ComponentConstructor<T>, active: boolean): T[];
    /**
     * Similar to {@link getComponents}, but directly from string.
     *
     * @param typename The component `TypeName` attribute.
     */
    componentsFromTypename(typename: string, active: boolean): Component[];
    /**
     * Get component of type T.
     *
     * @note Currently only works for native components, but we will extend this later (and expose it in the API)
     */
    componentAt<T extends Component>(type: ComponentConstructor<T>, index: number): T;
    /**
     * Retrieve a cached component.
     *
     * @param manager The manager index.
     * @param id The component id.
     * @returns The component if cached, `null` otherwise.
     */
    get(manager: number, id: number): Component | null;
    /**
     * Wrap the animation.
     *
     * @param id Id to wrap.
     * @returns The previous instance if it was cached, or a new one.
     */
    wrapAnimation(id: number): AnimationComponent;
    /**
     * Wrap the collision.
     *
     * @param id Id to wrap.
     * @returns The previous instance if it was cached, or a new one.
     */
    wrapCollision(id: number): CollisionComponent;
    /**
     * Wrap the view.
     *
     * @param id Id to wrap.
     * @returns The previous instance if it was cached, or a new one.
     */
    wrapView(id: number): ViewComponent;
    /**
     * Wrap the physx.
     *
     * @param id Id to wrap.
     * @returns The previous instance if it was cached, or a new one.
     */
    wrapPhysx(id: number): PhysXComponent;
    /**
     * Retrieves a component instance if it exists, or create and cache
     * a new one.
     *
     * @note This api is meant to be used internally. Please have a look at
     * {@link Object3D.addComponent} instead.
     *
     * @param componentType Component manager index
     * @param componentId Component id in the manager
     *
     * @returns JavaScript instance wrapping the native component
     */
    wrapNative(manager: number, id: number): Component | null;
    /**
     * Wrap a native or js component.
     *
     * @throws For JavaScript components that weren't previously cached,
     * since that would be a bug in the runtime / api.
     *
     * @param manager The manager index.
     * @param id The id to wrap.
     * @returns The previous instance if it was cached, or a new one.
     */
    wrapAny(manager: number, id: number): Component | null;
    getNativeManager(name: string): number | null;
    /**
     * Perform cleanup upon component destruction.
     *
     * @param instance The instance to destroy.
     *
     * @hidden
     */
    destroy(instance: Component): void;
    /** Number of managers **registered** in the scene, i.e., `js`, `names`, etc... */
    get managersCount(): number;
}
export declare function resetComponentProperties(record: Component): void;
export declare function setupComponentClass(ctor: ComponentConstructor | PropertyRecord): void;
/**
 * Decode component properties from CBOR encoded data.
 *
 * ## Failure
 *
 * When decoding properties, failures will not be treated as errors. Failures include:
 * - Invalid parameters count
 * - Wrongly defined property
 *
 * When a failure occurs, the cbor reader will be consumed to prevent
 * errors to cascade in the following components.
 */
export declare class ComponentPropertyDecoder {
    scene: Prefab;
    offsets: Uint32Array;
    constructor(scene: Prefab, offsets: Uint32Array);
    decode(cbor: CBORReader, component: Component): any;
    decodeProperty(cbor: CBORReader, name: string, property: ComponentProperty): any;
    decodeRecordProperty(cbor: CBORReader, name: string, property: ComponentProperty, typeInfo: number): any;
    decodeArrayProperty(cbor: CBORReader, name: string, property: ComponentProperty, typeInfo: number): any[];
    private _error;
}
