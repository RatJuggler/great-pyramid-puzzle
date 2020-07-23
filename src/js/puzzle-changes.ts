// These change value objects allow us to keep the solving and display code separate.


class PuzzleChange {

    static readonly SOLVED = PuzzleChange.createPuzzleChange("Solved");
    static readonly COMPLETED = PuzzleChange.createPuzzleChange("Completed");

    constructor(readonly type: string) {}

    static createPuzzleChange(type: string): PuzzleChange {
        return new PuzzleChange(type);
    }

    static createTilePositionChange(type: string, tilePositionId: string): PuzzleChange {
        return new TilePositionChange(type, tilePositionId);
    }

    static createTileChange(type: string, tilePositionId: string, tileId: number, rotatedSegments: string): PuzzleChange {
        return new TileChange(type, tilePositionId, tileId, rotatedSegments);
    }

    isSolved(): boolean {
        return this === PuzzleChange.SOLVED;
    }

    isComplete(): boolean {
        return this === PuzzleChange.COMPLETED;
    }

}

class TilePositionChange extends PuzzleChange {

    constructor(type: string, readonly tilePositionId: string) {
        super(type);
    }

}

class TileChange extends TilePositionChange {

    constructor(type: string, tilePositionId: string, readonly tileId: number, readonly rotatedSegments: string) {
        super(type, tilePositionId);
    }

}

export { PuzzleChange, TilePositionChange, TileChange }
