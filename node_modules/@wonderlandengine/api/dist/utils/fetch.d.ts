import { ImageLike, ProgressCallback } from '../types.js';
/**
 * Sink for `WritableStream` that writes data to an `ArrayBuffer`.
 *
 * @hidden
 */
export declare class ArrayBufferSink implements UnderlyingSink<Uint8Array> {
    #private;
    /**
     * Constructor.
     * @param size Initial size of the buffer. If less than the received data,
     *     the buffer is dynamically reallocated.
     */
    constructor(size?: number);
    /** Get the received data as an `ArrayBuffer`. */
    get arrayBuffer(): ArrayBufferLike;
    write(chunk: Uint8Array): void;
}
/**
 * Source for `ReadableStream` that reads data from an`ArrayBuffer`.
 *
 * @hidden
 */
export declare class ArrayBufferSource implements UnderlyingSource<Uint8Array> {
    #private;
    /**
     * Constructor.
     * @param buffer Buffer to read from.
     */
    constructor(buffer: ArrayBuffer);
    start(controller: ReadableStreamController<Uint8Array>): void;
}
/**
 * Fetch a file as an `ArrayBuffer`, with fetch progress passed to a callback.
 *
 * @param path Path of the file to fetch.
 * @param onProgress Callback receiving the current fetch progress and total
 *     size, in bytes. Also called a final time on completion.
 * @param signal Abort signal passed to `fetch()`.
 * @returns Promise that resolves when the fetch successfully completes.
 */
export declare function fetchWithProgress(path: string, onProgress?: ProgressCallback, signal?: AbortSignal): Promise<ArrayBuffer>;
/**
 * Fetch a file as a `ReadableStream`, with fetch progress passed to a
 * callback.
 *
 * @param path Path of the file to fetch.
 * @param onProgress Callback receiving the current fetch progress and total
 *     size, in bytes. Also called a final time on completion.
 * @param signal Abort signal passed to `fetch()`.
 * @returns Promise that resolves when the fetch successfully completes.
 */
export declare function fetchStreamWithProgress(path: string, onProgress?: ProgressCallback, signal?: AbortSignal): Promise<ReadableStream<Uint8Array>>;
/**
 * Get parent path from a URL.
 *
 * @param url URL to get the parent from.
 * @returns Parent URL without trailing slash.
 */
export declare function getBaseUrl(url: string): string;
/**
 * Get the filename of a url.
 *
 * @param url The url to extract the name from.
 * @returns A string containing the filename. If no filename is found,
 *     returns the input string.
 */
export declare function getFilename(url: string): string;
/**
 * Promise resolved once the image is ready to be used
 *
 * @param image The image, video, or canvas to wait for.
 * @returns A promise with the image, once it's ready to be used.
 */
export declare function onImageReady<T extends ImageLike>(image: T): Promise<T>;
