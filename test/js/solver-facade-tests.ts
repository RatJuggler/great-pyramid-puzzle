import valid_display1 from "../valid-test-display-data1.json";
import { UIOptions } from "../../src/js/ui-options";
import { getDisplayManager } from "../../src/js/display-loader";
import { getSolverFacade } from "../../src/js/solver-facade";
import { expect } from "chai";
import 'mocha';
// @ts-ignore
import { createSVGWindow } from 'svgdom';
// @ts-ignore
import { registerWindow } from "@svgdotjs/svg.js";


class MockUIOptions implements UIOptions {
    public readonly animationSpeed = 250;
    public readonly solverOptions = {
        puzzleType: "Simple",
        solveAlgorithm: "MoMatching",
        tileSelection: "Random",
        tilePlacement: "Random",
        tileRotation: "Random"
    }
    constructor(public readonly displayOption: string) {}
}

function createDocument(): Document {
    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);
    return document;
}

describe("SolverFacade behaviour", function () {

    describe("if #getSolverFacade() is called", function () {
        context("and an invalid display option is set", function () {
            const mockUIOptionsError = new MockUIOptions("Error");
            const document = createDocument();
            const displayManager = getDisplayManager(document.documentElement, valid_display1.testDisplayData);
            const continueButton = document.createElement("button");
            const overlay = document.createElement("div");
            it("should throw an error", function () {
                expect(function () {
                    getSolverFacade(mockUIOptionsError, displayManager, continueButton, overlay);
                }).to.throw(Error, "Invalid solver display option!");
            });
        });
    });

});
