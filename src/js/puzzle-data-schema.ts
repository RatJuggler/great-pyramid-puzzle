// Interfaces defining the puzzle data structure configuration.

interface TileData {
    readonly tile: number;
    readonly sideA: string;
    readonly sideB: string;
    readonly sideC: string;
}

interface TilePositionJoinData {
    readonly fromSide: string;
    readonly toSide: string;
    readonly ofTilePosition: string;
    readonly onFace: string;
}

interface TilePositionData {
    readonly position: string;
    readonly joins: TilePositionJoinData[];
}

interface FaceJoinData {
    readonly fromSide: string;
    readonly toSide: string;
    readonly ofFace: string;
}

interface FaceData {
    readonly name: string;
    readonly joins: FaceJoinData[];
    readonly tilePositions: TilePositionData[];
}

interface PuzzleData {
    readonly puzzle: string;
    readonly numberOfTilesPerFace: number;
    readonly totalNumberOfTiles: number;
    readonly faces: FaceData[];
    readonly tiles: TileData[];
}

export { PuzzleData, FaceData, FaceJoinData, TilePositionData, TilePositionJoinData, TileData };
