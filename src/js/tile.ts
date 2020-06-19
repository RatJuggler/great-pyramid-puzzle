interface SideJoinProperties {
    toTile: Tile;
    toTileSide: string;
}


export class Tile {

    private static sideNames = ["1", "2", "3"];

    private _joins = new Map<string, SideJoinProperties>();

    constructor(private _id: string) {}

    display() {
        console.log(`Tile: ${this._id}`);
        this._joins.forEach((join, side) => console.log(`S-${this._id}${side} -> S-${join.toTile._id}${join.toTileSide}`));
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
