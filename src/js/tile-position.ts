interface SideJoinProperties {
    readonly toTile: TilePosition;
    readonly toTileSide: string;
    getTile(): TilePosition;
}


export class TilePosition {

    private static SIDE_NAMES = ["A", "B", "C"];

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

    join(fromSide: string, toTile: TilePosition, toTileSide: string) : void {
        if (!(TilePosition.SIDE_NAMES.includes(fromSide))) {
            throw new Error(`Side to join from must be one of ${TilePosition.SIDE_NAMES}!`);
        }
        if (!(TilePosition.SIDE_NAMES.includes(toTileSide))) {
            throw new Error(`Side to join to must be one of ${TilePosition.SIDE_NAMES}!`);
        }
        this._joins.set(fromSide, {
            toTile: toTile,
            toTileSide: toTileSide,
            getTile: () => {
                return toTile;
            }
        });
    }

}
