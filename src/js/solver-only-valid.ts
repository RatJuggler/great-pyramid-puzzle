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
        if (tilePosition.tile.rotate()) {
            return PuzzleChange.rotate(tilePosition.id);
        }
        // If we've tried all the rotations and none match then reject this tile.
        const displayChange = PuzzleChange.remove(tilePosition.id, tilePosition.tile.id, tilePosition.tile.getSegments());
        const tile = tilePosition.removeTile();
        rejectedTiles.push(tile);
        return displayChange;
    }

    private createNewState(untriedTiles: Array<Tile>, rejectedTiles: Array<Tile>): void {
        // Find an existing side to match.
        const newTilePosition = this._emptyTilePositions.shift()!;
        const segmentsToFind = newTilePosition.needToMatch();
        // Filter the unused tiles so we only try those that are relevant.
        let newUntriedTiles = new Array<Tile>();
        const newRejectedTiles = new Array<Tile>();
        if (segmentsToFind.length === 0) {
            newUntriedTiles = untriedTiles.concat(rejectedTiles);
        } else {
            for (const untriedTile of untriedTiles.concat(rejectedTiles)) {
                let segmentFound = false;
                for (const sideSegments of segmentsToFind) {
                    if (untriedTile.hasSideSegments(sideSegments)) {
                        segmentFound = true;
                        break;
                    }
                }
                if (segmentFound) {
                    newUntriedTiles.push(untriedTile);
                } else {
                    newRejectedTiles.push(untriedTile);
                }
            }
        }
        this._currentState = {
            tilePosition: newTilePosition,
            untriedTiles: newUntriedTiles,
            rejectedTiles: newRejectedTiles
        }
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
                this.createNewState(untriedTiles, rejectedTiles);
                return this.nextState();
            }
            // Otherwise try cycling through the rotations or remove the tile if nothing matches.
            return OnlyValidSolver.rotateOrRemove(tilePosition, rejectedTiles);
        }
        // Try the next tile.
        if (untriedTiles.length > 0) {
            tilePosition.tile = untriedTiles.shift()!;
            return PuzzleChange.place(tilePosition.id, tilePosition.tile.id, tilePosition.tile.getSegments());
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
