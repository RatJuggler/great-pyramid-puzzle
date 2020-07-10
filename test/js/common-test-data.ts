import { TileDefinition } from "../../src/js/tile-data-schema";
import { TilePositionData } from "../../src/js/layout-data-schema";
import { Tile } from "../../src/js/tile";


const TILE_1_DATA: TileDefinition = {
    "tile": 101,
    "sideA": "0001",
    "sideB": "0010",
    "sideC": "0100"
};
const TILE_1 = new Tile(TILE_1_DATA);

const TILE_2_DATA: TileDefinition = {
    "tile": 102,
    "sideA": "0011",
    "sideB": "0100",
    "sideC": "1001"
};
const TILE_2 = new Tile(TILE_2_DATA);

const ONE_TILE_POSITION_DATA: TilePositionData[]  = [
    {"position": "1", "joins": []}
];

const FOUR_TILE_POSITION_DATA = [
    {"position": "1", "joins": []},
    {"position": "2", "joins": []},
    {"position": "3", "joins": []},
    {"position": "4", "joins": []}
];


export { TILE_1, TILE_1_DATA, TILE_2, TILE_2_DATA, ONE_TILE_POSITION_DATA, FOUR_TILE_POSITION_DATA }
