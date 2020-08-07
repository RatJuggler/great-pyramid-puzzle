import { simplePuzzle } from "./simple-puzzle";
import { pocketPuzzle } from "./pocket-puzzle";
import { greatPuzzle } from "./great-puzzle";
import { LayoutData, TilePositionData} from "./puzzle/layout-data-schema";
import { TileData } from "./puzzle/tile-data-schema";
import { Tetrahedron } from "./puzzle/tetrahedron";
import { Face } from "./puzzle/face";
import { TilePosition } from "./puzzle/tile-position";
import { TilePool } from "./puzzle/tile-pool";
import { PuzzleDataElements, PuzzleComponents } from "./common-data-schema";


function getTilePool(tileData: TileData): TilePool {
    return new TilePool(tileData.totalNumberOfTiles, tileData.tiles);
}

function buildFace(faceName: string, numberOfTiles: number, tilePositionData: TilePositionData[]): Face {
    if (!(Face.FACE_NAMES.includes(faceName))) {
        throw new Error(`Face name must be one of ${Face.FACE_NAMES}!`);
    }
    if (!(Face.VALID_TILE_COUNTS.includes(numberOfTiles))) {
        throw new Error(`Number of Tile Positions on a Face must be one of ${Face.VALID_TILE_COUNTS}!`);
    }
    if (numberOfTiles !== tilePositionData.length) {
        throw new Error(`Number of Tile Positions provided (${tilePositionData.length}) does not match number expected (${numberOfTiles})!`);
    }
    // We can't join the tile positions until they've been created for every face.
    const tilePositions = tilePositionData
        .map(tilePositionDetails => new TilePosition(tilePositionDetails.position, faceName))
        .reduce((map, newTilePosition) => {
                map.set(newTilePosition.name, newTilePosition);
                return map;
            }, new Map<string, TilePosition>());
    return new Face(faceName, tilePositions);
}

function buildTetrahedron(layoutData: LayoutData): Tetrahedron {
    if (layoutData.faces.length !== Tetrahedron.FACES) {
        throw new Error(`Tetrahedron must always have configuration data for ${Tetrahedron.FACES} Faces!`)
    }
    // We have to create all of the face and tile positions before we can create the tetrahedron and join them together.
    const faces = layoutData.faces
        .map(faceDetails => buildFace(faceDetails.name, layoutData.numberOfTilesPerFace, faceDetails.tilePositions));
    const tetrahedron = new Tetrahedron(layoutData.puzzle, faces);
    layoutData.faces.forEach(faceDetails => {
        const fromFace = tetrahedron.getFace(faceDetails.name);
        // Join the faces...
        faceDetails.joins
            .forEach(joinData => fromFace.join(joinData.fromSide, joinData.toSide, tetrahedron.getFace(joinData.ofFace)));
        // Join all the tile positions...
        faceDetails.tilePositions.forEach(tilePositionDetails => {
            const fromTilePosition = tetrahedron.getFace(faceDetails.name).getTilePosition(tilePositionDetails.position);
            tilePositionDetails.joins.forEach(joinData => {
                const toTilePosition = tetrahedron.getFace(joinData.onFace).getTilePosition(joinData.ofTilePosition);
                fromTilePosition.join(joinData.fromSide, joinData.toSide, toTilePosition);
            });
        });
    });
    return tetrahedron;
}

function getTetrahedron(layoutData: LayoutData): Tetrahedron {
    const tetrahedron = buildTetrahedron(layoutData);
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

export { getPuzzleComponents, buildTetrahedron }
