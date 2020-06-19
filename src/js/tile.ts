interface SideJoinProperties {
    toTile: Tile;
    toTileSide: string;
}


export class Tile {

    private static sideNames = ["A", "B", "C"];

    private _joins = new Map<string, SideJoinProperties>();

    constructor(private _id: string) {}

    toString(): string {
        let tileString = `Tile: ${this._id}, Joins: `;
        this._joins.forEach((join, side) => tileString += `(${this._id}-${side}->${join.toTile._id}-${join.toTileSide})`);
        return tileString + '\n';
    }

    get id(): string {
        return this._id;
    }

    join(fromSide: string, toTile: Tile, toTileSide: string) : void {
        if (!(Tile.sideNames.includes(fromSide))) {
            throw new Error(`Side to join from must be one of ${Tile.sideNames}!`);
        }
        if (!(Tile.sideNames.includes(toTileSide))) {
            throw new Error(`Side to join to must be one of ${Tile.sideNames}!`);
        }
        this._joins.set(fromSide, {toTile: toTile, toTileSide: toTileSide});
    }

}
