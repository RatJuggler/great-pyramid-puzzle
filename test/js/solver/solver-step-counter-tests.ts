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

    describe("if #start() is called", function () {

        context("on a newly created instance", function () {
            const mockStatusUpdates = new MockStatusUpdates();
            const stepCounter = new SolverStepCounter(mockStatusUpdates);
            stepCounter.start();
            it("should set the counter to 0", function () {
                expect(stepCounter.counterForDisplay).to.equal("0");
            });
            it("should create a status update", function () {
                const expectedResult = "Add: solver-step-counter - Step Counter - 0";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

        context("on a instance that has already had it's counter increased", function () {
            const mockStatusUpdates = new MockStatusUpdates();
            const stepCounter = new SolverStepCounter(mockStatusUpdates);
            stepCounter.increase();
            stepCounter.increase();
            stepCounter.increase();
            stepCounter.start();
            it("should set the counter to 0", function () {
                expect(stepCounter.counterForDisplay).to.equal("0");
            });
            it("should create a status update", function () {
                const expectedResult = "Add: solver-step-counter - Step Counter - 0";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

    });

    describe("if #increase() is called", function () {

        context("on a newly created instance", function () {
            const mockStatusUpdates = new MockStatusUpdates();
            const stepCounter = new SolverStepCounter(mockStatusUpdates);
            stepCounter.increase();
            it("should increase the counter to 1", function () {
                expect(stepCounter.counterForDisplay).to.equal("1");
            });
            it("should replace the status update", function () {
                const expectedResult = "Replace: solver-step-counter - 1";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

        context("on a instance that has already had it's counter increased twice", function () {
            const mockStatusUpdates = new MockStatusUpdates();
            const stepCounter = new SolverStepCounter(mockStatusUpdates);
            stepCounter.increase();
            stepCounter.increase();
            stepCounter.increase();
            it("should increase the counter to 3", function () {
                expect(stepCounter.counterForDisplay).to.equal("3");
            });
            it("should replace the status update", function () {
                const expectedResult = "Replace: solver-step-counter - 3";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

    });

    describe("if #setCounter() is called", function () {

        context("on a newly created instance", function () {
            const mockStatusUpdates = new MockStatusUpdates();
            const stepCounter = new SolverStepCounter(mockStatusUpdates);
            stepCounter.counter = 1042;
            it("should set the counter to the value given", function () {
                expect(stepCounter.counterForDisplay).to.equal("1,042");
            });
            it("should replace the status update", function () {
                const expectedResult = "Replace: solver-step-counter - 1,042";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

        context("on a instance that has already had it's counter increased twice", function () {
            const mockStatusUpdates = new MockStatusUpdates();
            const stepCounter = new SolverStepCounter(mockStatusUpdates);
            stepCounter.increase();
            stepCounter.increase();
            stepCounter.counter = 1234567;
            it("should set the counter to the value given", function () {
                expect(stepCounter.counterForDisplay).to.equal("1,234,567");
            });
            it("should replace the status update", function () {
                const expectedResult = "Replace: solver-step-counter - 1,234,567";
                expect(mockStatusUpdates.mockStatus).to.equal(expectedResult);
            });
        });

    });

});
