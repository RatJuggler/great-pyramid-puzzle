import { SolverBase } from "./solver-base";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { Tile } from "./tile";
import { TilePosition } from "./tile-position";
import { PuzzleChange } from "./puzzle-changes";


type SolverState = {
    tilePosition: TilePosition,
    untriedTiles: Array<Tile>,
    rejectedTiles: Array<Tile>
}


abstract class IterativeSolverBase extends SolverBase {

    private readonly _emptyTilePositions: Array<TilePosition>;
    private readonly _solverStack: Array<SolverState> = [];
    private _currentState: SolverState;

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool) {
        super(tetrahedron, tilePool);
        this._emptyTilePositions = this._tetrahedron.emptyTilePositions;
        this._currentState = {
            tilePosition: this._emptyTilePositions.shift()!,
            untriedTiles: tilePool.tiles,
            rejectedTiles: new Array<Tile>()
        }
    }

    private static rotateOrRemove(state: SolverState): PuzzleChange {
        let displayChange;
        // Try rotating the current tile.
        const tilePosition = state.tilePosition;
        if (tilePosition.tile.rotate()) {
            displayChange = PuzzleChange.rotate(tilePosition.id);
        } else {
            // If we've tried all the rotations and none match then reject this tile.
            displayChange = PuzzleChange.remove(tilePosition.id, tilePosition.tile.id, tilePosition.tile.getSegments());
            const tile = tilePosition.removeTile();
            state.rejectedTiles.push(tile);
        }
        return displayChange;
    }

    abstract createNewState(state: SolverState, tilePosition: TilePosition): SolverState;

    private tryNextState(state: SolverState): PuzzleChange {
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

    private tryNextTile(state: SolverState): PuzzleChange {
        let displayChange;
        // If we have any untried tiles then try the next one.
        const tilePosition = state.tilePosition;
        if (state.untriedTiles.length > 0) {
            tilePosition.tile = state.untriedTiles.shift()!;
            displayChange = PuzzleChange.place(tilePosition.id, tilePosition.tile.id, tilePosition.tile.getSegments());
        } else {
            // Otherwise if we've tried all the tiles and nothing matches we need to move back a tile position.
            this._emptyTilePositions.unshift(tilePosition);
            // If we can't move back then we've tried every combination!
            if (this._solverStack.length === 0) {
                displayChange = PuzzleChange.COMPLETED;
            } else {
                this._currentState = this._solverStack.pop()!;
                // Cycle through the rotations or remove the tile if nothing matches.
                displayChange = IterativeSolverBase.rotateOrRemove(this._currentState);
            }
        }
        return displayChange;
    }

    nextState(): PuzzleChange {
        let displayChange;
        // If we don't have a tile at the current tile position.
        const tilePosition = this._currentState.tilePosition;
        if (tilePosition.isEmpty()) {
            // Try the next tile.
            displayChange = this.tryNextTile(this._currentState);
        } else {
            // If everything matches then move on to the next tile position.
            if (tilePosition.matches()) {
                displayChange = this.tryNextState(this._currentState);
            } else {
                // Cycle through the rotations or remove the tile if nothing matches.
                displayChange = IterativeSolverBase.rotateOrRemove(this._currentState);
            }
        }
        return displayChange;
    }

}

export { SolverState, IterativeSolverBase }
