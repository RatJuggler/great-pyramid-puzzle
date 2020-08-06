import { SolverStepCounter } from "../../../src/js/solver/solver-step-counter";
import { StatusUpdates } from "../../../src/js/status-updates-manager";
import { expect } from 'chai';
import 'mocha';


class MockStatusUpdates implements StatusUpdates {

    private _mockStatus: string = "";

    get mockStatus(): string {
        return this._mockStatus;
    }

    add(id: string, title: string, status: string): void {
        this._mockStatus = `Add: ${id} - ${title} - ${status}`;
    }

    addTo(_id: string, _status: string): void {
        throw new Error("Not expected to be called as part of these tests!");
    }

    clear(): void {
        throw new Error("Not expected to be called as part of these tests!");
    }

    replace(id: string, status: string): void {
        this._mockStatus = `Replace: ${id} - ${status}`;
    }

}


describe("SolverStepCounter behaviour", function () {

    let mockStatusUpdates: MockStatusUpdates;
    let stepCounter: SolverStepCounter;

    beforeEach(function () {
        mockStatusUpdates = new MockStatusUpdates();
        stepCounter = new SolverStepCounter(mockStatusUpdates);
    });

    describe("if #start() is called", function () {

        context("on a newly created instance", function () {
            it("should set the counter to 0 and create a status update", function () {
                stepCounter.start();
                expect(stepCounter.counterForDisplay).to.equal("0");
                const expectedResult = "Add: solver-step-counter - Step Counter - 0";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

        context("on a instance that has already had it's counter increased", function () {
            it("should set the counter to 0 and create a status update", function () {
                stepCounter.increase();
                stepCounter.increase();
                stepCounter.increase();
                stepCounter.start();
                expect(stepCounter.counterForDisplay).to.equal("0");
                const expectedResult = "Add: solver-step-counter - Step Counter - 0";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

    });

    describe("if #increase() is called", function () {

        context("on a newly created instance", function () {
            it("should increase the counter to 1 and replace the status update", function () {
                stepCounter.increase();
                expect(stepCounter.counterForDisplay).to.equal("1");
                const expectedResult = "Replace: solver-step-counter - 1";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

        context("on a instance that has already had it's counter increased twice", function () {
            it("should increase the counter to 3 and replace the status update", function () {
                stepCounter.increase();
                stepCounter.increase();
                stepCounter.increase();
                expect(stepCounter.counterForDisplay).to.equal("3");
                const expectedResult = "Replace: solver-step-counter - 3";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

    });

    describe("if #setCounter() is called", function () {

        context("on a newly created instance", function () {
            it("should set the counter to the value given and replace the status update", function () {
                stepCounter.counter = 1042;
                expect(stepCounter.counterForDisplay).to.equal("1,042");
                const expectedResult = "Replace: solver-step-counter - 1,042";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

        context("on a instance that has already had it's counter increased twice", function () {
            it("should set the counter to the value given and replace the status update", function () {
                stepCounter.increase();
                stepCounter.increase();
                stepCounter.counter = 1234567;
                expect(stepCounter.counterForDisplay).to.equal("1,234,567");
                const expectedResult = "Replace: solver-step-counter - 1,234,567";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

    });

});
