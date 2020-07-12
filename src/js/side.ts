enum Side {SideA = 'A', SideB = 'B', SideC = 'C'}

class Sides {

    private static readonly _sides = new Map<string, Side>([
        [Side.SideA, Side.SideA],
        [Side.SideB, Side.SideB],
        [Side.SideC, Side.SideC]
    ]);

    constructor() {}

    get numberOfSides(): number {
        return Sides._sides.size;
    }

    validateSide(side: string, name: string): Side {
        if (Sides._sides.has(side)) {
            return Sides._sides.get(side)!;
        }
        throw new Error(`Side ${name} must be one of ${Side.SideA},${Side.SideB},${Side.SideC}!`);
    }

}

const SIDES = new Sides();

export { SIDES, Side }
