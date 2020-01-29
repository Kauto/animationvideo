import ImageManager from "../ImageManager.mjs";
import LayerManager from "../LayerManager.mjs";
import calc from "../func/calc.mjs";
import TimingDefault from '../Timing/Default.mjs';

class Scene {
  constructor(configurationClassOrObject) {
    if (typeof configurationClassOrObject === "function") {
      this._configuration = new configurationClassOrObject();
    } else {
      this._configuration = configurationClassOrObject;
    }

    // Layer consists of Sprites
    this._layerManager = new LayerManager();

    this._engine = null;
    this._initDone = false;
    this._additionalModifier = undefined;
    this._imageManager = ImageManager;

    this._timing = this._configuration.timing || new TimingDefault()
  }

  currentTime() {
    return this._timing.currentTime()
  }

  clampTime(timePassed) {
    return this._timing.clampTime(timePassed) 
  }

  shiftTime(timePassed) {
    return this._timing.shiftTime(timePassed)
  }

  callInit(output, parameter, engine) {
    this._engine = engine;
    this.resize(output);
    const images = calc(this._configuration.images);
    if (images) {
      this._imageManager.add(images);
    }
    this._timing.init();
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
        layerManager: this._layerManager,
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
    const timingLoaded = this._timing.isLoaded()
    if (this._imageManager.isLoaded() && this._initDone && timingLoaded) {
      if (!this._configuration.endTime && timingLoaded !== true) {
        this._configuration.endTime = timingLoaded;
      }
      args.progress = "Click to play";
      this.loadingScreen(args);
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
        totalTimePassed: this._timing.totalTimePassed,
        imageManager: this._imageManager,
        lastCall
      });
    }
  }

  isDrawFrame(output, timePassed) {
    return this._configuration.isDrawFrame
      ? this._configuration.isDrawFrame({
          engine: this._engine,
          scene: this,
          layerManager: this._layerManager,
          output,
          timePassed,
          totalTimePassed: this._timing.totalTimePassed,
          imageManager: this._imageManager
        })
      : timePassed !== 0;
  }

  move(output, timePassed) {
    // calc total time
    this._timing.totalTimePassed += timePassed;

    // Jump back?
    if (timePassed < 0) {
      // Back to the beginning
      timePassed = this._timing.totalTimePassed;
      this.reset();
      this._timing.totalTimePassed = timePassed;
    } else if (
      this._configuration.endTime &&
      this._configuration.endTime <= this._timing.totalTimePassed
    ) {
      // set timepassed to match endtime
      timePassed -= this._timing.totalTimePassed - this._configuration.endTime;
      this._timing.totalTimePassed = this._configuration.endTime;
      // End Engine
      this._configuration.end &&
        this._configuration.end({
          engine: this._engine,
          scene: this,
          output,
          timePassed,
          totalTimePassed: this._timing.totalTimePassed,
          imageManager: this._imageManager
        });
    }

    if (this._timing.isChunked()) {
      if (this._timing.hasOneChunkedFrame(timePassed)) {
        // how many frames should be skipped. Maximum is a skip of 2 frames
        const frames = this._timing.calcFrames(timePassed) - 1;
        for (let calcFrame = 0; calcFrame <= frames; calcFrame++) {
          this.fixedUpdate(output, this._timing.tickChunk, calcFrame === frames);
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
        totalTimePassed: this._timing.totalTimePassed,
        imageManager: this._imageManager
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
            totalTimePassed: this._timing.totalTimePassed,
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
    this._timing.totalTimePassed = 0;
    let result = this._configuration.reset
      ? this._configuration.reset({
          engine: this._engine,
          scene: this,
          layerManager: this._layerManager,
          output: this._engine.getOutput(),
          imageManager: this._imageManager
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
