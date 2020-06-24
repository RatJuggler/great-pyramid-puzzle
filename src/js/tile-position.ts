import {Face} from "./face";


interface TilePositionJoinProperties {
    readonly toSide: string;
    readonly ofTilePosition: TilePosition;
    readonly onFace: Face;
}


export class TilePosition {

    private static SIDE_NAMES = ["A", "B", "C"];

    private _joins = new Map<string, TilePositionJoinProperties>();

    constructor(private _id: string) {}

    toString(): string {
        let tileString = `Tile Position: ${this._id}, Joins: `;
        this._joins.forEach((join, side) =>
            tileString += `(${this._id}-${side}->${join.onFace.name}-${join.ofTilePosition.id}-${join.toSide})`);
        return tileString;
    }

    get id(): string {
        return this._id;
    }

    join(fromSide: string, toSide: string, ofTilePosition: TilePosition, onFace: Face) : void {
        if (this === ofTilePosition) {
            throw new Error("Cannot join a TilePosition to itself!");
        }
        if (!(TilePosition.SIDE_NAMES.includes(fromSide))) {
            throw new Error(`Side to join from must be one of ${TilePosition.SIDE_NAMES}!`);
        }
        if (!(TilePosition.SIDE_NAMES.includes(toSide))) {
            throw new Error(`Side to join to must be one of ${TilePosition.SIDE_NAMES}!`);
        }
        this._joins.set(fromSide, {
            toSide: toSide,
            ofTilePosition: ofTilePosition,
            onFace: onFace
        });
    }

}
