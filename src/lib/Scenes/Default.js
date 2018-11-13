'use strict';
import ImageManager from '../ImageManager';

class Scene {
  constructor(endTime) {
    // Layer consists of Sprites
    this.layer = [];

    // For precalculation if a layer is a function
    this._cacheLayerIsFunction = [];

    this.totalTimePassed = 0;

    this.initCallback = null;
    this.loadingCallback = null;
    this.destroyCallback = null;
    this.sceneCallback = null;
    this.engine = null;
    this.loadingShow = true;
    this.endTime = endTime;
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

  init(callbackOrImages) {
    if (typeof callbackOrImages === 'function') {
      this.initCallback = callbackOrImages;
    } else {
      ImageManager.add(callbackOrImages);
    }
    return this;
  }

  callInit(output, parameter, engine) {
    this.engine = engine;
    this.initCallback && this.initCallback(output, parameter);
    this.resize(output)
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
    }
  }

  destroy(callback) {
    this.destroyCallback = callback;
    return this;
  }

  scene(callback) {
    this.sceneCallback = callback;
    return this;
  }

  callDestroy(output) {
    if (this.destroyCallback) {
      return this.destroyCallback(output);
    } else {
      return true;
    }
  }

  loadingscreen(output, progress) {
    const ctx = output.context,
      loadedHeight = Math.max(1, progress * output.h);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, output.w, output.h);
    ctx.fillStyle = "#aaa";
    ctx.fillRect(0, output.h / 2 - (loadedHeight / 2), output.w, loadedHeight);
    ctx.font = "20px Georgia";
    ctx.fillStyle = "#fff";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    let text = progress;

    // isNumber
    if (!isNaN(parseFloat(progress)) && !isNaN(progress - 0)) {
      text = "Loading " + Math.round(100 * progress) + "%";
    }
    ctx.fillText(text, 10 + Math.random() * 3, output.h - 10 + Math.random() * 3);

    this.engine && this.engine.normalizeContext(ctx);
  }

  loading(callbackOrBool) {
    if (typeof callback === 'function') {
      this.loadingCallback = callback;
      this.loadingShow = true;
    } else {
      this.loadingCallback = null;
      this.loadingShow = !!callbackOrBool;
    }
    return this;
  }

  callLoading(output) {
    const imagePercentage = ImageManager.getCount() && ImageManager.getLoaded() < ImageManager.getCount() && ImageManager.getLoaded() / ImageManager.getCount();

    if (this.loadingShow) {
      if (this.loadingCallback) {
        let result = this.loadingCallback(output, imagePercentage);
        if (result === null) {
          return false;
        } else if (result !== true) {
          this.loadingscreen(output, result ? result : (imagePercentage || 'Loading...'));
          return false;
        }
      } else {
        if (imagePercentage) {
          this.loadingscreen(output, imagePercentage);
        }
      }
    }

    if (imagePercentage) {
      return false;
    }

    this.reset(output);
    return true;
  }

  move(output, timepassed) {
    // calc total time
    this.totalTimePassed += timepassed;

    // Jump back?
    if (timepassed < 0) {
      // Back to the beginning
      this.reset(output);
      timepassed = this.totalTimePassed;
    } else if (this.endTime && this.endTime <= this.totalTimePassed) {
      // End Engine
      this.engine.destroy();
      // set timepassed to match endtime
      timepassed -= this.totalTimePassed - this.endTime;
      this.totalTimePassed = this.endTime;
    }

    let l, i, lay, layif;

    l = this.layer.length;
    while (l--) {
      lay = this.layer[l];
      layif = this._cacheLayerIsFunction[l];
      i = lay.length;
      while (i--) {
        if (!layif[i] && lay[i] !== null) {
          if (lay[i].animate(timepassed)) {
            this.layer[l][i] = null;
          }
        }
      }
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
        if (lay[i] !== null) {
          if (layif[i]) {
            if (lay[i](output.context, this.totalTimePassed)) {
              this.layer[l][i] = null;
            }
          }
          else {
            this.layer[l][i].draw(output.context, this.additionalModifier);
          }
        }
      }
    }
  }

  calcLayerIsFunction() {
    this._cacheLayerIsFunction = new Array(this.layer.length);
    for (let l in this.layer) {
      this._cacheLayerIsFunction[l] = new Array(this.layer[l].length);
      for (let i in this.layer[l]) {
        this._cacheLayerIsFunction[l][i] = (typeof this.layer[l][i] === "function");
      }
    }
  }

  reset(output) {
    this.layer = this.sceneCallback(output, []).reverse();
    this.calcLayerIsFunction();
  }
}

export default Scene;
