// Interfaces defining the tile data structures used in the tile configuration files.

interface TileDefinition {
    readonly tile: number;
    readonly sideA: string;
    readonly sideB: string;
    readonly sideC: string;
}

interface TileData {
    readonly puzzle: string;
    readonly totalNumberOfTiles: number;
    readonly tiles: TileDefinition[];
}

export { TileData, TileDefinition };
