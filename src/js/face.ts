import { Tile } from "./tile";

export class Face {

    static validTileCounts = [1, 4, 9];

    private _tiles: Tile[] = [];

    constructor(private _id: string, private _numberOfTiles: number) {
        if (!(Face.validTileCounts.includes(_numberOfTiles))) {
            throw new Error(`Number of tiles on a Face must be one of ${(Face.validTileCounts)}!`);
        }
    }

    display() {
        console.log(`Face: ${this._id} - Tiles: ${this._numberOfTiles}`);
        this._tiles.forEach(tile => console.log(tile.display()));
    }

    get id(): string {
        return this._id;
    }

    get numberOfTiles(): number {
        return this._numberOfTiles;
    }

    get tiles(): Tile[] {
        return this._tiles;
    }

    addTile(tile: Tile): void {
        if (this._tiles.length < this.numberOfTiles) {
            this._tiles.push(tile);
        }
    }

}
