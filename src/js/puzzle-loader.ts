import { LayoutData } from "./layout-data-schema";
import { TileData } from "./tile-data-schema";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { PuzzleDataElements, PuzzleComponents } from "./common-data-schema";
import { DisplayData } from "./display-data-schema";
import { DisplayManager } from "./display";


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

function getDisplayManager(displayElement: string | HTMLElement, displayData: DisplayData) {
    return new DisplayManager(displayElement, displayData);
}

function getPuzzleComponents(puzzleTypeData: PuzzleDataElements, displayElement: string | HTMLElement): PuzzleComponents {
    const tilePool = getTilePool(puzzleTypeData.tileData);
    const tetrahedron = getTetrahedron(puzzleTypeData.layoutData);
    if (tilePool.tileCount !== tetrahedron.tilePositionCount) {
        throw new Error("There must be enough Tiles to cover the Tetrahedron!");
    }
    return {
        tilePool: tilePool,
        tetrahedron: tetrahedron,
        displayManager: getDisplayManager(displayElement, puzzleTypeData.displayData)
    }
}

export { getPuzzleComponents }
