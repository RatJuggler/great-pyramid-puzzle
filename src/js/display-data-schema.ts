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
    readonly name: string,
    readonly center: CenterPointData,
    readonly tilePositions: TilePositionDisplayData[]
}

type TileStartDisplayData = {
    readonly id: string,
    readonly center: CenterPointData
}

type DisplayData = {
    readonly triangle: number[],
    readonly segments: [number, number][][],
    readonly faceScale: number,
    readonly tileScale: number,
    readonly pegScale: number,
    readonly faces: FaceDisplayData[],
    readonly tileStartScale: number,
    readonly tileStartPositions: TileStartDisplayData[]
}

export { CenterPointData, TilePositionDisplayData, FaceDisplayData, TileStartDisplayData, DisplayData }
