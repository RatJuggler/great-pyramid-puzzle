import { TilePosition } from "./tile-position";
import { DisplayChange, TileDisplayChange, TilePositionDisplayChange } from "./display-change";


function placeDisplayChange(tilePosition: TilePosition): DisplayChange {
    return new TileDisplayChange("Place", tilePosition.id, tilePosition.tile.id, tilePosition.getRotatedSegments());
}

function rotateDisplayChange(tilePosition: TilePosition): DisplayChange {
    return new TilePositionDisplayChange("Rotate", tilePosition.id);
}

export { placeDisplayChange, rotateDisplayChange }
