import { LayoutData } from "./layout-data-schema";
import { TileData } from "./tile-data-schema";
import { TilePool } from "./tile-pool";
import { Tetrahedron } from "./tetrahedron";
import { PuzzleChange } from "./puzzle-changes";
import { SolverOptions } from "./solver-factory";

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

type WorkerParameters = {
    continue: boolean,
    solverOptions: SolverOptions
}

type WorkerResult = {
    changeCounter: number,
    finalState: Array<PuzzleChange>,
    solvedOrCompleted: PuzzleChange
}

export { PuzzleDataElements, PuzzleComponents, IntegrityCheckResult, WorkerParameters, WorkerResult }
