// Display Events/Changes:
// Initial - Draw an empty puzzle
// Empty - Draw an empty tile position
// Final - Draw a tile at it's final tile position (no animation)
// Place - Animate placing a tile at a tile position
// Rotate - Animate rotating a tile at a tile position
// Remove - Animate removing the tile at a tile position


class DisplayChange {

    constructor(readonly type: string) {}

}

class TilePositionDisplayChange extends DisplayChange {

    constructor(type: string, readonly tilePositionId: string) {
        super(type);
    }

}

class TileDisplayChange extends TilePositionDisplayChange {

    constructor(type: string, tilePositionId: string, readonly tileId: number, readonly rotatedSegments: string) {
        super(type, tilePositionId);
    }

}

export { DisplayChange, TilePositionDisplayChange, TileDisplayChange }
