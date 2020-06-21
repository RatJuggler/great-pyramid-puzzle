// Interfaces defining the puzzle data configuration file format.

interface TilePositionJoinData {
    readonly fromSide: string;
    readonly toSide: string;
    readonly ofTile: string;
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
}

export { PuzzleData, FaceData, FaceJoinData, TilePositionData, TilePositionJoinData };
