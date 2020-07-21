import { TilePosition } from "./tile-position";


class TilePositionChange {

    constructor(readonly type: string, readonly tilePositionId: string) {}

}

class TileChange extends TilePositionChange {

    constructor(type: string, tilePositionId: string, readonly tileId: number, readonly rotatedSegments: string) {
        super(type, tilePositionId);
    }

}

function createTileChange(type: string, tilePosition: TilePosition): TilePositionChange {
    return new TileChange(type, tilePosition.id, tilePosition.tile.id, tilePosition.getRotatedSegments());
}

function createTilePositionChange(type: string, tilePosition: TilePosition): TilePositionChange {
    return new TilePositionChange(type, tilePosition.id);
}

export { TilePositionChange, TileChange, createTileChange, createTilePositionChange }
