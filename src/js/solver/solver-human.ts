import { SolverBase } from "./solver-base";
import { PuzzleChange } from "../puzzle-changes";
import { PuzzleComponents } from "../common-data-schema";
import { Tetrahedron } from "../puzzle/tetrahedron";
import { TilePool } from "../puzzle/tile-pool";


export class HumanSolver extends SolverBase {

    protected readonly _tetrahedron: Tetrahedron;
    protected readonly _tilePool: TilePool

    constructor(puzzle: PuzzleComponents) {
        super();
        this._tetrahedron = puzzle.tetrahedron;
        this._tilePool = puzzle.tilePool;
    }

    forceNextState(): PuzzleChange {
        return PuzzleChange.INITIAL;
    }

    initialState(): PuzzleChange {
        const displayChanges = this._tetrahedron.tilePositions
            .map((tilePosition) => SolverBase.empty(tilePosition))
            .concat(this._tilePool.tiles.map((tile) => SolverBase.startDraggable(tile)));
        return SolverBase.current(displayChanges);
    }

    nextState(): PuzzleChange {
        return PuzzleChange.INITIAL;
    }

    stateForDisplay(): Array<PuzzleChange> {
        return [PuzzleChange.INITIAL];
    }

}
