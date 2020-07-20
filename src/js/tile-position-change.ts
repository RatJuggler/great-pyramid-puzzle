import {TilePosition} from "./tile-position";
import {DisplayChange} from "./display-change";


function buildDisplayChange(tilePosition: TilePosition): DisplayChange {
    return {
        eventType: "Test",
        tilePositionId: tilePosition.id,
        empty: tilePosition.isEmpty(),
        tileId: tilePosition.isEmpty() ? null : tilePosition.tile.id,
        rotatedSegments: tilePosition.isEmpty() ? null : tilePosition.getRotatedSegments()
    }
}

export { buildDisplayChange }
