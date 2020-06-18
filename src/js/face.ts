import { Tile } from "./tile";

export class Face {

    private static validTileCounts = [1, 4, 9];
    private static sideNames = ["1", "2", "3"];

    private _joinsWith: { side: string, face: Face, faceSide: string }[] = [];
    private _tiles: Tile[] = [];

    constructor(private _name: string, private _numberOfTiles: number) {
        if (!(Face.validTileCounts.includes(_numberOfTiles))) {
            throw new Error(`Number of tiles on a Face must be one of ${Face.validTileCounts}!`);
        }
    }

    display() {
        console.log(`Face: ${this._name} - Tiles: ${this._numberOfTiles}`);
        this._joinsWith.forEach(join => console.log(`Side: ${join.side} Joins with: ${join.face.name}-${join.faceSide}`))
        this._tiles.forEach(tile => console.log(tile.display()));
    }

    get name(): string {
        return this._name;
    }

    joinSideWith(side: string, face: Face, faceSide: string) : void {
        if (!(Face.sideNames.includes(side))) {
            throw new Error(`Join side must be one of ${Face.sideNames}!`);
        }
        if (!(Face.sideNames.includes(faceSide))) {
            throw new Error(`Side to join with must be one of ${Face.sideNames}!`);
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
