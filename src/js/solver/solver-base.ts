import { PuzzleChange, PuzzleChangeSet, TileChange, TilePositionChange } from "../puzzle-changes";
import { Tile } from "../puzzle/tile";
import { TilePosition } from "../puzzle/tile-position";


interface Solver {
    initialState: () => PuzzleChange;
    nextState: () => PuzzleChange;
    forceNextState: () => PuzzleChange;
    currentState: () => PuzzleChange;
}


abstract class SolverBase implements Solver {

    constructor() {}

    abstract initialState(): PuzzleChange;

    abstract nextState(): PuzzleChange;

    abstract forceNextState(): PuzzleChange;

    abstract currentState(): PuzzleChange;

    abstract solved(): PuzzleChange;

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

    protected static current(puzzleChanges: Array<PuzzleChange>): PuzzleChange {
        return PuzzleChangeSet.current(puzzleChanges);
    }

    protected static solved(puzzleChanges: Array<PuzzleChange>): PuzzleChange {
        return PuzzleChangeSet.solved(puzzleChanges);
    }

}


export { Solver, SolverBase }
