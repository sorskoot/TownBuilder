import { Component } from '@wonderlandengine/api';
/**
 * Variables
 */
declare let _audioContext: AudioContext;
export { _audioContext };
/**
 * Unlocks the WebAudio AudioContext.
 *
 * @returns a promise that fulfills when the audioContext resumes.
 * @remarks WebAudio AudioContext only resumes on user interaction.
 * @warning This is for internal use only, use at own risk!
 */
export declare function _unlockAudioContext(): Promise<void>;
/**
 * Represents a Wonderland audio listener component.
 * Updates the position and orientation of a WebAudio listener instance.
 *
 * @remarks Only one listener should be active at a time.
 */
export declare class AudioListener extends Component {
    static TypeName: string;
    static Properties: {};
    /**
     * The WebAudio listener instance associated with this component.
     */
    private readonly listener;
    /**
     * The time in which the last position update will be done.
     */
    private time;
    start(): void;
    _updateDeprecated(): void;
    _updateRecommended(): void;
}
