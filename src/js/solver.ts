import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { PuzzleChange } from "./puzzle-changes";


interface Solver {
    nextState: () => PuzzleChange;
    finalState: () => Array<PuzzleChange>;
}


abstract class SolverBase implements Solver {

    constructor(protected _tetrahedron: Tetrahedron, protected _tilePool: TilePool) {
        if (this._tilePool.tileCount !== this._tetrahedron.tilePositionCount) {
            throw new Error("There must be enough Tiles to cover the Tetrahedron!");
        }
    }

    abstract nextState(): PuzzleChange;

    finalState(): Array<PuzzleChange> {
        return this._tetrahedron.tilePositions
            .map((tilePosition) =>
                PuzzleChange.final(tilePosition.id, tilePosition.tile.id, tilePosition.getRotatedSegments()));
    }

}


export { Solver, SolverBase }
