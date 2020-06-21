import {Face} from "./face";
import {FaceData} from "./puzzle-data-schema";


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
        let tileString = `Tile: ${this._id}, Joins: `;
        this._joins.forEach((join, side) => tileString += `(${this._id}-${side}->${join.onFace.name}-${join.ofTilePosition.id}-${join.toSide})`);
        return tileString + '\n';
    }

    static joinTilePositions(faceData: FaceData[], faces: Map<string, Face>): void {
        for (const faceDetails of faceData) {
            for (const tilePositionDetails of faceDetails.tilePositions) {
                let fromTilePosition = faces.get(faceDetails.name)!.getTilePosition(tilePositionDetails.position);
                for (const joinData of tilePositionDetails.joins) {
                    let onFace = faces.get(joinData.onFace)!;
                    fromTilePosition.join(joinData.fromSide, joinData.toSide, onFace.getTilePosition(joinData.ofTilePosition), onFace);
                }
            }
        }
    }

    get id(): string {
        return this._id;
    }

    join(fromSide: string, toSide: string, ofTilePosition: TilePosition, onFace: Face) : void {
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
