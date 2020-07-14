import { LayoutData } from "./layout-data-schema";
import { TileData } from "./tile-data-schema";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { PuzzleDataElements, PuzzleComponents } from "./common-data-schema";
import { DisplayData } from "./puzzle-display-schema";
import { DisplayManager } from "./puzzle-display";


function getTilePool(tileData: TileData): TilePool {
    return new TilePool(tileData.totalNumberOfTiles, tileData.tiles);
}

function getTetrahedron(layoutData: LayoutData): Tetrahedron {
    const tetrahedron = new Tetrahedron(layoutData.puzzle, layoutData.numberOfTilesPerFace, layoutData.faces);
    const integrityCheck = tetrahedron.integrityCheck();
    if (!integrityCheck[0]) {
        throw new Error(integrityCheck[1]);
    }
    return tetrahedron;
}

function getDisplayManager(puzzleDisplay: HTMLElement, displayData: DisplayData) {
    return new DisplayManager(puzzleDisplay, displayData);
}

function getPuzzleComponents(puzzleTypeData: PuzzleDataElements, puzzleDisplay: HTMLElement): PuzzleComponents {
    return {
        tilePool: getTilePool(puzzleTypeData.tileData),
        tetrahedron: getTetrahedron(puzzleTypeData.layoutData),
        puzzleDisplay: puzzleDisplay,
        displayManager: getDisplayManager(puzzleDisplay, puzzleTypeData.displayData)
    }
}

export { getPuzzleComponents }
