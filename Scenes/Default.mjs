import ImageManager from "../ImageManager.mjs";
import LayerManager from "../LayerManager.mjs";
import calc from "../func/calc.mjs";
import ifNull from "../func/ifnull.mjs";

class Scene {
  constructor(configurationClassOrObject) {
    if (typeof configurationClassOrObject === "function") {
      this._configuration = new configurationClassOrObject();
    } else {
      this._configuration = configurationClassOrObject;
    }

    // Layer consists of Sprites
    this._layerManager = new LayerManager();

    this._totalTimePassed = 0;

    this._engine = null;
    this._initDone = false;
    this._additionalModifier = undefined;
    this._imageManager = ImageManager;

    this._tickChunk = ifNull(calc(this._configuration.tickChunk), 100 / 6);
    this._maxSkippedTickChunk = ifNull(
      calc(this._configuration.maxSkippedTickChunk),
      120
    );
    this._tickChunkTolerance = ifNull(
      calc(this._configuration.tickChunkTolerance),
      0.1
    );
  }

  currentTime() {
    return window.performance ? performance.now() : Date.now();
  }

  clampTime(timePassed) {
    const maxTime = this._tickChunk
      ? this._tickChunk * this._maxSkippedTickChunk
      : 2000;
    if (timePassed > maxTime) {
      return maxTime;
    }
    return timePassed;
  }

  shiftTime(timePassed) {
    return this._tickChunk ? -(timePassed % this._tickChunk) : 0;
  }

  callInit(output, parameter, engine) {
    this._engine = engine;
    this.resize(output);
    const images = calc(this._configuration.images);
    if (images) {
      this._imageManager.add(images);
    }
    Promise.resolve(
      this._configuration.init &&
        this._configuration.init({
          engine,
          output,
          scene: this,
          parameter,
          imageManager: this._imageManager
        })
    ).then(res => (this._initDone = true));
  }

  resize(output) {
    this._additionalModifier = {
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
        height: output.height
      },
      fullScreen: {
        x: 0,
        y: 0,
        width: output.width,
        height: output.height
      }
    };
    this._layerManager.forEach(({ layer, element, isFunction, index }) => {
      if (!isFunction) {
        element.resize(output, this._additionalModifier);
      }
    });
  }

  destroy(output) {
    const parameter =
      this._configuration.destroy &&
      this._configuration.destroy({
        engine: this._engine,
        scene: this,
        output,
        imageManager: this._imageManager
      });
    this._initDone = false;
    return parameter;
  }

  getConfiguration() {
    return this._configuration;
  }

  loadingScreen({ output, timePassed, totalTimePassed, progress }) {
    if (this._configuration.loading) {
      return this._configuration.loading({
        engine: this._engine,
        scene: this,
        output,
        timePassed,
        totalTimePassed,
        progress,
        imageManager: this._imageManager
      });
    }
    const ctx = output.context[0];
    const loadedHeight =
      typeof progress === "number"
        ? Math.max(1, progress * output.height)
        : output.height;
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, output.width, output.height);
    ctx.fillStyle = "#aaa";
    ctx.fillRect(
      0,
      output.height / 2 - loadedHeight / 2,
      output.width,
      loadedHeight
    );
    ctx.font = "20px Georgia";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";

    ctx.fillText(
      isNaN(parseFloat(progress))
        ? progress
        : "Loading " + Math.round(100 * progress) + "%",
      10 + Math.random() * 3,
      output.height - 10 + Math.random() * 3
    );
  }

  callLoading(args) {
    if (this._imageManager.isLoaded() && this._initDone) {
      return true;
    }
    args.progress = this._imageManager.getCount()
      ? this._imageManager.getLoaded() / this._imageManager.getCount()
      : "Loading...";

    this.loadingScreen(args);
    return false;
  }

  fixedUpdate(output, timePassed, lastCall) {
    if (this._configuration.fixedUpdate) {
      this._configuration.fixedUpdate({
        engine: this._engine,
        scene: this,
        layerManager: this._layerManager,
        output,
        timePassed,
        totalTimePassed: this._totalTimePassed,
        lastCall
      });
    }
  }

  isFrameToSkip(output, timePassed) {
    return this._configuration.isFrameToSkip
      ? this._configuration.isFrameToSkip({
          engine: this._engine,
          scene: this,
          layerManager: this._layerManager,
          output,
          timePassed,
          totalTimePassed: this._totalTimePassed
        })
      : timePassed === 0;
  }

  move(output, timePassed) {
    // calc total time
    this._totalTimePassed += timePassed;

    // Jump back?
    if (timePassed < 0) {
      // Back to the beginning
      timePassed = this._totalTimePassed;
      this.reset();
      this._totalTimePassed = timePassed;
    } else if (
      this._configuration.endTime &&
      this._configuration.endTime <= this._totalTimePassed
    ) {
      // set timepassed to match endtime
      timePassed -= this._totalTimePassed - this._configuration.endTime;
      this._totalTimePassed = this._configuration.endTime;
      // End Engine
      this._configuration.end &&
        this._configuration.end({
          engine: this._engine,
          scene: this,
          output,
          timePassed,
          totalTimePassed: this._totalTimePassed
        });
    }

    if (this._tickChunk) {
      if (timePassed >= this._tickChunk - this._tickChunkTolerance) {
        // how many frames should be skipped. Maximum is a skip of 2 frames
        const frames =
          Math.min(
            this._maxSkippedTickChunk,
            Math.floor(
              (timePassed + this._tickChunkTolerance) / this._tickChunk
            )
          ) - 1;
        for (let calcFrame = 0; calcFrame <= frames; calcFrame++) {
          this.fixedUpdate(output, this._tickChunk, calcFrame === frames);
        }
      }
    } else {
      this.fixedUpdate(output, timePassed, true);
    }

    if (this._configuration.update) {
      this._configuration.update({
        engine: this._engine,
        scene: this,
        layerManager: this._layerManager,
        output,
        timePassed,
        totalTimePassed: this._totalTimePassed
      });
    }

    this._layerManager.forEach(({ element, isFunction, layer, index }) => {
      if (!isFunction) {
        if (element.animate(timePassed)) {
          layer.deleteById(index);
        }
      }
    });
  }

  draw(output, canvasId) {
    const context = output.context[canvasId]
    this._layerManager.forEach(({ layer, element, isFunction, index }) => {
      if (isFunction) {
        if (
          element({
            engine: this._engine,
            scene: this,
            layerManager: this._layerManager,
            layer,
            output,
            context,
            totalTimePassed: this._totalTimePassed,
            imageManager: this._imageManager
          })
        ) {
          layer.deleteById(index);
        }
      } else {
        element.draw(context, this._additionalModifier);
      }
    }, canvasId);
  }

  reset() {
    this._totalTimePassed = 0;
    let result = this._configuration.reset
      ? this._configuration.reset({
          engine: this._engine,
          scene: this,
          layerManager: this._layerManager,
          output: this._engine.getOutput()
        })
      : new LayerManager();

    if (Array.isArray(result)) {
      const layers = result;
      result = new LayerManager();
      layers.forEach(v => {
        result.addLayer().addElements(v);
      });
    }

    if (result) {
      this._layerManager = result;
    }
  }
}

export default Scene;
