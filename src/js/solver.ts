import { Tetrahedron } from "./tetrahedron";
import { Tile } from "./tile";
import { TilePool } from "./tile-pool";
import { TilePosition } from "./tile-position";
import { PuzzleChange, TilePositionChange, TileChange } from "./puzzle-changes";
import { getRandomInt } from "./utils";


interface Solver {
    nextState: () => PuzzleChange;
    finalState: () => Array<PuzzleChange>;
}


abstract class SolverBase implements Solver {

    constructor(protected _tetrahedron: Tetrahedron, protected _tilePool: TilePool) {
        if (this._tilePool.tileCount !== this._tetrahedron.tilePositionCount) {
            throw new Error("There must be enough Tiles to cover the Tetrahedron!");
        }
    }

    protected static createTileChange(type: string, tilePosition: TilePosition): PuzzleChange {
        return new TileChange(type, tilePosition.id, tilePosition.tile.id, tilePosition.getRotatedSegments());
    }

    protected static createTilePositionChange(type: string, tilePosition: TilePosition): PuzzleChange {
        return new TilePositionChange(type, tilePosition.id);
    }

    protected static createPuzzleChange(type: string): PuzzleChange {
        return new PuzzleChange(type);
    }

    abstract nextState(): PuzzleChange;

    finalState(): Array<PuzzleChange> {
        return this._tetrahedron.tilePositions
            .map((tilePosition) => SolverBase.createTileChange("Final", tilePosition));
    }

}


class NoMatchingSolver extends SolverBase {

    private _tilePosition: TilePosition | null = null;
    private _rotating: number = 0;

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool,
                private _tileSelection: string, private _tilePlacement: string, private _tileRotation: string) {
        super(tetrahedron, tilePool);
    }

    getTileSelection(): Tile {
        switch (this._tileSelection) {
            case "Random":
                return this._tilePool.randomTile;
            case "Sequential":
                return this._tilePool.nextTile;
            case "Test":
                return this._tilePool.testTile;
            default:
                throw new Error("Invalid tile selection option!");
        }
    }

    tileRotations(): number {
        switch (this._tileRotation) {
            case "None":
                return 0;
            case "Random":
                return getRandomInt(3);
            default:
                throw new Error("Invalid tile rotation option!");
        }
    }

    placeTile(tile: Tile): TilePosition  {
        let tilePlacedPosition;
        switch (this._tilePlacement) {
            case "Random":
                tilePlacedPosition = this._tetrahedron.placeTileRandomly(tile);
                break;
            case "Sequential":
                tilePlacedPosition = this._tetrahedron.placeTileSequentially(tile);
                break;
            default:
                throw new Error("Invalid tile placement option!");
        }
        if (!tilePlacedPosition) {
            throw new Error("Failed to place tile on puzzle!");
        }
        return tilePlacedPosition;
    }

    nextState(): PuzzleChange {
        if (this._rotating > 0) {
            if (this._tilePosition === null) {
                throw new Error("No tile position to rotate!");
            }
            this._rotating--;
            this._tilePosition.rotateTile();
            return SolverBase.createTilePositionChange("Rotate", this._tilePosition);
        }
        if (this._tilePool.isEmpty) {
            return SolverBase.createPuzzleChange("Solved");
        }
        const tile = this.getTileSelection();
        this._tilePosition = this.placeTile(tile);
        this._rotating = this.tileRotations();
        return SolverBase.createTileChange("Place", this._tilePosition);
    }

}


type SolverState = {
    tilePosition: TilePosition,
    untriedTiles: Array<Tile>,
    rejectedTiles: Array<Tile>
}

class BruteForceSolver extends SolverBase {

    private readonly _emptyTilePositions: Array<TilePosition>;
    private readonly _unusedTiles: Array<Tile> = [];
    private readonly _solverStack: Array<SolverState> = [];
    private _currentState: SolverState;

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool) {
        super(tetrahedron, tilePool);
        this._emptyTilePositions = this._tetrahedron.emptyTilePositions;
        while (!this._tilePool.isEmpty) {
            this._unusedTiles.push(this._tilePool.nextTile);
        }
        this._currentState = {
            tilePosition: this._emptyTilePositions.shift()!,
            untriedTiles: [...this._unusedTiles],
            rejectedTiles: new Array<Tile>()
        }
    }

    private static rotateOrRemove(tilePosition: TilePosition, rejectedTiles: Array<Tile>): PuzzleChange {
        // Try rotating the current tile.
        if (tilePosition.rotateTile()) {
            return SolverBase.createTilePositionChange("Rotate", tilePosition);
        }
        // If we've tried all the rotations and none match then reject this tile.
        const displayChange = SolverBase.createTileChange("Remove", tilePosition);
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
                    return SolverBase.createPuzzleChange("Solved");
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
            return BruteForceSolver.rotateOrRemove(tilePosition, rejectedTiles);
        }
        // Try the next tile.
        if (untriedTiles.length > 0) {
            const nextTile = untriedTiles.shift()!;
            tilePosition.placeTile(nextTile);
            return SolverBase.createTileChange("Place", tilePosition);
        }
        // If we've tried all the tiles and nothing matches we need to move back a tile position and try the next rotation/tile from there.
        this._emptyTilePositions.unshift(tilePosition);
        if (this._solverStack.length === 0) {
            return SolverBase.createPuzzleChange("Completed")
        }
        this._currentState = this._solverStack.pop()!;
        // Cycle through the rotations or remove the tile if nothing matches.
        return BruteForceSolver.rotateOrRemove(this._currentState.tilePosition, this._currentState.rejectedTiles);
    }

    startNextSolution(): PuzzleChange {
        return BruteForceSolver.rotateOrRemove(this._currentState.tilePosition, this._currentState.rejectedTiles);
    }

}

export { Solver, SolverBase, NoMatchingSolver, BruteForceSolver }
