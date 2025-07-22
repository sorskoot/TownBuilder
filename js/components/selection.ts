import { Component, Object3D } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { CursorTarget } from '@wonderlandengine/components';

export class Selection extends Component {
    static TypeName = 'selection';

    cursorTarget: CursorTarget;

    init() {}

    start() {
        this.cursorTarget = this.object.getComponent(CursorTarget);
        this.cursorTarget.onClick.add(this.onClick);
    }

    onClick = (c, e) => {
        console.log(e);
    };

    update(dt: number) {}
}
