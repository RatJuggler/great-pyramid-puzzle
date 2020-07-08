// Interfaces defining the puzzle data structure configuration.

interface TileDefinition {
    readonly tile: number;
    readonly sideA: string;
    readonly sideB: string;
    readonly sideC: string;
}

interface TileData {
    readonly puzzle: string;
    readonly totalNumberOfTiles: number;
    readonly tiles: TileData[];
}

export { TileData, TileDefinition };
