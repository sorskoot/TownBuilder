import { AudioChannel, AudioManager, PlayState } from './audio-manager.js';
export declare const MIN_RAMP_TIME: number;
export declare const MIN_VOLUME = 0.001;
export declare const DEF_VOL = 1;
export declare class BufferPlayer {
    playId: number;
    buffer: AudioBuffer;
    looping: boolean;
    position: Float32Array | undefined;
    priority: boolean;
    playOffset: number;
    channel: AudioChannel;
    volume: number;
    oneShot: boolean;
    _gainNode: GainNode;
    _pannerNode: PannerNode;
    _audioNode: AudioBufferSourceNode;
    _pannerOptions: PannerOptions;
    _playState: PlayState;
    _timeStamp: number;
    private readonly _audioManager;
    /**
     * Constructs a BufferPlayer.
     *
     * @warning This is for internal use only. BufferPlayer's should only be created and used inside the AudioManager.
     * @param audioManager Manager that manages this player.
     */
    constructor(audioManager: AudioManager);
    play(): void;
    emitState(): void;
    /**
     * Stops current playback and sends notification on the audio managers emitter.
     */
    stop(): void;
    pause(): void;
    resume(): void;
    _resetWebAudioNodes(): void;
}
