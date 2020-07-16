// Types defining the puzzle display data structure configuration.

type CenterPointData = {
    readonly x: number,
    readonly y: number,
    readonly r: number
}

type TilePositionDisplayData = {
    readonly id: string,
    readonly center: CenterPointData
}

type FaceDisplayData = {
    readonly id: string,
    readonly center: CenterPointData,
    readonly tilePositions: TilePositionDisplayData[]
}

type DisplayData = {
    readonly triangle: number[],
    readonly segments: number[][][],
    readonly faceScale: number,
    readonly tileScale: number,
    readonly pegScale: number,
    readonly faces: FaceDisplayData[],
}

export { CenterPointData, TilePositionDisplayData, FaceDisplayData, DisplayData }
