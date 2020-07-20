

type TilePositionChange = {
    eventType: string;
    tilePositionId: string;
    empty: boolean;
    tileId: number | null;
    rotatedSegments: string | null;
}

export { TilePositionChange }
