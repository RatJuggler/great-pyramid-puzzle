// Interfaces defining the puzzle data configuration file format.

interface FaceJoinData {
    readonly fromSide: string;
    readonly toSide: string;
    readonly ofFace: string;
}

interface FaceData {
    readonly name: string;
    readonly joins: FaceJoinData[]
}

interface PuzzleData {
    readonly puzzle: string;
    readonly numberOfTilesPerFace: number;
    readonly totalNumberOfTiles: number;
    readonly faces: FaceData[];
}
