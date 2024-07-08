var ke = Object.defineProperty;
var Pe = (a, t, e) => t in a ? ke(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var u = (a, t, e) => Pe(a, typeof t != "symbol" ? t + "" : t, e);
function x(a, ...t) {
  return typeof a == "function" ? a(...t) : a;
}
function ye(a) {
  return a == null ? [] : Array.isArray(a) ? a : [a];
}
class ze {
  constructor(t) {
    u(this, "_output");
    u(this, "_events");
    u(this, "_scene");
    u(this, "_newScene");
    u(this, "_sceneParameter");
    u(this, "_isSceneInitialized");
    u(this, "_recalculateCanvasIntend");
    u(this, "_lastTimestamp");
    u(this, "_referenceRequestAnimationFrame");
    u(this, "_autoSize");
    u(this, "_canvasCount");
    u(this, "_drawFrame");
    u(this, "_reduceFramerate");
    u(this, "_realLastTimestamp");
    u(this, "_isOddFrame", !1);
    u(this, "_initializedStartTime");
    u(this, "_promiseSceneDestroying");
    u(this, "_runParameter");
    u(this, "_moveOnce", !1);
    let e = t;
    if (typeof t != "object")
      throw new Error("No canvas given for Engine constructor");
    if (t.getContext)
      e = {
        canvas: t
      };
    else if (!t.canvas)
      throw new Error("No canvas given for Engine constructor");
    const i = Object.assign(
      {},
      e
    );
    if (this._output = {
      canvas: [],
      context: [],
      width: 0,
      height: 0,
      ratio: 1
    }, this._events = [], this._scene = null, this._isSceneInitialized = !1, this._lastTimestamp = 0, this._recalculateCanvasIntend = !1, this._referenceRequestAnimationFrame = void 0, this._output.canvas = ye(i.canvas), i.autoSize) {
      const s = {
        enabled: !0,
        scaleLimitMin: 1,
        scaleLimitMax: 2.5,
        scaleFactor: 1.07,
        referenceWidth: () => this._output.canvas[0].clientWidth,
        referenceHeight: () => this._output.canvas[0].clientHeight,
        currentScale: 1,
        waitTime: 100,
        currentWaitedTime: 0,
        currentOffsetTime: 0,
        offsetTimeLimitUp: 300,
        offsetTimeLimitDown: 300,
        // undefined will be autodetect timing
        // offsetTimeTarget: 25,
        // offsetTimeDelta: 10,
        registerResizeEvents: !0,
        registerVisibilityEvents: !0,
        setCanvasStyle: !1
      };
      typeof i.autoSize == "object" ? this._autoSize = Object.assign(
        {},
        s,
        i.autoSize
      ) : this._autoSize = s, this._autoSize.registerResizeEvents && (this._events = ["resize", "orientationchange"].map((r) => ({
        n: window,
        e: r,
        f: this.recalculateCanvas.bind(this)
      }))), this._autoSize.registerVisibilityEvents && this._events.push({
        n: document,
        e: "visibilitychange",
        f: this.handleVisibilityChange.bind(this)
      }), this._recalculateCanvas();
    } else
      this._output.width = this._output.canvas[0].width, this._output.height = this._output.canvas[0].height, this._output.ratio = this._output.width / this._output.height;
    this._output.canvas.forEach((s, r) => {
      this._output.context[r] = s.getContext("2d");
    }), this._canvasCount = this._output.canvas.length, this._drawFrame = Array.from({ length: this._canvasCount }, (s) => 0), i.clickToPlayAudio && this._events.push({
      n: this._output.canvas[0],
      e: "click",
      f: this.playAudioOfScene.bind(this)
    }), this._reduceFramerate = !!i.reduceFramerate, this._events.forEach((s) => {
      s.n.addEventListener(s.e, s.f);
    }), this.switchScene(i.scene, i.sceneParameter);
  }
  handleVisibilityChange() {
    this._autoSize && (this._autoSize.enabled = document.visibilityState != "hidden");
  }
  playAudioOfScene() {
    this._isSceneInitialized && this._scene && this._scene.timing.audioElement && this._scene.timing.audioElement.play();
  }
  normContext(t) {
    t.textBaseline = "middle", t.textAlign = "center", t.globalAlpha = 1, t.globalCompositeOperation = "source-over";
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
    return this._recalculateCanvasIntend = !0, this;
  }
  _recalculateCanvas() {
    if (this._autoSize) {
      const t = x(this._autoSize.referenceWidth), e = x(this._autoSize.referenceHeight);
      if (t <= 0 || e <= 0)
        return;
      this._output.canvas.forEach((i) => {
        i.width = Math.round(t / this._autoSize.currentScale), i.height = Math.round(e / this._autoSize.currentScale), this._autoSize.setCanvasStyle && (i.style.width = `${t}px`, i.style.height = `${e}px`);
      }), this._autoSize.currentWaitedTime = 0, this._autoSize.currentOffsetTime = 0;
    }
    this._output.width = this._output.canvas[0].width, this._output.height = this._output.canvas[0].height, this._output.ratio = this._output.width / this._output.height, this.resize();
  }
  async recalculateFPS() {
    this._referenceRequestAnimationFrame && (window.cancelAnimationFrame(this._referenceRequestAnimationFrame), this._referenceRequestAnimationFrame = void 0), await new Promise((s) => requestAnimationFrame(s));
    const t = this._now(), e = 3;
    for (let s = e; s--; )
      await new Promise((r) => requestAnimationFrame(r));
    const i = (this._now() - t) / e;
    this._autoSize.offsetTimeTarget = i, this._autoSize.offsetTimeDelta = i / 3, this._referenceRequestAnimationFrame === void 0 && (this._realLastTimestamp = void 0, this._referenceRequestAnimationFrame = window.requestAnimationFrame(
      this._mainLoop.bind(this)
    ));
  }
  resize() {
    return this._scene && this._scene.resize && this._scene.resize(), this;
  }
  switchScene(t, e) {
    return t && (this._newScene = t, this._sceneParameter = e), this;
  }
  _now() {
    return window.performance ? performance.now() : Date.now();
  }
  _mainLoop(t) {
    if (!this._referenceRequestAnimationFrame) return;
    this._referenceRequestAnimationFrame = window.requestAnimationFrame(
      this._mainLoop.bind(this)
    );
    const e = this._recalculateCanvasIntend && (!this._reduceFramerate || !this._isOddFrame);
    e && (this._recalculateCanvas(), this._recalculateCanvasIntend = !1);
    for (let i = 0; i < this._canvasCount; i++)
      this._drawFrame[i] = Math.max(
        this._drawFrame[i] - 1,
        e ? 1 : 0
      );
    if (this._realLastTimestamp || (this._realLastTimestamp = t), this._initializedStartTime || (this._initializedStartTime = t), this._newScene && !this._promiseSceneDestroying && (this._promiseSceneDestroying = Promise.resolve(
      this._scene ? this._scene.destroy() : void 0
    ), this._promiseSceneDestroying.then((i) => {
      this._newScene.callInit(
        {
          run: this._runParameter,
          scene: this._sceneParameter,
          destroy: i
        },
        this
      ), this._scene = this._newScene, this._newScene = void 0, this._promiseSceneDestroying = void 0, this._isSceneInitialized = !1, this._lastTimestamp = this._scene.currentTime(), this._initializedStartTime = t;
    })), this._scene) {
      let i = !1;
      const s = this._now();
      if (this._reduceFramerate && (this._isOddFrame = !this._isOddFrame), !this._reduceFramerate || this._isOddFrame) {
        const r = this._scene.currentTime();
        let n = this._scene.clampTime(r - this._lastTimestamp);
        const o = this._scene.shiftTime(n);
        if (n = n + o, this._lastTimestamp = r + o, this._isSceneInitialized) {
          if (i = n !== 0 || this._moveOnce, this._moveOnce = !1, this._output.canvas[0].width)
            for (let c = 0; c < this._canvasCount; c++) {
              const m = this._output.context[c];
              this.normContext(m), this._scene.initSprites(c);
            }
          const f = this._scene.isDrawFrame(n);
          if (Array.isArray(f))
            for (let c = 0; c < this._canvasCount; c++)
              this._drawFrame[c] = Math.max(
                this._drawFrame[c],
                f[c],
                0
              );
          else
            for (let c = 0; c < this._canvasCount; c++)
              this._drawFrame[c] = Math.max(
                this._drawFrame[c],
                f,
                0
              );
          if (i && this._scene.move(n), this._output.canvas[0].width)
            for (let c = 0; c < this._canvasCount; c++)
              this._drawFrame[c] && this._scene.draw(c);
        } else {
          for (let f = 0; f < this._canvasCount; f++)
            this.normContext(this._output.context[f]);
          this._isSceneInitialized = this._scene.callLoading({
            timePassed: t - this._realLastTimestamp,
            totalTimePassed: t - this._initializedStartTime
          }), this._isSceneInitialized && (this._scene.reset(), this._lastTimestamp = this._scene.currentTime(), this._moveOnce = !0, this._autoSize && (this._autoSize.currentWaitedTime = 0));
        }
      }
      if (this._isSceneInitialized && this._autoSize && this._autoSize.enabled) {
        const r = t - this._realLastTimestamp;
        if (this._autoSize.currentWaitedTime < this._autoSize.waitTime)
          this._autoSize.currentWaitedTime += r;
        else if (i) {
          const n = this._autoSize.offsetTimeTarget * (this._reduceFramerate ? 2 : 1), o = this._now() - s, f = (Math.abs(r - n) > Math.abs(o - n) ? r : o) - n;
          Math.abs(f) <= this._autoSize.offsetTimeDelta ? this._autoSize.currentOffsetTime = this._autoSize.currentOffsetTime >= 0 ? Math.max(
            0,
            this._autoSize.currentOffsetTime - this._autoSize.offsetTimeDelta
          ) : Math.min(
            0,
            this._autoSize.currentOffsetTime + this._autoSize.offsetTimeDelta
          ) : f < 0 && this._autoSize.currentScale > this._autoSize.scaleLimitMin ? (this._autoSize.currentOffsetTime += f, this._autoSize.currentOffsetTime <= -this._autoSize.offsetTimeLimitDown && (this._autoSize.currentScale = Math.max(
            this._autoSize.scaleLimitMin,
            this._autoSize.currentScale / this._autoSize.scaleFactor
          ), this._recalculateCanvasIntend = !0)) : f > 0 && this._autoSize.currentScale < this._autoSize.scaleLimitMax && (this._autoSize.currentOffsetTime += f, this._autoSize.currentOffsetTime >= this._autoSize.offsetTimeLimitUp && (this._autoSize.currentScale = Math.min(
            this._autoSize.scaleLimitMax,
            this._autoSize.currentScale * this._autoSize.scaleFactor
          ), this._recalculateCanvasIntend = !0));
        }
      }
    }
    this._realLastTimestamp = t;
  }
  async run(t) {
    return this._runParameter = t, await this.stop(), this._realLastTimestamp = this._initializedStartTime = void 0, this._autoSize && !this._autoSize.offsetTimeTarget && await this.recalculateFPS(), this._referenceRequestAnimationFrame = window.requestAnimationFrame(
      this._mainLoop.bind(this)
    ), this;
  }
  async stop() {
    this._referenceRequestAnimationFrame && window.cancelAnimationFrame(this._referenceRequestAnimationFrame), this._referenceRequestAnimationFrame = void 0, this._scene && await this._scene.destroy();
  }
  async destroy() {
    return await this.stop(), this._events.forEach((t) => {
      t.n.removeEventListener(t.e, t.f);
    }), this._events = [], this;
  }
}
const Us = ze;
class Ie {
  constructor() {
    u(this, "Images");
    u(this, "count");
    u(this, "loaded");
    u(this, "_resolve", []);
    this.Images = {}, this.count = 0, this.loaded = 0;
  }
  add(t, e = void 0) {
    for (const i in t)
      if (this.Images[i])
        e && typeof e[i] == "function" && e[i](i, this.Images[i]);
      else {
        const s = t[i];
        if (this.Images[i] = new window.Image(), this.Images[i].onload = () => {
          this.loaded++, e && typeof e == "function" ? this.isLoaded() && e() : e && typeof e[i] == "function" && e[i](i, this.Images[i]), this._resolve && this.isLoaded() && (this._resolve.forEach((r) => r(void 0)), this._resolve = []);
        }, s.substr(0, 4) === "<svg") {
          const r = window.URL || window.webkitURL, n = new window.Blob([s], { type: "image/svg+xml" });
          this.Images[i].src = r.createObjectURL(n);
        } else
          /^(https?:)?\/\//.test(s) && (this.Images[i].onerror = () => {
            const r = new window.Image();
            r.onload = this.Images[i].onload, this.Images[i] = r, this.Images[i].src = s;
          }, this.Images[i].crossOrigin = "anonymous"), this.Images[i].src = s;
        this.count++;
      }
    return e && typeof e == "function" && this.isLoaded() && e(), this._resolve && this.isLoaded() && (this._resolve.forEach((i) => i(void 0)), this._resolve = []), this;
  }
  reset() {
    return this.Images = {}, this.count = 0, this.loaded = 0, this;
  }
  isLoaded() {
    return this.loaded === this.count;
  }
  getImage(t) {
    return typeof t == "object" ? t : this.Images[t];
  }
  isLoadedPromise() {
    return this.isLoaded() ? !0 : new Promise((t, e) => {
      this._resolve.push(t);
    });
  }
}
const jt = new Ie();
class Oe {
  constructor(t) {
    u(this, "_layer");
    u(this, "_isFunction");
    u(this, "_start");
    u(this, "_nextFree");
    u(this, "_canvasIds");
    this._layer = [], this._isFunction = [], this._start = 0, this._nextFree = 0, this._canvasIds = t === void 0 ? [] : Array.isArray(t) ? t : [t];
  }
  addElement(t) {
    return this.addElementForId(t), t;
  }
  addElements(t) {
    return this.addElementsForIds(t), t;
  }
  addElementForId(t) {
    let e = this._layer.length;
    const i = this._nextFree;
    this._layer[i] = t, this._isFunction[i] = typeof t == "function", e === i && e++;
    let s = this._nextFree + 1;
    for (; s !== e && this._layer[s]; )
      s++;
    return this._nextFree = s, this._start > i && (this._start = i), i;
  }
  addElementsForIds(t) {
    const e = this._layer.length, i = this._nextFree;
    return e === i ? (this._layer = this._layer.concat(t), this._nextFree = this._layer.length, t.forEach((s, r) => {
      this._isFunction[e + r] = typeof s == "function";
    }), Array.from({ length: t.length }, (s, r) => r + e)) : t.map((s) => this.addElement(s));
  }
  getById(t) {
    return this._layer[t];
  }
  getIdByElement(t) {
    return this._layer.indexOf(t);
  }
  deleteByElement(t) {
    const e = this.getIdByElement(t);
    e >= 0 && this.deleteById(e);
  }
  deleteById(t) {
    let e = this._layer.length - 1;
    if (e > 0 && t === e) {
      for (this._layer[t] = void 0; e && !this._layer[e - 1]; )
        e--;
      this._layer.length = e, this._isFunction.length = e, this._nextFree = Math.min(this._nextFree, e), this._start = Math.min(this._start, e);
    } else this._layer[t] && (this._layer[t] = void 0, this._nextFree = Math.min(this._nextFree, t), this._start === t && (this._start = t + 1));
  }
  isCanvasId(t) {
    return t === void 0 || !this._canvasIds.length || this._canvasIds.includes(t);
  }
  forEach(t, e = 0) {
    let i, s;
    const r = this._layer.length;
    for (i = this._start; i < r; i++)
      if (s = this._layer[i], s && t({
        elementId: i,
        layerId: e,
        element: s,
        isFunction: this._isFunction[i],
        layer: this
      }) === !1)
        return;
  }
  getElementsByTag(t) {
    let e = [];
    return this.forEach(({ element: i, isFunction: s }) => {
      if (!s) {
        const r = i.getElementsByTag(t);
        r && (e = e.concat(r));
      }
    }), e;
  }
  play(t = "", e = 0) {
    this.forEach(
      ({ element: i, isFunction: s }) => !s && i.play(t, e)
    );
  }
  count() {
    let t = 0;
    const e = this._layer.length;
    for (let i = this._start; i < e; i++)
      this._layer[i] && t++;
    return t;
  }
  clear() {
    this._layer = [], this._isFunction = [], this._start = 0, this._nextFree = 0;
  }
}
const Nt = Oe;
class Fe {
  constructor() {
    u(this, "_layers");
    this._layers = [];
  }
  addLayer(t = void 0) {
    return this._layers[this._layers.length] = new Nt(t), this._layers[this._layers.length - 1];
  }
  addLayers(t = 1, e = void 0) {
    const i = Array.from(
      { length: t },
      (s) => new Nt(e)
    );
    return this._layers = this._layers.concat(i), i;
  }
  addLayerForId(t = void 0) {
    return this._layers[this._layers.length] = new Nt(t), this._layers.length - 1;
  }
  addLayersForIds(t = 1, e = void 0) {
    const i = Array.from(
      { length: t },
      (s, r) => r + this._layers.length
    );
    return this._layers = this._layers.concat(
      Array.from({ length: t }, (s) => new Nt(e))
    ), i;
  }
  getById(t) {
    return this._layers[t];
  }
  forEach(t, e) {
    let i;
    const s = this._layers.length;
    for (i = 0; i < s; i++)
      this._layers[i].isCanvasId(e) && this._layers[i].forEach(t, i);
  }
  play(t = "", e = 0) {
    this.forEach(
      ({ element: i, isFunction: s }) => !s && i.play(t, e)
    );
  }
  getElementsByTag(t) {
    let e = [];
    return this.forEach(({ element: i, isFunction: s }) => {
      if (!s) {
        const r = i.getElementsByTag(t);
        r && (e = e.concat(r));
      }
    }), e;
  }
  count() {
    return this._layers.length;
  }
  clear() {
    this._layers = [];
  }
}
const $t = Fe;
class Tt {
  constructor() {
    u(this, "m", [1, 0, 0, 1, 0, 0]);
  }
  __constuct() {
    this.reset();
  }
  reset() {
    return this.m = [1, 0, 0, 1, 0, 0], this;
  }
  multiply(t) {
    const e = this.m[0] * t.m[0] + this.m[2] * t.m[1], i = this.m[1] * t.m[0] + this.m[3] * t.m[1], s = this.m[0] * t.m[2] + this.m[2] * t.m[3], r = this.m[1] * t.m[2] + this.m[3] * t.m[3], n = this.m[0] * t.m[4] + this.m[2] * t.m[5] + this.m[4], o = this.m[1] * t.m[4] + this.m[3] * t.m[5] + this.m[5];
    return this.m[0] = e, this.m[1] = i, this.m[2] = s, this.m[3] = r, this.m[4] = n, this.m[5] = o, this;
  }
  invert() {
    const t = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]), e = this.m[3] * t, i = -this.m[1] * t, s = -this.m[2] * t, r = this.m[0] * t, n = t * (this.m[2] * this.m[5] - this.m[3] * this.m[4]), o = t * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
    return this.m[0] = e, this.m[1] = i, this.m[2] = s, this.m[3] = r, this.m[4] = n, this.m[5] = o, this;
  }
  rotate(t) {
    const e = Math.cos(t), i = Math.sin(t), s = this.m[0] * e + this.m[2] * i, r = this.m[1] * e + this.m[3] * i, n = this.m[0] * -i + this.m[2] * e, o = this.m[1] * -i + this.m[3] * e;
    return this.m[0] = s, this.m[1] = r, this.m[2] = n, this.m[3] = o, this;
  }
  translate(t, e) {
    return this.m[4] += this.m[0] * t + this.m[2] * e, this.m[5] += this.m[1] * t + this.m[3] * e, this;
  }
  scale(t, e) {
    return this.m[0] *= t, this.m[1] *= t, this.m[2] *= e, this.m[3] *= e, this;
  }
  transformPoint(t, e) {
    const i = t, s = e;
    return t = i * this.m[0] + s * this.m[2] + this.m[4], e = i * this.m[1] + s * this.m[3] + this.m[5], [t, e];
  }
  clone() {
    const t = new Tt();
    return t.m = this.m.slice(0), t;
  }
}
function O(a, t) {
  return a == null || a === "" ? t : a;
}
class ee {
  constructor(t = {}) {
    u(this, "_configuration");
    u(this, "_tickChunk");
    u(this, "_maxSkippedTickChunk");
    u(this, "_tickChunkTolerance");
    u(this, "type", "timing");
    u(this, "totalTimePassed", 0);
    this._configuration = t, this._tickChunk = O(x(this._configuration.tickChunk), 1e3 / 60), this._maxSkippedTickChunk = O(
      x(this._configuration.maxSkippedTickChunk),
      120
    ), this._tickChunkTolerance = O(
      x(this._configuration.tickChunkTolerance),
      0.1
    );
  }
  init(t) {
  }
  currentTime() {
    return window.performance ? window.performance.now() : Date.now();
  }
  clampTime({ timePassed: t }) {
    const e = this._tickChunk ? this._tickChunk * this._maxSkippedTickChunk : 2e3;
    return t > e ? e : t;
  }
  shiftTime({ timePassed: t }) {
    return this._tickChunk ? -(t % this._tickChunk) : 0;
  }
  get tickChunk() {
    return this._tickChunk;
  }
  isChunked() {
    return !!this._tickChunk;
  }
  hasOneChunkedFrame({ timePassed: t }) {
    return t >= this._tickChunk - this._tickChunkTolerance;
  }
  calcFrames({ timePassed: t }) {
    return Math.min(
      this._maxSkippedTickChunk,
      Math.floor((t + this._tickChunkTolerance) / this._tickChunk)
    );
  }
}
const re = () => ({
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
  additionalModifier: []
});
class Ae {
  constructor(...t) {
    u(this, "_layerManager");
    u(this, "_imageManager");
    u(this, "_totalTimePassed");
    u(this, "_engine");
    u(this, "_middleware", re());
    u(this, "_stopPropagation", !1);
    u(this, "_transform");
    u(this, "_transformInvert");
    u(this, "_additionalModifier");
    u(this, "_initDone", !1);
    u(this, "_endTime");
    u(this, "_resetIntend", !1);
    this._layerManager = new $t(), this._totalTimePassed = 0, this._imageManager = jt, this.middlewares = t, this.middlewareByType("timing") || (this.middlewares = [
      ee,
      ...this.middlewares
    ]);
  }
  _output() {
    var t;
    return (t = this._engine) == null ? void 0 : t.getOutput();
  }
  set middlewares(t) {
    this._middleware = ye(t).map(
      (e) => typeof e == "function" ? new e() : e
    ).reduce(
      (e, i) => {
        for (const s of Object.keys(e))
          s in i && e[s].push(i);
        return e._all.push(i), "enabled" in i || (i.enabled = !0), i.type && (e[`t_${i.type}`] = [i]), e;
      },
      re()
    );
  }
  get middlewares() {
    return this._middleware._all;
  }
  middlewareByType(t) {
    const e = this._middleware._all.filter((i) => i.type === t);
    if (e.length)
      return e[e.length - 1];
  }
  has(t) {
    return t in this._middleware || this._middleware._all.some((e) => t in e);
  }
  do(t, e, i, s) {
    const r = (this._middleware[t] || this._middleware._all.filter((o) => t in o)).filter((o) => o.enabled);
    if (!r.length)
      return i;
    const n = this._param(e);
    return s(r, n, i);
  }
  map(t, e) {
    return this.do(t, e, [], (i, s) => i.map((r) => x(r[t], [s])));
  }
  pipe(t, e, i = void 0) {
    return this.do(t, e, i, (s, r) => {
      let n = i;
      this._stopPropagation = !1;
      for (const o of s)
        if (n = x(o[t], [r, n]), this._stopPropagation) break;
      return n;
    });
  }
  pipeBack(t, e, i = void 0) {
    return this.do(t, e, i, (s, r) => {
      let n = i;
      this._stopPropagation = !1;
      for (let o = s.length - 1; o >= 0; o--) {
        const f = s[o];
        if (n = x(f[t], [r, n]), this._stopPropagation) break;
      }
      return n;
    });
  }
  pipeMax(t, e, i = void 0) {
    return this.do(
      t,
      e,
      Array.isArray(i) ? i.map((s) => s - 0) : i - 0,
      (s, r, n) => {
        let o = n;
        if (this._stopPropagation = !1, Array.isArray(o))
          for (const f of s) {
            const c = x(f[t], [r, o]);
            if (Array.isArray(c) ? o = o.map(
              (m, b) => Math.max(m, c[b])
            ) : o = o.map((m, b) => Math.max(m, c)), this._stopPropagation) break;
          }
        else
          for (const f of s) {
            const c = x(f[t], [r, o]);
            if (Array.isArray(c) ? o = c.map((m) => Math.max(m, o)) : o = Math.max(c, o), this._stopPropagation) break;
          }
        return o;
      }
    );
  }
  async pipeAsync(t, e, i = void 0) {
    return this.do(
      t,
      e,
      i,
      async (s, r) => {
        let n = i;
        this._stopPropagation = !1;
        for (const o of s)
          if (n = await x(o[t], [r, n]), this._stopPropagation) break;
        return n;
      }
    );
  }
  value(t, e = void 0) {
    const i = (this._middleware[t] || this._middleware._all.filter((r) => t in r)).filter((r) => r.enabled);
    if (!i.length)
      return;
    const s = i[i.length - 1];
    return typeof s[t] == "function" ? s[t].call(s, this._param(e || {})) : s[t];
  }
  stopPropagation() {
    this._stopPropagation = !0;
  }
  currentTime() {
    return this.pipe("currentTime", {});
  }
  clampTime(t) {
    return this.pipe("clampTime", { timePassed: t });
  }
  shiftTime(t) {
    return this.pipe("shiftTime", { timePassed: t });
  }
  cacheClear() {
    this._transform = void 0, this._transformInvert = void 0;
  }
  viewport() {
    return this._engine ? (this._transform || (this._transform = this.pipe("viewport", {}, new Tt()), this._transformInvert = void 0), this._transform) : new Tt();
  }
  transformPoint(t, e, i = this._additionalModifier.scaleCanvas) {
    return this._transformInvert || (this._transformInvert = this.viewport().clone().invert()), this._transformInvert.transformPoint(t * i, e * i);
  }
  callInit(t, e) {
    this._engine = e, this.resize();
    const i = this.value("images");
    i && this._imageManager.add(i), Promise.all(
      this.map("init", {
        parameter: t
      })
    ).then((s) => {
      this._initDone = !0;
    });
  }
  get additionalModifier() {
    return this._additionalModifier;
  }
  updateAdditionalModifier() {
    const t = this._output();
    this._additionalModifier = this.pipe(
      "additionalModifier",
      {},
      {
        alpha: 1,
        x: 0,
        y: 0,
        width: t.width,
        height: t.height,
        widthInPixel: t.width,
        heightInPixel: t.height,
        scaleCanvas: 1,
        visibleScreen: {
          x: 0,
          y: 0,
          width: t.width,
          height: t.height
        },
        fullScreen: {
          x: 0,
          y: 0,
          width: t.width,
          height: t.height
        }
      }
    );
  }
  resize() {
    const t = this._output();
    this.updateAdditionalModifier(), this.pipe("resize", {}), this._layerManager.forEach(({ element: e, isFunction: i }) => {
      i || e.resize(t, this._additionalModifier);
    });
  }
  async destroy() {
    const t = await this.pipeAsync("destroy", {});
    return this._initDone = !1, t;
  }
  get timing() {
    return this._middleware.t_timing[0];
  }
  get camera() {
    return this._middleware.t_camera[0];
  }
  get control() {
    return this._middleware.t_control[0];
  }
  get totalTimePassed() {
    return this._totalTimePassed;
  }
  _param(t = void 0) {
    return Object.assign(
      {
        engine: this._engine,
        scene: this,
        imageManager: this._imageManager,
        layerManager: this._layerManager,
        totalTimePassed: this._totalTimePassed,
        output: this._output()
      },
      t
    );
  }
  callLoading(t) {
    if (this._imageManager.isLoaded() && this._initDone)
      return this._endTime = this.value("endTime"), this.value("loading", {
        ...t,
        progress: "Click to play"
      }), !0;
    const e = this._imageManager.count ? this._imageManager.loaded / this._imageManager.count : "Loading...";
    return this.value("loading", {
      ...t,
      progress: e
    }), !1;
  }
  fixedUpdate(t, e) {
    this.map("fixedUpdate", {
      timePassed: t,
      lastCall: e
    });
  }
  isDrawFrame(t) {
    return this.pipeMax("isDrawFrame", { timePassed: t }, t !== 0);
  }
  move(t) {
    if (this._totalTimePassed += t, this._resetIntend ? this.reset() : t < 0 ? (t = this._totalTimePassed, this.reset(), this.initSprites(), this._totalTimePassed = t) : this._endTime && this._endTime <= this._totalTimePassed && (t -= this._totalTimePassed - this._endTime, this._totalTimePassed = this._endTime, this.map("end", { timePassed: t })), this.value("isChunked")) {
      if (this.value("hasOneChunkedFrame", { timePassed: t })) {
        const e = this.value("calcFrames", { timePassed: t }) - 1;
        for (let i = 0; i <= e; i++)
          this.fixedUpdate(this.value("tickChunk", {}), i === e);
      }
    } else
      this.fixedUpdate(t, !0);
    this.map("update", { timePassed: t }), this._layerManager.forEach(({ element: e, isFunction: i, layer: s, elementId: r }) => {
      i || e.animate(t) && s.deleteById(r);
    });
  }
  draw(t) {
    this.map("draw", { canvasId: t });
    const e = this._output().context[t];
    e.save(), e.setTransform(...this.viewport().m), this._layerManager.forEach(
      ({ layer: i, layerId: s, element: r, isFunction: n, elementId: o }) => {
        n ? r(
          this._param({
            layerId: s,
            elementId: o,
            layer: i,
            context: e
          })
        ) && i.deleteById(o) : r.draw(e, this._additionalModifier);
      },
      t
    ), e.restore();
  }
  initSprites(t = void 0) {
    const e = this._output().context[t || 0];
    this._layerManager.forEach(({ element: i, isFunction: s }) => {
      s || i.callInit(e, this._additionalModifier);
    }, t), this.map("initSprites", { canvasId: t });
  }
  resetIntend() {
    this._resetIntend = !0;
  }
  reset() {
    this._totalTimePassed = 0, this._resetIntend = !1;
    let t = this.pipe("reset", {}, new $t());
    if (Array.isArray(t)) {
      const e = t;
      t = new $t(), e.forEach((i) => {
        t.addLayer().addElements(i);
      });
    }
    t && (this._layerManager = t);
  }
}
const Vs = Ae;
class be {
  constructor(t) {
    u(this, "_duration");
    this._duration = x(t) - 0;
  }
  run(t, e) {
    return e - this._duration;
  }
}
var St = /* @__PURE__ */ ((a) => (a.FORCE_DISABLE = "F", a.STOP = "S", a.REMOVE = "R", a))(St || {});
class De {
  constructor(...t) {
    u(this, "sequences", []);
    u(this, "lastTimestamp", 0);
    u(this, "enabled", !0);
    let e = 0;
    typeof t[0] == "number" && (e = t.shift()), this.sequences = t.map((i) => {
      Array.isArray(i) || (i = [i]);
      let s = e;
      return typeof i[0] == "number" && (s = i.shift()), {
        position: 0,
        timelapsed: -s,
        sequence: i.map(
          (r) => typeof r.run != "function" ? typeof r == "number" ? new be(r) : { run: r } : r
        ).filter(
          (r) => typeof r.run == "function"
        ),
        label: i.reduce(
          (r, n, o) => (typeof n == "string" && (r[n] = o - Object.keys(r).length), r),
          {}
        ),
        enabled: !0
      };
    });
  }
  reset(t = 0) {
    this.sequences.forEach((e) => {
      var i, s;
      e.enabled = !0, e.position = 0, e.timelapsed = t, (s = (i = e.sequence[0]) == null ? void 0 : i.reset) == null || s.call(i, t);
    }), this.enabled = !0;
  }
  play(t = "", e = 0) {
    if (t) {
      const i = this.sequences.reduce((s, r) => {
        var n, o;
        return t in r.label ? (s = !0, r.position = r.label[t], r.enabled = !0, r.timelapsed = e, (o = (n = r.sequence[r.position]) == null ? void 0 : n.reset) == null || o.call(n)) : s = s || r.sequence.some(
          (f) => {
            var c;
            return (c = f.play) == null ? void 0 : c.call(f, t, e);
          }
        ), s;
      }, !1);
      return i && (this.enabled = !0), i;
    } else
      return this.sequences.forEach(
        (i) => i.enabled = !0
      ), this.enabled = !0, !0;
  }
  _runSequence(t, e, i) {
    var r, n;
    let s = i;
    for (; e.sequence[e.position] && s >= 0; ) {
      if (e.timelapsed += s, e.timelapsed < 0)
        return -1;
      const o = e.sequence[e.position].run(
        t,
        e.timelapsed
      );
      if (o === !0)
        s = 0;
      else {
        if (o === !1)
          return -1;
        if (o === "F")
          return e.enabled = !1, this.enabled = !1, i;
        if (o === "S")
          return e.enabled = !1, i;
        if (o === "R")
          return !0;
      }
      if (s = o, s >= 0 && (e.position = (e.position + 1) % e.sequence.length, (n = (r = e.sequence[e.position]) == null ? void 0 : r.reset) == null || n.call(r), e.timelapsed = 0, e.position === 0))
        return e.enabled = !1, s;
    }
    return s;
  }
  // call other animations
  run(t, e, i = !1) {
    let s = e;
    if (i || (s = e - this.lastTimestamp, this.lastTimestamp = e), !this.enabled)
      return s;
    const r = this.sequences.length;
    let n = 0, o = 1 / 0;
    for (let f = 0; f < r; f++)
      if (this.sequences[f].enabled) {
        const c = this._runSequence(
          t,
          this.sequences[f],
          s
        );
        if (c === !0)
          return !0;
        o = Math.min(o, c);
      } else
        n++;
    return n === r ? (this.enabled = !1, s) : o;
  }
}
const pt = De;
class dt {
  constructor(t) {
    u(this, "_needInit", !0);
    u(this, "p");
    this.p = this._parseParameterList(this._getParameterList(), t);
  }
  _parseParameterList(t, e) {
    const s = Object.entries(
      t
    ).map(([r, n]) => {
      const o = e[r];
      return [
        r,
        typeof n == "function" ? n(o, e) : O(x(o), n)
      ];
    });
    return Object.fromEntries(s);
  }
  _getBaseParameterList() {
    return {
      // animation
      animation: (t, e) => {
        const i = x(t);
        return Array.isArray(i) ? new pt(i) : i;
      },
      // if it's rendering or not
      enabled: !0,
      // if you can click it or not
      isClickable: !1,
      // tags to mark the sprites
      tag: (t, e) => {
        const i = x(t);
        return Array.isArray(i) ? i : i ? [i] : [];
      }
    };
  }
  _getParameterList() {
    return this._getBaseParameterList();
  }
  getElementsByTag(t) {
    if (typeof t == "function") {
      if (this.p.tag.filter(t).length)
        return [this];
    } else if ((Array.isArray(t) ? t : [t]).filter((i) => this.p.tag.includes(i)).length)
      return [this];
    return [];
  }
  // Animation-Funktion
  animate(t) {
    return this.p.animation && this.p.animation.run(this, t, !0) === !0 ? (this.p.enabled = !1, !0) : !1;
  }
  play(t = "", e = 0) {
    var i, s;
    this.p.animation && ((s = (i = this.p.animation).play) == null || s.call(i, t, e));
  }
  init(t, e) {
  }
  callInit(t, e) {
    this._needInit && (this.init(t, e), this._needInit = !1);
  }
  resize(t, e) {
  }
  _detectHelperCallback(t, e, i, s, r) {
    let n = !1;
    return t.enabled && t.isClickable && (e.save(), e.translate(t.x, t.y), e.scale(t.scaleX, t.scaleY), e.rotate(t.rotation), e.beginPath(), n = r(), e.restore()), n ? this : void 0;
  }
  _detectHelper({
    enabled: t,
    isClickable: e,
    x: i = 0,
    y: s = 0,
    width: r = 0,
    height: n = 0,
    scaleX: o = 1,
    scaleY: f = 1,
    rotation: c = 0
  }, m, b, k, S, H) {
    let L = !1;
    if (t && e) {
      const E = r / 2, X = n / 2;
      m.save(), S ? m.translate(i + E, s + X) : m.translate(i, s), m.scale(o, f), m.rotate(c), m.beginPath(), H ? L = H(E, X) : (m.rect(-E, -X, r, n), m.closePath(), L = m.isPointInPath(b, k)), m.restore();
    }
    return L ? this : void 0;
  }
  detectDraw(t, e) {
  }
  detect(t, e, i) {
  }
  draw(t, e) {
  }
}
let Re = class extends dt {
  constructor(e) {
    typeof e == "function" && (e = { callback: e });
    super(e);
    u(this, "_timePassed", 0);
  }
  _getParameterList() {
    return Object.assign({}, this._getBaseParameterList(), {
      callback: (e) => typeof e > "u" ? () => {
      } : e
    });
  }
  animate(e) {
    return this.p.enabled && (this._timePassed += e), super.animate(e);
  }
  draw(e, i) {
    this.p.enabled && this.p.callback(e, this._timePassed, i, this);
  }
};
const Le = Math.PI / 180, It = {
  // position
  x: 0,
  y: 0,
  // rotation
  rotation: (a, t) => O(
    x(a),
    O(
      x(t.rotationInRadian),
      O(x(t.rotationInDegree), 0) * Le
    )
  ),
  // scalling
  scaleX: (a, t) => O(x(a), O(x(t.scale), 1)),
  scaleY: (a, t) => O(x(a), O(x(t.scale), 1)),
  // alpha
  alpha: 1,
  // blending
  compositeOperation: "source-over",
  // color
  color: "#fff"
};
class Ne extends dt {
  constructor(t) {
    super(t);
  }
  _getParameterList() {
    return Object.assign(
      {},
      this._getBaseParameterList(),
      It
    );
  }
  detect(t, e, i) {
    return this._detectHelperCallback(this.p, t, e, i, () => (t.arc(
      0,
      0,
      1,
      Math.PI / 2 + this.p.rotation,
      Math.PI * 2.5 - this.p.rotation,
      !1
    ), t.isPointInPath(e, i)));
  }
  // Draw-Funktion
  draw(t, e) {
    this.p.enabled && (t.globalCompositeOperation = this.p.compositeOperation, t.globalAlpha = this.p.alpha * e.alpha, t.save(), t.translate(this.p.x, this.p.y), t.scale(this.p.scaleX, this.p.scaleY), t.beginPath(), t.fillStyle = this.p.color, t.arc(
      0,
      0,
      1,
      Math.PI / 2 + this.p.rotation,
      Math.PI * 2.5 - this.p.rotation,
      !1
    ), t.fill(), t.restore());
  }
}
class Yt extends dt {
  constructor(t) {
    super(t);
  }
  _getParameterList() {
    return Object.assign({}, super._getParameterList(), It, {
      sprite: []
    });
  }
  getElementsByTag(t) {
    let e = super.getElementsByTag(t);
    for (const i of this.p.sprite) {
      const s = i.getElementsByTag(t);
      s && (e = e.concat(s));
    }
    return e;
  }
  // overwrite change
  animate(t) {
    const e = super.animate(t);
    let i = !1;
    if (this.p.enabled)
      for (const s of this.p.sprite)
        i = i || s.animate(t) === !0;
    return this.p.animation ? e : (i && (this.p.enabled = !1), i);
  }
  play(t = "", e = 0) {
    var i, s, r;
    this.p.animation && ((s = (i = this.p.animation).play) == null || s.call(i, t, e));
    for (const n of this.p.sprite)
      (r = n.play) == null || r.call(n, t, e);
  }
  resize(t, e) {
    for (const i of this.p.sprite)
      i.resize(t, e);
  }
  callInit(t, e) {
    super.callInit(t, e);
    for (const i of this.p.sprite)
      i.callInit(t, e);
  }
  detectDraw(t, e) {
    if (this.p.enabled)
      for (const i of this.p.sprite)
        i.detectDraw(t, e);
  }
  detect(t, e, i) {
    if (this.p.enabled)
      for (const s of this.p.sprite) {
        const r = s.detect(t, e, i);
        if (r) return r;
      }
  }
  // draw-methode
  draw(t, e) {
    if (this.p.enabled) {
      this.p.alpha < 1 && (e = Object.assign({}, e), e.alpha *= this.p.alpha), t.save(), t.translate(this.p.x, this.p.y), t.scale(this.p.scaleX, this.p.scaleY), t.rotate(this.p.rotation);
      for (const i of this.p.sprite)
        i.draw(t, e);
      t.restore();
    }
  }
}
class Xe extends Yt {
  constructor(e) {
    super(e);
    u(this, "_currentGridSize");
    u(this, "_drawFrame", 2);
    u(this, "_temp_canvas");
    u(this, "_tctx");
  }
  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // x,y,width,height without default to enable norm
      x: void 0,
      y: void 0,
      width: void 0,
      height: void 0,
      canvasWidth: void 0,
      canvasHeight: void 0,
      gridSize: void 0,
      compositeOperation: "source-over",
      norm: (e, i) => O(
        x(e),
        x(i.x) === void 0 && x(i.y) === void 0 && x(i.width) === void 0 && x(i.height) === void 0
      ),
      isDrawFrame: (e, i) => O(e, 1)
    });
  }
  _generateTempCanvas(e) {
    const i = e.widthInPixel, s = e.heightInPixel, r = this.p;
    this._temp_canvas = document.createElement("canvas"), r.canvasWidth && r.canvasHeight ? (this._temp_canvas.width = r.canvasWidth, this._temp_canvas.height = r.canvasHeight) : r.gridSize ? (this._currentGridSize = r.gridSize, this._temp_canvas.width = Math.round(this._currentGridSize), this._temp_canvas.height = Math.round(this._currentGridSize)) : (this._temp_canvas.width = Math.round(i / r.scaleX), this._temp_canvas.height = Math.round(s / r.scaleY)), this._tctx = this._temp_canvas.getContext("2d");
  }
  _normalizeFullScreen(e) {
    const i = this.p;
    (i.norm || i.x === void 0) && (i.x = e.visibleScreen.x), (i.norm || i.y === void 0) && (i.y = e.visibleScreen.y), (i.norm || i.width === void 0) && (i.width = e.visibleScreen.width), (i.norm || i.height === void 0) && (i.height = e.visibleScreen.height);
  }
  _copyCanvas(e) {
    const i = this.p;
    if (this._temp_canvas && this._currentGridSize !== i.gridSize && !i.canvasWidth) {
      const s = this._temp_canvas;
      this._generateTempCanvas(e), this._tctx.globalCompositeOperation = "copy", this._tctx.drawImage(
        s,
        0,
        0,
        s.width,
        s.height,
        0,
        0,
        this._temp_canvas.width,
        this._temp_canvas.height
      ), this._tctx.globalCompositeOperation = "source-over", this._drawFrame = 2;
    }
    this._normalizeFullScreen(e);
  }
  resize(e, i) {
    this._copyCanvas(i), super.resize(e, i);
  }
  detect(e, i, s) {
    return this._detectHelper(this.p, e, i, s, !1);
  }
  init(e, i) {
    this._generateTempCanvas(i), this._normalizeFullScreen(i);
  }
  // draw-methode
  draw(e, i) {
    const s = this.p;
    if (s.enabled) {
      s.gridSize && this._currentGridSize !== s.gridSize && this._copyCanvas(i), this._drawFrame = Math.max(
        this._drawFrame - 1,
        x(s.isDrawFrame, e, i)
      );
      const r = s.width, n = s.height, o = r / 2, f = n / 2, c = this._temp_canvas.width, m = this._temp_canvas.height;
      if (this._drawFrame) {
        this._tctx.textBaseline = "middle", this._tctx.textAlign = "center", this._tctx.globalAlpha = 1, this._tctx.globalCompositeOperation = "source-over", this._tctx.save();
        const b = i.cam;
        if (s.norm && b) {
          const k = Math.max(c, m) / 2;
          this._tctx.translate(c / 2, m / 2), this._tctx.scale(k, k), this._tctx.scale(b.zoom, b.zoom), this._tctx.translate(-b.x, -b.y);
        }
        for (const k of s.sprite)
          k.draw(
            this._tctx,
            s.norm ? Object.assign({}, i, {
              alpha: 1,
              widthInPixel: c,
              heightInPixel: m
            }) : {
              alpha: 1,
              x: 0,
              y: 0,
              width: c,
              height: m,
              widthInPixel: c,
              heightInPixel: m,
              scaleCanvas: 1,
              visibleScreen: {
                x: 0,
                y: 0,
                width: c,
                height: m
              },
              fullScreen: {
                x: 0,
                y: 0,
                width: c,
                height: m
              }
            }
          );
        this._tctx.restore();
      }
      e.save(), e.globalCompositeOperation = s.compositeOperation, e.globalAlpha = s.alpha * i.alpha, e.translate(s.x + o, s.y + f), e.scale(s.scaleX, s.scaleY), e.rotate(s.rotation), e.drawImage(this._temp_canvas, 0, 0, c, m, -o, -f, r, n), e.restore();
    }
  }
}
class we extends Yt {
  constructor(t) {
    super(t.self || {});
    const e = O(x(t.count), 1);
    this.p.sprite = [];
    const i = t.class;
    for (let s = 0; s < e; s++) {
      const r = Object.entries(t).reduce(
        (n, [o, f]) => (["self", "class", "count"].includes(o) || (n[o] = x(f, s)), n),
        {}
      );
      this.p.sprite[s] = new i(r);
    }
  }
}
class xe extends dt {
  constructor(e) {
    super(e);
    u(this, "_temp_canvas");
    u(this, "_currentGridSize");
    u(this, "_tctx");
  }
  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // x,y,width,height without default to enable norm
      x: void 0,
      y: void 0,
      width: void 0,
      height: void 0,
      gridSize: void 0,
      darker: 0,
      pixel: !1,
      clear: !1,
      norm: (e, i) => O(
        x(e),
        x(i.x) === void 0 && x(i.y) === void 0 && x(i.width) === void 0 && x(i.height) === void 0
      ),
      // scalling
      scaleX: (e, i) => O(x(e), O(x(i.scale), 1)),
      scaleY: (e, i) => O(x(e), O(x(i.scale), 1)),
      // alpha
      alpha: 1,
      compositeOperation: "source-over"
    });
  }
  _generateTempCanvas(e) {
    const i = e.widthInPixel, s = e.heightInPixel, r = this.p;
    this._temp_canvas = document.createElement("canvas"), r.gridSize ? (this._currentGridSize = r.gridSize, this._temp_canvas.width = Math.round(this._currentGridSize), this._temp_canvas.height = Math.round(this._currentGridSize)) : (this._temp_canvas.width = Math.ceil(i / r.scaleX), this._temp_canvas.height = Math.ceil(s / r.scaleY)), this._tctx = this._temp_canvas.getContext("2d"), this._tctx.willReadFrequently = !0, this._tctx.globalCompositeOperation = "source-over", this._tctx.globalAlpha = 1;
  }
  normalizeFullScreen(e) {
    const i = this.p;
    (i.norm || i.x === void 0) && (i.x = e.visibleScreen.x), (i.norm || i.y === void 0) && (i.y = e.visibleScreen.y), (i.norm || i.width === void 0) && (i.width = e.visibleScreen.width), (i.norm || i.height === void 0) && (i.height = e.visibleScreen.height);
  }
  resize(e, i) {
    if (this._temp_canvas && this._currentGridSize !== this.p.gridSize) {
      const s = this._temp_canvas;
      this._generateTempCanvas(i), this._tctx.globalCompositeOperation = "copy", this._tctx.drawImage(
        s,
        0,
        0,
        s.width,
        s.height,
        0,
        0,
        this._temp_canvas.width,
        this._temp_canvas.height
      ), this._tctx.globalCompositeOperation = "source-over";
    }
    this.normalizeFullScreen(i);
  }
  detect(e, i, s) {
    return this._detectHelper(this.p, e, i, s, !1);
  }
  init(e, i) {
    this._generateTempCanvas(i), this.normalizeFullScreen(i);
  }
  // draw-methode
  draw(e, i) {
    const s = this.p;
    if (s.enabled && s.alpha > 0) {
      s.gridSize && this._currentGridSize !== s.gridSize && this.resize(void 0, i);
      const r = s.alpha * i.alpha, n = s.width, o = s.height, f = this._temp_canvas.width, c = this._temp_canvas.height;
      if (r > 0 && f && c) {
        this._tctx.globalCompositeOperation = "copy", this._tctx.globalAlpha = 1, this._tctx.drawImage(
          e.canvas,
          0,
          0,
          e.canvas.width,
          e.canvas.height,
          0,
          0,
          f,
          c
        ), s.darker > 0 && (this._tctx.globalCompositeOperation = s.clear ? "source-atop" : "source-over", this._tctx.fillStyle = "rgba(0,0,0," + s.darker + ")", this._tctx.fillRect(0, 0, f, c)), "additionalBlur" in this && typeof this.additionalBlur == "function" && this.additionalBlur(f, c, i), s.clear && (e.globalCompositeOperation = "source-over", e.globalAlpha = 1, e.clearRect(s.x, s.y, n, o)), e.globalCompositeOperation = s.compositeOperation, e.globalAlpha = r;
        const m = e.imageSmoothingEnabled;
        e.imageSmoothingEnabled = !s.pixel, e.drawImage(
          this._temp_canvas,
          0,
          0,
          f,
          c,
          s.x,
          s.y,
          n,
          o
        ), e.imageSmoothingEnabled = m;
      }
    } else
      s.clear && (s.x || (s.x = i.x), s.y || (s.y = i.y), s.width || (s.width = i.width), s.height || (s.height = i.height), e.clearRect(s.x, s.y, s.width, s.height));
  }
}
var at = /* @__PURE__ */ ((a) => (a[a.LEFT_TOP = 0] = "LEFT_TOP", a[a.CENTER = 1] = "CENTER", a))(at || {});
let He = class extends dt {
  constructor(e) {
    super(e);
    u(this, "_currentTintKey");
    u(this, "_normScale");
    u(this, "_temp_canvas");
    u(this, "_tctx");
  }
  _getParameterList() {
    return Object.assign({}, super._getParameterList(), It, {
      // set image
      image: (e) => jt.getImage(x(e)),
      // relative position
      position: at.CENTER,
      // cutting for sprite stripes
      frameX: 0,
      frameY: 0,
      frameWidth: 0,
      frameHeight: 0,
      width: void 0,
      height: void 0,
      // autoscale to max
      norm: !1,
      normCover: !1,
      normToScreen: !1,
      clickExact: !1,
      color: "#FFF",
      tint: 0
    });
  }
  resize(e, i) {
    this._needInit = !0;
  }
  init(e, i) {
    const s = this.p, r = s.frameWidth || s.image.width, n = s.frameHeight || s.image.height;
    this._normScale = s.normToScreen ? s.normCover ? Math.max(
      i.fullScreen.width / r,
      i.fullScreen.height / n
    ) : s.norm ? Math.min(
      i.fullScreen.width / r,
      i.fullScreen.height / n
    ) : 1 : s.normCover ? Math.max(
      i.width / r,
      i.height / n
    ) : s.norm ? Math.min(
      i.width / r,
      i.height / n
    ) : 1;
  }
  _tintCacheKey() {
    const e = this.p.frameWidth || this.p.image.width, i = this.p.frameHeight || this.p.image.height;
    return [
      this.p.tint,
      e,
      i,
      this.p.color,
      this.p.frameX,
      this.p.frameY
    ].join(";");
  }
  _temp_context(e, i) {
    return this._temp_canvas || (this._temp_canvas = document.createElement("canvas"), this._tctx = this._temp_canvas.getContext("2d")), this._temp_canvas.width = e, this._temp_canvas.height = i, this._tctx;
  }
  detectDraw(e, i) {
    const s = this.p;
    if (s.enabled && s.isClickable && s.clickExact) {
      const r = s.frameWidth || s.image.width, n = s.frameHeight || s.image.height, o = (s.width ? s.width : r) * this._normScale * s.scaleX, f = (s.height ? s.height : n) * this._normScale * s.scaleY, c = s.position === at.LEFT_TOP, m = this._temp_context(r, n);
      m.globalAlpha = 1, m.globalCompositeOperation = "source-over", m.fillStyle = i, m.fillRect(0, 0, r, n), m.globalCompositeOperation = "destination-atop", m.drawImage(
        s.image,
        s.frameX,
        s.frameY,
        r,
        n,
        0,
        0,
        r,
        n
      ), e.save(), e.translate(s.x, s.y), e.scale(s.scaleX, s.scaleY), e.rotate(s.rotation), e.drawImage(
        this._temp_canvas,
        0,
        0,
        r,
        n,
        c ? 0 : -o / 2,
        c ? 0 : -f / 2,
        o,
        f
      ), e.restore(), this._currentTintKey = void 0;
    }
  }
  detect(e, i, s) {
    return this.p.enabled && this.p.isClickable && this.p.clickExact ? "c" : this._detectHelper(this.p, e, i, s, !1);
  }
  // Draw-Funktion
  draw(e, i) {
    const s = this.p;
    if (s.enabled && s.image && s.alpha > 0) {
      const r = s.frameWidth || s.image.width, n = s.frameHeight || s.image.height, o = (s.width ? s.width : r) * this._normScale * s.scaleX, f = (s.height ? s.height : n) * this._normScale * s.scaleY;
      e.globalCompositeOperation = s.compositeOperation, e.globalAlpha = s.alpha * i.alpha;
      const c = s.position !== at.LEFT_TOP;
      let m = s.image, b = s.frameX, k = s.frameY;
      if (s.tint) {
        const L = this._tintCacheKey();
        if (this._currentTintKey !== L) {
          const E = this._temp_context(r, n);
          E.globalAlpha = 1, E.globalCompositeOperation = "source-over", E.clearRect(0, 0, r, n), E.globalAlpha = s.tint, E.fillStyle = s.color, E.fillRect(0, 0, r, n), E.globalAlpha = 1, E.globalCompositeOperation = "destination-atop", E.drawImage(
            s.image,
            s.frameX,
            s.frameY,
            r,
            n,
            0,
            0,
            r,
            n
          ), this._currentTintKey = L;
        }
        m = this._temp_canvas, b = 0, k = 0;
      }
      let S = 0, H = 0;
      c && (S = -o / 2, H = -f / 2), s.rotation == 0 ? e.drawImage(
        m,
        b,
        k,
        r,
        n,
        s.x + S,
        s.y + H,
        o,
        f
      ) : (e.save(), e.translate(s.x, s.y), e.rotate(s.rotation), e.drawImage(
        m,
        b,
        k,
        r,
        n,
        S,
        H,
        o,
        f
      ), e.restore());
    }
  }
};
class Te extends dt {
  constructor(t) {
    super(t);
  }
  _getParameterList() {
    return Object.assign(
      {},
      this._getBaseParameterList(),
      It,
      {
        text: (t) => {
          const e = x(t);
          return (Array.isArray(e) ? e.join("") : e) || "";
        },
        font: "2em monospace",
        position: at.CENTER,
        color: void 0,
        borderColor: void 0,
        lineWidth: 1
      }
    );
  }
  detectDraw(t, e) {
    this.p.enabled && this.p.isClickable && (t.save(), t.translate(this.p.x, this.p.y), t.scale(this.p.scaleX, this.p.scaleY), t.rotate(this.p.rotation), this.p.position || (t.textAlign = "left", t.textBaseline = "top"), t.font = this.p.font, t.fillStyle = e, t.fillText(this.p.text, 0, 0), t.restore());
  }
  detect(t, e, i) {
    return "c";
  }
  // draw-methode
  draw(t, e) {
    this.p.enabled && (t.globalCompositeOperation = this.p.compositeOperation, t.globalAlpha = this.p.alpha * e.alpha, t.save(), this.p.position || (t.textAlign = "left", t.textBaseline = "top"), t.translate(this.p.x, this.p.y), t.scale(this.p.scaleX, this.p.scaleY), t.rotate(this.p.rotation), t.font = this.p.font, this.p.color && (t.fillStyle = this.p.color, t.fillText(this.p.text, 0, 0)), this.p.borderColor && (t.strokeStyle = this.p.borderColor, t.lineWidth = this.p.lineWidth, t.strokeText(this.p.text, 0, 0)), t.restore());
  }
}
function q(a, t) {
  je(a) && (a = "100%");
  var e = Ye(a);
  return a = t === 360 ? a : Math.min(t, Math.max(0, parseFloat(a))), e && (a = parseInt(String(a * t), 10) / 100), Math.abs(a - t) < 1e-6 ? 1 : (t === 360 ? a = (a < 0 ? a % t + t : a % t) / parseFloat(String(t)) : a = a % t / parseFloat(String(t)), a);
}
function Xt(a) {
  return Math.min(1, Math.max(0, a));
}
function je(a) {
  return typeof a == "string" && a.indexOf(".") !== -1 && parseFloat(a) === 1;
}
function Ye(a) {
  return typeof a == "string" && a.indexOf("%") !== -1;
}
function Se(a) {
  return a = parseFloat(a), (isNaN(a) || a < 0 || a > 1) && (a = 1), a;
}
function Ht(a) {
  return a <= 1 ? "".concat(Number(a) * 100, "%") : a;
}
function vt(a) {
  return a.length === 1 ? "0" + a : String(a);
}
function Be(a, t, e) {
  return {
    r: q(a, 255) * 255,
    g: q(t, 255) * 255,
    b: q(e, 255) * 255
  };
}
function ne(a, t, e) {
  a = q(a, 255), t = q(t, 255), e = q(e, 255);
  var i = Math.max(a, t, e), s = Math.min(a, t, e), r = 0, n = 0, o = (i + s) / 2;
  if (i === s)
    n = 0, r = 0;
  else {
    var f = i - s;
    switch (n = o > 0.5 ? f / (2 - i - s) : f / (i + s), i) {
      case a:
        r = (t - e) / f + (t < e ? 6 : 0);
        break;
      case t:
        r = (e - a) / f + 2;
        break;
      case e:
        r = (a - t) / f + 4;
        break;
    }
    r /= 6;
  }
  return { h: r, s: n, l: o };
}
function Zt(a, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? a + (t - a) * (6 * e) : e < 1 / 2 ? t : e < 2 / 3 ? a + (t - a) * (2 / 3 - e) * 6 : a;
}
function We(a, t, e) {
  var i, s, r;
  if (a = q(a, 360), t = q(t, 100), e = q(e, 100), t === 0)
    s = e, r = e, i = e;
  else {
    var n = e < 0.5 ? e * (1 + t) : e + t - e * t, o = 2 * e - n;
    i = Zt(o, n, a + 1 / 3), s = Zt(o, n, a), r = Zt(o, n, a - 1 / 3);
  }
  return { r: i * 255, g: s * 255, b: r * 255 };
}
function oe(a, t, e) {
  a = q(a, 255), t = q(t, 255), e = q(e, 255);
  var i = Math.max(a, t, e), s = Math.min(a, t, e), r = 0, n = i, o = i - s, f = i === 0 ? 0 : o / i;
  if (i === s)
    r = 0;
  else {
    switch (i) {
      case a:
        r = (t - e) / o + (t < e ? 6 : 0);
        break;
      case t:
        r = (e - a) / o + 2;
        break;
      case e:
        r = (a - t) / o + 4;
        break;
    }
    r /= 6;
  }
  return { h: r, s: f, v: n };
}
function qe(a, t, e) {
  a = q(a, 360) * 6, t = q(t, 100), e = q(e, 100);
  var i = Math.floor(a), s = a - i, r = e * (1 - t), n = e * (1 - s * t), o = e * (1 - (1 - s) * t), f = i % 6, c = [e, n, r, r, o, e][f], m = [o, e, e, n, r, r][f], b = [r, r, o, e, e, n][f];
  return { r: c * 255, g: m * 255, b: b * 255 };
}
function he(a, t, e, i) {
  var s = [
    vt(Math.round(a).toString(16)),
    vt(Math.round(t).toString(16)),
    vt(Math.round(e).toString(16))
  ];
  return i && s[0].startsWith(s[0].charAt(1)) && s[1].startsWith(s[1].charAt(1)) && s[2].startsWith(s[2].charAt(1)) ? s[0].charAt(0) + s[1].charAt(0) + s[2].charAt(0) : s.join("");
}
function Ue(a, t, e, i, s) {
  var r = [
    vt(Math.round(a).toString(16)),
    vt(Math.round(t).toString(16)),
    vt(Math.round(e).toString(16)),
    vt(Ve(i))
  ];
  return s && r[0].startsWith(r[0].charAt(1)) && r[1].startsWith(r[1].charAt(1)) && r[2].startsWith(r[2].charAt(1)) && r[3].startsWith(r[3].charAt(1)) ? r[0].charAt(0) + r[1].charAt(0) + r[2].charAt(0) + r[3].charAt(0) : r.join("");
}
function Ve(a) {
  return Math.round(parseFloat(a) * 255).toString(16);
}
function le(a) {
  return K(a) / 255;
}
function K(a) {
  return parseInt(a, 16);
}
function Ge(a) {
  return {
    r: a >> 16,
    g: (a & 65280) >> 8,
    b: a & 255
  };
}
var Qt = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
function $e(a) {
  var t = { r: 0, g: 0, b: 0 }, e = 1, i = null, s = null, r = null, n = !1, o = !1;
  return typeof a == "string" && (a = Je(a)), typeof a == "object" && (ut(a.r) && ut(a.g) && ut(a.b) ? (t = Be(a.r, a.g, a.b), n = !0, o = String(a.r).substr(-1) === "%" ? "prgb" : "rgb") : ut(a.h) && ut(a.s) && ut(a.v) ? (i = Ht(a.s), s = Ht(a.v), t = qe(a.h, i, s), n = !0, o = "hsv") : ut(a.h) && ut(a.s) && ut(a.l) && (i = Ht(a.s), r = Ht(a.l), t = We(a.h, i, r), n = !0, o = "hsl"), Object.prototype.hasOwnProperty.call(a, "a") && (e = a.a)), e = Se(e), {
    ok: n,
    format: a.format || o,
    r: Math.min(255, Math.max(t.r, 0)),
    g: Math.min(255, Math.max(t.g, 0)),
    b: Math.min(255, Math.max(t.b, 0)),
    a: e
  };
}
var Ze = "[-\\+]?\\d+%?", Ke = "[-\\+]?\\d*\\.\\d+%?", _t = "(?:".concat(Ke, ")|(?:").concat(Ze, ")"), Kt = "[\\s|\\(]+(".concat(_t, ")[,|\\s]+(").concat(_t, ")[,|\\s]+(").concat(_t, ")\\s*\\)?"), Jt = "[\\s|\\(]+(".concat(_t, ")[,|\\s]+(").concat(_t, ")[,|\\s]+(").concat(_t, ")[,|\\s]+(").concat(_t, ")\\s*\\)?"), st = {
  CSS_UNIT: new RegExp(_t),
  rgb: new RegExp("rgb" + Kt),
  rgba: new RegExp("rgba" + Jt),
  hsl: new RegExp("hsl" + Kt),
  hsla: new RegExp("hsla" + Jt),
  hsv: new RegExp("hsv" + Kt),
  hsva: new RegExp("hsva" + Jt),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
function Je(a) {
  if (a = a.trim().toLowerCase(), a.length === 0)
    return !1;
  var t = !1;
  if (Qt[a])
    a = Qt[a], t = !0;
  else if (a === "transparent")
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  var e = st.rgb.exec(a);
  return e ? { r: e[1], g: e[2], b: e[3] } : (e = st.rgba.exec(a), e ? { r: e[1], g: e[2], b: e[3], a: e[4] } : (e = st.hsl.exec(a), e ? { h: e[1], s: e[2], l: e[3] } : (e = st.hsla.exec(a), e ? { h: e[1], s: e[2], l: e[3], a: e[4] } : (e = st.hsv.exec(a), e ? { h: e[1], s: e[2], v: e[3] } : (e = st.hsva.exec(a), e ? { h: e[1], s: e[2], v: e[3], a: e[4] } : (e = st.hex8.exec(a), e ? {
    r: K(e[1]),
    g: K(e[2]),
    b: K(e[3]),
    a: le(e[4]),
    format: t ? "name" : "hex8"
  } : (e = st.hex6.exec(a), e ? {
    r: K(e[1]),
    g: K(e[2]),
    b: K(e[3]),
    format: t ? "name" : "hex"
  } : (e = st.hex4.exec(a), e ? {
    r: K(e[1] + e[1]),
    g: K(e[2] + e[2]),
    b: K(e[3] + e[3]),
    a: le(e[4] + e[4]),
    format: t ? "name" : "hex8"
  } : (e = st.hex3.exec(a), e ? {
    r: K(e[1] + e[1]),
    g: K(e[2] + e[2]),
    b: K(e[3] + e[3]),
    format: t ? "name" : "hex"
  } : !1)))))))));
}
function ut(a) {
  return !!st.CSS_UNIT.exec(String(a));
}
var zt = (
  /** @class */
  function() {
    function a(t, e) {
      t === void 0 && (t = ""), e === void 0 && (e = {});
      var i;
      if (t instanceof a)
        return t;
      typeof t == "number" && (t = Ge(t)), this.originalInput = t;
      var s = $e(t);
      this.originalInput = t, this.r = s.r, this.g = s.g, this.b = s.b, this.a = s.a, this.roundA = Math.round(100 * this.a) / 100, this.format = (i = e.format) !== null && i !== void 0 ? i : s.format, this.gradientType = e.gradientType, this.r < 1 && (this.r = Math.round(this.r)), this.g < 1 && (this.g = Math.round(this.g)), this.b < 1 && (this.b = Math.round(this.b)), this.isValid = s.ok;
    }
    return a.prototype.isDark = function() {
      return this.getBrightness() < 128;
    }, a.prototype.isLight = function() {
      return !this.isDark();
    }, a.prototype.getBrightness = function() {
      var t = this.toRgb();
      return (t.r * 299 + t.g * 587 + t.b * 114) / 1e3;
    }, a.prototype.getLuminance = function() {
      var t = this.toRgb(), e, i, s, r = t.r / 255, n = t.g / 255, o = t.b / 255;
      return r <= 0.03928 ? e = r / 12.92 : e = Math.pow((r + 0.055) / 1.055, 2.4), n <= 0.03928 ? i = n / 12.92 : i = Math.pow((n + 0.055) / 1.055, 2.4), o <= 0.03928 ? s = o / 12.92 : s = Math.pow((o + 0.055) / 1.055, 2.4), 0.2126 * e + 0.7152 * i + 0.0722 * s;
    }, a.prototype.getAlpha = function() {
      return this.a;
    }, a.prototype.setAlpha = function(t) {
      return this.a = Se(t), this.roundA = Math.round(100 * this.a) / 100, this;
    }, a.prototype.isMonochrome = function() {
      var t = this.toHsl().s;
      return t === 0;
    }, a.prototype.toHsv = function() {
      var t = oe(this.r, this.g, this.b);
      return { h: t.h * 360, s: t.s, v: t.v, a: this.a };
    }, a.prototype.toHsvString = function() {
      var t = oe(this.r, this.g, this.b), e = Math.round(t.h * 360), i = Math.round(t.s * 100), s = Math.round(t.v * 100);
      return this.a === 1 ? "hsv(".concat(e, ", ").concat(i, "%, ").concat(s, "%)") : "hsva(".concat(e, ", ").concat(i, "%, ").concat(s, "%, ").concat(this.roundA, ")");
    }, a.prototype.toHsl = function() {
      var t = ne(this.r, this.g, this.b);
      return { h: t.h * 360, s: t.s, l: t.l, a: this.a };
    }, a.prototype.toHslString = function() {
      var t = ne(this.r, this.g, this.b), e = Math.round(t.h * 360), i = Math.round(t.s * 100), s = Math.round(t.l * 100);
      return this.a === 1 ? "hsl(".concat(e, ", ").concat(i, "%, ").concat(s, "%)") : "hsla(".concat(e, ", ").concat(i, "%, ").concat(s, "%, ").concat(this.roundA, ")");
    }, a.prototype.toHex = function(t) {
      return t === void 0 && (t = !1), he(this.r, this.g, this.b, t);
    }, a.prototype.toHexString = function(t) {
      return t === void 0 && (t = !1), "#" + this.toHex(t);
    }, a.prototype.toHex8 = function(t) {
      return t === void 0 && (t = !1), Ue(this.r, this.g, this.b, this.a, t);
    }, a.prototype.toHex8String = function(t) {
      return t === void 0 && (t = !1), "#" + this.toHex8(t);
    }, a.prototype.toHexShortString = function(t) {
      return t === void 0 && (t = !1), this.a === 1 ? this.toHexString(t) : this.toHex8String(t);
    }, a.prototype.toRgb = function() {
      return {
        r: Math.round(this.r),
        g: Math.round(this.g),
        b: Math.round(this.b),
        a: this.a
      };
    }, a.prototype.toRgbString = function() {
      var t = Math.round(this.r), e = Math.round(this.g), i = Math.round(this.b);
      return this.a === 1 ? "rgb(".concat(t, ", ").concat(e, ", ").concat(i, ")") : "rgba(".concat(t, ", ").concat(e, ", ").concat(i, ", ").concat(this.roundA, ")");
    }, a.prototype.toPercentageRgb = function() {
      var t = function(e) {
        return "".concat(Math.round(q(e, 255) * 100), "%");
      };
      return {
        r: t(this.r),
        g: t(this.g),
        b: t(this.b),
        a: this.a
      };
    }, a.prototype.toPercentageRgbString = function() {
      var t = function(e) {
        return Math.round(q(e, 255) * 100);
      };
      return this.a === 1 ? "rgb(".concat(t(this.r), "%, ").concat(t(this.g), "%, ").concat(t(this.b), "%)") : "rgba(".concat(t(this.r), "%, ").concat(t(this.g), "%, ").concat(t(this.b), "%, ").concat(this.roundA, ")");
    }, a.prototype.toName = function() {
      if (this.a === 0)
        return "transparent";
      if (this.a < 1)
        return !1;
      for (var t = "#" + he(this.r, this.g, this.b, !1), e = 0, i = Object.entries(Qt); e < i.length; e++) {
        var s = i[e], r = s[0], n = s[1];
        if (t === n)
          return r;
      }
      return !1;
    }, a.prototype.toString = function(t) {
      var e = !!t;
      t = t ?? this.format;
      var i = !1, s = this.a < 1 && this.a >= 0, r = !e && s && (t.startsWith("hex") || t === "name");
      return r ? t === "name" && this.a === 0 ? this.toName() : this.toRgbString() : (t === "rgb" && (i = this.toRgbString()), t === "prgb" && (i = this.toPercentageRgbString()), (t === "hex" || t === "hex6") && (i = this.toHexString()), t === "hex3" && (i = this.toHexString(!0)), t === "hex4" && (i = this.toHex8String(!0)), t === "hex8" && (i = this.toHex8String()), t === "name" && (i = this.toName()), t === "hsl" && (i = this.toHslString()), t === "hsv" && (i = this.toHsvString()), i || this.toHexString());
    }, a.prototype.toNumber = function() {
      return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    }, a.prototype.clone = function() {
      return new a(this.toString());
    }, a.prototype.lighten = function(t) {
      t === void 0 && (t = 10);
      var e = this.toHsl();
      return e.l += t / 100, e.l = Xt(e.l), new a(e);
    }, a.prototype.brighten = function(t) {
      t === void 0 && (t = 10);
      var e = this.toRgb();
      return e.r = Math.max(0, Math.min(255, e.r - Math.round(255 * -(t / 100)))), e.g = Math.max(0, Math.min(255, e.g - Math.round(255 * -(t / 100)))), e.b = Math.max(0, Math.min(255, e.b - Math.round(255 * -(t / 100)))), new a(e);
    }, a.prototype.darken = function(t) {
      t === void 0 && (t = 10);
      var e = this.toHsl();
      return e.l -= t / 100, e.l = Xt(e.l), new a(e);
    }, a.prototype.tint = function(t) {
      return t === void 0 && (t = 10), this.mix("white", t);
    }, a.prototype.shade = function(t) {
      return t === void 0 && (t = 10), this.mix("black", t);
    }, a.prototype.desaturate = function(t) {
      t === void 0 && (t = 10);
      var e = this.toHsl();
      return e.s -= t / 100, e.s = Xt(e.s), new a(e);
    }, a.prototype.saturate = function(t) {
      t === void 0 && (t = 10);
      var e = this.toHsl();
      return e.s += t / 100, e.s = Xt(e.s), new a(e);
    }, a.prototype.greyscale = function() {
      return this.desaturate(100);
    }, a.prototype.spin = function(t) {
      var e = this.toHsl(), i = (e.h + t) % 360;
      return e.h = i < 0 ? 360 + i : i, new a(e);
    }, a.prototype.mix = function(t, e) {
      e === void 0 && (e = 50);
      var i = this.toRgb(), s = new a(t).toRgb(), r = e / 100, n = {
        r: (s.r - i.r) * r + i.r,
        g: (s.g - i.g) * r + i.g,
        b: (s.b - i.b) * r + i.b,
        a: (s.a - i.a) * r + i.a
      };
      return new a(n);
    }, a.prototype.analogous = function(t, e) {
      t === void 0 && (t = 6), e === void 0 && (e = 30);
      var i = this.toHsl(), s = 360 / e, r = [this];
      for (i.h = (i.h - (s * t >> 1) + 720) % 360; --t; )
        i.h = (i.h + s) % 360, r.push(new a(i));
      return r;
    }, a.prototype.complement = function() {
      var t = this.toHsl();
      return t.h = (t.h + 180) % 360, new a(t);
    }, a.prototype.monochromatic = function(t) {
      t === void 0 && (t = 6);
      for (var e = this.toHsv(), i = e.h, s = e.s, r = e.v, n = [], o = 1 / t; t--; )
        n.push(new a({ h: i, s, v: r })), r = (r + o) % 1;
      return n;
    }, a.prototype.splitcomplement = function() {
      var t = this.toHsl(), e = t.h;
      return [
        this,
        new a({ h: (e + 72) % 360, s: t.s, l: t.l }),
        new a({ h: (e + 216) % 360, s: t.s, l: t.l })
      ];
    }, a.prototype.onBackground = function(t) {
      var e = this.toRgb(), i = new a(t).toRgb(), s = e.a + i.a * (1 - e.a);
      return new a({
        r: (e.r * e.a + i.r * i.a * (1 - e.a)) / s,
        g: (e.g * e.a + i.g * i.a * (1 - e.a)) / s,
        b: (e.b * e.a + i.b * i.a * (1 - e.a)) / s,
        a: s
      });
    }, a.prototype.triad = function() {
      return this.polyad(3);
    }, a.prototype.tetrad = function() {
      return this.polyad(4);
    }, a.prototype.polyad = function(t) {
      for (var e = this.toHsl(), i = e.h, s = [this], r = 360 / t, n = 1; n < t; n++)
        s.push(new a({ h: (i + n * r) % 360, s: e.s, l: e.l }));
      return s;
    }, a.prototype.equals = function(t) {
      return this.toRgbString() === new a(t).toRgbString();
    }, a;
  }()
);
const ft = 64, j = 4, kt = ft >> 1, ht = class ht extends dt {
  constructor(e) {
    super(e);
    u(this, "_currentScaleX");
    u(this, "_currentPixelSmoothing", !1);
  }
  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      x: 0,
      y: 0,
      // scalling
      scaleX: (e, i) => O(x(e), O(x(i.scale), 1)),
      scaleY: (e, i) => O(x(e), O(x(i.scale), 1)),
      color: "#FFF",
      alpha: 1,
      compositeOperation: "source-over"
    });
  }
  static getGradientImage(e, i, s) {
    const r = e >> j, n = i >> j, o = s >> j;
    if (!ht._Gradient) {
      const f = 256 >> j;
      ht._Gradient = Array.from(
        { length: f },
        (c) => Array.from({ length: f }, (m) => Array.from({ length: f }))
      );
    }
    return ht._Gradient[r][n][o] || (ht._Gradient[r][n][o] = ht.generateGradientImage(
      r,
      n,
      o
    )), ht._Gradient[r][n][o];
  }
  static generateGradientImage(e, i, s) {
    const r = document.createElement("canvas");
    r.width = r.height = ft;
    const n = r.getContext("2d");
    n.globalAlpha = 1, n.globalCompositeOperation = "source-over", n.clearRect(0, 0, ft, ft);
    const o = n.createRadialGradient(
      kt,
      kt,
      0,
      kt,
      kt,
      kt
    );
    return o.addColorStop(
      0,
      "rgba(" + ((e << j) + (1 << j) - 1) + "," + ((i << j) + (1 << j) - 1) + "," + ((s << j) + (1 << j) - 1) + ",1)"
    ), o.addColorStop(
      0.3,
      "rgba(" + ((e << j) + (1 << j) - 1) + "," + ((i << j) + (1 << j) - 1) + "," + ((s << j) + (1 << j) - 1) + ",0.4)"
    ), o.addColorStop(
      1,
      "rgba(" + ((e << j) + (1 << j) - 1) + "," + ((i << j) + (1 << j) - 1) + "," + ((s << j) + (1 << j) - 1) + ",0)"
    ), n.fillStyle = o, n.fillRect(0, 0, ft, ft), r;
  }
  resize(e, i) {
    this._currentScaleX = void 0;
  }
  // draw-methode
  draw(e, i) {
    const s = this.p;
    if (s.enabled && s.alpha > 0) {
      (!s.color || !s.color.r) && (s.color = new zt(s.color).toRgb()), this._currentScaleX !== s.scaleX && (this._currentScaleX = s.scaleX, this._currentPixelSmoothing = s.scaleX * i.widthInPixel / i.width > ft);
      const { r, g: n, b: o } = s.color;
      e.globalCompositeOperation = s.compositeOperation, e.globalAlpha = s.alpha * i.alpha, e.imageSmoothingEnabled = this._currentPixelSmoothing, e.drawImage(
        ht.getGradientImage(r, n, o),
        0,
        0,
        ft,
        ft,
        s.x - s.scaleX / 2,
        s.y - s.scaleY / 2,
        s.scaleX,
        s.scaleY
      ), e.imageSmoothingEnabled = !0;
    }
  }
};
u(ht, "_Gradient");
let te = ht;
var Qe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ce(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var Me = { exports: {} };
(function(a, t) {
  (function(e, i) {
    a.exports = i();
  })(Qe, function() {
    var e = /* @__PURE__ */ function() {
      function p(_, h) {
        var l = [], g = !0, v = !1, w = void 0;
        try {
          for (var y = _[Symbol.iterator](), T; !(g = (T = y.next()).done) && (l.push(T.value), !(h && l.length === h)); g = !0)
            ;
        } catch (P) {
          v = !0, w = P;
        } finally {
          try {
            !g && y.return && y.return();
          } finally {
            if (v) throw w;
          }
        }
        return l;
      }
      return function(_, h) {
        if (Array.isArray(_))
          return _;
        if (Symbol.iterator in Object(_))
          return p(_, h);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      };
    }(), i = Math.PI * 2, s = function(_, h, l, g, v, w, y) {
      var T = _.x, P = _.y;
      T *= h, P *= l;
      var z = g * T - v * P, A = v * T + g * P;
      return {
        x: z + w,
        y: A + y
      };
    }, r = function(_, h) {
      var l = 1.3333333333333333 * Math.tan(h / 4), g = Math.cos(_), v = Math.sin(_), w = Math.cos(_ + h), y = Math.sin(_ + h);
      return [{
        x: g - v * l,
        y: v + g * l
      }, {
        x: w + y * l,
        y: y - w * l
      }, {
        x: w,
        y
      }];
    }, n = function(_, h, l, g) {
      var v = _ * g - h * l < 0 ? -1 : 1, w = Math.sqrt(_ * _ + h * h), y = Math.sqrt(_ * _ + h * h), T = _ * l + h * g, P = T / (w * y);
      return P > 1 && (P = 1), P < -1 && (P = -1), v * Math.acos(P);
    }, o = function(_, h, l, g, v, w, y, T, P, z, A, R) {
      var D = Math.pow(v, 2), N = Math.pow(w, 2), d = Math.pow(A, 2), B = Math.pow(R, 2), C = D * N - D * B - N * d;
      C < 0 && (C = 0), C /= D * B + N * d, C = Math.sqrt(C) * (y === T ? -1 : 1);
      var I = C * v / w * R, W = C * -w / v * A, tt = z * I - P * W + (_ + l) / 2, Z = P * I + z * W + (h + g) / 2, rt = (A - I) / v, nt = (R - W) / w, Q = (-A - I) / v, et = (-R - W) / w, gt = n(1, 0, rt, nt), it = n(rt, nt, Q, et);
      return T === 0 && it > 0 && (it -= i), T === 1 && it < 0 && (it += i), [tt, Z, gt, it];
    }, f = function(_) {
      var h = _.px, l = _.py, g = _.cx, v = _.cy, w = _.rx, y = _.ry, T = _.xAxisRotation, P = T === void 0 ? 0 : T, z = _.largeArcFlag, A = z === void 0 ? 0 : z, R = _.sweepFlag, D = R === void 0 ? 0 : R, N = [];
      if (w === 0 || y === 0)
        return [];
      var d = Math.sin(P * i / 360), B = Math.cos(P * i / 360), C = B * (h - g) / 2 + d * (l - v) / 2, I = -d * (h - g) / 2 + B * (l - v) / 2;
      if (C === 0 && I === 0)
        return [];
      w = Math.abs(w), y = Math.abs(y);
      var W = Math.pow(C, 2) / Math.pow(w, 2) + Math.pow(I, 2) / Math.pow(y, 2);
      W > 1 && (w *= Math.sqrt(W), y *= Math.sqrt(W));
      var tt = o(h, l, g, v, w, y, A, D, d, B, C, I), Z = e(tt, 4), rt = Z[0], nt = Z[1], Q = Z[2], et = Z[3], gt = Math.max(Math.ceil(Math.abs(et) / (i / 4)), 1);
      et /= gt;
      for (var it = 0; it < gt; it++)
        N.push(r(Q, et)), Q += et;
      return N.map(function(wt) {
        var Ct = s(wt[0], w, y, B, d, rt, nt), mt = Ct.x, lt = Ct.y, ot = s(wt[1], w, y, B, d, rt, nt), ct = ot.x, U = ot.y, xt = s(wt[2], w, y, B, d, rt, nt), Mt = xt.x, Et = xt.y;
        return { x1: mt, y1: lt, x2: ct, y2: U, x: Mt, y: Et };
      });
    }, c = {
      a: 7,
      c: 6,
      h: 1,
      l: 2,
      m: 2,
      q: 4,
      s: 4,
      t: 2,
      v: 1,
      z: 0
      /**
       * segment pattern
       * @type {RegExp}
       */
    }, m = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
    function b(p) {
      var _ = [];
      return p.replace(m, function(h, l, g) {
        var v = l.toLowerCase();
        for (g = S(g), v == "m" && g.length > 2 && (_.push([l].concat(g.splice(0, 2))), v = "l", l = l == "m" ? "l" : "L"); ; ) {
          if (g.length == c[v])
            return g.unshift(l), _.push(g);
          if (g.length < c[v]) throw new Error("malformed path data");
          _.push([l].concat(g.splice(0, c[v])));
        }
      }), _;
    }
    var k = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
    function S(p) {
      var _ = p.match(k);
      return _ ? _.map(Number) : [];
    }
    function H(p) {
      var _ = p[0][0], h = p[0][1], l = _, g = h;
      return p.forEach(function(v) {
        var w = v[0], y = v[2], T = v[4], P = v[6], z = v[1], A = v[3], R = v[5], D = v[7];
        _ = Math.min(_, w, y, T, P), h = Math.min(h, z, A, R, D), l = Math.max(l, w, y, T, P), g = Math.max(g, z, A, R, D);
      }), [_, h, l, g];
    }
    function L(p, _) {
      return Math.sqrt(Math.pow(p[0] - _[0], 2) + Math.pow(p[1] - _[1], 2)) + Math.sqrt(Math.pow(p[2] - _[2], 2) + Math.pow(p[3] - _[3], 2));
    }
    function E(p, _) {
      var h = p[0], l = p[2], g = p[4], v = p[6], w = p[1], y = p[3], T = p[5], P = p[7], z = _[0], A = _[2], R = _[4], D = _[6], N = _[1], d = _[3], B = _[5], C = _[7];
      return Math.sqrt(Math.pow(z - h, 2) + Math.pow(N - w, 2)) + Math.sqrt(Math.pow(A - l, 2) + Math.pow(d - y, 2)) + Math.sqrt(Math.pow(R - g, 2) + Math.pow(B - T, 2)) + Math.sqrt(Math.pow(D - v, 2) + Math.pow(C - P, 2));
    }
    function X(p, _) {
      var h = F(p.length), l = [];
      h.forEach(function(v) {
        var w = 0, y = 0;
        v.forEach(function(T) {
          w += E(p[T], _[y++]);
        }), l.push({ index: v, distance: w });
      }), l.sort(function(v, w) {
        return v.distance - w.distance;
      });
      var g = [];
      return l[0].index.forEach(function(v) {
        g.push(p[v]);
      }), g;
    }
    function V(p, _) {
      var h = Y(p.length), l = [];
      h.forEach(function(v) {
        var w = 0;
        v.forEach(function(y) {
          w += L(H(p[y]), H(_[y]));
        }), l.push({ index: v, distance: w });
      }), l.sort(function(v, w) {
        return v.distance - w.distance;
      });
      var g = [];
      return l[0].index.forEach(function(v) {
        g.push(p[v]);
      }), g;
    }
    function F(p) {
      for (var _ = [], h = 0; h < p; h++) {
        for (var l = [], g = 0; g < p; g++) {
          var v = g + h;
          v > p - 1 && (v -= p), l[v] = g;
        }
        _.push(l);
      }
      return _;
    }
    function Y(p) {
      for (var _ = [], h = 0; h < p; h++)
        _.push(h);
      return G(_);
    }
    function G(p) {
      var _ = [], h = [];
      function l(g) {
        var v, w;
        for (v = 0; v < g.length; v++)
          w = g.splice(v, 1)[0], h.push(w), g.length == 0 && _.push(h.slice()), l(g), g.splice(v, 0, w), h.pop();
        return _;
      }
      return l(p);
    }
    var M = {};
    M.parser = b, M.lerpCurve = function(p, _, h) {
      return M.lerpPoints(p[0], p[1], _[0], _[1], h).concat(M.lerpPoints(p[2], p[3], _[2], _[3], h)).concat(M.lerpPoints(p[4], p[5], _[4], _[5], h)).concat(M.lerpPoints(p[6], p[7], _[6], _[7], h));
    }, M.lerpPoints = function(p, _, h, l, g) {
      return [p + (h - p) * g, _ + (l - _) * g];
    }, M.q2b = function(p, _, h, l, g, v) {
      return [p, _, (p + 2 * h) / 3, (_ + 2 * l) / 3, (g + 2 * h) / 3, (v + 2 * l) / 3, g, v];
    }, M.path2shapes = function(p) {
      for (var _ = M.parser(p), h = 0, l = 0, g = 0, v = _.length, w = [], y = null, T = void 0, P = void 0, z = void 0, A = void 0, R = void 0, D = void 0, N = void 0; g < v; g++) {
        var d = _[g], B = d[0], C = _[g - 1];
        switch (B) {
          case "m":
            R = w.length, w[R] = [], y = w[R], h = h + d[1], l = l + d[2];
            break;
          case "M":
            R = w.length, w[R] = [], y = w[R], h = d[1], l = d[2];
            break;
          case "l":
            y.push([h, l, h, l, h, l, h + d[1], l + d[2]]), h += d[1], l += d[2];
            break;
          case "L":
            y.push([h, l, d[1], d[2], d[1], d[2], d[1], d[2]]), h = d[1], l = d[2];
            break;
          case "h":
            y.push([h, l, h, l, h, l, h + d[1], l]), h += d[1];
            break;
          case "H":
            y.push([h, l, d[1], l, d[1], l, d[1], l]), h = d[1];
            break;
          case "v":
            y.push([h, l, h, l, h, l, h, l + d[1]]), l += d[1];
            break;
          case "V":
            y.push([h, l, h, d[1], h, d[1], h, d[1]]), l = d[1];
            break;
          case "C":
            y.push([h, l, d[1], d[2], d[3], d[4], d[5], d[6]]), h = d[5], l = d[6];
            break;
          case "S":
            C[0] === "C" || C[0] === "c" ? y.push([h, l, h + C[5] - C[3], l + C[6] - C[4], d[1], d[2], d[3], d[4]]) : (C[0] === "S" || C[0] === "s") && y.push([h, l, h + C[3] - C[1], l + C[4] - C[2], d[1], d[2], d[3], d[4]]), h = d[3], l = d[4];
            break;
          case "c":
            y.push([h, l, h + d[1], l + d[2], h + d[3], l + d[4], h + d[5], l + d[6]]), h = h + d[5], l = l + d[6];
            break;
          case "s":
            C[0] === "C" || C[0] === "c" ? y.push([h, l, h + C[5] - C[3], l + C[6] - C[4], h + d[1], l + d[2], h + d[3], l + d[4]]) : (C[0] === "S" || C[0] === "s") && y.push([h, l, h + C[3] - C[1], l + C[4] - C[2], h + d[1], l + d[2], h + d[3], l + d[4]]), h = h + d[3], l = l + d[4];
            break;
          case "a":
            D = f({
              rx: d[1],
              ry: d[2],
              px: h,
              py: l,
              xAxisRotation: d[3],
              largeArcFlag: d[4],
              sweepFlag: d[5],
              cx: h + d[6],
              cy: l + d[7]
            }), N = D[D.length - 1], D.forEach(function(I, W) {
              W === 0 ? y.push([h, l, I.x1, I.y1, I.x2, I.y2, I.x, I.y]) : y.push([D[W - 1].x, D[W - 1].y, I.x1, I.y1, I.x2, I.y2, I.x, I.y]);
            }), h = N.x, l = N.y;
            break;
          case "A":
            D = f({
              rx: d[1],
              ry: d[2],
              px: h,
              py: l,
              xAxisRotation: d[3],
              largeArcFlag: d[4],
              sweepFlag: d[5],
              cx: d[6],
              cy: d[7]
            }), N = D[D.length - 1], D.forEach(function(I, W) {
              W === 0 ? y.push([h, l, I.x1, I.y1, I.x2, I.y2, I.x, I.y]) : y.push([D[W - 1].x, D[W - 1].y, I.x1, I.y1, I.x2, I.y2, I.x, I.y]);
            }), h = N.x, l = N.y;
            break;
          case "Q":
            y.push(M.q2b(h, l, d[1], d[2], d[3], d[4])), h = d[3], l = d[4];
            break;
          case "q":
            y.push(M.q2b(h, l, h + d[1], l + d[2], d[3] + h, d[4] + l)), h += d[3], l += d[4];
            break;
          case "T":
            C[0] === "Q" || C[0] === "q" ? (z = h + C[3] - C[1], A = l + C[4] - C[2], y.push(M.q2b(h, l, z, A, d[1], d[2]))) : (C[0] === "T" || C[0] === "t") && (y.push(M.q2b(h, l, h + h - z, l + l - A, d[1], d[2])), z = h + h - z, A = l + l - A), h = d[1], l = d[2];
            break;
          case "t":
            C[0] === "Q" || C[0] === "q" ? (z = h + C[3] - C[1], A = l + C[4] - C[2], y.push(M.q2b(h, l, z, A, h + d[1], l + d[2]))) : (C[0] === "T" || C[0] === "t") && (y.push(M.q2b(h, l, h + h - z, l + l - A, h + d[1], l + d[2])), z = h + h - z, A = l + l - A), h += d[1], l += d[2];
            break;
          case "Z":
            T = y[0][0], P = y[0][1], y.push([h, l, T, P, T, P, T, P]);
            break;
          case "z":
            T = y[0][0], P = y[0][1], y.push([h, l, T, P, T, P, T, P]);
            break;
        }
      }
      return w;
    }, M._upCurves = function(p, _) {
      for (var h = 0, l = 0, g = p.length; h < _; h++)
        p.push(p[l].slice(0)), l++, l > g - 1 && (l -= g);
    };
    function J(p, _, h, l, g, v, w, y, T) {
      return {
        left: yt(p, _, h, l, g, v, w, y, T),
        right: yt(w, y, g, v, h, l, p, _, 1 - T, !0)
      };
    }
    function yt(p, _, h, l, g, v, w, y, T, P) {
      var z = (h - p) * T + p, A = (l - _) * T + _, R = (g - h) * T + h, D = (v - l) * T + l, N = (w - g) * T + g, d = (y - v) * T + v, B = (R - z) * T + z, C = (D - A) * T + A, I = (N - R) * T + R, W = (d - D) * T + D, tt = (I - B) * T + B, Z = (W - C) * T + C;
      return P ? [tt, Z, B, C, z, A, p, _] : [p, _, z, A, B, C, tt, Z];
    }
    M._splitCurves = function(p, _) {
      for (var h = 0, l = 0; h < _; h++) {
        var g = p[l], v = J(g[0], g[1], g[2], g[3], g[4], g[5], g[6], g[7], 0.5);
        p.splice(l, 1), p.splice(l, 0, v.left, v.right), l += 2, l >= p.length - 1 && (l = 0);
      }
    };
    function bt(p, _) {
      for (var h = function(v) {
        var w = p[p.length - 1], y = [];
        w.forEach(function(T) {
          y.push(T.slice(0));
        }), p.push(y);
      }, l = 0; l < _; l++)
        h();
    }
    return M.lerp = function(p, _, h) {
      return M._lerp(M.path2shapes(p), M.path2shapes(_), h);
    }, M.MIM_CURVES_COUNT = 100, M._preprocessing = function(p, _) {
      var h = p.length, l = _.length, g = JSON.parse(JSON.stringify(p)), v = JSON.parse(JSON.stringify(_));
      return h > l ? bt(v, h - l) : h < l && bt(g, l - h), g = V(g, v), g.forEach(function(w, y) {
        var T = w.length, P = v[y].length;
        T > P ? T < M.MIM_CURVES_COUNT ? (M._splitCurves(w, M.MIM_CURVES_COUNT - T), M._splitCurves(v[y], M.MIM_CURVES_COUNT - P)) : M._splitCurves(v[y], T - P) : T < P && (P < M.MIM_CURVES_COUNT ? (M._splitCurves(w, M.MIM_CURVES_COUNT - T), M._splitCurves(v[y], M.MIM_CURVES_COUNT - P)) : M._splitCurves(w, P - T));
      }), g.forEach(function(w, y) {
        g[y] = X(w, v[y]);
      }), [g, v];
    }, M._lerp = function(p, _, h) {
      var l = [];
      return p.forEach(function(g, v) {
        var w = [];
        g.forEach(function(y, T) {
          w.push(M.lerpCurve(y, _[v][T], h));
        }), l.push(w);
      }), l;
    }, M.animate = function(p) {
      var _ = M.path2shapes(p.from), h = M.path2shapes(p.to), l = M._preprocessing(_, h), g = /* @__PURE__ */ new Date(), v = p.end || function() {
      }, w = p.progress || function() {
      }, y = p.begin || function() {
      }, T = p.easing || function(D) {
        return D;
      }, P = null, z = null, A = p.time;
      y(_);
      var R = function D() {
        var N = /* @__PURE__ */ new Date() - g;
        if (N >= A) {
          z = h, w(z, 1), v(z), cancelAnimationFrame(P);
          return;
        }
        var d = T(N / A);
        z = M._lerp(l[0], l[1], d), w(z, d), P = requestAnimationFrame(D);
      };
      R();
    }, M;
  });
})(Me);
var ti = Me.exports;
const Pt = /* @__PURE__ */ Ce(ti);
class ei extends Yt {
  constructor(e) {
    super(e);
    u(this, "_oldPath");
    u(this, "_path2D", new Path2D());
    if (this.p.polyfill)
      if (typeof Path2D != "function") {
        const i = document.getElementsByTagName("head")[0], s = document.createElement("script");
        s.type = "text/javascript", s.src = "https://cdn.jsdelivr.net/npm/canvas-5-polyfill@0.1.5/canvas.min.js", i.appendChild(s);
      } else {
        const i = document.createElement("canvas").getContext("2d");
        i.stroke(new Path2D("M0,0H1")), i.getImageData(0, 0, 1, 1).data[3] && (this.p.polyfill = !1);
      }
  }
  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // set path
      path: void 0,
      color: void 0,
      borderColor: void 0,
      lineWidth: 1,
      clip: !1,
      fixed: !1,
      polyfill: !0
    });
  }
  // helper function for changeTo
  changeToPathInit(e, i) {
    return Pt._preprocessing(
      typeof e == "string" ? Pt.path2shapes(e) : Array.isArray(e) ? e : [],
      typeof i == "string" ? Pt.path2shapes(i) : Array.isArray(i) ? i : []
    );
  }
  changeToPath(e, i) {
    return Pt._lerp(i.pathFrom, i.pathTo, e);
  }
  detect(e, i, s) {
    return this._detectHelper(this.p, e, i, s, !1, () => e.isPointInPath(this._path2D, i, s));
  }
  // draw-methode
  draw(e, i) {
    const s = this.p;
    if (s.enabled) {
      const r = s.alpha * i.alpha;
      this._oldPath !== s.path && (s.polyfill && typeof s.path == "string" && (s.path = Pt.path2shapes(s.path)), Array.isArray(s.path) ? (this._path2D = new Path2D(), s.path.forEach((f) => {
        this._path2D.moveTo(f[0][0], f[0][1]), f.forEach((c) => {
          this._path2D.bezierCurveTo(
            c[2],
            c[3],
            c[4],
            c[5],
            c[6],
            c[7]
          );
        }), this._path2D.closePath();
      })) : s.path instanceof Path2D ? this._path2D = s.path : this._path2D = new Path2D(s.path), this._oldPath = s.path);
      let n = s.scaleX, o = s.scaleY;
      s.fixed && (n == 0 && (n = Number.EPSILON), o == 0 && (o = Number.EPSILON)), e.globalCompositeOperation = s.compositeOperation, e.globalAlpha = r, e.save(), e.translate(s.x, s.y), e.scale(n, o), e.rotate(s.rotation), s.color && (e.fillStyle = s.color, e.fill(this._path2D)), e.save(), s.clip && (e.clip(this._path2D), s.fixed && (e.rotate(-s.rotation), e.scale(1 / n, 1 / o), e.translate(-s.x, -s.y)));
      for (const f of s.sprite)
        f.draw(e, i);
      e.restore(), s.borderColor && (e.strokeStyle = s.borderColor, e.lineWidth = s.lineWidth, e.stroke(this._path2D)), e.restore();
    }
  }
}
class ii extends dt {
  constructor(t) {
    super(t);
  }
  _getParameterList() {
    return Object.assign({}, super._getParameterList(), It, {
      x: void 0,
      y: void 0,
      width: void 0,
      height: void 0,
      borderColor: void 0,
      color: void 0,
      lineWidth: 1,
      clear: !1,
      norm: (t, e) => O(
        x(t),
        x(e.x) === void 0 && x(e.y) === void 0 && x(e.width) === void 0 && x(e.height) === void 0
      ),
      // relative position
      position: at.CENTER
    });
  }
  _normalizeFullScreen(t) {
    (this.p.norm || this.p.width === void 0) && (this.p.width = t.visibleScreen.width), (this.p.norm || this.p.height === void 0) && (this.p.height = t.visibleScreen.height), (this.p.norm || this.p.x === void 0) && (this.p.x = t.visibleScreen.x, this.p.position === at.CENTER && (this.p.x += this.p.width / 2)), (this.p.norm || this.p.y === void 0) && (this.p.y = t.visibleScreen.y, this.p.position === at.CENTER && (this.p.y += this.p.height / 2));
  }
  resize(t, e) {
    this._needInit = !0;
  }
  init(t, e) {
    this._normalizeFullScreen(e);
  }
  detect(t, e, i) {
    return this._detectHelper(
      this.p,
      t,
      e,
      i,
      this.p.position === at.LEFT_TOP
    );
  }
  // Draw-Funktion
  draw(t, e) {
    const i = this.p;
    if (i.enabled && i.alpha > 0)
      if (t.globalCompositeOperation = i.compositeOperation, t.globalAlpha = i.alpha * e.alpha, i.rotation === 0 && i.position === at.LEFT_TOP)
        i.clear ? t.clearRect(i.x, i.y, i.width, i.height) : i.color && (t.fillStyle = i.color, t.fillRect(i.x, i.y, i.width, i.height)), i.borderColor && (t.beginPath(), t.lineWidth = i.lineWidth, t.strokeStyle = i.borderColor, t.rect(i.x, i.y, i.width, i.height), t.stroke());
      else {
        const s = i.width / 2, r = i.height / 2;
        t.save(), i.position === at.LEFT_TOP ? t.translate(i.x + s, i.y + r) : t.translate(i.x, i.y), t.scale(i.scaleX, i.scaleY), t.rotate(i.rotation), i.clear ? t.clearRect(-s, -r, i.width, i.height) : i.color && (t.fillStyle = i.color, t.fillRect(-s, -r, i.width, i.height)), i.borderColor && (t.beginPath(), t.lineWidth = i.lineWidth, t.strokeStyle = i.borderColor, t.rect(-s, -r, i.width, i.height), t.stroke()), t.restore();
      }
  }
}
class si extends we {
  constructor(t) {
    const e = x(t.text), i = Array.isArray(e) ? e : [...e];
    super(
      Object.assign({}, t, {
        class: Te,
        count: i.length,
        text: (s) => i[s],
        enabled: (s) => i[s] !== " " && x(t.enabled)
      })
    );
  }
}
function ai(a, t) {
  if (!(a instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
var ri = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259], ni = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
function ce(a, t, e, i, s, r) {
  for (var n = a.data, o = 2 * r + 1, f = i - 1, c = s - 1, m = r + 1, b = m * (m + 1) / 2, k = new ue(), S = k, H, L = 1; L < o; L++)
    S = S.next = new ue(), L === m && (H = S);
  S.next = k;
  for (var E = null, X = null, V = 0, F = 0, Y = ri[r], G = ni[r], M = 0; M < s; M++) {
    S = k;
    for (var J = n[F], yt = n[F + 1], bt = n[F + 2], p = n[F + 3], _ = 0; _ < m; _++)
      S.r = J, S.g = yt, S.b = bt, S.a = p, S = S.next;
    for (var h = 0, l = 0, g = 0, v = 0, w = m * J, y = m * yt, T = m * bt, P = m * p, z = b * J, A = b * yt, R = b * bt, D = b * p, N = 1; N < m; N++) {
      var d = F + ((f < N ? f : N) << 2), B = n[d], C = n[d + 1], I = n[d + 2], W = n[d + 3], tt = m - N;
      z += (S.r = B) * tt, A += (S.g = C) * tt, R += (S.b = I) * tt, D += (S.a = W) * tt, h += B, l += C, g += I, v += W, S = S.next;
    }
    E = k, X = H;
    for (var Z = 0; Z < i; Z++) {
      var rt = D * Y >>> G;
      if (n[F + 3] = rt, rt !== 0) {
        var nt = 255 / rt;
        n[F] = (z * Y >>> G) * nt, n[F + 1] = (A * Y >>> G) * nt, n[F + 2] = (R * Y >>> G) * nt;
      } else
        n[F] = n[F + 1] = n[F + 2] = 0;
      z -= w, A -= y, R -= T, D -= P, w -= E.r, y -= E.g, T -= E.b, P -= E.a;
      var Q = Z + r + 1;
      Q = V + (Q < f ? Q : f) << 2, h += E.r = n[Q], l += E.g = n[Q + 1], g += E.b = n[Q + 2], v += E.a = n[Q + 3], z += h, A += l, R += g, D += v, E = E.next;
      var et = X, gt = et.r, it = et.g, wt = et.b, Ct = et.a;
      w += gt, y += it, T += wt, P += Ct, h -= gt, l -= it, g -= wt, v -= Ct, X = X.next, F += 4;
    }
    V += i;
  }
  for (var mt = 0; mt < i; mt++) {
    F = mt << 2;
    var lt = n[F], ot = n[F + 1], ct = n[F + 2], U = n[F + 3], xt = m * lt, Mt = m * ot, Et = m * ct, Bt = m * U, Ot = b * lt, Ft = b * ot, At = b * ct, Dt = b * U;
    S = k;
    for (var se = 0; se < m; se++)
      S.r = lt, S.g = ot, S.b = ct, S.a = U, S = S.next;
    for (var ae = i, Wt = 0, qt = 0, Ut = 0, Vt = 0, Rt = 1; Rt <= r; Rt++) {
      F = ae + mt << 2;
      var Lt = m - Rt;
      Ot += (S.r = lt = n[F]) * Lt, Ft += (S.g = ot = n[F + 1]) * Lt, At += (S.b = ct = n[F + 2]) * Lt, Dt += (S.a = U = n[F + 3]) * Lt, Vt += lt, Wt += ot, qt += ct, Ut += U, S = S.next, Rt < c && (ae += i);
    }
    F = mt, E = k, X = H;
    for (var Gt = 0; Gt < s; Gt++) {
      var $ = F << 2;
      n[$ + 3] = U = Dt * Y >>> G, U > 0 ? (U = 255 / U, n[$] = (Ot * Y >>> G) * U, n[$ + 1] = (Ft * Y >>> G) * U, n[$ + 2] = (At * Y >>> G) * U) : n[$] = n[$ + 1] = n[$ + 2] = 0, Ot -= xt, Ft -= Mt, At -= Et, Dt -= Bt, xt -= E.r, Mt -= E.g, Et -= E.b, Bt -= E.a, $ = mt + (($ = Gt + m) < c ? $ : c) * i << 2, Ot += Vt += E.r = n[$], Ft += Wt += E.g = n[$ + 1], At += qt += E.b = n[$ + 2], Dt += Ut += E.a = n[$ + 3], E = E.next, xt += lt = X.r, Mt += ot = X.g, Et += ct = X.b, Bt += U = X.a, Vt -= lt, Wt -= ot, qt -= ct, Ut -= U, X = X.next, F += i;
    }
  }
  return a;
}
var ue = (
  /**
   * Set properties.
   */
  function a() {
    ai(this, a), this.r = 0, this.g = 0, this.b = 0, this.a = 0, this.next = null;
  }
);
class oi extends xe {
  constructor(e) {
    super(e);
    u(this, "_currentRadiusPart");
  }
  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // work directly on the main canvas
      onCanvas: !1,
      radius: void 0,
      radiusPart: void 0,
      radiusScale: !0
    });
  }
  normalizeFullScreen(e) {
    const i = this.p;
    i.norm && i.onCanvas ? (i.x = 0, i.y = 0, i.width = e.widthInPixel, i.height = e.heightInPixel) : super.normalizeFullScreen(e);
  }
  resize(e, i) {
    super.resize(e, i), this.p.radiusPart && (this.p.radius = void 0);
  }
  additionalBlur(e, i, s) {
    const r = this._tctx.getImageData(0, 0, e, i);
    ce(
      r,
      0,
      0,
      e,
      i,
      s.radius || 1
    ), this._tctx.putImageData(r, 0, 0);
  }
  // draw-methode
  draw(e, i) {
    const s = this.p;
    if (s.enabled) {
      (s.radius === void 0 || this._currentRadiusPart !== s.radiusPart) && (s.radius = Math.round(
        (i.widthInPixel + i.heightInPixel) / 2 / s.radiusPart
      ), this._currentRadiusPart = s.radiusPart);
      const r = Math.round(
        s.radius * (s.radiusScale && i.cam ? i.cam.zoom : 1) / i.scaleCanvas
      );
      if (r)
        if (s.onCanvas) {
          (s.width === void 0 || s.height === void 0) && this.normalizeFullScreen(i);
          const n = Math.round(s.x), o = Math.round(s.y), f = Math.round(s.width), c = Math.round(s.height), m = e.getImageData(n, o, f, c);
          ce(m, 0, 0, f - n, c - o, r), e.putImageData(m, n, o, 0, 0, f, c);
        } else
          i.radius = r, super.draw(e, i);
    } else
      super.draw(e, i);
  }
}
class hi extends dt {
  constructor(e) {
    super(e);
    u(this, "_starsX", []);
    u(this, "_starsY", []);
    u(this, "_starsZ", []);
    u(this, "_starsOldX", []);
    u(this, "_starsOldY", []);
    u(this, "_starsNewX", []);
    u(this, "_starsNewY", []);
    u(this, "_starsEnabled", []);
    u(this, "_starsLineWidth", []);
    u(this, "_centerX", 0);
    u(this, "_centerY", 0);
    u(this, "_scaleZ", 0);
  }
  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // set image
      count: 40,
      // relative position
      moveX: 0,
      moveY: 0,
      moveZ: 0,
      lineWidth: void 0,
      highScale: !0,
      color: "#FFF"
      // here default color is white
    });
  }
  init(e, i) {
    const s = this.p;
    s.width = s.width || i.width, s.height = s.height || i.height, s.x = s.x === void 0 ? i.x : s.x, s.y = s.y === void 0 ? i.y : s.y, s.lineWidth = s.lineWidth || Math.min(
      i.height / i.heightInPixel,
      i.width / i.widthInPixel
    ) / 2, this._centerX = s.width / 2 + s.x, this._centerY = s.height / 2 + s.y, this._scaleZ = Math.max(s.width, s.height) / 2;
    function r(n, o, f = -o) {
      return n === void 0 || n < o || n >= f ? Math.random() * (f - o) + o : n;
    }
    for (let n = 0; n < s.count; n++)
      this._starsX[n] = r(this._starsX[n], -s.width / 2), this._starsY[n] = r(this._starsY[n], -s.height / 2), this._starsZ[n] = r(this._starsZ[n], 0, this._scaleZ);
  }
  _moveStar(e, i, s) {
    const r = this.p, n = r.width / 2, o = r.height / 2;
    s && (this._starsEnabled[e] = !0);
    let f = this._starsX[e] + r.moveX * i, c = this._starsY[e] + r.moveY * i, m = this._starsZ[e] + r.moveZ * i;
    for (; f < -n; )
      f += r.width, c = Math.random() * r.height - o, this._starsEnabled[e] = !1;
    for (; f > n; )
      f -= r.width, c = Math.random() * r.height - o, this._starsEnabled[e] = !1;
    for (; c < -o; )
      c += r.height, f = Math.random() * r.width - n, this._starsEnabled[e] = !1;
    for (; c > o; )
      c -= r.height, f = Math.random() * r.width - n, this._starsEnabled[e] = !1;
    for (; m <= 0; )
      m += this._scaleZ, f = Math.random() * r.width - n, c = Math.random() * r.height - o, this._starsEnabled[e] = !1;
    for (; m > this._scaleZ; )
      m -= this._scaleZ, f = Math.random() * r.width - n, c = Math.random() * r.height - o, this._starsEnabled[e] = !1;
    const b = this._centerX + f / m * n, k = this._centerY + c / m * o;
    if (this._starsEnabled[e] = this._starsEnabled[e] && b >= r.x && k >= r.y && b < r.x + r.width && k < r.y + r.height, s)
      this._starsX[e] = f, this._starsY[e] = c, this._starsZ[e] = m, this._starsNewX[e] = b, this._starsNewY[e] = k;
    else {
      this._starsOldX[e] = b, this._starsOldY[e] = k;
      let S = (1 - this._starsZ[e] / this._scaleZ) * 4;
      r.highScale || (S = Math.ceil(S)), this._starsLineWidth[e] = S;
    }
  }
  animate(e) {
    const i = super.animate(e);
    if (this.p.enabled && this._centerX !== void 0) {
      let s = this.p.count;
      for (; s--; )
        this._moveStar(s, e / 16, !0), this._starsEnabled[s] && this._moveStar(s, -5, !1);
    }
    return i;
  }
  resize(e, i) {
    this._needInit = !0;
  }
  detect(e, i, s) {
    return this._detectHelper(this.p, e, i, s, !1);
  }
  // Draw-Funktion
  draw(e, i) {
    if (this.p.enabled) {
      const s = this.p;
      if (e.globalCompositeOperation = s.compositeOperation, e.globalAlpha = s.alpha * i.alpha, s.moveY == 0 && s.moveZ == 0 && s.moveX < 0) {
        e.fillStyle = s.color;
        let r = s.count;
        for (; r--; )
          this._starsEnabled[r] && e.fillRect(
            this._starsNewX[r],
            this._starsNewY[r] - this._starsLineWidth[r] * s.lineWidth / 2,
            this._starsOldX[r] - this._starsNewX[r],
            this._starsLineWidth[r] * s.lineWidth
          );
      } else if (e.strokeStyle = s.color, s.highScale) {
        let r = s.count;
        for (; r--; )
          this._starsEnabled[r] && (e.beginPath(), e.lineWidth = this._starsLineWidth[r] * s.lineWidth, e.moveTo(this._starsOldX[r], this._starsOldY[r]), e.lineTo(this._starsNewX[r], this._starsNewY[r]), e.stroke(), e.closePath());
      } else {
        let r = 5, n;
        for (; --r; ) {
          for (e.beginPath(), e.lineWidth = r * s.lineWidth, n = s.count; n--; )
            this._starsEnabled[n] && this._starsLineWidth[n] === r && (e.moveTo(this._starsOldX[n], this._starsOldY[n]), e.lineTo(this._starsNewX[n], this._starsNewY[n]));
          e.stroke(), e.closePath();
        }
      }
    }
  }
}
const Zs = {
  Callback: Re,
  Canvas: Xe,
  Circle: Ne,
  Emitter: we,
  FastBlur: xe,
  Group: Yt,
  Image: He,
  Text: Te,
  Particle: te,
  Path: ei,
  Rect: ii,
  Scroller: si,
  StackBlur: oi,
  StarField: hi
};
class li {
  constructor(t, e) {
    u(this, "_callback");
    u(this, "_duration");
    u(this, "_initialized", !1);
    this._callback = t, this._duration = O(x(e), void 0);
  }
  reset() {
    this._initialized = !1;
  }
  run(t, e) {
    let i;
    return this._duration !== void 0 ? (this._callback(
      t,
      Math.min(e, this._duration),
      !this._initialized
    ), this._initialized = !0, e - this._duration) : (i = this._callback(t, e, !this._initialized), this._initialized = !0, i);
  }
}
const ci = Math.PI / 180;
function fe(a, t) {
  return t.from + a * t.delta;
}
function ui(a, t) {
  return a >= 0.5 ? t.to : t.from;
}
function de(a, t) {
  const e = [...t.values];
  let i = e.length, s;
  for (; i > 1; )
    for (i--, s = 0; s < i; s++)
      e[s] = e[s] + a * (e[s + 1] - e[s]);
  return e[0];
}
function me(a, t) {
  return t.colorFrom.mix(t.colorTo, a * 100).toString();
}
function _e(a, { pathFrom: t, pathTo: e }, i) {
  return i.changeToPath(a, {
    pathFrom: t,
    pathTo: e
  });
}
class fi {
  constructor(t, e, i) {
    u(this, "_initialized", !1);
    u(this, "_changeValues");
    u(this, "_duration");
    u(this, "_ease");
    this._changeValues = [];
    for (const s in t) {
      const r = t[s], n = s === "rotationInDegree" ? r * ci : r, o = s === "color" || s === "borderColor", f = s === "path", c = s === "text", m = typeof n == "function", b = !o && Array.isArray(n), k = s === "scale" ? ["scaleX", "scaleY"] : s === "rotationInRadian" || s === "rotationInDegree" ? ["rotation"] : [s];
      for (const S of k)
        this._changeValues.push({
          name: S,
          to: b ? n[n.length - 1] : x(n),
          bezier: b ? n : void 0,
          isColor: o,
          isPath: f,
          isStatic: c,
          isFunction: m ? n : void 0,
          moveAlgorithm: o ? me : f ? _e : b ? de : c ? ui : fe
        });
    }
    this._duration = O(x(e), 0), this._ease = O(i, (s) => s);
  }
  reset() {
    this._initialized = !1;
  }
  _init(t, e) {
    let i = this._changeValues.length;
    for (; i--; ) {
      const s = this._changeValues[i], r = t.p[s.name];
      s.isFunction ? (s.from = r, s.to = s.isFunction(s.from), s.isColor ? (s.colorFrom = new zt(s.from), s.colorTo = new zt(s.to), s.moveAlgorithm = me) : s.isPath ? ([s.pathFrom, s.pathTo] = t.changeToPathInit(
        s.from,
        s.to
      ), s.moveAlgorithm = _e) : Array.isArray(s.to) ? (s.values = [r, ...s.to], s.moveAlgorithm = de) : s.isStatic || (s.delta = s.to - s.from, s.moveAlgorithm = fe)) : s.isColor ? (s.colorFrom = new zt(r), s.colorTo = new zt(s.to)) : s.isPath ? [s.pathFrom, s.pathTo] = t.changeToPathInit(
        r,
        s.to
      ) : s.bezier ? s.values = [r, ...s.bezier] : (s.from = r, s.delta = s.to - s.from);
    }
  }
  run(t, e) {
    if (this._initialized || (this._initialized = !0, this._init(t, e)), this._duration <= e) {
      let i = this._changeValues.length, s;
      for (; i--; )
        s = this._changeValues[i], t.p[s.name] = s.to;
    } else {
      let i = this._changeValues.length, s;
      const r = this._ease(e / this._duration);
      for (; i--; )
        s = this._changeValues[i], t.p[s.name] = s.moveAlgorithm(r, s, t);
    }
    return e - this._duration;
  }
}
let di = class {
  constructor() {
  }
  run(t, e) {
    return St.FORCE_DISABLE;
  }
}, mi = class {
  constructor() {
  }
  run(t, e) {
    return t.p.enabled = !1, St.FORCE_DISABLE;
  }
};
class _i {
  constructor(...t) {
    u(this, "_Aniobject");
    this._Aniobject = t[0] instanceof pt ? t[0] : new pt(...t);
  }
  reset(t = 0) {
    var e, i;
    (i = (e = this._Aniobject).reset) == null || i.call(e, t);
  }
  play(t = "", e = 0) {
    var i, s;
    return (s = (i = this._Aniobject).play) == null ? void 0 : s.call(i, t, e);
  }
  run(t, e, i) {
    var r, n;
    let s = e;
    for (; s >= 0; ) {
      if (s = this._Aniobject.run(t, s, i), i = !0, s === !0)
        return !0;
      s >= 0 && ((n = (r = this._Aniobject).reset) == null || n.call(r));
    }
    return s;
  }
}
class pi {
  constructor(t, e, i) {
    u(this, "_ifCallback");
    u(this, "_Aniobject");
    u(this, "_AniobjectElse");
    this._ifCallback = t, this._Aniobject = e, this._AniobjectElse = O(i, () => 0);
  }
  play(t = "", e = 0) {
    var i, s, r, n;
    return ((s = (i = this._Aniobject).play) == null ? void 0 : s.call(i, t, e)) || ((n = (r = this._AniobjectElse).play) == null ? void 0 : n.call(r, t, e));
  }
  run(t, e) {
    const i = x(this._ifCallback) ? this._Aniobject : this._AniobjectElse;
    return i.run ? i.run(t, e) : i(t, e);
  }
}
class gi {
  constructor(t, e) {
    u(this, "_initialized", !1);
    u(this, "_image");
    u(this, "_count");
    u(this, "_durationBetweenFrames");
    u(this, "_duration");
    u(this, "_current", -1);
    const i = x(t);
    this._durationBetweenFrames = O(x(e), 0), Array.isArray(i) ? (this._image = i, this._count = i.length) : (this._image = [i], this._count = 1), this._duration = this._count * this._durationBetweenFrames;
  }
  reset() {
    this._initialized = !1;
  }
  run(t, e) {
    if (this._initialized || (this._initialized = !0, this._current = -1), e >= this._duration)
      t.p.image = jt.getImage(
        this._image[this._image.length - 1]
      );
    else {
      const i = Math.floor(e / this._durationBetweenFrames);
      i !== this._current && (this._current = i, t.p.image = jt.getImage(this._image[this._current]));
    }
    return e - this._duration;
  }
}
class vi {
  constructor(t, e, i) {
    u(this, "_frameNumber");
    u(this, "_durationBetweenFrames");
    u(this, "_duration");
    u(this, "_framesToRight");
    const s = x(t);
    this._framesToRight = O(x(e), !0), this._durationBetweenFrames = O(x(i), 0), this._frameNumber = Array.isArray(s) ? s : [s], this._duration = this._frameNumber.length * this._durationBetweenFrames;
  }
  run(t, e) {
    let i = 0;
    return e >= this._duration ? i = this._frameNumber[this._frameNumber.length - 1] : i = this._frameNumber[Math.floor(e / this._durationBetweenFrames)], this._framesToRight ? t.p.frameX = t.p.frameWidth * i : t.p.frameY = t.p.frameHeight * i, e - this._duration;
  }
}
class yi {
  constructor(t, ...e) {
    u(this, "_Aniobject");
    u(this, "_times");
    u(this, "_timesOrg");
    this._Aniobject = e[0] instanceof pt ? e[0] : new pt(...e), this._times = this._timesOrg = O(x(t), 1);
  }
  reset(t = 0) {
    var e, i;
    this._times = this._timesOrg, (i = (e = this._Aniobject).reset) == null || i.call(e, t);
  }
  play(t = "", e = 0) {
    var s, r;
    this._times = this._timesOrg;
    const i = (r = (s = this._Aniobject).play) == null ? void 0 : r.call(s, t, e);
    return i && (this._times = this._timesOrg), i;
  }
  run(t, e, i) {
    var r, n;
    let s = e;
    for (; s >= 0 && this._times > 0; ) {
      if (s = this._Aniobject.run(t, s, i), i = !0, s === !0)
        return !0;
      s >= 0 && (this._times--, (n = (r = this._Aniobject).reset) == null || n.call(r));
    }
    return s;
  }
}
class bi {
  constructor() {
  }
  run(t, e) {
    return St.REMOVE;
  }
}
class wi {
  constructor(t, e) {
    u(this, "_Aniobject");
    u(this, "_times");
    this._Aniobject = t, this._times = O(x(e), 1);
  }
  run(t, e) {
    if (this._times <= 0)
      return e;
    {
      const i = this._Aniobject.run(t, e);
      return typeof i == "number" && i >= 0 && this._times--, i;
    }
  }
}
class xi {
  constructor(t, e) {
    u(this, "_initialized", !1);
    u(this, "_duration");
    u(this, "_shakeDiff");
    u(this, "_shakeDiffHalf");
    u(this, "_x", 0);
    u(this, "_y", 0);
    this._duration = x(e), this._shakeDiff = x(t), this._shakeDiffHalf = this._shakeDiff / 2;
  }
  reset() {
    this._initialized = !1;
  }
  run(t, e) {
    return this._initialized || (this._initialized = !0, this._x = t.p.x, this._y = t.p.y), e >= this._duration ? (t.p.x = this._x, t.p.y = this._y) : (t.p.x = this._x + Math.random() * this._shakeDiff - this._shakeDiffHalf, t.p.y = this._y + Math.random() * this._shakeDiff - this._shakeDiffHalf), e - this._duration;
  }
}
class Ti {
  constructor() {
    u(this, "_showOnce", !0);
  }
  run(t, e) {
    return t.p.enabled = t.p.enabled && this._showOnce, this._showOnce = !1, 0;
  }
}
class Si {
  constructor({
    states: t = {},
    transitions: e = {},
    defaultState: i
  }) {
    u(this, "_states");
    u(this, "_transitions");
    u(this, "_currentStateName");
    u(this, "_currentState");
    u(this, "_isTransitioningToStateName");
    this._states = Object.fromEntries(
      Object.entries(t).map(([s, r]) => [
        s,
        Array.isArray(r) ? new pt(r) : r
      ])
    ), this._transitions = Object.fromEntries(
      Object.entries(e).map(([s, r]) => [
        s,
        Array.isArray(r) ? new pt(r) : r
      ])
    ), this._currentStateName = i, this._currentState = this._states[i];
  }
  setState(t) {
    var e, i, s, r;
    if (t !== this._currentStateName) {
      this._isTransitioningToStateName = t;
      const n = `${t.charAt(0).toUpperCase()}${t.slice(1)}`, f = [
        `${this._currentStateName}To${n}`,
        `${this._currentStateName}To`,
        `to${n}`
      ].find(
        (c) => c in this._transitions
      );
      f ? (this._currentStateName = this._isTransitioningToStateName, this._currentState = this._transitions[f], (i = (e = this._currentState) == null ? void 0 : e.reset) == null || i.call(e)) : (this._currentStateName = this._isTransitioningToStateName, this._currentState = this._states[this._currentStateName], (r = (s = this._currentState) == null ? void 0 : s.reset) == null || r.call(s), this._isTransitioningToStateName = void 0);
    }
  }
  play(t = "", e = 0) {
    var i, s;
    return (s = (i = this._currentState) == null ? void 0 : i.play) == null ? void 0 : s.call(i, t, e);
  }
  run(t, e, i) {
    var n, o;
    let s = e, r = i;
    if (this._currentState) {
      if (s = this._currentState.run(t, s, r), s === !0)
        return !0;
      r = !0;
    }
    if (s >= 0 || !this._currentState)
      if (this._isTransitioningToStateName) {
        if (this._currentStateName = this._isTransitioningToStateName, this._currentState = this._states[this._currentStateName], (o = (n = this._currentState) == null ? void 0 : n.reset) == null || o.call(n), this._isTransitioningToStateName = void 0, s = this._currentState.run(t, s, r), s === !0)
          return !0;
      } else
        this._currentState = void 0;
    return -1;
  }
}
class Ci {
  constructor() {
  }
  run(t, e) {
    return St.STOP;
  }
}
class Mi {
  constructor() {
  }
  run(t, e) {
    return t.p.enabled = !1, St.STOP;
  }
}
class Ei {
  constructor(t) {
    u(this, "duration");
    this.duration = O(x(t), 0);
  }
  run(t, e) {
    return t.p.enabled = e >= this.duration, e - this.duration;
  }
}
const Qs = {
  Callback: li,
  ChangeTo: fi,
  End: di,
  EndDisabled: mi,
  Forever: _i,
  If: pi,
  Image: gi,
  ImageFrame: vi,
  Loop: yi,
  Once: wi,
  Remove: bi,
  Sequence: pt,
  Shake: xi,
  ShowOnce: Ti,
  State: Si,
  Stop: Ci,
  StopDisabled: Mi,
  Wait: be,
  WaitDisabled: Ei
};
function ki(a) {
  var t = 2.5949095;
  return (a *= 2) < 1 ? 0.5 * (a * a * ((t + 1) * a - t)) : 0.5 * ((a -= 2) * a * ((t + 1) * a + t) + 2);
}
var Pi = ki;
function zi(a) {
  var t = 1.70158;
  return a * a * ((t + 1) * a - t);
}
var Ii = zi;
function Oi(a) {
  var t = 1.70158;
  return --a * a * ((t + 1) * a + t) + 1;
}
var Fi = Oi;
function Ai(a) {
  var t = 0.36363636363636365, e = 8 / 11, i = 9 / 10, s = 4356 / 361, r = 35442 / 1805, n = 16061 / 1805, o = a * a;
  return a < t ? 7.5625 * o : a < e ? 9.075 * o - 9.9 * a + 3.4 : a < i ? s * o - r * a + n : 10.8 * a * a - 20.52 * a + 10.72;
}
var ie = Ai, pe = ie;
function Di(a) {
  return a < 0.5 ? 0.5 * (1 - pe(1 - a * 2)) : 0.5 * pe(a * 2 - 1) + 0.5;
}
var Ri = Di, Li = ie;
function Ni(a) {
  return 1 - Li(1 - a);
}
var Xi = Ni;
function Hi(a) {
  return (a *= 2) < 1 ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1);
}
var ji = Hi;
function Yi(a) {
  return 1 - Math.sqrt(1 - a * a);
}
var Bi = Yi;
function Wi(a) {
  return Math.sqrt(1 - --a * a);
}
var qi = Wi;
function Ui(a) {
  return a < 0.5 ? 4 * a * a * a : 0.5 * Math.pow(2 * a - 2, 3) + 1;
}
var Vi = Ui;
function Gi(a) {
  return a * a * a;
}
var $i = Gi;
function Zi(a) {
  var t = a - 1;
  return t * t * t + 1;
}
var Ki = Zi;
function Ji(a) {
  return a < 0.5 ? 0.5 * Math.sin(13 * Math.PI / 2 * 2 * a) * Math.pow(2, 10 * (2 * a - 1)) : 0.5 * Math.sin(-13 * Math.PI / 2 * (2 * a - 1 + 1)) * Math.pow(2, -10 * (2 * a - 1)) + 1;
}
var Qi = Ji;
function ts(a) {
  return Math.sin(13 * a * Math.PI / 2) * Math.pow(2, 10 * (a - 1));
}
var es = ts;
function is(a) {
  return Math.sin(-13 * (a + 1) * Math.PI / 2) * Math.pow(2, -10 * a) + 1;
}
var ss = is;
function as(a) {
  return a === 0 || a === 1 ? a : a < 0.5 ? 0.5 * Math.pow(2, 20 * a - 10) : -0.5 * Math.pow(2, 10 - a * 20) + 1;
}
var rs = as;
function ns(a) {
  return a === 0 ? a : Math.pow(2, 10 * (a - 1));
}
var os = ns;
function hs(a) {
  return a === 1 ? a : 1 - Math.pow(2, -10 * a);
}
var ls = hs;
function cs(a) {
  return a;
}
var us = cs;
function fs(a) {
  return a /= 0.5, a < 1 ? 0.5 * a * a : (a--, -0.5 * (a * (a - 2) - 1));
}
var ds = fs;
function ms(a) {
  return a * a;
}
var _s = ms;
function ps(a) {
  return -a * (a - 2);
}
var gs = ps;
function vs(a) {
  return a < 0.5 ? 8 * Math.pow(a, 4) : -8 * Math.pow(a - 1, 4) + 1;
}
var ys = vs;
function bs(a) {
  return Math.pow(a, 4);
}
var ws = bs;
function xs(a) {
  return Math.pow(a - 1, 3) * (1 - a) + 1;
}
var Ts = xs;
function Ss(a) {
  return (a *= 2) < 1 ? 0.5 * a * a * a * a * a : 0.5 * ((a -= 2) * a * a * a * a + 2);
}
var Cs = Ss;
function Ms(a) {
  return a * a * a * a * a;
}
var Es = Ms;
function ks(a) {
  return --a * a * a * a * a + 1;
}
var Ps = ks;
function zs(a) {
  return -0.5 * (Math.cos(Math.PI * a) - 1);
}
var Is = zs;
function Os(a) {
  var t = Math.cos(a * Math.PI * 0.5);
  return Math.abs(t) < 1e-14 ? 1 : 1 - t;
}
var Fs = Os;
function As(a) {
  return Math.sin(a * Math.PI / 2);
}
var Ds = As, Rs = {
  backInOut: Pi,
  backIn: Ii,
  backOut: Fi,
  bounceInOut: Ri,
  bounceIn: Xi,
  bounceOut: ie,
  circInOut: ji,
  circIn: Bi,
  circOut: qi,
  cubicInOut: Vi,
  cubicIn: $i,
  cubicOut: Ki,
  elasticInOut: Qi,
  elasticIn: es,
  elasticOut: ss,
  expoInOut: rs,
  expoIn: os,
  expoOut: ls,
  linear: us,
  quadInOut: ds,
  quadIn: _s,
  quadOut: gs,
  quartInOut: ys,
  quartIn: ws,
  quartOut: Ts,
  quintInOut: Cs,
  quintIn: Es,
  quintOut: Ps,
  sineInOut: Is,
  sineIn: Fs,
  sineOut: Ds
};
const ta = /* @__PURE__ */ Ce(Rs);
class ge {
  constructor(t = {}) {
    u(this, "type", "camera");
    u(this, "cam");
    this.type = "camera", this.cam = Object.assign(
      {
        zoom: 1,
        x: 0,
        y: 0
      },
      t
    );
  }
  viewport(t, e) {
    return e.scale(this.cam.zoom, this.cam.zoom).translate(-this.cam.x, -this.cam.y);
  }
  viewportByCam({ engine: t }, e) {
    const i = t.getWidth() / 2, s = t.getHeight() / 2, r = t.getRatio() > 1 ? i : s;
    return new Tt().translate(i, s).scale(r, r).scale(e.zoom, e.zoom).translate(-e.x, -e.y);
  }
  additionalModifier(t, e) {
    return e.cam = Object.assign({}, this.cam), e;
  }
  clampView(t, e) {
    const { engine: i, scene: s, clampLimits: r } = t, n = r || {
      x1: s.additionalModifier.x,
      y1: s.additionalModifier.y,
      x2: s.additionalModifier.x + s.additionalModifier.width,
      y2: s.additionalModifier.y + s.additionalModifier.height
    }, o = this.viewportByCam(t, e).invert(), [f, c] = o.transformPoint(0, 0), [m, b] = o.transformPoint(
      i.getWidth(),
      i.getHeight()
    );
    return m - f <= n.x2 - n.x1 ? f < n.x1 ? m <= n.x2 && (e.x += n.x1 - f) : m > n.x2 && (e.x += n.x2 - m) : f > n.x1 ? e.x += n.x1 - f : m < n.x2 && (e.x += n.x2 - m), b - c <= n.y2 - n.y1 ? c < n.y1 ? b <= n.y2 && (e.y += n.y1 - c) : b > n.y2 && (e.y += n.y2 - b) : c > n.y1 ? e.y += n.y1 - c : b < n.y2 && (e.y += n.y2 - b), e;
  }
  set zoom(t) {
    this.cam.zoom = t;
  }
  set camX(t) {
    this.cam.x = t;
  }
  set camY(t) {
    this.cam.y = t;
  }
  get zoom() {
    return this.cam.zoom;
  }
  get camX() {
    return this.cam.x;
  }
  get camY() {
    return this.cam.y;
  }
  zoomToFullScreen({ scene: t }) {
    return Math.min(
      t.additionalModifier.fullScreen.width / t.additionalModifier.width,
      t.additionalModifier.fullScreen.height / t.additionalModifier.height
    );
  }
  zoomTo(t) {
    const { scene: e, engine: i, cam: s, x1: r, y1: n, x2: o, y2: f } = t, c = e.additionalModifier.scaleCanvas, m = this.viewportByCam(t, s || this.cam).invert(), [b, k] = m.transformPoint(0, 0), [S, H] = m.transformPoint(
      i.getWidth() * c,
      i.getHeight() * c
    ), L = S - b, E = H - k, X = o - r, V = f - n, F = r + X / 2, Y = n + V / 2, G = L / X, M = E / V, J = {
      x: F,
      y: Y,
      zoom: (s || this.cam).zoom * Math.max(Math.min(G, M), Number.MIN_VALUE)
    };
    s ? (s.x = J.x, s.y = J.y, s.zoom = J.zoom) : this.cam = J;
  }
}
const Ls = 300;
class Ee {
  constructor(t = {}) {
    u(this, "type", "control");
    u(this, "_mousePos", {});
    u(this, "toCam", {
      zoom: 1,
      x: 0,
      y: 0
    });
    u(this, "_config");
    u(this, "_scene");
    u(this, "_instant", !1);
    this._config = Object.assign(
      {
        zoomMax: 10,
        zoomMin: 0.5,
        zoomFactor: 1.2,
        tween: 2,
        callResize: !0
      },
      t
    );
  }
  init({ scene: t }) {
    this._scene = t, this.toCam = Object.assign({}, t.camera.cam);
  }
  mouseDown({
    event: t,
    position: [e, i],
    button: s
  }) {
    var r;
    this._mousePos[s] = Object.assign({}, this._mousePos[s], {
      x: e,
      y: i,
      _cx: this.toCam.x,
      _cy: this.toCam.y,
      _isDown: !0,
      _numOfFingers: ((r = t.touches) == null ? void 0 : r.length) || 1,
      _distance: void 0,
      _timestamp: Date.now()
    });
  }
  mouseUp({
    event: t,
    position: [e, i],
    button: s,
    scene: r
  }) {
    var c;
    this._mousePos[s] || delete this._mousePos[s];
    const n = this._mousePos[s]._isDown, o = ((c = t.changedTouches) == null ? void 0 : c.length) || 1, f = Math.max(
      this._mousePos[s]._numOfFingers,
      o
    );
    if (this._mousePos[s]._isDown = !1, this._mousePos[s]._numOfFingers -= o, !n || f > 1) {
      r.stopPropagation();
      return;
    }
    Date.now() - this._mousePos[s]._timestamp < Ls && Math.abs(this._mousePos[s].x - e) < 5 && Math.abs(this._mousePos[s].y - i) < 5 && s === 1 || r.stopPropagation();
  }
  mouseOut({ button: t }) {
    this._mousePos[t] && (this._mousePos[t]._isDown = !1);
  }
  mouseMove(t) {
    var f;
    const {
      event: e,
      position: [i, s],
      button: r,
      scene: n
    } = t;
    if (!this._mousePos[r] || !this._mousePos[r]._isDown || e.which === 0 && !e.touches)
      return;
    const o = n.additionalModifier.scaleCanvas;
    if (((f = e.touches) == null ? void 0 : f.length) >= 2) {
      const c = e.touches, m = Math.sqrt(
        (c[0].pageX - c[1].pageX) * (c[0].pageX - c[1].pageX) + (c[0].pageY - c[1].pageY) * (c[0].pageY - c[1].pageY)
      );
      this._mousePos[r]._distance === void 0 ? m > 0 && (this._mousePos[r]._distance = m, this._mousePos[r]._czoom = this.toCam.zoom) : (this.toCam.zoom = Math.max(
        this._config.zoomMin,
        Math.min(
          this._config.zoomMax,
          this._mousePos[r]._czoom * m / this._mousePos[r]._distance
        )
      ), this.toCam = n.camera.clampView(t, this.toCam));
      return;
    } else {
      this._mousePos[r]._distance = void 0;
      const c = n.camera.viewportByCam(t, this.toCam).invert(), [m, b] = c.transformPoint(
        this._mousePos[r].x * o,
        this._mousePos[r].y * o
      ), [k, S] = c.transformPoint(i * o, s * o);
      this.toCam.x = this._mousePos[r]._cx + m - k, this.toCam.y = this._mousePos[r]._cy + b - S, this.toCam = n.camera.clampView(t, this.toCam);
    }
  }
  mouseWheel(t) {
    const {
      event: e,
      position: [i, s],
      scene: r
    } = t, n = r.additionalModifier.scaleCanvas, [o, f] = r.camera.viewportByCam(t, this.toCam).invert().transformPoint(i * n, s * n);
    if (// @ts-expect-error wheelDelta is old ff-api
    (e.wheelDelta || e.deltaY * -1) / 120 > 0) {
      this.zoomIn();
      const [m, b] = r.camera.viewportByCam(t, this.toCam).invert().transformPoint(i * n, s * n);
      this.toCam.x -= m - o, this.toCam.y -= b - f, this.toCam = r.camera.clampView(t, this.toCam);
    } else
      this.zoomOut(t);
  }
  hasCamChanged() {
    const t = this._config.tween || 1;
    return Math.abs(this.toCam.x - this._scene.camera.cam.x) >= Number.EPSILON * t || Math.abs(this.toCam.y - this._scene.camera.cam.y) >= Number.EPSILON * t || Math.abs(this.toCam.zoom - this._scene.camera.cam.zoom) >= Number.EPSILON * t;
  }
  fixedUpdate({ scene: t, lastCall: e }) {
    this._config.tween && !this._instant && this.hasCamChanged() && (t.camera.cam.x += (this.toCam.x - t.camera.cam.x) / this._config.tween, t.camera.cam.y += (this.toCam.y - t.camera.cam.y) / this._config.tween, t.camera.cam.zoom += (this.toCam.zoom - t.camera.cam.zoom) / this._config.tween, e && (t.additionalModifier.cam = t.camera.cam, this._config.callResize ? t.resize() : t.cacheClear()));
  }
  update({ scene: t }) {
    (!this._config.tween || this._instant) && this.hasCamChanged() && (this._instant = !1, t.camera.cam = Object.assign({}, this.toCam), this._config.callResize ? t.resize() : t.cacheClear());
  }
  camInstant() {
    this._instant = !0;
  }
  resize(t) {
    this.toCam = t.scene.camera.clampView(t, this.toCam);
  }
  zoomToNorm() {
    return this.toCam.zoom = 1, this;
  }
  zoomIn() {
    return this.toCam.zoom = Math.min(
      this._config.zoomMax,
      this.toCam.zoom * this._config.zoomFactor
    ), this;
  }
  zoomOut(t) {
    return this.toCam.zoom = Math.max(
      this._config.zoomMin,
      this.toCam.zoom / this._config.zoomFactor
    ), this.toCam = t.scene.camera.clampView(t, this.toCam), this;
  }
  zoomTo(t) {
    t.scene.camera.zoomTo(Object.assign(t, { cam: this.toCam }));
  }
}
const ve = 300;
class Ns extends Ee {
  mouseUp({
    event: t,
    position: [e, i],
    button: s,
    scene: r
  }) {
    var c;
    this._mousePos[s] || delete this._mousePos[s];
    const n = this._mousePos[s]._isDown, o = ((c = t.changedTouches) == null ? void 0 : c.length) || 1, f = Math.max(
      this._mousePos[s]._numOfFingers,
      o
    );
    if (this._mousePos[s]._isDown = !1, this._mousePos[s]._numOfFingers -= o, !n || f > 1) {
      r.stopPropagation();
      return;
    }
    if ((Date.now() - this._mousePos[s]._timestamp > ve || Math.abs(this._mousePos[s].x - e) >= 5 || Math.abs(this._mousePos[s].y - i) >= 5) && s === 1) {
      r.stopPropagation();
      const [m, b] = r.transformPoint(e, i), [k, S] = r.transformPoint(
        this._mousePos[s].x,
        this._mousePos[s].y
      );
      r.map("region", {
        event: t,
        x1: Math.min(k, m),
        y1: Math.min(S, b),
        x2: Math.max(k, m),
        y2: Math.max(S, b),
        fromX: k,
        fromY: S,
        toX: m,
        toY: b
      });
    }
  }
  mouseMove(t) {
    var f;
    const {
      event: e,
      position: [i, s],
      button: r,
      scene: n
    } = t;
    if (!this._mousePos[r] || !this._mousePos[r]._isDown || e.which === 0 && !e.touches)
      return;
    const o = n.additionalModifier.scaleCanvas;
    if (((f = e.touches) == null ? void 0 : f.length) >= 2) {
      const c = e.touches, m = Math.sqrt(
        (c[0].pageX - c[1].pageX) * (c[0].pageX - c[1].pageX) + (c[0].pageY - c[1].pageY) * (c[0].pageY - c[1].pageY)
      );
      if (this._mousePos[r]._distance === void 0)
        m > 0 && (this._mousePos[r]._distance = m, this._mousePos[r]._czoom = this.toCam.zoom);
      else {
        this.toCam.zoom = Math.max(
          this._config.zoomMin,
          Math.min(
            this._config.zoomMax,
            this._mousePos[r]._czoom * m / this._mousePos[r]._distance
          )
        );
        const b = n.camera.viewportByCam(t, this.toCam).invert(), [k, S] = b.transformPoint(
          this._mousePos[r].x * o,
          this._mousePos[r].y * o
        ), [H, L] = b.transformPoint(i * o, s * o);
        this.toCam.x = this._mousePos[r]._cx + k - H, this.toCam.y = this._mousePos[r]._cy + S - L, this.toCam = n.camera.clampView(t, this.toCam);
      }
      return;
    } else if (this._mousePos[r]._distance = void 0, r === 2) {
      const c = n.camera.viewportByCam(t, this.toCam).invert(), [m, b] = c.transformPoint(
        this._mousePos[r].x * o,
        this._mousePos[r].y * o
      ), [k, S] = c.transformPoint(i * o, s * o);
      this.toCam.x = this._mousePos[r]._cx + m - k, this.toCam.y = this._mousePos[r]._cy + b - S, this.toCam = n.camera.clampView(t, this.toCam);
    }
    if (r === 1 && n.has("regionMove") && !(Date.now() - this._mousePos[r]._timestamp < ve && Math.abs(this._mousePos[r].x - i) < 5 && Math.abs(this._mousePos[r].y - s) < 5) && (!e.touches || e.touches.length === 1)) {
      const [c, m] = n.transformPoint(i, s), [b, k] = n.transformPoint(
        this._mousePos[r].x,
        this._mousePos[r].y
      );
      n.map("regionMove", {
        event: e,
        x1: Math.min(b, c),
        y1: Math.min(k, m),
        x2: Math.max(b, c),
        y2: Math.max(k, m),
        fromX: b,
        fromY: k,
        toX: c,
        toY: m
      });
    }
  }
}
class Xs {
  constructor({
    doubleClickDetectInterval: t = 350
  } = {}) {
    u(this, "_doubleClickElementTimer");
    u(this, "_doubleClickDetectInterval");
    this._doubleClickDetectInterval = t;
  }
  mouseUp(t) {
    const { scene: e, button: i } = t;
    i === 1 && (e.has("doubleClick") ? this._doubleClickElementTimer ? (clearTimeout(this._doubleClickElementTimer), this._doubleClickElementTimer = 0, e.map("doubleClick", t)) : this._doubleClickElementTimer = window.setTimeout(() => {
      this._doubleClickElementTimer = 0, e.map("click", t);
    }, this._doubleClickDetectInterval) : e.map("click", t));
  }
}
class Hs {
  constructor({
    doubleClickDetectInterval: t = 350
  } = {}) {
    u(this, "_clickIntend");
    u(this, "_hoverIntend");
    u(this, "_hasDetectImage", !1);
    u(this, "_doubleClickElementTimer");
    u(this, "_doubleClickDetectInterval");
    this._doubleClickDetectInterval = t;
  }
  isDrawFrame() {
    return this._hasDetectImage ? 1 : 0;
  }
  _dispatchEvent(t, e, i) {
    e ? t.has("doubleClickElement") ? this._doubleClickElementTimer ? (window.clearTimeout(this._doubleClickElementTimer), this._doubleClickElementTimer = 0, t.map("doubleClickElement", i)) : this._doubleClickElementTimer = window.setTimeout(() => {
      this._doubleClickElementTimer = 0, t.map("clickElement", i);
    }, this._doubleClickDetectInterval) : t.map("clickElement", i) : t.map("hoverElement", i);
  }
  _dispatchNonEvent(t, e, i) {
    e ? t.has("doubleClickNonElement") ? this._doubleClickElementTimer ? (clearTimeout(this._doubleClickElementTimer), this._doubleClickElementTimer = void 0, t.map("doubleClickNonElement", i)) : this._doubleClickElementTimer = window.setTimeout(() => {
      this._doubleClickElementTimer = void 0, t.map("clickNonElement", i);
    }, this._doubleClickDetectInterval) : t.map("clickNonElement", i) : t.map("hoverNonElement", i);
  }
  initSprites(t) {
    const { scene: e, output: i, layerManager: s, canvasId: r } = t;
    if (this._hasDetectImage = !1, this._clickIntend || this._hoverIntend) {
      const n = !!this._clickIntend, { mx: o, my: f } = this._clickIntend || this._hoverIntend, c = e.additionalModifier.scaleCanvas, m = i.context[r || 0], b = Math.round(o / c), k = Math.round(f / c), [S, H] = e.transformPoint(o, f);
      m.save(), m.setTransform(...e.viewport().m);
      let L;
      if (s.forEach(({ layerId: E, element: X, isFunction: V, elementId: F }) => {
        if (!V) {
          const Y = X.detect(m, b, k);
          if (Y === "c")
            L = "c";
          else if (Y)
            return L = { layerId: E, element: Y, elementId: F }, !1;
        }
      }), m.restore(), L === "c")
        this._hasDetectImage = !0;
      else {
        this._clickIntend = void 0, this._hoverIntend = void 0;
        const E = Object.assign(
          {
            mx: o,
            my: f,
            x: S,
            y: H
          },
          t
        );
        L ? (Object.assign(E, L), this._dispatchEvent(e, n, E)) : this._dispatchNonEvent(e, n, E);
      }
    }
  }
  draw(t) {
    const { engine: e, scene: i, layerManager: s, output: r, canvasId: n } = t;
    if (!n && this._hasDetectImage) {
      const o = !!this._clickIntend, { mx: f, my: c } = this._clickIntend || this._hoverIntend, m = i.additionalModifier.scaleCanvas, b = r.context[0], k = Math.round(f / m), S = Math.round(c / m), [H, L] = i.transformPoint(f, c), E = Object.assign(
        {
          mx: f,
          my: c,
          x: H,
          y: L
        },
        t
      ), X = b.imageSmoothingEnabled;
      b.imageSmoothingEnabled = !1, b.clearRect(0, 0, b.canvas.width, b.canvas.height), b.save(), b.setTransform(...i.viewport().m), s.forEach(({ layerId: F, element: Y, isFunction: G, elementId: M }) => {
        if (!G) {
          const J = `rgb(${M & 255}, ${(M & 65280) >> 8}, ${F & 255})`;
          Y.detectDraw(b, J);
        }
      }, 0), b.restore(), b.imageSmoothingEnabled = X, e.normContext(b), this._clickIntend = void 0, this._hoverIntend = void 0;
      const V = b.getImageData(k, S, 1, 1).data;
      if (V[3]) {
        const F = V[2], Y = V[0] + (V[1] << 8);
        Object.assign(E, {
          layerId: F,
          elementId: Y,
          element: s.getById(F).getById(Y)
        }), this._dispatchEvent(i, o, E);
      } else
        this._dispatchNonEvent(i, o, E);
    }
  }
  mouseUp({ scene: t, position: [e, i], button: s }) {
    this._clickIntend = s === 1 && t.has("clickElement") ? { mx: e, my: i } : void 0;
  }
  mouseMove({ scene: t, position: [e, i] }) {
    this._hoverIntend = t.has("hoverElement") ? { mx: e, my: i } : void 0;
  }
}
class js {
  loading({ output: t, progress: e }) {
    const i = t.context[0], s = typeof e == "number", r = s ? Math.max(1, e * t.height) : t.height;
    i.globalCompositeOperation = "source-over", i.globalAlpha = 1, i.clearRect(0, 0, t.width, t.height), i.fillStyle = "_aaa", i.fillRect(
      0,
      t.height / 2 - r / 2,
      t.width,
      r
    ), i.font = "20px Georgia", i.fillStyle = "#fff", i.textAlign = "left", i.textBaseline = "bottom", i.fillText(
      s ? "Loading " + Math.round(100 * e) + "%" : e,
      10 + Math.random() * 3,
      t.height - 10 + Math.random() * 3
    );
  }
}
class Ys {
  viewport({ engine: t }, e) {
    const i = t.getWidth() / 2, s = t.getHeight() / 2, r = t.getRatio() > 1 ? i : s;
    return e.translate(i, s).scale(r, r);
  }
  additionalModifier({
    engine: t,
    output: e,
    scene: i
  }) {
    i.cacheClear();
    const [s, r] = i.transformPoint(0, 0, 1), [n, o] = i.transformPoint(e.width, e.height, 1), f = t.getWidth() / 2, c = t.getHeight() / 2, m = t.getRatio() > 1 ? f : c, b = new Tt().translate(f, c).scale(m, m).invert(), [k, S] = b.transformPoint(0, 0), [H, L] = b.transformPoint(
      e.width,
      e.height
    );
    return {
      alpha: 1,
      x: -1,
      y: -1,
      width: 2,
      height: 2,
      widthInPixel: e.width,
      heightInPixel: e.height,
      scaleCanvas: e.width / e.canvas[0].clientWidth,
      visibleScreen: {
        x: s,
        y: r,
        width: n - s,
        height: o - r
      },
      fullScreen: {
        x: k,
        y: S,
        width: H - k,
        height: L - S
      }
    };
  }
}
class Bs extends ee {
  constructor(e) {
    super({
      ...e,
      maxSkippedTickChunk: Number.POSITIVE_INFINITY
    });
    u(this, "_maxSkippedTickChunk", Number.POSITIVE_INFINITY);
    u(this, "_audioStartTime");
    u(this, "_audioPosition");
    u(this, "_enableAndroidHack", !1);
    u(this, "_audioElement");
    this._audioElement = e.audioElement;
  }
  get audioElement() {
    return this._audioElement;
  }
  init(e) {
    if (this._audioElement)
      return typeof MediaController == "function" && (this._audioElement.controller = new MediaController(), this._enableAndroidHack = !0), this._audioElement.preload = "auto", new Promise((i, s) => {
        const r = () => {
          this._audioElement.removeEventListener(
            "canplaythrough",
            r
          );
          const n = this._audioElement.play();
          n && n.catch((o) => {
          }), i(void 0);
        };
        this._audioElement.addEventListener("canplaythrough", r), this._audioElement.onerror = () => {
          this._audioElement = void 0, i(void 0);
        }, this._audioElement.load();
      });
  }
  endTime() {
    return this._audioElement ? this._audioElement.duration * 1e3 : Number.POSITIVE_INFINITY;
  }
  currentTime() {
    const e = super.currentTime();
    if (this._audioElement) {
      if (this._audioElement.ended && this._audioElement.duration)
        return this._audioElement.duration * 1e3;
      const i = this._audioElement.currentTime * 1e3;
      if (this._enableAndroidHack) {
        if (this._audioStartTime === void 0)
          return this._audioStartTime = e, this._audioPosition = i, i;
        if (this._audioElement.controller.playbackState === "playing") {
          if (i === this._audioPosition)
            return this._audioPosition + Math.min(260, e - this._audioStartTime);
          if (i - this._audioPosition < 500 && i > this._audioPosition && e - this._audioStartTime < 350)
            return this._audioStartTime = this._audioStartTime + (i - this._audioPosition), this._audioPosition = i, this._audioPosition + e - this._audioStartTime;
        }
        return this._audioStartTime = e, this._audioPosition = i, this._audioPosition;
      } else
        return i;
    } else
      return e;
  }
  clampTime({ timePassed: e }) {
    return e;
  }
  shiftTime() {
    return 0;
  }
}
class Ws {
  constructor() {
    u(this, "type", "events");
    u(this, "_reseted", !1);
    u(this, "_events", []);
  }
  _pushEvent(t, e, i) {
    if (O(i.value("preventDefault"), !0) && e.preventDefault(), !this._reseted)
      return;
    const [s, r] = this.getMousePosition({ event: e }), [n, o] = i.transformPoint(s, r);
    i.pipeBack(t, {
      event: e,
      position: [s, r],
      x: n,
      y: o,
      button: this.getMouseButton({ event: e })
    });
  }
  events({ scene: t }) {
    return [
      t.has("mouseDown") && [
        ["touchstart", "mousedown"],
        (e) => this._pushEvent("mouseDown", e, t)
      ],
      t.has("mouseUp") && [
        ["touchend", "mouseup"],
        (e) => this._pushEvent("mouseUp", e, t)
      ],
      t.has("mouseOut") && [
        ["touchendoutside", "mouseout"],
        (e) => this._pushEvent("mouseOut", e, t)
      ],
      t.has("mouseMove") && [
        ["touchmove", "mousemove"],
        (e) => this._pushEvent("mouseMove", e, t)
      ],
      t.has("mouseWheel") && [
        ["wheel"],
        (e) => this._pushEvent("mouseWheel", e, t)
      ],
      O(
        t.value("preventDefault"),
        !0
      ) && [["contextmenu"], (e) => e.preventDefault()]
    ].filter((e) => e);
  }
  init({ output: t, scene: e }) {
    const i = t.canvas[0], s = e.map("events", {});
    this._events = s.filter(Array.isArray).flat(1).map(
      (r) => Array.isArray(r) ? r : [
        [r],
        (n) => {
          O(e.value("preventDefault"), !0) && n.preventDefault(), e.pipeBack(r, { event: n });
        }
      ]
    ).map(
      ([r, n]) => r.map((o) => ({
        n: i,
        e: o,
        f: n
      }))
    ).flat(1), this._events.forEach((r) => {
      r.n.addEventListener(r.e, r.f, !0);
    });
  }
  destroy() {
    this._events.forEach((t) => {
      t.n.removeEventListener(t.e, t.f, !0);
    }), this._events = [];
  }
  reset(t, e) {
    return this._reseted = !0, e;
  }
  getMousePosition({ event: t }) {
    let e;
    if (t.touches && t.touches.length > 0 ? e = t.targetTouches : t.changedTouches && t.changedTouches.length > 0 && (e = t.changedTouches), e) {
      const i = t.target.getBoundingClientRect(), s = e.length;
      return e = Array.from(e), [
        e.reduce((r, n) => r + n.pageX, 0) / s - i.left,
        e.reduce((r, n) => r + n.pageY, 0) / s - i.top
      ];
    }
    if (t.offsetX === void 0) {
      const i = t.target.getBoundingClientRect();
      return [
        t.clientX - i.left,
        t.clientY - i.top
      ];
    }
    return [t.offsetX, t.offsetY];
  }
  getMouseButton({ event: t }) {
    return t.touches ? t.touches.length || t.changedTouches.length : O(
      t.buttons ? t.buttons : [0, 1, 4, 2][t.which],
      1
    );
  }
}
const ea = {
  Callback: ge,
  Camera: ge,
  CameraControl: Ee,
  CameraControlSecondButton: Ns,
  Click: Xs,
  Element: Hs,
  Event: Ws,
  LoadingScreen: js,
  Norm: Ys,
  TimingAudio: Bs,
  TimingDefault: ee
};
export {
  Qs as Animations,
  ta as Easing,
  Us as Engine,
  jt as ImageManager,
  Nt as Layer,
  $t as LayerManager,
  ea as Middleware,
  at as Position,
  Vs as Scene,
  Zs as Sprites
};
