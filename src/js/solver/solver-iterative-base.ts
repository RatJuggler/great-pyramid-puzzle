import { SolverBase } from "./solver-base";
import { Tetrahedron } from "../puzzle/tetrahedron";
import { TilePool } from "../puzzle/tile-pool";
import { TilePosition } from "../puzzle/tile-position";
import { PuzzleChange } from "../puzzle-changes";
import { PuzzleComponents } from "../common-data-schema";

/**
 * An iterative solver is one which iterate over all the puzzle pieces and positions trying to find a solution.
 */

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
        // The ordering of the empty tile positions impacts how long iterative solvers can take to find a solution.
        // The following ordering, while not optimum, helps improve the time:
        // Face 1: Tile Positions 1 - n
        // Face 2: Tile Positions n - 1
        // Face 4: Tile Positions n - 1
        // Face 3: Tile Positions 1 - n
        const face1 = this._tetrahedron.getFace("1").emptyTilePositions;
        const face2 = this._tetrahedron.getFace("2").emptyTilePositions.reverse();
        const face4 = this._tetrahedron.getFace("4").emptyTilePositions.reverse();
        const face3 = this._tetrahedron.getFace("3").emptyTilePositions;
        this._emptyTilePositions = face1.concat(face2).concat(face4).concat(face3);
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

    stateForDisplay(): Array<PuzzleChange> {
        return this._tetrahedron.tilePositions
            .map((tilePosition) => {
                if (tilePosition.state.isEmpty()) {
                    return SolverBase.empty(tilePosition);
                } else {
                    return SolverBase.set(tilePosition);
                }
            });
    }

}

export { IterativeSolverBase }
