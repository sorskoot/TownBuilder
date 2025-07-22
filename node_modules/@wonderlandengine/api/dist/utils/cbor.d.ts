/**
 * Whether key/value dictionaries should be decoded as objects or as
 * `Map<K, V>`. The latter is useful if non-string keys or iterating in
 * insertion order are required.
 */
export type DictionaryOption = 'object' | 'map';
/** Options for the decoder. */
export interface Options {
    /** The dictionary type to use. Defaults to `object`. */
    dictionary?: DictionaryOption;
}
/** A function to modify tagged values which are encountered during decoding. */
export type Tagger = (tag: number | bigint, value: any) => any;
/**
 * Converts a Concise Binary Object Representation (CBOR) buffer into an object.
 *
 * ```js
 * const buffer = new Uint8Array([0xa2, 0x01, 0x02, 0x03, 0x04]).buffer;
 * const decoded = decode(buffer);
 * console.log(decoded); // { "1": 2, "3": 4 }
 * ```
 *
 * CBOR values can be wrapped in a numeric tag. To handle and possibly
 * transform tagged values, pass a tagger function:
 *
 * ```js
 * const buffer = new Uint8Array([
 *   0xa1, 0x63, 0x75, 0x72, 0x6c, 0xd8, 0x20, 0x70,
 *   0x68, 0x74, 0x74, 0x70, 0x3a, 0x2f, 0x2f, 0x73,
 *   0x69, 0x74, 0x65, 0x2e, 0x63, 0x6f, 0x6d, 0x2f
 * ]);
 * const decoded = decode(buffer, (tag, value) => {
 *     if (tag === 32) return new URL(value);
 *     return value;
 * });
 * console.log(decoded); // { url: URL { href: "http://site.com/" } }
 * ```
 *
 * Decoded basic types generally match the equivalent JavaScript types. Byte
 * strings are decoded to Uint8Array.
 *
 * Tagged values are left as-is, with the following exceptions:
 * - Bignum values (byte strings with tag 2 or 3) are decoded to BigInt
 * - Little-endian versions of typed arrays as defined in RFC 8746 are decoded
 *   to JavaScript typed arrays
 *
 * @param data A valid CBOR buffer.
 * @param tagger Optional callback for transformation of tagged values.
 * @param options Options for decoding behavior.
 * @returns The CBOR buffer converted to a JavaScript value.
 */
export declare function decode<T = any>(data: Uint8Array, tagger?: Tagger, options?: Options): T;
export declare enum CBORType {
    Array = 0,
    Record = 1,
    Constant = 2,
    Native = 3
}
/**
 * Check whether the type is an array, a record,
 * or a native type (decodable without recursion).
 *
 * @param typeInfo Type information obtained using `readTypeInfo`.
 * @returns The type category.
 */
export declare function getType(typeInfo: number): CBORType;
export declare function isUndefined(type: CBORType, length: number): boolean;
/**
 * CBOR reader.
 */
export declare class CBORReader {
    dataView: DataView;
    data: Uint8Array;
    offset: number;
    tagger: Tagger;
    dictionary: 'object' | 'map';
    constructor(data: Uint8Array);
    /**
     * Read type information and move the cursor.
     *
     * @note Must be called before reading the value.
     */
    readTypeInfo(): number;
    /**
     * Read the array length.
     *
     * @note Must not be called if the type is a constant.
     *
     * @param typeInfo Type information obtained using `readTypeInfo`.
     * @returns The array length.
     */
    readArrayLength(typeInfo: number): number | bigint;
    /**
     * Recursively read the item.
     *
     * @note This method will recursively allocate arrays and records
     * based the item type.
     *
     * @param typeInfo Type information obtained using `readTypeInfo`.
     * @returns The decoded value.
     */
    readItem(typeInfo: number, inputLen?: number | null): any;
    decodeItem(): any;
    readArrayBuffer(length: number): Uint8Array;
    readFloat16(): number;
    readFloat32(): number;
    readFloat64(): number;
    readUint8(): number;
    readUint16(): number;
    readUint32(): number;
    readUint64(): bigint;
    readBreak(): boolean;
    readLength(additionalInformation: number): number | bigint;
    readIndefiniteStringLength(majorType: number): number;
    appendUtf16Data(utf16data: number[], length: number): void;
    private commitRead;
}
