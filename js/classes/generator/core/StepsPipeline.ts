import {
    BaseStepExec,
    StepParameters,
    StepContext,
    StepResult,
    NoStepInput,
    StepInput,
    CompletionResult,
    NoStepParameters,
} from './Steps.js';

export interface StepExecutionRecord {
    stepName: string;
    parameters: StepParameters;
    result: StepResult;
    executionTime: number;
    timestamp: Date;
}

/**
 * Represents a pipeline that executes a series of steps in a specific order.
 * @template T The base type of the steps that this pipeline can execute.
 */
export class StepsPipeline<T extends BaseStepExec> {
    private _steps: {
        step: T;
        parameters: StepParameters;
    }[] = [];

    private _executionHistory: StepExecutionRecord[] = [];
    private _lastExecutionTime: number = 0;

    /**
     * Adds a step to the pipeline along with its parameters.
     * @param step The step instance to add.
     * @param parameters The parameters for the step.
     */
    public addStep(step: T, parameters: Readonly<StepParameters> = new NoStepParameters()): void {
        this._steps.push({ step, parameters: Object.freeze(parameters) });
    }

    /**
     * Gets the complete execution history from the last pipeline run.
     */
    public get executionHistory(): ReadonlyArray<StepExecutionRecord> {
        return this._executionHistory;
    }

    /**
     * Gets the total execution time of the last pipeline run in milliseconds.
     */
    public get lastExecutionTime(): number {
        return this._lastExecutionTime;
    }

    /**
     * Executes all the steps in the pipeline in the order they were added.
     * @param context The shared context for the entire pipeline execution.
     * @returns The result of the final step in the pipeline.
     */
    public execute(context: StepContext): StepResult {
        const pipelineStartTime = performance.now();
        this._executionHistory = [];
        let previousResults: StepResult[] = [];

        for (let i = 0; i < this._steps.length; i++) {
            const stepInfo = this._steps[i];
            const stepName = stepInfo.step.constructor.name;

            const input =
                previousResults.length === 0
                    ? new NoStepInput()
                    : this._createStepInput(previousResults);

            const stepStartTime = performance.now();

            const executionRecord: StepExecutionRecord = {
                stepName: stepName,
                parameters: { ...stepInfo.parameters },
                result: new StepResult(), // Will be updated later
                executionTime: 0, // Will be calculated at the end
                timestamp: new Date(),
            };

            try {
                const currentResult = stepInfo.step.execute(
                    context,
                    input,
                    stepInfo.parameters
                );

                const stepEndTime = performance.now();

                executionRecord.result = currentResult;
                executionRecord.executionTime = stepEndTime - stepStartTime;

                // For the next step, provide all previous results
                previousResults.push(currentResult);

                // If step failed, optionally stop pipeline
                if (currentResult.completionResult === CompletionResult.Failure) {
                    console.error(`Step ${stepName} failed: ${currentResult.error}`);
                    // You might want to stop here or continue based on your needs
                }
            } catch (error) {
                const stepEndTime = performance.now();
                const errorResult = new StepResult();
                errorResult.completionResult = CompletionResult.Failure;
                errorResult.error = error instanceof Error ? error.message : String(error);

                // Update the execution record with the error result
                executionRecord.result = errorResult;
                executionRecord.executionTime = stepEndTime - stepStartTime;

                throw error; // Re-throw to maintain current behavior
            } finally {
                this._executionHistory.push(executionRecord);
            }
        }
        this._lastExecutionTime = performance.now() - pipelineStartTime;

        // Return the last result, or a new empty result if there were no steps.
        return previousResults.length > 0
            ? previousResults[previousResults.length - 1]
            : new StepResult();
    }

    /**
     * Creates a debug report of the last execution.
     */
    public getDebugReport(): string {
        const report: string[] = [];
        report.push(`Pipeline Execution Report`);
        report.push(`Total Execution Time: ${this._lastExecutionTime.toFixed(2)}ms`);
        report.push(`Steps Executed: ${this._executionHistory.length}`);
        report.push('');

        this._executionHistory.forEach((record, index) => {
            report.push(`Step ${index + 1}: ${record.stepName}`);
            report.push(`  Time: ${record.executionTime.toFixed(2)}ms`);
            report.push(`  Status: ${record.result.completionResult}`);
            if (record.result.error) {
                report.push(`  Error: ${record.result.error}`);
            }
            report.push('');
        });

        return report.join('\n');
    }

    /**
     * Gets the result from a specific step by index.
     */
    public getStepResult(stepIndex: number): StepResult | undefined {
        return this._executionHistory[stepIndex]?.result;
    }

    /**
     * Gets the result from a specific step by name.
     */
    public getStepResultByName(stepName: string): StepResult | undefined {
        const record = this._executionHistory.find((r) => r.stepName === stepName);
        return record?.result;
    }

    private _createStepInput(previousResults: StepResult[]): StepInput {
        const input = new StepInput();
        input.incomingResults = previousResults.slice(-1); // only use last result for input
        return input;
    }
}
