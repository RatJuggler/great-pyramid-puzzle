// Data structure common to both puzzle layout and tile definitions.


const SIDE_NAMES = "ABC";
const NUMBER_OF_SIDES = SIDE_NAMES.length;
const enum Sides {SideA, SideB, SideC}


type IntegrityCheckResult = [boolean, string];

export { SIDE_NAMES, NUMBER_OF_SIDES, Sides, IntegrityCheckResult }
