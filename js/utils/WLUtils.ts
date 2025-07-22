import {Component, ComponentConstructor, Object3D, Type} from '@wonderlandengine/api';

/**
 * The normal GetComponents does not work well with inheritance. This function
 * does.
 * @param object The object to get the components from.
 * @param type The type of component to get.
 * @returns An array of components of the given type.
 */
function getComponentsOfType<T extends Component>(
    object: Object3D,
    type: ComponentConstructor<T>
): T[] {
    return object.getComponents().filter((c) => c instanceof type) as T[];
}

/**
 * The normal GetComponents does not work well with inheritance. This function
 * does. This function is recursive and gets all components of the given type
 * from the object and all its children.
 * @param object The object to get the components from.
 * @param type The type of component to get.
 * @returns An array of components of the given type.
 */
function getComponentsOfTypeRecursive<T extends Component>(
    object: Object3D,
    type: ComponentConstructor<T>
): T[] {
    const result: T[] = [];
    const components = object.getComponents().filter((c) => c instanceof type) as T[];
    result.push(...components);
    for (const child of object.children) {
        result.push(...getComponentsOfTypeRecursive(child, type));
    }

    return result;
}

function getComponentOfType<T extends Component>(
    object: Object3D,
    type: ComponentConstructor<T>
): T {
    return getComponentsOfType(object, type)[0];
}
/**
 * Recursively sets the active state of the given object and all its children.
 * @param object The object to set the active state of.
 * @param active The state to set.
 */
function setActive(object: Object3D, active: boolean) {
    object.active = active;
    object.getComponents().forEach((c) => (c.active = active));
    object.children.forEach((c) => setActive(c, active));
}

function traverse(source: Object3D, cb: (o: Object3D) => void) {
    const stack: Object3D[] = [source];
    let i = 0;

    while (i < stack.length) {
        const obj = stack[i++];
        if (!obj) continue;

        cb(obj);
        stack.push.apply(stack, obj.children);
    }

    return stack;
}

function objects(source: Object3D): Object3D[] {
    return traverse(source, () => {});
}

function components(source: Object3D): Component[] {
    const result: Component[] = [];
    traverse(source, (obj: Object3D) => {
        const comps = obj.getComponents();
        result.push.apply(result, comps);
    });
    return result;
}

function clone(source: Object3D, parent?: Object3D) {
    const idToIndex = new Map();
    {
        const children = objects(source);
        for (let i = 0; i < children.length; ++i) {
            idToIndex.set(children[i]._id, i);
        }
    }

    const clone = source.clone(parent);
    const children = objects(clone);
    const comps = components(clone);

    const compToProcess: Component[] = [];

    for (const comp of comps) {
        const props = (comp.constructor as ComponentConstructor).Properties;

        let needsProcess = false;

        for (const name in props) {
            const prop = props[name];
            if (prop.type !== Type.Object) continue;

            const obj = comp[name] as Object3D;
            if (!obj || !idToIndex.has(obj._id)) continue;

            const index = idToIndex.get(obj._id);
            comp[name] = children[index];

            needsProcess = true;
        }

        if (needsProcess && comp.active) {
            compToProcess.push(comp);
        }
    }

    for (const comp of compToProcess) {
        comp.active = false;
        if (comp.start) comp.start();
        comp.active = true;
    }

    return clone;
}

function destroyWithDelay(object: Object3D, delay: number) {
    setTimeout(() => {
        if (object) {
            // ignore if there's no object anymore.
            if (object.isDestroyed) {
                // ignore if the object is already destroyed.
                return;
            }
            object.destroy();
        }
    }, delay);
}

/**
 * Checks if the given object has a component of the given type.
 * @param object The object to check. If a component is given, the object of the component is used.
 * @param type The component type to check for.
 * @returns True if the object has a component of the given type.
 */
function hasComponent(
    object: Object3D | Component,
    type: ComponentConstructor<Component>
): boolean {
    if (object instanceof Component) {
        object = object.object;
    }
    return object.getComponents().some((c) => c instanceof type);
}

/**
 * Calls the specified method on every Component attached to the Object.
 *
 * A value parameter specified for a method that doesn't accept parameters is ignored.
 * If requireReceiver is set to true an error is printed if the message is not picked up by any component.
 * Note: Messages are not sent to components attached to objects that are not active.
 *
 * This functions is used to in a similar way to Unity's SendMessage function.
 * https://docs.unity3d.com/ScriptReference/GameObject.SendMessage.html
 */
export function sendMessage(
    object: Object3D,
    methodName: string,
    value?: any,
    requireReceiver: boolean = true
): void {
    let isCalled = false;

    const components = object.getComponents();

    for (const component of components) {
        if (component.active) {
            const method = component[methodName];
            if (method && typeof method === 'function') {
                method.call(component, value);
                isCalled = true;
            }
        }
    }

    if (requireReceiver && !isCalled) {
        console.warn(
            `No receiver found for message '${methodName}' on object '${object.name}'`
        );
    }
}

export const WLUtils = {
    setActive,
    clone,
    destroyWithDelay,
    getComponentsOfType,
    getComponentsOfTypeRecursive,
    getComponentOfType,
    hasComponent,
    sendMessage,
};
