// Useful utility functions.


function getRandomInt(n: number): number {
    return Math.floor(Math.random() * Math.floor(n));
}

function isStartId(id: string): boolean {
    return id.startsWith("start");
}

function isTileId(id: string): boolean {
    return id.startsWith("tile");
}

function isTilePositionId(id: string): boolean {
    return !!id.match(/^[1-4]-[1-9]$/);
}

export { getRandomInt, isStartId, isTileId, isTilePositionId }
