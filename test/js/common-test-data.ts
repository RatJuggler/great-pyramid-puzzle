import { TileDefinition } from "../../src/js/tile-data-schema";
import { TilePositionData } from "../../src/js/layout-data-schema";
import { Tile } from "../../src/js/tile";


// See the test puzzle layout for how the tiles fit together.

const TILE_1_DATA: TileDefinition = {
    "tile": 101,
    "sideA": "1010",
    "sideB": "0010",
    "sideC": "0010"
};
const TILE_1 = new Tile(TILE_1_DATA);

const TILE_2_DATA: TileDefinition = {
    "tile": 102,
    "sideA": "0100",
    "sideB": "0100",
    "sideC": "1001"
};
const TILE_2 = new Tile(TILE_2_DATA);

const TILE_3_DATA: TileDefinition = {
    "tile": 103,
    "sideA": "0101",
    "sideB": "1001",
    "sideC": "1010"
};
const TILE_3 = new Tile(TILE_2_DATA);

const TILE_4_DATA: TileDefinition = {
    "tile": 104,
    "sideA": "0010",
    "sideB": "0100",
    "sideC": "0101"
};
const TILE_4 = new Tile(TILE_2_DATA);

const ONE_TILE_POSITION_DATA: TilePositionData[]  = [
    {"position": "1", "joins": []}
];

const FOUR_TILE_POSITION_DATA = [
    {"position": "1", "joins": []},
    {"position": "2", "joins": []},
    {"position": "3", "joins": []},
    {"position": "4", "joins": []}
];


export { TILE_1, TILE_1_DATA, TILE_2, TILE_2_DATA, TILE_3, TILE_3_DATA, TILE_4, TILE_4_DATA, ONE_TILE_POSITION_DATA, FOUR_TILE_POSITION_DATA }
