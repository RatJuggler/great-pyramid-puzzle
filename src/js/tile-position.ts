import { Face } from "./face";
import { Tile } from "./tile";


interface TilePositionJoinProperties {
    readonly toSide: string;
    readonly ofTilePosition: TilePosition;
    readonly onFace: Face;
}


export class TilePosition {

    private static SIDE_NAMES = ["A", "B", "C"];

    private _joins = new Map<string, TilePositionJoinProperties>();
    private _tile: Tile | null = null;

    constructor(private _id: string, private _onFace: string) {}

    toString(): string {
        let tileString = `TilePosition: ${this._id}, On Face: ${this._onFace}, Contains Tile: [${this._tile}], Joins: `;
        this._joins.forEach((join, side) =>
            tileString += `(${this._id}-${side}->${join.onFace.name}-${join.ofTilePosition.id}-${join.toSide})`);
        return tileString;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._onFace + "-" + this._id;
    }

    get tile(): Tile {
        if (this._tile === null) {
            throw new Error("Can't fetch a Tile when there isn't one!");
        }
        return this._tile;
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

    isEmpty(): boolean {
        return !this._tile;
    }

    placeTile(tile: Tile): boolean {
        if (this.isEmpty()) {
            this._tile = tile.place();
            return true;
        }
        return false;
    }

    removeTile(): boolean {
        if (this.isEmpty()) {
            return false;
        }
        this._tile = null;
        return true;
    }

}
