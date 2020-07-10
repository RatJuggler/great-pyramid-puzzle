import { LayoutData } from "./layout-data-schema";
import { TileData } from "./tile-data-schema";
import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";


function getTetrahedron(puzzleType: LayoutData): Tetrahedron {
    return new Tetrahedron(puzzleType.puzzle, puzzleType.numberOfTilesPerFace, puzzleType.faces);
}

function getTilePool(puzzleType: TileData): TilePool {
    return new TilePool(puzzleType.totalNumberOfTiles, puzzleType.tiles);
}

export { getTetrahedron, getTilePool }
