// Interfaces defining the puzzle layout data structures used in the layout configuration files.


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

interface LayoutData {
    readonly puzzle: string;
    readonly numberOfTilesPerFace: number;
    readonly faces: FaceData[];
}

export { LayoutData, FaceData, FaceJoinData, TilePositionData, TilePositionJoinData };
