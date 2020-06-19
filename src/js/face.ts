import { Tile } from "./tile";


interface SideJoinProperties {
    toFace: Face;
    toFaceSide: string;
}


export class Face {

    private static validTileCounts = [1, 4, 9];
    private static sideNames = ["A", "B", "C"];

    private _joins = new Map<string, SideJoinProperties>();
    private _tiles = new Array<Tile>();

    constructor(private _name: string, private _numberOfTiles: number) {
        if (!(Face.validTileCounts.includes(_numberOfTiles))) {
            throw new Error(`Number of tiles on a Face must be one of ${Face.validTileCounts}!`);
        }
        let tile1 = new Tile("1");
        this._tiles.push(tile1);
        let tile2 = new Tile("2");
        this._tiles.push(tile2);
        let tile3 = new Tile("3");
        this._tiles.push(tile3);
        let tile4 = new Tile("4");
        this._tiles.push(tile4);
        // tile1.join("A", to another face?);
        tile1.join("B", tile4, "C");
        // tile1.join("C", to another face?);
        tile2.join("A", tile3, "B");
        // tile1.join("B", to another face?);
        // tile1.join("C", to another face?);
        tile3.join("A", tile4, "C");
        tile3.join("B", tile2, "A");
        tile3.join("C", tile1, "B");
        // tile4.join("A", to another face?);
        // tile4.join("B", to another face?);
        tile4.join("C", tile3, "A");
    }

    toString(): string {
        let faceString = `Face: ${this._name}, Number of Tiles: ${this._numberOfTiles}, Joins: `;
        this._joins.forEach((join, side) => faceString += `(${this._name}-${side}->${join.toFace.name}-${join.toFaceSide})`);
        faceString += '\n';
        this._tiles.forEach(tile => faceString += tile.toString());
        return faceString;
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

}
