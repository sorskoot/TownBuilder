import { Component } from './wonderland.js';
import { ComponentProperty } from './property.js';
/**
 * Decorator for JS component properties.
 *
 * @param data The property description as an object literal
 * @returns A decorator function modifying the `Properties` static
 *     attribute
 */
declare function propertyDecorator(data: ComponentProperty): (target: any, propertyKey: string) => void;
/**
 * Decorator for making a getter enumerable.
 *
 * Usage:
 *
 * ```ts
 * class MyClass {
 *     @enumerable()
 *     get projectionMatrix(): Float32Array { ... }
 * }
 * ```
 */
export declare function enumerable(): (_: any, __: string, descriptor: PropertyDescriptor) => void;
/**
 * Decorator for native properties.
 *
 * Usage:
 *
 * ```ts
 * class MyClass {
 *     @nativeProperty()
 *     get projectionMatrix(): Float32Array { ... }
 * }
 * ```
 */
export declare function nativeProperty(): (target: Component, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 * Property decorators namespace.
 *
 * You can use the decorators to mark a class attribute as
 * a Wonderland Engine property.
 *
 * Usage:
 *
 * ```ts
 * import {Mesh} from '@wonderlandengine/api';
 * import {property} from '@wonderlandengine/api/decorators.js';
 *
 * class MyComponent extends Component {
 *     @property.bool(true)
 *     myBool!: boolean;
 *
 *     @property.int(42)
 *     myInt!: number;
 *
 *     @property.string('Hello World!')
 *     myString!: string;
 *
 *     @property.mesh()
 *     myMesh!: Mesh;
 * }
 * ```
 *
 * For JavaScript users, please declare the properties statically.
 */
export declare const property: {
    string: (defaultValue?: string | undefined) => ReturnType<typeof propertyDecorator>;
    object: (opts?: import("./property.js").PropertyReferenceOptions | undefined) => ReturnType<typeof propertyDecorator>;
    record: (definition: import("./property.js").PropertyRecord) => ReturnType<typeof propertyDecorator>;
    animation: (opts?: import("./property.js").PropertyReferenceOptions | undefined) => ReturnType<typeof propertyDecorator>;
    color: (r?: number | undefined, g?: number | undefined, b?: number | undefined, a?: number | undefined) => ReturnType<typeof propertyDecorator>;
    float: (defaultValue?: number | undefined) => ReturnType<typeof propertyDecorator>;
    bool: (defaultValue?: boolean | undefined) => ReturnType<typeof propertyDecorator>;
    int: (defaultValue?: number | undefined) => ReturnType<typeof propertyDecorator>;
    enum: (values: string[], defaultValue?: string | number | undefined) => ReturnType<typeof propertyDecorator>;
    mesh: (opts?: import("./property.js").PropertyReferenceOptions | undefined) => ReturnType<typeof propertyDecorator>;
    texture: (opts?: import("./property.js").PropertyReferenceOptions | undefined) => ReturnType<typeof propertyDecorator>;
    material: (opts?: import("./property.js").PropertyReferenceOptions | undefined) => ReturnType<typeof propertyDecorator>;
    skin: (opts?: import("./property.js").PropertyReferenceOptions | undefined) => ReturnType<typeof propertyDecorator>;
    particleEffect: (opts?: import("./property.js").PropertyReferenceOptions | undefined) => ReturnType<typeof propertyDecorator>;
    vector2: (x?: number | undefined, y?: number | undefined) => ReturnType<typeof propertyDecorator>;
    vector3: (x?: number | undefined, y?: number | undefined, z?: number | undefined) => ReturnType<typeof propertyDecorator>;
    vector4: (x?: number | undefined, y?: number | undefined, z?: number | undefined, w?: number | undefined) => ReturnType<typeof propertyDecorator>;
    array: (element: ComponentProperty) => ReturnType<typeof propertyDecorator>;
};
export {};
