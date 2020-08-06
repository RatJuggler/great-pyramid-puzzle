import { PuzzleChange, TileChange, TilePositionChange } from "../puzzle-changes";
import { Tile } from "../puzzle/tile";
import { TilePosition } from "../puzzle/tile-position";


interface Solver {
    initialState: () => Array<PuzzleChange>;
    nextState: () => PuzzleChange;
    forceNextState: () => PuzzleChange;
    currentState: () => Array<PuzzleChange>;
}


abstract class SolverBase implements Solver {

    constructor() {}

    abstract initialState(): Array<PuzzleChange>;

    abstract nextState(): PuzzleChange;

    abstract forceNextState(): PuzzleChange;

    abstract currentState(): Array<PuzzleChange>;

    protected static start(tile: Tile): PuzzleChange {
        return TileChange.start("start" + tile.id, tile.id, 0, tile.segments)
    }

    protected static empty(tilePosition: TilePosition): PuzzleChange {
        return TilePositionChange.empty(tilePosition.id);
    }

    protected static current(tilePosition: TilePosition): PuzzleChange {
        return TileChange.current(tilePosition.id, tilePosition.state.tile.id, tilePosition.state.rotations, tilePosition.state.tile.segments)
    }

    protected static place(tilePosition: TilePosition): PuzzleChange {
        return TileChange.place(tilePosition.id, tilePosition.state.tile.id, tilePosition.state.rotations, tilePosition.state.tile.segments);
    }

    protected static rotate(tilePosition: TilePosition, rotations: number): PuzzleChange {
        return TilePositionChange.rotate(tilePosition.id, rotations);
    }

    protected static remove(tilePosition: TilePosition): PuzzleChange {
        return TileChange.remove(tilePosition.id, tilePosition.state.tile.id, tilePosition.state.rotations, tilePosition.state.tile.segments);
    }

}


export { Solver, SolverBase }
