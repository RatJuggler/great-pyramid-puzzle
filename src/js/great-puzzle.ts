import layout_data from "../great-layout-data.json";
import tile_data from "../great-tile-data.json";
import display_data from "../great-display-data.json";
import { PuzzleDataElements } from "./common-data-schema";


const greatPuzzle: PuzzleDataElements = {
    layoutData: layout_data,
    tileData: tile_data,
    displayData: display_data
}

export { greatPuzzle }
