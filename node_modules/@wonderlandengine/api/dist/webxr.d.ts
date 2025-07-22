/// <reference types="webxr" />
import { Emitter } from './utils/event.js';
import { WonderlandEngine } from './engine.js';
/**
 * Options for {@link LoadRuntimeOptions.xrOfferSession}
 *
 * @since 1.1.5
 */
export interface XROfferSessionOptions {
    /**
     * Mode to offer XR session with. If set to `'auto'`, offers a session
     * with the first supported mode in the following order:
     * - VR
     * - AR
     * - inline
     */
    mode: XRSessionMode | 'auto';
    /** Required features for the offered XR session */
    features: string[];
    /** Optional features for the offered XR session */
    optionalFeatures: string[];
}
/** Properties of a WebXR session */
export declare class XRSessionState {
    #private;
    /** Current WebXR session mode */
    sessionMode: XRSessionMode;
    /** Current WebXR session */
    session: XRSession;
    /** Current WebXR frame */
    frame: XRFrame | null;
    /**
     * Constructor.
     *
     * @param wasm Wasm bridge instance
     * @param mode Current XR session mode
     *
     * @hidden
     */
    constructor(webxr: WebXR, mode: XRSessionMode, session: XRSession);
    /** @overload */
    referenceSpaceForType(type: 'viewer'): XRReferenceSpace;
    /**
     * Get a WebXR reference space of a given reference space type.
     *
     * @param type Type of reference space to get
     * @returns Reference space, or `null` if there's no reference space
     *     of the requested type available
     */
    referenceSpaceForType(type: XRReferenceSpaceType): XRReferenceSpace | null;
    /** Set current reference space type used for retrieving eye, head, hand and joint poses */
    set currentReferenceSpace(refSpace: XRReferenceSpace);
    /** Current reference space type used for retrieving eye, head, hand and joint poses */
    get currentReferenceSpace(): XRReferenceSpace;
    /** Current WebXR reference space type or `null` if not a default reference space */
    get currentReferenceSpaceType(): XRReferenceSpaceType;
    /** Current WebXR base layer  */
    get baseLayer(): XRProjectionLayer | XRWebGLLayer;
    /** Current WebXR framebuffer */
    get framebuffers(): WebGLFramebuffer[];
}
/**
 * WebXR API (internal)
 *
 * @hidden
 */
export declare class WebXR {
    #private;
    readonly engine: WonderlandEngine;
    sessionState: XRSessionState | null;
    colorFormat: number;
    depthFormat: number;
    textureType: XRTextureType;
    /**
     * {@link Emitter} for WebXR session end events.
     */
    readonly onSessionEnd: Emitter<void[]>;
    /**
     * {@link RetainEmitter} for WebXR session start events.
     */
    readonly onSessionStart: Emitter<[XRSession, XRSessionMode]>;
    /**
     * {@link Emitter} notified before the first update and rendering on the first frame of a new XR session.
     */
    readonly onSessionFirstFrame: Emitter<[XRSession, XRSessionMode]>;
    /** Whether AR is supported by the browser. */
    arSupported: boolean;
    /** Whether VR is supported by the browser. */
    vrSupported: boolean;
    /**
     * Current WebXR base layer or `null` if no session active.
     */
    baseLayer: XRProjectionLayer | XRWebGLLayer | null;
    /** WebXR framebuffer scale factor. */
    framebufferScaleFactor: number;
    private _webglBinding;
    private _initXR;
    private _inXR;
    /** WebXR reference spaces. */
    private _refSpaces;
    /** Current WebXR reference space. */
    private _refSpace;
    /** Current WebXR reference space type. */
    private _refSpaceType;
    /**
     * Emscripten WebXR framebuffer(s).
     *
     * @note fbo will not get overwritten if we are rendering to the
     * default framebuffer, e.g., when using WebXR emulator.
     */
    private _fbo;
    private _allowLayers;
    private _requestAnimationFrameId;
    /**
     * Initial WebXR reference space type. See {@link init} for
     * more information.
     */
    private _initialReferenceSpaceType;
    private _tempPosition;
    private _tempRotation;
    private _tempPose;
    /**
     * Constructor.
     *
     * @param engine Engine
     *
     * @hidden
     */
    constructor(engine: WonderlandEngine);
    /**
     * Check whether XR is supported and store the result in {@link arSupported} and {@link vrSupported}
     */
    checkXRSupport(): Promise<boolean>;
    /**
     * Initialize WebXR.
     *
     * @hidden
     */
    init(framebufferScaleFactor: number, offerSessionOptions: XROfferSessionOptions | null): Promise<void>;
    /** Get a WebXR reference space of a given reference space type. */
    referenceSpaceForType(type: XRReferenceSpaceType): XRReferenceSpace | null;
    /** Set current reference space type used for retrieving eye, head, hand and joint poses */
    set currentReferenceSpace(refSpace: XRReferenceSpace);
    /** Current reference space type used for retrieving eye, head, hand and joint poses */
    get currentReferenceSpace(): XRReferenceSpace;
    /** Current WebXR reference space type or `null` if not a default reference space */
    get currentReferenceSpaceType(): XRReferenceSpaceType;
    /** Current WebXR framebuffer */
    get framebuffers(): WebGLFramebuffer[];
    /**
     * Set main/left/right eye view active according to XR mode.
     *
     * If @param inXR is `true`, disables the main view and enables the left and
     * right view. Otherwise, enables the main view and disables the left and
     * right view.
     *
     * @param inXR Whether an XR session is currently active
     */
    updateViewState(inXR: boolean | undefined): void;
    /**
     * Set projection matrix parameters for the webxr session.
     *
     * @param near Distance of near clipping plane
     * @param far Distance of far clipping plane
     */
    updateProjectionParams(near: number | undefined, far: number | undefined): void;
    /**
     * Request an XR session.
     *
     * @note Please use this call instead of directly calling `navigator.xr.requestSession()`.
     * Wonderland Engine requires to be aware that a session is started, and this
     * is done through this call.
     *
     * @param mode The XR mode.
     * @param features An array of required features, e.g., `['local-floor', 'hit-test']`.
     * @param optionalFeatures An array of optional features, e.g., `['bounded-floor', 'depth-sensing']`.
     * @returns A promise resolving with the `XRSession`, a string error message otherwise.
     */
    requestSession(mode: XRSessionMode, features: string[], optionalFeatures?: string[]): Promise<XRSession>;
    /**
     * Offer an XR session.
     *
     * Adds an interactive UI element to the browser interface to start an XR
     * session. Browser support is optional, so it's advised to still allow
     * requesting a session with a UI element on the website itself.
     *
     * @note Please use this call instead of directly calling `navigator.xr.offerSession()`.
     * Wonderland Engine requires to be aware that a session is started, and this
     * is done through this call.
     *
     * @param mode The XR mode.
     * @param features An array of required features, e.g., `['local-floor', 'hit-test']`.
     * @param optionalFeatures An array of optional features, e.g., `['bounded-floor', 'depth-sensing']`.
     * @returns A promise resolving with the `XRSession`, a string error message otherwise.
     *
     * @since 1.1.5
     */
    offerSession(mode: XRSessionMode, features: string[], optionalFeatures?: string[]): Promise<XRSession>;
    startSession(session: XRSession, mode: XRSessionMode): Promise<void>;
    sessionOptions(requiredFeatures: string[], optionalFeatures?: string[]): XRSessionInit;
    endSession(): void;
    nextFrame(time: number, frame: XRFrame): void;
    nextFrameSingle(time: number, frame: XRFrame): void;
    nextFrameLayers(time: number, frame: XRFrame): void;
    private _updateInputComponent;
}
