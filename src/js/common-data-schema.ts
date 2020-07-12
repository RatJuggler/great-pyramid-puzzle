import {LayoutData} from "./layout-data-schema";
import {TileData} from "./tile-data-schema";
import {DisplayData} from "./puzzle-display-schema";

// Data structure common to both puzzle layout and tile definitions.


interface PuzzleDefinition {
    readonly layoutData: LayoutData,
    readonly tileData: TileData,
    readonly displayData: DisplayData

}

type IntegrityCheckResult = [boolean, string];


export { PuzzleDefinition, IntegrityCheckResult }
