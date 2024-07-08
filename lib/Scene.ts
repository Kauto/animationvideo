import ImageManager from "./ImageManager";
import LayerManager from "./LayerManager";
import calc, { WithoutFunction } from "./func/calc";
import toArray from "./func/toArray";
import Transform from "./func/transform";
import TimingDefault from "./Middleware/TimingDefault";
import { OutputInfo } from "./Engine";
import type Engine from "./Engine";
import type {
  ISprite,
  ISpriteFunction,
  ISpriteFunctionOrSprite,
} from "./Sprites/Sprite";
import type { addPrefix, OrFunction, OrPromise, ValueOf } from "./helper";
import type Camera from "./Middleware/Camera";
import type { CameraPosition } from "./Middleware/Camera";
import type CameraControl from "./Middleware/CameraControl";
import type TimingAudio from "./Middleware/TimingAudio";

type PickMatching<T, V> =
    { [K in keyof T as T[K] extends V ? K : never]: T[K] }

type ExtractMethods<T> = PickMatching<T, Function|undefined>;

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

export type ParameterListClickElement = ParameterListCanvas &
  ElementClickInfo &
  ElementPositionInfo;

export type ParameterListClickNonElement = ParameterListCanvas &
  ElementClickInfo &
  ElementPositionInfo;

export interface ParameterListPositionEvent extends ParameterListWithoutTime {
  event: Event | MouseEvent | TouchEvent;
  position: [number, number];
  x: number;
  y: number;
  button: number;
}

export interface ParameterListRegion extends ParameterListWithoutTime {
  event: Event | MouseEvent | TouchEvent;
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  fromX: number,
  fromY: number,
  toX:number,
  toY:number,
}

export type EventsReturn = (
  | keyof HTMLElementEventMap
  | [
      keyof HTMLElementEventMap,
      (this: HTMLElement, el: ValueOf<HTMLElementEventMap>) => unknown,
    ]
)[];

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
  additionalModifier?: (
    params: ParameterListWithoutTime,
    additionalModifier: AdditionalModifier,
  ) => AdditionalModifier;
  calcFrames?: OrFunction<number, [ParameterList]>;
  tickChunk?: OrFunction<number, [ParameterListWithoutTime]>;
  fixedUpdate?: (params: ParameterListFixedUpdate) => void;
  draw?: (params: ParameterListCanvas) => void;
  update?: (params: ParameterList) => void;
  resize?: (params: ParameterList) => void;
  reset?: (
    params: ParameterListWithoutTime,
    layerManager: LayerManager | ISpriteFunctionOrSprite[][],
  ) => LayerManager | ISpriteFunctionOrSprite[][];
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

export type ConfigurationClassOrObject =
  | ConfigurationObject
  | ConfigurationConstructor;

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

const defaultMiddlewareCommandList = () => ({
  _all: [],
  init: [],
  isDrawFrame: [],
  initSprites: [],
  fixedUpdate: [],
  update: [],
  draw: [],
  destroy: [],
  reset: [],
  resize: [],
  currentTime: [],
  clampTime: [],
  shiftTime: [],
  isChunked: [],
  hasOneChunkedFrame: [],
  calcFrames: [],
  tickChunk: [],
  additionalModifier: [],
});

class Scene<
  TRunParameter extends Record<string | symbol, unknown> = Record<string | symbol, unknown>,
  TSceneParameter extends Record<string | symbol, unknown> = Record<string | symbol, unknown>,
> {
  _layerManager: LayerManager;
  _imageManager: typeof ImageManager;
  _totalTimePassed: number;
  _engine: Engine<TRunParameter, TSceneParameter> | undefined;
  _middleware: MiddlewareCommandList<ConfigurationObject> =
    defaultMiddlewareCommandList();
  _stopPropagation: boolean = false;
  _transform: Transform | undefined;
  _transformInvert: Transform | undefined;
  _additionalModifier: AdditionalModifier | undefined;
  _initDone: boolean = false;
  _endTime: number | undefined;
  _resetIntend: boolean = false;

  constructor(...configurationClassOrObjects: ConfigurationClassOrObject[]) {
    // Layer consists of Sprites
    this._layerManager = new LayerManager();
    this._totalTimePassed = 0;
    this._imageManager = ImageManager;

    this.middlewares = configurationClassOrObjects;
    if (!this.middlewareByType("timing")) {
      this.middlewares = [
        TimingDefault as ConfigurationConstructor,
        ...(this.middlewares as ConfigurationObject[]),
      ];
    }
  }

  _output() {
    return this._engine?.getOutput();
  }

  set middlewares(
    middlewares: ConfigurationClassOrObject | ConfigurationClassOrObject[],
  ) {
    this._middleware = (
      toArray(middlewares).map((configurationClassOrObject) =>
        typeof configurationClassOrObject === "function"
          ? new (configurationClassOrObject as ConfigurationConstructor)()
          : configurationClassOrObject,
      ) as ConfigurationObject[]
    ).reduce(
      (
        middlewareCommandList: MiddlewareCommandList<ConfigurationObject>,
        c: ConfigurationObject,
      ) => {
        for (const command of Object.keys(middlewareCommandList)) {
          if (command in c) {
            middlewareCommandList[
              command as keyof MiddlewareCommandList<ConfigurationObject>
            ].push(c);
          }
        }
        middlewareCommandList._all.push(c);
        if (!("enabled" in c)) c.enabled = true;
        if (c.type) middlewareCommandList[`t_${c.type}`] = [c];
        return middlewareCommandList;
      },
      defaultMiddlewareCommandList(),
    );
  }
  get middlewares() {
    return this._middleware._all;
  }

  middlewareByType(type: string) {
    const objs = this._middleware._all.filter((c) => c.type === type);
    if (objs.length) {
      return objs[objs.length - 1];
    }
  }

  has(command: string) {
    return (
      command in this._middleware ||
      this._middleware._all.some((c) => command in c)
    );
  }

  do<
      OBJ extends ConfigurationObject = ConfigurationObject,
    K extends keyof ExtractMethods<OBJ> = keyof ExtractMethods<OBJ>,
    D = OBJ[K],
    P = Omit<
        OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : {},
      keyof ParameterListWithoutTime
    > | undefined,
    R = D | undefined,
  >(
    command: K,
    params: P,
    defaultValue: D | undefined,
    func: (
      ConfigurationObjects: OBJ[],
      params: ParameterListWithoutTime & P,
      defaultValue: D | undefined,
    ) => R,
  ) {
    const objs =
        (this._middleware[command as keyof MiddlewareCommandList] ||
      this._middleware._all.filter((c) => command in c)).filter((v: ConfigurationObject) => v.enabled) as OBJ[];
    if (!objs.length) {
      return defaultValue;
    }
    const fullParams = this._param<P>(params);
    return func(objs, fullParams, defaultValue);
  }

  map<
      OBJ extends ConfigurationObject = ConfigurationObject,
    K extends keyof ExtractMethods<OBJ> =  keyof ExtractMethods<OBJ>,
    R = OBJ[K] extends (...args: any[]) => any ? ReturnType<OBJ[K]> : OBJ[K],
    P = Omit<
        OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : OBJ[K],
      keyof ParameterListWithoutTime
    >,
  >(command: K, params: P) {
    return this.do<OBJ, K, R[], P, R[]>(command, params, [], (objs, fullParams) => {
      return objs.map((c) => calc(c[command], [fullParams]) as R);
    }) as R[];
  }

  pipe<
    OBJ extends ConfigurationObject,
    K extends keyof ExtractMethods<OBJ>,
    R = OBJ[K] extends (...args: any[]) => any ? ReturnType<OBJ[K]> : OBJ[K],
    P extends Record<string, unknown> = Omit<
        OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : {},
      keyof ParameterListWithoutTime
    >,
  >(command: K, params: P, pipe: R | undefined = undefined): R | undefined {
    return this.do<OBJ, K, R, P>(command, params, pipe, (objs, fullParams) => {
      let res = pipe;
      this._stopPropagation = false;
      for (const c of objs) {
        res = calc(c[command], [fullParams, res]) as R;
        if (this._stopPropagation) break;
      }
      return res;
    });
  }

  pipeBack<
      OBJ extends ConfigurationObject,
      K extends keyof ExtractMethods<OBJ>,
    R = OBJ[K] extends (...args: any[]) => any ? ReturnType<OBJ[K]> : OBJ[K],
    P extends Record<string, unknown> = Omit<
        OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : {},
      keyof ParameterListWithoutTime
    >,
  >(command: K, params: P, pipe: R | undefined = undefined) {
    return this.do<OBJ, K, R>(command, params, pipe, (objs, fullParams) => {
      let res = pipe;
      this._stopPropagation = false;
      for (let i = objs.length - 1; i >= 0; i--) {
        const c: OBJ = objs[i];
        res = calc(c[command], [fullParams, res]) as R;
        if (this._stopPropagation) break;
      }
      return res;
    });
  }

  pipeMax<
      OBJ extends ConfigurationObject,
    K extends keyof ExtractMethods<OBJ>,
      R = OBJ[K] extends (...args: any[]) => any ? ReturnType<OBJ[K]> : OBJ[K],
    P = Omit<
        OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : {},
      keyof ParameterListWithoutTime
    >,
  >(command: K, params: P, pipe: R | undefined = undefined) {
    return this.do<OBJ, K, number | number[], P>(
      command,
      params,
      Array.isArray(pipe)
        ? pipe.map((p) => p - 0)
        : (pipe as unknown as number) - 0,
      (objs, fullParams, pipe) => {
        let res = pipe;
        this._stopPropagation = false;

        if (Array.isArray(res)) {
          // res is number
          for (const c of objs) {
            const newRes = calc(c[command], [fullParams, res]) as number | number[];
            if (Array.isArray(newRes)) {
              res = (res as unknown as number[]).map((v, i) =>
                Math.max(v, (newRes as number[])[i]),
              );
            } else {
              res = res.map((v, _i) => Math.max(v, newRes as number));
            }
            if (this._stopPropagation) break;
          }
        } else {
          for (const c of objs) {
            const newRes = calc(c[command], [fullParams, res]) as number | number[];
            if (Array.isArray(newRes)) {
              res = newRes.map((v) => Math.max(v, res as number));
            } else {
              res = Math.max(newRes, res as number);
            }
            if (this._stopPropagation) break;
          }
        }
        return res;
      },
    );
  }

  async pipeAsync<
  OBJ extends ConfigurationObject,
      K extends keyof ExtractMethods<OBJ>,
  R = OBJ[K] extends (...args: any[]) => any ? ReturnType<OBJ[K]> : OBJ[K],
  P = Omit<
      OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : {},
      keyof ParameterListWithoutTime
  >,
  >(command: K, params: P, pipe: R | undefined = undefined) {
    return this.do<OBJ, K, R, P, Promise<R | undefined>>(
      command,
      params,
      pipe,
      async (objs, fullParams) => {
        let res = pipe;
        this._stopPropagation = false;
        for (const c of objs) {
          res = await calc(c[command], [fullParams, res]) as R;
          if (this._stopPropagation) break;
        }
        return res;
      },
    );
  }

  value<
  OBJ = ConfigurationObject,
      K extends keyof OBJ = keyof OBJ,
      R = OBJ[K] extends (...args: any[]) => any ? ReturnType<OBJ[K]> : OBJ[K],
      P = Omit<
          OBJ[K] extends (...args: any[]) => any ? Parameters<OBJ[K]>[0] : {},
          keyof ParameterListWithoutTime
      >,
  >(
    command: K,
    params: P | undefined = undefined,
  ): WithoutFunction<R> | undefined {
    const objs =
        (this._middleware[
        command as keyof MiddlewareCommandList<ConfigurationObject>
      ] ||
      this._middleware._all.filter((c: ConfigurationObject) => command in c)).filter((v) => v.enabled) as OBJ[];
    if (!objs.length) {
      return undefined;
    }
    const obj = objs[objs.length - 1];
    return typeof obj[command] === "function"
      ? obj[command].call(obj, this._param(params || {}))
      : obj[command];
  }

  stopPropagation() {
    this._stopPropagation = true;
  }

  currentTime() {
    return this.pipe("currentTime", {})! as number;
  }

  clampTime(timePassed: number) {
    return this.pipe("clampTime", { timePassed })! as number;
  }

  shiftTime(timePassed: number) {
    return this.pipe("shiftTime", { timePassed })! as number;
  }

  cacheClear() {
    this._transform = undefined;
    this._transformInvert = undefined;
  }

  viewport() {
    if (!this._engine) return new Transform();

    if (!this._transform) {
      this._transform = this.pipe("viewport", {}, new Transform());
      this._transformInvert = undefined;
    }
    return this._transform!;
  }

  transformPoint(
    x: number,
    y: number,
    scale = this._additionalModifier!.scaleCanvas,
  ) {
    if (!this._transformInvert) {
      this._transformInvert = this.viewport().clone().invert();
    }
    return this._transformInvert.transformPoint(x * scale, y * scale);
  }

  callInit(parameter: unknown, engine: Engine<TRunParameter, TSceneParameter>) {
    this._engine = engine;
    this.resize();
    const images = this.value("images");
    if (images) {
      this._imageManager.add(images);
    }
    Promise.all(
      this.map("init", {
        parameter,
      }),
    ).then((_res) => {
      this._initDone = true;
    });
  }

  get additionalModifier() {
    return this._additionalModifier!;
  }

  updateAdditionalModifier() {
    const output = this._output()!;
    this._additionalModifier = this.pipe(
      "additionalModifier",
      {},
      {
        alpha: 1,
        x: 0,
        y: 0,
        width: output.width,
        height: output.height,
        widthInPixel: output.width,
        heightInPixel: output.height,
        scaleCanvas: 1,
        visibleScreen: {
          x: 0,
          y: 0,
          width: output.width,
          height: output.height,
        },
        fullScreen: {
          x: 0,
          y: 0,
          width: output.width,
          height: output.height,
        },
      },
    );
  }

  resize() {
    const output = this._output()!;
    this.updateAdditionalModifier();
    this.pipe<ConfigurationObject, "resize">("resize", {});
    this._layerManager.forEach(({ element, isFunction }) => {
      if (!isFunction) {
        (element as ISprite).resize(output, this._additionalModifier!);
      }
    });
  }

  async destroy() {
    const parameter = await this.pipeAsync("destroy", {});
    this._initDone = false;
    return parameter;
  }

  get timing() {
    return this._middleware.t_timing[0] as TimingDefault | TimingAudio;
  }

  get camera() {
    return this._middleware.t_camera[0] as Camera;
  }

  get control() {
    return this._middleware.t_control[0] as CameraControl;
  }

  get totalTimePassed() {
    return this._totalTimePassed;
  }

  _param<K>(
    additionalParameter: K | undefined = undefined,
  ): ParameterListWithoutTime & K {
    return Object.assign(
      {
        engine: this._engine!,
        scene: this,
        imageManager: this._imageManager,
        layerManager: this._layerManager,
        totalTimePassed: this._totalTimePassed,
        output: this._output()!,
      },
      additionalParameter,
    );
  }

  callLoading(args: { timePassed: number; totalTimePassed: number }) {
    if (this._imageManager.isLoaded() && this._initDone) {
      this._endTime = this.value("endTime");
      const progress = "Click to play";
      this.value("loading", {
        ...args,
        progress,
      });
      return true;
    }
    const progress = this._imageManager.count
      ? this._imageManager.loaded / this._imageManager.count
      : "Loading...";

    this.value("loading", {
      ...args,
      progress,
    });
    return false;
  }

  fixedUpdate(timePassed: number, lastCall: boolean) {
    this.map("fixedUpdate", {
      timePassed,
      lastCall,
    });
  }

  isDrawFrame(timePassed: number) {
    return this.pipeMax("isDrawFrame", { timePassed }, timePassed !== 0)!;
  }

  move(timePassed: number) {
    // calc total time
    this._totalTimePassed += timePassed;

    if (this._resetIntend) {
      this.reset();
      // Jump back?
    } else if (timePassed < 0) {
      // Back to the beginning
      timePassed = this._totalTimePassed;
      this.reset();
      this.initSprites();
      this._totalTimePassed = timePassed;
    } else if (this._endTime && this._endTime <= this._totalTimePassed) {
      // set timepassed to match endtime
      timePassed -= this._totalTimePassed - this._endTime;
      this._totalTimePassed = this._endTime;
      // End Engine
      this.map<ConfigurationObject, "end">("end", { timePassed });
    }
    if (this.value("isChunked")) {
      if (this.value<{hasOneChunkedFrame: unknown}, 'hasOneChunkedFrame'>("hasOneChunkedFrame", { timePassed })) {
        // how many frames should be skipped. Maximum is a skip of 2 frames
        const frames = this.value("calcFrames", { timePassed })! - 1;
        for (let calcFrame = 0; calcFrame <= frames; calcFrame++) {
          this.fixedUpdate(this.value("tickChunk", {})!, calcFrame === frames);
        }
      }
    } else {
      this.fixedUpdate(timePassed, true);
    }

    this.map("update", { timePassed });

    this._layerManager.forEach(({ element, isFunction, layer, elementId }) => {
      if (!isFunction) {
        if ((element as ISprite).animate(timePassed)) {
          layer.deleteById(elementId);
        }
      }
    });
  }

  draw(canvasId: number) {
    this.map("draw", { canvasId });
    const context = this._output()!.context[canvasId]!;
    context.save();

    context.setTransform(...this.viewport().m);

    this._layerManager.forEach(
      ({ layer, layerId, element, isFunction, elementId }) => {
        if (isFunction) {
          if (
            (element as ISpriteFunction)(
              this._param({
                layerId,
                elementId,
                layer,
                context,
              }),
            )
          ) {
            layer.deleteById(elementId);
          }
        } else {
          (element as ISprite).draw(context, this._additionalModifier!);
        }
      },
      canvasId,
    );

    context.restore();
  }

  initSprites(canvasId: number | undefined = undefined) {
    const context = this._output()!.context[canvasId || 0]!;
    this._layerManager.forEach(({ element, isFunction }) => {
      if (!isFunction) {
        (element as ISprite).callInit(context, this._additionalModifier!);
      }
    }, canvasId);
    this.map("initSprites", { canvasId });
  }

  resetIntend() {
    this._resetIntend = true;
  }

  reset() {
    this._totalTimePassed = 0;
    this._resetIntend = false;
    let result = this.pipe<
        ConfigurationObject,
      "reset",
      LayerManager | ISpriteFunctionOrSprite[][],
      Record<string, never>
    >("reset", {}, new LayerManager());

    if (Array.isArray(result)) {
      const layers = result;
      result = new LayerManager();
      layers.forEach((v) => {
        (result as LayerManager).addLayer().addElements(v);
      });
    }

    if (result) {
      this._layerManager = result;
    }
  }
}

export default Scene;
