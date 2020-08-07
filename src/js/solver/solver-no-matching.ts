import { PuzzleComponents } from "../common-data-schema";
import { IterativeSolverBase } from "./solver-iterative-base";
import { Tile } from "../puzzle/tile";
import { TilePosition } from "../puzzle/tile-position";
import { PuzzleChange, TileChange, TilePositionChange } from "../puzzle-changes";
import { getRandomInt } from "../utils";


export class NoMatchingSolver extends IterativeSolverBase {

    private _tilePosition: TilePosition;
    private _rotating: number = 0;

    constructor(puzzle: PuzzleComponents,
                private _tileSelection: string, private _tilePlacement: string, private _tileRotation: string) {
        super(puzzle);
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

    private addTile(): PuzzleChange {
        this._tilePosition.state.tile = this.getTileSelection();
        this._rotating = this.tileRotations();
        return TileChange.add(this._tilePosition.id, this._tilePosition.state.tile.id, 0, this._tilePosition.state.tile.segments);
    }

    private rotateOrNext(): PuzzleChange {
        if (this._rotating > 0) {
            this._rotating--;
            this._tilePosition.state.rotate();
            return TilePositionChange.rotate(this._tilePosition.id, 1);
        } else {
            if (this._emptyTilePositions.length === 0) {
                return PuzzleChange.SOLVED;
            } else {
                this._tilePosition = this.getNextTilePosition();
                return this.addTile()
            }
        }
    }

    nextState(): PuzzleChange {
        if (this._tilePosition.state.isEmpty()) {
            return this.addTile();
        }
        return this.rotateOrNext();
    }

    forceNextState(): PuzzleChange {
        // TODO: Reset the puzzle or make random changes?
        return PuzzleChange.COMPLETED;
    }

}
