import { Tile } from "./tile";


interface SideJoinProperties {
    toFace: Face;
    toFaceSide: string;
}


export class Face {

    private static validTileCounts = [1, 4, 9];
    private static sideNames = ["1", "2", "3"];

    private _joins = new Map<string, SideJoinProperties>();
    private _tiles: Tile[] = [];

    constructor(private _name: string, private _numberOfTiles: number) {
        if (!(Face.validTileCounts.includes(_numberOfTiles))) {
            throw new Error(`Number of tiles on a Face must be one of ${Face.validTileCounts}!`);
        }
    }

    display() {
        console.log(`Face: ${this._name} - Tiles: ${this._numberOfTiles}`);
        this._joins.forEach((join, side) => console.log(`S-${this._name}${side} -> S-${join.toFace.name}${join.toFaceSide}`));
        this._tiles.forEach(tile => console.log(tile.display()));
    }

    get name(): string {
        return this._name;
    }

    join(fromSide: string, toFace: Face, toFaceSide: string) : void {
        if (this._numberOfTiles != toFace._numberOfTiles) {
            throw new Error("Cannot join Faces with different numbers of tiles!");
        }
        if (!(Face.sideNames.includes(fromSide))) {
            throw new Error(`Side to join from must be one of ${Face.sideNames}!`);
        }
        if (!(Face.sideNames.includes(toFaceSide))) {
            throw new Error(`Side to join to must be one of ${Face.sideNames}!`);
        }
        this._joins.set(fromSide, {toFace: toFace, toFaceSide: toFaceSide});
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
