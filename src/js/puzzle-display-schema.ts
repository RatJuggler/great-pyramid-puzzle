// Interfaces defining the puzzle display data structure configuration.

interface CenterPointData {
    readonly x: number,
    readonly y: number,
    readonly r: number
}

interface TilePositionDisplayData {
    readonly id: string,
    readonly center: CenterPointData
}

interface FaceDisplayData {
    readonly id: string,
    readonly center: CenterPointData,
    readonly tilePositions: TilePositionDisplayData[]
}

interface DisplayData {
    readonly triangle: number[],
    readonly segments: number[][][],
    readonly faceScale: number,
    readonly tileScale: number,
    readonly faces: FaceDisplayData[],
}

export { CenterPointData, TilePositionDisplayData, FaceDisplayData, DisplayData }
