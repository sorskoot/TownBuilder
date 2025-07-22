import { Component, Material } from '@wonderlandengine/api';
/**
 * Dynamic mesh-based trail
 *
 * This component keeps track of the world position of the object it's added to.
 * At a fixed interval the world position is stored as start and end points of the trail segments.
 *
 * The trail tapers off along its length. UV texture coordinates are setup such that the
 * U-axis covers the width of the trail and the V-axis covers the length of the trail.
 * This allows the trail's appearance to be defined using a texture.
 */
export declare class Trail extends Component {
    static TypeName: string;
    /** The material to apply to the trail mesh */
    material: Material | null;
    /** The number of segments in the trail mesh */
    segments: number;
    /** The time interval before recording a new point */
    interval: number;
    /** The width of the trail (in world space) */
    width: number;
    /** Whether or not the trail should taper off */
    taper: boolean;
    /**
     * The maximum delta time in seconds, above which the trail resets.
     * This prevents the trail from jumping around when updates happen
     * infrequently (e.g. when the tab doesn't have focus).
     */
    resetThreshold: number;
    private _currentPointIndex;
    private _timeTillNext;
    private _points;
    private _trailContainer;
    private _meshComp;
    private _mesh;
    private _indexData;
    start(): void;
    updateVertices(): void;
    resetTrail(): void;
    update(dt: number): void;
    onActivate(): void;
    onDeactivate(): void;
    onDestroy(): void;
}
