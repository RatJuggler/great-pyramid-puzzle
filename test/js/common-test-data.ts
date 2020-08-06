import valid_layout_data from "./data/valid-test-layout-data1.json";
import valid_tile_data from "./data/valid-test-tile-data1.json";
import invalid_layout_data1 from "./data/invalid-layout-data1.json";
import invalid_layout_data2 from "./data/invalid-layout-data2.json";
import invalid_layout_data3 from "./data/invalid-layout-data3.json";
import invalid_layout_data4 from "./data/invalid-layout-data4.json";
import invalid_layout_data5 from "./data/invalid-layout-data5.json";
import invalid_tile_data from "./data/invalid-tile-data3.json";
import { TileDefinition } from "../../src/js/puzzle/tile-data-schema";
import { TilePositionData } from "../../src/js/puzzle/layout-data-schema";
import { TilePosition } from "../../src/js/puzzle/tile-position";
import { Tile } from "../../src/js/puzzle/tile";
import { PuzzleDataElements } from "../../src/js/common-data-schema";

// See the test puzzle layout diagram for how the tiles fit together.

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
const TILE_3 = new Tile(TILE_3_DATA);

const TILE_4_DATA: TileDefinition = {
    "tile": 104,
    "sideA": "0010",
    "sideB": "0100",
    "sideC": "0101"
};
const TILE_4 = new Tile(TILE_4_DATA);

const ONE_TILE_POSITION_DATA: TilePositionData[]  = [
    {"position": "1", "joins": []}
];

const FOUR_TILE_POSITION_DATA = [
    {"position": "1", "joins": []},
    {"position": "2", "joins": []},
    {"position": "3", "joins": []},
    {"position": "4", "joins": []}
];

const TILE_POSITION_1 = new TilePosition("1", "1");
const ONE_TILE_POSITION = new Map<string, TilePosition>();
ONE_TILE_POSITION.set(TILE_POSITION_1.name, TILE_POSITION_1);

const VALID_TEST_PUZZLE: PuzzleDataElements = {
    layoutData: valid_layout_data.testLayoutData,
    tileData: valid_tile_data.testTileData
}

const INVALID_TEST_PUZZLE_1: PuzzleDataElements = {
    layoutData: invalid_layout_data1.testLayoutData,
    tileData: valid_tile_data.testTileData
}

const INVALID_TEST_PUZZLE_2: PuzzleDataElements = {
    layoutData: invalid_layout_data2.testLayoutData,
    tileData: valid_tile_data.testTileData
}

const INVALID_TEST_PUZZLE_3: PuzzleDataElements = {
    layoutData: invalid_layout_data3.testLayoutData,
    tileData: valid_tile_data.testTileData
}

const INVALID_TEST_PUZZLE_4: PuzzleDataElements = {
    layoutData: invalid_layout_data4.testLayoutData,
    tileData: valid_tile_data.testTileData
}

const INVALID_TEST_PUZZLE_5: PuzzleDataElements = {
    layoutData: invalid_layout_data5.testLayoutData,
    tileData: valid_tile_data.testTileData
}

const INVALID_TEST_PUZZLE_6: PuzzleDataElements = {
    layoutData: valid_layout_data.testLayoutData,
    tileData: invalid_tile_data.testTileData
}

export {
    TILE_1, TILE_1_DATA, TILE_2, TILE_2_DATA, TILE_3, TILE_3_DATA, TILE_4, TILE_4_DATA,
    ONE_TILE_POSITION_DATA, FOUR_TILE_POSITION_DATA,
    ONE_TILE_POSITION,
    VALID_TEST_PUZZLE,
    INVALID_TEST_PUZZLE_1, INVALID_TEST_PUZZLE_2, INVALID_TEST_PUZZLE_3, INVALID_TEST_PUZZLE_4, INVALID_TEST_PUZZLE_5, INVALID_TEST_PUZZLE_6
}
