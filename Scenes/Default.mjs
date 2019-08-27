import ImageManager from "../ImageManager.mjs";
import LayerManager from "../LayerManager.mjs";
import calc from "../func/calc.mjs";
import ifNull from "../func/ifnull.mjs";

class Scene {
  constructor(configurationClassOrObject) {
    if (typeof configurationClassOrObject === "function") {
      this.configuration = new configurationClassOrObject();
    } else {
      this.configuration = configurationClassOrObject;
    }

    // Layer consists of Sprites
    this.layerManager = new LayerManager();

    this.totalTimePassed = 0;

    this.engine = null;
    this.initDone = false;
    this.additionalModifier = undefined;

    this.tickChunk = ifNull(calc(this.configuration.tickChunk), 100 / 6);
    this.maxSkippedTickChunk = ifNull(
      calc(this.configuration.maxSkippedTickChunk),
      3
    );
    this.tickChunkTolerance = ifNull(
      calc(this.configuration.tickChunkTolerance),
      0.1
    );
  }

  currentTime() {
    return window.performance ? performance.now() : Date.now();
  }

  clampTime(timePassed) {
    let maxTime = 2000;
    if (this.tickChunk) {
      maxTime = this.tickChunk * this.maxSkippedTickChunk;
    }
    if (timePassed > maxTime) {
      return maxTime;
    }
    return timePassed;
  }

  shiftTime(timePassed) {
    if (!this.configuration.fixedUpdate) {
      return 0;
    }
    return -(timePassed % this.tickChunk);
  }

  callInit(output, parameter, engine) {
    this.engine = engine;
    this.resize(output);
    const images = calc(this.configuration.images);
    if (images) {
      ImageManager.add(images);
    }
    Promise.resolve(
      this.configuration.init &&
        this.configuration.init({
          engine,
          output,
          scene: this,
          parameter,
          imageManager: ImageManager
        })
    ).then(res => (this.initDone = true));
  }

  resize(output) {
    this.additionalModifier = {
      alpha: 1,
      x: 0,
      y: 0,
      width: output.width,
      height: output.height,
      widthInPixel: output.width,
      heightInPixel: output.height,
      visibleScreen: {
        x: 0,
        y: 0,
        width: output.width,
        height: output.height
      }
    };
    this.layerManager.forEach(({ layer, element, isFunction, index }) => {
      if (!isFunction) {
        element.resize(output, this.additionalModifier);
      }
    });
  }

  destroy(output) {
    const parameter =
      this.configuration.destroy &&
      this.configuration.destroy({ engine: this.engine, scene: this, output });
    this.initDone = false;
    return parameter;
  }

  loadingScreen(output, progress) {
    if (this.configuration.loading) {
      return this.configuration.loading({
        engine: this.engine,
        scene: this,
        output,
        progress
      });
    }
    const ctx = output.context;
    const loadedHeight =
      typeof progress === "number"
        ? Math.max(1, progress * output.h)
        : output.h;
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, output.w, output.h);
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
    let text = progress;

    // isNumber
    if (!isNaN(parseFloat(progress)) && !isNaN(progress - 0)) {
      text = "Loading " + Math.round(100 * progress) + "%";
    }
    ctx.fillText(
      text,
      10 + Math.random() * 3,
      output.height - 10 + Math.random() * 3
    );

    this.engine && this.engine.normalizeContext(ctx);
  }

  callLoading(output) {
    if (ImageManager.isLoaded() && this.initDone) {
      return true;
    }
    const value = ImageManager.getCount()
      ? ImageManager.getLoaded() / ImageManager.getCount()
      : "Loading...";

    this.loadingScreen(output, value);
    return false;
  }

  fixedUpdate(output, timePassed) {
    if (this.configuration.fixedUpdate) {
      this.configuration.fixedUpdate({
        engine: this.engine,
        scene: this,
        layerManager: this.layerManager,
        output,
        timePassed,
        totalTimePassed: this.totalTimePassed
      });
    }
  }

  move(output, timePassed) {
    // calc total time
    this.totalTimePassed += timePassed;

    // Jump back?
    if (timePassed < 0) {
      // Back to the beginning
      this.reset(output);
      timePassed = this.totalTimePassed;
    } else if (
      this.configuration.endTime &&
      this.configuration.endTime <= this.totalTimePassed
    ) {
      // set timepassed to match endtime
      timePassed -= this.totalTimePassed - this.configuration.endTime;
      this.totalTimePassed = this.configuration.endTime;
      // End Engine
      this.configuration.end &&
        this.configuration.end({
          engine: this.engine,
          scene: this,
          output,
          timePassed,
          totalTimePassed: this.totalTimePassed
        });
    }

    if (this.tickChunk) {
      if (timePassed >= this.tickChunk - this.tickChunkTolerance) {
        // how many frames should be skipped. Maximum is a skip of 2 frames
        for (
          let calcFrame = 0,
            frames = Math.min(
              this.maxSkippedTickChunk,
              Math.floor(timePassed / this.tickChunk)
            );
          calcFrame < frames;
          calcFrame++
        ) {
          this.fixedUpdate(output, this.tickChunk, calcFrame === frames - 1);
        }
      }
    } else {
      this.fixedUpdate(output, timePassed, true);
    }

    if (this.configuration.update) {
      this.configuration.update({
        engine: this.engine,
        scene: this,
        layerManager: this.layerManager,
        output,
        timePassed,
        totalTimePassed: this.totalTimePassed
      });
    }

    this.layerManager.forEach(({ element, isFunction, layer, index }) => {
      if (!isFunction) {
        if (element.animate(timePassed)) {
          layer.deleteById(index);
        }
      }
    });
  }

  draw(output) {
    this.layerManager.forEach(({ layer, element, isFunction, index }) => {
      if (isFunction) {
        if (
          element({
            engine: this.engine,
            scene: this,
            layerManager: this.layerManager,
            layer,
            output,
            totalTimePassed: this.totalTimePassed
          })
        ) {
          layer.deleteById(index);
        }
      } else {
        element.draw(output.context, this.additionalModifier);
      }
    });
  }

  reset(output) {
    let result = this.configuration.reset
      ? this.configuration.reset({
          engine: this.engine,
          scene: this,
          layerManager: this.layerManager,
          output
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
      this.layerManager = result;
    }
  }
}

export default Scene;
