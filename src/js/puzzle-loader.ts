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

function buildFace(name: string, numberOfTiles: number, tilePositionDetails: TilePositionData[]): Face {
    if (!(Face.FACE_NAMES.includes(name))) {
        throw new Error(`Face name must be one of ${Face.FACE_NAMES}!`);
    }
    if (!(Face.VALID_TILE_COUNTS.includes(numberOfTiles))) {
        throw new Error(`Number of Tile Positions on a Face must be one of ${Face.VALID_TILE_COUNTS}!`);
    }
    if (numberOfTiles !== tilePositionDetails.length) {
        throw new Error(`Number of Tile Positions provided (${tilePositionDetails.length}) does not match number expected (${numberOfTiles})!`);
    }
    // We can't join the tile positions until they've been created for every face.
    const tilePositions = new Map<string, TilePosition>();
    tilePositionDetails
        .map((tilePositionData) => new TilePosition(tilePositionData.position, name))
        .forEach((newTilePosition) => tilePositions.set(newTilePosition.name, newTilePosition));
    return new Face(name, tilePositions);
}

function buildTetrahedron(layoutData: LayoutData): Tetrahedron {
    if (layoutData.faces.length !== Tetrahedron.FACES) {
        throw new Error(`Tetrahedron must always have configuration data for ${Tetrahedron.FACES} Faces!`)
    }
    // We have to create all of the face and tile positions before we can join them together.
    const faces = new Map<string, Face>();
    for (const faceDetails of layoutData.faces) {
        const newFace = buildFace(faceDetails.name, layoutData.numberOfTilesPerFace, faceDetails.tilePositions);
        faces.set(newFace.name, newFace);
    }
    for (const faceDetails of layoutData.faces) {
        const fromFace = faces.get(faceDetails.name)!;
        // Join the faces...
        for (const joinData of faceDetails.joins) {
            fromFace.join(joinData.fromSide, joinData.toSide, faces.get(joinData.ofFace)!);
        }
        // Join all the tile positions...
        for (const tilePositionDetails of faceDetails.tilePositions) {
            const fromTilePosition = faces.get(faceDetails.name)!.getTilePosition(tilePositionDetails.position);
            for (const joinData of tilePositionDetails.joins) {
                const toTilePosition = faces.get(joinData.onFace)!.getTilePosition(joinData.ofTilePosition);
                fromTilePosition.join(joinData.fromSide, joinData.toSide, toTilePosition);
            }
        }
    }
    return new Tetrahedron(layoutData.puzzle, Array.from(faces.values()));
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
