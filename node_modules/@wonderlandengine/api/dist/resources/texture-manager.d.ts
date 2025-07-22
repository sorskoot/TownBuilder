import { WonderlandEngine } from '../engine.js';
import { ImageLike } from '../types.js';
import { Texture } from '../wonderland.js';
import { ResourceManager } from './resource.js';
export declare function needsFlipY(image: ImageLike): 0 | 1;
/**
 * Manage textures.
 *
 * #### Creation
 *
 * Creating a texture is done using {@link TextureManager.load}:
 *
 * ```js
 * const texture = await engine.textures.load('my-image.png');
 * ```
 *
 * Alternatively, textures can be created directly via a loaded image using
 * {@link TextureManager.create}.
 *
 * @since 1.2.0
 */
export declare class TextureManager extends ResourceManager<Texture> {
    constructor(engine: WonderlandEngine);
    /**
     * Create a new texture from an image or video.
     *
     * #### Usage
     *
     * ```js
     * const img = new Image();
     * img.load = function(img) {
     *     const texture = engine.textures.create(img);
     * };
     * img.src = 'my-image.png';
     * ```
     *
     * @note The media must already be loaded. To automatically
     * load the media and create a texture, use {@link TextureManager.load} instead.
     *
     * @param image Media element to create the texture from.
     * @ret\urns The new texture with the media content.
     */
    create(image: ImageLike): Texture;
    /**
     * Load an image from URL as {@link Texture}.
     *
     * #### Usage
     *
     * ```js
     * const texture = await engine.textures.load('my-image.png');
     * ```
     *
     * @param filename URL to load from.
     * @param crossOrigin Cross origin flag for the image object.
     * @returns Loaded texture.
     */
    load(filename: string, crossOrigin?: string): Promise<Texture>;
}
