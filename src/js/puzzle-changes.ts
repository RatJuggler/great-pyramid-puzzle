// These change value objects allow us to keep the solving and display code separate.


class PuzzleChange {

    constructor(readonly type: string) {}

    isSolved(): boolean {
        return this.type === "Solved";
    }

    isComplete(): boolean {
        return this.type === "Complete";
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
