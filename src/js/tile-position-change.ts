// These change value objects allow us to keep the solving and display code separate.


class TilePositionChange {

    constructor(readonly type: string, readonly tilePositionId: string) {}

}

class TileChange extends TilePositionChange {

    constructor(type: string, tilePositionId: string, readonly tileId: number, readonly rotatedSegments: string) {
        super(type, tilePositionId);
    }

}

export { TilePositionChange, TileChange }
