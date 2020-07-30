import { SolverBase } from "./solver-base";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { Tile } from "./tile";
import { TilePosition } from "./tile-position";
import { PuzzleChange, TileChange, TilePositionChange } from "./puzzle-changes";
import { getRandomInt } from "./utils";


export class NoMatchingSolver extends SolverBase {

    private _emptyTilePositions: Array<TilePosition>;
    private _tilePosition: TilePosition;
    private _rotating: number = 0;

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool,
                private _tileSelection: string, private _tilePlacement: string, private _tileRotation: string) {
        super(tetrahedron, tilePool);
        this._emptyTilePositions = this._tetrahedron.emptyTilePositions;
        this._tilePosition = this.getNextTilePosition();
    }

    private getNextTilePosition(): TilePosition {
        switch (this._tilePlacement) {
            case "Random":
                const position = getRandomInt(this._emptyTilePositions.length);
                const tilePosition = this._emptyTilePositions.splice(position, 1);
                return tilePosition[0];
            case "Sequential":
                return this._emptyTilePositions.shift()!;
            default:
                throw new Error("Invalid tile placement option!");
        }
    }

    private getTileSelection(): Tile {
        switch (this._tileSelection) {
            case "Random":
                return this._tilePool.randomTile;
            case "Sequential":
                return this._tilePool.nextTile;
            case "DisplayTest":
                return this._tilePool.displayTestTile;
            default:
                throw new Error("Invalid tile selection option!");
        }
    }

    private tileRotations(): number {
        switch (this._tileRotation) {
            case "None":
                return 0;
            case "Random":
                return getRandomInt(3);
            default:
                throw new Error("Invalid tile rotation option!");
        }
    }

    private placeTile(): PuzzleChange {
        this._tilePosition.tile = this.getTileSelection();
        this._rotating = this.tileRotations();
        return TileChange.place(this._tilePosition.id, this._tilePosition.tile.id, 0, this._tilePosition.tile.segments);
    }

    private rotateOrNext(): PuzzleChange {
        if (this._rotating > 0) {
            this._rotating--;
            this._tilePosition.tile.rotate();
            return TilePositionChange.rotate(this._tilePosition.id, 1);
        } else {
            if (this._emptyTilePositions.length === 0) {
                return PuzzleChange.SOLVED;
            } else {
                this._tilePosition = this.getNextTilePosition();
                return this.placeTile()
            }
        }
    }

    nextState(): PuzzleChange {
        if (this._tilePosition.isEmpty()) {
            return this.placeTile();
        }
        return this.rotateOrNext();
    }

    forceNextState(): PuzzleChange {
        // TODO: Reset the puzzle or make random changes?
        return PuzzleChange.COMPLETED;
    }

}
