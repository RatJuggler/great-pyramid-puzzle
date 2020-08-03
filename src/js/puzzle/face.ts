import { Tile } from "./tile";
import { TilePosition } from "./tile-position";
import { TilePositionData} from "./layout-data-schema";
import { IntegrityCheckResult } from "../common-data-schema";
import { Side, SIDES } from "./side";


type FaceJoinProperties = {
    readonly fromSide: Side,
    readonly toSide: Side,
    readonly ofFace: Face
}


export class Face {

    private static readonly FACE_NAMES = ["1", "2", "3", "4"];
    private static readonly VALID_TILE_COUNTS = [1, 4, 9];

    private readonly _joins = new Array<FaceJoinProperties>();
    private readonly _tilePositions = new Map<string, TilePosition>();

    constructor(private _name: string, numberOfTiles: number, tilePositions: TilePositionData[]) {
        if (!(Face.FACE_NAMES.includes(_name))) {
            throw new Error(`Face name must be one of ${Face.FACE_NAMES}!`);
        }
        if (!(Face.VALID_TILE_COUNTS.includes(numberOfTiles))) {
            throw new Error(`Number of Tile Positions on a Face must be one of ${Face.VALID_TILE_COUNTS}!`);
        }
        if (numberOfTiles !== tilePositions.length) {
            throw new Error(`Number of Tile Positions provided (${tilePositions.length}) does not match number expected (${numberOfTiles})!`);
        }
        // We can't join the tile positions until they've been created for every face.
        for (const tilePositionData of tilePositions) {
            const newTilePosition = new TilePosition(tilePositionData.position, this._name);
            this._tilePositions.set(newTilePosition.name, newTilePosition);
        }
    }

    integrityCheck(): IntegrityCheckResult {
        // Each face must join to 3 other faces and must have a valid number of tile positions.
        if (this._joins.length !== SIDES.numberOfSides) {
            return [false, `Face joins not complete: ${this.toString()}`];
        }
        if (!Face.VALID_TILE_COUNTS.includes(this._tilePositions.size)) {
            return [false, `Invalid number of tile positions on Face: ${this.toString()}`];
        }
        return [true, "Passed"];
    }

    fullIntegrityCheck(): IntegrityCheckResult {
        const faceIntegrity = this.integrityCheck();
        if (!faceIntegrity[0]) {
            return faceIntegrity;
        }
        for (const tilePosition of this._tilePositions.values()) {
            const tileIntegrity = tilePosition.integrityCheck();
            if (!tileIntegrity[0]) {
                return tileIntegrity;
            }
        }
        return faceIntegrity;
    }

    get name(): string {
        return this._name;
    }

    get tilePositionCount(): number {
        return this._tilePositions.size;
    }

    get tilePositions(): Array<TilePosition> {
        return Array.from(this._tilePositions.values());
    }

    get emptyTilePositions(): TilePosition[] {
        return Array.from(this._tilePositions.values()).filter(tilePosition => tilePosition.state.isEmpty()).reverse();
    }

    hasEmptyTilePositions(): boolean {
        return this.emptyTilePositions.length > 0;
    }

    getTilePosition(position: string): TilePosition {
        if (this._tilePositions.has(position)) {
            return this._tilePositions.get(position)!;
        }
        throw new Error(`TilePosition (${position}) not found on Face (${this.name})!`);
    }

    getTileAtPosition(position: string): Tile | null {
        return this.getTilePosition(position).state.tile;
    }

    join(joinFrom: string, joinTo: string, ofFace: Face) : void {
        if (this._joins.length === SIDES.numberOfSides) {
            throw new Error("Faces can only join to three other faces!");
        }
        if (this === ofFace) {
            throw new Error("Cannot join a Face to itself!");
        }
        if (this.tilePositionCount !== ofFace.tilePositionCount) {
            throw new Error("Cannot join Faces which have differing numbers of Tile Positions!");
        }
        const fromSide = SIDES.validateSide(joinFrom, "to join from");
        const toSide = SIDES.validateSide(joinTo, "to join to");
        for (const face of this._joins) {
            if (face.fromSide === joinFrom) {
                throw new Error(`Existing join already present for side ${joinFrom}!`);
            }
        }
        this._joins.push({
            fromSide: fromSide,
            toSide: toSide,
            ofFace: ofFace
        });
    }

    toString(): string {
        let faceString = `Face: ${this._name}, Tile Positions: ${this.tilePositionCount}, Joins: `;
        this._joins.forEach((join) =>
            faceString += `(${this._name}-${join.fromSide}->${join.ofFace.name}-${join.toSide})`);
        faceString += '\n';
        this._tilePositions.forEach(tilePosition => faceString += tilePosition.toString() + '\n');
        return faceString;
    }

}
