/**
 * Stores a bit pattern to quickly test if an index is enabled / disabled.
 *
 * This class can store up to **32** different values in the range [0; 31].
 *
 * #### Usage
 *
 * ```js
 * const bitset = new BitSet();
 * bitset.enable(10); // Enable bit at index `10`.
 * console.log(bitset.enabled(10)); // Prints 'true'.
 * ```
 *
 * #### TypeScript
 *
 * The set can be typed over an enum:
 *
 * ```ts
 * enum Tag {
 *     First = 0,
 *     Second = 1,
 * }
 *
 * const bitset = new BitSet<Tag>();
 * bitset.enable(Tag.First);
 * ```
 */
export declare class BitSet<T extends number = number> {
    /** Enabled bits. @hidden */
    private _bits;
    /**
     * Enable the bit at the given index.
     *
     * @param bits A spread of all the bits to enable.
     * @returns Reference to self (for method chaining).
     */
    enable(...bits: T[]): this;
    /**
     * Enable all bits.
     *
     * @returns Reference to self (for method chaining).
     */
    enableAll(): this;
    /**
     * Disable the bit at the given index.
     *
     * @param bits A spread of all the bits to disable.
     * @returns Reference to self (for method chaining).
     */
    disable(...bits: T[]): this;
    /**
     * Disable all bits.
     *
     * @returns Reference to self (for method chaining).
     */
    disableAll(): this;
    /**
     * Checker whether the bit is set or not.
     *
     * @param bit The bit to check.
     * @returns `true` if it's enabled, `false` otherwise.
     */
    enabled(bit: T): boolean;
}
