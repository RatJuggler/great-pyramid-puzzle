import { Tetrahedron } from "./tetrahedron";
import { TilePool } from "./tile-pool";


function placeTilesRandomly(tetrahedron: Tetrahedron, tiles: TilePool): Tetrahedron {
    let tile = tiles.randomTile;
    while (tile) {
        console.assert(tetrahedron.placeTileWithoutMatching(tile));
        tile = tiles.randomTile;
    }
    return tetrahedron;
}

export { placeTilesRandomly }
