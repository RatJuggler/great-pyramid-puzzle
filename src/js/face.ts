import { TilePositionData} from "./puzzle-data-schema";
import { TilePosition } from "./tile-position";


interface FaceJoinProperties {
    readonly toSide: string;
    readonly ofFace: Face;
}


export class Face {

    private static FACE_NAMES = ["1", "2", "3", "4"];
    private static VALID_TILE_COUNTS = [1, 4, 9];
    private static SIDE_NAMES = ["A", "B", "C"];

    private readonly _joins = new Map<string, FaceJoinProperties>();
    private readonly _tilePositions = new Map<string, TilePosition>();

    constructor(private _name: string, numberOfTiles: number, tilePositions: TilePositionData[]) {
        if (!(Face.FACE_NAMES.includes(_name))) {
            throw new Error(`Face name must be one of ${Face.FACE_NAMES}!`);
        }
        if (!(Face.VALID_TILE_COUNTS.includes(numberOfTiles))) {
            throw new Error(`Number of Tile Positions on a Face must be one of ${Face.VALID_TILE_COUNTS}!`);
        }
        if (numberOfTiles != tilePositions.length) {
            throw new Error(`Number of Tile Positions provided (${tilePositions.length}) does not match number expected (${numberOfTiles})!`);
        }
        // We can't join the tile positions until they've been created for every face.
        for (const tilePositionData of tilePositions) {
            let newTilePosition = new TilePosition(tilePositionData.position);
            this._tilePositions.set(newTilePosition.id, newTilePosition);
        }
    }

    toString(): string {
        let faceString = `Face: ${this._name}, Tile Positions: ${this.tilePositionCount}, Joins: `;
        this._joins.forEach((join, side) =>
            faceString += `(${this._name}-${side}->${join.ofFace.name}-${join.toSide})`);
        faceString += '\n';
        this._tilePositions.forEach(tilePosition => faceString += tilePosition.toString() + '\n');
        return faceString;
    }

    get name(): string {
        return this._name;
    }

    get tilePositionCount() {
        return this._tilePositions.size;
    }

    getTilePosition(position: string): TilePosition {
        return this._tilePositions.get(position)!;
    }

    join(fromSide: string, toSide: string, ofFace: Face) : void {
        if (this === ofFace) {
            throw new Error("Cannot join a Face to itself!");
        }
        if (this.tilePositionCount != ofFace.tilePositionCount) {
            throw new Error("Cannot join Faces which have differing numbers of Tile Positions!");
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
