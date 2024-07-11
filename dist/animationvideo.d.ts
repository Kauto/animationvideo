import { default as Easing } from 'eases';
import { TinyColor } from '@ctrl/tinycolor';

export declare interface AdditionalModifier {
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

export declare type addPrefix<TKey, TPrefix extends string> = TKey extends string ? `${TPrefix}${TKey}` : never;

export declare const Animations: {
    Callback: typeof Callback_2;
    ChangeTo: typeof ChangeTo;
    End: typeof EndDisabled;
    EndDisabled: typeof EndDisabled_2;
    Forever: typeof Forever;
    If: typeof If;
    Image: typeof Image_3;
    ImageFrame: typeof ImageFrame;
    Loop: typeof Loop;
    Once: typeof Once;
    Remove: typeof Remove;
    Sequence: typeof Sequence;
    Shake: typeof Shake;
    ShowOnce: typeof ShowOnce;
    State: typeof State;
    Stop: typeof End;
    StopDisabled: typeof EndDisabled_3;
    Wait: typeof Wait;
    WaitDisabled: typeof WaitDisabled;
};

export declare type AnimationSequenceOptions = TAnimationSequence | TAnimationSequence[];

export declare interface AutoSizeSettings {
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

export declare class Callback extends SpriteBase<SpriteCallbackOptions, SpriteCallbackOptionsInternal> {
    _timePassed: number;
    constructor(givenParameter: SpriteCallbackOptions | SpriteCallbackOptions["callback"]);
    _getParameterList(): {
        animation: (value: SpriteBaseOptions["animation"], _givenParameter: SpriteCallbackOptions) => Sequence | undefined;
        enabled: boolean;
        isClickable: boolean;
        tag: (value: SpriteBaseOptions["tag"], _givenParameter: SpriteCallbackOptions) => string[];
    } & {
        callback: (v: SpriteCallbackOptions["callback"]) => SpriteCallback;
    };
    animate(timePassed: number): boolean;
    draw(context: CanvasRenderingContext2D, additionalParameter: AdditionalModifier): void;
}

export declare class Callback_2 implements IAnimation {
    _callback: TAnimationCallbackCallback;
    _duration: number | undefined;
    _initialized: boolean;
    constructor(callback: TAnimationCallbackCallback, duration?: number);
    reset(): void;
    run(sprite: ISprite, time: number): number | boolean | SequenceRunCommand;
}

export declare class Camera implements ConfigurationObject {
    type: string;
    cam: CameraPosition;
    constructor(config?: Partial<CameraPosition>);
    viewport(_: ParameterListWithoutTime, matrix: Transform): Transform;
    viewportByCam({ engine }: ParameterListWithoutTime, cam: CameraPosition): Transform;
    additionalModifier(_: ParameterListWithoutTime, additionalModifier: AdditionalModifier): AdditionalModifier;
    clampView(params: ParameterListWithoutTime & {
        clampLimits?: RectPosition;
    }, cam: CameraPosition): CameraPosition;
    set zoom(value: number);
    set camX(v: number);
    set camY(v: number);
    get zoom(): number;
    get camX(): number;
    get camY(): number;
    zoomToFullScreen({ scene }: ParameterListWithoutTime): number;
    zoomTo(params: ParameterListWithoutTime & RectPosition & {
        cam?: CameraPosition;
    }): void;
}

export declare class CameraControl implements ConfigurationObject {
    type: string;
    _mousePos: Record<number, {
        x: number;
        y: number;
        _cx: number;
        _cy: number;
        _isDown: boolean;
        _numOfFingers: number;
        _distance: undefined | number;
        _timestamp: number;
        _czoom: undefined | number;
    }>;
    toCam: CameraPosition;
    _config: MiddlewareCameraControlOptions;
    _scene: Scene | undefined;
    _instant: boolean;
    constructor(config?: Partial<MiddlewareCameraControlOptions>);
    init({ scene }: ParameterListInitDestroy): void;
    mouseDown({ event: e, position: [mx, my], button: i, }: ParameterListPositionEvent): void;
    mouseUp({ event: e, position: [mx, my], button: i, scene, }: ParameterListPositionEvent): void;
    mouseOut({ button: i }: ParameterListPositionEvent): void;
    mouseMove(props: ParameterListPositionEvent): void;
    mouseWheel(props: ParameterListPositionEvent): void;
    hasCamChanged(): boolean;
    fixedUpdate({ scene, lastCall }: ParameterListFixedUpdate): void;
    update({ scene }: ParameterList): void;
    camInstant(): void;
    resize(args: ParameterListWithoutTime & {
        clampLimits?: RectPosition;
    }): void;
    zoomToNorm(): this;
    zoomIn(): this;
    zoomOut(args: ParameterListWithoutTime & {
        clampLimits?: RectPosition;
    }): this;
    zoomTo(params: ParameterListWithoutTime & RectPosition): void;
}

export declare class CameraControlSecondButton extends CameraControl {
    mouseUp({ event: e, position: [mx, my], button: i, scene, }: ParameterListPositionEvent): void;
    mouseMove(props: ParameterListPositionEvent): void;
}

export declare interface CameraPosition {
    zoom: number;
    x: number;
    y: number;
}

export declare class Canvas extends Group<SpriteCanvasOptions, SpriteCanvasOptionsInternal> {
    _currentGridSize: number | undefined;
    _drawFrame: number;
    _temp_canvas: undefined | HTMLCanvasElement;
    _tctx: undefined | CanvasRenderingContext2D;
    constructor(givenParameter: SpriteCanvasOptions);
    _getParameterList(): never;
    _generateTempCanvas(additionalModifier: AdditionalModifier): void;
    _normalizeFullScreen(additionalModifier: AdditionalModifier): void;
    _copyCanvas(additionalModifier: AdditionalModifier): void;
    resize(output: OutputInfo, additionalModifier: AdditionalModifier): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): ISprite | undefined;
    init(_context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}

export declare class ChangeTo implements IAnimation {
    _initialized: boolean;
    _changeValues: IChangeValueMeta[];
    _duration: number;
    _ease: (t: number) => number;
    constructor(changeValues: Record<string, TChangeValue>, duration: number, ease?: (t: number) => number);
    reset(): void;
    _init(sprite: ISprite, _time: number): void;
    run(sprite: ISprite, time: number): number;
}

export declare class Circle extends SpriteBase<SpriteCircleOptions, SpriteCircleOptionsInternal> implements ISprite {
    constructor(givenParameter: SpriteCircleOptions);
    _getParameterList(): TParameterList<SpriteCircleOptions, SpriteCircleOptionsInternal>;
    detect(context: CanvasRenderingContext2D, x: number, y: number): ISprite | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}

export declare class Click implements ConfigurationObject {
    _doubleClickElementTimer: undefined | number;
    _doubleClickDetectInterval: number;
    constructor({ doubleClickDetectInterval, }?: MiddlewareElementOptions);
    mouseUp(param: ParameterListPositionEvent): void;
}

export declare type ConfigurationClassOrObject = ConfigurationObject | ConfigurationConstructor;

export declare interface ConfigurationConstructor {
    new (options?: Record<string, unknown>): ConfigurationObject;
}

export declare interface ConfigurationObject {
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

export { Easing }

export declare class Element_2 implements ConfigurationObject {
    _clickIntend: MousePosition | undefined;
    _hoverIntend: MousePosition | undefined;
    _hasDetectImage: boolean;
    _doubleClickElementTimer: number | undefined;
    _doubleClickDetectInterval: number;
    constructor({ doubleClickDetectInterval, }?: MiddlewareElementOptions);
    isDrawFrame(): 0 | 1;
    _dispatchEvent(scene: Scene, isClick: boolean, param: ParameterListClickElement): void;
    _dispatchNonEvent(scene: Scene, isClick: boolean, param: ParameterListClickNonElement): void;
    initSprites(params: ParameterListCanvas): void;
    draw(params: ParameterListCanvas): void;
    mouseUp({ scene, position: [mx, my], button }: ParameterListPositionEvent): void;
    mouseMove({ scene, position: [mx, my] }: ParameterListPositionEvent): void;
}

export declare interface ElementClickInfo {
    layerId: number;
    element: ISprite;
    elementId: number;
}

export declare interface ElementPositionInfo {
    mx: number;
    my: number;
    x: number;
    y: number;
}

export declare class Emitter<P extends SpriteBaseOptions> extends Group {
    constructor(givenParameter: SpriteEmitterOptions<P>);
}

export declare class End implements IAnimation {
    constructor();
    run(_sprite: ISprite, _time: number): SequenceRunCommand;
}

export declare class EndDisabled implements IAnimation {
    constructor();
    run(_sprite: ISprite, _time: number): SequenceRunCommand;
}

export declare class EndDisabled_2 implements IAnimation {
    constructor();
    run(sprite: ISprite, _time: number): SequenceRunCommand;
}

export declare class EndDisabled_3 implements IAnimation {
    constructor();
    run(sprite: ISprite, _time: number): SequenceRunCommand;
}

export declare class Engine<TRunParameter extends Record<string | symbol, unknown> = Record<string | symbol, unknown>, TSceneParameter extends Record<string | symbol, unknown> = Record<string | symbol, unknown>> {
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

export declare interface EngineOptions<TRunParameter extends Record<string | symbol, unknown>, TSceneParameter extends Record<string | symbol, unknown>> {
    canvas: HTMLCanvasElement;
    scene?: null | Scene<TRunParameter, TSceneParameter>;
    sceneParameter?: TSceneParameter;
    autoSize?: Partial<AutoSizeSettings> | boolean;
    clickToPlayAudio?: boolean;
    reduceFramerate?: boolean;
}

export declare class Events implements ConfigurationObject {
    type: string;
    _reseted: boolean;
    _events: {
        n: HTMLElement;
        e: keyof HTMLElementEventMap;
        f: (this: HTMLElement, el: ValueOf<HTMLElementEventMap>) => unknown;
    }[];
    _pushEvent(command: "mouseDown" | "mouseUp" | "mouseOut" | "mouseMove" | "mouseWheel", event: Event | TouchEvent | MouseEvent, scene: Scene): void;
    events({ scene }: ParameterListWithoutTime): EventsReturn;
    init({ output, scene }: ParameterListInitDestroy): void;
    destroy(): void;
    reset(_params: ParameterListWithoutTime, layerManager: LayerManager | ISpriteFunctionOrSprite[][]): LayerManager | ISpriteFunctionOrSprite[][];
    getMousePosition({ event: e }: {
        event: Event | TouchEvent | MouseEvent;
    }): number[];
    getMouseButton({ event: e }: {
        event: Event | TouchEvent | MouseEvent;
    }): number;
}

export declare interface EventSafe {
    n: HTMLElement | (Window & typeof globalThis) | Document;
    e: string;
    f: EventListenerOrEventListenerObject;
}

export declare type EventsReturn = (keyof HTMLElementEventMap | [
keyof HTMLElementEventMap,
(this: HTMLElement, el: ValueOf<HTMLElementEventMap>) => unknown
])[];

export declare type ExtractMethods<T> = PickMatching<T, Function | undefined>;

export declare class FastBlur<O extends SpriteFastBlurOptions = SpriteFastBlurOptions, P extends SpriteFastBlurOptionsInternal = SpriteFastBlurOptionsInternal> extends SpriteBase<O, P> {
    _temp_canvas: HTMLCanvasElement | undefined;
    _currentGridSize: number | undefined;
    _tctx: CanvasRenderingContext2D | undefined;
    constructor(givenParameter: O);
    _getParameterList(): TParameterList<O, P> & {
        x: undefined;
        y: undefined;
        width: undefined;
        height: undefined;
        gridSize: undefined;
        darker: number;
        pixel: boolean;
        clear: boolean;
        norm: (value: SpriteFastBlurOptions["norm"], givenParameter: SpriteFastBlurOptions) => boolean;
        scaleX: (value: SpriteFastBlurOptions["scaleX"], givenParameter: SpriteFastBlurOptions) => number;
        scaleY: (value: SpriteFastBlurOptions["scaleY"], givenParameter: SpriteFastBlurOptions) => number;
        alpha: number;
        compositeOperation: string;
    };
    _generateTempCanvas(additionalModifier: AdditionalModifier): void;
    normalizeFullScreen(additionalModifier: AdditionalModifier): void;
    resize(_output: OutputInfo | undefined, additionalModifier: AdditionalModifier): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): ISprite | undefined;
    init(_context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}

export declare class Forever implements IAnimation {
    _Aniobject: Sequence;
    constructor(...Aniobject: AnimationSequenceOptions);
    reset(timelapsed?: number): void;
    play(label?: string, timelapsed?: number): boolean;
    run(sprite: ISprite, time: number, isDifference?: boolean): number | true;
}

export declare class Group<O extends SpriteGroupOptions = SpriteGroupOptions, P extends SpriteGroupOptionsInternal = SpriteGroupOptionsInternal> extends SpriteBase<O, P> {
    constructor(givenParameter: O);
    _getParameterList(): TParameterList<O, P> & {
        x: number;
        y: number;
        rotation: (value: SpriteCircleOptions["rotation"], givenParameter: SpriteCircleOptions) => number;
        scaleX: (value: SpriteCircleOptions["scaleX"], givenParameter: SpriteCircleOptions) => number;
        scaleY: (value: SpriteCircleOptions["scaleY"], givenParameter: SpriteCircleOptions) => number;
        alpha: number;
        compositeOperation: string;
        color: string;
    } & {
        sprite: never[];
    };
    getElementsByTag(tag: TTagParameter): ISprite[];
    animate(timepassed: number): boolean;
    play(label?: string, timelapsed?: number): void;
    resize(output: OutputInfo, additionalModifier: AdditionalModifier): void;
    callInit(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    detectDraw(context: CanvasRenderingContext2D, color: string): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): ISprite | "c" | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}

export declare interface IAlgorithmData extends IChangeValueMeta {
    from?: TProperty;
    delta?: number;
    values?: TBezier;
    pathFrom?: number[][][];
    pathTo?: number[][][];
    colorFrom?: TinyColor;
    colorTo?: TinyColor;
}

export declare interface IAnimation {
    run: (sprite: ISprite, time: number, is_difference?: boolean) => number | boolean | SequenceRunCommand;
    reset?: (timelapsed?: number) => void;
    play?: (label: string, timelapsed: number) => void | boolean;
}

export declare interface IChangeValueMeta {
    name: string;
    to: TProperty;
    bezier?: TBezier;
    isColor: boolean;
    isPath: boolean;
    isStatic: boolean;
    isFunction?: TChangeFunction;
    moveAlgorithm: TAlgorithm;
}

export declare class If implements IAnimation {
    _ifCallback: OrFunction<boolean>;
    _Aniobject: IAnimation | TAnimationFunction;
    _AniobjectElse: IAnimation | TAnimationFunction;
    constructor(ifCallback: OrFunction<boolean>, Aniobject: IAnimation | TAnimationFunction, AniobjectElse: IAnimation | TAnimationFunction);
    play(label?: string, timelapsed?: number): boolean | void;
    run(sprite: ISprite, time: number): number | boolean | SequenceRunCommand;
}

export declare class Image_2 extends SpriteBase<SpriteImageOptions, SpriteImageOptionsInternal> {
    _currentTintKey: string | undefined;
    _normScale: number | undefined;
    _temp_canvas: HTMLCanvasElement | undefined;
    _tctx: CanvasRenderingContext2D | undefined;
    constructor(givenParameter: SpriteImageOptions);
    _getParameterList(): TParameterList<SpriteImageOptions, SpriteImageOptionsInternal> & {
        x: number;
        y: number;
        rotation: (value: SpriteCircleOptions["rotation"], givenParameter: SpriteCircleOptions) => number;
        scaleX: (value: SpriteCircleOptions["scaleX"], givenParameter: SpriteCircleOptions) => number;
        scaleY: (value: SpriteCircleOptions["scaleY"], givenParameter: SpriteCircleOptions) => number;
        alpha: number;
        compositeOperation: string;
        color: string;
    } & {
        image: (v: OrFunction<HTMLImageElement | string>) => HTMLImageElement;
        position: Position;
        frameX: number;
        frameY: number;
        frameWidth: number;
        frameHeight: number;
        width: undefined;
        height: undefined;
        norm: boolean;
        normCover: boolean;
        normToScreen: boolean;
        clickExact: boolean;
        color: string;
        tint: number;
    };
    resize(_output: OutputInfo, _additionalModifier: AdditionalModifier): void;
    init(_context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    _tintCacheKey(): string;
    _temp_context(frameWidth: number, frameHeight: number): CanvasRenderingContext2D;
    detectDraw(context: CanvasRenderingContext2D, color: string): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): ISprite | "c" | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}

export declare class Image_3 {
    _initialized: boolean;
    _image: (HTMLImageElement | string)[];
    _count: number;
    _durationBetweenFrames: number;
    _duration: number;
    _current: number;
    constructor(image: OrFunction<HTMLImageElement | string | (HTMLImageElement | string)[]>, durationBetweenFrames: OrFunction<number>);
    reset(): void;
    run(sprite: ISprite & {
        p: {
            image?: HTMLImageElement;
        };
    }, time: number): number;
}

export declare class ImageFrame implements IAnimation {
    _frameNumber: number[];
    _durationBetweenFrames: number;
    _duration: number;
    _framesToRight: boolean;
    constructor(frameNumber: OrFunction<number | number[]>, framesToRight: OrFunction<boolean>, durationBetweenFrames: OrFunction<number>);
    run(sprite: ISprite & {
        p: {
            frameX?: number;
            frameY?: number;
            frameWidth?: number;
            frameHeight?: number;
        };
    }, time: number): number;
}

export declare const ImageManager: ImageManager_2;

export declare class ImageManager_2 {
    Images: Record<string, HTMLImageElement>;
    count: number;
    loaded: number;
    _resolve: ((value: unknown) => void)[];
    constructor();
    add<F extends (key: string, image: HTMLImageElement) => void>(Images: string[] | Record<string, string>, Callbacks?: undefined | (() => void) | F[] | Record<string, F>): this;
    reset(): this;
    isLoaded(): boolean;
    getImage(nameOrImage: HTMLImageElement | string): HTMLImageElement;
    isLoadedPromise(): true | Promise<unknown>;
}

export declare interface ISequence {
    position: number;
    timelapsed: number;
    sequence: IAnimation[];
    label: Record<string, number>;
    enabled: boolean;
}

export declare interface ISprite {
    p: SpriteBaseOptionsInternal;
    changeToPathInit?: (from: number[][][] | string, to: number[][][] | string) => [number[][][], number[][][]];
    changeToPath?: (progress: number, data: {
        pathFrom: number[][][];
        pathTo: number[][][];
    }) => number[][][];
    getElementsByTag: (tag: TTagParameter) => ISprite[];
    play: (label: string, timelapsed?: number) => void;
    resize: (output: OutputInfo, additionalModifier: AdditionalModifier) => OrPromise<void>;
    callInit: (context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) => OrPromise<void>;
    animate: (timepassed: number) => boolean;
    draw: (context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) => void;
    detect: (context: CanvasRenderingContext2D, coordinateX: number, coordinateY: number) => ISprite | "c" | undefined;
    detectDraw: (context: CanvasRenderingContext2D, color: string) => void;
}

export declare type ISpriteFunction = (params: ParameterListWithoutTime & {
    layerId: number;
    elementId: number;
    layer: Layer;
    context: CanvasRenderingContext2D;
}) => number | boolean;

export declare type ISpriteFunctionOrSprite = ISpriteFunction | ISprite;

export declare type ISpriteWithPosition = ISprite & {
    p: {
        x: number;
        y: number;
    };
};

export declare class Layer {
    _layer: (undefined | ISpriteFunctionOrSprite)[];
    _isFunction: (undefined | boolean)[];
    _start: number;
    _nextFree: number;
    _canvasIds: number[];
    constructor(canvasIds: undefined | number | number[]);
    addElement(element: ISpriteFunctionOrSprite): ISpriteFunctionOrSprite;
    addElements(arrayOfElements: ISpriteFunctionOrSprite[]): ISpriteFunctionOrSprite[];
    addElementForId(element: ISpriteFunctionOrSprite): number;
    addElementsForIds(arrayOfElements: ISpriteFunctionOrSprite[]): number[] | ISpriteFunctionOrSprite[];
    getById(elementId: number): ISpriteFunctionOrSprite | undefined;
    getIdByElement(element: ISpriteFunctionOrSprite): number;
    deleteByElement(element: ISpriteFunctionOrSprite): void;
    deleteById(elementId: number): void;
    isCanvasId(canvasId: number | undefined): boolean;
    forEach(callback: LayerCallback, layerId?: number): void;
    getElementsByTag(tag: TTagParameter): ISprite[];
    play(label?: string, timelapsed?: number): void;
    count(): number;
    clear(): void;
}

export declare type LayerCallback = (data: LayerCallbackData) => void | boolean;

export declare interface LayerCallbackData {
    elementId: number;
    layerId: number;
    element: ISpriteFunctionOrSprite;
    isFunction: boolean;
    layer: Layer;
}

export declare class LayerManager {
    _layers: Layer[];
    constructor();
    addLayer(canvasIds?: undefined | number | number[]): Layer;
    addLayers(numberOfLayer?: number, canvasIds?: undefined | number | number[]): Layer[];
    addLayerForId(canvasIds?: undefined | number | number[]): number;
    addLayersForIds(numberOfLayer?: number, canvasIds?: undefined | number | number[]): number[];
    getById(layerId: number): Layer;
    forEach(callback: LayerCallback, canvasId?: number | undefined): void;
    play(label?: string, timelapsed?: number): void;
    getElementsByTag(tag: TTagParameter): ISprite[];
    count(): number;
    clear(): void;
}

export declare class LoadingScreen implements ConfigurationObject {
    loading({ output, progress }: ParameterListLoading): void;
}

export declare class Loop implements IAnimation {
    _Aniobject: Sequence;
    _times: number;
    _timesOrg: number;
    constructor(times: number, ...Aniobject: AnimationSequenceOptions);
    reset(timelapsed?: number): void;
    play(label?: string, timelapsed?: number): boolean;
    run(sprite: ISprite, time: number, isDifference?: boolean): number | true;
}

export declare const Middleware: {
    Callback: typeof Camera;
    Camera: typeof Camera;
    CameraControl: typeof CameraControl;
    CameraControlSecondButton: typeof CameraControlSecondButton;
    Click: typeof Click;
    Element: typeof Element_2;
    Event: typeof Events;
    LoadingScreen: typeof LoadingScreen;
    Norm: typeof Norm;
    TimingAudio: typeof TimingAudio;
    TimingDefault: typeof TimingDefault;
};

export declare interface MiddlewareCameraControlOptions {
    zoomMax: number;
    zoomMin: number;
    zoomFactor: number;
    tween: number;
    callResize: boolean;
}

export declare type MiddlewareCommandList<T = ConfigurationObject> = {
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

export declare interface MiddlewareElementOptions {
    doubleClickDetectInterval?: number;
}

export declare interface MiddlewareTimingAudioOptions extends MiddlewareTimingDefaultOptions {
    audioElement: HTMLMediaElement;
}

export declare interface MiddlewareTimingDefaultOptions {
    tickChunk?: OrFunction<number>;
    maxSkippedTickChunk?: OrFunction<number | undefined>;
    tickChunkTolerance?: OrFunction<number | undefined>;
}

export declare interface MousePosition {
    mx: number;
    my: number;
}

export declare class Norm implements ConfigurationObject {
    viewport({ engine }: ParameterListWithoutTime, matrix: Transform): Transform;
    additionalModifier({ engine, output, scene, }: ParameterListWithoutTime): AdditionalModifier;
}

export declare class Once implements IAnimation {
    _Aniobject: IAnimation;
    _times: number;
    constructor(Aniobject: IAnimation, times: number);
    run(sprite: ISprite, time: number): number | boolean | SequenceRunCommand;
}

export declare type OrFunction<R, P extends unknown[] = []> = R | ((...args: P) => R);

export declare type OrPromise<T> = T | Promise<T>;

export declare interface OutputInfo {
    canvas: HTMLCanvasElement[];
    context: CanvasRenderingContext2D[];
    width: number;
    height: number;
    ratio: number;
}

export declare interface ParameterList extends ParameterListWithoutTime {
    timePassed: number;
}

export declare interface ParameterListCanvas extends ParameterListWithoutTime {
    canvasId: undefined | number;
}

export declare type ParameterListClickElement = ParameterListCanvas & ElementClickInfo & ElementPositionInfo;

export declare type ParameterListClickNonElement = ParameterListCanvas & ElementClickInfo & ElementPositionInfo;

export declare interface ParameterListFixedUpdate extends ParameterList {
    lastCall: boolean;
}

export declare interface ParameterListInitDestroy extends ParameterList {
    parameter: unknown;
}

export declare interface ParameterListLoading extends ParameterList {
    timePassed: number;
    totalTimePassed: number;
    progress: string | number;
}

export declare interface ParameterListPositionEvent extends ParameterListWithoutTime {
    event: Event | MouseEvent | TouchEvent;
    position: [number, number];
    x: number;
    y: number;
    button: number;
}

export declare interface ParameterListRegion extends ParameterListWithoutTime {
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

export declare interface ParameterListWithoutTime {
    engine: Engine;
    scene: Scene;
    imageManager: typeof ImageManager;
    layerManager: LayerManager;
    totalTimePassed: number;
    output: OutputInfo;
}

export declare class Particle extends SpriteBase<SpriteParticleOptions, SpriteParticleOptionsInternal> {
    _currentScaleX: number | undefined;
    _currentPixelSmoothing: boolean;
    static _Gradient: HTMLCanvasElement[][][];
    constructor(givenParameter: SpriteParticleOptions);
    _getParameterList(): TParameterList<SpriteParticleOptions, SpriteParticleOptionsInternal> & {
        x: number;
        y: number;
        scaleX: (value: SpriteParticleOptions["scaleX"], givenParameter: SpriteParticleOptions) => number;
        scaleY: (value: SpriteParticleOptions["scaleY"], givenParameter: SpriteParticleOptions) => number;
        color: string;
        alpha: number;
        compositeOperation: string;
    };
    static getGradientImage(r: number, g: number, b: number): HTMLCanvasElement;
    static generateGradientImage(cr: number, cg: number, cb: number): HTMLCanvasElement;
    resize(_output: OutputInfo, _additionalModifier: AdditionalModifier): void;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}

export declare class Path extends Group<SpritePathOptions, SpritePathOptionsInternal> {
    _oldPath: number[][][] | string | Path2D | undefined;
    _path2D: Path2D;
    constructor(givenParameters: SpritePathOptions);
    _getParameterList(): never;
    changeToPathInit(from: number[][][] | string, to: number[][][] | string): [number[][][], number[][][]];
    changeToPath(progress: number, data: {
        pathFrom: number[][][];
        pathTo: number[][][];
    }): number[][][];
    detectDraw(context: CanvasRenderingContext2D, color: string): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): ISprite | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}

export declare type PickMatching<T, V> = {
    [K in keyof T as T[K] extends V ? K : never]: T[K];
};

export declare enum Position {
    LEFT_TOP = 0,
    CENTER = 1
}

export declare class Rect extends SpriteBase<SpriteRectOptions, SpriteRectOptionsInternal> implements ISprite {
    constructor(givenParameters: SpriteRectOptions);
    _getParameterList(): never;
    _normalizeFullScreen(additionalModifier: AdditionalModifier): void;
    resize(_output: OutputInfo, _additionalModifier: AdditionalModifier): void;
    init(_context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): ISprite | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}

export declare interface RectPosition {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export declare class Remove implements IAnimation {
    constructor();
    run(_sprite: ISprite, _time: number): SequenceRunCommand;
}

export declare class Scene<TRunParameter extends Record<string | symbol, unknown> = Record<string | symbol, unknown>, TSceneParameter extends Record<string | symbol, unknown> = Record<string | symbol, unknown>> {
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

export declare class Scroller extends Emitter<SpriteTextOptions> {
    constructor(givenParameters: SpriteScollerOptions);
}

export declare class Sequence implements IAnimation {
    sequences: ISequence[];
    lastTimestamp: number;
    enabled: boolean;
    constructor(...sequences: AnimationSequenceOptions);
    reset(timelapsed?: number): void;
    play(label?: string, timelapsed?: number): boolean;
    _runSequence(sprite: ISprite, sequencePosition: ISequence, timePassed: number): number | true;
    run(sprite: ISprite, time: number, is_difference?: boolean): number | true;
}

export declare enum SequenceRunCommand {
    FORCE_DISABLE = "F",
    STOP = "S",
    REMOVE = "R"
}

export declare class Shake {
    _initialized: boolean;
    _duration: number;
    _shakeDiff: number;
    _shakeDiffHalf: number;
    _x: number;
    _y: number;
    constructor(shakediff: OrFunction<number>, duration: OrFunction<number>);
    reset(): void;
    run(sprite: ISpriteWithPosition, time: number): number;
}

export declare class ShowOnce implements IAnimation {
    _showOnce: boolean;
    run(sprite: ISprite, _time: number): number;
}

export declare class SpriteBase<O extends SpriteBaseOptions = SpriteBaseOptions, P extends SpriteBaseOptionsInternal = SpriteBaseOptionsInternal> implements ISprite {
    _needInit: boolean;
    p: P;
    constructor(givenParameter: O);
    _parseParameterList(parameterList: TParameterList<O, P>, givenParameter: O): P;
    _getBaseParameterList(): {
        animation: (value: SpriteBaseOptions["animation"], _givenParameter: O) => Sequence | undefined;
        enabled: boolean;
        isClickable: boolean;
        tag: (value: SpriteBaseOptions["tag"], _givenParameter: O) => string[];
    };
    _getParameterList(): TParameterList<O, P>;
    getElementsByTag(tag: TTagParameter): ISprite[];
    animate(timepassed: number): boolean;
    play(label?: string, timelapsed?: number): void;
    init(_context: CanvasRenderingContext2D, _additionalModifier: AdditionalModifier): void;
    callInit(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): OrPromise<void>;
    resize(_output: OutputInfo, _additionalModifier: AdditionalModifier): OrPromise<void>;
    _detectHelperCallback(p: {
        enabled: boolean;
        isClickable: boolean;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
    }, context: CanvasRenderingContext2D, _x: number, _y: number, callback: () => boolean): ISprite | undefined;
    _detectHelper({ enabled, isClickable, x, y, width, height, scaleX, scaleY, rotation, }: {
        enabled: boolean;
        isClickable: boolean;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        scaleX?: number;
        scaleY?: number;
        rotation?: number;
    }, context: CanvasRenderingContext2D, coordinateX: number, coordinateY: number, moveToCenter: boolean, callback?: (hw: number, hh: number) => boolean): ISprite | undefined;
    detectDraw(_context: CanvasRenderingContext2D, _color: string): void;
    detect(_context: CanvasRenderingContext2D, _x: number, _y: number): ISprite | "c" | undefined;
    draw(_context: CanvasRenderingContext2D, _additionalModifier: AdditionalModifier): void;
}

export declare interface SpriteBaseOptions {
    animation?: OrFunction<TAnimationSequence>;
    enabled?: OrFunction<boolean>;
    isClickable?: OrFunction<boolean>;
    tag?: OrFunction<string[] | string>;
}

export declare interface SpriteBaseOptionsInternal {
    animation: IAnimation | undefined;
    enabled: boolean;
    isClickable: boolean;
    tag: string[];
}

export declare type SpriteCallback = (context: CanvasRenderingContext2D, timePassed: number, additionalParameter: AdditionalModifier, sprite: ISprite) => void;

export declare interface SpriteCallbackOptions extends SpriteBaseOptions {
    callback?: SpriteCallback | undefined;
}

export declare interface SpriteCallbackOptionsInternal extends SpriteBaseOptionsInternal {
    callback: SpriteCallback;
}

export declare interface SpriteCanvasOptions extends SpriteGroupOptions {
    width?: OrFunction<number>;
    height?: OrFunction<number>;
    canvasWidth?: OrFunction<number>;
    canvasHeight?: OrFunction<number>;
    compositeOperation?: OrFunction<GlobalCompositeOperation>;
    gridSize?: OrFunction<number>;
    norm?: OrFunction<boolean>;
    isDrawFrame?: OrFunction<number, [
    undefined | CanvasRenderingContext2D,
    undefined | AdditionalModifier
    ]>;
}

export declare interface SpriteCanvasOptionsInternal extends SpriteGroupOptionsInternal {
    width: number | undefined;
    height: number | undefined;
    canvasWidth: number | undefined;
    canvasHeight: number | undefined;
    compositeOperation: GlobalCompositeOperation;
    gridSize: number | undefined;
    norm: boolean;
    isDrawFrame: OrFunction<number, [
    undefined | CanvasRenderingContext2D,
    undefined | AdditionalModifier
    ]>;
}

export declare interface SpriteCircleOptions extends SpriteBaseOptions {
    x?: OrFunction<number>;
    y?: OrFunction<number>;
    rotation?: OrFunction<number>;
    rotationInRadian?: OrFunction<number>;
    rotationInDegree?: OrFunction<number>;
    scaleX?: OrFunction<number>;
    scaleY?: OrFunction<number>;
    scale?: OrFunction<number>;
    alpha?: OrFunction<number>;
    compositeOperation?: OrFunction<GlobalCompositeOperation>;
    color?: OrFunction<string>;
}

export declare interface SpriteCircleOptionsInternal extends SpriteBaseOptionsInternal {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    compositeOperation: GlobalCompositeOperation;
    color: string;
}

export declare interface SpriteEmitterOptions<P extends SpriteBaseOptions = SpriteBaseOptions> {
    count?: number;
    class: {
        new (options: P): ISprite;
    };
    self?: SpriteGroupOptions;
}

export declare interface SpriteFastBlurOptions extends SpriteBaseOptions {
    x?: OrFunction<undefined | number>;
    y?: OrFunction<undefined | number>;
    width?: OrFunction<undefined | number>;
    height?: OrFunction<undefined | number>;
    scaleX?: OrFunction<undefined | number>;
    scaleY?: OrFunction<undefined | number>;
    scale?: OrFunction<undefined | number>;
    alpha?: OrFunction<undefined | number>;
    gridSize?: OrFunction<undefined | number>;
    darker?: OrFunction<undefined | number>;
    pixel?: OrFunction<undefined | boolean>;
    clear?: OrFunction<undefined | boolean>;
    norm?: OrFunction<undefined | boolean>;
    compositeOperation?: OrFunction<undefined | GlobalCompositeOperation>;
}

export declare interface SpriteFastBlurOptionsInternal extends SpriteBaseOptionsInternal {
    x: undefined | number;
    y: undefined | number;
    width: undefined | number;
    height: undefined | number;
    scaleX?: number;
    scaleY?: number;
    gridSize: undefined | number;
    darker: number;
    pixel: boolean;
    clear: boolean;
    norm: boolean;
    alpha: number;
    compositeOperation: GlobalCompositeOperation;
}

export declare interface SpriteGroupOptions extends SpriteBaseOptions {
    x?: OrFunction<number>;
    y?: OrFunction<number>;
    rotation?: OrFunction<number>;
    rotationInRadian?: OrFunction<number>;
    rotationInDegree?: OrFunction<number>;
    scaleX?: OrFunction<number>;
    scaleY?: OrFunction<number>;
    scale?: OrFunction<number>;
    alpha?: OrFunction<number>;
    sprite?: OrFunction<ISprite[]>;
}

export declare interface SpriteGroupOptionsInternal extends SpriteBaseOptionsInternal {
    x: number | undefined;
    y: number | undefined;
    rotation: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    sprite: ISprite[];
}

export declare interface SpriteImageOptions extends SpriteCircleOptions {
    image: OrFunction<HTMLImageElement | string>;
    position?: OrFunction<Position>;
    frameX?: OrFunction<number>;
    frameY?: OrFunction<number>;
    frameWidth?: OrFunction<number>;
    frameHeight?: OrFunction<number>;
    width?: OrFunction<number>;
    height?: OrFunction<number>;
    norm?: OrFunction<boolean>;
    normCover?: OrFunction<boolean>;
    normToScreen?: OrFunction<boolean>;
    clickExact?: OrFunction<boolean>;
    tint?: OrFunction<number>;
}

export declare interface SpriteImageOptionsInternal extends SpriteCircleOptionsInternal {
    image: HTMLImageElement;
    position: Position;
    frameX: number;
    frameY: number;
    frameWidth: number;
    frameHeight: number;
    width: number;
    height: number;
    norm: boolean;
    normCover: boolean;
    normToScreen: boolean;
    clickExact: boolean;
    tint: number;
}

export declare interface SpriteParticleOptions extends SpriteBaseOptions {
    x?: OrFunction<number>;
    y?: OrFunction<number>;
    scaleX?: OrFunction<number>;
    scaleY?: OrFunction<number>;
    scale?: OrFunction<number>;
    alpha?: OrFunction<number>;
    compositeOperation?: OrFunction<GlobalCompositeOperation>;
    color?: OrFunction<string>;
}

export declare interface SpriteParticleOptionsInternal extends SpriteBaseOptionsInternal {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    compositeOperation: GlobalCompositeOperation;
    color: string | TinyColorRGB;
}

export declare interface SpritePathOptions extends SpriteGroupOptions {
    path?: OrFunction<number[][][] | string | Path2D>;
    color?: OrFunction<string | undefined>;
    borderColor?: OrFunction<string | undefined>;
    compositeOperation?: OrFunction<GlobalCompositeOperation>;
    lineWidth?: OrFunction<number>;
    clip?: OrFunction<boolean>;
    fixed?: OrFunction<boolean>;
    polyfill?: OrFunction<boolean>;
}

export declare interface SpritePathOptionsInternal extends SpriteGroupOptionsInternal {
    path: number[][][] | string | Path2D;
    color: string | undefined;
    borderColor: string | undefined;
    compositeOperation: GlobalCompositeOperation;
    lineWidth: number;
    clip: boolean;
    fixed: boolean;
    polyfill: boolean;
}

export declare interface SpriteRectOptions extends SpriteCircleOptions {
    position?: OrFunction<undefined | Position>;
    borderColor?: OrFunction<undefined | string>;
    lineWidth?: OrFunction<undefined | number>;
    width?: OrFunction<undefined | number>;
    height?: OrFunction<undefined | number>;
    clear?: OrFunction<undefined | boolean>;
    norm?: OrFunction<undefined | boolean>;
}

export declare interface SpriteRectOptionsInternal extends SpriteBaseOptionsInternal {
    x: undefined | number;
    y: undefined | number;
    width: undefined | number;
    height: undefined | number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    compositeOperation: GlobalCompositeOperation;
    position: Position;
    borderColor: undefined | string;
    color: undefined | string;
    lineWidth: number;
    clear: boolean;
    norm: boolean;
}

export declare const Sprites: {
    Callback: typeof Callback;
    Canvas: typeof Canvas;
    Circle: typeof Circle;
    Emitter: typeof Emitter;
    FastBlur: typeof FastBlur;
    Group: typeof Group;
    Image: typeof Image_2;
    Text: typeof Text_2;
    Particle: typeof Particle;
    Path: typeof Path;
    Rect: typeof Rect;
    Scroller: typeof Scroller;
    StackBlur: typeof StackBlur;
    StarField: typeof StarField;
};

export declare interface SpriteScollerOptions extends SpriteTextOptions {
    text: OrFunction<string | string[]>;
}

export declare interface SpriteStackBlurOptions extends SpriteFastBlurOptions {
    onCanvas?: OrFunction<boolean>;
    radius?: OrFunction<undefined | number>;
    radiusPart?: OrFunction<undefined | number>;
    radiusScale?: OrFunction<boolean>;
}

export declare interface SpriteStackBlurOptionsInternal extends SpriteFastBlurOptionsInternal {
    onCanvas: boolean;
    radius: undefined | number;
    radiusPart: undefined | number;
    radiusScale: boolean;
}

export declare interface SpriteStarFieldOptions extends SpriteBaseOptions {
    x?: OrFunction<number>;
    y?: OrFunction<number>;
    width?: OrFunction<number>;
    height?: OrFunction<number>;
    alpha?: OrFunction<number>;
    lineWidth?: OrFunction<number>;
    count?: OrFunction<number>;
    compositeOperation?: OrFunction<GlobalCompositeOperation>;
    moveX?: OrFunction<undefined | number>;
    moveY?: OrFunction<undefined | number>;
    moveZ?: OrFunction<undefined | number>;
    highScale?: OrFunction<undefined | boolean>;
    color?: OrFunction<undefined | string>;
}

export declare interface SpriteStarFieldOptionsInternal extends SpriteBaseOptionsInternal {
    x: undefined | number;
    y: undefined | number;
    width: undefined | number;
    height: undefined | number;
    alpha: number;
    count: number;
    lineWidth: number;
    compositeOperation: GlobalCompositeOperation;
    moveX: number;
    moveY: number;
    moveZ: number;
    highScale: boolean;
    color: string;
}

export declare interface SpriteTextOptions extends SpriteCircleOptions {
    text?: OrFunction<string | string[]>;
    font?: OrFunction<undefined | string>;
    position?: OrFunction<undefined | Position>;
    borderColor?: OrFunction<undefined | string>;
    lineWidth?: OrFunction<undefined | number>;
}

export declare interface SpriteTextOptionsInternal extends SpriteBaseOptionsInternal {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    compositeOperation: GlobalCompositeOperation;
    text: string;
    font: string;
    position: Position;
    borderColor: undefined | string;
    color: undefined | string;
    lineWidth: number;
}

export declare class StackBlur extends FastBlur<SpriteStackBlurOptions, SpriteStackBlurOptionsInternal> {
    _currentRadiusPart: number | undefined;
    constructor(givenParameter: SpriteStackBlurOptions);
    _getParameterList(): TParameterList<SpriteStackBlurOptions, SpriteStackBlurOptionsInternal> & {
        x: undefined;
        y: undefined;
        width: undefined;
        height: undefined;
        gridSize: undefined;
        darker: number;
        pixel: boolean;
        clear: boolean;
        norm: (value: SpriteFastBlurOptions["norm"], givenParameter: SpriteFastBlurOptions) => boolean;
        scaleX: (value: SpriteFastBlurOptions["scaleX"], givenParameter: SpriteFastBlurOptions) => number;
        scaleY: (value: SpriteFastBlurOptions["scaleY"], givenParameter: SpriteFastBlurOptions) => number;
        alpha: number;
        compositeOperation: string;
    } & {
        onCanvas: boolean;
        radius: undefined;
        radiusPart: undefined;
        radiusScale: boolean;
    };
    normalizeFullScreen(additionalModifier: AdditionalModifier): void;
    resize(output: OutputInfo, additionalModifier: AdditionalModifier): void;
    additionalBlur(targetW: number, targetH: number, additionalModifier: AdditionalModifier): void;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}

export declare class StarField extends SpriteBase<SpriteStarFieldOptions, SpriteStarFieldOptionsInternal> {
    _starsX: number[];
    _starsY: number[];
    _starsZ: number[];
    _starsOldX: number[];
    _starsOldY: number[];
    _starsNewX: number[];
    _starsNewY: number[];
    _starsEnabled: boolean[];
    _starsLineWidth: number[];
    _centerX: number;
    _centerY: number;
    _scaleZ: number;
    constructor(givenParameters: SpriteStarFieldOptions);
    _getParameterList(): TParameterList<SpriteStarFieldOptions, SpriteStarFieldOptionsInternal> & {
        count: number;
        moveX: number;
        moveY: number;
        moveZ: number;
        lineWidth: undefined;
        highScale: boolean;
        color: string;
    };
    init(_context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    _moveStar(i: number, scaled_timepassed: number, firstPass: boolean): void;
    animate(timepassed: number): boolean;
    resize(_output: OutputInfo, _additionalModifier: AdditionalModifier): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): ISprite | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}

export declare class State implements IAnimation {
    _states: Record<string, Sequence | State>;
    _transitions: Record<string, Sequence | State>;
    _currentStateName: string | undefined;
    _currentState: Sequence | State | undefined;
    _isTransitioningToStateName: string | undefined;
    constructor({ states, transitions, defaultState, }: {
        states?: Record<string, TAnimationSequence>;
        transitions?: Record<string, TAnimationSequence>;
        defaultState: string;
    });
    setState(name: string): void;
    play(label?: string, timelapsed?: number): boolean | undefined;
    run(sprite: ISprite, time: number, is_difference?: boolean): true | -1;
}

export declare type TAlgorithm = (progress: number, data: IAlgorithmData, sprite?: ISprite) => TProperty | number[][][];

export declare type TAnimationCallbackCallback = (sprite: ISprite, time: number, firstRun: boolean) => ReturnType<IAnimation["run"]>;

export declare type TAnimationFunction = IAnimation["run"];

export declare type TAnimationSequence = (TWaitTime | TLabel | TAnimationFunction | IAnimation)[];

export declare type TBezier = number[];

export declare type TChangeFunction = ((from?: number | undefined) => number) | ((from?: string | undefined) => string);

export declare type TChangeValue = TProperty | TBezier | TChangeFunction;

export declare class Text_2 extends SpriteBase<SpriteTextOptions, SpriteTextOptionsInternal> implements ISprite {
    constructor(givenParameters: SpriteTextOptions);
    _getParameterList(): never;
    detectDraw(context: CanvasRenderingContext2D, color: string): void;
    detect(_context: CanvasRenderingContext2D, _x: number, _y: number): "c";
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}

export declare class TimingAudio extends TimingDefault implements ConfigurationObject {
    _maxSkippedTickChunk: number;
    _audioStartTime: number | undefined;
    _audioPosition: number | undefined;
    _enableAndroidHack: boolean;
    _audioElement: undefined | (HTMLMediaElement & {
        controller?: Record<string, unknown>;
    });
    constructor(configuration: MiddlewareTimingAudioOptions);
    get audioElement(): (HTMLMediaElement & {
        controller?: Record<string, unknown>;
    }) | undefined;
    init(_params: ParameterListInitDestroy): Promise<unknown> | undefined;
    endTime(): number;
    currentTime(): number;
    clampTime({ timePassed }: ParameterList): number;
    shiftTime(): number;
}

export declare class TimingDefault implements ConfigurationObject {
    _configuration: MiddlewareTimingDefaultOptions;
    _tickChunk: number;
    _maxSkippedTickChunk: number;
    _tickChunkTolerance: number;
    type: string;
    totalTimePassed: number;
    constructor(configuration?: MiddlewareTimingDefaultOptions);
    init(_params: ParameterListWithoutTime): void;
    currentTime(): number;
    clampTime({ timePassed }: ParameterList): number;
    shiftTime({ timePassed }: ParameterList): number;
    get tickChunk(): number;
    isChunked(): boolean;
    hasOneChunkedFrame({ timePassed }: ParameterList): boolean;
    calcFrames({ timePassed }: ParameterList): number;
}

export declare type TinyColorRGB = ReturnType<TinyColor["toRgb"]>;

export declare type TLabel = string;

export declare type TParameterList<T, R> = {
    [P in keyof R & keyof T]?: R[P] | ((value: T[P], givenParameter: T) => R[P]);
};

export declare type TProperty = number | string;

export declare class Transform {
    m: [number, number, number, number, number, number];
    __constuct(): void;
    reset(): this;
    multiply(matrix: Transform): this;
    invert(): this;
    rotate(rad: number): this;
    translate(x: number, y: number): this;
    scale(sx: number, sy: number): this;
    transformPoint(px: number, py: number): [number, number];
    clone(): Transform;
}

export declare type TTagParameter = string | string[] | ((value: string, index: number, array: string[]) => unknown);

export declare type TWaitTime = number;

export declare type ValueOf<T> = T[keyof T];

export declare class Wait implements IAnimation {
    _duration: number;
    constructor(duration: OrFunction<number>);
    run(_sprite: ISprite, time: number): number;
}

export declare class WaitDisabled implements IAnimation {
    duration: number;
    constructor(duration: OrFunction<number>);
    run(sprite: ISprite, time: number): number;
}

export declare type WithoutFunction<R> = R extends Function ? never : R;

export { }
