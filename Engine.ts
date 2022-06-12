import calc from "./func/calc.js";
import toArray from "./func/toArray.js";
import type TimingAudio from "./Middleware/TimingAudio.js";
import type Scene from './Scene'

export interface EngineOptions {
  canvas: HTMLCanvasElement
  scene?: null | Scene
  sceneParameter?: Record<any, any>
  autoSize?: AutoSizeSettings
  clickToPlayAudio?: boolean
  reduceFramerate?: boolean
}

export interface AutoSizeSettings {
  enabled: boolean
  scaleLimitMin: number
  scaleLimitMax: number
  scaleFactor: number
  referenceWidth: () => number
  referenceHeight: () => number
  currentScale: number
  waitTime: number
  currentWaitedTime: number
  currentOffsetTime: number
  offsetTimeLimitUp: number
  offsetTimeLimitDown: number
  registerResizeEvents: boolean
  registerVisibilityEvents: boolean
  setCanvasStyle: boolean
  offsetTimeTarget?: number
  offsetTimeDelta?: number
}

interface EventSafe {
  n: HTMLElement | Window & typeof globalThis | Document
  e: string
  f: EventListenerOrEventListenerObject,
}

export interface OutputInfo {
  canvas: HTMLCanvasElement[],
  context: CanvasRenderingContext2D[],
  width: number,
  height: number,
  ratio: number,
}


class Engine {
  _output: OutputInfo
  _events: EventSafe[]
  _scene: null | Scene | undefined
  _newScene: undefined | null | Scene
  _sceneParameter: undefined | Record<any, any>
  _isSceneInitialized: boolean
  _recalculateCanvasIntend: boolean
  _lastTimestamp: number
  _referenceRequestAnimationFrame: number | undefined
  _autoSize: undefined | AutoSizeSettings
  _canvasCount: number
  _drawFrame: number[]
  _reduceFramerate: boolean
  _realLastTimestamp: number | undefined
  _isOddFrame: boolean = false
  _initializedStartTime: number | undefined
  _promiseSceneDestroying: Promise<any> | undefined
  _runParameter: undefined | Record<any, any>
  _moveOnce: boolean = false

  constructor(canvasOrOptions: HTMLCanvasElement | EngineOptions) {
    let givenOptions: EngineOptions = canvasOrOptions as EngineOptions;
    if (typeof canvasOrOptions !== "object") {
      throw new Error("No canvas given for Engine constructor");
    }
    if ((canvasOrOptions as HTMLCanvasElement).getContext) {
      givenOptions = {
        canvas: canvasOrOptions as HTMLCanvasElement,
      };
    } else if (!(canvasOrOptions as EngineOptions).canvas) {
      throw new Error("No canvas given for Engine constructor");
    }
    let options: EngineOptions = Object.assign(
      {},
      givenOptions
    );

    this._output = {
      canvas: [],
      context: [],
      width: 0,
      height: 0,
      ratio: 1,
    };

    // list of binded events
    this._events = [];

    // the current _scene-object
    this._scene = null;
    // is a _scene ready for action?
    this._isSceneInitialized = false;
    // new _scene to initialize
    // this._newScene = undefined;
    // this._promiseSceneDestroying = undefined;

    // time measurement
    this._lastTimestamp = 0;
    this._recalculateCanvasIntend = false;

    // reference to
    this._referenceRequestAnimationFrame = undefined;

    // data about the output canvas
    this._output.canvas = toArray(options.canvas);

    if (options.autoSize) {
      const defaultAutoSizeSettings: AutoSizeSettings = {
        enabled: true,
        scaleLimitMin: 1,
        scaleLimitMax: 2.5,
        scaleFactor: 1.07,
        referenceWidth: () => this._output.canvas[0].clientWidth,
        referenceHeight: () => this._output.canvas[0].clientHeight,
        currentScale: 1,
        waitTime: 100,
        currentWaitedTime: 0,
        currentOffsetTime: 0,
        offsetTimeLimitUp: 300,
        offsetTimeLimitDown: 300,
        // undefined will be autodetect timing
        // offsetTimeTarget: 25,
        // offsetTimeDelta: 10,
        registerResizeEvents: true,
        registerVisibilityEvents: true,
        setCanvasStyle: false,
      };
      if (typeof options.autoSize === "object") {
        this._autoSize = Object.assign(
          {},
          defaultAutoSizeSettings,
          options.autoSize
        );
      } else {
        this._autoSize = defaultAutoSizeSettings;
      }
      if (this._autoSize.registerResizeEvents) {
        this._events = ["resize", "orientationchange"].map((e) => ({
          n: window,
          e: e,
          f: this.recalculateCanvas.bind(this),
        }));
      }
      if (this._autoSize.registerVisibilityEvents) {
        this._events.push({
          n: document,
          e: "visibilitychange",
          f: this.handleVisibilityChange.bind(this),
        });
      }
      this._recalculateCanvas();
    } else {
      this._output.width = this._output.canvas[0].width;
      this._output.height = this._output.canvas[0].height;
      this._output.ratio = this._output.width / this._output.height;
    }
    this._output.canvas.forEach((canvas, index) => {
      this._output.context[index] = canvas.getContext("2d")!;
    });
    this._canvasCount = this._output.canvas.length;
    this._drawFrame = Array.from({ length: this._canvasCount }, (v) => 0);

    if (options.clickToPlayAudio) {
      this._events.push({
        n: this._output.canvas[0],
        e: "click",
        f: this.playAudioOfScene.bind(this),
      });
    }

    this._reduceFramerate = !!options.reduceFramerate;

    this._events.forEach((v) => {
      v.n.addEventListener(v.e, v.f);
    });

    this.switchScene(options.scene, options.sceneParameter || {});
  }

  handleVisibilityChange() {
    if (this._autoSize) this._autoSize.enabled = !(document.visibilityState == "hidden");
  }

  playAudioOfScene() {
    if (
      this._isSceneInitialized &&
      this._scene &&
      (this._scene.timing as TimingAudio).audioElement
    ) {
      (this._scene.timing as TimingAudio).audioElement!.play();
    }
  }

  normContext(ctx: CanvasRenderingContext2D) {
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  getWidth() {
    return this._output.width;
  }

  getHeight() {
    return this._output.height;
  }

  getRatio() {
    return this._output.ratio;
  }

  getOutput() {
    return this._output;
  }

  recalculateCanvas() {
    this._recalculateCanvasIntend = true;
    return this;
  }

  _recalculateCanvas() {
    if (this._autoSize) {
      const width = calc<number>(this._autoSize.referenceWidth);
      const height = calc<number>(this._autoSize.referenceHeight);
      if (width <= 0 || height <= 0) {
        return;
      }
      this._output.canvas.forEach((canvas) => {
        canvas.width = Math.round(width / this._autoSize!.currentScale);
        canvas.height = Math.round(height / this._autoSize!.currentScale);
        if (this._autoSize!.setCanvasStyle) {
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
        }
      });
      this._autoSize.currentWaitedTime = 0;
      this._autoSize.currentOffsetTime = 0;
    }

    this._output.width = this._output.canvas[0].width;
    this._output.height = this._output.canvas[0].height;
    this._output.ratio = this._output.width / this._output.height;

    this.resize();
  }

  async recalculateFPS() {
    if (this._referenceRequestAnimationFrame) {
      window.cancelAnimationFrame(this._referenceRequestAnimationFrame);
      this._referenceRequestAnimationFrame = undefined;
    }
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const start = this._now();
    const count = 3;
    for (let i = count; i--;) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    const timeBetweenFrames = (this._now() - start) / count;
    this._autoSize!.offsetTimeTarget = timeBetweenFrames;
    this._autoSize!.offsetTimeDelta = timeBetweenFrames / 3;

    if (this._referenceRequestAnimationFrame === undefined) {
      this._realLastTimestamp = undefined;
      this._referenceRequestAnimationFrame = window.requestAnimationFrame(
        this._mainLoop.bind(this)
      );
    }
  }

  resize() {
    if (this._scene && this._scene.resize) {
      this._scene.resize();
    }
    return this;
  }

  switchScene(scene: Scene | null | undefined, sceneParameter: undefined | Record<any, any> = undefined) {
    if (scene) {
      this._newScene = scene;
      this._sceneParameter = sceneParameter;
    }
    return this;
  }

  _now() {
    return window.performance ? performance.now() : Date.now();
  }

  _mainLoop(timestamp:number) {
    if (!this._referenceRequestAnimationFrame) return;
    this._referenceRequestAnimationFrame = window.requestAnimationFrame(
      this._mainLoop.bind(this)
    );

    let isRecalculatedCanvas =
      this._recalculateCanvasIntend &&
      (!this._reduceFramerate || !this._isOddFrame);

    if (isRecalculatedCanvas) {
      this._recalculateCanvas();
      this._recalculateCanvasIntend = false;
    }

    for (let i = 0; i < this._canvasCount; i++) {
      this._drawFrame[i] = Math.max(
        this._drawFrame[i] - 1,
        isRecalculatedCanvas ? 1 : 0
      );
    }

    if (!this._realLastTimestamp) {
      this._realLastTimestamp = timestamp;
    }
    if (!this._initializedStartTime) {
      this._initializedStartTime = timestamp;
    }

    if (this._newScene && !this._promiseSceneDestroying) {
      this._promiseSceneDestroying = Promise.resolve(
        this._scene ? this._scene.destroy() : undefined
      );
      this._promiseSceneDestroying.then((destroyParameterForNewScene) => {
        this._newScene!.callInit(
          {
            run: this._runParameter,
            scene: this._sceneParameter,
            destroy: destroyParameterForNewScene,
          },
          this
        );
        this._scene = this._newScene;
        this._newScene = undefined;
        this._promiseSceneDestroying = undefined;
        this._isSceneInitialized = false;
        this._lastTimestamp = this._scene!.currentTime();
        this._initializedStartTime = timestamp;
      });
    }

    if (this._scene) {
      if (this._reduceFramerate) {
        this._isOddFrame = !this._isOddFrame;
      }

      if (!this._reduceFramerate || this._isOddFrame) {
        let now = this._scene.currentTime();

        // modify time by scene
        // first set a min/max
        let timePassed = this._scene.clampTime(now - this._lastTimestamp);
        // then maybe shift to fit a framerate
        const shiftTime = this._scene.shiftTime(timePassed);
        timePassed = timePassed + shiftTime;
        this._lastTimestamp = now + shiftTime;

        if (this._isSceneInitialized) {
          const moveFrame = timePassed !== 0 || this._moveOnce;
          this._moveOnce = false;

          const nowAutoSize = this._now();

          if (this._output.canvas[0].width) {
            for (let index = 0; index < this._canvasCount; index++) {
              const ctx = this._output.context[index];
              this.normContext(ctx);
              this._scene.initSprites(index);
              //this.normContext(ctx);
            }
          }

          const drawFrame = this._scene.isDrawFrame(timePassed);
          if (Array.isArray(drawFrame)) {
            for (let i = 0; i < this._canvasCount; i++) {
              this._drawFrame[i] = Math.max(
                this._drawFrame[i],
                drawFrame[i],
                0
              );
            }
          } else {
            for (let i = 0; i < this._canvasCount; i++) {
              this._drawFrame[i] = Math.max(this._drawFrame[i], drawFrame, 0);
            }
          }

          if (moveFrame) {
            this._scene.move(timePassed);
          }

          if (this._output.canvas[0].width) {
            for (let index = 0; index < this._canvasCount; index++) {
              if (this._drawFrame[index]) {
                this._scene.draw(index);
              }
            }
          }

          if (this._autoSize && this._autoSize.enabled) {
            const deltaTimestamp = timestamp - this._realLastTimestamp;

            if (this._autoSize.currentWaitedTime < this._autoSize.waitTime) {
              this._autoSize.currentWaitedTime += deltaTimestamp;
            } else if (moveFrame) {
              const targetTime =
                this._autoSize.offsetTimeTarget! *
                (this._reduceFramerate ? 2 : 1);
              const deltaFrame = this._now() - nowAutoSize;
              const delta =
                (Math.abs(deltaTimestamp - targetTime) >
                  Math.abs(deltaFrame - targetTime)
                  ? deltaTimestamp
                  : deltaFrame) - targetTime;
              if (Math.abs(delta) <= this._autoSize.offsetTimeDelta!) {
                this._autoSize.currentOffsetTime =
                  this._autoSize.currentOffsetTime >= 0
                    ? Math.max(
                      0,
                      this._autoSize.currentOffsetTime -
                      this._autoSize.offsetTimeDelta!
                    )
                    : Math.min(
                      0,
                      this._autoSize.currentOffsetTime +
                      this._autoSize.offsetTimeDelta!
                    );
              } else {
                if (
                  delta < 0 &&
                  this._autoSize.currentScale > this._autoSize.scaleLimitMin
                ) {
                  this._autoSize.currentOffsetTime += delta;
                  if (
                    this._autoSize.currentOffsetTime <=
                    -this._autoSize.offsetTimeLimitDown
                  ) {
                    this._autoSize.currentScale = Math.max(
                      this._autoSize.scaleLimitMin,
                      this._autoSize.currentScale / this._autoSize.scaleFactor
                    );
                    this._recalculateCanvasIntend = true;
                  }
                } else if (
                  delta > 0 &&
                  this._autoSize.currentScale < this._autoSize.scaleLimitMax
                ) {
                  this._autoSize.currentOffsetTime += delta;
                  if (
                    this._autoSize.currentOffsetTime >=
                    this._autoSize.offsetTimeLimitUp
                  ) {
                    this._autoSize.currentScale = Math.min(
                      this._autoSize.scaleLimitMax,
                      this._autoSize.currentScale * this._autoSize.scaleFactor
                    );
                    this._recalculateCanvasIntend = true;
                  }
                }
              }
            }
          }
        } else {
          for (let i = 0; i < this._canvasCount; i++) {
            this.normContext(this._output.context[i]);
          }
          this._isSceneInitialized = this._scene.callLoading({
            timePassed: timestamp - this._realLastTimestamp,
            totalTimePassed: timestamp - this._initializedStartTime,
          });
          if (this._isSceneInitialized) {
            this._scene.reset();
            this._lastTimestamp = this._scene.currentTime();
            this._moveOnce = true;
            if (this._autoSize) {
              this._autoSize.currentWaitedTime = 0;
            }
          }
        }
      }
    }
    this._realLastTimestamp = timestamp;
  }

  async run(runParameter: Record<any, any>) {
    this._runParameter = runParameter || {};

    await this.stop();

    this._realLastTimestamp = this._initializedStartTime = undefined;

    if (this._autoSize && !this._autoSize.offsetTimeTarget) {
      await this.recalculateFPS();
    }

    // First call ever
    this._referenceRequestAnimationFrame = window.requestAnimationFrame(
      this._mainLoop.bind(this)
    );

    return this;
  }

  async stop() {
    if (this._referenceRequestAnimationFrame) {
      window.cancelAnimationFrame(this._referenceRequestAnimationFrame);
    }
    this._referenceRequestAnimationFrame = undefined;
    this._scene && (await this._scene.destroy());
  }

  async destroy() {
    await this.stop();
    this._events.forEach((v) => {
      v.n.removeEventListener(v.e, v.f);
    });
    this._events = [];

    return this;
  }
}

export default Engine;
