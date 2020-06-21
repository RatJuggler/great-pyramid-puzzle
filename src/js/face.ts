import { TilePositionData } from "./puzzle-data-schema";
import { TilePosition } from "./tile-position";


interface SideJoinProperties {
    readonly toSide: string;
    readonly ofFace: Face;
}


export class Face {

    private static FACE_NAMES = ["1", "2", "3", "4"];
    private static VALID_TILE_COUNTS = [1, 4, 9];
    private static SIDE_NAMES = ["A", "B", "C"];

    private _joins = new Map<string, SideJoinProperties>();
    private _tilePositions = new Map<string, TilePosition>();

    constructor(private _name: string, private _numberOfTiles: number, tilePositions: TilePositionData[]) {
        if (!(Face.FACE_NAMES.includes(_name))) {
            throw new Error(`Face name must be one of ${Face.FACE_NAMES}!`)
        }
        if (!(Face.VALID_TILE_COUNTS.includes(_numberOfTiles))) {
            throw new Error(`Number of tiles on a Face must be one of ${Face.VALID_TILE_COUNTS}!`);
        }
        for (const tilePositionData of tilePositions) {
            let newTilePosition = new TilePosition(tilePositionData.position);
            this._tilePositions.set(newTilePosition.id, newTilePosition);
        }
    }

    toString(): string {
        let faceString = `Face: ${this._name}, Number of Tiles: ${this._numberOfTiles}, Joins: `;
        this._joins.forEach((join, side) => faceString += `(${this._name}-${side}->${join.ofFace.name}-${join.toSide})`);
        faceString += '\n';
        this._tilePositions.forEach(tilePosition => faceString += tilePosition.toString());
        return faceString;
    }

    get name(): string {
        return this._name;
    }

    join(fromSide: string, toSide: string, ofFace: Face) : void {
        if (this._numberOfTiles != ofFace._numberOfTiles) {
            throw new Error("Cannot join Faces with different numbers of tiles!");
        }
        if (!(Face.SIDE_NAMES.includes(fromSide))) {
            throw new Error(`Side to join from must be one of ${Face.SIDE_NAMES}!`);
        }
        if (!(Face.SIDE_NAMES.includes(toSide))) {
            throw new Error(`Side to join to must be one of ${Face.SIDE_NAMES}!`);
        }
        this._joins.set(fromSide, {toSide: toSide, ofFace: ofFace});
    }

}
