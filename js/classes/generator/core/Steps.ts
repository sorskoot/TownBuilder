import { rng, RNG } from '@sorskoot/wonderland-components';
import { StepState } from './StepState.js';
import { GlobalConfig } from '../../types/GlobalConfig.ts';

/**
 * Represents the base class for a step in a task execution pipeline.
 * @template TInput The type of the input data for the step. Defaults to {@link NoStepInput}.
 * @template TParameters The type of the parameters for the step. Defaults to {@link NoStepParameters}.
 */
export abstract class BaseStepExec<
    TInput extends StepInput = NoStepInput,
    TParameters extends StepParameters = NoStepParameters,
> {
    /**
     * Executes the step with the given context, input, and parameters.
     * @param context - The execution context, shared across all steps.
     * @param input - The specific input data required by this step.
     * @param parameters - The configuration parameters for this step.
     * @returns The result of the step's execution.
     */
    abstract execute(
        context: StepContext,
        input: TInput,
        parameters: TParameters
    ): StepResult;
}
/**
 * Base class for step parameters. Should be extended by specific parameter classes.
 */
export class StepParameters { }
/**
 * Represents the absence of parameters for a step.
 * Use this when a step does not require any configuration.
 */
export class NoStepParameters extends StepParameters { }

/**
 * Represents the possible results of a step execution.
 * - `Success`: The step completed successfully.
 * - `Failure`: The step failed and should not be retried.
 * - `Retry`: The step failed but can be retried, possibly with different parameters.
 */
export enum CompletionResult {
    Success,
    Failure,
    Retry,
}

/**
 * Represents the result of a step execution.
 * Contains the state that can be shared with subsequent steps in the pipeline.
 */
export class StepResult {
    /**
     * The state object that holds shared data between steps.
     * Steps can read from and write to this state, allowing for complex data flow.
     */
    state: StepState = new StepState();

    /**
     * The result of the step execution, indicating whether it was successful, failed, or needs to be retried.
     * @defaultValue {@link CompletionResult.Failure}
     */
    completionResult: CompletionResult = CompletionResult.Failure;

    error?: string;
}

/**
 * The context for a step execution, providing shared resources and utilities.
 * This context is passed to each step in the pipeline, allowing them to access common functionality.
 */
export class StepContext {
    /**
     * The random number generator used for generating random values in the step execution.
     * This allows for reproducible results when the same seed is used.
     * @defaultValue A new RNG instance seeded with the current time.
     */
    random: RNG;


    /**
     * The global configuration object shared across steps.
     * This provides access to various configuration parameters for the pipeline execution.
     */

    public get config(): GlobalConfig {
        return this._config;
    }

    private _config: GlobalConfig;

    constructor(config: Partial<GlobalConfig> = {}, random: RNG = rng) {
        this.random = random;
        this._config = {
            noiseScale: 25,
            noiseOffset: 0,
            heightScale: 4,
            waterLevel: 0.3,
            castleFlattenDistance: 5,

            treeNoiseScale: 5,
            treeNoiseOffset: 0,
            treeThreshold: 0.6,
            treeSparseThreshold: 0.5,

            rockThreshold: 0.3,
            ...config
        };
    }
}
/**
 * Base class for step inputs. Should be extended by specific input classes.
 */
export class StepInput {
    incomingResults: StepResult[] = [];

    cloneInputState() {
        if (this.incomingResults.length == 0) {
            return null;
        }
        if (this.incomingResults[0].state == null) {
            return null;
        }
        return this.incomingResults[0].state.clone();
    }
}
/**
 * Represents the absence of a specific input for a step.
 * Use this when a step does not require any data from a previous step.
 */
export class NoStepInput extends StepInput { }
