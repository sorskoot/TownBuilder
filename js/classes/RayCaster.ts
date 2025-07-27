import { vec3 } from "gl-matrix";
import { HexagonTile, TILE_SIZE } from "./HexagonTile.js";
import { UniqueStack } from "../utils/UniqueStack.js";
import { HexGridLayout } from "../components/core/hex-grid-layout.js";

const STEPS_PER_TILE = 4; // Number of steps per tile for ray casting
const StepVector = vec3.create();
const CurrentPosition = vec3.create();

export class RayCaster {

    public static cast(origin: vec3, direction: vec3, maxDistance: number): { x: number, y: number, z: number } | undefined {
        const stepSize = TILE_SIZE / STEPS_PER_TILE;
        vec3.normalize(direction, direction); // ensure the direction is normalized
        /*
        Plan:
            - each step we check what tile we are above, based on X, Z
            - we store the tile in a set of tiles we passed (use UniqueStack)
            - if we are above a tile, we check if the Y of the ray is below the tile's elevation
            - if it is, we calculate an X and Z based on the elevation of a tile and the ray's direction.
                - we then check if the the tile below that point is the same tile as we were above.
                - if that is the case, we've found the tile the ray passes. 
                - if not, we could have hit the side of the tile, or just passed through the edge of the previous tile, so we use the stack and start checking the tiles we passed backwards.
                - for each tile we calculate the X and Z based on the tile's elevation and the ray's direction.
                - if the tile at that point is the same as the one we got from the stack, we return it.
                - (how long do we keep checking backwards?)
                - maybe we can check the index on the stack? If we check a tile based on the elevation of the tile and the ray and the ray passed over it the index will be higher that the tile we checked. 

            - if we are above a tile, we increase the step in the direction of the ray and repeat until we are at the max distance or below a minimum height, somewhat below the ground. 

        Optimizations: 
            - Start at the max height of the world. This would skip a lot of unnecessary calculations.
        
        Considerations:
            - Do we use a while loop or a for loop?
        
            */

        vec3.scale(StepVector, direction, stepSize); // each iteration we move this in the direction
        vec3.copy(CurrentPosition, origin); // start at the origin
        CurrentPosition[1] += TILE_HEIGHT_OFFSET; // tiles have a bit of a height, so we start above the ground
        const passedTiles = new UniqueStack<HexagonTile>();
        let currentDistance = 0;
        const layout = HexGridLayout.instance.grid;
        if (!layout) {
            return;
        }
        let tileFound: HexagonTile | undefined = undefined;
        // Get globalConfig for height scaling
        const heightScale = 4; // This should match globalConfig.heightScale from hex-grid-layout

        while (currentDistance < maxDistance && !tileFound) {
            currentDistance += stepSize;
            vec3.add(CurrentPosition, CurrentPosition, StepVector); // move the current position in the direction
            const tilePos = HexagonTile.from2D(CurrentPosition[0], CurrentPosition[2]);
            if (!tilePos) {
                continue;
            }
            const tile = layout.getTile(tilePos.x, tilePos.y, tilePos.z);
            if (tile) {
                // we are above a tile.
                passedTiles.push(tile);
                // Scale the tile elevation to match the actual world positioning
                const actualTileElevation = tile.elevation * heightScale;
                //check elevation
                if (CurrentPosition[1] <= actualTileElevation) {
                    // we are below the tile's elevation. for now we stop so we can test.
                    const intersectionPoint = vec3.create();
                    this.getPositionAtElevation(intersectionPoint, actualTileElevation, origin, direction);

                    // Verify that the intersection point is still within the same tile
                    const intersectionTilePos = HexagonTile.from2D(intersectionPoint[0], intersectionPoint[2]);

                    if (
                        // we are intersecting with the tile we are above
                        intersectionTilePos &&
                        intersectionTilePos.x === tile.x &&
                        intersectionTilePos.y === tile.y &&
                        intersectionTilePos.z === tile.z) {
                        tileFound = tile;
                    } else {
                        // The intersection point is not within the current tile
                        // now the thing is, we could have hit the side of the tile.
                        // Or we passed through the edge of a previous tile.
                        // What do we know so far?
                        // - `tile` is the tile we dipped below elevation
                        // - But the intersection point is not at the top of the same tile
                        // So we need to check the previous tiles in the stack
                        // How many tiles do we check?
                        // There might not be a another way then just check them all and if none matches,
                        // we must have hit the side of the last tile.

                        // Check previously passed tiles in reverse order
                        for (const prevTile of passedTiles.iterateBackwards()) {
                            const prevTileElevation = prevTile.elevation * heightScale;
                            this.getPositionAtElevation(intersectionPoint, prevTileElevation, origin, direction);
                            const prevIntersectionTilePos = HexagonTile.from2D(intersectionPoint[0], intersectionPoint[2]);

                            if (prevIntersectionTilePos &&
                                prevIntersectionTilePos.x === prevTile.x &&
                                prevIntersectionTilePos.y === prevTile.y &&
                                prevIntersectionTilePos.z === prevTile.z) {
                                tileFound = prevTile;
                                break;
                            }
                        }

                        // If no previous tile matched, we assume we hit the side of the last tile.
                        if (!tileFound) {
                            tileFound = tile;
                        }
                    }
                }
            }
        }
        return tileFound ? { x: tileFound.x, y: tileFound.y, z: tileFound.z } : undefined;
    }

    private static getPositionAtElevation(outVec: vec3, elevation: number, origin: vec3, direction: vec3): void {
        // Calculate the position at a given elevation based on the origin and direction
        if (direction[1] === 0) {
            // checking straight up or down, no elevation change possible
            vec3.copy(outVec, origin);
            outVec[1] = elevation; // set the elevation
            return;
        }
        // Since the direction is normalized we can calculate it this way, skipping expensive Sqrt and such
        const distanceToElevation = (elevation - origin[1]) / direction[1];
        vec3.scaleAndAdd(outVec, origin, direction, distanceToElevation);
    }
}