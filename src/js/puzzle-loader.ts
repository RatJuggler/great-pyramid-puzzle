import { simplePuzzle } from "./simple-puzzle";
import { pocketPuzzle } from "./pocket-puzzle";
import { greatPuzzle } from "./great-puzzle";
import { LayoutData } from "./layout-data-schema";
import { TileData } from "./tile-data-schema";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";
import { PuzzleDataElements, PuzzleComponents } from "./common-data-schema";


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

function getPuzzleTypeData(puzzleType: string): PuzzleDataElements {
    switch (puzzleType) {
        case "Simple":
            return simplePuzzle;
        case "Pocket":
            return pocketPuzzle;
        case "Great":
            return greatPuzzle;
        default:
            throw new Error("Invalid puzzle type option!");
    }
}

function getPuzzleComponents(puzzleType: string | PuzzleDataElements): PuzzleComponents {
    let puzzleTypeData;
    if (typeof(puzzleType) === "string") {
        puzzleTypeData = getPuzzleTypeData(puzzleType);
    } else {
        puzzleTypeData = puzzleType;
    }
    const tilePool = getTilePool(puzzleTypeData.tileData);
    const tetrahedron = getTetrahedron(puzzleTypeData.layoutData);
    if (tilePool.tileCount !== tetrahedron.tilePositionCount) {
        throw new Error("There must be enough Tiles to cover the Tetrahedron!");
    }
    return {
        tilePool: tilePool,
        tetrahedron: tetrahedron
    }
}

export { getPuzzleComponents }
