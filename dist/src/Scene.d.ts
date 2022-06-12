import ImageManager from "./ImageManager";
import LayerManager from "./LayerManager";
import { WithoutFunction } from "./func/calc";
import Transform from "./func/transform";
import TimingDefault from "./Middleware/TimingDefault";
import { OutputInfo } from "./Engine";
import type Engine from "./Engine";
import type { ISprite, ISpriteFunctionOrSprite } from "./Sprites/Sprite";
import type { addPrefix, OrFunction, OrPromise, ValueOf } from "./helper";
import type Camera from "./Middleware/Camera";
import type { CameraPosition } from "./Middleware/Camera";
import type CameraControl from "./Middleware/CameraControl";
import type TimingAudio from "./Middleware/TimingAudio";
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
    parameter: any;
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
export declare type ParameterListClickElement = ParameterListCanvas & ElementClickInfo & ElementPositionInfo;
export declare type ParameterListClickNonElement = ParameterListCanvas & ElementClickInfo & ElementPositionInfo;
export interface ParameterListPositionEvent extends ParameterListWithoutTime {
    event: Event | MouseEvent | TouchEvent;
    position: [number, number];
    x: number;
    y: number;
    button: number;
}
export declare type EventsReturn = (keyof HTMLElementEventMap | [keyof HTMLElementEventMap, (this: HTMLElement, el: ValueOf<HTMLElementEventMap>) => any])[];
export interface ConfigurationObject extends Record<string, any> {
    init?: (params: ParameterListInitDestroy) => OrPromise<void | unknown>;
    destroy?: (params: ParameterListInitDestroy) => OrPromise<void | unknown>;
    enabled?: boolean;
    type?: string;
    images?: OrFunction<string[] | Record<string, string>>;
    endTime?: OrFunction<number>;
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
}
export interface ConfigurationConstructor {
    new (options?: Record<string, any>): ConfigurationObject;
}
export declare type ConfigurationClassOrObject = ConfigurationObject | ConfigurationConstructor;
declare type MiddlewareCommandList<T = ConfigurationObject> = {
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
} & Record<addPrefix<string, 't_'>, T[]>;
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
declare class Scene {
    _layerManager: LayerManager;
    _imageManager: typeof ImageManager;
    _totalTimePassed: number;
    _engine: Engine | undefined;
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
    do<K extends string, D = ConfigurationObject[K], P = Omit<Parameters<ConfigurationObject[K]>[0], keyof ParameterListWithoutTime>, R = D | undefined>(command: K, params: P, defaultValue: D | undefined, func: (ConfigurationObjects: ConfigurationObject[], params: P, defaultValue: D | undefined) => R): D | R | undefined;
    map<K extends string, R = ReturnType<ConfigurationObject[K]>, P = Omit<Parameters<ConfigurationObject[K]>[0], keyof ParameterListWithoutTime>>(command: K, params: P): R[];
    pipe<K extends string, R = ReturnType<ConfigurationObject[K]>, P = Omit<Parameters<ConfigurationObject[K]>[0], keyof ParameterListWithoutTime>>(command: K, params: P, pipe?: R | undefined): R | undefined;
    pipeBack<K extends string, R = ReturnType<ConfigurationObject[K]>, P = Omit<Parameters<ConfigurationObject[K]>[0], keyof ParameterListWithoutTime>>(command: K, params: P, pipe?: R | undefined): R | undefined;
    pipeMax<K extends string, R = ReturnType<ConfigurationObject[K]>, P = Omit<Parameters<ConfigurationObject[K]>[0], keyof ParameterListWithoutTime>>(command: K, params: P, pipe?: R | undefined): number | number[] | undefined;
    pipeAsync<K extends string, R = ReturnType<ConfigurationObject[K]>, P = Omit<Parameters<ConfigurationObject[K]>[0], keyof ParameterList>>(command: K, params: P, pipe?: R | undefined): Promise<R | undefined>;
    value<K extends string, R = ConfigurationObject[K], P = Omit<Parameters<ConfigurationObject[K]>[0], keyof ParameterListWithoutTime>>(command: K, params?: P | undefined): WithoutFunction<R> | undefined;
    stopPropagation(): void;
    currentTime(): any;
    clampTime(timePassed: number): any;
    shiftTime(timePassed: number): any;
    cacheClear(): void;
    viewport(): Transform;
    transformPoint(x: number, y: number, scale?: number): [number, number];
    callInit(parameter: any, engine: Engine): void;
    get additionalModifier(): AdditionalModifier;
    updateAdditionalModifier(): void;
    resize(): void;
    destroy(): Promise<any>;
    get timing(): TimingDefault | TimingAudio;
    get camera(): Camera;
    get control(): CameraControl;
    get totalTimePassed(): number;
    _param<K extends Record<string, any>>(additionalParameter?: K | undefined): ParameterListWithoutTime & K;
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
