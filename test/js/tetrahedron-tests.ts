import valid_layout_config1 from "../valid-test-layout-data1.json";
import valid_tiles_config1 from "../valid-test-tile-data1.json";
import invalid_layout_config1 from "../invalid-layout-data1.json";
import invalid_layout_config2 from "../invalid-layout-data2.json";
import { Face } from "../../src/js/face";
import { Tetrahedron } from '../../src/js/tetrahedron';
import { TilePool } from "../../src/js/tile-pool";
import { TilePosition } from "../../src/js/tile-position";
import { assert, expect } from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1, TILE_2 } from "./common-test-data";


describe("Tetrahedron behaviour", function () {

    const validLayoutData = valid_layout_config1.testLayoutData;
    const validTileData = valid_tiles_config1.testTileData;

    describe("if a new Tetrahedron is created", function () {

        context("with valid layout configuration file 1", function () {
            const tetrahedron =
                new Tetrahedron(validLayoutData.puzzle, validLayoutData.numberOfTilesPerFace, validLayoutData.faces);
            it("should return a correctly initialised instance", function () {
                expect(tetrahedron).to.be.an.instanceOf(Tetrahedron);
            });
            it("should have set the puzzle instance name", function () {
                expect(tetrahedron.name).to.equal("test-valid");
            })
            it("should return the correct toString result", function () {
                const expectedToString = "Puzzle Type: test-valid\n" +
                    "Face: 1, Tile Positions: 1, Joins: (1-A->3-B)(1-B->4-B)(1-C->2-B)\n" +
                    "TilePosition: 1, On Face: 1, Contains Tile: [null], Joins: (1-A->3-1-B)(1-B->4-1-B)(1-C->2-1-B)\n" +
                    "Face: 2, Tile Positions: 1, Joins: (2-A->3-C)(2-B->1-C)(2-C->4-A)\n" +
                    "TilePosition: 1, On Face: 2, Contains Tile: [null], Joins: (1-A->3-1-C)(1-B->1-1-C)(1-C->4-1-A)\n" +
                    "Face: 3, Tile Positions: 1, Joins: (3-A->4-C)(3-B->1-A)(3-C->2-A)\n" +
                    "TilePosition: 1, On Face: 3, Contains Tile: [null], Joins: (1-A->4-1-C)(1-B->1-1-A)(1-C->2-1-A)\n" +
                    "Face: 4, Tile Positions: 1, Joins: (4-A->2-C)(4-B->1-B)(4-C->3-A)\n" +
                    "TilePosition: 1, On Face: 4, Contains Tile: [null], Joins: (1-A->2-1-C)(1-B->1-1-B)(1-C->3-1-A)\n";
                expect(tetrahedron.toString()).to.equal(expectedToString);
            });
            it("should pass the integrity check", function () {
                expect(tetrahedron.integrityCheck()).to.be.true;
            });
        });

        context("with invalid layout configuration file 1", function () {
            it("should throw an error", function () {
                const puzzleData = invalid_layout_config1.testLayoutData;
                expect(function () {
                    new Tetrahedron(puzzleData.puzzle, puzzleData.numberOfTilesPerFace, puzzleData.faces);
                }).to.throw(Error, "Tetrahedron must always have configuration data for 4 Faces!");
            });
        });

        context("with invalid layout configuration file 2", function () {
            const puzzleData = invalid_layout_config2.testLayoutData;
            const tetrahedron = new Tetrahedron(puzzleData.puzzle, puzzleData.numberOfTilesPerFace, puzzleData.faces);
            it("should fail the integrity check", function () {
                expect(tetrahedron.integrityCheck()).to.be.false;
            });
        });

    });

    describe("if #getFace() is called with the name of a Face on the Tetrahedron", function () {

        context("when there is a Face with the given name already on the Tetrahedron", function () {
            it("should return the Face details", function () {
                const tetrahedron =
                    new Tetrahedron(validLayoutData.puzzle, validLayoutData.numberOfTilesPerFace, validLayoutData.faces);
                const face = tetrahedron.getFace("3");
                expect(face).to.be.an.instanceOf(Face);
                const expectedToString =
                    "Face: 3, Tile Positions: 1, Joins: (3-A->4-C)(3-B->1-A)(3-C->2-A)\n" +
                    "TilePosition: 1, On Face: 3, Contains Tile: [null], Joins: (1-A->4-1-C)(1-B->1-1-A)(1-C->2-1-A)\n";
                expect(face.toString()).to.equal(expectedToString);
            });
        });

        context("when there isn't a Face with the given name on the Tetrahedron", function () {
            it("should throw an error", function () {
                const tetrahedron =
                    new Tetrahedron(validLayoutData.puzzle, validLayoutData.numberOfTilesPerFace, validLayoutData.faces);
                expect(function () {
                    tetrahedron.getFace("A");
                }).to.throw(Error, "Face (A) not found on Tetrahedron!");
            });
        });

    });

    describe("if #placeTileRandomly() is called to place a Tile (without using matching)", function () {

        context("and the Tetrahedron has no Tiles on it", function () {
            const tetrahedron =
                new Tetrahedron(validLayoutData.puzzle, validLayoutData.numberOfTilesPerFace, validLayoutData.faces);
            const result = tetrahedron.placeTileRandomly(TILE_1);
            it("should place the Tile in a random empty Position on a random Face", function () {
                expect(tetrahedron.toString()).to.contain(TILE_1.toString());
            });
            it("should not return null", function () {
                expect(result).to.not.be.null;
            });
            it("should return the updated Position", function () {
                expect(result).to.be.an.instanceOf(TilePosition);
                expect(result!.tile).to.equal(TILE_1);
            });
        });

        context("and the Tetrahedron already has Tiles on it", function () {
            const tetrahedron =
                new Tetrahedron(validLayoutData.puzzle, validLayoutData.numberOfTilesPerFace, validLayoutData.faces);
            assert.isNotNull(tetrahedron.placeTileRandomly(TILE_1));
            const result = tetrahedron.placeTileRandomly(TILE_2);
            it("should place the Tile in a random empty Position on a random Face", function () {
                expect(tetrahedron.toString()).to.contain(TILE_2.toString());
            });
            it("should not return null", function () {
                expect(result).to.not.be.null;
            });
            it("should return the updated Position", function () {
                expect(result).to.be.an.instanceOf(TilePosition);
                expect(result!.tile).to.equal(TILE_2);
            });
        });

        context("and the Tetrahedron has no remaining empty positions", function () {
            const tetrahedron =
                new Tetrahedron(validLayoutData.puzzle, validLayoutData.numberOfTilesPerFace, validLayoutData.faces);
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            let tile = tilePool.randomTile;
            while (tile) {
                assert.isNotNull(tetrahedron.placeTileRandomly(tile));
                tile = tilePool.randomTile;
            }
            const result = tetrahedron.placeTileRandomly(TILE_1);
            it("should not be placed", function () {
                expect(tetrahedron.toString()).to.not.contain(TILE_1.toString());
            });
            it("should return null", function () {
                expect(result).to.be.null;
            });
        });

    });

    describe("if #placeTileSequentially() is called to place a Tile (without using matching)", function () {

        context("and the Tetrahedron has no Tiles on it", function () {
            const tetrahedron =
                new Tetrahedron(validLayoutData.puzzle, validLayoutData.numberOfTilesPerFace, validLayoutData.faces);
            const result = tetrahedron.placeTileSequentially(TILE_1);
            it("should place the Tile on Face 1 at Position 1", function () {
                expect(tetrahedron.getFace("1").getTileAtPosition("1")).to.equal(TILE_1);
            });
            it("should not return null", function () {
                expect(result).to.not.be.null;
            });
            it("should return the updated Position", function () {
                expect(result).to.be.an.instanceOf(TilePosition);
                expect(result!.tile).to.equal(TILE_1);
            });
        });

        context("and the Tetrahedron already has Tiles on it", function () {
            const tetrahedron =
                new Tetrahedron(validLayoutData.puzzle, validLayoutData.numberOfTilesPerFace, validLayoutData.faces);
            assert.isNotNull(tetrahedron.placeTileSequentially(TILE_1));
            const result = tetrahedron.placeTileSequentially(TILE_2);
            it("should place the Tile at the next sequentially free position", function () {
                expect(tetrahedron.getFace("2").getTileAtPosition("1")).to.equal(TILE_2);
            });
            it("should not return null", function () {
                expect(result).to.not.be.null;
            });
            it("should return the updated Position", function () {
                expect(result).to.be.an.instanceOf(TilePosition);
                expect(result!.tile).to.equal(TILE_2);
            });
        });

        context("and the Tetrahedron has no remaining empty positions", function () {
            const tetrahedron =
                new Tetrahedron(validLayoutData.puzzle, validLayoutData.numberOfTilesPerFace, validLayoutData.faces);
            const tilePool = new TilePool(validTileData.totalNumberOfTiles, validTileData.tiles);
            let tile = tilePool.randomTile;
            while (tile) {
                assert.isNotNull(tetrahedron.placeTileSequentially(tile));
                tile = tilePool.randomTile;
            }
            const result = tetrahedron.placeTileSequentially(TILE_1);
            it("should not be placed", function () {
                expect(tetrahedron.toString()).to.not.contain(TILE_1.toString());
            });
            it("should return null", function () {
                expect(result).to.be.null;
            });
        });

    });

});
