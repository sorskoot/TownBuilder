import {Cloneable} from './Cloneable.js';

/**
 * A container for shared data that is passed through the execution pipeline.
 * Steps can read from and write to the TaskState, allowing for complex data flow.
 * State is stored and retrieved using a class type as a key, ensuring type safety.
 */
export class StepState {
    private states: Map<new (...args: any[]) => any, any> = new Map();

    /**
     * Stores a state object, using its class constructor as the key.
     * @param type The class constructor of the state to set.
     * @param state The state object instance. It must be an instance of the provided type.
     * @template T The type of the state object.
     */
    public setState<T extends Cloneable<T>>(
        type: new (...args: any[]) => T,
        state: T
    ): void {
        // The `instanceof` check provides runtime safety similar to the C# example.
        if (!(state instanceof type)) {
            throw new Error(`The provided state is not an instance of the specified type.`);
        }
        this.states.set(type, state);
    }

    /**
     * Retrieves a state object based on its class constructor.
     * @param type The class constructor of the state to retrieve.
     * @returns The stored state object, or `undefined` if not found.
     * @template T The type of the state object.
     */
    public getState<T>(type: new (...args: any[]) => T): T | undefined {
        return this.states.get(type) as T | undefined;
    }

    /**
     * Checks if a state of a certain type exists.
     * @param type The class constructor of the state to check for.
     * @returns `true` if the state exists, `false` otherwise.
     */
    public hasState<T>(type: new (...args: any[]) => T): boolean {
        return this.states.has(type);
    }

    /**
     * Creates a deep copy of the StepState instance.
     * @returns A new StepState instance that is a deep copy of this instance.
     */
    public clone(): StepState {
        const clone = new StepState();
        for (const [type, state] of this.states.entries()) {
            if (state && typeof state.clone === 'function') {
                // if the state has a clone method, call it
                // this assumes that the state is a Cloneable instance
                clone.setState(type, state.clone());
            } else {
                // otherwise, just set the state as is
                // this assumes that the state is a simple object or primitive
                // note that this might keep references to the original state
                clone.setState(type, state);
            }
        }
        return clone;
    }
}
