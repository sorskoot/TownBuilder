/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 */

/* wle:auto-imports:start */
import {CursorTarget} from '@wonderlandengine/components';
import {OrbitalCamera} from '@wonderlandengine/components';
import {WasdControlsComponent} from '@wonderlandengine/components';
import {HexGridLayout} from './components/core/hex-grid-layout.js';
import {TilePrefabs} from './components/core/tile-prefabs.js';
import {MyCursor} from './components/generic/my-cursor.js';
import {Zoom} from './components/generic/zoom.js';
import {MainMenu} from './ui/main-menu.tsx';
/* wle:auto-imports:end */

export default function (engine) {
    /* wle:auto-register:start */
engine.registerComponent(CursorTarget);
engine.registerComponent(OrbitalCamera);
engine.registerComponent(WasdControlsComponent);
engine.registerComponent(HexGridLayout);
engine.registerComponent(TilePrefabs);
engine.registerComponent(MyCursor);
engine.registerComponent(Zoom);
engine.registerComponent(MainMenu);
/* wle:auto-register:end */
}
