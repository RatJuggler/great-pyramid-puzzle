import { Tile } from '../../src/js/tile';
import { expect } from 'chai';
import 'mocha';

describe("Tile behaviour", () => {

    describe("a new Tile", () => {

        context("with valid parameters", () => {
            it("should return a correctly initialised instance", () => {
                const segments = "XYZ";
                let tile = new Tile(segments);
                expect(tile.segments).to.equal(segments);
            });
        });

        context("with invalid parameters", () => {
            it("should throw an error", () => {
                const segments = "123";
                expect(() => {
                    new Tile(segments);
                }).to.throw(Error, "Invalid segment combination!");

            });
        });

    });

});
