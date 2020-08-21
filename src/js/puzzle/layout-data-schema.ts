// Types defining the puzzle layout data structures used in the layout configuration files.

type TilePositionJoinData = {
    readonly fromSide: string;
    readonly toSide: string;
    readonly ofTilePosition: string;
    readonly onFace: string;
}

type TilePositionData = {
    readonly position: string;
    readonly joins: TilePositionJoinData[];
}

type FaceJoinData = {
    readonly fromSide: string;
    readonly toSide: string;
    readonly ofFace: string;
}

type FaceData = {
    readonly name: string;
    readonly joins: FaceJoinData[];
    readonly tilePositions: TilePositionData[];
}

type LayoutData = {
    readonly puzzle: string;
    readonly numberOfTilesPerFace: number;
    readonly faces: FaceData[];
}

export { LayoutData, FaceData, FaceJoinData, TilePositionData, TilePositionJoinData };
