import { LayoutData } from "./puzzle/layout-data-schema";
import { TileData } from "./puzzle/tile-data-schema";
import { TilePool } from "./puzzle/tile-pool";
import { Tetrahedron } from "./puzzle/tetrahedron";
import { PuzzleChange } from "./puzzle-changes";
import { SolverOptions } from "./solver/solver-factory";

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
    solvedOrCompleted: string
    stepCounter: number,
    finalState: Array<PuzzleChange>,
}

export { PuzzleDataElements, PuzzleComponents, IntegrityCheckResult, WorkerParameters, WorkerResult }
