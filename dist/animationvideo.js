function T(a, ...t) {
  return typeof a == "function" ? a(...t) : a;
}
function xt(a, t, ...e) {
  return typeof a == "function" ? a.apply(t, e) : a;
}
function ye(a) {
  return a == null ? [] : Array.isArray(a) ? a : [a];
}
class Ee {
  _output;
  _events;
  _scene;
  _newScene;
  _sceneParameter;
  _isSceneInitialized;
  _recalculateCanvasIntend;
  _lastTimestamp;
  _referenceRequestAnimationFrame;
  _autoSize;
  _canvasCount;
  _drawFrame;
  _reduceFramerate;
  _realLastTimestamp;
  _isOddFrame = !1;
  _initializedStartTime;
  _promiseSceneDestroying;
  _runParameter;
  _moveOnce = !1;
  constructor(t) {
    let e = t;
    if (typeof t != "object")
      throw new Error("No canvas given for Engine constructor");
    if (t.getContext)
      e = {
        canvas: t
      };
    else if (!t.canvas)
      throw new Error("No canvas given for Engine constructor");
    const i = Object.assign({}, e);
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
      const t = T(this._autoSize.referenceWidth), e = T(this._autoSize.referenceHeight);
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
            for (let f = 0; f < this._canvasCount; f++) {
              const p = this._output.context[f];
              this.normContext(p), this._scene.initSprites(f);
            }
          const c = this._scene.isDrawFrame(n);
          if (Array.isArray(c))
            for (let f = 0; f < this._canvasCount; f++)
              this._drawFrame[f] = Math.max(
                this._drawFrame[f],
                c[f],
                0
              );
          else
            for (let f = 0; f < this._canvasCount; f++)
              this._drawFrame[f] = Math.max(
                this._drawFrame[f],
                c,
                0
              );
          if (i && this._scene.move(n), this._output.canvas[0].width)
            for (let f = 0; f < this._canvasCount; f++)
              this._drawFrame[f] && this._scene.draw(f);
        } else {
          for (let c = 0; c < this._canvasCount; c++)
            this.normContext(this._output.context[c]);
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
          const n = this._autoSize.offsetTimeTarget * (this._reduceFramerate ? 2 : 1), o = this._now() - s, c = (Math.abs(r - n) > Math.abs(o - n) ? r : o) - n;
          Math.abs(c) <= this._autoSize.offsetTimeDelta ? this._autoSize.currentOffsetTime = this._autoSize.currentOffsetTime >= 0 ? Math.max(
            0,
            this._autoSize.currentOffsetTime - this._autoSize.offsetTimeDelta
          ) : Math.min(
            0,
            this._autoSize.currentOffsetTime + this._autoSize.offsetTimeDelta
          ) : c < 0 && this._autoSize.currentScale > this._autoSize.scaleLimitMin ? (this._autoSize.currentOffsetTime += c, this._autoSize.currentOffsetTime <= -this._autoSize.offsetTimeLimitDown && (this._autoSize.currentScale = Math.max(
            this._autoSize.scaleLimitMin,
            this._autoSize.currentScale / this._autoSize.scaleFactor
          ), this._recalculateCanvasIntend = !0)) : c > 0 && this._autoSize.currentScale < this._autoSize.scaleLimitMax && (this._autoSize.currentOffsetTime += c, this._autoSize.currentOffsetTime >= this._autoSize.offsetTimeLimitUp && (this._autoSize.currentScale = Math.min(
            this._autoSize.scaleLimitMax,
            this._autoSize.currentScale * this._autoSize.scaleFactor
          ), this._recalculateCanvasIntend = !0));
        }
      }
    }
    this._realLastTimestamp = t;
  }
  async run(t = void 0) {
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
const Ys = Ee;
class ke {
  Images;
  count;
  loaded;
  _resolve = [];
  constructor() {
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
const jt = new ke();
class Pe {
  _layer;
  _isFunction;
  _start;
  _nextFree;
  _canvasIds;
  constructor(t) {
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
const Nt = Pe;
class ze {
  _layers;
  constructor() {
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
const Zt = ze;
class Tt {
  m = [1, 0, 0, 1, 0, 0];
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
function I(a, t) {
  return a == null || a === "" ? t : a;
}
class ee {
  _configuration;
  _tickChunk;
  _maxSkippedTickChunk;
  _tickChunkTolerance;
  type = "timing";
  totalTimePassed = 0;
  constructor(t = {}) {
    this._configuration = t, this._tickChunk = I(T(this._configuration.tickChunk), 1e3 / 60), this._maxSkippedTickChunk = I(
      T(this._configuration.maxSkippedTickChunk),
      120
    ), this._tickChunkTolerance = I(
      T(this._configuration.tickChunkTolerance),
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
class Ie {
  _layerManager;
  _imageManager;
  _totalTimePassed;
  _engine;
  _middleware = re();
  _stopPropagation = !1;
  _transform;
  _transformInvert;
  _additionalModifier;
  _initDone = !1;
  _endTime;
  _resetIntend = !1;
  constructor(...t) {
    this._layerManager = new Zt(), this._totalTimePassed = 0, this._imageManager = jt, this.middlewares = t, this.middlewareByType("timing") || (this.middlewares = [
      ee,
      ...this.middlewares
    ]);
  }
  _output() {
    return this._engine?.getOutput();
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
    return this.do(
      t,
      e,
      [],
      (i, s) => i.map((r) => xt(r[t], r, s))
    );
  }
  pipe(t, e, i = void 0) {
    return this.do(t, e, i, (s, r) => {
      let n = i;
      this._stopPropagation = !1;
      for (const o of s)
        if (n = xt(o[t], o, r, n), this._stopPropagation) break;
      return n;
    });
  }
  pipeBack(t, e, i = void 0) {
    return this.do(t, e, i, (s, r) => {
      let n = i;
      this._stopPropagation = !1;
      for (let o = s.length - 1; o >= 0; o--) {
        const c = s[o];
        if (n = xt(c[t], c, r, n), this._stopPropagation) break;
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
          for (const c of s) {
            const f = xt(c[t], c, r, o);
            if (Array.isArray(f) ? o = o.map(
              (p, y) => Math.max(p, f[y])
            ) : o = o.map((p, y) => Math.max(p, f)), this._stopPropagation) break;
          }
        else
          for (const c of s) {
            const f = xt(c[t], c, r, o);
            if (Array.isArray(f) ? o = f.map((p) => Math.max(p, o)) : o = Math.max(f, o), this._stopPropagation) break;
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
          if (n = await xt(o[t], o, r, n), this._stopPropagation) break;
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
      if (this.value(
        "hasOneChunkedFrame",
        { timePassed: t }
      )) {
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
    let t = this.pipe("reset", {}, new Zt());
    if (Array.isArray(t)) {
      const e = t;
      t = new Zt(), e.forEach((i) => {
        t.addLayer().addElements(i);
      });
    }
    t && (this._layerManager = t);
  }
}
const Bs = Ie;
class be {
  _duration;
  constructor(t) {
    this._duration = T(t) - 0;
  }
  run(t, e) {
    return e - this._duration;
  }
}
var St = /* @__PURE__ */ ((a) => (a.FORCE_DISABLE = "F", a.STOP = "S", a.REMOVE = "R", a))(St || {});
class Oe {
  sequences = [];
  lastTimestamp = 0;
  enabled = !0;
  constructor(...t) {
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
      e.enabled = !0, e.position = 0, e.timelapsed = t, e.sequence[0]?.reset?.(t);
    }), this.enabled = !0;
  }
  play(t = "", e = 0) {
    if (t) {
      const i = this.sequences.reduce((s, r) => (t in r.label ? (s = !0, r.position = r.label[t], r.enabled = !0, r.timelapsed = e, r.sequence[r.position]?.reset?.()) : s = s || r.sequence.some(
        (n) => n.play?.(t, e)
      ), s), !1);
      return i && (this.enabled = !0), i;
    } else
      return this.sequences.forEach(
        (i) => i.enabled = !0
      ), this.enabled = !0, !0;
  }
  _runSequence(t, e, i) {
    let s = i;
    for (; e.sequence[e.position] && s >= 0; ) {
      if (e.timelapsed += s, e.timelapsed < 0)
        return -1;
      const r = e.sequence[e.position].run(
        t,
        e.timelapsed
      );
      if (r === !0)
        s = 0;
      else {
        if (r === !1)
          return -1;
        if (r === "F")
          return e.enabled = !1, this.enabled = !1, i;
        if (r === "S")
          return e.enabled = !1, i;
        if (r === "R")
          return !0;
      }
      if (s = r, s >= 0 && (e.position = (e.position + 1) % e.sequence.length, e.sequence[e.position]?.reset?.(), e.timelapsed = 0, e.position === 0))
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
    for (let c = 0; c < r; c++)
      if (this.sequences[c].enabled) {
        const f = this._runSequence(
          t,
          this.sequences[c],
          s
        );
        if (f === !0)
          return !0;
        o = Math.min(o, f);
      } else
        n++;
    return n === r ? (this.enabled = !1, s) : o;
  }
}
const _t = Oe;
class ft {
  _needInit = !0;
  p;
  constructor(t) {
    this.p = this._parseParameterList(this._getParameterList(), t);
  }
  _parseParameterList(t, e) {
    const s = Object.entries(
      t
    ).map(([r, n]) => {
      const o = e[r];
      return [
        r,
        typeof n == "function" ? n(o, e) : I(T(o), n)
      ];
    });
    return Object.fromEntries(s);
  }
  _getBaseParameterList() {
    return {
      // animation
      animation: (t, e) => {
        const i = T(t);
        return Array.isArray(i) ? new _t(i) : i;
      },
      // if it's rendering or not
      enabled: !0,
      // if you can click it or not
      isClickable: !1,
      // tags to mark the sprites
      tag: (t, e) => {
        const i = T(t);
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
    this.p.animation && this.p.animation.play?.(t, e);
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
    scaleY: c = 1,
    rotation: f = 0
  }, p, y, k, C, X) {
    let D = !1;
    if (t && e) {
      const E = r / 2, N = n / 2;
      p.save(), C ? p.translate(i + E, s + N) : p.translate(i, s), p.scale(o, c), p.rotate(f), p.beginPath(), X ? D = X(E, N) : (p.rect(-E, -N, r, n), p.closePath(), D = p.isPointInPath(y, k)), p.restore();
    }
    return D ? this : void 0;
  }
  detectDraw(t, e) {
  }
  detect(t, e, i) {
  }
  draw(t, e) {
  }
}
let Fe = class extends ft {
  _timePassed = 0;
  constructor(t) {
    typeof t == "function" && (t = { callback: t }), super(t);
  }
  _getParameterList() {
    return Object.assign({}, this._getBaseParameterList(), {
      callback: (t) => typeof t > "u" ? () => {
      } : t
    });
  }
  animate(t) {
    return this.p.enabled && (this._timePassed += t), super.animate(t);
  }
  draw(t, e) {
    this.p.enabled && this.p.callback(t, this._timePassed, e, this);
  }
};
const Ae = Math.PI / 180, It = {
  // position
  x: 0,
  y: 0,
  // rotation
  rotation: (a, t) => I(
    T(a),
    I(
      T(t.rotationInRadian),
      I(T(t.rotationInDegree), 0) * Ae
    )
  ),
  // scalling
  scaleX: (a, t) => I(T(a), I(T(t.scale), 1)),
  scaleY: (a, t) => I(T(a), I(T(t.scale), 1)),
  // alpha
  alpha: 1,
  // blending
  compositeOperation: "source-over",
  // color
  color: "#fff"
};
class De extends ft {
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
class Bt extends ft {
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
    this.p.animation && this.p.animation.play?.(t, e);
    for (const i of this.p.sprite)
      i.play?.(t, e);
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
class Re extends Bt {
  _currentGridSize;
  _drawFrame = 2;
  _temp_canvas;
  _tctx;
  constructor(t) {
    super(t);
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
      norm: (t, e) => I(
        T(t),
        T(e.x) === void 0 && T(e.y) === void 0 && T(e.width) === void 0 && T(e.height) === void 0
      ),
      isDrawFrame: (t, e) => I(t, 1)
    });
  }
  _generateTempCanvas(t) {
    const e = t.widthInPixel, i = t.heightInPixel, s = this.p;
    this._temp_canvas = document.createElement("canvas"), s.canvasWidth && s.canvasHeight ? (this._temp_canvas.width = s.canvasWidth, this._temp_canvas.height = s.canvasHeight) : s.gridSize ? (this._currentGridSize = s.gridSize, this._temp_canvas.width = Math.round(this._currentGridSize), this._temp_canvas.height = Math.round(this._currentGridSize)) : (this._temp_canvas.width = Math.round(e / s.scaleX), this._temp_canvas.height = Math.round(i / s.scaleY)), this._tctx = this._temp_canvas.getContext("2d");
  }
  _normalizeFullScreen(t) {
    const e = this.p;
    (e.norm || e.x === void 0) && (e.x = t.visibleScreen.x), (e.norm || e.y === void 0) && (e.y = t.visibleScreen.y), (e.norm || e.width === void 0) && (e.width = t.visibleScreen.width), (e.norm || e.height === void 0) && (e.height = t.visibleScreen.height);
  }
  _copyCanvas(t) {
    const e = this.p;
    if (this._temp_canvas && this._currentGridSize !== e.gridSize && !e.canvasWidth) {
      const i = this._temp_canvas;
      this._generateTempCanvas(t), this._tctx.globalCompositeOperation = "copy", this._tctx.drawImage(
        i,
        0,
        0,
        i.width,
        i.height,
        0,
        0,
        this._temp_canvas.width,
        this._temp_canvas.height
      ), this._tctx.globalCompositeOperation = "source-over", this._drawFrame = 2;
    }
    this._normalizeFullScreen(t);
  }
  resize(t, e) {
    this._copyCanvas(e), super.resize(t, e);
  }
  detect(t, e, i) {
    return this._detectHelper(this.p, t, e, i, !1);
  }
  init(t, e) {
    this._generateTempCanvas(e), this._normalizeFullScreen(e);
  }
  // draw-methode
  draw(t, e) {
    const i = this.p;
    if (i.enabled) {
      i.gridSize && this._currentGridSize !== i.gridSize && this._copyCanvas(e), this._drawFrame = Math.max(
        this._drawFrame - 1,
        T(i.isDrawFrame, t, e)
      );
      const s = i.width, r = i.height, n = s / 2, o = r / 2, c = this._temp_canvas.width, f = this._temp_canvas.height;
      if (this._drawFrame) {
        this._tctx.textBaseline = "middle", this._tctx.textAlign = "center", this._tctx.globalAlpha = 1, this._tctx.globalCompositeOperation = "source-over", this._tctx.save();
        const p = e.cam;
        if (i.norm && p) {
          const y = Math.max(c, f) / 2;
          this._tctx.translate(c / 2, f / 2), this._tctx.scale(y, y), this._tctx.scale(p.zoom, p.zoom), this._tctx.translate(-p.x, -p.y);
        }
        for (const y of i.sprite)
          y.draw(
            this._tctx,
            i.norm ? Object.assign({}, e, {
              alpha: 1,
              widthInPixel: c,
              heightInPixel: f
            }) : {
              alpha: 1,
              x: 0,
              y: 0,
              width: c,
              height: f,
              widthInPixel: c,
              heightInPixel: f,
              scaleCanvas: 1,
              visibleScreen: {
                x: 0,
                y: 0,
                width: c,
                height: f
              },
              fullScreen: {
                x: 0,
                y: 0,
                width: c,
                height: f
              }
            }
          );
        this._tctx.restore();
      }
      t.save(), t.globalCompositeOperation = i.compositeOperation, t.globalAlpha = i.alpha * e.alpha, t.translate(i.x + n, i.y + o), t.scale(i.scaleX, i.scaleY), t.rotate(i.rotation), t.drawImage(this._temp_canvas, 0, 0, c, f, -n, -o, s, r), t.restore();
    }
  }
}
class we extends Bt {
  constructor(t) {
    super(t.self || {});
    const e = I(T(t.count), 1);
    this.p.sprite = [];
    const i = t.class;
    for (let s = 0; s < e; s++) {
      const r = Object.entries(t).reduce(
        (n, [o, c]) => (["self", "class", "count"].includes(o) || (n[o] = T(c, s)), n),
        {}
      );
      this.p.sprite[s] = new i(r);
    }
  }
}
class xe extends ft {
  _temp_canvas;
  _currentGridSize;
  _tctx;
  constructor(t) {
    super(t);
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
      norm: (t, e) => I(
        T(t),
        T(e.x) === void 0 && T(e.y) === void 0 && T(e.width) === void 0 && T(e.height) === void 0
      ),
      // scalling
      scaleX: (t, e) => I(T(t), I(T(e.scale), 1)),
      scaleY: (t, e) => I(T(t), I(T(e.scale), 1)),
      // alpha
      alpha: 1,
      compositeOperation: "source-over"
    });
  }
  _generateTempCanvas(t) {
    const e = t.widthInPixel, i = t.heightInPixel, s = this.p;
    this._temp_canvas = document.createElement("canvas"), s.gridSize ? (this._currentGridSize = s.gridSize, this._temp_canvas.width = Math.round(this._currentGridSize), this._temp_canvas.height = Math.round(this._currentGridSize)) : (this._temp_canvas.width = Math.ceil(e / s.scaleX), this._temp_canvas.height = Math.ceil(i / s.scaleY)), this._tctx = this._temp_canvas.getContext("2d"), this._tctx.willReadFrequently = !0, this._tctx.globalCompositeOperation = "source-over", this._tctx.globalAlpha = 1;
  }
  normalizeFullScreen(t) {
    const e = this.p;
    (e.norm || e.x === void 0) && (e.x = t.visibleScreen.x), (e.norm || e.y === void 0) && (e.y = t.visibleScreen.y), (e.norm || e.width === void 0) && (e.width = t.visibleScreen.width), (e.norm || e.height === void 0) && (e.height = t.visibleScreen.height);
  }
  resize(t, e) {
    if (this._temp_canvas && this._currentGridSize !== this.p.gridSize) {
      const i = this._temp_canvas;
      this._generateTempCanvas(e), this._tctx.globalCompositeOperation = "copy", this._tctx.drawImage(
        i,
        0,
        0,
        i.width,
        i.height,
        0,
        0,
        this._temp_canvas.width,
        this._temp_canvas.height
      ), this._tctx.globalCompositeOperation = "source-over";
    }
    this.normalizeFullScreen(e);
  }
  detect(t, e, i) {
    return this._detectHelper(this.p, t, e, i, !1);
  }
  init(t, e) {
    this._generateTempCanvas(e), this.normalizeFullScreen(e);
  }
  // draw-methode
  draw(t, e) {
    const i = this.p;
    if (i.enabled && i.alpha > 0) {
      i.gridSize && this._currentGridSize !== i.gridSize && this.resize(void 0, e);
      const s = i.alpha * e.alpha, r = i.width, n = i.height, o = this._temp_canvas.width, c = this._temp_canvas.height;
      if (s > 0 && o && c) {
        this._tctx.globalCompositeOperation = "copy", this._tctx.globalAlpha = 1, this._tctx.drawImage(
          t.canvas,
          0,
          0,
          t.canvas.width,
          t.canvas.height,
          0,
          0,
          o,
          c
        ), i.darker > 0 && (this._tctx.globalCompositeOperation = i.clear ? "source-atop" : "source-over", this._tctx.fillStyle = "rgba(0,0,0," + i.darker + ")", this._tctx.fillRect(0, 0, o, c)), "additionalBlur" in this && typeof this.additionalBlur == "function" && this.additionalBlur(o, c, e), i.clear && (t.globalCompositeOperation = "source-over", t.globalAlpha = 1, t.clearRect(i.x, i.y, r, n)), t.globalCompositeOperation = i.compositeOperation, t.globalAlpha = s;
        const f = t.imageSmoothingEnabled;
        t.imageSmoothingEnabled = !i.pixel, t.drawImage(
          this._temp_canvas,
          0,
          0,
          o,
          c,
          i.x,
          i.y,
          r,
          n
        ), t.imageSmoothingEnabled = f;
      }
    } else
      i.clear && (i.x || (i.x = e.x), i.y || (i.y = e.y), i.width || (i.width = e.width), i.height || (i.height = e.height), t.clearRect(i.x, i.y, i.width, i.height));
  }
}
var st = /* @__PURE__ */ ((a) => (a[a.LEFT_TOP = 0] = "LEFT_TOP", a[a.CENTER = 1] = "CENTER", a))(st || {});
let Le = class extends ft {
  _currentTintKey;
  _normScale;
  _temp_canvas;
  _tctx;
  constructor(t) {
    super(t);
  }
  _getParameterList() {
    return Object.assign({}, super._getParameterList(), It, {
      // set image
      image: (t) => jt.getImage(T(t)),
      // relative position
      position: st.CENTER,
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
  resize(t, e) {
    this._needInit = !0;
  }
  init(t, e) {
    const i = this.p, s = i.frameWidth || i.image.width, r = i.frameHeight || i.image.height;
    this._normScale = i.normToScreen ? i.normCover ? Math.max(
      e.fullScreen.width / s,
      e.fullScreen.height / r
    ) : i.norm ? Math.min(
      e.fullScreen.width / s,
      e.fullScreen.height / r
    ) : 1 : i.normCover ? Math.max(
      e.width / s,
      e.height / r
    ) : i.norm ? Math.min(
      e.width / s,
      e.height / r
    ) : 1;
  }
  _tintCacheKey() {
    const t = this.p.frameWidth || this.p.image.width, e = this.p.frameHeight || this.p.image.height;
    return [
      this.p.tint,
      t,
      e,
      this.p.color,
      this.p.frameX,
      this.p.frameY
    ].join(";");
  }
  _temp_context(t, e) {
    return this._temp_canvas || (this._temp_canvas = document.createElement("canvas"), this._tctx = this._temp_canvas.getContext("2d")), this._temp_canvas.width = t, this._temp_canvas.height = e, this._tctx;
  }
  detectDraw(t, e) {
    const i = this.p;
    if (i.enabled && i.isClickable && i.clickExact) {
      const s = i.frameWidth || i.image.width, r = i.frameHeight || i.image.height, n = (i.width ? i.width : s) * this._normScale * i.scaleX, o = (i.height ? i.height : r) * this._normScale * i.scaleY, c = i.position === st.LEFT_TOP, f = this._temp_context(s, r);
      f.globalAlpha = 1, f.globalCompositeOperation = "source-over", f.fillStyle = e, f.fillRect(0, 0, s, r), f.globalCompositeOperation = "destination-atop", f.drawImage(
        i.image,
        i.frameX,
        i.frameY,
        s,
        r,
        0,
        0,
        s,
        r
      ), t.save(), t.translate(i.x, i.y), t.scale(i.scaleX, i.scaleY), t.rotate(i.rotation), t.drawImage(
        this._temp_canvas,
        0,
        0,
        s,
        r,
        c ? 0 : -n / 2,
        c ? 0 : -o / 2,
        n,
        o
      ), t.restore(), this._currentTintKey = void 0;
    }
  }
  detect(t, e, i) {
    return this.p.enabled && this.p.isClickable && this.p.clickExact ? "c" : this._detectHelper(this.p, t, e, i, !1);
  }
  // Draw-Funktion
  draw(t, e) {
    const i = this.p;
    if (i.enabled && i.image && i.alpha > 0) {
      const s = i.frameWidth || i.image.width, r = i.frameHeight || i.image.height, n = (i.width ? i.width : s) * this._normScale * i.scaleX, o = (i.height ? i.height : r) * this._normScale * i.scaleY;
      t.globalCompositeOperation = i.compositeOperation, t.globalAlpha = i.alpha * e.alpha;
      const c = i.position !== st.LEFT_TOP;
      let f = i.image, p = i.frameX, y = i.frameY;
      if (i.tint) {
        const X = this._tintCacheKey();
        if (this._currentTintKey !== X) {
          const D = this._temp_context(s, r);
          D.globalAlpha = 1, D.globalCompositeOperation = "source-over", D.clearRect(0, 0, s, r), D.globalAlpha = i.tint, D.fillStyle = i.color, D.fillRect(0, 0, s, r), D.globalAlpha = 1, D.globalCompositeOperation = "destination-atop", D.drawImage(
            i.image,
            i.frameX,
            i.frameY,
            s,
            r,
            0,
            0,
            s,
            r
          ), this._currentTintKey = X;
        }
        f = this._temp_canvas, p = 0, y = 0;
      }
      let k = 0, C = 0;
      c && (k = -n / 2, C = -o / 2), i.rotation == 0 ? t.drawImage(
        f,
        p,
        y,
        s,
        r,
        i.x + k,
        i.y + C,
        n,
        o
      ) : (t.save(), t.translate(i.x, i.y), t.rotate(i.rotation), t.drawImage(
        f,
        p,
        y,
        s,
        r,
        k,
        C,
        n,
        o
      ), t.restore());
    }
  }
};
class Te extends ft {
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
          const e = T(t);
          return (Array.isArray(e) ? e.join("") : e) || "";
        },
        font: "2em monospace",
        position: st.CENTER,
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
  Ne(a) && (a = "100%");
  var e = Xe(a);
  return a = t === 360 ? a : Math.min(t, Math.max(0, parseFloat(a))), e && (a = parseInt(String(a * t), 10) / 100), Math.abs(a - t) < 1e-6 ? 1 : (t === 360 ? a = (a < 0 ? a % t + t : a % t) / parseFloat(String(t)) : a = a % t / parseFloat(String(t)), a);
}
function Xt(a) {
  return Math.min(1, Math.max(0, a));
}
function Ne(a) {
  return typeof a == "string" && a.indexOf(".") !== -1 && parseFloat(a) === 1;
}
function Xe(a) {
  return typeof a == "string" && a.indexOf("%") !== -1;
}
function Se(a) {
  return a = parseFloat(a), (isNaN(a) || a < 0 || a > 1) && (a = 1), a;
}
function Ht(a) {
  return a <= 1 ? "".concat(Number(a) * 100, "%") : a;
}
function gt(a) {
  return a.length === 1 ? "0" + a : String(a);
}
function He(a, t, e) {
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
    var c = i - s;
    switch (n = o > 0.5 ? c / (2 - i - s) : c / (i + s), i) {
      case a:
        r = (t - e) / c + (t < e ? 6 : 0);
        break;
      case t:
        r = (e - a) / c + 2;
        break;
      case e:
        r = (a - t) / c + 4;
        break;
    }
    r /= 6;
  }
  return { h: r, s: n, l: o };
}
function Kt(a, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? a + (t - a) * (6 * e) : e < 1 / 2 ? t : e < 2 / 3 ? a + (t - a) * (2 / 3 - e) * 6 : a;
}
function je(a, t, e) {
  var i, s, r;
  if (a = q(a, 360), t = q(t, 100), e = q(e, 100), t === 0)
    s = e, r = e, i = e;
  else {
    var n = e < 0.5 ? e * (1 + t) : e + t - e * t, o = 2 * e - n;
    i = Kt(o, n, a + 1 / 3), s = Kt(o, n, a), r = Kt(o, n, a - 1 / 3);
  }
  return { r: i * 255, g: s * 255, b: r * 255 };
}
function oe(a, t, e) {
  a = q(a, 255), t = q(t, 255), e = q(e, 255);
  var i = Math.max(a, t, e), s = Math.min(a, t, e), r = 0, n = i, o = i - s, c = i === 0 ? 0 : o / i;
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
  return { h: r, s: c, v: n };
}
function Ye(a, t, e) {
  a = q(a, 360) * 6, t = q(t, 100), e = q(e, 100);
  var i = Math.floor(a), s = a - i, r = e * (1 - t), n = e * (1 - s * t), o = e * (1 - (1 - s) * t), c = i % 6, f = [e, n, r, r, o, e][c], p = [o, e, e, n, r, r][c], y = [r, r, o, e, e, n][c];
  return { r: f * 255, g: p * 255, b: y * 255 };
}
function he(a, t, e, i) {
  var s = [
    gt(Math.round(a).toString(16)),
    gt(Math.round(t).toString(16)),
    gt(Math.round(e).toString(16))
  ];
  return i && s[0].startsWith(s[0].charAt(1)) && s[1].startsWith(s[1].charAt(1)) && s[2].startsWith(s[2].charAt(1)) ? s[0].charAt(0) + s[1].charAt(0) + s[2].charAt(0) : s.join("");
}
function Be(a, t, e, i, s) {
  var r = [
    gt(Math.round(a).toString(16)),
    gt(Math.round(t).toString(16)),
    gt(Math.round(e).toString(16)),
    gt(qe(i))
  ];
  return s && r[0].startsWith(r[0].charAt(1)) && r[1].startsWith(r[1].charAt(1)) && r[2].startsWith(r[2].charAt(1)) && r[3].startsWith(r[3].charAt(1)) ? r[0].charAt(0) + r[1].charAt(0) + r[2].charAt(0) + r[3].charAt(0) : r.join("");
}
function qe(a) {
  return Math.round(parseFloat(a) * 255).toString(16);
}
function le(a) {
  return Z(a) / 255;
}
function Z(a) {
  return parseInt(a, 16);
}
function We(a) {
  return {
    r: a >> 16,
    g: (a & 65280) >> 8,
    b: a & 255
  };
}
var te = {
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
function Ue(a) {
  var t = { r: 0, g: 0, b: 0 }, e = 1, i = null, s = null, r = null, n = !1, o = !1;
  return typeof a == "string" && (a = $e(a)), typeof a == "object" && (lt(a.r) && lt(a.g) && lt(a.b) ? (t = He(a.r, a.g, a.b), n = !0, o = String(a.r).substr(-1) === "%" ? "prgb" : "rgb") : lt(a.h) && lt(a.s) && lt(a.v) ? (i = Ht(a.s), s = Ht(a.v), t = Ye(a.h, i, s), n = !0, o = "hsv") : lt(a.h) && lt(a.s) && lt(a.l) && (i = Ht(a.s), r = Ht(a.l), t = je(a.h, i, r), n = !0, o = "hsl"), Object.prototype.hasOwnProperty.call(a, "a") && (e = a.a)), e = Se(e), {
    ok: n,
    format: a.format || o,
    r: Math.min(255, Math.max(t.r, 0)),
    g: Math.min(255, Math.max(t.g, 0)),
    b: Math.min(255, Math.max(t.b, 0)),
    a: e
  };
}
var Ve = "[-\\+]?\\d+%?", Ge = "[-\\+]?\\d*\\.\\d+%?", mt = "(?:".concat(Ge, ")|(?:").concat(Ve, ")"), Jt = "[\\s|\\(]+(".concat(mt, ")[,|\\s]+(").concat(mt, ")[,|\\s]+(").concat(mt, ")\\s*\\)?"), Qt = "[\\s|\\(]+(".concat(mt, ")[,|\\s]+(").concat(mt, ")[,|\\s]+(").concat(mt, ")[,|\\s]+(").concat(mt, ")\\s*\\)?"), it = {
  CSS_UNIT: new RegExp(mt),
  rgb: new RegExp("rgb" + Jt),
  rgba: new RegExp("rgba" + Qt),
  hsl: new RegExp("hsl" + Jt),
  hsla: new RegExp("hsla" + Qt),
  hsv: new RegExp("hsv" + Jt),
  hsva: new RegExp("hsva" + Qt),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
function $e(a) {
  if (a = a.trim().toLowerCase(), a.length === 0)
    return !1;
  var t = !1;
  if (te[a])
    a = te[a], t = !0;
  else if (a === "transparent")
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  var e = it.rgb.exec(a);
  return e ? { r: e[1], g: e[2], b: e[3] } : (e = it.rgba.exec(a), e ? { r: e[1], g: e[2], b: e[3], a: e[4] } : (e = it.hsl.exec(a), e ? { h: e[1], s: e[2], l: e[3] } : (e = it.hsla.exec(a), e ? { h: e[1], s: e[2], l: e[3], a: e[4] } : (e = it.hsv.exec(a), e ? { h: e[1], s: e[2], v: e[3] } : (e = it.hsva.exec(a), e ? { h: e[1], s: e[2], v: e[3], a: e[4] } : (e = it.hex8.exec(a), e ? {
    r: Z(e[1]),
    g: Z(e[2]),
    b: Z(e[3]),
    a: le(e[4]),
    format: t ? "name" : "hex8"
  } : (e = it.hex6.exec(a), e ? {
    r: Z(e[1]),
    g: Z(e[2]),
    b: Z(e[3]),
    format: t ? "name" : "hex"
  } : (e = it.hex4.exec(a), e ? {
    r: Z(e[1] + e[1]),
    g: Z(e[2] + e[2]),
    b: Z(e[3] + e[3]),
    a: le(e[4] + e[4]),
    format: t ? "name" : "hex8"
  } : (e = it.hex3.exec(a), e ? {
    r: Z(e[1] + e[1]),
    g: Z(e[2] + e[2]),
    b: Z(e[3] + e[3]),
    format: t ? "name" : "hex"
  } : !1)))))))));
}
function lt(a) {
  return !!it.CSS_UNIT.exec(String(a));
}
var zt = (
  /** @class */
  function() {
    function a(t, e) {
      t === void 0 && (t = ""), e === void 0 && (e = {});
      var i;
      if (t instanceof a)
        return t;
      typeof t == "number" && (t = We(t)), this.originalInput = t;
      var s = Ue(t);
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
      return t === void 0 && (t = !1), Be(this.r, this.g, this.b, this.a, t);
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
      for (var t = "#" + he(this.r, this.g, this.b, !1), e = 0, i = Object.entries(te); e < i.length; e++) {
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
const ct = 64, H = 4, kt = ct >> 1;
class ut extends ft {
  _currentScaleX;
  _currentPixelSmoothing = !1;
  static _Gradient;
  constructor(t) {
    super(t);
  }
  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      x: 0,
      y: 0,
      // scalling
      scaleX: (t, e) => I(T(t), I(T(e.scale), 1)),
      scaleY: (t, e) => I(T(t), I(T(e.scale), 1)),
      color: "#FFF",
      alpha: 1,
      compositeOperation: "source-over"
    });
  }
  static getGradientImage(t, e, i) {
    const s = t >> H, r = e >> H, n = i >> H;
    if (!ut._Gradient) {
      const o = 256 >> H;
      ut._Gradient = Array.from(
        { length: o },
        (c) => Array.from({ length: o }, (f) => Array.from({ length: o }))
      );
    }
    return ut._Gradient[s][r][n] || (ut._Gradient[s][r][n] = ut.generateGradientImage(
      s,
      r,
      n
    )), ut._Gradient[s][r][n];
  }
  static generateGradientImage(t, e, i) {
    const s = document.createElement("canvas");
    s.width = s.height = ct;
    const r = s.getContext("2d");
    r.globalAlpha = 1, r.globalCompositeOperation = "source-over", r.clearRect(0, 0, ct, ct);
    const n = r.createRadialGradient(
      kt,
      kt,
      0,
      kt,
      kt,
      kt
    );
    return n.addColorStop(
      0,
      "rgba(" + ((t << H) + (1 << H) - 1) + "," + ((e << H) + (1 << H) - 1) + "," + ((i << H) + (1 << H) - 1) + ",1)"
    ), n.addColorStop(
      0.3,
      "rgba(" + ((t << H) + (1 << H) - 1) + "," + ((e << H) + (1 << H) - 1) + "," + ((i << H) + (1 << H) - 1) + ",0.4)"
    ), n.addColorStop(
      1,
      "rgba(" + ((t << H) + (1 << H) - 1) + "," + ((e << H) + (1 << H) - 1) + "," + ((i << H) + (1 << H) - 1) + ",0)"
    ), r.fillStyle = n, r.fillRect(0, 0, ct, ct), s;
  }
  resize(t, e) {
    this._currentScaleX = void 0;
  }
  // draw-methode
  draw(t, e) {
    const i = this.p;
    if (i.enabled && i.alpha > 0) {
      (!i.color || !i.color.r) && (i.color = new zt(i.color).toRgb()), this._currentScaleX !== i.scaleX && (this._currentScaleX = i.scaleX, this._currentPixelSmoothing = i.scaleX * e.widthInPixel / e.width > ct);
      const { r: s, g: r, b: n } = i.color;
      t.globalCompositeOperation = i.compositeOperation, t.globalAlpha = i.alpha * e.alpha, t.imageSmoothingEnabled = this._currentPixelSmoothing, t.drawImage(
        ut.getGradientImage(s, r, n),
        0,
        0,
        ct,
        ct,
        i.x - i.scaleX / 2,
        i.y - i.scaleY / 2,
        i.scaleX,
        i.scaleY
      ), t.imageSmoothingEnabled = !0;
    }
  }
}
var Ze = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ce(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
var Yt = { exports: {} };
Yt.exports;
(function(a, t) {
  (function(e, i) {
    a.exports = i();
  })(Ze, function() {
    var e = /* @__PURE__ */ function() {
      function m(d, l) {
        var h = [], _ = !0, g = !1, b = void 0;
        try {
          for (var v = d[Symbol.iterator](), w; !(_ = (w = v.next()).done) && (h.push(w.value), !(l && h.length === l)); _ = !0)
            ;
        } catch (M) {
          g = !0, b = M;
        } finally {
          try {
            !_ && v.return && v.return();
          } finally {
            if (g) throw b;
          }
        }
        return h;
      }
      return function(d, l) {
        if (Array.isArray(d))
          return d;
        if (Symbol.iterator in Object(d))
          return m(d, l);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      };
    }(), i = Math.PI * 2, s = function(d, l, h, _, g, b, v) {
      var w = d.x, M = d.y;
      w *= l, M *= h;
      var P = _ * w - g * M, F = g * w + _ * M;
      return {
        x: P + b,
        y: F + v
      };
    }, r = function(d, l) {
      var h = 1.3333333333333333 * Math.tan(l / 4), _ = Math.cos(d), g = Math.sin(d), b = Math.cos(d + l), v = Math.sin(d + l);
      return [{
        x: _ - g * h,
        y: g + _ * h
      }, {
        x: b + v * h,
        y: v - b * h
      }, {
        x: b,
        y: v
      }];
    }, n = function(d, l, h, _) {
      var g = d * _ - l * h < 0 ? -1 : 1, b = Math.sqrt(d * d + l * l), v = Math.sqrt(d * d + l * l), w = d * h + l * _, M = w / (b * v);
      return M > 1 && (M = 1), M < -1 && (M = -1), g * Math.acos(M);
    }, o = function(d, l, h, _, g, b, v, w, M, P, F, R) {
      var A = Math.pow(g, 2), L = Math.pow(b, 2), u = Math.pow(F, 2), Y = Math.pow(R, 2), x = A * L - A * Y - L * u;
      x < 0 && (x = 0), x /= A * Y + L * u, x = Math.sqrt(x) * (v === w ? -1 : 1);
      var z = x * g / b * R, B = x * -b / g * F, Q = P * z - M * B + (d + h) / 2, $ = M * z + P * B + (l + _) / 2, at = (F - z) / g, rt = (R - B) / b, J = (-F - z) / g, tt = (-R - B) / b, pt = n(1, 0, at, rt), et = n(at, rt, J, tt);
      return w === 0 && et > 0 && (et -= i), w === 1 && et < 0 && (et += i), [Q, $, pt, et];
    }, c = function(d) {
      var l = d.px, h = d.py, _ = d.cx, g = d.cy, b = d.rx, v = d.ry, w = d.xAxisRotation, M = w === void 0 ? 0 : w, P = d.largeArcFlag, F = P === void 0 ? 0 : P, R = d.sweepFlag, A = R === void 0 ? 0 : R, L = [];
      if (b === 0 || v === 0)
        return [];
      var u = Math.sin(M * i / 360), Y = Math.cos(M * i / 360), x = Y * (l - _) / 2 + u * (h - g) / 2, z = -u * (l - _) / 2 + Y * (h - g) / 2;
      if (x === 0 && z === 0)
        return [];
      b = Math.abs(b), v = Math.abs(v);
      var B = Math.pow(x, 2) / Math.pow(b, 2) + Math.pow(z, 2) / Math.pow(v, 2);
      B > 1 && (b *= Math.sqrt(B), v *= Math.sqrt(B));
      var Q = o(l, h, _, g, b, v, F, A, u, Y, x, z), $ = e(Q, 4), at = $[0], rt = $[1], J = $[2], tt = $[3], pt = Math.max(Math.ceil(Math.abs(tt) / (i / 4)), 1);
      tt /= pt;
      for (var et = 0; et < pt; et++)
        L.push(r(J, tt)), J += tt;
      return L.map(function(bt) {
        var Ct = s(bt[0], b, v, Y, u, at, rt), dt = Ct.x, ot = Ct.y, nt = s(bt[1], b, v, Y, u, at, rt), ht = nt.x, W = nt.y, wt = s(bt[2], b, v, Y, u, at, rt), Mt = wt.x, Et = wt.y;
        return { x1: dt, y1: ot, x2: ht, y2: W, x: Mt, y: Et };
      });
    }, f = {
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
    }, p = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
    function y(m) {
      var d = [];
      return m.replace(p, function(l, h, _) {
        var g = h.toLowerCase();
        for (_ = C(_), g == "m" && _.length > 2 && (d.push([h].concat(_.splice(0, 2))), g = "l", h = h == "m" ? "l" : "L"); ; ) {
          if (_.length == f[g])
            return _.unshift(h), d.push(_);
          if (_.length < f[g]) throw new Error("malformed path data");
          d.push([h].concat(_.splice(0, f[g])));
        }
      }), d;
    }
    var k = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
    function C(m) {
      var d = m.match(k);
      return d ? d.map(Number) : [];
    }
    function X(m) {
      var d = m[0][0], l = m[0][1], h = d, _ = l;
      return m.forEach(function(g) {
        var b = g[0], v = g[2], w = g[4], M = g[6], P = g[1], F = g[3], R = g[5], A = g[7];
        d = Math.min(d, b, v, w, M), l = Math.min(l, P, F, R, A), h = Math.max(h, b, v, w, M), _ = Math.max(_, P, F, R, A);
      }), [d, l, h, _];
    }
    function D(m, d) {
      return Math.sqrt(Math.pow(m[0] - d[0], 2) + Math.pow(m[1] - d[1], 2)) + Math.sqrt(Math.pow(m[2] - d[2], 2) + Math.pow(m[3] - d[3], 2));
    }
    function E(m, d) {
      var l = m[0], h = m[2], _ = m[4], g = m[6], b = m[1], v = m[3], w = m[5], M = m[7], P = d[0], F = d[2], R = d[4], A = d[6], L = d[1], u = d[3], Y = d[5], x = d[7];
      return Math.sqrt(Math.pow(P - l, 2) + Math.pow(L - b, 2)) + Math.sqrt(Math.pow(F - h, 2) + Math.pow(u - v, 2)) + Math.sqrt(Math.pow(R - _, 2) + Math.pow(Y - w, 2)) + Math.sqrt(Math.pow(A - g, 2) + Math.pow(x - M, 2));
    }
    function N(m, d) {
      var l = O(m.length), h = [];
      l.forEach(function(g) {
        var b = 0, v = 0;
        g.forEach(function(w) {
          b += E(m[w], d[v++]);
        }), h.push({ index: g, distance: b });
      }), h.sort(function(g, b) {
        return g.distance - b.distance;
      });
      var _ = [];
      return h[0].index.forEach(function(g) {
        _.push(m[g]);
      }), _;
    }
    function U(m, d) {
      var l = j(m.length), h = [];
      l.forEach(function(g) {
        var b = 0;
        g.forEach(function(v) {
          b += D(X(m[v]), X(d[v]));
        }), h.push({ index: g, distance: b });
      }), h.sort(function(g, b) {
        return g.distance - b.distance;
      });
      var _ = [];
      return h[0].index.forEach(function(g) {
        _.push(m[g]);
      }), _;
    }
    function O(m) {
      for (var d = [], l = 0; l < m; l++) {
        for (var h = [], _ = 0; _ < m; _++) {
          var g = _ + l;
          g > m - 1 && (g -= m), h[g] = _;
        }
        d.push(h);
      }
      return d;
    }
    function j(m) {
      for (var d = [], l = 0; l < m; l++)
        d.push(l);
      return V(d);
    }
    function V(m) {
      var d = [], l = [];
      function h(_) {
        var g, b;
        for (g = 0; g < _.length; g++)
          b = _.splice(g, 1)[0], l.push(b), _.length == 0 && d.push(l.slice()), h(_), _.splice(g, 0, b), l.pop();
        return d;
      }
      return h(m);
    }
    var S = {};
    S.parser = y, S.lerpCurve = function(m, d, l) {
      return S.lerpPoints(m[0], m[1], d[0], d[1], l).concat(S.lerpPoints(m[2], m[3], d[2], d[3], l)).concat(S.lerpPoints(m[4], m[5], d[4], d[5], l)).concat(S.lerpPoints(m[6], m[7], d[6], d[7], l));
    }, S.lerpPoints = function(m, d, l, h, _) {
      return [m + (l - m) * _, d + (h - d) * _];
    }, S.q2b = function(m, d, l, h, _, g) {
      return [m, d, (m + 2 * l) / 3, (d + 2 * h) / 3, (_ + 2 * l) / 3, (g + 2 * h) / 3, _, g];
    }, S.path2shapes = function(m) {
      for (var d = S.parser(m), l = 0, h = 0, _ = 0, g = d.length, b = [], v = null, w = void 0, M = void 0, P = void 0, F = void 0, R = void 0, A = void 0, L = void 0; _ < g; _++) {
        var u = d[_], Y = u[0], x = d[_ - 1];
        switch (Y) {
          case "m":
            R = b.length, b[R] = [], v = b[R], l = l + u[1], h = h + u[2];
            break;
          case "M":
            R = b.length, b[R] = [], v = b[R], l = u[1], h = u[2];
            break;
          case "l":
            v.push([l, h, l, h, l, h, l + u[1], h + u[2]]), l += u[1], h += u[2];
            break;
          case "L":
            v.push([l, h, u[1], u[2], u[1], u[2], u[1], u[2]]), l = u[1], h = u[2];
            break;
          case "h":
            v.push([l, h, l, h, l, h, l + u[1], h]), l += u[1];
            break;
          case "H":
            v.push([l, h, u[1], h, u[1], h, u[1], h]), l = u[1];
            break;
          case "v":
            v.push([l, h, l, h, l, h, l, h + u[1]]), h += u[1];
            break;
          case "V":
            v.push([l, h, l, u[1], l, u[1], l, u[1]]), h = u[1];
            break;
          case "C":
            v.push([l, h, u[1], u[2], u[3], u[4], u[5], u[6]]), l = u[5], h = u[6];
            break;
          case "S":
            x[0] === "C" || x[0] === "c" ? v.push([l, h, l + x[5] - x[3], h + x[6] - x[4], u[1], u[2], u[3], u[4]]) : (x[0] === "S" || x[0] === "s") && v.push([l, h, l + x[3] - x[1], h + x[4] - x[2], u[1], u[2], u[3], u[4]]), l = u[3], h = u[4];
            break;
          case "c":
            v.push([l, h, l + u[1], h + u[2], l + u[3], h + u[4], l + u[5], h + u[6]]), l = l + u[5], h = h + u[6];
            break;
          case "s":
            x[0] === "C" || x[0] === "c" ? v.push([l, h, l + x[5] - x[3], h + x[6] - x[4], l + u[1], h + u[2], l + u[3], h + u[4]]) : (x[0] === "S" || x[0] === "s") && v.push([l, h, l + x[3] - x[1], h + x[4] - x[2], l + u[1], h + u[2], l + u[3], h + u[4]]), l = l + u[3], h = h + u[4];
            break;
          case "a":
            A = c({
              rx: u[1],
              ry: u[2],
              px: l,
              py: h,
              xAxisRotation: u[3],
              largeArcFlag: u[4],
              sweepFlag: u[5],
              cx: l + u[6],
              cy: h + u[7]
            }), L = A[A.length - 1], A.forEach(function(z, B) {
              B === 0 ? v.push([l, h, z.x1, z.y1, z.x2, z.y2, z.x, z.y]) : v.push([A[B - 1].x, A[B - 1].y, z.x1, z.y1, z.x2, z.y2, z.x, z.y]);
            }), l = L.x, h = L.y;
            break;
          case "A":
            A = c({
              rx: u[1],
              ry: u[2],
              px: l,
              py: h,
              xAxisRotation: u[3],
              largeArcFlag: u[4],
              sweepFlag: u[5],
              cx: u[6],
              cy: u[7]
            }), L = A[A.length - 1], A.forEach(function(z, B) {
              B === 0 ? v.push([l, h, z.x1, z.y1, z.x2, z.y2, z.x, z.y]) : v.push([A[B - 1].x, A[B - 1].y, z.x1, z.y1, z.x2, z.y2, z.x, z.y]);
            }), l = L.x, h = L.y;
            break;
          case "Q":
            v.push(S.q2b(l, h, u[1], u[2], u[3], u[4])), l = u[3], h = u[4];
            break;
          case "q":
            v.push(S.q2b(l, h, l + u[1], h + u[2], u[3] + l, u[4] + h)), l += u[3], h += u[4];
            break;
          case "T":
            x[0] === "Q" || x[0] === "q" ? (P = l + x[3] - x[1], F = h + x[4] - x[2], v.push(S.q2b(l, h, P, F, u[1], u[2]))) : (x[0] === "T" || x[0] === "t") && (v.push(S.q2b(l, h, l + l - P, h + h - F, u[1], u[2])), P = l + l - P, F = h + h - F), l = u[1], h = u[2];
            break;
          case "t":
            x[0] === "Q" || x[0] === "q" ? (P = l + x[3] - x[1], F = h + x[4] - x[2], v.push(S.q2b(l, h, P, F, l + u[1], h + u[2]))) : (x[0] === "T" || x[0] === "t") && (v.push(S.q2b(l, h, l + l - P, h + h - F, l + u[1], h + u[2])), P = l + l - P, F = h + h - F), l += u[1], h += u[2];
            break;
          case "Z":
            w = v[0][0], M = v[0][1], v.push([l, h, w, M, w, M, w, M]);
            break;
          case "z":
            w = v[0][0], M = v[0][1], v.push([l, h, w, M, w, M, w, M]);
            break;
        }
      }
      return b;
    }, S._upCurves = function(m, d) {
      for (var l = 0, h = 0, _ = m.length; l < d; l++)
        m.push(m[h].slice(0)), h++, h > _ - 1 && (h -= _);
    };
    function K(m, d, l, h, _, g, b, v, w) {
      return {
        left: vt(m, d, l, h, _, g, b, v, w),
        right: vt(b, v, _, g, l, h, m, d, 1 - w, !0)
      };
    }
    function vt(m, d, l, h, _, g, b, v, w, M) {
      var P = (l - m) * w + m, F = (h - d) * w + d, R = (_ - l) * w + l, A = (g - h) * w + h, L = (b - _) * w + _, u = (v - g) * w + g, Y = (R - P) * w + P, x = (A - F) * w + F, z = (L - R) * w + R, B = (u - A) * w + A, Q = (z - Y) * w + Y, $ = (B - x) * w + x;
      return M ? [Q, $, Y, x, P, F, m, d] : [m, d, P, F, Y, x, Q, $];
    }
    S._splitCurves = function(m, d) {
      for (var l = 0, h = 0; l < d; l++) {
        var _ = m[h], g = K(_[0], _[1], _[2], _[3], _[4], _[5], _[6], _[7], 0.5);
        m.splice(h, 1), m.splice(h, 0, g.left, g.right), h += 2, h >= m.length - 1 && (h = 0);
      }
    };
    function yt(m, d) {
      for (var l = function(g) {
        var b = m[m.length - 1], v = [];
        b.forEach(function(w) {
          v.push(w.slice(0));
        }), m.push(v);
      }, h = 0; h < d; h++)
        l(h);
    }
    return S.lerp = function(m, d, l) {
      return S._lerp(S.path2shapes(m), S.path2shapes(d), l);
    }, S.MIM_CURVES_COUNT = 100, S._preprocessing = function(m, d) {
      var l = m.length, h = d.length, _ = JSON.parse(JSON.stringify(m)), g = JSON.parse(JSON.stringify(d));
      return l > h ? yt(g, l - h) : l < h && yt(_, h - l), _ = U(_, g), _.forEach(function(b, v) {
        var w = b.length, M = g[v].length;
        w > M ? w < S.MIM_CURVES_COUNT ? (S._splitCurves(b, S.MIM_CURVES_COUNT - w), S._splitCurves(g[v], S.MIM_CURVES_COUNT - M)) : S._splitCurves(g[v], w - M) : w < M && (M < S.MIM_CURVES_COUNT ? (S._splitCurves(b, S.MIM_CURVES_COUNT - w), S._splitCurves(g[v], S.MIM_CURVES_COUNT - M)) : S._splitCurves(b, M - w));
      }), _.forEach(function(b, v) {
        _[v] = N(b, g[v]);
      }), [_, g];
    }, S._lerp = function(m, d, l) {
      var h = [];
      return m.forEach(function(_, g) {
        var b = [];
        _.forEach(function(v, w) {
          b.push(S.lerpCurve(v, d[g][w], l));
        }), h.push(b);
      }), h;
    }, S.animate = function(m) {
      var d = S.path2shapes(m.from), l = S.path2shapes(m.to), h = S._preprocessing(d, l), _ = /* @__PURE__ */ new Date(), g = m.end || function() {
      }, b = m.progress || function() {
      }, v = m.begin || function() {
      }, w = m.easing || function(A) {
        return A;
      }, M = null, P = null, F = m.time;
      v(d);
      var R = function A() {
        var L = /* @__PURE__ */ new Date() - _;
        if (L >= F) {
          P = l, b(P, 1), g(P), cancelAnimationFrame(M);
          return;
        }
        var u = w(L / F);
        P = S._lerp(h[0], h[1], u), b(P, u), M = requestAnimationFrame(A);
      };
      R();
    }, S;
  });
})(Yt, Yt.exports);
var Ke = Yt.exports;
const Pt = /* @__PURE__ */ Ce(Ke);
class Je extends Bt {
  _oldPath;
  _path2D = new Path2D();
  constructor(t) {
    if (super(t), this.p.polyfill)
      if (typeof Path2D != "function") {
        const e = document.getElementsByTagName("head")[0], i = document.createElement("script");
        i.type = "text/javascript", i.src = "https://cdn.jsdelivr.net/npm/canvas-5-polyfill@0.1.5/canvas.min.js", e.appendChild(i);
      } else {
        const e = document.createElement("canvas").getContext("2d");
        e.stroke(new Path2D("M0,0H1")), e.getImageData(0, 0, 1, 1).data[3] && (this.p.polyfill = !1);
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
  changeToPathInit(t, e) {
    return Pt._preprocessing(
      typeof t == "string" ? Pt.path2shapes(t) : Array.isArray(t) ? t : [],
      typeof e == "string" ? Pt.path2shapes(e) : Array.isArray(e) ? e : []
    );
  }
  changeToPath(t, e) {
    return Pt._lerp(e.pathFrom, e.pathTo, t);
  }
  detect(t, e, i) {
    return this._detectHelper(this.p, t, e, i, !1, () => t.isPointInPath(this._path2D, e, i));
  }
  // draw-methode
  draw(t, e) {
    const i = this.p;
    if (i.enabled) {
      const s = i.alpha * e.alpha;
      this._oldPath !== i.path && (i.polyfill && typeof i.path == "string" && (i.path = Pt.path2shapes(i.path)), Array.isArray(i.path) ? (this._path2D = new Path2D(), i.path.forEach((o) => {
        this._path2D.moveTo(o[0][0], o[0][1]), o.forEach((c) => {
          this._path2D.bezierCurveTo(
            c[2],
            c[3],
            c[4],
            c[5],
            c[6],
            c[7]
          );
        }), this._path2D.closePath();
      })) : i.path instanceof Path2D ? this._path2D = i.path : this._path2D = new Path2D(i.path), this._oldPath = i.path);
      let r = i.scaleX, n = i.scaleY;
      i.fixed && (r == 0 && (r = Number.EPSILON), n == 0 && (n = Number.EPSILON)), t.globalCompositeOperation = i.compositeOperation, t.globalAlpha = s, t.save(), t.translate(i.x, i.y), t.scale(r, n), t.rotate(i.rotation), i.color && (t.fillStyle = i.color, t.fill(this._path2D)), t.save(), i.clip && (t.clip(this._path2D), i.fixed && (t.rotate(-i.rotation), t.scale(1 / r, 1 / n), t.translate(-i.x, -i.y)));
      for (const o of i.sprite)
        o.draw(t, e);
      t.restore(), i.borderColor && (t.strokeStyle = i.borderColor, t.lineWidth = i.lineWidth, t.stroke(this._path2D)), t.restore();
    }
  }
}
class Qe extends ft {
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
      norm: (t, e) => I(
        T(t),
        T(e.x) === void 0 && T(e.y) === void 0 && T(e.width) === void 0 && T(e.height) === void 0
      ),
      // relative position
      position: st.CENTER
    });
  }
  _normalizeFullScreen(t) {
    (this.p.norm || this.p.width === void 0) && (this.p.width = t.visibleScreen.width), (this.p.norm || this.p.height === void 0) && (this.p.height = t.visibleScreen.height), (this.p.norm || this.p.x === void 0) && (this.p.x = t.visibleScreen.x, this.p.position === st.CENTER && (this.p.x += this.p.width / 2)), (this.p.norm || this.p.y === void 0) && (this.p.y = t.visibleScreen.y, this.p.position === st.CENTER && (this.p.y += this.p.height / 2));
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
      this.p.position === st.LEFT_TOP
    );
  }
  // Draw-Funktion
  draw(t, e) {
    const i = this.p;
    if (i.enabled && i.alpha > 0)
      if (t.globalCompositeOperation = i.compositeOperation, t.globalAlpha = i.alpha * e.alpha, i.rotation === 0 && i.position === st.LEFT_TOP)
        i.clear ? t.clearRect(i.x, i.y, i.width, i.height) : i.color && (t.fillStyle = i.color, t.fillRect(i.x, i.y, i.width, i.height)), i.borderColor && (t.beginPath(), t.lineWidth = i.lineWidth, t.strokeStyle = i.borderColor, t.rect(i.x, i.y, i.width, i.height), t.stroke());
      else {
        const s = i.width / 2, r = i.height / 2;
        t.save(), i.position === st.LEFT_TOP ? t.translate(i.x + s, i.y + r) : t.translate(i.x, i.y), t.scale(i.scaleX, i.scaleY), t.rotate(i.rotation), i.clear ? t.clearRect(-s, -r, i.width, i.height) : i.color && (t.fillStyle = i.color, t.fillRect(-s, -r, i.width, i.height)), i.borderColor && (t.beginPath(), t.lineWidth = i.lineWidth, t.strokeStyle = i.borderColor, t.rect(-s, -r, i.width, i.height), t.stroke()), t.restore();
      }
  }
}
class ti extends we {
  constructor(t) {
    const e = T(t.text), i = Array.isArray(e) ? e : [...e];
    super(
      Object.assign({}, t, {
        class: Te,
        count: i.length,
        text: (s) => i[s],
        enabled: (s) => i[s] !== " " && T(t.enabled)
      })
    );
  }
}
function ei(a, t) {
  if (!(a instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
var ii = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259], si = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
function ce(a, t, e, i, s, r) {
  for (var n = a.data, o = 2 * r + 1, c = i - 1, f = s - 1, p = r + 1, y = p * (p + 1) / 2, k = new ue(), C = k, X, D = 1; D < o; D++)
    C = C.next = new ue(), D === p && (X = C);
  C.next = k;
  for (var E = null, N = null, U = 0, O = 0, j = ii[r], V = si[r], S = 0; S < s; S++) {
    C = k;
    for (var K = n[O], vt = n[O + 1], yt = n[O + 2], m = n[O + 3], d = 0; d < p; d++)
      C.r = K, C.g = vt, C.b = yt, C.a = m, C = C.next;
    for (var l = 0, h = 0, _ = 0, g = 0, b = p * K, v = p * vt, w = p * yt, M = p * m, P = y * K, F = y * vt, R = y * yt, A = y * m, L = 1; L < p; L++) {
      var u = O + ((c < L ? c : L) << 2), Y = n[u], x = n[u + 1], z = n[u + 2], B = n[u + 3], Q = p - L;
      P += (C.r = Y) * Q, F += (C.g = x) * Q, R += (C.b = z) * Q, A += (C.a = B) * Q, l += Y, h += x, _ += z, g += B, C = C.next;
    }
    E = k, N = X;
    for (var $ = 0; $ < i; $++) {
      var at = A * j >>> V;
      if (n[O + 3] = at, at !== 0) {
        var rt = 255 / at;
        n[O] = (P * j >>> V) * rt, n[O + 1] = (F * j >>> V) * rt, n[O + 2] = (R * j >>> V) * rt;
      } else
        n[O] = n[O + 1] = n[O + 2] = 0;
      P -= b, F -= v, R -= w, A -= M, b -= E.r, v -= E.g, w -= E.b, M -= E.a;
      var J = $ + r + 1;
      J = U + (J < c ? J : c) << 2, l += E.r = n[J], h += E.g = n[J + 1], _ += E.b = n[J + 2], g += E.a = n[J + 3], P += l, F += h, R += _, A += g, E = E.next;
      var tt = N, pt = tt.r, et = tt.g, bt = tt.b, Ct = tt.a;
      b += pt, v += et, w += bt, M += Ct, l -= pt, h -= et, _ -= bt, g -= Ct, N = N.next, O += 4;
    }
    U += i;
  }
  for (var dt = 0; dt < i; dt++) {
    O = dt << 2;
    var ot = n[O], nt = n[O + 1], ht = n[O + 2], W = n[O + 3], wt = p * ot, Mt = p * nt, Et = p * ht, qt = p * W, Ot = y * ot, Ft = y * nt, At = y * ht, Dt = y * W;
    C = k;
    for (var se = 0; se < p; se++)
      C.r = ot, C.g = nt, C.b = ht, C.a = W, C = C.next;
    for (var ae = i, Wt = 0, Ut = 0, Vt = 0, Gt = 0, Rt = 1; Rt <= r; Rt++) {
      O = ae + dt << 2;
      var Lt = p - Rt;
      Ot += (C.r = ot = n[O]) * Lt, Ft += (C.g = nt = n[O + 1]) * Lt, At += (C.b = ht = n[O + 2]) * Lt, Dt += (C.a = W = n[O + 3]) * Lt, Gt += ot, Wt += nt, Ut += ht, Vt += W, C = C.next, Rt < f && (ae += i);
    }
    O = dt, E = k, N = X;
    for (var $t = 0; $t < s; $t++) {
      var G = O << 2;
      n[G + 3] = W = Dt * j >>> V, W > 0 ? (W = 255 / W, n[G] = (Ot * j >>> V) * W, n[G + 1] = (Ft * j >>> V) * W, n[G + 2] = (At * j >>> V) * W) : n[G] = n[G + 1] = n[G + 2] = 0, Ot -= wt, Ft -= Mt, At -= Et, Dt -= qt, wt -= E.r, Mt -= E.g, Et -= E.b, qt -= E.a, G = dt + ((G = $t + p) < f ? G : f) * i << 2, Ot += Gt += E.r = n[G], Ft += Wt += E.g = n[G + 1], At += Ut += E.b = n[G + 2], Dt += Vt += E.a = n[G + 3], E = E.next, wt += ot = N.r, Mt += nt = N.g, Et += ht = N.b, qt += W = N.a, Gt -= ot, Wt -= nt, Ut -= ht, Vt -= W, N = N.next, O += i;
    }
  }
  return a;
}
var ue = (
  /**
   * Set properties.
   */
  function a() {
    ei(this, a), this.r = 0, this.g = 0, this.b = 0, this.a = 0, this.next = null;
  }
);
class ai extends xe {
  _currentRadiusPart;
  constructor(t) {
    super(t);
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
  normalizeFullScreen(t) {
    const e = this.p;
    e.norm && e.onCanvas ? (e.x = 0, e.y = 0, e.width = t.widthInPixel, e.height = t.heightInPixel) : super.normalizeFullScreen(t);
  }
  resize(t, e) {
    super.resize(t, e), this.p.radiusPart && (this.p.radius = void 0);
  }
  additionalBlur(t, e, i) {
    const s = this._tctx.getImageData(0, 0, t, e);
    ce(
      s,
      0,
      0,
      t,
      e,
      i.radius || 1
    ), this._tctx.putImageData(s, 0, 0);
  }
  // draw-methode
  draw(t, e) {
    const i = this.p;
    if (i.enabled) {
      (i.radius === void 0 || this._currentRadiusPart !== i.radiusPart) && (i.radius = Math.round(
        (e.widthInPixel + e.heightInPixel) / 2 / i.radiusPart
      ), this._currentRadiusPart = i.radiusPart);
      const s = Math.round(
        i.radius * (i.radiusScale && e.cam ? e.cam.zoom : 1) / e.scaleCanvas
      );
      if (s)
        if (i.onCanvas) {
          (i.width === void 0 || i.height === void 0) && this.normalizeFullScreen(e);
          const r = Math.round(i.x), n = Math.round(i.y), o = Math.round(i.width), c = Math.round(i.height), f = t.getImageData(r, n, o, c);
          ce(f, 0, 0, o - r, c - n, s), t.putImageData(f, r, n, 0, 0, o, c);
        } else
          e.radius = s, super.draw(t, e);
    } else
      super.draw(t, e);
  }
}
class ri extends ft {
  _starsX = [];
  _starsY = [];
  _starsZ = [];
  _starsOldX = [];
  _starsOldY = [];
  _starsNewX = [];
  _starsNewY = [];
  _starsEnabled = [];
  _starsLineWidth = [];
  _centerX = 0;
  _centerY = 0;
  _scaleZ = 0;
  constructor(t) {
    super(t);
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
  init(t, e) {
    const i = this.p;
    i.width = i.width || e.width, i.height = i.height || e.height, i.x = i.x === void 0 ? e.x : i.x, i.y = i.y === void 0 ? e.y : i.y, i.lineWidth = i.lineWidth || Math.min(
      e.height / e.heightInPixel,
      e.width / e.widthInPixel
    ) / 2, this._centerX = i.width / 2 + i.x, this._centerY = i.height / 2 + i.y, this._scaleZ = Math.max(i.width, i.height) / 2;
    function s(r, n, o = -n) {
      return r === void 0 || r < n || r >= o ? Math.random() * (o - n) + n : r;
    }
    for (let r = 0; r < i.count; r++)
      this._starsX[r] = s(this._starsX[r], -i.width / 2), this._starsY[r] = s(this._starsY[r], -i.height / 2), this._starsZ[r] = s(this._starsZ[r], 0, this._scaleZ);
  }
  _moveStar(t, e, i) {
    const s = this.p, r = s.width / 2, n = s.height / 2;
    i && (this._starsEnabled[t] = !0);
    let o = this._starsX[t] + s.moveX * e, c = this._starsY[t] + s.moveY * e, f = this._starsZ[t] + s.moveZ * e;
    for (; o < -r; )
      o += s.width, c = Math.random() * s.height - n, this._starsEnabled[t] = !1;
    for (; o > r; )
      o -= s.width, c = Math.random() * s.height - n, this._starsEnabled[t] = !1;
    for (; c < -n; )
      c += s.height, o = Math.random() * s.width - r, this._starsEnabled[t] = !1;
    for (; c > n; )
      c -= s.height, o = Math.random() * s.width - r, this._starsEnabled[t] = !1;
    for (; f <= 0; )
      f += this._scaleZ, o = Math.random() * s.width - r, c = Math.random() * s.height - n, this._starsEnabled[t] = !1;
    for (; f > this._scaleZ; )
      f -= this._scaleZ, o = Math.random() * s.width - r, c = Math.random() * s.height - n, this._starsEnabled[t] = !1;
    const p = this._centerX + o / f * r, y = this._centerY + c / f * n;
    if (this._starsEnabled[t] = this._starsEnabled[t] && p >= s.x && y >= s.y && p < s.x + s.width && y < s.y + s.height, i)
      this._starsX[t] = o, this._starsY[t] = c, this._starsZ[t] = f, this._starsNewX[t] = p, this._starsNewY[t] = y;
    else {
      this._starsOldX[t] = p, this._starsOldY[t] = y;
      let k = (1 - this._starsZ[t] / this._scaleZ) * 4;
      s.highScale || (k = Math.ceil(k)), this._starsLineWidth[t] = k;
    }
  }
  animate(t) {
    const e = super.animate(t);
    if (this.p.enabled && this._centerX !== void 0) {
      let i = this.p.count;
      for (; i--; )
        this._moveStar(i, t / 16, !0), this._starsEnabled[i] && this._moveStar(i, -5, !1);
    }
    return e;
  }
  resize(t, e) {
    this._needInit = !0;
  }
  detect(t, e, i) {
    return this._detectHelper(this.p, t, e, i, !1);
  }
  // Draw-Funktion
  draw(t, e) {
    if (this.p.enabled) {
      const i = this.p;
      if (t.globalCompositeOperation = i.compositeOperation, t.globalAlpha = i.alpha * e.alpha, i.moveY == 0 && i.moveZ == 0 && i.moveX < 0) {
        t.fillStyle = i.color;
        let s = i.count;
        for (; s--; )
          this._starsEnabled[s] && t.fillRect(
            this._starsNewX[s],
            this._starsNewY[s] - this._starsLineWidth[s] * i.lineWidth / 2,
            this._starsOldX[s] - this._starsNewX[s],
            this._starsLineWidth[s] * i.lineWidth
          );
      } else if (t.strokeStyle = i.color, i.highScale) {
        let s = i.count;
        for (; s--; )
          this._starsEnabled[s] && (t.beginPath(), t.lineWidth = this._starsLineWidth[s] * i.lineWidth, t.moveTo(this._starsOldX[s], this._starsOldY[s]), t.lineTo(this._starsNewX[s], this._starsNewY[s]), t.stroke(), t.closePath());
      } else {
        let s = 5, r;
        for (; --s; ) {
          for (t.beginPath(), t.lineWidth = s * i.lineWidth, r = i.count; r--; )
            this._starsEnabled[r] && this._starsLineWidth[r] === s && (t.moveTo(this._starsOldX[r], this._starsOldY[r]), t.lineTo(this._starsNewX[r], this._starsNewY[r]));
          t.stroke(), t.closePath();
        }
      }
    }
  }
}
const Us = {
  Callback: Fe,
  Canvas: Re,
  Circle: De,
  Emitter: we,
  FastBlur: xe,
  Group: Bt,
  Image: Le,
  Text: Te,
  Particle: ut,
  Path: Je,
  Rect: Qe,
  Scroller: ti,
  StackBlur: ai,
  StarField: ri
};
class ni {
  _callback;
  _duration;
  _initialized = !1;
  constructor(t, e) {
    this._callback = t, this._duration = I(T(e), void 0);
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
const oi = Math.PI / 180;
function fe(a, t) {
  return t.from + a * t.delta;
}
function hi(a, t) {
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
class li {
  _initialized = !1;
  _changeValues;
  _duration;
  _ease;
  constructor(t, e, i) {
    this._changeValues = [];
    for (const s in t) {
      const r = t[s], n = s === "rotationInDegree" ? r * oi : r, o = s === "color" || s === "borderColor", c = s === "path", f = s === "text", p = typeof n == "function", y = !o && Array.isArray(n), k = s === "scale" ? ["scaleX", "scaleY"] : s === "rotationInRadian" || s === "rotationInDegree" ? ["rotation"] : [s];
      for (const C of k)
        this._changeValues.push({
          name: C,
          to: y ? n[n.length - 1] : T(n),
          bezier: y ? n : void 0,
          isColor: o,
          isPath: c,
          isStatic: f,
          isFunction: p ? n : void 0,
          moveAlgorithm: o ? me : c ? _e : y ? de : f ? hi : fe
        });
    }
    this._duration = I(T(e), 0), this._ease = I(i, (s) => s);
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
let ci = class {
  constructor() {
  }
  run(t, e) {
    return St.FORCE_DISABLE;
  }
}, ui = class {
  constructor() {
  }
  run(t, e) {
    return t.p.enabled = !1, St.FORCE_DISABLE;
  }
};
class fi {
  _Aniobject;
  constructor(...t) {
    this._Aniobject = t[0] instanceof _t ? t[0] : new _t(...t);
  }
  reset(t = 0) {
    this._Aniobject.reset?.(t);
  }
  play(t = "", e = 0) {
    return this._Aniobject.play?.(t, e);
  }
  run(t, e, i) {
    let s = e;
    for (; s >= 0; ) {
      if (s = this._Aniobject.run(t, s, i), i = !0, s === !0)
        return !0;
      s >= 0 && this._Aniobject.reset?.();
    }
    return s;
  }
}
class di {
  _ifCallback;
  _Aniobject;
  _AniobjectElse;
  constructor(t, e, i) {
    this._ifCallback = t, this._Aniobject = e, this._AniobjectElse = I(i, () => 0);
  }
  play(t = "", e = 0) {
    return this._Aniobject.play?.(t, e) || this._AniobjectElse.play?.(t, e);
  }
  run(t, e) {
    const i = T(this._ifCallback) ? this._Aniobject : this._AniobjectElse;
    return i.run ? i.run(t, e) : i(t, e);
  }
}
class mi {
  _initialized = !1;
  _image;
  _count;
  _durationBetweenFrames;
  _duration;
  _current = -1;
  constructor(t, e) {
    const i = T(t);
    this._durationBetweenFrames = I(T(e), 0), Array.isArray(i) ? (this._image = i, this._count = i.length) : (this._image = [i], this._count = 1), this._duration = this._count * this._durationBetweenFrames;
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
class _i {
  _frameNumber;
  _durationBetweenFrames;
  _duration;
  _framesToRight;
  constructor(t, e, i) {
    const s = T(t);
    this._framesToRight = I(T(e), !0), this._durationBetweenFrames = I(T(i), 0), this._frameNumber = Array.isArray(s) ? s : [s], this._duration = this._frameNumber.length * this._durationBetweenFrames;
  }
  run(t, e) {
    let i = 0;
    return e >= this._duration ? i = this._frameNumber[this._frameNumber.length - 1] : i = this._frameNumber[Math.floor(e / this._durationBetweenFrames)], this._framesToRight ? t.p.frameX = t.p.frameWidth * i : t.p.frameY = t.p.frameHeight * i, e - this._duration;
  }
}
class pi {
  _Aniobject;
  _times;
  _timesOrg;
  constructor(t, ...e) {
    this._Aniobject = e[0] instanceof _t ? e[0] : new _t(...e), this._times = this._timesOrg = I(T(t), 1);
  }
  reset(t = 0) {
    this._times = this._timesOrg, this._Aniobject.reset?.(t);
  }
  play(t = "", e = 0) {
    this._times = this._timesOrg;
    const i = this._Aniobject.play?.(t, e);
    return i && (this._times = this._timesOrg), i;
  }
  run(t, e, i) {
    let s = e;
    for (; s >= 0 && this._times > 0; ) {
      if (s = this._Aniobject.run(t, s, i), i = !0, s === !0)
        return !0;
      s >= 0 && (this._times--, this._Aniobject.reset?.());
    }
    return s;
  }
}
class gi {
  constructor() {
  }
  run(t, e) {
    return St.REMOVE;
  }
}
class vi {
  _Aniobject;
  _times;
  constructor(t, e) {
    this._Aniobject = t, this._times = I(T(e), 1);
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
class yi {
  _initialized = !1;
  _duration;
  _shakeDiff;
  _shakeDiffHalf;
  _x = 0;
  _y = 0;
  constructor(t, e) {
    this._duration = T(e), this._shakeDiff = T(t), this._shakeDiffHalf = this._shakeDiff / 2;
  }
  reset() {
    this._initialized = !1;
  }
  run(t, e) {
    return this._initialized || (this._initialized = !0, this._x = t.p.x, this._y = t.p.y), e >= this._duration ? (t.p.x = this._x, t.p.y = this._y) : (t.p.x = this._x + Math.random() * this._shakeDiff - this._shakeDiffHalf, t.p.y = this._y + Math.random() * this._shakeDiff - this._shakeDiffHalf), e - this._duration;
  }
}
class bi {
  _showOnce = !0;
  run(t, e) {
    return t.p.enabled = t.p.enabled && this._showOnce, this._showOnce = !1, 0;
  }
}
class wi {
  _states;
  _transitions;
  _currentStateName;
  _currentState;
  _isTransitioningToStateName = void 0;
  constructor({
    states: t = {},
    transitions: e = {},
    defaultState: i
  }) {
    this._states = Object.fromEntries(
      Object.entries(t).map(([s, r]) => [
        s,
        Array.isArray(r) ? new _t(r) : r
      ])
    ), this._transitions = Object.fromEntries(
      Object.entries(e).map(([s, r]) => [
        s,
        Array.isArray(r) ? new _t(r) : r
      ])
    ), this._currentStateName = i, this._currentState = this._states[i];
  }
  setState(t) {
    if (t !== this._currentStateName) {
      this._isTransitioningToStateName = t;
      const e = `${t.charAt(0).toUpperCase()}${t.slice(1)}`, s = [
        `${this._currentStateName}To${e}`,
        `${this._currentStateName}To`,
        `to${e}`
      ].find(
        (r) => r in this._transitions
      );
      s ? (this._currentStateName = this._isTransitioningToStateName, this._currentState = this._transitions[s], this._currentState?.reset?.()) : (this._currentStateName = this._isTransitioningToStateName, this._currentState = this._states[this._currentStateName], this._currentState?.reset?.(), this._isTransitioningToStateName = void 0);
    }
  }
  play(t = "", e = 0) {
    return this._currentState?.play?.(t, e);
  }
  run(t, e, i) {
    let s = e, r = i;
    if (this._currentState) {
      if (s = this._currentState.run(t, s, r), s === !0)
        return !0;
      r = !0;
    }
    if (s >= 0 || !this._currentState)
      if (this._isTransitioningToStateName) {
        if (this._currentStateName = this._isTransitioningToStateName, this._currentState = this._states[this._currentStateName], this._currentState?.reset?.(), this._isTransitioningToStateName = void 0, s = this._currentState.run(t, s, r), s === !0)
          return !0;
      } else
        this._currentState = void 0;
    return -1;
  }
}
class xi {
  constructor() {
  }
  run(t, e) {
    return St.STOP;
  }
}
class Ti {
  constructor() {
  }
  run(t, e) {
    return t.p.enabled = !1, St.STOP;
  }
}
class Si {
  duration;
  constructor(t) {
    this.duration = I(T(t), 0);
  }
  run(t, e) {
    return t.p.enabled = e >= this.duration, e - this.duration;
  }
}
const $s = {
  Callback: ni,
  ChangeTo: li,
  End: ci,
  EndDisabled: ui,
  Forever: fi,
  If: di,
  Image: mi,
  ImageFrame: _i,
  Loop: pi,
  Once: vi,
  Remove: gi,
  Sequence: _t,
  Shake: yi,
  ShowOnce: bi,
  State: wi,
  Stop: xi,
  StopDisabled: Ti,
  Wait: be,
  WaitDisabled: Si
};
function Ci(a) {
  var t = 2.5949095;
  return (a *= 2) < 1 ? 0.5 * (a * a * ((t + 1) * a - t)) : 0.5 * ((a -= 2) * a * ((t + 1) * a + t) + 2);
}
var Mi = Ci;
function Ei(a) {
  var t = 1.70158;
  return a * a * ((t + 1) * a - t);
}
var ki = Ei;
function Pi(a) {
  var t = 1.70158;
  return --a * a * ((t + 1) * a + t) + 1;
}
var zi = Pi;
function Ii(a) {
  var t = 0.36363636363636365, e = 8 / 11, i = 9 / 10, s = 4356 / 361, r = 35442 / 1805, n = 16061 / 1805, o = a * a;
  return a < t ? 7.5625 * o : a < e ? 9.075 * o - 9.9 * a + 3.4 : a < i ? s * o - r * a + n : 10.8 * a * a - 20.52 * a + 10.72;
}
var ie = Ii, pe = ie;
function Oi(a) {
  return a < 0.5 ? 0.5 * (1 - pe(1 - a * 2)) : 0.5 * pe(a * 2 - 1) + 0.5;
}
var Fi = Oi, Ai = ie;
function Di(a) {
  return 1 - Ai(1 - a);
}
var Ri = Di;
function Li(a) {
  return (a *= 2) < 1 ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1);
}
var Ni = Li;
function Xi(a) {
  return 1 - Math.sqrt(1 - a * a);
}
var Hi = Xi;
function ji(a) {
  return Math.sqrt(1 - --a * a);
}
var Yi = ji;
function Bi(a) {
  return a < 0.5 ? 4 * a * a * a : 0.5 * Math.pow(2 * a - 2, 3) + 1;
}
var qi = Bi;
function Wi(a) {
  return a * a * a;
}
var Ui = Wi;
function Vi(a) {
  var t = a - 1;
  return t * t * t + 1;
}
var Gi = Vi;
function $i(a) {
  return a < 0.5 ? 0.5 * Math.sin(13 * Math.PI / 2 * 2 * a) * Math.pow(2, 10 * (2 * a - 1)) : 0.5 * Math.sin(-13 * Math.PI / 2 * (2 * a - 1 + 1)) * Math.pow(2, -10 * (2 * a - 1)) + 1;
}
var Zi = $i;
function Ki(a) {
  return Math.sin(13 * a * Math.PI / 2) * Math.pow(2, 10 * (a - 1));
}
var Ji = Ki;
function Qi(a) {
  return Math.sin(-13 * (a + 1) * Math.PI / 2) * Math.pow(2, -10 * a) + 1;
}
var ts = Qi;
function es(a) {
  return a === 0 || a === 1 ? a : a < 0.5 ? 0.5 * Math.pow(2, 20 * a - 10) : -0.5 * Math.pow(2, 10 - a * 20) + 1;
}
var is = es;
function ss(a) {
  return a === 0 ? a : Math.pow(2, 10 * (a - 1));
}
var as = ss;
function rs(a) {
  return a === 1 ? a : 1 - Math.pow(2, -10 * a);
}
var ns = rs;
function os(a) {
  return a;
}
var hs = os;
function ls(a) {
  return a /= 0.5, a < 1 ? 0.5 * a * a : (a--, -0.5 * (a * (a - 2) - 1));
}
var cs = ls;
function us(a) {
  return a * a;
}
var fs = us;
function ds(a) {
  return -a * (a - 2);
}
var ms = ds;
function _s(a) {
  return a < 0.5 ? 8 * Math.pow(a, 4) : -8 * Math.pow(a - 1, 4) + 1;
}
var ps = _s;
function gs(a) {
  return Math.pow(a, 4);
}
var vs = gs;
function ys(a) {
  return Math.pow(a - 1, 3) * (1 - a) + 1;
}
var bs = ys;
function ws(a) {
  return (a *= 2) < 1 ? 0.5 * a * a * a * a * a : 0.5 * ((a -= 2) * a * a * a * a + 2);
}
var xs = ws;
function Ts(a) {
  return a * a * a * a * a;
}
var Ss = Ts;
function Cs(a) {
  return --a * a * a * a * a + 1;
}
var Ms = Cs;
function Es(a) {
  return -0.5 * (Math.cos(Math.PI * a) - 1);
}
var ks = Es;
function Ps(a) {
  var t = Math.cos(a * Math.PI * 0.5);
  return Math.abs(t) < 1e-14 ? 1 : 1 - t;
}
var zs = Ps;
function Is(a) {
  return Math.sin(a * Math.PI / 2);
}
var Os = Is, Fs = {
  backInOut: Mi,
  backIn: ki,
  backOut: zi,
  bounceInOut: Fi,
  bounceIn: Ri,
  bounceOut: ie,
  circInOut: Ni,
  circIn: Hi,
  circOut: Yi,
  cubicInOut: qi,
  cubicIn: Ui,
  cubicOut: Gi,
  elasticInOut: Zi,
  elasticIn: Ji,
  elasticOut: ts,
  expoInOut: is,
  expoIn: as,
  expoOut: ns,
  linear: hs,
  quadInOut: cs,
  quadIn: fs,
  quadOut: ms,
  quartInOut: ps,
  quartIn: vs,
  quartOut: bs,
  quintInOut: xs,
  quintIn: Ss,
  quintOut: Ms,
  sineInOut: ks,
  sineIn: zs,
  sineOut: Os
};
const Zs = /* @__PURE__ */ Ce(Fs);
class ge {
  type = "camera";
  cam;
  constructor(t = {}) {
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
    }, o = this.viewportByCam(t, e).invert(), [c, f] = o.transformPoint(0, 0), [p, y] = o.transformPoint(
      i.getWidth(),
      i.getHeight()
    );
    return p - c <= n.x2 - n.x1 ? c < n.x1 ? p <= n.x2 && (e.x += n.x1 - c) : p > n.x2 && (e.x += n.x2 - p) : c > n.x1 ? e.x += n.x1 - c : p < n.x2 && (e.x += n.x2 - p), y - f <= n.y2 - n.y1 ? f < n.y1 ? y <= n.y2 && (e.y += n.y1 - f) : y > n.y2 && (e.y += n.y2 - y) : f > n.y1 ? e.y += n.y1 - f : y < n.y2 && (e.y += n.y2 - y), e;
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
    const { scene: e, engine: i, cam: s, x1: r, y1: n, x2: o, y2: c } = t, f = e.additionalModifier.scaleCanvas, p = this.viewportByCam(t, s || this.cam).invert(), [y, k] = p.transformPoint(0, 0), [C, X] = p.transformPoint(
      i.getWidth() * f,
      i.getHeight() * f
    ), D = C - y, E = X - k, N = o - r, U = c - n, O = r + N / 2, j = n + U / 2, V = D / N, S = E / U, K = {
      x: O,
      y: j,
      zoom: (s || this.cam).zoom * Math.max(Math.min(V, S), Number.MIN_VALUE)
    };
    s ? (s.x = K.x, s.y = K.y, s.zoom = K.zoom) : this.cam = K;
  }
}
const As = 300;
class Me {
  type = "control";
  _mousePos = {};
  toCam = {
    zoom: 1,
    x: 0,
    y: 0
  };
  _config;
  _scene;
  _instant = !1;
  constructor(t = {}) {
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
    this._mousePos[s] = Object.assign({}, this._mousePos[s], {
      x: e,
      y: i,
      _cx: this.toCam.x,
      _cy: this.toCam.y,
      _isDown: !0,
      _numOfFingers: t.touches?.length || 1,
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
    this._mousePos[s] || delete this._mousePos[s];
    const n = this._mousePos[s]._isDown, o = t.changedTouches?.length || 1, c = Math.max(
      this._mousePos[s]._numOfFingers,
      o
    );
    if (this._mousePos[s]._isDown = !1, this._mousePos[s]._numOfFingers -= o, !n || c > 1) {
      r.stopPropagation();
      return;
    }
    Date.now() - this._mousePos[s]._timestamp < As && Math.abs(this._mousePos[s].x - e) < 5 && Math.abs(this._mousePos[s].y - i) < 5 && s === 1 || r.stopPropagation();
  }
  mouseOut({ button: t }) {
    this._mousePos[t] && (this._mousePos[t]._isDown = !1);
  }
  mouseMove(t) {
    const {
      event: e,
      position: [i, s],
      button: r,
      scene: n
    } = t;
    if (!this._mousePos[r] || !this._mousePos[r]._isDown || e.which === 0 && !e.touches)
      return;
    const o = n.additionalModifier.scaleCanvas;
    if (e.touches?.length >= 2) {
      const c = e.touches, f = Math.sqrt(
        (c[0].pageX - c[1].pageX) * (c[0].pageX - c[1].pageX) + (c[0].pageY - c[1].pageY) * (c[0].pageY - c[1].pageY)
      );
      this._mousePos[r]._distance === void 0 ? f > 0 && (this._mousePos[r]._distance = f, this._mousePos[r]._czoom = this.toCam.zoom) : (this.toCam.zoom = Math.max(
        this._config.zoomMin,
        Math.min(
          this._config.zoomMax,
          this._mousePos[r]._czoom * f / this._mousePos[r]._distance
        )
      ), this.toCam = n.camera.clampView(t, this.toCam));
      return;
    } else {
      this._mousePos[r]._distance = void 0;
      const c = n.camera.viewportByCam(t, this.toCam).invert(), [f, p] = c.transformPoint(
        this._mousePos[r].x * o,
        this._mousePos[r].y * o
      ), [y, k] = c.transformPoint(i * o, s * o);
      this.toCam.x = this._mousePos[r]._cx + f - y, this.toCam.y = this._mousePos[r]._cy + p - k, this.toCam = n.camera.clampView(t, this.toCam);
    }
  }
  mouseWheel(t) {
    const {
      event: e,
      position: [i, s],
      scene: r
    } = t, n = r.additionalModifier.scaleCanvas, [o, c] = r.camera.viewportByCam(t, this.toCam).invert().transformPoint(i * n, s * n);
    if (// @ts-expect-error wheelDelta is old ff-api
    (e.wheelDelta || e.deltaY * -1) / 120 > 0) {
      this.zoomIn();
      const [p, y] = r.camera.viewportByCam(t, this.toCam).invert().transformPoint(i * n, s * n);
      this.toCam.x -= p - o, this.toCam.y -= y - c, this.toCam = r.camera.clampView(t, this.toCam);
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
class Ds extends Me {
  mouseUp({
    event: t,
    position: [e, i],
    button: s,
    scene: r
  }) {
    this._mousePos[s] || delete this._mousePos[s];
    const n = this._mousePos[s]._isDown, o = t.changedTouches?.length || 1, c = Math.max(
      this._mousePos[s]._numOfFingers,
      o
    );
    if (this._mousePos[s]._isDown = !1, this._mousePos[s]._numOfFingers -= o, !n || c > 1) {
      r.stopPropagation();
      return;
    }
    if ((Date.now() - this._mousePos[s]._timestamp > ve || Math.abs(this._mousePos[s].x - e) >= 5 || Math.abs(this._mousePos[s].y - i) >= 5) && s === 1) {
      r.stopPropagation();
      const [f, p] = r.transformPoint(e, i), [y, k] = r.transformPoint(
        this._mousePos[s].x,
        this._mousePos[s].y
      );
      r.map("region", {
        event: t,
        x1: Math.min(y, f),
        y1: Math.min(k, p),
        x2: Math.max(y, f),
        y2: Math.max(k, p),
        fromX: y,
        fromY: k,
        toX: f,
        toY: p
      });
    }
  }
  mouseMove(t) {
    const {
      event: e,
      position: [i, s],
      button: r,
      scene: n
    } = t;
    if (!this._mousePos[r] || !this._mousePos[r]._isDown || e.which === 0 && !e.touches)
      return;
    const o = n.additionalModifier.scaleCanvas;
    if (e.touches?.length >= 2) {
      const c = e.touches, f = Math.sqrt(
        (c[0].pageX - c[1].pageX) * (c[0].pageX - c[1].pageX) + (c[0].pageY - c[1].pageY) * (c[0].pageY - c[1].pageY)
      );
      if (this._mousePos[r]._distance === void 0)
        f > 0 && (this._mousePos[r]._distance = f, this._mousePos[r]._czoom = this.toCam.zoom);
      else {
        this.toCam.zoom = Math.max(
          this._config.zoomMin,
          Math.min(
            this._config.zoomMax,
            this._mousePos[r]._czoom * f / this._mousePos[r]._distance
          )
        );
        const p = n.camera.viewportByCam(t, this.toCam).invert(), [y, k] = p.transformPoint(
          this._mousePos[r].x * o,
          this._mousePos[r].y * o
        ), [C, X] = p.transformPoint(i * o, s * o);
        this.toCam.x = this._mousePos[r]._cx + y - C, this.toCam.y = this._mousePos[r]._cy + k - X, this.toCam = n.camera.clampView(t, this.toCam);
      }
      return;
    } else if (this._mousePos[r]._distance = void 0, r === 2) {
      const c = n.camera.viewportByCam(t, this.toCam).invert(), [f, p] = c.transformPoint(
        this._mousePos[r].x * o,
        this._mousePos[r].y * o
      ), [y, k] = c.transformPoint(i * o, s * o);
      this.toCam.x = this._mousePos[r]._cx + f - y, this.toCam.y = this._mousePos[r]._cy + p - k, this.toCam = n.camera.clampView(t, this.toCam);
    }
    if (r === 1 && n.has("regionMove") && !(Date.now() - this._mousePos[r]._timestamp < ve && Math.abs(this._mousePos[r].x - i) < 5 && Math.abs(this._mousePos[r].y - s) < 5) && (!e.touches || e.touches.length === 1)) {
      const [c, f] = n.transformPoint(i, s), [p, y] = n.transformPoint(
        this._mousePos[r].x,
        this._mousePos[r].y
      );
      n.map("regionMove", {
        event: e,
        x1: Math.min(p, c),
        y1: Math.min(y, f),
        x2: Math.max(p, c),
        y2: Math.max(y, f),
        fromX: p,
        fromY: y,
        toX: c,
        toY: f
      });
    }
  }
}
class Rs {
  _doubleClickElementTimer;
  _doubleClickDetectInterval;
  constructor({
    doubleClickDetectInterval: t = 350
  } = {}) {
    this._doubleClickDetectInterval = t;
  }
  mouseUp(t) {
    const { scene: e, button: i } = t;
    i === 1 && (e.has("doubleClick") ? this._doubleClickElementTimer ? (clearTimeout(this._doubleClickElementTimer), this._doubleClickElementTimer = 0, e.map("doubleClick", t)) : this._doubleClickElementTimer = window.setTimeout(() => {
      this._doubleClickElementTimer = 0, e.map("click", t);
    }, this._doubleClickDetectInterval) : e.map("click", t));
  }
}
class Ls {
  _clickIntend = void 0;
  _hoverIntend = void 0;
  _hasDetectImage = !1;
  _doubleClickElementTimer = void 0;
  _doubleClickDetectInterval;
  constructor({
    doubleClickDetectInterval: t = 350
  } = {}) {
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
      const n = !!this._clickIntend, { mx: o, my: c } = this._clickIntend || this._hoverIntend, f = e.additionalModifier.scaleCanvas, p = i.context[r || 0], y = Math.round(o / f), k = Math.round(c / f), [C, X] = e.transformPoint(o, c);
      p.save(), p.setTransform(...e.viewport().m);
      let D;
      if (s.forEach(({ layerId: E, element: N, isFunction: U, elementId: O }) => {
        if (!U) {
          const j = N.detect(p, y, k);
          if (j === "c")
            D = "c";
          else if (j)
            return D = { layerId: E, element: j, elementId: O }, !1;
        }
      }), p.restore(), D === "c")
        this._hasDetectImage = !0;
      else {
        this._clickIntend = void 0, this._hoverIntend = void 0;
        const E = Object.assign(
          {
            mx: o,
            my: c,
            x: C,
            y: X
          },
          t
        );
        D ? (Object.assign(E, D), this._dispatchEvent(e, n, E)) : this._dispatchNonEvent(e, n, E);
      }
    }
  }
  draw(t) {
    const { engine: e, scene: i, layerManager: s, output: r, canvasId: n } = t;
    if (!n && this._hasDetectImage) {
      const o = !!this._clickIntend, { mx: c, my: f } = this._clickIntend || this._hoverIntend, p = i.additionalModifier.scaleCanvas, y = r.context[0], k = Math.round(c / p), C = Math.round(f / p), [X, D] = i.transformPoint(c, f), E = Object.assign(
        {
          mx: c,
          my: f,
          x: X,
          y: D
        },
        t
      ), N = y.imageSmoothingEnabled;
      y.imageSmoothingEnabled = !1, y.clearRect(0, 0, y.canvas.width, y.canvas.height), y.save(), y.setTransform(...i.viewport().m), s.forEach(({ layerId: O, element: j, isFunction: V, elementId: S }) => {
        if (!V) {
          const K = `rgb(${S & 255}, ${(S & 65280) >> 8}, ${O & 255})`;
          j.detectDraw(y, K);
        }
      }, 0), y.restore(), y.imageSmoothingEnabled = N, e.normContext(y), this._clickIntend = void 0, this._hoverIntend = void 0;
      const U = y.getImageData(k, C, 1, 1).data;
      if (U[3]) {
        const O = U[2], j = U[0] + (U[1] << 8);
        Object.assign(E, {
          layerId: O,
          elementId: j,
          element: s.getById(O).getById(j)
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
class Ns {
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
class Xs {
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
    const [s, r] = i.transformPoint(0, 0, 1), [n, o] = i.transformPoint(e.width, e.height, 1), c = t.getWidth() / 2, f = t.getHeight() / 2, p = t.getRatio() > 1 ? c : f, y = new Tt().translate(c, f).scale(p, p).invert(), [k, C] = y.transformPoint(0, 0), [X, D] = y.transformPoint(
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
        y: C,
        width: X - k,
        height: D - C
      }
    };
  }
}
class Hs extends ee {
  _maxSkippedTickChunk = Number.POSITIVE_INFINITY;
  _audioStartTime = void 0;
  _audioPosition = void 0;
  _enableAndroidHack = !1;
  _audioElement;
  constructor(t) {
    super({
      ...t,
      maxSkippedTickChunk: Number.POSITIVE_INFINITY
    }), this._audioElement = t.audioElement;
  }
  get audioElement() {
    return this._audioElement;
  }
  init(t) {
    if (this._audioElement)
      return typeof MediaController == "function" && (this._audioElement.controller = new MediaController(), this._enableAndroidHack = !0), this._audioElement.preload = "auto", new Promise((e, i) => {
        const s = () => {
          this._audioElement.removeEventListener(
            "canplaythrough",
            s
          );
          const r = this._audioElement.play();
          r && r.catch((n) => {
          }), e(void 0);
        };
        this._audioElement.addEventListener("canplaythrough", s), this._audioElement.onerror = () => {
          this._audioElement = void 0, e(void 0);
        }, this._audioElement.load();
      });
  }
  endTime() {
    return this._audioElement ? this._audioElement.duration * 1e3 : Number.POSITIVE_INFINITY;
  }
  currentTime() {
    const t = super.currentTime();
    if (this._audioElement) {
      if (this._audioElement.ended && this._audioElement.duration)
        return this._audioElement.duration * 1e3;
      const e = this._audioElement.currentTime * 1e3;
      if (this._enableAndroidHack) {
        if (this._audioStartTime === void 0)
          return this._audioStartTime = t, this._audioPosition = e, e;
        if (this._audioElement.controller.playbackState === "playing") {
          if (e === this._audioPosition)
            return this._audioPosition + Math.min(260, t - this._audioStartTime);
          if (e - this._audioPosition < 500 && e > this._audioPosition && t - this._audioStartTime < 350)
            return this._audioStartTime = this._audioStartTime + (e - this._audioPosition), this._audioPosition = e, this._audioPosition + t - this._audioStartTime;
        }
        return this._audioStartTime = t, this._audioPosition = e, this._audioPosition;
      } else
        return e;
    } else
      return t;
  }
  clampTime({ timePassed: t }) {
    return t;
  }
  shiftTime() {
    return 0;
  }
}
class js {
  type = "events";
  _reseted = !1;
  _events = [];
  _pushEvent(t, e, i) {
    if (I(i.value("preventDefault"), !0) && e.preventDefault(), !this._reseted)
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
      I(
        t.value(
          "preventDefault"
        ),
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
          I(e.value("preventDefault"), !0) && n.preventDefault(), e.pipeBack(r, { event: n });
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
    return t.touches ? t.touches.length || t.changedTouches.length : I(
      t.buttons ? t.buttons : [0, 1, 4, 2][t.which],
      1
    );
  }
}
const Ks = {
  Callback: ge,
  Camera: ge,
  CameraControl: Me,
  CameraControlSecondButton: Ds,
  Click: Rs,
  Element: Ls,
  Event: js,
  LoadingScreen: Ns,
  Norm: Xs,
  TimingAudio: Hs,
  TimingDefault: ee
};
export {
  $s as Animations,
  Zs as Easing,
  Ys as Engine,
  jt as ImageManager,
  Nt as Layer,
  Zt as LayerManager,
  Ks as Middleware,
  st as Position,
  Bs as Scene,
  Us as Sprites
};
