import type Scene from './Scene';
export interface EngineOptions {
    canvas: HTMLCanvasElement;
    scene?: null | Scene;
    sceneParameter?: Record<any, any>;
    autoSize?: AutoSizeSettings | boolean;
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
    n: HTMLElement | Window & typeof globalThis | Document;
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
declare class Engine {
    _output: OutputInfo;
    _events: EventSafe[];
    _scene: null | Scene | undefined;
    _newScene: undefined | null | Scene;
    _sceneParameter: undefined | Record<any, any>;
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
    _promiseSceneDestroying: Promise<any> | undefined;
    _runParameter: undefined | Record<any, any>;
    _moveOnce: boolean;
    constructor(canvasOrOptions: HTMLCanvasElement | EngineOptions);
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
    switchScene(scene: Scene | null | undefined, sceneParameter?: undefined | Record<any, any>): this;
    _now(): number;
    _mainLoop(timestamp: number): void;
    run(runParameter: Record<any, any>): Promise<this>;
    stop(): Promise<void>;
    destroy(): Promise<this>;
}
export default Engine;
