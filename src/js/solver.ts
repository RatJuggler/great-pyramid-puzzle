import { Tetrahedron } from "./tetrahedron";
import { Tile } from "./tile";
import { TilePool } from "./tile-pool";
import { TilePosition } from "./tile-position";
import { PuzzleChange } from "./puzzle-changes";
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

    abstract nextState(): PuzzleChange;

    finalState(): Array<PuzzleChange> {
        return this._tetrahedron.tilePositions
            .map((tilePosition) =>
                PuzzleChange.final(tilePosition.id, tilePosition.tile.id, tilePosition.getRotatedSegments()));
    }

}


class NoMatchingSolver extends SolverBase {

    private _emptyTilePositions: Array<TilePosition>;
    private _tilePosition: TilePosition;
    private _rotating: number = 0;

    constructor(tetrahedron: Tetrahedron, tilePool: TilePool,
                private _tileSelection: string, private _tilePlacement: string, private _tileRotation: string) {
        super(tetrahedron, tilePool);
        this._emptyTilePositions = this._tetrahedron.emptyTilePositions;
        this._tilePosition = this.getNextTilePosition();
    }

    private getNextTilePosition(): TilePosition {
        switch (this._tilePlacement) {
            case "Random":
                const position = getRandomInt(this._emptyTilePositions.length);
                const tilePosition = this._emptyTilePositions.splice(position, 1);
                return tilePosition[0];
            case "Sequential":
                return this._emptyTilePositions.shift()!;
            default:
                throw new Error("Invalid tile placement option!");
        }
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

    private tileRotations(): number {
        switch (this._tileRotation) {
            case "None":
                return 0;
            case "Random":
                return getRandomInt(3);
            default:
                throw new Error("Invalid tile rotation option!");
        }
    }

    private placeTile(): PuzzleChange {
        const tile = this.getTileSelection();
        this._tilePosition.placeTile(tile);
        this._rotating = this.tileRotations();
        return PuzzleChange.place(this._tilePosition.id, this._tilePosition.tile.id, this._tilePosition.getRotatedSegments());
    }

    private rotateOrNext(): PuzzleChange {
        if (this._rotating > 0) {
            this._rotating--;
            this._tilePosition.rotateTile();
            return PuzzleChange.rotate(this._tilePosition.id);
        } else {
            if (this._emptyTilePositions.length === 0) {
                return PuzzleChange.SOLVED;
            } else {
                this._tilePosition = this.getNextTilePosition();
                return this.placeTile()
            }
        }
    }

    nextState(): PuzzleChange {
        if (this._tilePosition.isEmpty()) {
            return this.placeTile();
        }
        return this.rotateOrNext();
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

    private static rotateAndRemove(tilePosition: TilePosition, rejectedTiles: Array<Tile>): PuzzleChange {
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
            return BruteForceSolver.rotateAndRemove(tilePosition, rejectedTiles);
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
        return BruteForceSolver.rotateAndRemove(this._currentState.tilePosition, this._currentState.rejectedTiles);
    }

}

export { Solver, SolverBase, NoMatchingSolver, BruteForceSolver }
