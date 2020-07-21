import { TilePosition } from "./tile-position";
import { DisplayChange } from "./display-change";


function placeDisplayChange(tilePosition: TilePosition): DisplayChange {
    return {
        eventType: "Place",
        tilePositionId: tilePosition.id,
        empty: tilePosition.isEmpty(),
        tileId: tilePosition.isEmpty() ? null : tilePosition.tile.id,
        rotatedSegments: tilePosition.isEmpty() ? null : tilePosition.getRotatedSegments()
    }
}

function rotateDisplayChange(tilePosition: TilePosition): DisplayChange {
    return {
        eventType: "Rotate",
        tilePositionId: tilePosition.id,
        empty: tilePosition.isEmpty(),
        tileId: tilePosition.isEmpty() ? null : tilePosition.tile.id,
        rotatedSegments: tilePosition.isEmpty() ? null : tilePosition.getRotatedSegments()
    }
}

export { placeDisplayChange, rotateDisplayChange }
