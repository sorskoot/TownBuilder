import { WonderlandEngine } from '../engine.js';
import { Mesh, MeshParameters } from '../wonderland.js';
import { ResourceManager } from './resource.js';
/**
 * Manage meshes.
 *
 * #### Creation
 *
 * Creating a mesh is done using {@link MeshManager.create}:
 *
 * ```js
 * const mesh = engine.meshes.create({vertexCount: 3, indexData: [0, 1, 2]});
 * ```
 *
 * @since 1.2.0
 */
export declare class MeshManager extends ResourceManager<Mesh> {
    constructor(engine: WonderlandEngine);
    /**
     * Create a new mesh.
     *
     * @param params Vertex and index data. For more information, have a look
     *     at the {@link MeshParameters} object.
     */
    create(params: Partial<MeshParameters>): Mesh;
}
