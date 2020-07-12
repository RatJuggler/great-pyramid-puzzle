const enum Side {SideA = 'A', SideB = 'B', SideC = 'C'}

class Sides {

    public readonly sideA = Side.SideA;
    public readonly sideB = Side.SideB;
    public readonly sideC = Side.SideC;

    private readonly _sides = new Map<string, Side>([
        [Side.SideA, Side.SideA],
        [Side.SideB, Side.SideB],
        [Side.SideC, Side.SideC]
    ]);

    constructor() {}

    get numberOfSides(): number {
        return this._sides.size;
    }

    getSide(side: string, name: string): Side {
        if (this._sides.has(side)) {
            return this._sides.get(side)!;
        }
        throw new Error(`Side ${name} must be one of ${Side.SideA},${Side.SideB},${Side.SideC}!`);
    }

}

const SIDES = new Sides();

export { SIDES, Side }
