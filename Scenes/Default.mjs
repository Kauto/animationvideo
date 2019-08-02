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

    this.tickChunk = calc(this.configuration.tickChunk);
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
    if (!this.tickChunk) {
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
        this.configuration.init({ engine, output, scene: this, parameter })
    ).then(res => (this.initDone = true));
  }

  resize(output) {
    this.additionalModifier = {
      a: 1,
      x: 0,
      y: 0,
      w: output.w,
      h: output.h,
      orgW: output.w,
      orgH: output.h,
      visibleScreen: {
        x: 0,
        y: 0,
        w: output.w,
        h: output.h
      }
    };
    this.layerManager.forEach(({ layer, element, isFunction, index }) => {
      if (!isFunction) {
        element.resize(output, this.additionalModifier);
      }
    });
  }

  callDestroy(output) {
    this.configuration.destroy &&
      this.configuration.destroy({ engine: this.engine, scene: this, output });
    this.initDone = false;
  }

  loadingscreen(output, progress) {
    const ctx = output.context,
      loadedHeight = Math.max(1, progress * output.h);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, output.w, output.h);
    ctx.fillStyle = "#aaa";
    ctx.fillRect(0, output.h / 2 - loadedHeight / 2, output.w, loadedHeight);
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
      output.h - 10 + Math.random() * 3
    );

    this.engine && this.engine.normalizeContext(ctx);
  }

  callLoading(output) {
    if (ImageManager.isLoaded() && this.initDone) {
      this.reset(output);
      return true;
    }
    const value = ImageManager.getCount()
      ? ImageManager.getLoaded() / ImageManager.getCount()
      : "Loading...";

    this.configuration.loading
      ? this.configuration.loading({
          engine: this.engine,
          scene: this,
          output,
          value
        })
      : this.loadingscreen(output, value);
    return false;
  }

  move(output, timepassed) {
    // calc total time
    this.totalTimePassed += timepassed;

    // Jump back?
    if (timepassed < 0) {
      // Back to the beginning
      this.reset(output);
      timepassed = this.totalTimePassed;
    } else if (
      this.configuration.endTime &&
      this.configuration.endTime <= this.totalTimePassed
    ) {
      // set timepassed to match endtime
      timepassed -= this.totalTimePassed - this.endTime;
      this.totalTimePassed = this.endTime;
      // End Engine
      this.configuration.end &&
        this.configuration.end({ engine: this.engine, scene: this, output });
    }

    if (this.configuration.beforeMove) {
      if (this.tickChunk) {
        if (timepassed >= this.tickChunk - this.tickChunkTolerance) {
          // how many frames should be skipped. Maximum is a skip of 2 frames
          for (
            let calcFrame = 0,
              frames = Math.min(
                this.maxSkippedTickChunk,
                Math.floor(timepassed / this.tickChunk)
              );
            calcFrame < frames;
            calcFrame++
          ) {
            this.configuration.beforeMove({
              engine: this.engine,
              scene: this,
              layerManager: this.layerManager,
              output,
              timepassed
            });
          }
        }
      } else {
        this.configuration.beforeMove({
          engine: this.engine,
          scene: this,
          layerManager: this.layerManager,
          output,
          timepassed
        });
      }
    }

    this.layerManager.forEach(({ element, isFunction, layer, index }) => {
      if (!isFunction) {
        if (element.animate(timepassed)) {
          layer.deleteById(index);
        }
      }
    });

    if (this.configuration.afterMove) {
      this.configuration.afterMove({
        engine: this.engine,
        scene: this,
        layerManager: this.layerManager,
        output,
        timepassed
      });
    }
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
            timepassed: this.totalTimePassed
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
