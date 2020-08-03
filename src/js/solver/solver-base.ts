import { Tetrahedron } from "../tetrahedron";
import { TilePool } from "../tile-pool";
import { PuzzleChange, TileChange, TilePositionChange } from "../puzzle-changes";
import { Tile } from "../tile";
import { TilePosition } from "../tile-position";


interface Solver {
    initialState: () => Array<PuzzleChange>;
    nextState: () => PuzzleChange;
    forceNextState: () => PuzzleChange;
    currentState: () => Array<PuzzleChange>;
}


abstract class SolverBase implements Solver {

    constructor(protected _tetrahedron: Tetrahedron, protected _tilePool: TilePool) {
        if (this._tilePool.tileCount !== this._tetrahedron.tilePositionCount) {
            throw new Error("There must be enough Tiles to cover the Tetrahedron!");
        }
    }

    initialState(): Array<PuzzleChange> {
        return this._tetrahedron.tilePositions
            .map((tilePosition) => SolverBase.empty(tilePosition))
            .concat(this._tilePool.tiles.map((tile) => SolverBase.start(tile)));
    }

    abstract nextState(): PuzzleChange;

    abstract forceNextState(): PuzzleChange;

    currentState(): Array<PuzzleChange> {
        return this._tetrahedron.tilePositions.map((tilePosition) => {
            if (tilePosition.isEmpty()) {
                return SolverBase.empty(tilePosition);
            } else {
                return SolverBase.final(tilePosition);
            }
        });
    }

    protected static start(tile: Tile): PuzzleChange {
        return TileChange.start("start" + tile.id, tile.id, tile.rotations, tile.segments)
    }

    protected static empty(tilePosition: TilePosition): PuzzleChange {
        return TilePositionChange.empty(tilePosition.id);
    }

    protected static final(tilePosition: TilePosition): PuzzleChange {
        return TileChange.final(tilePosition.id, tilePosition.tile.id, tilePosition.tile.rotations, tilePosition.tile.segments)
    }

    protected static place(tilePosition: TilePosition): PuzzleChange {
        return TileChange.place(tilePosition.id, tilePosition.tile.id, tilePosition.tile.rotations, tilePosition.tile.segments);
    }

    protected static rotate(tilePosition: TilePosition, rotations: number): PuzzleChange {
        return TilePositionChange.rotate(tilePosition.id, rotations);
    }

    protected static remove(tilePosition: TilePosition): PuzzleChange {
        return TileChange.remove(tilePosition.id, tilePosition.tile.id, tilePosition.tile.rotations, tilePosition.tile.segments);
    }

}


export { Solver, SolverBase }