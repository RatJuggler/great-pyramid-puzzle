import { PuzzleChange, PuzzleChangeSet, TileChange, TilePositionChange } from "../puzzle-changes";
import { Tile } from "../puzzle/tile";
import { TilePosition } from "../puzzle/tile-position";

/**
 * A Solver is used to generate solutions to a given puzzle.
 * Solvers may use different strategies to find a solution but will need to conform with the following:
 * - After setting an initialState changes to the puzzle will be enumerated using nextState until a solution is found or all states
 *   have been checked.
 * - Once a solution is found forceNextState can be used to re-start the search for another solution then changes enumerated using
 *   nextState again until a further solution is found.
 * - stateForDisplay can be called to provide a snapshot of the puzzles current state.
 */


interface Solver {
    initialState: () => PuzzleChange;
    nextState: () => PuzzleChange;
    forceNextState: () => PuzzleChange;
    stateForDisplay: () => Array<PuzzleChange>;
}


abstract class SolverBase implements Solver {

    protected constructor() {}

    abstract initialState(): PuzzleChange;

    abstract nextState(): PuzzleChange;

    abstract forceNextState(): PuzzleChange;

    abstract stateForDisplay(): Array<PuzzleChange>;

    protected static start(tile: Tile): PuzzleChange {
        return TileChange.start("start" + tile.id, tile.id, 0, tile.segments);
    }

    protected static startDraggable(tile: Tile): PuzzleChange {
        return TileChange.startDraggable("Draggable", tile.id, 0, tile.segments);
    }

    protected static tileDraggable(tilePosition: TilePosition): PuzzleChange {
        return TileChange.tileDraggable(tilePosition.id, tilePosition.state.tile.id, tilePosition.state.rotations, tilePosition.state.tile.segments);
    }

    protected static empty(tilePosition: TilePosition): PuzzleChange {
        return TilePositionChange.empty(tilePosition.id);
    }

    protected static set(tilePosition: TilePosition): PuzzleChange {
        return TileChange.set(tilePosition.id, tilePosition.state.tile.id, tilePosition.state.rotations, tilePosition.state.tile.segments);
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

    protected static completed(puzzleChanges: Array<PuzzleChange>): PuzzleChange {
        return PuzzleChangeSet.completed(puzzleChanges);
    }

}


export { Solver, SolverBase }
