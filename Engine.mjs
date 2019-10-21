import calc from "./func/calc.mjs";

class Engine {
  constructor(canvasOrOptions) {
    let givenOptions = canvasOrOptions;
    if (typeof canvasOrOptions !== "object") {
      throw new Error("No canvas given for Engine constructor");
    }
    if (canvasOrOptions.getContext) {
      givenOptions = {
        canvas: canvasOrOptions
      };
    } else if (!canvasOrOptions.canvas) {
      throw new Error("No canvas given for Engine constructor");
    }
    let options = Object.assign(
      {},
      {
        /* undefined is falsy - saves a few bytes
        scene: null,
        canvas: null,
        autoSize: false,
        clickToPlayAudio: false,
        reduceFramerate: false
        */
      },
      givenOptions
    );

    this._output = {
      canvas: [],
      context: [],
      width: 0,
      height: 0,
      ratio: 1
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
    this._referenceRequestAnimationFrame = null;

    // data about the output canvas
    this._output.canvas = Array.isArray(options.canvas)
      ? options.canvas
      : [options.canvas];

    if (options.autoSize) {
      const defaultAutoSizeSettings = {
        enabled: true,
        scaleLimitMin: 1,
        scaleLimitMax: 3,
        scaleFactor: 1.07,
        referenceWidth: () => this._output.canvas[0].clientWidth,
        referenceHeight: () => this._output.canvas[0].clientHeight,
        currentScale: 1,
        waitTime: 100,
        currentWaitedTime: 0,
        currentOffsetTime: 0,
        offsetTimeLimitUp: 300,
        offsetTimeLimitDown: 300,
        offsetTimeTarget: 25,
        offsetTimeDelta: 10,
        registerResizeEvents: true,
        registerVisibilityEvents: true,
        setCanvasStyle: false
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
        this._events = ["resize", "orientationchange"].map(e => ({
          _node: window,
          _event: e,
          _function: this.recalculateCanvas.bind(this)
        }));
      }
      if (this._autoSize.registerVisibilityEvents) {
        this._events.push({
          _node: document,
          _event: "visibilitychange",
          _function: this.handleVisibilityChange.bind(this)
        });
      }
      this._recalculateCanvas();
    } else {
      this._output.width = this._output.canvas[0].width;
      this._output.height = this._output.canvas[0].height;
      this._output.ratio = this._output.width / this._output.height;
    }
    this._output.canvas.forEach((canvas, index) => {
      this._output.context[index] = canvas.getContext("2d");
    });
    this._canvasCount = this._output.canvas.length;
    this._drawFrame = Array.from({ length: this._canvasCount }, v => 0);

    if (options.clickToPlayAudio) {
      this._events.push({
        _node: this._output.canvas[0],
        _event: "click",
        _function: this.playAudioOfScene.bind(this)
      });
    }

    this._reduceFramerate = options.reduceFramerate;
    // not needed because undefined is falsy
    // this._isOddFrame = true

    this._events.forEach(v => {
      v._node.addEventListener(v._event, v._function);
    });

    this.switchScene(options.scene, options.sceneParameter || {});
  }

  handleVisibilityChange() {
    this._autoSize.enabled = !(document.visibilityState == "hidden");
  }

  playAudioOfScene() {
    if (
      this._isSceneInitialized &&
      this._scene &&
      this._scene.getConfiguration().audioElement
    ) {
      this._scene.getConfiguration().audioElement.play();
    }
  }

  _normalizeContext(ctx) {
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
      const width = calc(this._autoSize.referenceWidth);
      const height = calc(this._autoSize.referenceHeight);
      if (width <= 0 || height <= 0) {
        return;
      }
      this._output.canvas.forEach(canvas => {
        canvas.width = Math.round(width / this._autoSize.currentScale);
        canvas.height = Math.round(height / this._autoSize.currentScale);
        if (this._autoSize.setCanvasStyle) {
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

  resize() {
    if (this._scene && this._scene.resize) {
      this._scene.resize(this._output);
    }
    return this;
  }

  switchScene(scene, sceneParameter) {
    if (scene) {
      this._newScene = scene;
      this._sceneParameter = sceneParameter;
    }
    return this;
  }

  _now() {
    return window.performance ? performance.now() : Date.now();
  }
  run(runParameter) {
    runParameter = runParameter || {};

    function mainLoop(timestamp) {
      this._referenceRequestAnimationFrame = window.requestAnimationFrame(
        mainLoop.bind(this)
      );

      if (
        this._recalculateCanvasIntend &&
        (!this._reduceFramerate || !this._isOddFrame)
      ) {
        this._recalculateCanvas();
        this._recalculateCanvasIntend = false;
        for (let i = 0; i < this._canvasCount; i++) {
          this._drawFrame[i] = Math.max(this._drawFrame[i] - 1, 1);
        }
      } else {
        for (let i = 0; i < this._canvasCount; i++) {
          this._drawFrame[i] = Math.max(this._drawFrame[i] - 1, 0);
        }
      }

      if (!this._realLastTimestamp) {
        this._realLastTimestamp = timestamp;
      }
      if (!this._initializedStartTime) {
        this._initializedStartTime = timestamp;
      }

      if (this._newScene && !this._promiseSceneDestroying) {
        this._promiseSceneDestroying = Promise.resolve(
          this._scene ? this._scene.destroy(this._output) : {}
        );
        this._promiseSceneDestroying.then(destroyParameterForNewScene => {
          this._newScene.callInit(
            this._output,
            {
              run: runParameter,
              scene: this._sceneParameter,
              destroy: destroyParameterForNewScene
            },
            this
          );
          this._scene = this._newScene;
          this._newScene = undefined;
          this._promiseSceneDestroying = undefined;
          this._isSceneInitialized = false;
          this._lastTimestamp = this._scene.currentTime();
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
            this._moveOnce = false
            const drawFrame = this._scene.isDrawFrame(this._output, timePassed);
            if (Array.isArray(drawFrame)) {
              for (let i = 0; i < this._canvasCount; i++) {
                this._drawFrame[i] = Math.max(this._drawFrame[i], drawFrame[i]);
              }
            } else {
              for (let i = 0; i < this._canvasCount; i++) {
                this._drawFrame[i] = Math.max(this._drawFrame[i], drawFrame);
              }
            }

            const nowAutoSize = this._now();
            if (moveFrame) {
              this._scene.move(this._output, timePassed);
            }

            if (this._output.canvas[0].width) {
              for (let index = 0; index < this._canvasCount; index++) {
                if (this._drawFrame[index]) {
                  this._normalizeContext(this._output.context[index]);
                  this._scene.draw(this._output, index);
                }
              }
            }

            if (this._autoSize && this._autoSize.enabled) {
              const deltaTimestamp = timestamp - this._realLastTimestamp;

              if (this._autoSize.currentWaitedTime < this._autoSize.waitTime) {
                this._autoSize.currentWaitedTime += deltaTimestamp;
              } else if (moveFrame) {
                const targetTime =
                  this._autoSize.offsetTimeTarget *
                  (this._reduceFramerate ? 2 : 1);
                const deltaFrame = this._now() - nowAutoSize;
                const delta =
                  (Math.abs(deltaTimestamp - targetTime) >
                  Math.abs(deltaFrame - targetTime)
                    ? deltaTimestamp
                    : deltaFrame) - targetTime;
                if (Math.abs(delta) <= this._autoSize.offsetTimeDelta) {
                  this._autoSize.currentOffsetTime =
                    this._autoSize.currentOffsetTime >= 0
                      ? Math.max(
                          0,
                          this._autoSize.currentOffsetTime -
                            this._autoSize.offsetTimeDelta
                        )
                      : Math.min(
                          0,
                          this._autoSize.currentOffsetTime +
                            this._autoSize.offsetTimeDelta
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
              this._normalizeContext(this._output.context[i]);
            }
            this._isSceneInitialized = this._scene.callLoading({
              output: this._output,
              timePassed: timestamp - this._realLastTimestamp,
              totalTimePassed: timestamp - this._initializedStartTime
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

    this._realLastTimestamp = this._initializedStartTime = false;

    // First call ever
    this._referenceRequestAnimationFrame = window.requestAnimationFrame(
      mainLoop.bind(this)
    );

    return this;
  }

  destroy() {
    this._referenceRequestAnimationFrame &&
      window.cancelAnimationFrame(this._referenceRequestAnimationFrame);
    this._referenceRequestAnimationFrame = null;
    this._scene && this._scene.destroy(this._output);
    this._events.forEach(v => {
      v._node.removeEventListener(v._event, v._function);
    });
    this._events = [];

    return this;
  }
}

export default Engine;
