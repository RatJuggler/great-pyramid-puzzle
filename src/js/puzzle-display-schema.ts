// Interfaces defining the puzzle display data structure configuration.

interface TriangleDisplayData {
    readonly x: number,
    readonly y: number,
    readonly r: number,
}

interface PositionDisplayData {
    readonly name: string,
    readonly center: TriangleDisplayData
}

interface TileDisplayData {
    readonly tileScale: number,
    readonly tilePositions: PositionDisplayData[];
}

export { TriangleDisplayData, PositionDisplayData, TileDisplayData }
