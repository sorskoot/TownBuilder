import { Component, Material, Texture } from '@wonderlandengine/api';
/**
 * Downloads an image from URL and applies it as `diffuseTexture` or `flatTexture`
 * to an attached mesh component.
 *
 * Materials from the following shaders are supported:
 *  - "Phong Opaque Textured"
 *  - "Flat Opaque Textured"
 *  - "Background"
 *  - "Physical Opaque Textured"
 *  - "Foliage"
 */
export declare class ImageTexture extends Component {
    static TypeName: string;
    /** URL to download the image from */
    url: string;
    /** Material to apply the video texture to */
    material: Material;
    /** Name of the texture property to set */
    textureProperty: string;
    texture?: Texture;
    start(): void;
    onDestroy(): void;
}
