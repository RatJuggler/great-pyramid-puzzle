import { Tile } from "./tile";
import { TilePosition } from "./tile-position";
import { TilePositionData} from "./layout-data-schema";
import { getRandomInt } from "./utils";


interface FaceJoinProperties {
    readonly toSide: string;
    readonly ofFace: Face;
}


export class Face {

    private static readonly FACE_NAMES = ["1", "2", "3", "4"];
    private static readonly VALID_TILE_COUNTS = [1, 4, 9];
    private static readonly SIDE_NAMES = ["A", "B", "C"];

    private readonly _joins = new Map<string, FaceJoinProperties>();
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

    integrityCheck(): [boolean, string] {
        // Each face must join to 3 other faces and must have a valid number of tile positions.
        if (this._joins.size !== Face.SIDE_NAMES.length) {
            return [false, `Face joins not complete: ${this.toString()}`];
        }
        if (!Face.VALID_TILE_COUNTS.includes(this._tilePositions.size)) {
            return [false, `Invalid number of tile positions on Face: ${this.toString()}`];
        }
        return [true, "Passed"];
    }

    fullIntegrityCheck(): [boolean, string] {
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

    toString(): string {
        let faceString = `Face: ${this._name}, Tile Positions: ${this.tilePositionCount}, Joins: `;
        this._joins.forEach((join, side) =>
            faceString += `(${this._name}-${side}->${join.ofFace.name}-${join.toSide})`);
        faceString += '\n';
        this._tilePositions.forEach(tilePosition => faceString += tilePosition.toString() + '\n');
        return faceString;
    }

    get id(): string {
        return "face" + this._name;
    }

    get name(): string {
        return this._name;
    }

    get tilePositionCount(): number {
        return this._tilePositions.size;
    }

    getTilePosition(position: string): TilePosition {
        if (this._tilePositions.has(position)) {
            return this._tilePositions.get(position)!;
        }
        throw new Error(`TilePosition (${position}) not found on Face (${this.name})!`);
    }

    getTileAtPosition(position: string): Tile | null {
        return this.getTilePosition(position).tile;
    }

    join(fromSide: string, toSide: string, ofFace: Face) : void {
        if (this._joins.size === Face.SIDE_NAMES.length) {
            throw new Error("Faces can only join to three other faces!");
        }
        if (this === ofFace) {
            throw new Error("Cannot join a Face to itself!");
        }
        if (this.tilePositionCount !== ofFace.tilePositionCount) {
            throw new Error("Cannot join Faces which have differing numbers of Tile Positions!");
        }
        if (!(Face.SIDE_NAMES.includes(fromSide))) {
            throw new Error(`Side to join from must be one of ${Face.SIDE_NAMES}!`);
        }
        if (!(Face.SIDE_NAMES.includes(toSide))) {
            throw new Error(`Side to join to must be one of ${Face.SIDE_NAMES}!`);
        }
        if (this._joins.get(fromSide)) {
            throw new Error(`Existing join already present for side ${fromSide}!`);
        }
        this._joins.set(fromSide, {
            toSide: toSide,
            ofFace: ofFace
        });
    }

    private get emptyTilePositions(): TilePosition[] {
        return Array.from(this._tilePositions.values()).filter(tilePosition => tilePosition.isEmpty());
    }

    hasEmptyTilePositions(): boolean {
        return this.emptyTilePositions.length > 0;
    }

    private placeTile(tile: Tile, position: number): TilePosition | null {
        const emptyPositions = this.emptyTilePositions;
        if (emptyPositions.length === 0) {
            return null;
        }
        return emptyPositions[position].placeTile(tile);
    }

    placeTileRandomly(tile: Tile): TilePosition | null {
        return this.placeTile(tile, getRandomInt(this.emptyTilePositions.length));
    }

    placeTileSequentially(tile: Tile): TilePosition | null {
        return this.placeTile(tile, 0);
    }

}
