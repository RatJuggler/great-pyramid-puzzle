import { LayoutData } from "./layout-data-schema";
import { TileData } from "./tile-data-schema";
import { TilePool } from "./tile-pool";
import { Tetrahedron } from "./tetrahedron";
import { PuzzleChange } from "./puzzle-changes";

// Types used across the application.

type PuzzleDataElements = {
    readonly layoutData: LayoutData,
    readonly tileData: TileData
}

type PuzzleComponents = {
    readonly tilePool: TilePool,
    readonly tetrahedron: Tetrahedron
}

type IntegrityCheckResult = [boolean, string];

type WorkerResult = {
    changeCounter: number,
    finalState: Array<PuzzleChange>
}

export { PuzzleDataElements, PuzzleComponents, IntegrityCheckResult, WorkerResult }
