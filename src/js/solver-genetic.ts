import { SolverBase } from "./solver-base";
import { PuzzleChange } from "./puzzle-changes";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";


export class GeneticSolver extends SolverBase {

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool) {
        super(tetrahedron, tilePool);
    }

    forceNextState(): PuzzleChange {
        return PuzzleChange.COMPLETED;
    }

    nextState(): PuzzleChange {
        return PuzzleChange.SOLVED;
    }

}