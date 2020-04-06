import ImageManager from "./ImageManager.mjs";
import LayerManager from "./LayerManager.mjs";
import calc from "./func/calc.mjs";
import toArray from "./func/toArray.mjs";
import Transform from "./func/transform.mjs";
import TimingDefault from "./Middleware/TimingDefault.mjs";

class Scene {
  constructor(...configurationClassOrObjects) {
    // Layer consists of Sprites
    this._layerManager = new LayerManager();
    this._totalTimePassed = 0;
    //this._transform = null;
    //this._transformInvert = null;
    //this._engine = null;
    //this._initDone = false;
    //this._additionalModifier = undefined;
    this._imageManager = ImageManager;
    //this._resetIntend = false;
    //this._endTime = undefined;

    this.middlewares = configurationClassOrObjects;
    if (!this.middlewareByType("timing")) {
      this.middlewares = [TimingDefault, ...this.middlewares];
    }
  }

  get _output() {
    return this._engine.getOutput();
  }

  set middlewares(middlewares) {
    this._middleware = toArray(middlewares)
      .map((configurationClassOrObject) =>
        typeof configurationClassOrObject === "function"
          ? new configurationClassOrObject()
          : configurationClassOrObject
      )
      .reduce(
        (middlewareCommandList, c) => {
          for (let command of Object.keys(middlewareCommandList)) {
            if (command in c) {
              middlewareCommandList[command].push(c);
            }
          }
          middlewareCommandList._all.push(c);
          if (!("enabled" in c)) c.enabled = true;
          if (c.type) middlewareCommandList[`t_${c.type}`] = c;
          return middlewareCommandList;
        },
        {
          _all: [],
          init: [],
          isDrawFrame: [],
          initSprites: [],
          fixedUpdate: [],
          update: [],
          draw: [],
          destroy: [],
          reset: [],
          resize: [],
          currentTime: [],
          clampTime: [],
          shiftTime: [],
          isChunked: [],
          hasOneChunkedFrame: [],
          calcFrames: [],
          tickChunk: [],
          additionalModifier: [],
        }
      );
  }
  get middlewares() {
    return this._middleware._all;
  }

  middlewareByType(type) {
    const objs = this._middleware._all.filter((c) => c.type == type);
    if (objs.length) {
      return objs[objs.length - 1];
    }
  }

  has(command) {
    return (
      command in this._middleware ||
      this._middleware._all.filter((c) => command in c).length > 0
    );
  }

  do(command, params, defaultValue, func) {
    let objs =
      this._middleware[command] ||
      this._middleware._all.filter((c) => command in c);
    objs = objs.filter((v) => v.enabled);
    if (!objs.length) {
      return defaultValue;
    }
    const fullParams = this._param(params);
    return func(objs, fullParams, defaultValue);
  }

  map(command, params = {}) {
    return this.do(command, params, [], (objs, fullParams) =>
      objs.map((c) => c[command](fullParams))
    );
  }

  pipe(command, params = {}, pipe) {
    return this.do(command, params, pipe, (objs, fullParams) => {
      let res = pipe;
      this._stopPropagation = false;
      for (let c of objs) {
        res = c[command](fullParams, res);
        if (this._stopPropagation) break;
      }
      return res;
    });
  }

  pipeBack(command, params = {}, pipe) {
    return this.do(command, params, pipe, (objs, fullParams) => {
      let res = pipe;
      this._stopPropagation = false;
      for (let i = objs.length - 1; i >= 0; i--) {
        const c = objs[i];
        res = c[command](fullParams, res);
        if (this._stopPropagation) break;
      }
      return res;
    });
  }

  pipeMax(command, params = {}, pipe) {
    return this.do(command, params, pipe, (objs, fullParams) => {
      let res = pipe;
      this._stopPropagation = false;
      for (let c of objs) {
        let newRes = c[command](fullParams, res);
        if (Array.isArray(newRes)) {
          if (Array.isArray(res)) {
            res = res.map((v, i) => Math.max(v, newRes[i]));
          } else {
            res = newRes.map((v) => Math.max(v, res));
          }
        } else {
          if (Array.isArray(res)) {
            res = res.map((v, i) => Math.max(v, newRes));
          } else {
            res = Math.max(newRes, res);
          }
        }
        if (this._stopPropagation) break;
      }
      return res;
    });
  }

  pipeAsync(command, params = {}, pipe) {
    return this.do(command, params, pipe, async (objs, fullParams) => {
      let res = pipe;
      this._stopPropagation = false;
      for (let c of objs) {
        res = await c[command](fullParams, res);
        if (this._stopPropagation) break;
      }
      return res;
    });
  }

  value(command, params = {}) {
    let objs =
      this._middleware[command] ||
      this._middleware._all.filter((c) => command in c);
    objs.filter((v) => v.enabled);
    if (!objs.length) {
      return undefined;
    }
    const obj = objs[objs.length - 1];
    return calc(obj[command], obj, this._param(params));
  }

  stopPropagation() {
    this._stopPropagation = true;
  }

  currentTime() {
    return this.pipe("currentTime");
  }

  clampTime(timePassed) {
    return this.pipe("clampTime", { timePassed });
  }

  shiftTime(timePassed) {
    return this.pipe("shiftTime", { timePassed });
  }

  cacheClear() {
    this._transform = 0;
    this._transformInvert = 0;
  }

  viewport() {
    if (!this._engine) return new Transform();

    if (!this._transform) {
      this._transform = this.pipe("viewport", {}, new Transform());
      this._transformInvert = null;
    }
    return this._transform;
  }

  transformPoint(x, y, scale = this._additionalModifier.scaleCanvas) {
    if (!this._transformInvert) {
      this._transformInvert = this.viewport().clone().invert();
    }
    return this._transformInvert.transformPoint(x * scale, y * scale);
  }

  callInit(parameter, engine) {
    this._engine = engine;
    this.resize();
    const images = this.value("images");
    if (images) {
      this._imageManager.add(images);
    }
    Promise.all(
      this.map("init", {
        parameter,
      })
    ).then((res) => (this._initDone = true));
  }

  get additionalModifier() {
    return this._additionalModifier;
  }

  updateAdditionalModifier() {
    const output = this._output;
    this._additionalModifier = this.pipe(
      "additionalModifier",
      {},
      {
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
          height: output.height,
        },
        fullScreen: {
          x: 0,
          y: 0,
          width: output.width,
          height: output.height,
        },
      }
    );
  }

  resize() {
    const output = this._output;
    this.updateAdditionalModifier();
    this.pipe("resize");
    this._layerManager.forEach(({ element, isFunction }) => {
      if (!isFunction) {
        element.resize(output, this._additionalModifier);
      }
    });
  }

  async destroy() {
    const parameter = await this.pipeAsync("destroy");
    this._initDone = false;
    return parameter;
  }

  get timing() {
    return this._middleware.t_timing;
  }

  get camera() {
    return this._middleware.t_camera;
  }

  get control() {
    return this._middleware.t_control;
  }

  get totalTimePassed() {
    return this._totalTimePassed;
  }

  _param(additionalParameter) {
    return {
      engine: this._engine,
      scene: this,
      imageManager: this._imageManager,
      layerManager: this._layerManager,
      totalTimePassed: this._totalTimePassed,
      output: this._engine && this._output,
      ...additionalParameter,
    };
  }

  callLoading(args) {
    if (this._imageManager.isLoaded() && this._initDone) {
      this._endTime = this.value("endTime");
      args.progress = "Click to play";
      this.value("loading", args);
      return true;
    }
    args.progress = this._imageManager.getCount()
      ? this._imageManager.getLoaded() / this._imageManager.getCount()
      : "Loading...";

    this.value("loading", args);
    return false;
  }

  fixedUpdate(timePassed, lastCall) {
    this.map("fixedUpdate", {
      timePassed,
      lastCall,
    });
  }

  isDrawFrame(timePassed) {
    return this.pipeMax("isDrawFrame", { timePassed }, timePassed !== 0);
  }

  move(timePassed) {
    // calc total time
    this._totalTimePassed += timePassed;

    if (this._resetIntend) {
      this.reset();
      // Jump back?
    } else if (timePassed < 0) {
      // Back to the beginning
      timePassed = this._totalTimePassed;
      this.reset();
      this.initSprites();
      this._totalTimePassed = timePassed;
    } else if (this._endTime && this._endTime <= this._totalTimePassed) {
      // set timepassed to match endtime
      timePassed -= this._totalTimePassed - this._endTime;
      this._totalTimePassed = this._endTime;
      // End Engine
      this.map("end", { timePassed });
    }
    if (this.value("isChunked")) {
      if (this.value("hasOneChunkedFrame", { timePassed })) {
        // how many frames should be skipped. Maximum is a skip of 2 frames
        const frames = this.value("calcFrames", { timePassed }) - 1;
        for (let calcFrame = 0; calcFrame <= frames; calcFrame++) {
          this.fixedUpdate(this.value("tickChunk"), calcFrame === frames);
        }
      }
    } else {
      this.fixedUpdate(timePassed, true);
    }

    this.map("update", { timePassed });

    this._layerManager.forEach(({ element, isFunction, layer, elementId }) => {
      if (!isFunction) {
        if (element.animate(timePassed)) {
          layer.deleteById(elementId);
        }
      }
    });
  }

  draw(canvasId) {
    this.map("draw", { canvasId });
    const context = this._output.context[canvasId];
    context.save();

    context.setTransform(...this.viewport().m);

    this._layerManager.forEach(
      ({ layer, layerId, element, isFunction, elementId }) => {
        if (isFunction) {
          if (
            element(
              this._param({
                layerId,
                elementId,
                layer,
                context,
              })
            )
          ) {
            layer.deleteById(elementId);
          }
        } else {
          element.draw(context, this._additionalModifier);
        }
      },
      canvasId
    );

    context.restore();
  }

  initSprites(canvasId) {
    const context = this._output.context[canvasId];
    this._layerManager.forEach(({ element, isFunction }) => {
      if (!isFunction) {
        element.callInit(context, this._additionalModifier);
      }
    }, canvasId);
    this.map("initSprites", { canvasId });
  }

  resetIntend() {
    this._resetIntend = true;
  }

  reset() {
    this._totalTimePassed = 0;
    this._resetIntend = false;
    let result = this.pipe(
      "reset",
      {
        engine: this._engine,
        scene: this,
        layerManager: this._layerManager,
        imageManager: this._imageManager,
      },
      new LayerManager()
    );

    if (Array.isArray(result)) {
      const layers = result;
      result = new LayerManager();
      layers.forEach((v) => {
        result.addLayer().addElements(v);
      });
    }

    if (result) {
      this._layerManager = result;
    }
  }
}

export default Scene;
