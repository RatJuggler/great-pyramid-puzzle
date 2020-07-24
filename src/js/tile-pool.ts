import { Tile } from "./tile";
import { TileDefinition } from "./tile-data-schema";
import { getRandomInt } from "./utils";


export class TilePool {

    // Static tile used to test the tile orientation display.
    private static readonly DISPLAY_TEST_TILE = new Tile({
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

    addTile(tileDetails: TileDefinition): boolean {
        if (this._tiles.has(tileDetails.tile)) {
            return false;
        }
        const newTile = new Tile(tileDetails);
        this._tiles.set(newTile.id, newTile);
        return true;
    }

    get tileCount(): number {
        return this._tiles.size;
    }

    get isEmpty(): boolean {
        return this.tileCount === 0;
    }

    get tiles(): Array<Tile> {
        return Array.from(this._tiles.values());
    }

    getTile(id: number): Tile {
        if (this._tiles.has(id)) {
            const tile = this._tiles.get(id)!;
            this._tiles.delete(id);
            return tile;
        }
        throw new Error(`Tile (${id}) not found in the tile pool!`);
    }

    get nextTile(): Tile {
        if (this.isEmpty) {
            throw new Error("No more Tiles in the pool!");
        }
        // Sort keys in ascending numerical order.
        const keys = Array.from(this._tiles.keys()).sort((a: number, b: number) => a - b);
        return this.getTile(keys[0]);
    }

    get randomTile(): Tile {
        if (this.isEmpty) {
            throw new Error("No more Tiles in the pool!");
        }
        const keys = Array.from(this._tiles.keys());
        const id = keys[getRandomInt(keys.length)];
        return this.getTile(id);
    }

    get displayTestTile(): Tile {
        if (this.isEmpty) {
            throw new Error("No more Tiles in the pool!");
        }
        // Discard a random tile.
        this.randomTile;
        // Always return the same test tile.
        return TilePool.DISPLAY_TEST_TILE;
    }

    returnTile(tile: Tile): void {
        if (this._tiles.has(tile.id)) {
            throw new Error("Returned Tile already in the pool!");
        }
        this._tiles.set(tile.id, tile);
    }

    toString(): string {
        let tilesString = "TilePool:\n";
        this._tiles.forEach((tile) => tilesString += tile.toString() + '\n');
        return tilesString;
    }

}
