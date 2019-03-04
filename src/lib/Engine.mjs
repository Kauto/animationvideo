class Engine {
  constructor(canvasOrOptions) {
    let givenOptions = canvasOrOptions;
    if (typeof canvasOrOptions !== "object") {
      throw new Error("No canvas given for Engine constructor");
    }
    if (canvasOrOptions.tagName) {
      givenOptions = {
        canvas: canvasOrOptions
      };
    } else if (!canvasOrOptions.canvas) {
      throw new Error("No canvas given for Engine constructor");
    }
    let options = Object.assign({},
      {
        scene: null,
        canvas: null,
        autoresize: false
      },
      givenOptions
    );
    
    this._output = {
      canvas: null,
      context: null,
      w: 0,
      h: 0,
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

    // reference to
    this._referenceRequestAnimationFrame = null;

    // data about the _output canvas
    this._output.canvas = options.canvas;
    if (!(typeof options.canvas === "object" && options.canvas !== null && options.canvas.getContext)) {
      throw new Error("Countn't create contect for canvas in Engine");
    }
    this._output.context = options.canvas.getContext("2d");
    this._output.w = this._output.canvas.width;
    this._output.h = this._output.canvas.height;
    this._output.ratio = this._output.w / this._output.h;

    if (options.autoresize) {
      window.addEventListener("resize", this.maximizeCanvas, false);
      window.addEventListener("orientationchange", this.maximizeCanvas, false);
      this.resize();

      options.canvas.addEventListener(
        "click",
        () => {
          if (this._isSceneInitialized && this._scene.audioElement) {
            this._scene.audioElement.play();
          }
        },
        false
      );
    }
    this.switchScene(options.scene);
    this.normalizeContext(this._output.context);
  }

  normalizeContext(ctx) {
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  getWidth() {
    return this._output.w;
  }

  getHeight() {
    return this._output.h;
  }

  maximizeCanvas() {
    let gameArea = self.output.canvas;
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    let newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > self.output.ratio) {
      newWidth = newHeight * self.output.ratio;
      gameArea.style.height = newHeight + "px";
      gameArea.style.width = newWidth + "px";
    } else {
      newHeight = newWidth / self.output.ratio;
      gameArea.style.width = newWidth + "px";
      gameArea.style.height = newHeight + "px";
    }

    gameArea.style.marginTop = -newHeight / 2 + "px";
    gameArea.style.marginLeft = -newWidth / 2 + "px";

    $(self.output.canvas).css({
      width: newWidth,
      height: newHeight
    });
    $(self.output.canvas)
      .siblings()
      .css({
        width: newWidth
      });
  }

  switchScene(scene) {
    if (scene) {
      this._newScene = scene;
    }
    return this;
  }

  loadingscreen() {
    let ctx = this._output.context;
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, this._output.w, this._output.h);

    ctx.font = "20px Georgia";
    ctx.fillStyle = "#FFF";
    let percent = this._isSceneInitialized ? this._scene.getPercentLoaded() : 0;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(
      "Loading " + percent + "%",
      10 + Math.random() * 3,
      this._output.h - 10 + Math.random() * 3
    );

    this.normalizeContext(ctx);
  }

  run(initParameter) {
    initParameter = initParameter || {};

    function mainLoop() {
      this._referenceRequestAnimationFrame = window.requestAnimationFrame(
        mainLoop.bind(this)
      );

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

      if (this._scene) {
        let now = this._scene.currentTime();
        this._timePassed = this._scene.clampTime(now - this._lastTimestamp);

        this._lastTimestamp = now;

        if (this._isSceneInitialized) {
          if (this._timePassed !== 0) {
            this._scene.move(this._output, this._timePassed);

            // if timepassed is negativ scene will do a reset. timepassed have to be the full new time
            if (this._timePassed < 0) {
              this._timePassed = this._scene.totalTimePassed;
            }

            this._scene.draw(this._output);
          }
        } else {
          this._isSceneInitialized = this._scene.callLoading(this._output);
        }
      }
    }

    // First call ever
    this._referenceRequestAnimationFrame = window.requestAnimationFrame(
      mainLoop.bind(this)
    );
  }

  destroy() {
    this._referenceRequestAnimationFrame &&
      window.cancelAnimationFrame(this._referenceRequestAnimationFrame);
    this._referenceRequestAnimationFrame = null;
  }
}

export default Engine;
