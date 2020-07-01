import { Face } from "./face";
import { Tile } from "./tile";


interface TilePositionJoinProperties {
    readonly fromSide: string,
    readonly toSide: string;
    readonly ofTilePosition: TilePosition;
    readonly onFace: Face;
}


export class TilePosition {

    private static SIDE_NAMES = ["A", "B", "C"];

    private _joins = new Array<TilePositionJoinProperties>();
    private _tile: Tile | null = null;

    constructor(private _id: string) {}

    toString(): string {
        let tileString = `TilePosition: ${this._id}, Contains Tile: [${this._tile}], Joins: `;
        this._joins.forEach((join) =>
            tileString += `(${this._id}-${join.fromSide}->${join.onFace.name}-${join.ofTilePosition.id}-${join.toSide})`);
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
        this._joins.push({
            fromSide: fromSide,
            toSide: toSide,
            ofTilePosition: ofTilePosition,
            onFace: onFace
        });
    }

    isEmpty(): boolean {
        return !this._tile;
    }

    private match(tile: Tile): boolean {
        for (const join of this._joins) {
            console.log(join);
            // tile.side[fromSide] match with onFace.ofTilePosition.tile.side[toSide]
        }
        return tile.id !== 0;
    }

    private placeTile(tile: Tile, useMatching: boolean): boolean {
        if (this.isEmpty()) {
            if (useMatching && !this.match(tile)) {
                return false;
            }
            this._tile = tile;
            return true;
        }
        return false;
    }

    placeTileWithoutMatching(tile: Tile): boolean {
        return this.placeTile(tile, false);
    }

    placeTileWithMatching(tile: Tile): boolean {
        return this.placeTile(tile, true);
    }

}
