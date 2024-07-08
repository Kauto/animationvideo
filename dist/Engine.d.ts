import { default as Scene } from './Scene';

export interface EngineOptions<TRunParameter extends Record<string | symbol, unknown>, TSceneParameter extends Record<string | symbol, unknown>> {
    canvas: HTMLCanvasElement;
    scene?: null | Scene<TRunParameter, TSceneParameter>;
    sceneParameter?: TSceneParameter;
    autoSize?: Partial<AutoSizeSettings> | boolean;
    clickToPlayAudio?: boolean;
    reduceFramerate?: boolean;
}
export interface AutoSizeSettings {
    enabled: boolean;
    scaleLimitMin: number;
    scaleLimitMax: number;
    scaleFactor: number;
    referenceWidth: () => number;
    referenceHeight: () => number;
    currentScale: number;
    waitTime: number;
    currentWaitedTime: number;
    currentOffsetTime: number;
    offsetTimeLimitUp: number;
    offsetTimeLimitDown: number;
    registerResizeEvents: boolean;
    registerVisibilityEvents: boolean;
    setCanvasStyle: boolean;
    offsetTimeTarget?: number;
    offsetTimeDelta?: number;
}
interface EventSafe {
    n: HTMLElement | (Window & typeof globalThis) | Document;
    e: string;
    f: EventListenerOrEventListenerObject;
}
export interface OutputInfo {
    canvas: HTMLCanvasElement[];
    context: CanvasRenderingContext2D[];
    width: number;
    height: number;
    ratio: number;
}
declare class Engine<TRunParameter extends Record<string | symbol, unknown> = Record<string | symbol, unknown>, TSceneParameter extends Record<string | symbol, unknown> = Record<string | symbol, unknown>> {
    _output: OutputInfo;
    _events: EventSafe[];
    _scene: null | Scene | undefined;
    _newScene: undefined | null | Scene<TRunParameter, TSceneParameter>;
    _sceneParameter: TSceneParameter | undefined;
    _isSceneInitialized: boolean;
    _recalculateCanvasIntend: boolean;
    _lastTimestamp: number;
    _referenceRequestAnimationFrame: number | undefined;
    _autoSize: undefined | AutoSizeSettings;
    _canvasCount: number;
    _drawFrame: number[];
    _reduceFramerate: boolean;
    _realLastTimestamp: number | undefined;
    _isOddFrame: boolean;
    _initializedStartTime: number | undefined;
    _promiseSceneDestroying: Promise<unknown> | undefined;
    _runParameter: TRunParameter | undefined;
    _moveOnce: boolean;
    constructor(canvasOrOptions: HTMLCanvasElement | EngineOptions<TRunParameter, TSceneParameter>);
    handleVisibilityChange(): void;
    playAudioOfScene(): void;
    normContext(ctx: CanvasRenderingContext2D): void;
    getWidth(): number;
    getHeight(): number;
    getRatio(): number;
    getOutput(): OutputInfo;
    recalculateCanvas(): this;
    _recalculateCanvas(): void;
    recalculateFPS(): Promise<void>;
    resize(): this;
    switchScene(scene: Scene<TRunParameter, TSceneParameter> | null | undefined, sceneParameter: TSceneParameter | undefined): this;
    _now(): number;
    _mainLoop(timestamp: number): void;
    run(runParameter?: TRunParameter | undefined): Promise<this>;
    stop(): Promise<void>;
    destroy(): Promise<this>;
}
export default Engine;
