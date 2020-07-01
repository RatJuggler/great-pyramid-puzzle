import valid_config1 from "../valid-test-puzzle-data1.json";
import invalid_config1 from "../invalid-face-puzzle-data1.json";
import { Face } from "../../src/js/face";
import { Tetrahedron } from '../../src/js/tetrahedron';
import { TilePool } from "../../src/js/tile-pool";
import { assert, expect } from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1, TILE_2 } from "./common-test-data";


describe("Tetrahedron behaviour", function () {

    const validPuzzleData = valid_config1.testPuzzleData;

    describe("if a new Tetrahedron is created", function () {

        context("with valid configuration data file 1", function () {
            it("should return a correctly initialised instance", function () {
                const tetrahedron =
                    new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
                expect(tetrahedron).to.be.an.instanceOf(Tetrahedron);
                const expectedToString = "Puzzle Type: test-valid\n" +
                    "Face: 1, Tile Positions: 1, Joins: (1-A->3-B)(1-B->4-B)(1-C->2-B)\n" +
                    "TilePosition: 1, Contains Tile: [null], Joins: (1-A->3-1-B)(1-B->4-1-B)(1-C->2-1-B)\n" +
                    "Face: 2, Tile Positions: 1, Joins: (2-A->3-C)(2-B->1-C)(2-C->4-A)\n" +
                    "TilePosition: 1, Contains Tile: [null], Joins: (1-A->3-1-C)(1-B->1-1-C)(1-C->4-1-A)\n" +
                    "Face: 3, Tile Positions: 1, Joins: (3-A->4-C)(3-B->1-A)(3-C->2-A)\n" +
                    "TilePosition: 1, Contains Tile: [null], Joins: (1-A->4-1-C)(1-B->1-1-A)(1-C->2-1-A)\n" +
                    "Face: 4, Tile Positions: 1, Joins: (4-A->2-C)(4-B->1-B)(4-C->3-A)\n" +
                    "TilePosition: 1, Contains Tile: [null], Joins: (1-A->2-1-C)(1-B->1-1-B)(1-C->3-1-A)\n";
                expect(tetrahedron.toString()).to.equal(expectedToString);
            });
        });

        context("with invalid face configuration data file 1", function () {
            it("should throw an error", function () {
                const puzzleData = invalid_config1.testPuzzleData;
                expect(function () {
                    new Tetrahedron(puzzleData.puzzle, puzzleData.numberOfTilesPerFace, puzzleData.faces);
                }).to.throw(Error, "Tetrahedron must always have configuration data for 4 Faces!");
            });
        });

    });

    describe("if #getFace() is called with the name of a Face on the Tetrahedron", function () {

        context("when there is a Face with the given name already on the Tetrahedron", function () {
            it("should return the Face details", function () {
                const tetrahedron =
                    new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
                const face = tetrahedron.getFace("3");
                expect(face).to.be.an.instanceOf(Face);
                const expectedToString =
                    "Face: 3, Tile Positions: 1, Joins: (3-A->4-C)(3-B->1-A)(3-C->2-A)\n" +
                    "TilePosition: 1, Contains Tile: [null], Joins: (1-A->4-1-C)(1-B->1-1-A)(1-C->2-1-A)\n";
                expect(face.toString()).to.equal(expectedToString);
            });
        });

        context("when there isn't a Face with the given name on the Tetrahedron", function () {
            it("should throw an error", function () {
                const tetrahedron =
                    new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
                expect(function () {
                    tetrahedron.getFace("A");
                }).to.throw(Error, "Face (A) not found on Tetrahedron!");
            });
        });

    });

    describe("if #placeTileRandomlyWithoutMatching() is called to place a Tile", function () {

        context("and the Tetrahedron has no Tiles on it", function () {
            const tetrahedron =
                new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
            const result = tetrahedron.placeTileRandomlyWithoutMatching(TILE_1);
            it("should place the Tile in a random empty Position on a random Face", function () {
                expect(tetrahedron.toString()).to.contain(TILE_1.toString());
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Tetrahedron already has Tiles on it", function () {
            const tetrahedron =
                new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
            assert.isTrue(tetrahedron.placeTileRandomlyWithoutMatching(TILE_1));
            const result = tetrahedron.placeTileRandomlyWithoutMatching(TILE_2);
            it("should place the Tile in a random empty Position on a random Face", function () {
                expect(tetrahedron.toString()).to.contain(TILE_2.toString());
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Tetrahedron has no remaining empty positions", function () {
            const tetrahedron =
                new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
            const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
            let tile = tilePool.randomTile;
            while (tile) {
                assert.isTrue(tetrahedron.placeTileRandomlyWithoutMatching(tile));
                tile = tilePool.randomTile;
            }
            const result = tetrahedron.placeTileRandomlyWithoutMatching(TILE_1);
            it("should not be placed", function () {
                expect(tetrahedron.toString()).to.not.contain(TILE_1.toString());
            });
            it("should return False", function () {
                expect(result).to.be.false;
            });
        });

    });

    describe("if #placeTileSequentiallyWithoutMatching() is called to place a Tile", function () {

        context("and the Tetrahedron has no Tiles on it", function () {
            const tetrahedron =
                new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
            const result = tetrahedron.placeTileSequentiallyWithoutMatching(TILE_1);
            it("should place the Tile on Face 1 at Position 1", function () {
                expect(tetrahedron.getFace("1").getTileAtPosition("1")).to.equal(TILE_1);
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Tetrahedron already has Tiles on it", function () {
            const tetrahedron =
                new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
            assert.isTrue(tetrahedron.placeTileSequentiallyWithoutMatching(TILE_1));
            const result = tetrahedron.placeTileSequentiallyWithoutMatching(TILE_2);
            it("should place the Tile at the next sequentially free position", function () {
                expect(tetrahedron.getFace("2").getTileAtPosition("1")).to.equal(TILE_2);
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Tetrahedron has no remaining empty positions", function () {
            const tetrahedron =
                new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
            const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
            let tile = tilePool.randomTile;
            while (tile) {
                assert.isTrue(tetrahedron.placeTileSequentiallyWithoutMatching(tile));
                tile = tilePool.randomTile;
            }
            const result = tetrahedron.placeTileSequentiallyWithoutMatching(TILE_1);
            it("should not be placed", function () {
                expect(tetrahedron.toString()).to.not.contain(TILE_1.toString());
            });
            it("should return False", function () {
                expect(result).to.be.false;
            });
        });

    });

    describe("if #placeTileRandomlyWithMatching() is called to place a Tile", function () {

        context("and the Tetrahedron has no Tiles on it", function () {
            const tetrahedron =
                new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
            const result = tetrahedron.placeTileRandomlyWithMatching(TILE_1);
            it("should place the Tile in a random empty Position on a random Face", function () {
                expect(tetrahedron.toString()).to.contain(TILE_1.toString());
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Tetrahedron already has Tiles on it", function () {
            const tetrahedron =
                new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
            assert.isTrue(tetrahedron.placeTileRandomlyWithMatching(TILE_1));
            const result = tetrahedron.placeTileRandomlyWithMatching(TILE_2);
            it("should place the Tile in a random empty Position on a random Face", function () {
                assert.fail("How to check if random placement works?");
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Tetrahedron has no remaining empty positions", function () {
            const tetrahedron =
                new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
            const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
            let tile = tilePool.randomTile;
            while (tile) {
                assert.isTrue(tetrahedron.placeTileRandomlyWithMatching(tile));
                tile = tilePool.randomTile;
            }
            const result = tetrahedron.placeTileRandomlyWithMatching(TILE_1);
            it("should not be placed", function () {
                expect(tetrahedron.toString()).to.not.contain(TILE_1.toString());
            });
            it("should return False", function () {
                expect(result).to.be.false;
            });
        });

    });

    describe("if #placeTileSequentiallyWithMatching() is called to place a Tile", function () {

        context("and the Tetrahedron has no Tiles on it", function () {
            const tetrahedron =
                new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
            const result = tetrahedron.placeTileSequentiallyWithMatching(TILE_1);
            it("should place the Tile on Face 1 at Position 1", function () {
                expect(tetrahedron.getFace("1").getTileAtPosition("1")).to.equal(TILE_1);
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Tetrahedron already has Tiles on it", function () {
            const tetrahedron =
                new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
            assert.isTrue(tetrahedron.placeTileSequentiallyWithMatching(TILE_1));
            const result = tetrahedron.placeTileSequentiallyWithMatching(TILE_2);
            it("should place the Tile at the next sequentially free position", function () {
                assert.fail("How to check if sequential placement works?");
            });
            it("should return True", function () {
                expect(result).to.be.true;
            });
        });

        context("and the Tetrahedron has no remaining empty positions", function () {
            const tetrahedron =
                new Tetrahedron(validPuzzleData.puzzle, validPuzzleData.numberOfTilesPerFace, validPuzzleData.faces);
            const tilePool = new TilePool(validPuzzleData.totalNumberOfTiles, validPuzzleData.tiles);
            let tile = tilePool.randomTile;
            while (tile) {
                assert.isTrue(tetrahedron.placeTileSequentiallyWithMatching(tile));
                tile = tilePool.randomTile;
            }
            const result = tetrahedron.placeTileSequentiallyWithMatching(TILE_1);
            it("should not be placed", function () {
                expect(tetrahedron.toString()).to.not.contain(TILE_1.toString());
            });
            it("should return False", function () {
                expect(result).to.be.false;
            });
        });

    });

});
