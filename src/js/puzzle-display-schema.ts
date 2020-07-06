// Interfaces defining the puzzle display data structure configuration.

interface CenterPointData {
    readonly x: number,
    readonly y: number,
    readonly r: number
}

interface PositionDisplayData {
    readonly id: string,
    readonly center: CenterPointData
}

interface DisplayData {
    readonly triangle: string,
    readonly segments: string[],
    readonly faceScale: number,
    readonly facePositions: PositionDisplayData[],
    readonly tileScale: number,
    readonly tilePositions: PositionDisplayData[]
}

export { CenterPointData, PositionDisplayData, DisplayData }
