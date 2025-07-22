// src/SorskootUtils.mts
import {
    EditorPlugin,
    ui
} from "@wonderlandengine/editor-api";

// src/utils/updatePaths.ts
import { data, project } from "@wonderlandengine/editor-api";
import fs from "fs";
import path from "path";
function traverseDirectory(directory, root, newPaths) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            traverseDirectory(fullPath, root, newPaths);
        } else if (entry.isFile() && [".js", ".ts", ".jsx", ".tsx", ".jsm", ".tsm", ".json"].some(
            (ext) => fullPath.endsWith(ext)
        )) {
            const relativePath = path.relative(root, fullPath);
            const folderPath = path.dirname(relativePath);
            newPaths.add(folderPath.replace(/\\/g, "/"));
        }
    }
}
function updatePaths(rootPath) {
    let existingPaths = [];
    try {
        existingPaths = data.settings.scripting.components.sourcePaths || [];
    } catch (error) {
        console.error("Error accessing sourcePaths:", error);
        return;
    }
    const newPaths = /* @__PURE__ */ new Set();
    const root = project.root;
    const startPath = path.join(root, rootPath);
    if (fs.existsSync(startPath) && fs.statSync(startPath).isDirectory()) {
        traverseDirectory(startPath, root, newPaths);
    } else {
        console.error(
            `Error: Path "${startPath}" does not exist or is not a directory.`
        );
        return;
    }
    for (const existingPath of existingPaths) {
        const normalizedPath = existingPath.endsWith("/") ? existingPath.slice(0, -1) : existingPath;
        if (![...newPaths].some((path2) => path2 === normalizedPath)) {
            newPaths.add(normalizedPath);
        }
    }
    try {
        data.settings.scripting.components.sourcePaths = Array.from(newPaths);
    } catch (error) {
        console.error("Error updating sourcePaths:", error);
    }
}

// src/SorskootUtils.mts
var SorskootUtils = class extends EditorPlugin {
    _rootPath = "/js";
    constructor() {
        super();
        this.name = " Sorskoot Wonderland Utils";
    }
    draw() {
        ui.label("[ Sorskoot Wonderland Utils ]");
        ui.dummy(1, 16);
        ui.separator();
        ui.beginGroup();
        const newPath = ui.inputText("Script relative root", this._rootPath);
        if (newPath != null) {
            this._rootPath = newPath;
        }
        if (ui.button("Update Paths")) {
            updatePaths(this._rootPath);
        }
        ui.endGroup();
    }
};
export {
    SorskootUtils as default
};
