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

    protected static set(tilePosition: TilePosition): PuzzleChange {
        return TileChange.set(tilePosition.id, tilePosition.state.tile.id, tilePosition.state.rotations, tilePosition.state.tile.segments)
    }

    protected static add(tilePosition: TilePosition): PuzzleChange {
        return TileChange.add(tilePosition.id, tilePosition.state.tile.id, tilePosition.state.rotations, tilePosition.state.tile.segments);
    }

    protected static rotate(tilePosition: TilePosition, rotations: number): PuzzleChange {
        return TilePositionChange.rotate(tilePosition.id, rotations);
    }

    protected static remove(tilePosition: TilePosition): PuzzleChange {
        return TileChange.remove(tilePosition.id, tilePosition.state.tile.id, tilePosition.state.rotations, tilePosition.state.tile.segments);
    }

}


export { Solver, SolverBase }
