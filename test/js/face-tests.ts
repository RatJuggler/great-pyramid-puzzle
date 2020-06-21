import { Face } from '../../src/js/face';
import { expect } from 'chai';
import 'mocha';

describe("Face behavior", () => {

    describe("if a new Face", () => {

        context("is created with a valid name and number of tiles", () => {
            it("should return a correctly initialised instance", () => {
                const name = "1";
                const face = new Face(name, 4, []);
                expect(face).to.be.an.instanceOf(Face);
                expect(face.name).to.equal(name);
            });
        });

        context("is created with an invalid name", () => {
            it("should throw an error", () => {
                expect(() => {
                    new Face("Z", 4, []);
                }).to.throw(Error, "Face name must be one of 1,2,3,4!");
            });
        });

        context("is created with an invalid number of tiles", () => {
            it("should throw an error", () => {
                expect(() => {
                    new Face("1", 25, []);
                }).to.throw(Error, "Number of tiles on a Face must be one of 1,4,9!");
            });
        });

    });

    describe("if a Face is joined to another Face", () => {

        context("with valid side names for both Faces", () => {
            it("should be accepted", () => {
                const face1 = new Face("1", 1, []);
                const face2 = new Face("2", 1, []);
                face1.join("A", "B", face2);
            });
        });

        context("where the Faces have differing numbers of tiles", () => {
            it("should throw an error", () => {
                const face1 = new Face("1", 1, []);
                const face2 = new Face("2", 4, []);
                expect(() => {
                    face1.join("A", "B", face2);
                }).to.throw(Error, "Cannot join Faces with different numbers of tiles!");
            });
        });

        context("where the side to join from is invalid", () => {
            it("should throw an error", () => {
                const face1 = new Face("1", 1, []);
                const face2 = new Face("2", 1, []);
                expect(() => {
                    face1.join("7", "A", face2);
                }).to.throw(Error, "Side to join from must be one of A,B,C!");
            });
        });

        context("where the side name to join to is invalid", () => {
            it("should throw an error", () => {
                const face1 = new Face("1", 1, []);
                const face2 = new Face("2", 1, []);
                expect(() => {
                    face1.join("A", "Z", face2);
                }).to.throw(Error, "Side to join to must be one of A,B,C!");
            });
        });

    });

});
