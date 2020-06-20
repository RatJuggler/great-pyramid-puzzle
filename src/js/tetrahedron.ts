import { Face } from "./face";


interface FaceJoinData {
    fromSide: string;
    toSide: string;
    ofFace: string;
}

interface FaceData {
    name: string;
    joins: FaceJoinData[]
}

interface PuzzleData {
    puzzle: string;
    numberOfTilesPerFace: number;
    totalNumberOfTiles: number;
    faces: FaceData[];
}

export class Tetrahedron {

    private readonly FACES = 4;

    readonly _name: string;
    readonly _faces = new Map<string, Face>();

    constructor(config: PuzzleData) {
        if (config.faces.length != this.FACES) {
            throw new Error(`Tetrahedron must always have configuration data for ${this.FACES} Faces!`)
        }
        this._name = config.puzzle;
        for (const faceData of config.faces) {
            let newFace = new Face(faceData.name, config.numberOfTilesPerFace);
            this._faces.set(newFace.name, newFace);
        }
        for (const faceData of config.faces) {
            let fromFace = this._faces.get(faceData.name);
            for (const joinData of faceData.joins) {
                fromFace!.join(joinData.fromSide, this._faces.get(joinData.ofFace)!, joinData.toSide);
            }
        }
    }

    toString(): string {
        let tetrahedronString = `Solving: ${this._name}`;
        this._faces.forEach(face => tetrahedronString += face.toString());
        return tetrahedronString;
    }

    get name(): string {
        return this._name;
    }

}
