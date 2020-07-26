// These change value objects allow us to keep the solving and display code separate.
//
// Initial - Draw an empty puzzle
// Empty - Draw an empty tile position
// Final - Draw a tile at it's final tile position (no animation)
// Place - Animate placing a tile at a tile position
// Rotate - Animate rotating a tile at a tile position
// Remove - Animate removing the tile at a tile position
// Solved - A solution to the current puzzle
// Completed - No more solutions to the current puzzle


enum PuzzleChangeType {
    Initial = "Initial",
    Empty = "Empty",
    Final = "Final",
    Place = "Place",
    Rotate = "Rotate",
    Remove = "Remove",
    Solved = "Solved",
    Completed = "Completed"
}


class PuzzleChange {

    static readonly INITIAL = new PuzzleChange(PuzzleChangeType.Initial);
    static readonly SOLVED = new PuzzleChange(PuzzleChangeType.Solved);
    static readonly COMPLETED = new PuzzleChange(PuzzleChangeType.Completed);

    constructor(readonly type: PuzzleChangeType) {}

    isSolved(): boolean {
        return this === PuzzleChange.SOLVED;
    }

    isComplete(): boolean {
        return this === PuzzleChange.COMPLETED;
    }

}

class TilePositionChange extends PuzzleChange {

    static empty(tilePositionId: string): PuzzleChange {
        return new TilePositionChange(PuzzleChangeType.Empty, tilePositionId);
    }

    static rotate(tilePositionId: string): PuzzleChange {
        return new TilePositionChange(PuzzleChangeType.Rotate, tilePositionId);
    }

    constructor(type: PuzzleChangeType, readonly tilePositionId: string) {
        super(type);
    }

}

class TileChange extends TilePositionChange {

    static final(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.Final, tilePositionId, tileId, rotations, segments);
    }

    static place(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.Place, tilePositionId, tileId, rotations, segments);
    }

    static remove(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.Remove, tilePositionId, tileId, rotations, segments);
    }

    constructor(type: PuzzleChangeType, tilePositionId: string, readonly tileId: number, readonly rotations: number, readonly segments: string) {
        super(type, tilePositionId);
    }

}

export { PuzzleChange, PuzzleChangeType, TilePositionChange, TileChange }
