import { Tile } from "./tile";
import { TileDefinition } from "./tile-data-schema";
import { getRandomInt } from "./utils";


export class TilePool {

    // Static tile used testing tile orientation display.
    static readonly TEST_TILE = new Tile({
        tile: 0,
        sideA: "1000",
        sideB: "0100",
        sideC: "0010"
    });

    private readonly _tiles = new Map<number, Tile>();

    constructor(numberOfTiles: number, tileData: TileDefinition[]) {
        if (numberOfTiles !== tileData.length) {
            throw new Error(`Number of tiles provided (${tileData.length}) does not match number expected (${numberOfTiles})!`);
        }
        for (const tileDetails of tileData) {
            if (!this.addTile(tileDetails)) {
                throw new Error(`Duplicate Tile found in pool for (${tileDetails.tile})!`);
            }
        }
    }

    private addTile(tileDetails: TileDefinition): boolean {
        if (this._tiles.has(tileDetails.tile)) {
            return false;
        }
        const newTile = new Tile(tileDetails);
        this._tiles.set(newTile.id, newTile);
        return true;
    }

    private getTile(id: number): Tile {
        if (this._tiles.has(id)) {
            const tile = this._tiles.get(id)!;
            this._tiles.delete(id);
            return tile;
        }
        throw new Error(`Tile (${id}) not found in the tile pool!`);
    }

    toString(): string {
        let tilesString = "TilePool:\n";
        this._tiles.forEach((tile) => tilesString += tile.toString() + '\n');
        return tilesString;
    }

    get nextTile(): Tile | null {
        if (this._tiles.size === 0) {
            return null;
        }
        const keys = Array.from(this._tiles.keys()).sort((a: number, b: number) => a - b);
        return this.getTile(keys[0]);
    }

    get randomTile(): Tile | null {
        if (this._tiles.size === 0) {
            return null;
        }
        const keys = Array.from(this._tiles.keys());
        const id = keys[getRandomInt(keys.length)];
        return this.getTile(id);
    }

}
