import { Component, Object3D, Emitter } from '@wonderlandengine/api';
/**
 * Dynamically load and map input profiles for XR controllers.
 */
export declare class InputProfile extends Component {
    static TypeName: string;
    /**
     * A cache to store loaded profiles for reuse.
     */
    static Cache: Map<string, any>;
    private _gamepadObjects;
    private _controllerModel;
    private _defaultControllerComponents;
    private _handedness;
    private _profileJSON;
    private _buttons;
    private _axes;
    /**
     * The XR gamepad associated with the current input source.
     */
    gamepad: Gamepad | undefined;
    /**
     * A reference to the emitter which triggered on model lodaed event.
     */
    onModelLoaded: Emitter;
    /**
     * Returns url of input profile json file
     */
    url: string;
    /**
     * A set of components to filter during component retrieval.
     */
    toFilter: Set<string>;
    /**
     * The index representing the handedness of the controller (0 for left, 1 for right).
     */
    handedness: number;
    /**
     * The base path where XR input profiles are stored.
     */
    defaultBasePath: string;
    /**
     * An optional folder path for loading custom XR input profiles.
     */
    customBasePath: string;
    /**
     * The default 3D controller model used when a custom model fails to load.
     */
    defaultController: Object3D;
    /**
     * The object which has HandTracking component added to it.
     */
    trackedHand: Object3D;
    /**
     * If true, the input profile will be mapped to the default controller, and no dynamic 3D model of controller will be loaded.
     */
    mapToDefaultController: boolean;
    /**
     * If true, adds a VR mode switch component to the loaded controller model.
     */
    addVrModeSwitch: boolean;
    onActivate(): void;
    onDeactivate(): void;
    /**
     * Sets newly loaded controllers for the HandTracking component to proper switching.
     * @param controllerObject The controller object.
     * @hidden
     */
    private _setHandTrackingControllers;
    /**
     * Retrieves all components from the specified object and its children.
     * @param obj The object to retrieve components from.
     * @return An array of components.
     * @hidden
     */
    private _getComponents;
    /**
     * Activates or deactivates components based on the specified boolean value.
     * @param active If true, components are set to active; otherwise, they are set to inactive.
     * @hidden
     */
    private _setComponentsActive;
    /**
     * Event handler triggered when XR input sources change.
     * Detects new XR input sources and initiates the loading of input profiles.
     * @param event The XR input source change event.
     * @hidden
     */
    private _onInputSourcesChange;
    /**
     * Checks if the 3D controller model is loaded.
     * @return True if the model is loaded; otherwise, false.
     * @hidden
     */
    private _isModelLoaded;
    /**
     * Loads the 3D controller model and caches the mapping to the gamepad.
     * @param profile The path to the input profile.
     * @hidden
     */
    private _loadAndMapGamepad;
    /**
     * Caches gamepad objects (buttons, axes) from the loaded input profile.
     * @hidden
     */
    private _cacheGamepadObjectsFromProfile;
    /**
     * Assigns a transformed position and rotation to the target based on minimum and maximum values and a normalized input value.
     * @param target The target object to be transformed.
     * @param min The minimum object providing transformation limits.
     * @param max The maximum object providing transformation limits.
     * @param value The normalized input value.
     * @hidden
     */
    private _assignTransform;
    /**
     * Maps input values (buttons, axes) to the 3D controller model.
     * @hidden
     */
    private _mapGamepadInput;
}
