import { default as ImageManager } from './ImageManager';
import { default as LayerManager } from './LayerManager';
import { WithoutFunction } from './func/calc';
import { default as Transform } from './func/transform';
import { default as TimingDefault } from './Middleware/TimingDefault';
import { OutputInfo, default as Engine } from './Engine';
import { ISprite, ISpriteFunctionOrSprite } from './Sprites/Sprite';
import { addPrefix, OrFunction, OrPromise, ValueOf } from './helper';
import { default as Camera, CameraPosition } from './Middleware/Camera';
import { default as CameraControl } from './Middleware/CameraControl';
import { default as TimingAudio } from './Middleware/TimingAudio';

type PickMatching<T, V> = {
    [K in keyof T as T[K] extends V ? K : never]: T[K];
};
type ExtractMethods<T> = PickMatching<T, Function | undefined>;
export interface RectPosition {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export interface ParameterListWithoutTime {
    engine: Engine;
    scene: Scene;
    imageManager: typeof ImageManager;
    layerManager: LayerManager;
    totalTimePassed: number;
    output: OutputInfo;
}
export interface ParameterList extends ParameterListWithoutTime {
    timePassed: number;
}
export interface ParameterListFixedUpdate extends ParameterList {
    lastCall: boolean;
}
export interface ParameterListCanvas extends ParameterListWithoutTime {
    canvasId: undefined | number;
}
export interface ParameterListLoading extends ParameterList {
    timePassed: number;
    totalTimePassed: number;
    progress: string | number;
}
export interface ParameterListInitDestroy extends ParameterList {
    parameter: unknown;
}
export interface ElementClickInfo {
    layerId: number;
    element: ISprite;
    elementId: number;
}
export interface ElementPositionInfo {
    mx: number;
    my: number;
    x: number;
    y: number;
}
export type ParameterListClickElement = ParameterListCanvas & ElementClickInfo & ElementPositionInfo;
export type ParameterListClickNonElement = ParameterListCanvas & ElementClickInfo & ElementPositionInfo;
export interface ParameterListPositionEvent extends ParameterListWithoutTime {
    event: Event | MouseEvent | TouchEvent;
    position: [number, number];
    x: number;
    y: number;
    button: number;
}
export interface ParameterListRegion extends ParameterListWithoutTime {
    event: Event | MouseEvent | TouchEvent;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}
export type EventsReturn = (keyof HTMLElementEventMap | [
    keyof HTMLElementEventMap,
    (this: HTMLElement, el: ValueOf<HTMLElementEventMap>) => unknown
])[];
export interface ConfigurationObject {
    init?: (params: ParameterListInitDestroy) => OrPromise<void | unknown>;
    destroy?: (params: ParameterListInitDestroy) => OrPromise<void | unknown>;
    enabled?: boolean;
    type?: string;
    images?: OrFunction<string[] | Record<string, string>>;
    endTime?: OrFunction<number>;
    end?: (params: ParameterList) => number;
    loading?: (params: ParameterListLoading) => void;
    viewport?: (params: ParameterListWithoutTime, matrix: Transform) => Transform;
    currentTime?: (params: ParameterListWithoutTime) => number;
    clampTime?: (params: ParameterList) => number;
    shiftTime?: (params: ParameterList) => number;
    isDrawFrame?: (params: ParameterList) => number | number[];
    isChunked?: OrFunction<boolean>;
    additionalModifier?: (params: ParameterListWithoutTime, additionalModifier: AdditionalModifier) => AdditionalModifier;
    calcFrames?: OrFunction<number, [ParameterList]>;
    tickChunk?: OrFunction<number, [ParameterListWithoutTime]>;
    fixedUpdate?: (params: ParameterListFixedUpdate) => void;
    draw?: (params: ParameterListCanvas) => void;
    update?: (params: ParameterList) => void;
    resize?: (params: ParameterList) => void;
    reset?: (params: ParameterListWithoutTime, layerManager: LayerManager | ISpriteFunctionOrSprite[][]) => LayerManager | ISpriteFunctionOrSprite[][];
    preventDefault?: OrFunction<boolean>;
    events?: OrFunction<EventsReturn, [ParameterListInitDestroy]>;
    initSprites?: (params: ParameterListCanvas) => void;
    doubleClickElement?: (params: ParameterListClickElement) => void;
    clickElement?: (params: ParameterListClickElement) => void;
    hoverElement?: (params: ParameterListClickElement) => void;
    doubleClickNonElement?: (params: ParameterListClickNonElement) => void;
    clickNonElement?: (params: ParameterListClickNonElement) => void;
    hoverNonElement?: (params: ParameterListClickNonElement) => void;
    mouseDown?: (params: ParameterListPositionEvent) => void;
    mouseUp?: (params: ParameterListPositionEvent) => void;
    mouseOut?: (params: ParameterListPositionEvent) => void;
    mouseMove?: (params: ParameterListPositionEvent) => void;
    mouseWheel?: (params: ParameterListPositionEvent) => void;
    doubleClick?: (params: ParameterListPositionEvent) => void;
    click?: (params: ParameterListPositionEvent) => void;
    regionMove?: (params: ParameterListRegion) => void;
    region?: (params: ParameterListRegion) => void;
}
export interface ConfigurationConstructor {
    new (options?: Record<string, unknown>): ConfigurationObject;
}
export type ConfigurationClassOrObject = ConfigurationObject | ConfigurationConstructor;
type MiddlewareCommandList<T = ConfigurationObject> = {
    _all: T[];
    init: T[];
    isDrawFrame: T[];
    initSprites: T[];
    fixedUpdate: T[];
    update: T[];
    draw: T[];
    destroy: T[];
    reset: T[];
    resize: T[];
    currentTime: T[];
    clampTime: T[];
    shiftTime: T[];
    isChunked: T[];
    hasOneChunkedFrame: T[];
    calcFrames: T[];
    tickChunk: T[];
    additionalModifier: T[];
} & Record<addPrefix<string, "t_">, T[]>;
export interface AdditionalModifier {
    alpha: number;
    x: number;
    y: number;
    width: number;
    height: number;
    widthInPixel: number;
    heightInPixel: number;
    scaleCanvas: number;
    visibleScreen: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    fullScreen: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    cam?: CameraPosition;
    radius?: number;
}
declare class Scene<TRunParameter extends Record<string | symbol, unknown> = Record<string | symbol, unknown>, TSceneParameter extends Record<string | symbol, unknown> = Record<string | symbol, unknown>> {
    _layerManager: LayerManager;
    _imageManager: typeof ImageManager;
    _totalTimePassed: number;
    _engine: Engine<TRunParameter, TSceneParameter> | undefined;
    _middleware: MiddlewareCommandList<ConfigurationObject>;
    _stopPropagation: boolean;
    _transform: Transform | undefined;
    _transformInvert: Transform | undefined;
    _additionalModifier: AdditionalModifier | undefined;
    _initDone: boolean;
    _endTime: number | undefined;
    _resetIntend: boolean;
    constructor(...configurationClassOrObjects: ConfigurationClassOrObject[]);
    _output(): OutputInfo | undefined;
    set middlewares(middlewares: ConfigurationClassOrObject | ConfigurationClassOrObject[]);
    get middlewares(): ConfigurationClassOrObject | ConfigurationClassOrObject[];
    middlewareByType(type: string): ConfigurationObject | undefined;
    has(command: string): boolean;
    do<OBJ extends ConfigurationObject = ConfigurationObject, K extends keyof ExtractMethods<OBJ> = keyof ExtractMethods<OBJ>, D = OBJ[K], P = Omit<OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : undefined, keyof ParameterListWithoutTime> | undefined, R = D | undefined>(command: K, params: P, defaultValue: D | undefined, func: (ConfigurationObjects: OBJ[], params: ParameterListWithoutTime & P, defaultValue: D | undefined) => R): D | R | undefined;
    map<OBJ extends ConfigurationObject = ConfigurationObject, K extends keyof ExtractMethods<OBJ> = keyof ExtractMethods<OBJ>, R = OBJ[K] extends (...args: any[]) => any ? ReturnType<OBJ[K]> : OBJ[K], P = Omit<OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : OBJ[K], keyof ParameterListWithoutTime>>(command: K, params: P): R[];
    pipe<OBJ extends ConfigurationObject, K extends keyof ExtractMethods<OBJ>, R = OBJ[K] extends (...args: any[]) => any ? ReturnType<OBJ[K]> : OBJ[K], P extends Record<string, unknown> = Omit<OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : undefined, keyof ParameterListWithoutTime>>(command: K, params: P, pipe?: R | undefined): R | undefined;
    pipeBack<OBJ extends ConfigurationObject, K extends keyof ExtractMethods<OBJ>, R = OBJ[K] extends (...args: any[]) => any ? ReturnType<OBJ[K]> : OBJ[K], P extends Record<string, unknown> = Omit<OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : undefined, keyof ParameterListWithoutTime>>(command: K, params: P, pipe?: R | undefined): R | undefined;
    pipeMax<OBJ extends ConfigurationObject, K extends keyof ExtractMethods<OBJ>, R = OBJ[K] extends (...args: any[]) => any ? ReturnType<OBJ[K]> : OBJ[K], P = Omit<OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : undefined, keyof ParameterListWithoutTime>>(command: K, params: P, pipe?: R | undefined): number | number[] | undefined;
    pipeAsync<OBJ extends ConfigurationObject, K extends keyof ExtractMethods<OBJ>, R = OBJ[K] extends (...args: any[]) => any ? ReturnType<OBJ[K]> : OBJ[K], P = Omit<OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : undefined, keyof ParameterListWithoutTime>>(command: K, params: P, pipe?: R | undefined): Promise<R | undefined>;
    value<OBJ = ConfigurationObject, K extends keyof OBJ = keyof OBJ, R = OBJ[K] extends (...args: any[]) => any ? ReturnType<OBJ[K]> : OBJ[K], P = Omit<OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : undefined, keyof ParameterListWithoutTime>>(command: K, params?: P | undefined): WithoutFunction<R> | undefined;
    stopPropagation(): void;
    currentTime(): number;
    clampTime(timePassed: number): number;
    shiftTime(timePassed: number): number;
    cacheClear(): void;
    viewport(): Transform;
    transformPoint(x: number, y: number, scale?: number): [number, number];
    callInit(parameter: unknown, engine: Engine<TRunParameter, TSceneParameter>): void;
    get additionalModifier(): AdditionalModifier;
    updateAdditionalModifier(): void;
    resize(): void;
    destroy(): Promise<((params: ParameterListInitDestroy) => OrPromise<void | unknown>) | undefined>;
    get timing(): TimingDefault | TimingAudio;
    get camera(): Camera;
    get control(): CameraControl;
    get totalTimePassed(): number;
    _param<K>(additionalParameter?: K | undefined): ParameterListWithoutTime & K;
    callLoading(args: {
        timePassed: number;
        totalTimePassed: number;
    }): boolean;
    fixedUpdate(timePassed: number, lastCall: boolean): void;
    isDrawFrame(timePassed: number): number | number[];
    move(timePassed: number): void;
    draw(canvasId: number): void;
    initSprites(canvasId?: number | undefined): void;
    resetIntend(): void;
    reset(): void;
}
export default Scene;
