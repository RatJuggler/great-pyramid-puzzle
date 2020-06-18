import { Tile } from "./tile";

export class Face {

    private static validTileCounts = [1, 4, 9];

    private _joinsWith: { side: number, face: Face, faceSide: number }[] = [];
    private _tiles: Tile[] = [];

    constructor(private _id: string, private _numberOfTiles: number) {
        if (!(Face.validTileCounts.includes(_numberOfTiles))) {
            throw new Error(`Number of tiles on a Face must be one of ${(Face.validTileCounts)}!`);
        }
    }

    display() {
        console.log(`Face: ${this._id} - Tiles: ${this._numberOfTiles}`);
        this._joinsWith.forEach(join => console.log(`Side: ${join.side} Joins with: ${join.face.id}-${join.faceSide}`))
        this._tiles.forEach(tile => console.log(tile.display()));
    }

    get id(): string {
        return this._id;
    }

    joinSideWith(side: number, face: Face, faceSide: number) : void {
        if (side < 1 || side > 3) {
            throw new Error(`Join side must be 1, 2 or 3!`);
        }
        if (faceSide < 1 || faceSide > 3) {
            throw new Error(`Side to join with must be 1, 2 or 3!`);
        }
        this._joinsWith.push({side: side, face: face, faceSide: faceSide});
    }

    get tiles(): Tile[] {
        return this._tiles;
    }

    addTile(tile: Tile): void {
        if (this._tiles.length < this._numberOfTiles) {
            this._tiles.push(tile);
        }
    }

}
