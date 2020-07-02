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
    private _orientation: number | null = null;

    constructor(private _id: string) {}

    toString(): string {
        let tileString = `TilePosition: ${this._id}, Contains Tile: [${this._tile}, Orientation: ${this._orientation}], Joins: `;
        this._joins.forEach((join, side) =>
            tileString += `(${this._id}-${side}->${join.onFace.name}-${join.ofTilePosition.id}-${join.toSide})`);
        return tileString;
    }

    get id(): string {
        return this._id;
    }

    get tile(): Tile | null {
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
            this._tile = tile;
            this._orientation = 0;
            return true;
        }
        return false;
    }

    nextOrientation(): number {
        if (this._tile == null || this._orientation == null) {
            throw new Error("Orientation must be initialised and used with a Tile!");
        }
        this._orientation = ++this._orientation % TilePosition.SIDE_NAMES.length;
        return this._orientation;
    }

}
