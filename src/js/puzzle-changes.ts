// These change value objects allow us to keep the solving and display code separate.
//
// Initial - Draw an empty puzzle
// Start - Draw a Tile at it's starting position.
// Empty - Draw an empty tile position
// Final - Draw a tile at it's final tile position (no animation)
// Place - Animate a tile moving from it's start position to a tile position
// Rotate - Animate rotating a tile at a tile position
// Remove - Animate a tile moving from a tile position back to it's start position
// Solved - A solution to the current puzzle
// Completed - No more solutions to the current puzzle


enum PuzzleChangeType {
    Initial = "Initial",
    Start = "Start",
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

    isCompleted(): boolean {
        return this === PuzzleChange.COMPLETED;
    }

}

class TilePositionChange extends PuzzleChange {

    static empty(tilePositionId: string): PuzzleChange {
        return new TilePositionChange(PuzzleChangeType.Empty, tilePositionId);
    }

    constructor(type: PuzzleChangeType, readonly tilePositionId: string) {
        super(type);
    }

}

class TileChange extends TilePositionChange {

    static start(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.Start, tilePositionId, tileId, rotations, segments);
    }

    static final(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.Final, tilePositionId, tileId, rotations, segments);
    }

    static place(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.Place, tilePositionId, tileId, rotations, segments);
    }

    static remove(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.Remove, tilePositionId, tileId, rotations, segments);
    }

    static rotate(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.Rotate, tilePositionId, tileId, rotations, segments);
    }

    constructor(type: PuzzleChangeType, tilePositionId: string, readonly tileId: number, readonly rotations: number, readonly segments: string) {
        super(type, tilePositionId);
    }

}

export { PuzzleChange, PuzzleChangeType, TilePositionChange, TileChange }
