import layout_data from "../pocket-layout-data.json";
import tile_data from "../pocket-tile-data.json";
import display_data from "../pocket-display-data.json";
import { PuzzleDataElements } from "./common-data-schema";


const pocketPuzzle: PuzzleDataElements = {
    layoutData: layout_data,
    tileData: tile_data,
    displayData: display_data
}

export { pocketPuzzle }
