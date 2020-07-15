import { LayoutData } from "./layout-data-schema";
import { TileData } from "./tile-data-schema";
import { DisplayData } from "./puzzle-display-schema";
import { TilePool } from "./tile-pool";
import { Tetrahedron } from "./tetrahedron";
import { DisplayManager } from "./puzzle-display";

// Interface/types used across the application.

interface PuzzleDataElements {
    readonly layoutData: LayoutData,
    readonly tileData: TileData,
    readonly displayData: DisplayData
}

interface PuzzleComponents {
    readonly tilePool: TilePool,
    readonly tetrahedron: Tetrahedron,
    readonly displayManager: DisplayManager,
}

type IntegrityCheckResult = [boolean, string];

export { PuzzleDataElements, PuzzleComponents, IntegrityCheckResult }
