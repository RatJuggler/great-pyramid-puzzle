import { PuzzleData } from "./puzzle-data-schema";
import { Face } from "./face";
import {TilePosition} from "./tile-position";


export class Tetrahedron {

    private readonly FACES = 4;

    private readonly _name: string;
    private readonly _faces = new Map<string, Face>();

    constructor(config: PuzzleData) {
        if (config.faces.length != this.FACES) {
            throw new Error(`Tetrahedron must always have configuration data for ${this.FACES} Faces!`)
        }
        this._name = config.puzzle;
        // We have to create all of the face and tile positions before we can join them together.
        for (const faceData of config.faces) {
            let newFace = new Face(faceData.name, config.numberOfTilesPerFace, faceData.tilePositions);
            this._faces.set(newFace.name, newFace);
        }
        Face.joinFaces(config.faces, this._faces);
        TilePosition.joinTilePositions(config.faces, this._faces);
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
