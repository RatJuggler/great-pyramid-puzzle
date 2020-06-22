import { Face } from "./face";
import { FaceData } from "./puzzle-data-schema";
import { TilePosition } from "./tile-position";


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
        Face.joinFaces(faceData, this._faces);
        TilePosition.joinTilePositions(faceData, this._faces);
    }

    toString(): string {
        let tetrahedronString = `Solving: ${this._name}\n`;
        this._faces.forEach(face => tetrahedronString += face.toString());
        return tetrahedronString;
    }

    get name(): string {
        return this._name;
    }

}
