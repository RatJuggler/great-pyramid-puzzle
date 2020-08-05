import { simplePuzzle } from "./simple-puzzle";
import { pocketPuzzle } from "./pocket-puzzle";
import { greatPuzzle } from "./great-puzzle";
import { LayoutData, FaceData } from "./puzzle/layout-data-schema";
import { TileData } from "./puzzle/tile-data-schema";
import { Tetrahedron } from "./puzzle/tetrahedron";
import { TilePool } from "./puzzle/tile-pool";
import { PuzzleDataElements, PuzzleComponents } from "./common-data-schema";
import {Face} from "./puzzle/face";


function getTilePool(tileData: TileData): TilePool {
    return new TilePool(tileData.totalNumberOfTiles, tileData.tiles);
}

function buildFace(numberOfTiles: number, faceDetails: FaceData): Face {
    return new Face(faceDetails.name, numberOfTiles, faceDetails.tilePositions);
}

function buildTetrahedron(layoutData: LayoutData): Tetrahedron {
    if (layoutData.faces.length !== Tetrahedron.FACES) {
        throw new Error(`Tetrahedron must always have configuration data for ${Tetrahedron.FACES} Faces!`)
    }
    // We have to create all of the face and tile positions before we can join them together.
    const faces = new Map<string, Face>();
    for (const faceDetails of layoutData.faces) {
        const newFace = buildFace(layoutData.numberOfTilesPerFace, faceDetails);
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
