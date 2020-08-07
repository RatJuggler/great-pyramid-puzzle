import { IntegrityCheck, IntegrityCheckResult } from "./integrity";
import { Face } from "./face";
import { TilePosition } from "./tile-position";


export class Tetrahedron implements IntegrityCheck {

    static readonly FACES = 4;

    constructor(private readonly _name: string, private readonly _faces: Array<Face>) {
        if (this._faces.length !== Tetrahedron.FACES) {
            throw new Error(`Tetrahedron must always be configured with ${Tetrahedron.FACES} Faces!`)
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

    tileSidesMatching(): number {
        return this.tilePositions
            .reduce((totalMatches, tilePosition) => totalMatches + tilePosition.sidesMatching(), 0);
    }

    toString(): string {
        let tetrahedronString = `Puzzle Type: ${this._name}\n`;
        this._faces.forEach(face => tetrahedronString += face.toString());
        return tetrahedronString;
    }

}
