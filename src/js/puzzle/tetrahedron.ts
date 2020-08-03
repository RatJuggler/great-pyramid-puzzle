import { Face } from "./face";
import { FaceData } from "../layout-data-schema";
import { TilePosition } from "./tile-position";
import { IntegrityCheckResult } from "../common-data-schema";


export class Tetrahedron {

    private static readonly FACES = 4;

    private readonly _faces = new Array<Face>();

    constructor(private _name: string, numberOfTilesPerFace: number, faceData: FaceData[]) {
        if (faceData.length !== Tetrahedron.FACES) {
            throw new Error(`Tetrahedron must always have configuration data for ${Tetrahedron.FACES} Faces!`)
        }
        // We have to create all of the face and tile positions before we can join them together.
        for (const faceDetails of faceData) {
            const newFace = new Face(faceDetails.name, numberOfTilesPerFace, faceDetails.tilePositions);
            this._faces.push(newFace);
        }
        for (const faceDetails of faceData) {
            const fromFace = this.getFace(faceDetails.name);
            // Join the faces...
            for (const joinData of faceDetails.joins) {
                fromFace.join(joinData.fromSide, joinData.toSide, this.getFace(joinData.ofFace));
            }
            // Join all the tile positions...
            for (const tilePositionDetails of faceDetails.tilePositions) {
                const fromTilePosition = this.getFace(faceDetails.name).getTilePosition(tilePositionDetails.position);
                for (const joinData of tilePositionDetails.joins) {
                    const toTilePosition = this.getFace(joinData.onFace).getTilePosition(joinData.ofTilePosition);
                    fromTilePosition.join(joinData.fromSide, joinData.toSide, toTilePosition);
                }
            }
        }
    }

    integrityCheck(): IntegrityCheckResult {
        // There must be 4 faces.
        if (this._faces.length !== Tetrahedron.FACES) {
            return [false, `Tetrahedron not configured with 4 faces: ${this.toString()}`];
        }
        //  Each face must have the same number of tile positions.
        if (this.tilePositionCount % Tetrahedron.FACES !== 0) {
            return [false, `Faces have differing Tile Position counts!`];
        }
        // The faces must all pass their full integrity checks.
        for (const face of this._faces.values()) {
            const faceIntegrity = face.fullIntegrityCheck();
            if (!faceIntegrity[0]) {
                return faceIntegrity;
            }
        }
        return [true, "Passed"];
    }

    get tilePositionCount(): number {
        let tilePositions = 0;
        this._faces.forEach(face => tilePositions += face.tilePositionCount);
        return tilePositions;
    }

    get name(): string {
        return this._name;
    }

    get tilePositions(): Array<TilePosition> {
        let tilePositions: Array<TilePosition> = [];
        this._faces.forEach((face) => tilePositions = tilePositions.concat(face.tilePositions))
        return tilePositions;
    }

    get emptyTilePositions(): Array<TilePosition> {
        let tilePositions: Array<TilePosition> = [];
        this._faces.forEach((face) => tilePositions = tilePositions.concat(face.emptyTilePositions))
        return tilePositions;
    }

    getFace(name: string): Face {
        for (const face of this._faces) {
            if (face.name === name) {
                return face;
            }
        }
        throw new Error(`Face (${name}) not found on Tetrahedron!`);
    }

    toString(): string {
        let tetrahedronString = `Puzzle Type: ${this._name}\n`;
        this._faces.forEach(face => tetrahedronString += face.toString());
        return tetrahedronString;
    }

}
