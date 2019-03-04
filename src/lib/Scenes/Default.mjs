import ImageManager from "../ImageManager.mjs";
import calc from "../../func/calc.mjs";

class Scene {
  constructor(configurationClassOrObject) {
    if (typeof configurationClassOrObject === "function") {
      this.configuration = new configurationClassOrObject();
    } else {
      this.configuration = configurationClassOrObject;
    }

    // Layer consists of Sprites
    this.layer = [];

    // For precalculation if a layer is a function
    this._cacheLayerIsFunction = [];

    this.totalTimePassed = 0;

    this.engine = null;
    this.initDone = false;
    this.additionalModifier = undefined;
  }

  currentTime() {
    return Date.now();
  }

  clampTime(timePassed) {
    if (timePassed > 2000) {
      return 2000;
    }
    return timePassed;
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
      orgH: output.h
    };
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

    let l, i, lay, layif;

    if (this.configuration.beforeMove) {
      this.layer = this.configuration.beforeMove({
        engine: this.engine,
        scene: this,
        layer: this.layer,
        output,
        timepassed
      });
    }

    l = this.layer.length;
    while (l--) {
      lay = this.layer[l];
      layif = this._cacheLayerIsFunction[l];
      i = lay.length;
      while (i--) {
        if (!layif[i]) {
          if (lay[i].animate(timepassed)) {
            this.layer[l].splice(i, 1);
          }
        }
      }
    }

    if (this.configuration.afterMove) {
      this.layer = this.configuration.afterMove({
        engine: this.engine,
        scene: this,
        layer: this.layer,
        output,
        timepassed
      });
    }
  }

  draw(output) {
    let l, i, lay, layif;

    l = this.layer.length;
    while (l--) {
      lay = this.layer[l];
      layif = this._cacheLayerIsFunction[l];
      i = lay.length;
      while (i--) {
        if (layif[i]) {
          if (
            lay[i]({
              engine: this.engine,
              scene: this,
              layer: this.layer,
              output,
              timepassed: this.totalTimePassed
            })
          ) {
            this.layer[l].splice(i, 1);
          }
        } else {
          this.layer[l][i].draw(output.context, this.additionalModifier);
        }
      }
    }
  }

  calcLayerIsFunction() {
    this._cacheLayerIsFunction = new Array(this.layer.length);
    for (let l in this.layer) {
      this._cacheLayerIsFunction[l] = new Array(this.layer[l].length);
      for (let i in this.layer[l]) {
        this._cacheLayerIsFunction[l][i] =
          typeof this.layer[l][i] === "function";
      }
    }
  }

  reset(output) {
    this.layer = this.configuration.reset
      ? this.configuration.reset({
          engine: this.engine,
          scene: this,
          layer: [],
          output
        })
      : [];
    this.calcLayerIsFunction();
  }
}

export default Scene;
