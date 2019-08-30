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
      /* undefined is falsy - saves a few bytes
      {
        scene: null,
        canvas: null,
        autoSize: false,
        clickToPlayAudio: false,
        reduceFramerate: false
      }, */
      givenOptions
    );

    this._output = {
      canvas: null,
      context: null,
      width: 0,
      height: 0,
      ratio: 1
    };

    // the current _scene-object
    this._scene = null;
    // is a _scene ready for action?
    this._isSceneInitialized = false;
    // new _scene to initialize
    this._newScene = null;

    // time measurement
    this._lastTimestamp = 0;
    this._timePassed = 0;
    this._recalculateCanvas = false;

    // reference to
    this._referenceRequestAnimationFrame = null;

    // data about the output canvas
    this._output.canvas = options.canvas;

    if (options.autoSize) {
      const defaultAutoSizeSettings = {
        enabled: true,
        scaleLimitMin: 1,
        scaleLimitMax: 8,
        scaleFactor: 1.1,
        referenceWidth: () => this._output.canvas.clientWidth,
        referenceHeight: () => this._output.canvas.clientHeight,
        currentScale: 1,
        waitTime: 800,
        currentWaitedTime: 0,
        currentOffsetTime: 0,
        offsetTimeLimitUp: 300,
        offsetTimeLimitDown: 300,
        offsetTimeTarget: 1000 / 60,
        offsetTimeDelta: 3,
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
        window.addEventListener(
          "resize",
          this.recalculateCanvas.bind(this),
          false
        );
        window.addEventListener(
          "orientationchange",
          this.recalculateCanvas.bind(this),
          false
        );
      }
      if (this._autoSize.registerVisibilityEvents) {
        document.addEventListener(
          "visibilitychange",
          this.handleVisibilityChange.bind(this),
          false
        );
      }
      this.recalculateCanvas();
    } else {
      this._output.width = this._output.canvas.width;
      this._output.height = this._output.canvas.height;
      this._output.ratio = this._output.width / this._output.height;
    }
    this._output.context = options.canvas.getContext("2d");

    if (options.clickToPlayAudio) {
      options.canvas.addEventListener(
        "click",
        this.playAudioOfScene.bind(this),
        false
      );
    }

    this._reduceFramerate = options.reduceFramerate;
    // not needed because undefined is falsy
    // this._isOddFrame = true

    this.switchScene(options.scene);
  }

  handleVisibilityChange() {
    this._autoSize.enabled = !(document.visibilityState == "hidden");
  }

  playAudioOfScene() {
    if (this._isSceneInitialized && this._scene && this._scene.audioElement) {
      this._scene.audioElement.play();
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

  recalculateCanvas() {
    if (this._autoSize) {
      const width = calc(this._autoSize.referenceWidth);
      const height = calc(this._autoSize.referenceHeight);
      if (width <= 0 || height <= 0) {
        return;
      }
      this._output.canvas.width = Math.round(
        width / this._autoSize.currentScale
      );
      this._output.canvas.height = Math.round(
        height / this._autoSize.currentScale
      );
      if (this._autoSize.setCanvasStyle) {
        this._output.canvas.style.width = `${width}px`;
        this._output.canvas.style.height = `${height}px`;
      }
      this._autoSize.currentWaitedTime = 0;
      this._autoSize.currentOffsetTime = 0;
    }

    this._output.width = this._output.canvas.width;
    this._output.height = this._output.canvas.height;
    this._output.ratio = this._output.width / this._output.height;

    this.resize();
    return this;
  }

  resize() {
    if (this._scene && this._scene.resize) {
      this._scene.resize(this._output);
    }
    return this;
  }

  switchScene(scene) {
    if (scene) {
      this._newScene = scene;
    }
    return this;
  }

  _now() {
    return window.performance ? performance.now() : Date.now();
  }
  run(initParameter) {
    initParameter = initParameter || {};

    function mainLoop(timestamp) {
      this._referenceRequestAnimationFrame = window.requestAnimationFrame(
        mainLoop.bind(this)
      );

      if (
        this._recalculateCanvas &&
        !(this._reduceFramerate && this._isOddFrame)
      ) {
        this.recalculateCanvas();
        this._recalculateCanvas = false;
      }
      if (!this._realLastTimestamp) {
        this._realLastTimestamp = timestamp;
      }

      if (this._newScene !== null) {
        let parameterForNewScene = this._scene
          ? this._scene.destroy(this._output)
          : initParameter;
        if (parameterForNewScene) {
          this._newScene.callInit(this._output, parameterForNewScene, this);
          this._scene = this._newScene;
          this._newScene = null;
          this._isSceneInitialized = false;
        }
      }

      if (this._scene && this._output.canvas.width) {
        if (this._reduceFramerate) {
          this._isOddFrame = !this._isOddFrame;
        }
        if (!this._reduceFramerate || this._isOddFrame) {
          let now = this._scene.currentTime();

          // modify time by scene
          // first set a min/max
          this._timePassed = this._scene.clampTime(now - this._lastTimestamp);
          // then maybe shift to fit a framerate
          const shiftTime = this._scene.shiftTime(this._timePassed);
          this._timePassed = this._timePassed + shiftTime;
          this._lastTimestamp = now + shiftTime;

          this._normalizeContext(this._output.context);
          if (this._isSceneInitialized) {
            if (this._timePassed !== 0) {
              const nowAutoSize = this._now();
              this._scene.move(this._output, this._timePassed);

              // if timepassed is negativ scene will do a reset. timepassed have to be the full new time
              if (this._timePassed < 0) {
                this._timePassed = this._scene.totalTimePassed;
              }

              this._scene.draw(this._output);

              if (this._autoSize && this._autoSize.enabled) {
                const deltaTimestamp =
                  timestamp - this._realLastTimestamp - targetTime;

                if (
                  this._autoSize.currentWaitedTime < this._autoSize.waitTime
                ) {
                  this._autoSize.currentWaitedTime += deltaTimestamp;
                } else {
                  const targetTime =
                    this._autoSize.offsetTimeTarget *
                    (this._reduceFramerate ? 2 : 1);
                  const deltaFrame = this._now() - nowAutoSize - targetTime;
                  const delta =
                    Math.abs(deltaTimestamp) > Math.abs(deltaFrame)
                      ? deltaTimestamp
                      : deltaFrame;
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
                          this._autoSize.currentScale /
                            this._autoSize.scaleFactor
                        );
                        this._recalculateCanvas = true;
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
                          this._autoSize.currentScale *
                            this._autoSize.scaleFactor
                        );
                        this._recalculateCanvas = true;
                      }
                    }
                  }
                }
              }
            }
          } else {
            this._isSceneInitialized = this._scene.callLoading(this._output);
            if (this._isSceneInitialized) {
              this._scene.reset(this._output);
              if (this._autoSize) {
                this._autoSize.currentWaitedTime = 0;
              }
            }
          }
        }
      }
      this._realLastTimestamp = timestamp;
    }

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
    window.removeEventListener(
      "resize",
      this.recalculateCanvas.bind(this),
      false
    );
    window.removeEventListener(
      "orientationchange",
      this.recalculateCanvas.bind(this),
      false
    );
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange.bind(this),
      false
    );
    this._output.canvas.removeEventListener(
      "click",
      this.playAudioOfScene.bind(this),
      false
    );
    return this;
  }
}

export default Engine;
