import { CollisionComponent, Component } from '@wonderlandengine/api';
import { CursorTarget } from './cursor-target.js';
/**
 * Enables interaction with cursor-targets through collision overlaps,
 * e.g. on the tip of a finger on a tracked hand.
 *
 * **Requirements:**
 *  - A collision component (usually a sphere with `0.05` radius) on the same object
 *
 * @since 0.8.5
 */
export declare class FingerCursor extends Component {
    static TypeName: string;
    lastTarget: CursorTarget | null;
    tip: CollisionComponent;
    start(): void;
    update(): void;
}
