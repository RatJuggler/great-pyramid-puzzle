import { LayoutData } from "./layout-data-schema";
import { TileData } from "./tile-data-schema";
import { DisplayData } from "./puzzle-display-schema";
import { TilePool } from "./tile-pool";
import { Tetrahedron } from "./tetrahedron";
import { DisplayManager } from "./puzzle-display";

// Types used across the application.

type PuzzleDataElements = {
    readonly layoutData: LayoutData,
    readonly tileData: TileData,
    readonly displayData: DisplayData
}

type PuzzleComponents = {
    readonly tilePool: TilePool,
    readonly tetrahedron: Tetrahedron,
    readonly displayManager: DisplayManager,
}

type IntegrityCheckResult = [boolean, string];

export { PuzzleDataElements, PuzzleComponents, IntegrityCheckResult }
