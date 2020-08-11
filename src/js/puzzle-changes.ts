// These change value objects allow us to keep the solving and display code separate.
//
// Initial - Draw an empty puzzle
// Start - Draw a Tile at it's starting position.
// Empty - Draw an empty tile position
// Current - Draw a tile at it's current tile position (no animation)
// Place - Animate a tile moving from it's start position to a tile position
// Rotate - Animate rotating a tile at a tile position
// Remove - Animate a tile moving from a tile position back to it's start position
// Solved - A solution to the current puzzle
// Completed - No more solutions to the current puzzle


enum PuzzleChangeType {
    Initial = "Initial",
    Start = "Start",
    StartDraggable = "StartDraggable",
    Empty = "Empty",
    Current = "Current",
    Set = "Set",
    Add = "Add",
    Rotate = "Rotate",
    Remove = "Remove",
    Solved = "Solved",
    Completed = "Completed"
}


class PuzzleChange {

    static readonly INITIAL = new PuzzleChange(PuzzleChangeType.Initial);

    constructor(readonly type: PuzzleChangeType) {}

    isSolved(): boolean {
        return this.type === PuzzleChangeType.Solved;
    }

    isCompleted(): boolean {
        return this.type === PuzzleChangeType.Completed;
    }

}


class PuzzleChangeSet extends PuzzleChange {

    static current(puzzleChanges: Array<PuzzleChange>): PuzzleChange {
        return new PuzzleChangeSet(PuzzleChangeType.Current, puzzleChanges);
    }

    static solved(puzzleChanges: Array<PuzzleChange>): PuzzleChange {
        return new PuzzleChangeSet(PuzzleChangeType.Solved, puzzleChanges);
    }

    static completed(puzzleChanges: Array<PuzzleChange>): PuzzleChange {
        return new PuzzleChangeSet(PuzzleChangeType.Completed, puzzleChanges);
    }

    static build(type: string, puzzleChanges: Array<PuzzleChange>): PuzzleChange {
        let puzzleChange: PuzzleChange;
        if (type === "Solved") {
            puzzleChange = PuzzleChangeSet.solved(puzzleChanges);
        } else if (type === "Completed") {
            puzzleChange = PuzzleChangeSet.completed(puzzleChanges);
        } else {
            throw new Error("Build PuzzleChangeSet only for Solved or Completed changes!");
        }
        return puzzleChange;
    }

    constructor(type: PuzzleChangeType, readonly puzzleChanges: Array<PuzzleChange>) {
        super(type);
    }

}


class TilePositionChange extends PuzzleChange {

    static empty(tilePositionId: string): PuzzleChange {
        return new TilePositionChange(PuzzleChangeType.Empty, tilePositionId, 0);
    }

    static rotate(tilePositionId: string, rotations: number): PuzzleChange {
        return new TilePositionChange(PuzzleChangeType.Rotate, tilePositionId, rotations);
    }

    constructor(type: PuzzleChangeType, readonly tilePositionId: string, readonly rotations: number) {
        super(type);
    }

}


class TileChange extends TilePositionChange {

    static start(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.Start, tilePositionId, tileId, rotations, segments);
    }

    static startDraggable(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.StartDraggable, tilePositionId, tileId, rotations, segments);
    }

    static set(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.Set, tilePositionId, tileId, rotations, segments);
    }

    static add(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.Add, tilePositionId, tileId, rotations, segments);
    }

    static remove(tilePositionId: string, tileId: number, rotations: number, segments: string): PuzzleChange {
        return new TileChange(PuzzleChangeType.Remove, tilePositionId, tileId, rotations, segments);
    }

    constructor(type: PuzzleChangeType, tilePositionId: string, readonly tileId: number, rotations: number, readonly segments: string) {
        super(type, tilePositionId, rotations);
    }

}


export { PuzzleChangeType, PuzzleChange, PuzzleChangeSet, TilePositionChange, TileChange }
