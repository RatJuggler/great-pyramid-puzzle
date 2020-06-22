import { Face } from "./face";
import { FaceData } from "./puzzle-data-schema";


export class Tetrahedron {

    private readonly FACES = 4;

    private readonly _faces = new Map<string, Face>();

    constructor(private _name: string, numberOfTilesPerFace: number, faceData: FaceData[]) {
        if (faceData.length != this.FACES) {
            throw new Error(`Tetrahedron must always have configuration data for ${this.FACES} Faces!`)
        }
        // We have to create all of the face and tile positions before we can join them together.
        for (const faceDetails of faceData) {
            let newFace = new Face(faceDetails.name, numberOfTilesPerFace, faceDetails.tilePositions);
            this._faces.set(newFace.name, newFace);
        }
        for (const faceDetails of faceData) {
            let fromFace = this.getFace(faceDetails.name);
            // Join the faces...
            for (const joinData of faceDetails.joins) {
                fromFace.join(joinData.fromSide, joinData.toSide, this.getFace(joinData.ofFace));
            }
            // Join all the tile positions...
            for (const tilePositionDetails of faceDetails.tilePositions) {
                let fromTilePosition = this.getFace(faceDetails.name).getTilePosition(tilePositionDetails.position);
                for (const joinData of tilePositionDetails.joins) {
                    let onFace = this.getFace(joinData.onFace);
                    fromTilePosition.join(joinData.fromSide, joinData.toSide, onFace.getTilePosition(joinData.ofTilePosition), onFace);
                }
            }
        }
    }

    toString(): string {
        let tetrahedronString = `Puzzle Type: ${this._name}\n`;
        this._faces.forEach(face => tetrahedronString += face.toString());
        return tetrahedronString;
    }

    get name(): string {
        return this._name;
    }

    getFace(name: string) {
        // Do we want to throw an error if we don't find anything?
        return this._faces.get(name)!;
    }

}
