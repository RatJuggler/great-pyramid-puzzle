import { TilePositionState } from "../../../src/js/puzzle/tile-position-state";
import { expect } from 'chai';
import 'mocha';
// @ts-ignore
import { TILE_1, TILE_2 } from "../common-test-data";


describe("TilePositionState behaviour", function () {

    describe("when a new TilePositionState is first created", function () {

        context("without setting a Tile", function () {
            const tilePositionState = new TilePositionState();
            it("should return a correctly initialised instance", function () {
                expect(tilePositionState).to.be.an.instanceOf(TilePositionState);
            });
            it("should not be holding a Tile", function () {
                expect(tilePositionState.isEmpty());
            });
            it("should return the correct toString result", function () {
                const expectedToString = "[Empty]";
                expect(tilePositionState.toString()).to.equal(expectedToString);
            });
        });

    });

    describe("if #getTile() is called to get the details of a Tile", function () {

        context("on a TilePositionState which has a Tile in it", function () {
            const tilePositionState = new TilePositionState();
            tilePositionState.tile = TILE_1;
            it("should return the Tile", function () {
                expect(tilePositionState.tile).to.equal(TILE_1);
            });
        });

        context("on a TilePositionState which doesn't have a Tile in it", function () {
            const tilePositionState = new TilePositionState();
            it("should return throw an error", function () {
                expect(function () {
                    tilePositionState.tile;
                }).to.throw(Error, "Can't fetch a Tile from a TilePositionState when there isn't one set!");
            });
        });

    });

    describe("if #isEmpty() is called to test if the TilePositionState already has a Tile", function () {

        context("and the TilePositionState is empty", function () {
            const tilePositionState = new TilePositionState();
            it("should return True", function () {
                expect(tilePositionState.isEmpty()).to.be.true;
            });
        });

        context("and the TilePosition is already occupied by a Tile", function () {
            const tilePositionState = new TilePositionState();
            tilePositionState.tile = TILE_1;
            it("should return False", function () {
                expect(tilePositionState.isEmpty()).to.be.false;
            });
        });

    });

    describe("if #setTile() is called to update the TilePositionState with a Tile", function () {

        context("and the TilePositionState is empty", function () {
            const tilePositionState = new TilePositionState();
            tilePositionState.tile = TILE_1;
            it("should set the Tile", function () {
                expect(tilePositionState.tile).to.equal(TILE_1);
            });
            it("and set the rotation as 0", function () {
                expect(tilePositionState.rotations).to.equal(0);
            })
        });

        context("and the TilePositionState already has a Tile", function () {
            const tilePositionState = new TilePositionState();
            tilePositionState.tile = TILE_1;
            it("should throw an error", function () {
                expect(function () {
                    tilePositionState.tile = TILE_2;
                }).to.throw(Error, "Can't set a Tile when the TilePositionState already has one!");
            });
            it("should not set the new Tile", function () {
                expect(tilePositionState.tile).to.equal(TILE_1);
            });
        });

    });

    describe("if #rotations() is called on a TilePositionState", function () {

        context("and the TilePositionState doesn't have a Tile", function () {
            const tilePositionState = new TilePositionState();
            it("should throw an error", function () {
                expect(function () {
                    tilePositionState.rotations = 1;
                }).to.throw(Error, "No point setting rotations when the TilePositionState doesn't have a Tile!");
            });
            it("should not set the new rotations", function () {
                expect(tilePositionState.rotations).to.equal(0);
            });
        });

        context("with an invalid number of rotations", function () {
            const tilePositionState = new TilePositionState();
            tilePositionState.tile = TILE_1;
            it("should throw an error", function () {
                expect(function () {
                    tilePositionState.rotations = 4;
                }).to.throw(Error, "Tile can only be rotated 0, 1 or 2 times!");
            });
            it("should throw an error", function () {
                expect(function () {
                    tilePositionState.rotations = -3;
                }).to.throw(Error, "Tile can only be rotated 0, 1 or 2 times!");
            });
            it("should throw an error", function () {
                expect(function () {
                    tilePositionState.rotations = 1.5;
                }).to.throw(Error, "Tile can only be rotated 0, 1 or 2 times!");
            });
        });

        context("with a valid number of rotations", function () {
            const tilePositionState = new TilePositionState();
            tilePositionState.tile = TILE_1;
            tilePositionState.rotations = 2;
            it("should set the rotations", function () {
                expect(tilePositionState.rotations).to.equal(2);
            });
        });

    });

    describe("if #rotate() is called on a TilePosition", function () {

        context("and the TilePositionState doesn't have a Tile", function () {
            const tilePositionState = new TilePositionState();
            it("should throw an error", function () {
                expect(function () {
                    tilePositionState.rotate();
                }).to.throw(Error, "No point calling rotate when the TilePositionState doesn't have a Tile!");
            });
            it("should not do a rotation", function () {
                expect(tilePositionState.rotations).to.equal(0);
            });
        });

        context("with a newly placed Tile", function () {
            const tilePositionState = new TilePositionState();
            tilePositionState.tile = TILE_1;
            const result = tilePositionState.rotate();
            it("should return true", function () {
                expect(result).to.be.true;
            });
            it("should track the Tile as being rotated once", function () {
                expect(tilePositionState.rotations).to.equal(1);
            });
        });

        context("and the Tile has already been rotated twice", function () {
            const tilePositionState = new TilePositionState();
            tilePositionState.tile = TILE_1;
            tilePositionState.rotate();
            tilePositionState.rotate();
            const result = tilePositionState.rotate();
            it("should return false", function () {
                expect(result).to.be.false;
            });
            it("should reset the rotation back to 0", function () {
                expect(tilePositionState.rotations).to.equal(0);
            });
        });

    });

    describe("if #removeTile() is called to remove a Tile", function () {

        context("and the TilePosition is empty", function () {
            const tilePositionState = new TilePositionState();
            it("should throw an error", function () {
                expect(function () {
                    tilePositionState.removeTile();
                }).to.throw(Error, "No Tile to remove from the TilePositionState!");
            });
        });

        context("and the TilePosition has a Tile in it", function () {
            const tilePositionState = new TilePositionState();
            tilePositionState.tile = TILE_1;
            const result = tilePositionState.removeTile();
            it("should remove the Tile", function () {
                expect(tilePositionState.isEmpty()).to.be.true;
            });
            it("should return Tile", function () {
                expect(result).to.eql(TILE_1);
            });
        });

    });

});
