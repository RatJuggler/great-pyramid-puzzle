// Trying to avoid creating a Side class.

const SIDE_NAMES = "ABC";
const NUMBER_OF_SIDES = SIDE_NAMES.length;
const enum Sides {SideA, SideB, SideC}

function validateSide(side: string, name: string): void {
    if (!SIDE_NAMES.includes(side)) {
        throw new Error(`Side ${name} must be one of ${SIDE_NAMES}!`);
    }
}

export { NUMBER_OF_SIDES, Sides, validateSide }
