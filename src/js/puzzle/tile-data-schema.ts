// Types defining the tile data structures used in the tile configuration files.

type TileDefinition = {
    readonly tile: number;
    readonly sideA: string;
    readonly sideB: string;
    readonly sideC: string;
}

type TileData = {
    readonly puzzle: string;
    readonly totalNumberOfTiles: number;
    readonly tiles: TileDefinition[];
}

export { TileData, TileDefinition };
