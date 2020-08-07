import { IterativeSolverBase } from "./solver-iterative-base";
import { SolverBase } from "./solver-base";
import { Tile } from "../puzzle/tile";
import { TilePosition } from "../puzzle/tile-position";
import { PuzzleChange } from "../puzzle-changes";
import { PuzzleComponents } from "../common-data-schema";


type BruteSolverTileState = {
    tile: Tile,
    rotations: Array<number>
}
type BruteSolverState = {
    tilePosition: TilePosition,
    tileState: BruteSolverTileState | null,
    untriedTiles: Array<BruteSolverTileState>,
    rejectedTiles: Array<BruteSolverTileState>
}


abstract class BruteSolverBase extends IterativeSolverBase {

    private readonly _solverStack: Array<BruteSolverState> = [];
    private _currentState: BruteSolverState;

    constructor(puzzle: PuzzleComponents) {
        super(puzzle);
        // We expect to try every rotation of the set of Tiles for the initial state.
        const untriedTiles = this._tilePool.tiles.map((tile) => {
            return  {
                tile: tile,
                rotations: [0, 1, 2]
            }
        });
        this._currentState = {
            tilePosition: this._emptyTilePositions.shift()!,
            tileState: null,
            untriedTiles: untriedTiles,
            rejectedTiles: new Array<BruteSolverTileState>()
        }
    }

    private static rotateOrRemove(state: BruteSolverState): PuzzleChange {
        let displayChange;
        // Try the next rotation position for the current tile.
        const tilePosition = state.tilePosition;
        const tileState = state.tileState;
        if (!tileState) {
            throw new Error("TileState should not be null!");
        }
        if (tileState.rotations.length > 0) {
            const newRotations = tileState.rotations.shift()!;
            // How many rotations are moving round from the current one.
            const rotate = newRotations - tilePosition.state.rotations;
            tilePosition.state.rotations = newRotations;
            displayChange = SolverBase.rotate(tilePosition, rotate);
        } else {
            // If we've tried all the rotations and none match then reject this tile.
            displayChange = SolverBase.remove(tilePosition);
            tilePosition.state.removeTile();
            state.rejectedTiles.push(tileState);
        }
        return displayChange;
    }

    protected abstract createNewState(state: BruteSolverState, tilePosition: TilePosition): BruteSolverState;

    private tryNextTilePosition(state: BruteSolverState): PuzzleChange {
        let displayChange;
        // If there aren't any more tile positions a solution has been reached!
        if (this._emptyTilePositions.length === 0) {
            displayChange = PuzzleChange.SOLVED;
        } else {
            // Save the current state, initialise a new state and move on.
            this._solverStack.push(state);
            this._currentState = this.createNewState(state, this._emptyTilePositions.shift()!);
            displayChange = this.nextState();
        }
        return displayChange;
    }

    private tryNextTile(state: BruteSolverState): PuzzleChange {
        let displayChange;
        // If we have any untried tiles then try the next one.
        const tilePosition = state.tilePosition;
        if (state.untriedTiles.length > 0) {
            state.tileState = state.untriedTiles.shift()!;
            tilePosition.state.tile = state.tileState.tile;
            if (state.tileState.rotations.length === 0) {
                throw new Error("There should be at least one rotation position for an untried Tile!");
            }
            tilePosition.state.rotations = state.tileState.rotations.shift()!;
            displayChange = SolverBase.add(tilePosition);
        } else {
            // Otherwise if we've tried all the tiles and nothing matches we need to move back a tile position.
            this._emptyTilePositions.unshift(tilePosition);
            // If we can't move back then we've tried every combination!
            if (this._solverStack.length === 0) {
                displayChange = PuzzleChange.COMPLETED;
            } else {
                this._currentState = this._solverStack.pop()!;
                // Cycle through the rotations or remove the tile if nothing matches.
                displayChange = BruteSolverBase.rotateOrRemove(this._currentState);
            }
        }
        return displayChange;
    }

    nextState(): PuzzleChange {
        let displayChange;
        // If we don't have a tile at the current tile position.
        const tilePosition = this._currentState.tilePosition;
        if (tilePosition.state.isEmpty()) {
            // Try the next tile.
            displayChange = this.tryNextTile(this._currentState);
        } else {
            // If everything matches then move on to the next tile position.
            if (tilePosition.tileMatches()) {
                displayChange = this.tryNextTilePosition(this._currentState);
            } else {
                // Cycle through the rotations or remove the tile if nothing matches.
                displayChange = BruteSolverBase.rotateOrRemove(this._currentState);
            }
        }
        return displayChange;
    }

    forceNextState(): PuzzleChange {
        return BruteSolverBase.rotateOrRemove(this._currentState);
    }

}

export { BruteSolverTileState, BruteSolverState, BruteSolverBase }
