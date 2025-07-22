/**
 * Schedule a timeout, resolving in `time` milliseconds.
 *
 * @note `setTimeout` being a macro-task, this method can
 * be use as a debounce call.
 *
 * @param time The time until it resolves, in milliseconds.
 * @returns A promise resolving in `time` ms.
 */
export declare function timeout(time: number): Promise<void>;
/**
 * Clamp the value in the range [min; max].
 *
 * @param val The value to clamp.
 * @param min The minimum value (inclusive).
 * @param max The maximum value (inclusive).
 * @returns The clamped value.
 */
export declare function clamp(val: number, min: number, max: number): number;
/**
 * Capitalize the first letter in a string.
 *
 * @note The string must be UTF-8.
 *
 * @param str The string to format.
 * @returns The string with the first letter capitalized.
 */
export declare function capitalizeFirstUTF8(str: string): string;
/**
 * Create a proxy throwing destroyed errors upon access.
 *
 * @param type The type to display upon error
 * @returns The proxy instance
 */
export declare function createDestroyedProxy(type: string): {};
