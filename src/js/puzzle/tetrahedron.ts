import { IntegrityCheck, IntegrityCheckResult } from "./integrity";
import { Face } from "./face";
import { TilePosition } from "./tile-position";
import { Side } from "./side";


export class Tetrahedron implements IntegrityCheck {

    static readonly FACES = 4;

    private readonly _sidesMatchingWhenSolved: number;

    private _tileSidesMatching: number = 0;

    constructor(private readonly _name: string, private readonly _faces: Array<Face>) {
        if (this._faces.length !== Tetrahedron.FACES) {
            throw new Error(`Tetrahedron must always be configured with ${Tetrahedron.FACES} Faces!`)
        }
        this._sidesMatchingWhenSolved = this.tilePositionCount * Side.numberOfSides;
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

    get name(): string {
        return this._name;
    }

    get tilePositionCount(): number {
        return this._faces.reduce((count, face) => count + face.tilePositionCount, 0);
    }

    get tileSidesMatching(): number {
        return this._tileSidesMatching;
    }

    get tilePositions(): Array<TilePosition> {
        return this._faces
            .map((face) => face.tilePositions)
            .reduce((allTilePositions, tilePositions) =>
                allTilePositions.concat(tilePositions), new Array<TilePosition>());
    }

    get emptyTilePositions(): Array<TilePosition> {
        return this._faces
            .map((face) => face.emptyTilePositions)
            .reduce((allEmptyTilePositions, tilePositions) =>
                allEmptyTilePositions.concat(tilePositions), new Array<TilePosition>());
    }

    getFace(name: string): Face {
        for (const face of this._faces) {
            if (face.name === name) {
                return face;
            }
        }
        throw new Error(`Face (${name}) not found on Tetrahedron!`);
    }

    countTileSidesMatching(): number {
        this._tileSidesMatching = this.tilePositions
            .reduce((totalMatches, tilePosition) => totalMatches + tilePosition.sidesMatching(), 0);
        return this._tileSidesMatching;
    }

    isSolved(): boolean {
        return this._tileSidesMatching === this._sidesMatchingWhenSolved;
    }

    toString(): string {
        let tetrahedronString = `Puzzle Type: ${this._name}\n`;
        this._faces.forEach(face => tetrahedronString += face.toString());
        return tetrahedronString;
    }

}
