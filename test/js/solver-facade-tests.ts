import valid_display1 from "../valid-test-display-data1.json";
import { UIOptions } from "../../src/js/ui-options";
import { getDisplayManager } from "../../src/js/display-loader";
import { StatusUpdatesManager } from "../../src/js/status-updates-manager";
import { getSolverFacade, AnimatedFacade } from "../../src/js/solver-facade";
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
        solveAlgorithm: "NoMatching",
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
            const statusUpdatesList = document.createElement("li");
            const statusUpdates = new StatusUpdatesManager(document, statusUpdatesList);
            const continueButton = document.createElement("button");
            const overlay = document.createElement("div");
            it("should throw an error", function () {
                expect(function () {
                    getSolverFacade(mockUIOptionsError, displayManager, statusUpdates, continueButton, overlay);
                }).to.throw(Error, "Invalid solver display option!");
            });
        });

    });

    describe("if #getSolverFacade() is called", function () {

        context("and the animated display option is set", function () {
            const mockUIOptionsError = new MockUIOptions("Animated");
            const document = createDocument();
            const displayManager = getDisplayManager(document.documentElement, valid_display1.testDisplayData);
            const statusUpdatesList = document.createElement("li");
            const statusUpdates = new StatusUpdatesManager(document, statusUpdatesList);
            const continueButton = document.createElement("button");
            const overlay = document.createElement("div");
            const result = getSolverFacade(mockUIOptionsError, displayManager, statusUpdates, continueButton, overlay);
            it("should return an instance of AnimatedFacade", function () {
                expect(result).to.be.an.instanceof(AnimatedFacade);
            });
        });

    });

    describe("if #getSolverFacade() is called", function () {

        context("and the worker option is set", function () {
            // const mockUIOptionsError = new MockUIOptions("Completed");
            // const document = createDocument();
            // const displayManager = getDisplayManager(document.documentElement, valid_display1.testDisplayData);
            // const statusUpdatesList = document.createElement("li");
            // const statusUpdates = new StatusUpdatesManager(document, statusUpdatesList);
            // const continueButton = document.createElement("button");
            // const overlay = document.createElement("div");
            // const result = getSolverFacade(mockUIOptionsError, displayManager, statusUpdates, continueButton, overlay);
            // it("should return an instance of WorkerFacade", function () {
            //     expect(result).to.be.an.instanceof(WorkerFacade);
            // });
        });

    });

});
