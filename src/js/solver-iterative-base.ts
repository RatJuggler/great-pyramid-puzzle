import { SolverBase } from "./solver-base";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { Tile } from "./tile";
import { TilePosition } from "./tile-position";
import { PuzzleChange } from "./puzzle-changes";


type TileState = {
    tile: Tile,
    rotations: Array<number>
}
type SolverState = {
    tilePosition: TilePosition,
    tileState: TileState | null,
    untriedTiles: Array<TileState>,
    rejectedTiles: Array<TileState>
}


abstract class IterativeSolverBase extends SolverBase {

    private readonly _emptyTilePositions: Array<TilePosition>;
    private readonly _solverStack: Array<SolverState> = [];
    private _currentState: SolverState;

    protected constructor(tetrahedron: Tetrahedron, tilePool: TilePool) {
        super(tetrahedron, tilePool);
        this._emptyTilePositions = this._tetrahedron.emptyTilePositions;
        if (this._emptyTilePositions.length === 0) {
            throw new Error("Solver expects puzzle to have empty TilePositions at the start!")
        }
        // We expect to try every rotation of the set of Tiles for the initial state.
        const untriedTiles = new Array<TileState>();
        for (const tile of tilePool.tiles) {
            untriedTiles.push({
                tile: tile,
                rotations: [0, 1, 2]
            })
        }
        this._currentState = {
            tilePosition: this._emptyTilePositions.shift()!,
            tileState: null,
            untriedTiles: untriedTiles,
            rejectedTiles: new Array<TileState>()
        }
    }

    private static rotateOrRemove(state: SolverState): PuzzleChange {
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
            const rotate = newRotations - tilePosition.tile.rotations;
            tilePosition.tile.rotations = newRotations;
            displayChange = SolverBase.rotate(tilePosition, rotate);
        } else {
            // If we've tried all the rotations and none match then reject this tile.
            displayChange = SolverBase.remove(tilePosition);
            tilePosition.removeTile();
            state.rejectedTiles.push(tileState);
        }
        return displayChange;
    }

    protected abstract createNewState(state: SolverState, tilePosition: TilePosition): SolverState;

    private tryNextTilePosition(state: SolverState): PuzzleChange {
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
            state.tileState = state.untriedTiles.shift()!;
            tilePosition.tile = state.tileState.tile;
            if (state.tileState.rotations.length === 0) {
                throw new Error("There should be at least one rotation position for an untried Tile!");
            }
            tilePosition.tile.rotations = state.tileState.rotations.shift()!;
            displayChange = SolverBase.place(tilePosition);
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
            if (tilePosition.tilesMatch()) {
                displayChange = this.tryNextTilePosition(this._currentState);
            } else {
                // Cycle through the rotations or remove the tile if nothing matches.
                displayChange = IterativeSolverBase.rotateOrRemove(this._currentState);
            }
        }
        return displayChange;
    }

    forceNextState(): PuzzleChange {
        return IterativeSolverBase.rotateOrRemove(this._currentState);
    }

}

export { TileState, SolverState, IterativeSolverBase }
