import { SolverBase } from "./solver-base";
import { Tetrahedron } from "../puzzle/tetrahedron";
import { TilePool } from "../puzzle/tile-pool";
import { TilePosition } from "../puzzle/tile-position";
import { PuzzleChange } from "../puzzle-changes";
import { PuzzleComponents } from "../common-data-schema";


abstract class IterativeSolverBase extends SolverBase {

    protected readonly _tetrahedron: Tetrahedron;
    protected readonly _tilePool: TilePool
    protected readonly _emptyTilePositions: Array<TilePosition>;

    constructor(puzzle: PuzzleComponents) {
        super();
        this._tetrahedron = puzzle.tetrahedron;
        this._tilePool = puzzle.tilePool;
        if (this._tilePool.tileCount !== this._tetrahedron.tilePositionCount) {
            throw new Error("There must be enough Tiles to cover the Tetrahedron!");
        }
        this._emptyTilePositions = this._tetrahedron.emptyTilePositions;
        if (this._emptyTilePositions.length === 0) {
            throw new Error("Solver expects puzzle to have empty TilePositions at the start!")
        }
    }

    initialState(): PuzzleChange {
        const displayChanges = this._tetrahedron.tilePositions
            .map((tilePosition) => SolverBase.empty(tilePosition))
            .concat(this._tilePool.tiles.map((tile) => SolverBase.start(tile)));
        return SolverBase.current(displayChanges);
    }

    private stateForDisplay(): Array<PuzzleChange> {
        return this._tetrahedron.tilePositions
            .map((tilePosition) => {
                if (tilePosition.state.isEmpty()) {
                    return SolverBase.empty(tilePosition);
                } else {
                    return SolverBase.set(tilePosition);
                }
            });
    }

    currentState(): PuzzleChange {
        return SolverBase.current(this.stateForDisplay());
    }

    solved(): PuzzleChange {
        return SolverBase.solved(this.stateForDisplay());
    }

}

export { IterativeSolverBase }
