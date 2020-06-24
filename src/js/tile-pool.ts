import { Tile } from "./tile";
import { TileData } from "./puzzle-data-schema";
import { getRandomIntInclusive } from "./utils";

export class TilePool {

    private readonly _tiles = new Map<string, Tile>();

    constructor(numberOfTiles: number, tileData: TileData[]) {
        if (numberOfTiles != tileData.length) {
            throw new Error(`Number of tiles provided (${tileData.length}) does not match number expected (${numberOfTiles})!`);
        }
        for (const tileDetails of tileData) {
            let newTile = new Tile(tileDetails);
            this._tiles.set(newTile.id, newTile);
        }
    }

    getTile(id: string): Tile {
        let tile = this._tiles.get(id)!;
        if (tile) {
            this._tiles.delete(id);
        }
        return tile;
    }

    toString(): string {
        let tilesString = "TilePool:\n";
        this._tiles.forEach((tile) => tilesString += tile.toString() + '\n');
        return tilesString;
    }

    get randomTile(): Tile {
        return this.getTile(getRandomIntInclusive(this._tiles.size).toString());
    }

}
