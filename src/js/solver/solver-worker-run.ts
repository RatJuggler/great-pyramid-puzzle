import { WorkerParameters, WorkerResult } from "../common-data-schema";
import { solverWorker } from "./solver-worker";


onmessage = function (e: MessageEvent) {
    // Extract the parameters from the message.
    const parameters = <WorkerParameters> e.data;
    // Call the actual worker then post the result back.
    const result: WorkerResult = solverWorker(parameters);
    // @ts-ignore
    postMessage(result);
}
