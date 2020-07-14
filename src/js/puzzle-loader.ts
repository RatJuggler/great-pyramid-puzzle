import { LayoutData } from "./layout-data-schema";
import { TileData } from "./tile-data-schema";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { PuzzleDataElements, PuzzleComponents } from "./common-data-schema";
import { DisplayManager } from "./puzzle-display";


function getTetrahedron(puzzleType: LayoutData): Tetrahedron {
    const tetrahedron = new Tetrahedron(puzzleType.puzzle, puzzleType.numberOfTilesPerFace, puzzleType.faces);
    const integrityCheck = tetrahedron.integrityCheck();
    if (!integrityCheck[0]) {
        throw new Error(integrityCheck[1]);
    }
    return tetrahedron;
}

function getTilePool(puzzleType: TileData): TilePool {
    return new TilePool(puzzleType.totalNumberOfTiles, puzzleType.tiles);
}

function getPuzzleComponents(puzzleTypeData: PuzzleDataElements, puzzleDisplay: HTMLElement): PuzzleComponents {
    return {
        tilePool: getTilePool(puzzleTypeData.tileData),
        tetrahedron: getTetrahedron(puzzleTypeData.layoutData),
        puzzleDisplay: puzzleDisplay,
        displayManager: new DisplayManager(puzzleDisplay, puzzleTypeData.displayData)
    }
}

export { getTetrahedron, getTilePool, getPuzzleComponents }
