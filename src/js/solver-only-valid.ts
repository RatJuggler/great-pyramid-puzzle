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


export class OnlyValidSolver extends SolverBase {

    private readonly _emptyTilePositions: Array<TilePosition>;
    private readonly _solverStack: Array<SolverState> = [];
    private _currentState: SolverState;

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool) {
        super(tetrahedron, tilePool);
        this._emptyTilePositions = this._tetrahedron.emptyTilePositions;
        this._currentState = {
            tilePosition: this._emptyTilePositions.shift()!,
            untriedTiles: [...tilePool.tiles],
            rejectedTiles: new Array<Tile>()
        }
    }

    private static rotateOrRemove(tilePosition: TilePosition, rejectedTiles: Array<Tile>): PuzzleChange {
        // Try rotating the current tile.
        if (tilePosition.rotateTile()) {
            return PuzzleChange.rotate(tilePosition.id);
        }
        // If we've tried all the rotations and none match then reject this tile.
        const displayChange = PuzzleChange.remove(tilePosition.id, tilePosition.tile.id, tilePosition.getRotatedSegments());
        const tile = tilePosition.removeTile();
        rejectedTiles.push(tile);
        return displayChange;
    }

    nextState(): PuzzleChange {
        const tilePosition = this._currentState.tilePosition;
        const untriedTiles = this._currentState.untriedTiles;
        const rejectedTiles = this._currentState.rejectedTiles;
        // If we have a tile at the current tile position.
        if (!tilePosition.isEmpty()) {
            // And everything matches then move on to the next tile position.
            if (tilePosition.matches()) {
                // If there aren't any more tile positions a solution has been reached!
                if (this._emptyTilePositions.length === 0) {
                    return PuzzleChange.SOLVED;
                }
                // Save the current state, initialise a new state and move on.
                this._solverStack.push(this._currentState);
                this._currentState = {
                    tilePosition: this._emptyTilePositions.shift()!,
                    untriedTiles: [...untriedTiles.concat(rejectedTiles)],
                    rejectedTiles: new Array<Tile>()
                }
                return this.nextState();
            }
            // Otherwise try cycling through the rotations or remove the tile if nothing matches.
            return OnlyValidSolver.rotateOrRemove(tilePosition, rejectedTiles);
        }
        // Try the next tile.
        if (untriedTiles.length > 0) {
            const nextTile = untriedTiles.shift()!;
            tilePosition.placeTile(nextTile);
            return PuzzleChange.place(tilePosition.id, tilePosition.tile.id, tilePosition.getRotatedSegments());
        }
        // If we've tried all the tiles and nothing matches we need to move back a tile position and try the next rotation/tile from there.
        this._emptyTilePositions.unshift(tilePosition);
        if (this._solverStack.length === 0) {
            return PuzzleChange.COMPLETED;
        }
        this._currentState = this._solverStack.pop()!;
        // Cycle through the rotations or remove the tile if nothing matches.
        return OnlyValidSolver.rotateOrRemove(this._currentState.tilePosition, this._currentState.rejectedTiles);
    }

}
