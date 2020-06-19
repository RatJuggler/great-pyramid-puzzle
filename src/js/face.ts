import { Tile } from "./tile";


interface SideJoinProperties {
    toFace: Face;
    toFaceSide: string;
}


export class Face {

    private static validTileCounts = [1, 4, 9];
    private static sideNames = ["1", "2", "3"];

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
        // tile1.join("1", to another face?);
        tile1.join("2", tile4, "3");
        // tile1.join("3", to another face?);
        tile2.join("1", tile3, "2");
        // tile1.join("2", to another face?);
        // tile1.join("3", to another face?);
        tile3.join("1", tile4, "3");
        tile3.join("2", tile2, "1");
        tile3.join("3", tile1, "2");
        // tile4.join("1", to another face?);
        // tile4.join("2", to another face?);
        tile4.join("3", tile3, "1");
    }

    display() {
        console.log(`Face: ${this._name} - Tiles: ${this._numberOfTiles}`);
        this._joins.forEach((join, side) => console.log(`S-${this._name}${side} -> S-${join.toFace.name}${join.toFaceSide}`));
        this._tiles.forEach(tile => tile ? console.log(tile.display()) : () => {});
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
