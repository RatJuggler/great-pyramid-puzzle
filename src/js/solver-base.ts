import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import {PuzzleChange, TileChange, TilePositionChange} from "./puzzle-changes";


interface Solver {
    nextState: () => PuzzleChange;
    initialState: () => Array<PuzzleChange>;
    finalState: () => Array<PuzzleChange>;
}


abstract class SolverBase implements Solver {

    constructor(protected _tetrahedron: Tetrahedron, protected _tilePool: TilePool) {
        if (this._tilePool.tileCount !== this._tetrahedron.tilePositionCount) {
            throw new Error("There must be enough Tiles to cover the Tetrahedron!");
        }
    }

    initialState(): Array<PuzzleChange> {
        return this._tetrahedron.tilePositions
            .map((tilePosition) => TilePositionChange.empty(tilePosition.id))
            .concat(this._tilePool.tiles
                .map((tile) => TileChange.start("start" + tile.id, tile.id, tile.rotations, tile.segments)));
    }

    abstract nextState(): PuzzleChange;

    finalState(): Array<PuzzleChange> {
        return this._tetrahedron.tilePositions
            .map((tilePosition) =>
                TileChange.final(tilePosition.id, tilePosition.tile.id, tilePosition.tile.rotations, tilePosition.tile.segments));
    }

}


export { Solver, SolverBase }
