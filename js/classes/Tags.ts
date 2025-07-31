import { HexagonTile } from './HexagonTile.js';

export class Tags {
    private static _instance: Tags;

    private _tagList: Map<string, Set<string>> = new Map();

    private static get instance(): Tags {
        if (!Tags._instance) {
            Tags._instance = new Tags();
        }
        return Tags._instance;
    }

    private constructor() { }

    static setTag(tag: string, hexagonTileID: string): void {
        const instance = Tags.instance;

        if (!instance._tagList.has(tag)) {
            instance._tagList.set(tag, new Set());
        }

        instance._tagList.get(tag)?.add(hexagonTileID);
    }

    static getTags(hexagonTileID: string): string[] {
        const instance = Tags.instance;
        const tags: string[] = [];

        for (const [tag, tileIDs] of instance._tagList.entries()) {
            if (tileIDs.has(hexagonTileID)) {
                tags.push(tag);
            }
        }

        return tags;
    }

    static hasTag(tag: string, hexagonTileID: string): boolean {
        const instance = Tags.instance;
        return instance._tagList.get(tag)?.has(hexagonTileID) ?? false;
    }

    static removeTag(tag: string, hexagonTileID: string): boolean {
        const instance = Tags.instance;

        if (instance._tagList.has(tag)) {
            const tileIDs = instance._tagList.get(tag);
            if (tileIDs?.delete(hexagonTileID)) {
                // If the tag no longer has any associated tiles, remove the tag entirely
                if (tileIDs.size === 0) {
                    instance._tagList.delete(tag);
                }
                return true;
            }
        }

        return false;
    }

    static getTilesWithTag(tag: string): string[] {
        const instance = Tags.instance;
        return Array.from(instance._tagList.get(tag) || []);
    }

    static getTileWithTag(tag: string): string | undefined {
        return Tags.getTilesWithTag(tag)[0];
    }
}
