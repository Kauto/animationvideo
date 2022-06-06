(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.AnimationVideo = {}));
})(this, (function (exports) {
  function calc(c) {
    return typeof c === "function" ? c(...[].slice.call(arguments, 1)) : c;
  }

  function toArray(value) {
    return value === undefined || value === null ? [] : Array.isArray(value) ? value : [value];
  }

  function _settle$1(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact$1) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }

          value = value.v;
        } else {
          value.o = _settle$1.bind(null, pact, state);
          return;
        }
      }

      if (value && value.then) {
        value.then(_settle$1.bind(null, pact, state), _settle$1.bind(null, pact, 2));
        return;
      }

      pact.s = state;
      pact.v = value;
      const observer = pact.o;

      if (observer) {
        observer(pact);
      }
    }
  }

  const _Pact$1 = /*#__PURE__*/function () {
    function _Pact() {}

    _Pact.prototype.then = function (onFulfilled, onRejected) {
      const result = new _Pact();
      const state = this.s;

      if (state) {
        const callback = state & 1 ? onFulfilled : onRejected;

        if (callback) {
          try {
            _settle$1(result, 1, callback(this.v));
          } catch (e) {
            _settle$1(result, 2, e);
          }

          return result;
        } else {
          return this;
        }
      }

      this.o = function (_this) {
        try {
          const value = _this.v;

          if (_this.s & 1) {
            _settle$1(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle$1(result, 1, onRejected(value));
          } else {
            _settle$1(result, 2, value);
          }
        } catch (e) {
          _settle$1(result, 2, e);
        }
      };

      return result;
    };

    return _Pact;
  }();

  function _isSettledPact$1(thenable) {
    return thenable instanceof _Pact$1 && thenable.s & 1;
  }

  function _for(test, update, body) {
    var stage;

    for (;;) {
      var shouldContinue = test();

      if (_isSettledPact$1(shouldContinue)) {
        shouldContinue = shouldContinue.v;
      }

      if (!shouldContinue) {
        return result;
      }

      if (shouldContinue.then) {
        stage = 0;
        break;
      }

      var result = body();

      if (result && result.then) {
        if (_isSettledPact$1(result)) {
          result = result.s;
        } else {
          stage = 1;
          break;
        }
      }

      if (update) {
        var updateValue = update();

        if (updateValue && updateValue.then && !_isSettledPact$1(updateValue)) {
          stage = 2;
          break;
        }
      }
    }

    var pact = new _Pact$1();

    var reject = _settle$1.bind(null, pact, 2);

    (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
    return pact;

    function _resumeAfterBody(value) {
      result = value;

      do {
        if (update) {
          updateValue = update();

          if (updateValue && updateValue.then && !_isSettledPact$1(updateValue)) {
            updateValue.then(_resumeAfterUpdate).then(void 0, reject);
            return;
          }
        }

        shouldContinue = test();

        if (!shouldContinue || _isSettledPact$1(shouldContinue) && !shouldContinue.v) {
          _settle$1(pact, 1, result);

          return;
        }

        if (shouldContinue.then) {
          shouldContinue.then(_resumeAfterTest).then(void 0, reject);
          return;
        }

        result = body();

        if (_isSettledPact$1(result)) {
          result = result.v;
        }
      } while (!result || !result.then);

      result.then(_resumeAfterBody).then(void 0, reject);
    }

    function _resumeAfterTest(shouldContinue) {
      if (shouldContinue) {
        result = body();

        if (result && result.then) {
          result.then(_resumeAfterBody).then(void 0, reject);
        } else {
          _resumeAfterBody(result);
        }
      } else {
        _settle$1(pact, 1, result);
      }
    }

    function _resumeAfterUpdate() {
      if (shouldContinue = test()) {
        if (shouldContinue.then) {
          shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        } else {
          _resumeAfterTest(shouldContinue);
        }
      } else {
        _settle$1(pact, 1, result);
      }
    }
  }

  class Engine {
    constructor(canvasOrOptions) {
      this._output = void 0;
      this._events = void 0;
      this._scene = void 0;
      this._newScene = void 0;
      this._sceneParameter = void 0;
      this._isSceneInitialized = void 0;
      this._recalculateCanvasIntend = void 0;
      this._lastTimestamp = void 0;
      this._referenceRequestAnimationFrame = void 0;
      this._autoSize = void 0;
      this._canvasCount = void 0;
      this._drawFrame = void 0;
      this._reduceFramerate = void 0;
      this._realLastTimestamp = void 0;
      this._isOddFrame = false;
      this._initializedStartTime = void 0;
      this._promiseSceneDestroying = void 0;
      this._runParameter = void 0;
      this._moveOnce = false;
      let givenOptions = canvasOrOptions;

      if (typeof canvasOrOptions !== "object") {
        throw new Error("No canvas given for Engine constructor");
      }

      if (canvasOrOptions.getContext) {
        givenOptions = {
          canvas: canvasOrOptions
        };
      } else if (!canvasOrOptions.canvas) {
        throw new Error("No canvas given for Engine constructor");
      }

      let options = Object.assign({}, givenOptions);
      this._output = {
        canvas: [],
        context: [],
        width: 0,
        height: 0,
        ratio: 1
      }; // list of binded events

      this._events = []; // the current _scene-object

      this._scene = null; // is a _scene ready for action?

      this._isSceneInitialized = false; // new _scene to initialize
      // this._newScene = undefined;
      // this._promiseSceneDestroying = undefined;
      // time measurement

      this._lastTimestamp = 0;
      this._recalculateCanvasIntend = false; // reference to

      this._referenceRequestAnimationFrame = undefined; // data about the output canvas

      this._output.canvas = toArray(options.canvas);

      if (options.autoSize) {
        const defaultAutoSizeSettings = {
          enabled: true,
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
          registerResizeEvents: true,
          registerVisibilityEvents: true,
          setCanvasStyle: false
        };

        if (typeof options.autoSize === "object") {
          this._autoSize = Object.assign({}, defaultAutoSizeSettings, options.autoSize);
        } else {
          this._autoSize = defaultAutoSizeSettings;
        }

        if (this._autoSize.registerResizeEvents) {
          this._events = ["resize", "orientationchange"].map(e => ({
            n: window,
            e: e,
            f: this.recalculateCanvas.bind(this)
          }));
        }

        if (this._autoSize.registerVisibilityEvents) {
          this._events.push({
            n: document,
            e: "visibilitychange",
            f: this.handleVisibilityChange.bind(this)
          });
        }

        this._recalculateCanvas();
      } else {
        this._output.width = this._output.canvas[0].width;
        this._output.height = this._output.canvas[0].height;
        this._output.ratio = this._output.width / this._output.height;
      }

      this._output.canvas.forEach((canvas, index) => {
        this._output.context[index] = canvas.getContext("2d");
      });

      this._canvasCount = this._output.canvas.length;
      this._drawFrame = Array.from({
        length: this._canvasCount
      }, v => 0);

      if (options.clickToPlayAudio) {
        this._events.push({
          n: this._output.canvas[0],
          e: "click",
          f: this.playAudioOfScene.bind(this)
        });
      }

      this._reduceFramerate = !!options.reduceFramerate;

      this._events.forEach(v => {
        v.n.addEventListener(v.e, v.f);
      });

      this.switchScene(options.scene, options.sceneParameter || {});
    }

    handleVisibilityChange() {
      if (this._autoSize) this._autoSize.enabled = !(document.visibilityState == "hidden");
    }

    playAudioOfScene() {
      if (this._isSceneInitialized && this._scene && this._scene.timing.audioElement) {
        this._scene.timing.audioElement.play();
      }
    }

    normContext(ctx) {
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
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
      this._recalculateCanvasIntend = true;
      return this;
    }

    _recalculateCanvas() {
      if (this._autoSize) {
        const width = calc(this._autoSize.referenceWidth);
        const height = calc(this._autoSize.referenceHeight);

        if (width <= 0 || height <= 0) {
          return;
        }

        this._output.canvas.forEach(canvas => {
          canvas.width = Math.round(width / this._autoSize.currentScale);
          canvas.height = Math.round(height / this._autoSize.currentScale);

          if (this._autoSize.setCanvasStyle) {
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
          }
        });

        this._autoSize.currentWaitedTime = 0;
        this._autoSize.currentOffsetTime = 0;
      }

      this._output.width = this._output.canvas[0].width;
      this._output.height = this._output.canvas[0].height;
      this._output.ratio = this._output.width / this._output.height;
      this.resize();
    }

    recalculateFPS() {
      try {
        const _this = this;

        if (_this._referenceRequestAnimationFrame) {
          window.cancelAnimationFrame(_this._referenceRequestAnimationFrame);
          _this._referenceRequestAnimationFrame = undefined;
        }

        return Promise.resolve(new Promise(resolve => requestAnimationFrame(resolve))).then(function () {
          function _temp2() {
            const timeBetweenFrames = (_this._now() - start) / count;
            _this._autoSize.offsetTimeTarget = timeBetweenFrames;
            _this._autoSize.offsetTimeDelta = timeBetweenFrames / 3;

            if (_this._referenceRequestAnimationFrame === undefined) {
              _this._realLastTimestamp = undefined;
              _this._referenceRequestAnimationFrame = window.requestAnimationFrame(_this._mainLoop.bind(_this));
            }
          }

          const start = _this._now();

          const count = 3;
          let i = count;

          const _temp = _for(function () {
            return i--;
          }, void 0, function () {
            return Promise.resolve(new Promise(resolve => requestAnimationFrame(resolve))).then(function () {});
          });

          return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }

    resize() {
      if (this._scene && this._scene.resize) {
        this._scene.resize();
      }

      return this;
    }

    switchScene(scene, sceneParameter) {
      if (sceneParameter === void 0) {
        sceneParameter = undefined;
      }

      if (scene) {
        this._newScene = scene;
        this._sceneParameter = sceneParameter;
      }

      return this;
    }

    _now() {
      return window.performance ? performance.now() : Date.now();
    }

    _mainLoop(timestamp) {
      if (!this._referenceRequestAnimationFrame) return;
      this._referenceRequestAnimationFrame = window.requestAnimationFrame(this._mainLoop.bind(this));
      let isRecalculatedCanvas = this._recalculateCanvasIntend && (!this._reduceFramerate || !this._isOddFrame);

      if (isRecalculatedCanvas) {
        this._recalculateCanvas();

        this._recalculateCanvasIntend = false;
      }

      for (let i = 0; i < this._canvasCount; i++) {
        this._drawFrame[i] = Math.max(this._drawFrame[i] - 1, isRecalculatedCanvas ? 1 : 0);
      }

      if (!this._realLastTimestamp) {
        this._realLastTimestamp = timestamp;
      }

      if (!this._initializedStartTime) {
        this._initializedStartTime = timestamp;
      }

      if (this._newScene && !this._promiseSceneDestroying) {
        this._promiseSceneDestroying = Promise.resolve(this._scene ? this._scene.destroy() : undefined);

        this._promiseSceneDestroying.then(destroyParameterForNewScene => {
          this._newScene.callInit({
            run: this._runParameter,
            scene: this._sceneParameter,
            destroy: destroyParameterForNewScene
          }, this);

          this._scene = this._newScene;
          this._newScene = undefined;
          this._promiseSceneDestroying = undefined;
          this._isSceneInitialized = false;
          this._lastTimestamp = this._scene.currentTime();
          this._initializedStartTime = timestamp;
        });
      }

      if (this._scene) {
        if (this._reduceFramerate) {
          this._isOddFrame = !this._isOddFrame;
        }

        if (!this._reduceFramerate || this._isOddFrame) {
          let now = this._scene.currentTime(); // modify time by scene
          // first set a min/max


          let timePassed = this._scene.clampTime(now - this._lastTimestamp); // then maybe shift to fit a framerate


          const shiftTime = this._scene.shiftTime(timePassed);

          timePassed = timePassed + shiftTime;
          this._lastTimestamp = now + shiftTime;

          if (this._isSceneInitialized) {
            const moveFrame = timePassed !== 0 || this._moveOnce;
            this._moveOnce = false;

            const nowAutoSize = this._now();

            if (this._output.canvas[0].width) {
              for (let index = 0; index < this._canvasCount; index++) {
                const ctx = this._output.context[index];
                this.normContext(ctx);

                this._scene.initSprites(index); //this.normContext(ctx);

              }
            }

            const drawFrame = this._scene.isDrawFrame(timePassed);

            if (Array.isArray(drawFrame)) {
              for (let i = 0; i < this._canvasCount; i++) {
                this._drawFrame[i] = Math.max(this._drawFrame[i], drawFrame[i], 0);
              }
            } else {
              for (let i = 0; i < this._canvasCount; i++) {
                this._drawFrame[i] = Math.max(this._drawFrame[i], drawFrame, 0);
              }
            }

            if (moveFrame) {
              this._scene.move(timePassed);
            }

            if (this._output.canvas[0].width) {
              for (let index = 0; index < this._canvasCount; index++) {
                if (this._drawFrame[index]) {
                  this._scene.draw(index);
                }
              }
            }

            if (this._autoSize && this._autoSize.enabled) {
              const deltaTimestamp = timestamp - this._realLastTimestamp;

              if (this._autoSize.currentWaitedTime < this._autoSize.waitTime) {
                this._autoSize.currentWaitedTime += deltaTimestamp;
              } else if (moveFrame) {
                const targetTime = this._autoSize.offsetTimeTarget * (this._reduceFramerate ? 2 : 1);
                const deltaFrame = this._now() - nowAutoSize;
                const delta = (Math.abs(deltaTimestamp - targetTime) > Math.abs(deltaFrame - targetTime) ? deltaTimestamp : deltaFrame) - targetTime;

                if (Math.abs(delta) <= this._autoSize.offsetTimeDelta) {
                  this._autoSize.currentOffsetTime = this._autoSize.currentOffsetTime >= 0 ? Math.max(0, this._autoSize.currentOffsetTime - this._autoSize.offsetTimeDelta) : Math.min(0, this._autoSize.currentOffsetTime + this._autoSize.offsetTimeDelta);
                } else {
                  if (delta < 0 && this._autoSize.currentScale > this._autoSize.scaleLimitMin) {
                    this._autoSize.currentOffsetTime += delta;

                    if (this._autoSize.currentOffsetTime <= -this._autoSize.offsetTimeLimitDown) {
                      this._autoSize.currentScale = Math.max(this._autoSize.scaleLimitMin, this._autoSize.currentScale / this._autoSize.scaleFactor);
                      this._recalculateCanvasIntend = true;
                    }
                  } else if (delta > 0 && this._autoSize.currentScale < this._autoSize.scaleLimitMax) {
                    this._autoSize.currentOffsetTime += delta;

                    if (this._autoSize.currentOffsetTime >= this._autoSize.offsetTimeLimitUp) {
                      this._autoSize.currentScale = Math.min(this._autoSize.scaleLimitMax, this._autoSize.currentScale * this._autoSize.scaleFactor);
                      this._recalculateCanvasIntend = true;
                    }
                  }
                }
              }
            }
          } else {
            for (let i = 0; i < this._canvasCount; i++) {
              this.normContext(this._output.context[i]);
            }

            this._isSceneInitialized = this._scene.callLoading({
              timePassed: timestamp - this._realLastTimestamp,
              totalTimePassed: timestamp - this._initializedStartTime
            });

            if (this._isSceneInitialized) {
              this._scene.reset();

              this._lastTimestamp = this._scene.currentTime();
              this._moveOnce = true;

              if (this._autoSize) {
                this._autoSize.currentWaitedTime = 0;
              }
            }
          }
        }
      }

      this._realLastTimestamp = timestamp;
    }

    run(runParameter) {
      try {
        const _this2 = this;

        _this2._runParameter = runParameter || {};
        return Promise.resolve(_this2.stop()).then(function () {
          function _temp4() {
            // First call ever
            _this2._referenceRequestAnimationFrame = window.requestAnimationFrame(_this2._mainLoop.bind(_this2));
            return _this2;
          }

          _this2._realLastTimestamp = _this2._initializedStartTime = undefined;

          const _temp3 = function () {
            if (_this2._autoSize && !_this2._autoSize.offsetTimeTarget) {
              return Promise.resolve(_this2.recalculateFPS()).then(function () {});
            }
          }();

          return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }

    stop() {
      try {
        const _this3 = this;

        function _temp5(_this3$_scene$destroy) {
          _this3$_scene$destroy;
        }

        if (_this3._referenceRequestAnimationFrame) {
          window.cancelAnimationFrame(_this3._referenceRequestAnimationFrame);
        }

        _this3._referenceRequestAnimationFrame = undefined;
        const _this3$_scene = _this3._scene;
        return Promise.resolve(_this3$_scene ? Promise.resolve(_this3._scene.destroy()).then(_temp5) : _temp5(_this3$_scene));
      } catch (e) {
        return Promise.reject(e);
      }
    }

    destroy() {
      try {
        const _this4 = this;

        return Promise.resolve(_this4.stop()).then(function () {
          _this4._events.forEach(v => {
            v.n.removeEventListener(v.e, v.f);
          });

          _this4._events = [];
          return _this4;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }

  }

  class ImageManager {
    constructor() {
      this.Images = void 0;
      this.count = void 0;
      this.loaded = void 0;
      this._resolve = [];
      this.Images = {};
      this.count = 0;
      this.loaded = 0;
    }

    add(Images, Callbacks) {
      if (Callbacks === void 0) {
        Callbacks = undefined;
      }

      const self = this;

      for (const key in Images) {
        if (!self.Images[key]) {
          const imageSrc = Images[key];
          self.Images[key] = new window.Image();

          self.Images[key].onload = function () {
            self.loaded++;

            if (Callbacks && typeof Callbacks === "function") {
              if (self.isLoaded()) {
                Callbacks();
              }
            } else if (Callbacks && typeof Callbacks[key] === "function") {
              Callbacks[key](key, self.Images[key]);
            }

            if (self._resolve && self.isLoaded()) {
              self._resolve.forEach(c => c(undefined));

              self._resolve = [];
            }
          }; // crossOrigin makes more trouble in the browser and seems to cause slow downs
          // self.Images[key].crossOrigin = "anonymous";


          if (imageSrc.substr(0, 4) === "<svg") {
            const DOMURL = window.URL || window.webkitURL;
            const svg = new window.Blob([imageSrc], {
              type: "image/svg+xml"
            });
            self.Images[key].src = DOMURL.createObjectURL(svg);
          } else {
            if (/^(https?:)?\/\//.test(imageSrc)) {
              self.Images[key].onerror = () => {
                // load again without crossOrigin
                const img = new window.Image();
                img.onload = self.Images[key].onload;
                self.Images[key] = img;
                self.Images[key].src = imageSrc;
              };

              self.Images[key].crossOrigin = "anonymous";
            }

            self.Images[key].src = imageSrc;
          }

          self.count++;
        } else {
          if (Callbacks && typeof Callbacks[key] === "function") {
            Callbacks[key](key, self.Images[key]);
          }
        }
      }

      if (Callbacks && typeof Callbacks === "function" && self.isLoaded()) {
        Callbacks();
      }

      if (self._resolve && self.isLoaded()) {
        self._resolve.forEach(c => c(undefined));

        self._resolve = [];
      }

      return self;
    }

    reset() {
      this.Images = {};
      this.count = 0;
      this.loaded = 0;
      return this;
    }

    isLoaded() {
      return this.loaded === this.count;
    }

    getImage(nameOrImage) {
      return typeof nameOrImage === "object" ? nameOrImage : this.Images[nameOrImage];
    }

    isLoadedPromise() {
      return this.isLoaded() ? true : new Promise((resolve, reject) => {
        this._resolve.push(resolve);
      });
    }

  }

  var ImageManager$1 = new ImageManager();

  class Layer {
    constructor(canvasIds) {
      this._layer = void 0;
      this._isFunction = void 0;
      this._start = void 0;
      this._nextFree = void 0;
      this._canvasIds = void 0;
      this._layer = [];
      this._isFunction = [];
      this._start = 0;
      this._nextFree = 0;
      this._canvasIds = canvasIds === undefined ? [] : Array.isArray(canvasIds) ? canvasIds : [canvasIds];
    }

    addElement(element) {
      this.addElementForId(element);
      return element;
    }

    addElements(arrayOfElements) {
      this.addElementsForIds(arrayOfElements);
      return arrayOfElements;
    }

    addElementForId(element) {
      let len = this._layer.length;
      let id = this._nextFree;
      this._layer[id] = element;
      this._isFunction[id] = typeof element === "function";

      if (len === id) {
        len++;
      }

      let nextFree = this._nextFree + 1;

      while (nextFree !== len && this._layer[nextFree]) {
        nextFree++;
      }

      this._nextFree = nextFree;

      if (this._start > id) {
        this._start = id;
      }

      return id;
    }

    addElementsForIds(arrayOfElements) {
      let len = this._layer.length;
      let id = this._nextFree;

      if (len === id) {
        this._layer = this._layer.concat(arrayOfElements);
        this._nextFree = this._layer.length;
        arrayOfElements.forEach((v, k) => {
          this._isFunction[len + k] = typeof v === "function";
        });
        return Array.from({
          length: arrayOfElements.length
        }, (v, k) => k + len);
      } else {
        return arrayOfElements.map(element => this.addElement(element));
      }
    }

    getById(elementId) {
      return this._layer[elementId];
    }

    getIdByElement(element) {
      return this._layer.indexOf(element);
    }

    deleteByElement(element) {
      const elementId = this.getIdByElement(element);

      if (elementId >= 0) {
        this.deleteById(elementId);
      }
    }

    deleteById(elementId) {
      let len = this._layer.length - 1;

      if (len > 0 && elementId === len) {
        this._layer[elementId] = undefined;

        while (len && !this._layer[len - 1]) {
          len--;
        }

        this._layer.length = len;
        this._isFunction.length = len;
        this._nextFree = Math.min(this._nextFree, len);
        this._start = Math.min(this._start, len);
      } else if (this._layer[elementId]) {
        this._layer[elementId] = undefined;
        this._nextFree = Math.min(this._nextFree, elementId);

        if (this._start === elementId) {
          this._start = elementId + 1;
        }
      }
    }

    isCanvasId(canvasId) {
      return canvasId === undefined || !this._canvasIds.length || this._canvasIds.includes(canvasId);
    }

    forEach(callback, layerId) {
      if (layerId === void 0) {
        layerId = 0;
      }

      let index, element;
      const l = this._layer.length;

      for (index = this._start; index < l; index++) {
        element = this._layer[index];

        if (element) {
          if (callback({
            elementId: index,
            layerId,
            element,
            isFunction: this._isFunction[index],
            layer: this
          }) === false) {
            return;
          }
        }
      }
    }

    getElementsByTag(tag) {
      let result = [];
      this.forEach(_ref => {
        let {
          element,
          isFunction
        } = _ref;

        if (!isFunction) {
          const ans = element.getElementsByTag(tag);

          if (ans) {
            result = result.concat(ans);
          }
        }
      });
      return result;
    }

    play(label, timelapsed) {
      if (label === void 0) {
        label = "";
      }

      if (timelapsed === void 0) {
        timelapsed = 0;
      }

      this.forEach(_ref2 => {
        let {
          element,
          isFunction
        } = _ref2;
        return !isFunction && element.play(label, timelapsed);
      });
    }

    count() {
      let count = 0;
      const l = this._layer.length;

      for (let index = this._start; index < l; index++) {
        if (this._layer[index]) count++;
      }

      return count;
    }

    clear() {
      this._layer = [];
      this._isFunction = [];
      this._start = 0;
      this._nextFree = 0;
    }

  }

  class LayerManager {
    constructor() {
      this._layers = void 0;
      this._layers = [];
    }

    addLayer(canvasIds) {
      if (canvasIds === void 0) {
        canvasIds = undefined;
      }

      this._layers[this._layers.length] = new Layer(canvasIds);
      return this._layers[this._layers.length - 1];
    }

    addLayers(numberOfLayer, canvasIds) {
      if (numberOfLayer === void 0) {
        numberOfLayer = 1;
      }

      if (canvasIds === void 0) {
        canvasIds = undefined;
      }

      let newLayers = Array.from({
        length: numberOfLayer
      }, v => new Layer(canvasIds));
      this._layers = this._layers.concat(newLayers);
      return newLayers;
    }

    addLayerForId(canvasIds) {
      if (canvasIds === void 0) {
        canvasIds = undefined;
      }

      this._layers[this._layers.length] = new Layer(canvasIds);
      return this._layers.length - 1;
    }

    addLayersForIds(numberOfLayer, canvasIds) {
      if (numberOfLayer === void 0) {
        numberOfLayer = 1;
      }

      if (canvasIds === void 0) {
        canvasIds = undefined;
      }

      const result = Array.from({
        length: numberOfLayer
      }, (v, k) => k + this._layers.length);
      this._layers = this._layers.concat(Array.from({
        length: numberOfLayer
      }, v => new Layer(canvasIds)));
      return result;
    }

    getById(layerId) {
      return this._layers[layerId];
    }

    forEach(callback, canvasId) {
      let i;
      const l = this._layers.length;

      for (i = 0; i < l; i++) {
        if (this._layers[i].isCanvasId(canvasId)) {
          this._layers[i].forEach(callback, i);
        }
      }
    }

    play(label, timelapsed) {
      if (label === void 0) {
        label = "";
      }

      if (timelapsed === void 0) {
        timelapsed = 0;
      }

      this.forEach(_ref => {
        let {
          element,
          isFunction
        } = _ref;
        return !isFunction && element.play(label, timelapsed);
      });
    }

    getElementsByTag(tag) {
      let result = [];
      this.forEach(_ref2 => {
        let {
          element,
          isFunction
        } = _ref2;

        if (!isFunction) {
          const ans = element.getElementsByTag(tag);

          if (ans) {
            result = result.concat(ans);
          }
        }
      });
      return result;
    }

    count() {
      return this._layers.length;
    }

    clear() {
      this._layers = [];
    }

  }

  // https://github.com/simonsarris/Canvas-tutorials/blob/master/transform.js
  // Last updated November 2011
  // By Simon Sarris
  // www.simonsarris.com
  // sarris@acm.org
  //
  // Free to use and distribute at will
  // So long as you are nice to people, etc
  // Simple class for keeping track of the current transformation matrix
  // For instance:
  //    var t = new Transform();
  //    t.rotate(5);
  //    var m = t.m;
  //    ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);
  // Is equivalent to:
  //    ctx.rotate(5);
  // But now you can retrieve it :)
  // Remember that this does not account for any CSS transforms applied to the canvas
  //https://www.npmjs.com/package/canvas-get-transform
  class Transform {
    constructor() {
      this.m = [1, 0, 0, 1, 0, 0];
    }

    __constuct() {
      this.reset();
    }

    reset() {
      this.m = [1, 0, 0, 1, 0, 0];
      return this;
    }

    multiply(matrix) {
      const m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
      const m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
      const m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
      const m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
      const dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
      const dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
      this.m[0] = m11;
      this.m[1] = m12;
      this.m[2] = m21;
      this.m[3] = m22;
      this.m[4] = dx;
      this.m[5] = dy;
      return this;
    }

    invert() {
      const d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
      const m0 = this.m[3] * d;
      const m1 = -this.m[1] * d;
      const m2 = -this.m[2] * d;
      const m3 = this.m[0] * d;
      const m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
      const m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
      this.m[0] = m0;
      this.m[1] = m1;
      this.m[2] = m2;
      this.m[3] = m3;
      this.m[4] = m4;
      this.m[5] = m5;
      return this;
    }

    rotate(rad) {
      const c = Math.cos(rad);
      const s = Math.sin(rad);
      const m11 = this.m[0] * c + this.m[2] * s;
      const m12 = this.m[1] * c + this.m[3] * s;
      const m21 = this.m[0] * -s + this.m[2] * c;
      const m22 = this.m[1] * -s + this.m[3] * c;
      this.m[0] = m11;
      this.m[1] = m12;
      this.m[2] = m21;
      this.m[3] = m22;
      return this;
    }

    translate(x, y) {
      this.m[4] += this.m[0] * x + this.m[2] * y;
      this.m[5] += this.m[1] * x + this.m[3] * y;
      return this;
    }

    scale(sx, sy) {
      this.m[0] *= sx;
      this.m[1] *= sx;
      this.m[2] *= sy;
      this.m[3] *= sy;
      return this;
    }

    transformPoint(px, py) {
      const x = px;
      const y = py;
      px = x * this.m[0] + y * this.m[2] + this.m[4];
      py = x * this.m[1] + y * this.m[3] + this.m[5];
      return [px, py];
    }

    clone() {
      const n = new Transform();
      n.m = this.m.slice(0);
      return n;
    }

  }

  function ifNull(value, alternative) {
    //@ts-ignore
    return value === undefined || value === null || value === "" ? alternative : value;
  }

  class TimingDefault {
    constructor(configuration) {
      if (configuration === void 0) {
        configuration = {};
      }

      this._configuration = void 0;
      this._tickChunk = void 0;
      this._maxSkippedTickChunk = void 0;
      this._tickChunkTolerance = void 0;
      this.type = "timing";
      this.totalTimePassed = 0;
      this._configuration = configuration;
      this._tickChunk = ifNull(calc(this._configuration.tickChunk), 120);
      this._maxSkippedTickChunk = ifNull(calc(this._configuration.maxSkippedTickChunk), 120);
      this._tickChunkTolerance = ifNull(calc(this._configuration.tickChunkTolerance), 0.1);
    }

    init(_params) {}

    currentTime() {
      return window.performance ? performance.now() : Date.now();
    }

    clampTime(_ref) {
      let {
        timePassed
      } = _ref;
      const maxTime = this._tickChunk ? this._tickChunk * this._maxSkippedTickChunk : 2000;

      if (timePassed > maxTime) {
        return maxTime;
      }

      return timePassed;
    }

    shiftTime(_ref2) {
      let {
        timePassed
      } = _ref2;
      return this._tickChunk ? -(timePassed % this._tickChunk) : 0;
    }

    get tickChunk() {
      return this._tickChunk;
    }

    isChunked() {
      return !!this._tickChunk;
    }

    hasOneChunkedFrame(_ref3) {
      let {
        timePassed
      } = _ref3;
      return timePassed >= this._tickChunk - this._tickChunkTolerance;
    }

    calcFrames(_ref4) {
      let {
        timePassed
      } = _ref4;
      return Math.min(this._maxSkippedTickChunk, Math.floor((timePassed + this._tickChunkTolerance) / this._tickChunk));
    }

  }

  const _iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";

  function _settle(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }

          value = value.v;
        } else {
          value.o = _settle.bind(null, pact, state);
          return;
        }
      }

      if (value && value.then) {
        value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
        return;
      }

      pact.s = state;
      pact.v = value;
      const observer = pact.o;

      if (observer) {
        observer(pact);
      }
    }
  }

  const _Pact = /*#__PURE__*/function () {
    function _Pact() {}

    _Pact.prototype.then = function (onFulfilled, onRejected) {
      const result = new _Pact();
      const state = this.s;

      if (state) {
        const callback = state & 1 ? onFulfilled : onRejected;

        if (callback) {
          try {
            _settle(result, 1, callback(this.v));
          } catch (e) {
            _settle(result, 2, e);
          }

          return result;
        } else {
          return this;
        }
      }

      this.o = function (_this) {
        try {
          const value = _this.v;

          if (_this.s & 1) {
            _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle(result, 1, onRejected(value));
          } else {
            _settle(result, 2, value);
          }
        } catch (e) {
          _settle(result, 2, e);
        }
      };

      return result;
    };

    return _Pact;
  }();

  function _isSettledPact(thenable) {
    return thenable instanceof _Pact && thenable.s & 1;
  }

  function _forTo(array, body, check) {
    var i = -1,
        pact,
        reject;

    function _cycle(result) {
      try {
        while (++i < array.length && (!check || !check())) {
          result = body(i);

          if (result && result.then) {
            if (_isSettledPact(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
              return;
            }
          }
        }

        if (pact) {
          _settle(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle(pact || (pact = new _Pact()), 2, e);
      }
    }

    _cycle();

    return pact;
  }

  const defaultMiddlewareCommandList = {
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
  };

  function _forOf(target, body, check) {
    if (typeof target[_iteratorSymbol] === "function") {
      var iterator = target[_iteratorSymbol](),
          step,
          pact,
          reject;

      function _cycle(result) {
        try {
          while (!(step = iterator.next()).done && (!check || !check())) {
            result = body(step.value);

            if (result && result.then) {
              if (_isSettledPact(result)) {
                result = result.v;
              } else {
                result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
                return;
              }
            }
          }

          if (pact) {
            _settle(pact, 1, result);
          } else {
            pact = result;
          }
        } catch (e) {
          _settle(pact || (pact = new _Pact()), 2, e);
        }
      }

      _cycle();

      if (iterator.return) {
        var _fixup = function (value) {
          try {
            if (!step.done) {
              iterator.return();
            }
          } catch (e) {}

          return value;
        };

        if (pact && pact.then) {
          return pact.then(_fixup, function (e) {
            throw _fixup(e);
          });
        }

        _fixup();
      }

      return pact;
    } // No support for Symbol.iterator


    if (!("length" in target)) {
      throw new TypeError("Object is not iterable");
    } // Handle live collections properly


    var values = [];

    for (var i = 0; i < target.length; i++) {
      values.push(target[i]);
    }

    return _forTo(values, function (i) {
      return body(values[i]);
    }, check);
  }

  class Scene {
    constructor() {
      this._layerManager = void 0;
      this._imageManager = void 0;
      this._totalTimePassed = void 0;
      this._engine = void 0;
      this._middleware = defaultMiddlewareCommandList;
      this._stopPropagation = false;
      this._transform = void 0;
      this._transformInvert = void 0;
      this._additionalModifier = void 0;
      this._initDone = false;
      this._endTime = void 0;
      this._resetIntend = false;
      // Layer consists of Sprites
      this._layerManager = new LayerManager();
      this._totalTimePassed = 0;
      this._imageManager = ImageManager$1;
      this.middlewares = [].slice.call(arguments);

      if (!this.middlewareByType("timing")) {
        this.middlewares = [TimingDefault, ...this.middlewares];
      }
    }

    _output() {
      var _this$_engine;

      return (_this$_engine = this._engine) == null ? void 0 : _this$_engine.getOutput();
    }

    set middlewares(middlewares) {
      this._middleware = toArray(middlewares).map(configurationClassOrObject => typeof configurationClassOrObject === "function" ? new configurationClassOrObject() : configurationClassOrObject).reduce((middlewareCommandList, c) => {
        for (let command of Object.keys(middlewareCommandList)) {
          if (command in c) {
            middlewareCommandList[command].push(c);
          }
        }

        middlewareCommandList._all.push(c);

        if (!("enabled" in c)) c.enabled = true;
        if (c.type) middlewareCommandList["t_" + c.type] = [c];
        return middlewareCommandList;
      }, defaultMiddlewareCommandList);
    }

    get middlewares() {
      return this._middleware._all;
    }

    middlewareByType(type) {
      const objs = this._middleware._all.filter(c => c.type === type);

      if (objs.length) {
        return objs[objs.length - 1];
      }
    }

    has(command) {
      return command in this._middleware || this._middleware._all.some(c => command in c);
    }

    do(command, params, defaultValue, func) {
      let objs = this._middleware[command] || this._middleware._all.filter(c => command in c);

      objs = objs.filter(v => v.enabled);

      if (!objs.length) {
        return defaultValue;
      }

      const fullParams = this._param(params);

      return func(objs, fullParams, defaultValue);
    }

    map(command, params) {
      return this.do(command, params, [], (objs, fullParams) => {
        return objs.map(c => c[command](fullParams));
      });
    }

    pipe(command, params, pipe) {
      if (pipe === void 0) {
        pipe = undefined;
      }

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

    pipeBack(command, params, pipe) {
      if (pipe === void 0) {
        pipe = undefined;
      }

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

    pipeMax(command, params, pipe) {
      if (pipe === void 0) {
        pipe = undefined;
      }

      return this.do(command, params, Array.isArray(pipe) ? pipe.map(p => p - 0) : pipe - 0, (objs, fullParams, pipe) => {
        let res = pipe;
        this._stopPropagation = false;

        if (Array.isArray(res)) {
          // res is number
          for (let c of objs) {
            let newRes = c[command](fullParams, res);

            if (Array.isArray(newRes)) {
              res = res.map((v, i) => Math.max(v, newRes[i]));
            } else {
              res = res.map((v, i) => Math.max(v, newRes));
            }

            if (this._stopPropagation) break;
          }
        } else {
          for (let c of objs) {
            let newRes = c[command](fullParams, res);

            if (Array.isArray(newRes)) {
              res = newRes.map(v => Math.max(v, res));
            } else {
              res = Math.max(newRes, res);
            }

            if (this._stopPropagation) break;
          }
        }

        return res;
      });
    }

    pipeAsync(command, params, pipe) {
      if (pipe === void 0) {
        pipe = undefined;
      }

      try {
        const _this = this;

        return Promise.resolve(_this.do(command, params, pipe, function (objs, fullParams) {
          try {
            let _interrupt;

            let res = pipe;
            _this._stopPropagation = false;

            const _temp = _forOf(objs, function (c) {
              return Promise.resolve(c[command](fullParams, res)).then(function (_c$command) {
                res = _c$command;

                if (_this._stopPropagation) {
                  _interrupt = 1;
                }
              });
            }, function () {
              return _interrupt;
            });

            return Promise.resolve(_temp && _temp.then ? _temp.then(function () {
              return res;
            }) : res);
          } catch (e) {
            return Promise.reject(e);
          }
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }

    value(command, params) {
      if (params === void 0) {
        params = undefined;
      }

      let objs = this._middleware[command] || this._middleware._all.filter(c => command in c);

      objs.filter(v => v.enabled);

      if (!objs.length) {
        return undefined;
      }

      const obj = objs[objs.length - 1];
      return typeof obj[command] === 'function' ? obj[command].call(obj, this._param(params || {})) : obj[command];
    }

    stopPropagation() {
      this._stopPropagation = true;
    }

    currentTime() {
      return this.pipe("currentTime", {});
    }

    clampTime(timePassed) {
      return this.pipe("clampTime", {
        timePassed
      });
    }

    shiftTime(timePassed) {
      return this.pipe("shiftTime", {
        timePassed
      });
    }

    cacheClear() {
      this._transform = undefined;
      this._transformInvert = undefined;
    }

    viewport() {
      if (!this._engine) return new Transform();

      if (!this._transform) {
        this._transform = this.pipe("viewport", {}, new Transform());
        this._transformInvert = undefined;
      }

      return this._transform;
    }

    transformPoint(x, y, scale) {
      if (scale === void 0) {
        scale = this._additionalModifier.scaleCanvas;
      }

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

      Promise.all(this.map("init", {
        parameter
      })).then(res => {
        this._initDone = true;
      });
    }

    get additionalModifier() {
      return this._additionalModifier;
    }

    updateAdditionalModifier() {
      const output = this._output();

      this._additionalModifier = this.pipe("additionalModifier", {}, {
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
      });
    }

    resize() {
      const output = this._output();

      this.updateAdditionalModifier();
      this.pipe("resize", {});

      this._layerManager.forEach(_ref => {
        let {
          element,
          isFunction
        } = _ref;

        if (!isFunction) {
          element.resize(output, this._additionalModifier);
        }
      });
    }

    destroy() {
      try {
        const _this2 = this;

        return Promise.resolve(_this2.pipeAsync("destroy", {})).then(function (parameter) {
          _this2._initDone = false;
          return parameter;
        });
      } catch (e) {
        return Promise.reject(e);
      }
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

    _param(additionalParameter) {
      if (additionalParameter === void 0) {
        additionalParameter = undefined;
      }

      return Object.assign({
        engine: this._engine,
        scene: this,
        imageManager: this._imageManager,
        layerManager: this._layerManager,
        totalTimePassed: this._totalTimePassed,
        output: this._output()
      }, additionalParameter);
    }

    callLoading(args) {
      if (this._imageManager.isLoaded() && this._initDone) {
        this._endTime = this.value("endTime");
        const progress = "Click to play";
        this.value("loading", { ...args,
          progress
        });
        return true;
      }

      const progress = this._imageManager.count ? this._imageManager.loaded / this._imageManager.count : "Loading...";
      this.value("loading", { ...args,
        progress
      });
      return false;
    }

    fixedUpdate(timePassed, lastCall) {
      this.map("fixedUpdate", {
        timePassed,
        lastCall
      });
    }

    isDrawFrame(timePassed) {
      return this.pipeMax("isDrawFrame", {
        timePassed
      }, timePassed !== 0);
    }

    move(timePassed) {
      // calc total time
      this._totalTimePassed += timePassed;

      if (this._resetIntend) {
        this.reset(); // Jump back?
      } else if (timePassed < 0) {
        // Back to the beginning
        timePassed = this._totalTimePassed;
        this.reset();
        this.initSprites();
        this._totalTimePassed = timePassed;
      } else if (this._endTime && this._endTime <= this._totalTimePassed) {
        // set timepassed to match endtime
        timePassed -= this._totalTimePassed - this._endTime;
        this._totalTimePassed = this._endTime; // End Engine

        this.map("end", {
          timePassed
        });
      }

      if (this.value("isChunked")) {
        if (this.value("hasOneChunkedFrame", {
          timePassed
        })) {
          // how many frames should be skipped. Maximum is a skip of 2 frames
          const frames = this.value("calcFrames", {
            timePassed
          }) - 1;

          for (let calcFrame = 0; calcFrame <= frames; calcFrame++) {
            this.fixedUpdate(this.value("tickChunk", {}), calcFrame === frames);
          }
        }
      } else {
        this.fixedUpdate(timePassed, true);
      }

      this.map("update", {
        timePassed
      });

      this._layerManager.forEach(_ref2 => {
        let {
          element,
          isFunction,
          layer,
          elementId
        } = _ref2;

        if (!isFunction) {
          if (element.animate(timePassed)) {
            layer.deleteById(elementId);
          }
        }
      });
    }

    draw(canvasId) {
      this.map("draw", {
        canvasId
      });

      const context = this._output().context[canvasId];

      context.save();
      context.setTransform(...this.viewport().m);

      this._layerManager.forEach(_ref3 => {
        let {
          layer,
          layerId,
          element,
          isFunction,
          elementId
        } = _ref3;

        if (isFunction) {
          if (element(this._param({
            layerId,
            elementId,
            layer,
            context
          }))) {
            layer.deleteById(elementId);
          }
        } else {
          element.draw(context, this._additionalModifier);
        }
      }, canvasId);

      context.restore();
    }

    initSprites(canvasId) {
      if (canvasId === void 0) {
        canvasId = undefined;
      }

      const context = this._output().context[canvasId || 0];

      this._layerManager.forEach(_ref4 => {
        let {
          element,
          isFunction
        } = _ref4;

        if (!isFunction) {
          element.callInit(context, this._additionalModifier);
        }
      }, canvasId);

      this.map("initSprites", {
        canvasId
      });
    }

    resetIntend() {
      this._resetIntend = true;
    }

    reset() {
      this._totalTimePassed = 0;
      this._resetIntend = false;
      let result = this.pipe("reset", {}, new LayerManager());

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

  class Wait {
    constructor(duration) {
      this._duration = void 0;
      this._duration = calc(duration) - 0;
    }

    run(sprite, time) {
      // return time left
      return time - this._duration;
    }

  }

  var SequenceRunCommand;

  (function (SequenceRunCommand) {
    SequenceRunCommand["FORCE_DISABLE"] = "F";
    SequenceRunCommand["STOP"] = "S";
    SequenceRunCommand["REMOVE"] = "R";
  })(SequenceRunCommand || (SequenceRunCommand = {}));

  class Sequence {
    constructor() {
      this.sequences = [];
      this.lastTimestamp = 0;
      this.enabled = true;
      var sequences = [].slice.call(arguments);
      let timeWait = 0;

      if (typeof sequences[0] === "number") {
        timeWait = sequences.shift();
      } // init position-array


      this.sequences = sequences.map(sequence => {
        if (!Array.isArray(sequence)) {
          sequence = [sequence];
        }

        let thisTimeWait = timeWait;

        if (typeof sequence[0] === "number") {
          thisTimeWait = sequence.shift();
        }

        return {
          position: 0,
          timelapsed: -thisTimeWait,
          sequence: sequence.map(command => typeof command.run !== "function" ? typeof command === "number" ? new Wait(command) : {
            run: command
          } : command).filter(command => typeof command.run === "function"),
          label: sequence.reduce((arr, command, index) => {
            if (typeof command === "string") {
              arr[command] = index - Object.keys(arr).length;
            }

            return arr;
          }, {}),
          enabled: true
        };
      });
    }

    reset(timelapsed) {
      if (timelapsed === void 0) {
        timelapsed = 0;
      }

      this.sequences.forEach(sequencePosition => {
        var _sequencePosition$seq;

        sequencePosition.enabled = true;
        sequencePosition.position = 0;
        sequencePosition.timelapsed = timelapsed;
        (_sequencePosition$seq = sequencePosition.sequence[0]) == null ? void 0 : _sequencePosition$seq.reset == null ? void 0 : _sequencePosition$seq.reset(timelapsed);
      });
      this.enabled = true;
    }

    play(label, timelapsed) {
      if (label === void 0) {
        label = "";
      }

      if (timelapsed === void 0) {
        timelapsed = 0;
      }

      if (label) {
        const b = this.sequences.reduce((b, sequencePosition) => {
          if (label in sequencePosition.label) {
            var _sequencePosition$seq2;

            b = true;
            sequencePosition.position = sequencePosition.label[label];
            sequencePosition.enabled = true;
            sequencePosition.timelapsed = timelapsed;
            (_sequencePosition$seq2 = sequencePosition.sequence[sequencePosition.position]) == null ? void 0 : _sequencePosition$seq2.reset == null ? void 0 : _sequencePosition$seq2.reset();
          } else {
            b = b || sequencePosition.sequence.some(seq => seq.play == null ? void 0 : seq.play(label, timelapsed));
          }

          return b;
        }, false);

        if (b) {
          this.enabled = true;
        }

        return b;
      } else {
        this.sequences.forEach(sequencePosition => sequencePosition.enabled = true);
        this.enabled = true;
        return true;
      }
    }

    _runSequence(sprite, sequencePosition, timePassed) {
      let timeLeft = timePassed;

      while (sequencePosition.sequence[sequencePosition.position] && timeLeft >= 0) {
        sequencePosition.timelapsed += timeLeft;

        if (sequencePosition.timelapsed < 0) {
          return -1;
        }

        const res = sequencePosition.sequence[sequencePosition.position].run(sprite, sequencePosition.timelapsed);

        if (res === true) {
          timeLeft = 0;
        } else if (res === false) {
          return -1;
        } else if (res === SequenceRunCommand.FORCE_DISABLE) {
          sequencePosition.enabled = false;
          this.enabled = false;
          return timePassed;
        } else if (res === SequenceRunCommand.STOP) {
          sequencePosition.enabled = false;
          return timePassed;
        } else if (res === SequenceRunCommand.REMOVE) {
          return true;
        }

        timeLeft = res;

        if (timeLeft >= 0) {
          var _sequencePosition$seq3;

          // next animation
          sequencePosition.position = (sequencePosition.position + 1) % sequencePosition.sequence.length;
          (_sequencePosition$seq3 = sequencePosition.sequence[sequencePosition.position]) == null ? void 0 : _sequencePosition$seq3.reset == null ? void 0 : _sequencePosition$seq3.reset();
          sequencePosition.timelapsed = 0; // loop animation?

          if (sequencePosition.position === 0) {
            sequencePosition.enabled = false;
            return timeLeft;
          }
        }
      }

      return timeLeft;
    } // call other animations


    run(sprite, time, is_difference) {
      if (is_difference === void 0) {
        is_difference = false;
      }

      // Calculate timedifference
      let timePassed = time;

      if (!is_difference) {
        timePassed = time - this.lastTimestamp;
        this.lastTimestamp = time;
      }

      if (!this.enabled) {
        return timePassed;
      }

      const length = this.sequences.length;
      let disableVote = 0;
      let restTime = Infinity;

      for (let i = 0; i < length; i++) {
        if (this.sequences[i].enabled) {
          const timeLeft = this._runSequence(sprite, this.sequences[i], timePassed);

          if (timeLeft === true) {
            return true;
          }

          restTime = Math.min(restTime, timeLeft);
        } else {
          disableVote++;
        }
      }

      if (disableVote === length) {
        this.enabled = false;
        return timePassed;
      }

      return restTime;
    }

  }

  class SpriteBase {
    constructor(givenParameter) {
      this._needInit = true;
      this.p = void 0;
      this.p = this._parseParameterList(this._getParameterList(), givenParameter);
    }

    _parseParameterList(parameterList, givenParameter) {
      const parameterEntries = Object.entries(parameterList);
      const valueEntries = parameterEntries.map(_ref => {
        let [name, d] = _ref;
        const givenValue = givenParameter[name];
        return [name, typeof d === "function" ? d(givenValue, givenParameter) : ifNull(calc(givenValue), d)];
      });
      return Object.fromEntries(valueEntries);
    }

    _getBaseParameterList() {
      return {
        // animation
        animation: (value, givenParameter) => {
          const result = calc(value);
          return Array.isArray(result) ? new Sequence(result) : result;
        },
        // if it's rendering or not
        enabled: true,
        // if you can click it or not
        isClickable: false,
        // tags to mark the sprites
        tag: (value, givenParameter) => {
          const v = calc(value);
          return Array.isArray(v) ? v : v ? [v] : [];
        }
      };
    }

    _getParameterList() {
      return this._getBaseParameterList();
    }

    getElementsByTag(tag) {
      if (typeof tag === "function") {
        if (this.p.tag.filter(tag).length) {
          return [this];
        }
      } else {
        const aTag = Array.isArray(tag) ? tag : [tag];

        if (aTag.filter(tag => this.p.tag.includes(tag)).length) {
          return [this];
        }
      }

      return [];
    } // Animation-Funktion


    animate(timepassed) {
      if (this.p.animation) {
        // run animation
        if (this.p.animation.run(this, timepassed, true) === true) {
          // disable
          this.p.enabled = false;
          return true;
        }
      }

      return false;
    }

    play(label, timelapsed) {
      if (label === void 0) {
        label = "";
      }

      if (timelapsed === void 0) {
        timelapsed = 0;
      }

      if (this.p.animation) {
        var _this$p$animation$pla, _this$p$animation;

        (_this$p$animation$pla = (_this$p$animation = this.p.animation).play) == null ? void 0 : _this$p$animation$pla.call(_this$p$animation, label, timelapsed);
      }
    }

    init(context, additionalModifier) {}

    callInit(context, additionalModifier) {
      if (this._needInit) {
        this.init(context, additionalModifier);
        this._needInit = false;
      }
    }

    resize(output, additionalModifier) {}

    _detectHelperCallback(p, context, x, y, callback) {
      let a = false;

      if (p.enabled && p.isClickable) {
        context.save();
        context.translate(p.x, p.y);
        context.scale(p.scaleX, p.scaleY);
        context.rotate(p.rotation);
        context.beginPath();
        a = callback();
        context.restore();
      }

      return a ? this : undefined;
    }

    _detectHelper(_ref2, context, coordinateX, coordinateY, moveToCenter, callback) {
      let {
        enabled,
        isClickable,
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        scaleX = 1,
        scaleY = 1,
        rotation = 0
      } = _ref2;
      let a = false;

      if (enabled && isClickable) {
        const hw = width / 2;
        const hh = height / 2;
        context.save();

        if (moveToCenter) {
          context.translate(x + hw, y + hh);
        } else {
          context.translate(x, y);
        }

        context.scale(scaleX, scaleY);
        context.rotate(rotation);
        context.beginPath();

        if (callback) {
          a = callback(hw, hh);
        } else {
          context.rect(-hw, -hh, width, height);
          context.closePath();
          a = context.isPointInPath(coordinateX, coordinateY);
        }

        context.restore();
      }

      return a ? this : undefined;
    }

    detectDraw(context, color) {}

    detect(context, x, y) {
      return undefined;
    }

    draw(context, additionalModifier) {}

  }

  class Callback$1 extends SpriteBase {
    constructor(givenParameter) {
      if (typeof givenParameter === "function") {
        givenParameter = {
          callback: givenParameter
        };
      }

      super(givenParameter);
      this._timePassed = 0;
    }

    _getParameterList() {
      return Object.assign({}, this._getBaseParameterList(), {
        callback: v => typeof v === undefined ? () => {} : v
      });
    }

    animate(timePassed) {
      if (this.p.enabled) {
        this._timePassed += timePassed;
      }

      return super.animate(timePassed);
    }

    draw(context, additionalParameter) {
      if (this.p.enabled) {
        this.p.callback(context, this._timePassed, additionalParameter, this);
      }
    }

  }

  const degToRad$1 = Math.PI / 180;
  const CircleParameterList = {
    // position
    x: 0,
    y: 0,
    // rotation
    rotation: (value, givenParameter) => {
      return ifNull(calc(value), ifNull(calc(givenParameter.rotationInRadian), ifNull(calc(givenParameter.rotationInDegree), 0) * degToRad$1));
    },
    // scalling
    scaleX: (value, givenParameter) => {
      return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
    },
    scaleY: (value, givenParameter) => {
      return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
    },
    // alpha
    alpha: 1,
    // blending
    compositeOperation: "source-over",
    // color
    color: "#fff"
  }; // Sprite
  // Draw a Circle

  class Circle extends SpriteBase {
    constructor(givenParameter) {
      super(givenParameter);
    }

    _getParameterList() {
      return Object.assign({}, this._getBaseParameterList(), CircleParameterList);
    }

    detect(context, x, y) {
      return this._detectHelperCallback(this.p, context, x, y, () => {
        context.arc(0, 0, 1, Math.PI / 2 + this.p.rotation, Math.PI * 2.5 - this.p.rotation, false);
        return context.isPointInPath(x, y);
      });
    } // Draw-Funktion


    draw(context, additionalModifier) {
      if (this.p.enabled) {
        context.globalCompositeOperation = this.p.compositeOperation;
        context.globalAlpha = this.p.alpha * additionalModifier.alpha;
        context.save();
        context.translate(this.p.x, this.p.y);
        context.scale(this.p.scaleX, this.p.scaleY);
        context.beginPath();
        context.fillStyle = this.p.color;
        context.arc(0, 0, 1, Math.PI / 2 + this.p.rotation, Math.PI * 2.5 - this.p.rotation, false);
        context.fill();
        context.restore();
      }
    }

  }

  class Group extends SpriteBase {
    constructor(givenParameter) {
      super(givenParameter);
    }

    _getParameterList() {
      return Object.assign({}, super._getParameterList(), CircleParameterList, {
        sprite: []
      });
    }

    getElementsByTag(tag) {
      let result = super.getElementsByTag(tag);

      for (const sprite of this.p.sprite) {
        const ans = sprite.getElementsByTag(tag);

        if (ans) {
          result = result.concat(ans);
        }
      }

      return result;
    } // overwrite change


    animate(timepassed) {
      // call super
      let finished = super.animate(timepassed),
          spriteFinished = false; // animate all sprites

      if (this.p.enabled) {
        for (const sprite of this.p.sprite) {
          spriteFinished = spriteFinished || sprite.animate(timepassed) === true;
        }
      }

      if (this.p.animation) {
        return finished;
      } else {
        if (spriteFinished) {
          this.p.enabled = false;
        }

        return spriteFinished;
      }
    }

    play(label, timelapsed) {
      if (label === void 0) {
        label = "";
      }

      if (timelapsed === void 0) {
        timelapsed = 0;
      }

      if (this.p.animation) {
        var _this$p$animation$pla, _this$p$animation;

        (_this$p$animation$pla = (_this$p$animation = this.p.animation).play) == null ? void 0 : _this$p$animation$pla.call(_this$p$animation, label, timelapsed);
      }

      for (const sprite of this.p.sprite) {
        sprite.play == null ? void 0 : sprite.play(label, timelapsed);
      }
    }

    resize(output, additionalModifier) {
      for (const sprite of this.p.sprite) {
        sprite.resize(output, additionalModifier);
      }
    }

    callInit(context, additionalModifier) {
      super.callInit(context, additionalModifier);

      for (let sprite of this.p.sprite) {
        sprite.callInit(context, additionalModifier);
      }
    }

    detectDraw(context, color) {
      if (this.p.enabled) {
        for (const sprite of this.p.sprite) {
          sprite.detectDraw(context, color);
        }
      }
    }

    detect(context, x, y) {
      if (this.p.enabled) {
        for (const sprite of this.p.sprite) {
          const a = sprite.detect(context, x, y);
          if (a) return a;
        }
      }

      return undefined;
    } // draw-methode


    draw(context, additionalModifier) {
      if (this.p.enabled) {
        if (this.p.alpha < 1) {
          additionalModifier = Object.assign({}, additionalModifier);
          additionalModifier.alpha *= this.p.alpha;
        }

        context.save();
        context.translate(this.p.x, this.p.y);
        context.scale(this.p.scaleX, this.p.scaleY);
        context.rotate(this.p.rotation); // draw all sprites

        for (const sprite of this.p.sprite) {
          sprite.draw(context, additionalModifier);
        }

        context.restore();
      }
    }

  }

  class Canvas extends Group {
    constructor(givenParameter) {
      super(givenParameter);
      this._currentGridSize = void 0;
      this._drawFrame = 2;
      this._temp_canvas = void 0;
      this._tctx = void 0;
    }

    _getParameterList() {
      return Object.assign({}, super._getParameterList(), {
        // x,y,width,height without default to enable norm
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined,
        canvasWidth: undefined,
        canvasHeight: undefined,
        gridSize: undefined,
        compositeOperation: "source-over",
        norm: (value, givenParameter) => ifNull(calc(value), calc(givenParameter.x) === undefined && calc(givenParameter.y) === undefined && calc(givenParameter.width) === undefined && calc(givenParameter.height) === undefined),
        isDrawFrame: (value, givenParameter) => ifNull(value, 1)
      });
    }

    _generateTempCanvas(additionalModifier) {
      const w = additionalModifier.widthInPixel;
      const h = additionalModifier.heightInPixel;
      const p = this.p;
      this._temp_canvas = document.createElement("canvas");

      if (p.canvasWidth && p.canvasHeight) {
        this._temp_canvas.width = p.canvasWidth;
        this._temp_canvas.height = p.canvasHeight;
      } else if (p.gridSize) {
        this._currentGridSize = p.gridSize;
        this._temp_canvas.width = Math.round(this._currentGridSize);
        this._temp_canvas.height = Math.round(this._currentGridSize);
      } else {
        this._temp_canvas.width = Math.round(w / p.scaleX);
        this._temp_canvas.height = Math.round(h / p.scaleY);
      }

      this._tctx = this._temp_canvas.getContext("2d");
    }

    _normalizeFullScreen(additionalModifier) {
      const p = this.p;

      if (p.norm || p.x === undefined) {
        p.x = additionalModifier.visibleScreen.x;
      }

      if (p.norm || p.y === undefined) {
        p.y = additionalModifier.visibleScreen.y;
      }

      if (p.norm || p.width === undefined) {
        p.width = additionalModifier.visibleScreen.width;
      }

      if (p.norm || p.height === undefined) {
        p.height = additionalModifier.visibleScreen.height;
      }
    }

    _copyCanvas(additionalModifier) {
      const p = this.p;

      if (this._temp_canvas && this._currentGridSize !== p.gridSize && !p.canvasWidth) {
        const oldTempCanvas = this._temp_canvas;

        this._generateTempCanvas(additionalModifier);

        this._tctx.globalCompositeOperation = "copy";

        this._tctx.drawImage(oldTempCanvas, 0, 0, oldTempCanvas.width, oldTempCanvas.height, 0, 0, this._temp_canvas.width, this._temp_canvas.height);

        this._tctx.globalCompositeOperation = "source-over";
        this._drawFrame = 2;
      }

      this._normalizeFullScreen(additionalModifier);
    }

    resize(output, additionalModifier) {
      this._copyCanvas(additionalModifier);

      super.resize(output, additionalModifier);
    }

    detect(context, x, y) {
      return this._detectHelper(this.p, context, x, y, false);
    }

    init(context, additionalModifier) {
      this._generateTempCanvas(additionalModifier);

      this._normalizeFullScreen(additionalModifier);
    } // draw-methode


    draw(context, additionalModifier) {
      const p = this.p;

      if (p.enabled) {
        if (p.gridSize && this._currentGridSize !== p.gridSize) {
          this._copyCanvas(additionalModifier);
        }

        this._drawFrame = Math.max(this._drawFrame - 1, calc(p.isDrawFrame, context, additionalModifier));
        const w = p.width,
              h = p.height,
              wh = w / 2,
              hh = h / 2,
              tw = this._temp_canvas.width,
              th = this._temp_canvas.height;

        if (this._drawFrame) {
          this._tctx.textBaseline = "middle";
          this._tctx.textAlign = "center";
          this._tctx.globalAlpha = 1;
          this._tctx.globalCompositeOperation = "source-over";

          this._tctx.save(); // draw all sprites


          const cam = additionalModifier.cam;

          if (p.norm && cam) {
            const scale = Math.max(tw, th) / 2;

            this._tctx.translate(tw / 2, th / 2);

            this._tctx.scale(scale, scale);

            this._tctx.scale(cam.zoom, cam.zoom);

            this._tctx.translate(-cam.x, -cam.y);
          }

          for (const sprite of p.sprite) {
            sprite.draw(this._tctx, p.norm ? Object.assign({}, additionalModifier, {
              alpha: 1,
              widthInPixel: tw,
              heightInPixel: th
            }) : {
              alpha: 1,
              x: 0,
              y: 0,
              width: tw,
              height: th,
              widthInPixel: tw,
              heightInPixel: th,
              scaleCanvas: 1,
              visibleScreen: {
                x: 0,
                y: 0,
                width: tw,
                height: th
              },
              fullScreen: {
                x: 0,
                y: 0,
                width: tw,
                height: th
              }
            });
          }

          this._tctx.restore();
        }

        context.save();
        context.globalCompositeOperation = p.compositeOperation;
        context.globalAlpha = p.alpha * additionalModifier.alpha;
        context.translate(p.x + wh, p.y + hh);
        context.scale(p.scaleX, p.scaleY);
        context.rotate(p.rotation);
        context.drawImage(this._temp_canvas, 0, 0, tw, th, -wh, -hh, w, h);
        context.restore();
      }
    }

  }

  class Emitter extends Group {
    constructor(givenParameter) {
      super(givenParameter.self || {});
      let count = ifNull(calc(givenParameter.count), 1);
      this.p.sprite = [];
      const classToEmit = givenParameter.class;

      for (let i = 0; i < count; i++) {
        const parameter = Object.entries(givenParameter).reduce((p, _ref) => {
          let [index, value] = _ref;

          if (["self", "class", "count"].includes(index)) {
            return p;
          } // @ts-ignore


          p[index] = calc(value, i);
          return p;
        }, {});
        this.p.sprite[i] = new classToEmit(parameter);
      }
    }

  }

  class FastBlur extends SpriteBase {
    constructor(givenParameter) {
      super(givenParameter);
      this._temp_canvas = void 0;
      this._currentGridSize = void 0;
      this._tctx = void 0;
    }

    _getParameterList() {
      return Object.assign({}, super._getParameterList(), {
        // x,y,width,height without default to enable norm
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined,
        gridSize: undefined,
        darker: 0,
        pixel: false,
        clear: false,
        norm: (value, givenParameter) => ifNull(calc(value), calc(givenParameter.x) === undefined && calc(givenParameter.y) === undefined && calc(givenParameter.width) === undefined && calc(givenParameter.height) === undefined),
        // scalling
        scaleX: (value, givenParameter) => {
          return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
        },
        scaleY: (value, givenParameter) => {
          return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
        },
        // alpha
        alpha: 1,
        compositeOperation: "source-over"
      });
    }

    _generateTempCanvas(additionalModifier) {
      const w = additionalModifier.widthInPixel;
      const h = additionalModifier.heightInPixel;
      const p = this.p;
      this._temp_canvas = document.createElement("canvas");

      if (p.gridSize) {
        this._currentGridSize = p.gridSize;
        this._temp_canvas.width = Math.round(this._currentGridSize);
        this._temp_canvas.height = Math.round(this._currentGridSize);
      } else {
        this._temp_canvas.width = Math.ceil(w / p.scaleX);
        this._temp_canvas.height = Math.ceil(h / p.scaleY);
      }

      this._tctx = this._temp_canvas.getContext("2d");
      this._tctx.globalCompositeOperation = "source-over";
      this._tctx.globalAlpha = 1;
    }

    normalizeFullScreen(additionalModifier) {
      const p = this.p;

      if (p.norm || p.x === undefined) {
        p.x = additionalModifier.visibleScreen.x;
      }

      if (p.norm || p.y === undefined) {
        p.y = additionalModifier.visibleScreen.y;
      }

      if (p.norm || p.width === undefined) {
        p.width = additionalModifier.visibleScreen.width;
      }

      if (p.norm || p.height === undefined) {
        p.height = additionalModifier.visibleScreen.height;
      }
    }

    resize(output, additionalModifier) {
      if (this._temp_canvas && this._currentGridSize !== this.p.gridSize) {
        const oldTempCanvas = this._temp_canvas;

        this._generateTempCanvas(additionalModifier);

        this._tctx.globalCompositeOperation = "copy";

        this._tctx.drawImage(oldTempCanvas, 0, 0, oldTempCanvas.width, oldTempCanvas.height, 0, 0, this._temp_canvas.width, this._temp_canvas.height);

        this._tctx.globalCompositeOperation = "source-over";
      }

      this.normalizeFullScreen(additionalModifier);
    }

    detect(context, x, y) {
      return this._detectHelper(this.p, context, x, y, false);
    }

    init(context, additionalModifier) {
      this._generateTempCanvas(additionalModifier);

      this.normalizeFullScreen(additionalModifier);
    } // draw-methode


    draw(context, additionalModifier) {
      const p = this.p;

      if (p.enabled && p.alpha > 0) {
        if (p.gridSize && this._currentGridSize !== p.gridSize) {
          this.resize(undefined, additionalModifier);
        }

        const a = p.alpha * additionalModifier.alpha,
              w = p.width,
              h = p.height,
              targetW = this._temp_canvas.width,
              targetH = this._temp_canvas.height;

        if (a > 0 && targetW && targetH) {
          var _this$additionalBlur;

          this._tctx.globalCompositeOperation = "copy";
          this._tctx.globalAlpha = 1;

          this._tctx.drawImage(context.canvas, 0, 0, context.canvas.width, context.canvas.height, 0, 0, targetW, targetH);

          if (p.darker > 0) {
            this._tctx.globalCompositeOperation = p.clear ? "source-atop" : "source-over"; // "source-atop"; source-atop works with transparent background but source-over is much faster

            this._tctx.fillStyle = "rgba(0,0,0," + p.darker + ")";

            this._tctx.fillRect(0, 0, targetW, targetH);
          } // @ts-ignore


          (_this$additionalBlur = this.additionalBlur) == null ? void 0 : _this$additionalBlur.call(this, targetW, targetH, additionalModifier); // optional: clear screen

          if (p.clear) {
            context.globalCompositeOperation = "source-over";
            context.globalAlpha = 1;
            context.clearRect(p.x, p.y, w, h);
          }

          context.globalCompositeOperation = p.compositeOperation;
          context.globalAlpha = a;
          const oldValue = context.imageSmoothingEnabled;
          context.imageSmoothingEnabled = !p.pixel;
          context.drawImage(this._temp_canvas, 0, 0, targetW, targetH, p.x, p.y, w, h);
          context.imageSmoothingEnabled = oldValue;
        }
      } else {
        // optional: clear screen
        if (p.clear) {
          if (!p.x) {
            p.x = additionalModifier.x;
          }

          if (!p.y) {
            p.y = additionalModifier.y;
          }

          if (!p.width) {
            p.width = additionalModifier.width;
          }

          if (!p.height) {
            p.height = additionalModifier.height;
          }

          context.clearRect(p.x, p.y, p.width, p.height);
        }
      }
    }

  }

  exports.Position = void 0;

  (function (Position) {
    Position[Position["LEFT_TOP"] = 0] = "LEFT_TOP";
    Position[Position["CENTER"] = 1] = "CENTER";
  })(exports.Position || (exports.Position = {}));

  // Draw a Image

  class Image$1 extends SpriteBase {
    constructor(givenParameter) {
      super(givenParameter);
      this._currentTintKey = void 0;
      this._normScale = void 0;
      this._temp_canvas = void 0;
      this._tctx = void 0;
    }

    _getParameterList() {
      return Object.assign({}, super._getParameterList(), CircleParameterList, {
        // set image
        image: v => ImageManager$1.getImage(calc(v)),
        // relative position
        position: exports.Position.CENTER,
        // cutting for sprite stripes
        frameX: 0,
        frameY: 0,
        frameWidth: 0,
        frameHeight: 0,
        width: undefined,
        height: undefined,
        // autoscale to max
        norm: false,
        normCover: false,
        normToScreen: false,
        clickExact: false,
        color: "#FFF",
        tint: 0
      });
    }

    resize(output, additionalModifier) {
      this._needInit = true;
    }

    init(context, additionalModifier) {
      const p = this.p;
      const frameWidth = p.frameWidth || p.image.width;
      const frameHeight = p.frameHeight || p.image.height;
      this._normScale = p.normToScreen ? p.normCover ? Math.max(additionalModifier.fullScreen.width / frameWidth, additionalModifier.fullScreen.height / frameHeight) : p.norm ? Math.min(additionalModifier.fullScreen.width / frameWidth, additionalModifier.fullScreen.height / frameHeight) : 1 : p.normCover ? Math.max(additionalModifier.width / frameWidth, additionalModifier.height / frameHeight) : p.norm ? Math.min(additionalModifier.width / frameWidth, additionalModifier.height / frameHeight) : 1;
    }

    _tintCacheKey() {
      const frameWidth = this.p.frameWidth || this.p.image.width;
      const frameHeight = this.p.frameHeight || this.p.image.height;
      return [this.p.tint, frameWidth, frameHeight, this.p.color, this.p.frameX, this.p.frameY].join(";");
    }

    _temp_context(frameWidth, frameHeight) {
      if (!this._temp_canvas) {
        this._temp_canvas = document.createElement("canvas");
        this._tctx = this._temp_canvas.getContext("2d");
      }

      this._temp_canvas.width = frameWidth;
      this._temp_canvas.height = frameHeight;
      return this._tctx;
    }

    detectDraw(context, color) {
      const p = this.p;

      if (p.enabled && p.isClickable && p.clickExact) {
        const frameWidth = p.frameWidth || p.image.width;
        const frameHeight = p.frameHeight || p.image.height;
        const sX = (p.width ? p.width : frameWidth) * this._normScale * p.scaleX;
        const sY = (p.height ? p.height : frameHeight) * this._normScale * p.scaleY;
        const isTopLeft = p.position === exports.Position.LEFT_TOP;

        const tctx = this._temp_context(frameWidth, frameHeight);

        tctx.globalAlpha = 1;
        tctx.globalCompositeOperation = "source-over";
        tctx.fillStyle = color;
        tctx.fillRect(0, 0, frameWidth, frameHeight);
        tctx.globalCompositeOperation = "destination-atop";
        tctx.drawImage(p.image, p.frameX, p.frameY, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
        context.save();
        context.translate(p.x, p.y);
        context.scale(p.scaleX, p.scaleY);
        context.rotate(p.rotation);
        context.drawImage(this._temp_canvas, 0, 0, frameWidth, frameHeight, isTopLeft ? 0 : -sX / 2, isTopLeft ? 0 : -sY / 2, sX, sY);
        context.restore();
        this._currentTintKey = undefined;
      }
    }

    detect(context, x, y) {
      if (this.p.enabled && this.p.isClickable && this.p.clickExact) return "c";
      return this._detectHelper(this.p, context, x, y, false);
    } // Draw-Funktion


    draw(context, additionalModifier) {
      const p = this.p;

      if (p.enabled && p.image && p.alpha > 0) {
        const frameWidth = p.frameWidth || p.image.width,
              frameHeight = p.frameHeight || p.image.height;
        const sX = (p.width ? p.width : frameWidth) * this._normScale * p.scaleX,
              sY = (p.height ? p.height : frameHeight) * this._normScale * p.scaleY;
        context.globalCompositeOperation = p.compositeOperation;
        context.globalAlpha = p.alpha * additionalModifier.alpha;
        const isCenter = p.position !== exports.Position.LEFT_TOP;
        let img = p.image;
        let frameX = p.frameX;
        let frameY = p.frameY;

        if (p.tint) {
          const key = this._tintCacheKey();

          if (this._currentTintKey !== key) {
            const tctx = this._temp_context(frameWidth, frameHeight);

            tctx.globalAlpha = 1;
            tctx.globalCompositeOperation = "source-over";
            tctx.clearRect(0, 0, frameWidth, frameHeight);
            tctx.globalAlpha = p.tint;
            tctx.fillStyle = p.color;
            tctx.fillRect(0, 0, frameWidth, frameHeight);
            tctx.globalAlpha = 1;
            tctx.globalCompositeOperation = "destination-atop";
            tctx.drawImage(p.image, p.frameX, p.frameY, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
            this._currentTintKey = key;
          }

          img = this._temp_canvas;
          frameX = 0;
          frameY = 0;
        }

        let cx = 0;
        let cy = 0;

        if (isCenter) {
          cx = -sX / 2;
          cy = -sY / 2;
        }

        if (p.rotation == 0) {
          context.drawImage(img, frameX, frameY, frameWidth, frameHeight, p.x + cx, p.y + cy, sX, sY);
        } else {
          context.save();
          context.translate(p.x, p.y);
          context.rotate(p.rotation);
          context.drawImage(img, frameX, frameY, frameWidth, frameHeight, cx, cy, sX, sY);
          context.restore();
        }
      }
    }

  }

  class Text extends SpriteBase {
    constructor(givenParameters) {
      super(givenParameters);
    }

    _getParameterList() {
      return Object.assign({}, this._getBaseParameterList(), CircleParameterList, {
        text: value => {
          const text = calc(value);
          return (Array.isArray(text) ? text.join('') : text) || '';
        },
        font: '2em monospace',
        position: exports.Position.CENTER,
        color: undefined,
        borderColor: undefined,
        lineWidth: 1
      });
    }

    detectDraw(context, color) {
      if (this.p.enabled && this.p.isClickable) {
        context.save();
        context.translate(this.p.x, this.p.y);
        context.scale(this.p.scaleX, this.p.scaleY);
        context.rotate(this.p.rotation);

        if (!this.p.position) {
          context.textAlign = 'left';
          context.textBaseline = 'top';
        }

        context.font = this.p.font;
        context.fillStyle = color;
        context.fillText(this.p.text, 0, 0);
        context.restore();
      }
    }

    detect(context, x, y) {
      return "c";
    } // draw-methode


    draw(context, additionalModifier) {
      if (this.p.enabled) {
        context.globalCompositeOperation = this.p.compositeOperation;
        context.globalAlpha = this.p.alpha * additionalModifier.alpha;
        context.save();

        if (!this.p.position) {
          context.textAlign = 'left';
          context.textBaseline = 'top';
        }

        context.translate(this.p.x, this.p.y);
        context.scale(this.p.scaleX, this.p.scaleY);
        context.rotate(this.p.rotation);
        context.font = this.p.font;

        if (this.p.color) {
          context.fillStyle = this.p.color;
          context.fillText(this.p.text, 0, 0);
        }

        if (this.p.borderColor) {
          context.strokeStyle = this.p.borderColor;
          context.lineWidth = this.p.lineWidth;
          context.strokeText(this.p.text, 0, 0);
        }

        context.restore();
      }
    }

  }

  /**
   * Take input from [0, n] and return it as [0, 1]
   * @hidden
   */
  function bound01(n, max) {
      if (isOnePointZero(n)) {
          n = '100%';
      }
      var isPercent = isPercentage(n);
      n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
      // Automatically convert percentage into number
      if (isPercent) {
          n = parseInt(String(n * max), 10) / 100;
      }
      // Handle floating point rounding errors
      if (Math.abs(n - max) < 0.000001) {
          return 1;
      }
      // Convert into [0, 1] range if it isn't already
      if (max === 360) {
          // If n is a hue given in degrees,
          // wrap around out-of-range values into [0, 360] range
          // then convert into [0, 1].
          n = (n < 0 ? (n % max) + max : n % max) / parseFloat(String(max));
      }
      else {
          // If n not a hue given in degrees
          // Convert into [0, 1] range if it isn't already.
          n = (n % max) / parseFloat(String(max));
      }
      return n;
  }
  /**
   * Force a number between 0 and 1
   * @hidden
   */
  function clamp01(val) {
      return Math.min(1, Math.max(0, val));
  }
  /**
   * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
   * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
   * @hidden
   */
  function isOnePointZero(n) {
      return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
  }
  /**
   * Check to see if string passed in is a percentage
   * @hidden
   */
  function isPercentage(n) {
      return typeof n === 'string' && n.indexOf('%') !== -1;
  }
  /**
   * Return a valid alpha value [0,1] with all invalid values being set to 1
   * @hidden
   */
  function boundAlpha(a) {
      a = parseFloat(a);
      if (isNaN(a) || a < 0 || a > 1) {
          a = 1;
      }
      return a;
  }
  /**
   * Replace a decimal with it's percentage value
   * @hidden
   */
  function convertToPercentage(n) {
      if (n <= 1) {
          return "".concat(Number(n) * 100, "%");
      }
      return n;
  }
  /**
   * Force a hex value to have 2 characters
   * @hidden
   */
  function pad2(c) {
      return c.length === 1 ? '0' + c : String(c);
  }

  // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
  // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
  /**
   * Handle bounds / percentage checking to conform to CSS color spec
   * <http://www.w3.org/TR/css3-color/>
   * *Assumes:* r, g, b in [0, 255] or [0, 1]
   * *Returns:* { r, g, b } in [0, 255]
   */
  function rgbToRgb(r, g, b) {
      return {
          r: bound01(r, 255) * 255,
          g: bound01(g, 255) * 255,
          b: bound01(b, 255) * 255,
      };
  }
  /**
   * Converts an RGB color value to HSL.
   * *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
   * *Returns:* { h, s, l } in [0,1]
   */
  function rgbToHsl(r, g, b) {
      r = bound01(r, 255);
      g = bound01(g, 255);
      b = bound01(b, 255);
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h = 0;
      var s = 0;
      var l = (max + min) / 2;
      if (max === min) {
          s = 0;
          h = 0; // achromatic
      }
      else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
              case r:
                  h = (g - b) / d + (g < b ? 6 : 0);
                  break;
              case g:
                  h = (b - r) / d + 2;
                  break;
              case b:
                  h = (r - g) / d + 4;
                  break;
          }
          h /= 6;
      }
      return { h: h, s: s, l: l };
  }
  function hue2rgb(p, q, t) {
      if (t < 0) {
          t += 1;
      }
      if (t > 1) {
          t -= 1;
      }
      if (t < 1 / 6) {
          return p + (q - p) * (6 * t);
      }
      if (t < 1 / 2) {
          return q;
      }
      if (t < 2 / 3) {
          return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
  }
  /**
   * Converts an HSL color value to RGB.
   *
   * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
   * *Returns:* { r, g, b } in the set [0, 255]
   */
  function hslToRgb(h, s, l) {
      var r;
      var g;
      var b;
      h = bound01(h, 360);
      s = bound01(s, 100);
      l = bound01(l, 100);
      if (s === 0) {
          // achromatic
          g = l;
          b = l;
          r = l;
      }
      else {
          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
      }
      return { r: r * 255, g: g * 255, b: b * 255 };
  }
  /**
   * Converts an RGB color value to HSV
   *
   * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
   * *Returns:* { h, s, v } in [0,1]
   */
  function rgbToHsv(r, g, b) {
      r = bound01(r, 255);
      g = bound01(g, 255);
      b = bound01(b, 255);
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h = 0;
      var v = max;
      var d = max - min;
      var s = max === 0 ? 0 : d / max;
      if (max === min) {
          h = 0; // achromatic
      }
      else {
          switch (max) {
              case r:
                  h = (g - b) / d + (g < b ? 6 : 0);
                  break;
              case g:
                  h = (b - r) / d + 2;
                  break;
              case b:
                  h = (r - g) / d + 4;
                  break;
          }
          h /= 6;
      }
      return { h: h, s: s, v: v };
  }
  /**
   * Converts an HSV color value to RGB.
   *
   * *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
   * *Returns:* { r, g, b } in the set [0, 255]
   */
  function hsvToRgb(h, s, v) {
      h = bound01(h, 360) * 6;
      s = bound01(s, 100);
      v = bound01(v, 100);
      var i = Math.floor(h);
      var f = h - i;
      var p = v * (1 - s);
      var q = v * (1 - f * s);
      var t = v * (1 - (1 - f) * s);
      var mod = i % 6;
      var r = [v, q, p, p, t, v][mod];
      var g = [t, v, v, q, p, p][mod];
      var b = [p, p, t, v, v, q][mod];
      return { r: r * 255, g: g * 255, b: b * 255 };
  }
  /**
   * Converts an RGB color to hex
   *
   * Assumes r, g, and b are contained in the set [0, 255]
   * Returns a 3 or 6 character hex
   */
  function rgbToHex(r, g, b, allow3Char) {
      var hex = [
          pad2(Math.round(r).toString(16)),
          pad2(Math.round(g).toString(16)),
          pad2(Math.round(b).toString(16)),
      ];
      // Return a 3 character hex if possible
      if (allow3Char &&
          hex[0].startsWith(hex[0].charAt(1)) &&
          hex[1].startsWith(hex[1].charAt(1)) &&
          hex[2].startsWith(hex[2].charAt(1))) {
          return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
      }
      return hex.join('');
  }
  /**
   * Converts an RGBA color plus alpha transparency to hex
   *
   * Assumes r, g, b are contained in the set [0, 255] and
   * a in [0, 1]. Returns a 4 or 8 character rgba hex
   */
  // eslint-disable-next-line max-params
  function rgbaToHex(r, g, b, a, allow4Char) {
      var hex = [
          pad2(Math.round(r).toString(16)),
          pad2(Math.round(g).toString(16)),
          pad2(Math.round(b).toString(16)),
          pad2(convertDecimalToHex(a)),
      ];
      // Return a 4 character hex if possible
      if (allow4Char &&
          hex[0].startsWith(hex[0].charAt(1)) &&
          hex[1].startsWith(hex[1].charAt(1)) &&
          hex[2].startsWith(hex[2].charAt(1)) &&
          hex[3].startsWith(hex[3].charAt(1))) {
          return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
      }
      return hex.join('');
  }
  /** Converts a decimal to a hex value */
  function convertDecimalToHex(d) {
      return Math.round(parseFloat(d) * 255).toString(16);
  }
  /** Converts a hex value to a decimal */
  function convertHexToDecimal(h) {
      return parseIntFromHex(h) / 255;
  }
  /** Parse a base-16 hex value into a base-10 integer */
  function parseIntFromHex(val) {
      return parseInt(val, 16);
  }
  function numberInputToObject(color) {
      return {
          r: color >> 16,
          g: (color & 0xff00) >> 8,
          b: color & 0xff,
      };
  }

  // https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json
  /**
   * @hidden
   */
  var names = {
      aliceblue: '#f0f8ff',
      antiquewhite: '#faebd7',
      aqua: '#00ffff',
      aquamarine: '#7fffd4',
      azure: '#f0ffff',
      beige: '#f5f5dc',
      bisque: '#ffe4c4',
      black: '#000000',
      blanchedalmond: '#ffebcd',
      blue: '#0000ff',
      blueviolet: '#8a2be2',
      brown: '#a52a2a',
      burlywood: '#deb887',
      cadetblue: '#5f9ea0',
      chartreuse: '#7fff00',
      chocolate: '#d2691e',
      coral: '#ff7f50',
      cornflowerblue: '#6495ed',
      cornsilk: '#fff8dc',
      crimson: '#dc143c',
      cyan: '#00ffff',
      darkblue: '#00008b',
      darkcyan: '#008b8b',
      darkgoldenrod: '#b8860b',
      darkgray: '#a9a9a9',
      darkgreen: '#006400',
      darkgrey: '#a9a9a9',
      darkkhaki: '#bdb76b',
      darkmagenta: '#8b008b',
      darkolivegreen: '#556b2f',
      darkorange: '#ff8c00',
      darkorchid: '#9932cc',
      darkred: '#8b0000',
      darksalmon: '#e9967a',
      darkseagreen: '#8fbc8f',
      darkslateblue: '#483d8b',
      darkslategray: '#2f4f4f',
      darkslategrey: '#2f4f4f',
      darkturquoise: '#00ced1',
      darkviolet: '#9400d3',
      deeppink: '#ff1493',
      deepskyblue: '#00bfff',
      dimgray: '#696969',
      dimgrey: '#696969',
      dodgerblue: '#1e90ff',
      firebrick: '#b22222',
      floralwhite: '#fffaf0',
      forestgreen: '#228b22',
      fuchsia: '#ff00ff',
      gainsboro: '#dcdcdc',
      ghostwhite: '#f8f8ff',
      goldenrod: '#daa520',
      gold: '#ffd700',
      gray: '#808080',
      green: '#008000',
      greenyellow: '#adff2f',
      grey: '#808080',
      honeydew: '#f0fff0',
      hotpink: '#ff69b4',
      indianred: '#cd5c5c',
      indigo: '#4b0082',
      ivory: '#fffff0',
      khaki: '#f0e68c',
      lavenderblush: '#fff0f5',
      lavender: '#e6e6fa',
      lawngreen: '#7cfc00',
      lemonchiffon: '#fffacd',
      lightblue: '#add8e6',
      lightcoral: '#f08080',
      lightcyan: '#e0ffff',
      lightgoldenrodyellow: '#fafad2',
      lightgray: '#d3d3d3',
      lightgreen: '#90ee90',
      lightgrey: '#d3d3d3',
      lightpink: '#ffb6c1',
      lightsalmon: '#ffa07a',
      lightseagreen: '#20b2aa',
      lightskyblue: '#87cefa',
      lightslategray: '#778899',
      lightslategrey: '#778899',
      lightsteelblue: '#b0c4de',
      lightyellow: '#ffffe0',
      lime: '#00ff00',
      limegreen: '#32cd32',
      linen: '#faf0e6',
      magenta: '#ff00ff',
      maroon: '#800000',
      mediumaquamarine: '#66cdaa',
      mediumblue: '#0000cd',
      mediumorchid: '#ba55d3',
      mediumpurple: '#9370db',
      mediumseagreen: '#3cb371',
      mediumslateblue: '#7b68ee',
      mediumspringgreen: '#00fa9a',
      mediumturquoise: '#48d1cc',
      mediumvioletred: '#c71585',
      midnightblue: '#191970',
      mintcream: '#f5fffa',
      mistyrose: '#ffe4e1',
      moccasin: '#ffe4b5',
      navajowhite: '#ffdead',
      navy: '#000080',
      oldlace: '#fdf5e6',
      olive: '#808000',
      olivedrab: '#6b8e23',
      orange: '#ffa500',
      orangered: '#ff4500',
      orchid: '#da70d6',
      palegoldenrod: '#eee8aa',
      palegreen: '#98fb98',
      paleturquoise: '#afeeee',
      palevioletred: '#db7093',
      papayawhip: '#ffefd5',
      peachpuff: '#ffdab9',
      peru: '#cd853f',
      pink: '#ffc0cb',
      plum: '#dda0dd',
      powderblue: '#b0e0e6',
      purple: '#800080',
      rebeccapurple: '#663399',
      red: '#ff0000',
      rosybrown: '#bc8f8f',
      royalblue: '#4169e1',
      saddlebrown: '#8b4513',
      salmon: '#fa8072',
      sandybrown: '#f4a460',
      seagreen: '#2e8b57',
      seashell: '#fff5ee',
      sienna: '#a0522d',
      silver: '#c0c0c0',
      skyblue: '#87ceeb',
      slateblue: '#6a5acd',
      slategray: '#708090',
      slategrey: '#708090',
      snow: '#fffafa',
      springgreen: '#00ff7f',
      steelblue: '#4682b4',
      tan: '#d2b48c',
      teal: '#008080',
      thistle: '#d8bfd8',
      tomato: '#ff6347',
      turquoise: '#40e0d0',
      violet: '#ee82ee',
      wheat: '#f5deb3',
      white: '#ffffff',
      whitesmoke: '#f5f5f5',
      yellow: '#ffff00',
      yellowgreen: '#9acd32',
  };

  /**
   * Given a string or object, convert that input to RGB
   *
   * Possible string inputs:
   * ```
   * "red"
   * "#f00" or "f00"
   * "#ff0000" or "ff0000"
   * "#ff000000" or "ff000000"
   * "rgb 255 0 0" or "rgb (255, 0, 0)"
   * "rgb 1.0 0 0" or "rgb (1, 0, 0)"
   * "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
   * "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
   * "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
   * "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
   * "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
   * ```
   */
  function inputToRGB(color) {
      var rgb = { r: 0, g: 0, b: 0 };
      var a = 1;
      var s = null;
      var v = null;
      var l = null;
      var ok = false;
      var format = false;
      if (typeof color === 'string') {
          color = stringInputToObject(color);
      }
      if (typeof color === 'object') {
          if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
              rgb = rgbToRgb(color.r, color.g, color.b);
              ok = true;
              format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
          }
          else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
              s = convertToPercentage(color.s);
              v = convertToPercentage(color.v);
              rgb = hsvToRgb(color.h, s, v);
              ok = true;
              format = 'hsv';
          }
          else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
              s = convertToPercentage(color.s);
              l = convertToPercentage(color.l);
              rgb = hslToRgb(color.h, s, l);
              ok = true;
              format = 'hsl';
          }
          if (Object.prototype.hasOwnProperty.call(color, 'a')) {
              a = color.a;
          }
      }
      a = boundAlpha(a);
      return {
          ok: ok,
          format: color.format || format,
          r: Math.min(255, Math.max(rgb.r, 0)),
          g: Math.min(255, Math.max(rgb.g, 0)),
          b: Math.min(255, Math.max(rgb.b, 0)),
          a: a,
      };
  }
  // <http://www.w3.org/TR/css3-values/#integers>
  var CSS_INTEGER = '[-\\+]?\\d+%?';
  // <http://www.w3.org/TR/css3-values/#number-value>
  var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
  // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
  var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
  // Actual matching.
  // Parentheses and commas are optional, but not required.
  // Whitespace can take the place of commas or opening paren
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var matchers = {
      CSS_UNIT: new RegExp(CSS_UNIT),
      rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
      rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
      hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
      hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
      hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
      hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
      hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
      hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
      hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
      hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  };
  /**
   * Permissive string parsing.  Take in a number of formats, and output an object
   * based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
   */
  function stringInputToObject(color) {
      color = color.trim().toLowerCase();
      if (color.length === 0) {
          return false;
      }
      var named = false;
      if (names[color]) {
          color = names[color];
          named = true;
      }
      else if (color === 'transparent') {
          return { r: 0, g: 0, b: 0, a: 0, format: 'name' };
      }
      // Try to match string input using regular expressions.
      // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
      // Just return an object and let the conversion functions handle that.
      // This way the result will be the same whether the tinycolor is initialized with string or object.
      var match = matchers.rgb.exec(color);
      if (match) {
          return { r: match[1], g: match[2], b: match[3] };
      }
      match = matchers.rgba.exec(color);
      if (match) {
          return { r: match[1], g: match[2], b: match[3], a: match[4] };
      }
      match = matchers.hsl.exec(color);
      if (match) {
          return { h: match[1], s: match[2], l: match[3] };
      }
      match = matchers.hsla.exec(color);
      if (match) {
          return { h: match[1], s: match[2], l: match[3], a: match[4] };
      }
      match = matchers.hsv.exec(color);
      if (match) {
          return { h: match[1], s: match[2], v: match[3] };
      }
      match = matchers.hsva.exec(color);
      if (match) {
          return { h: match[1], s: match[2], v: match[3], a: match[4] };
      }
      match = matchers.hex8.exec(color);
      if (match) {
          return {
              r: parseIntFromHex(match[1]),
              g: parseIntFromHex(match[2]),
              b: parseIntFromHex(match[3]),
              a: convertHexToDecimal(match[4]),
              format: named ? 'name' : 'hex8',
          };
      }
      match = matchers.hex6.exec(color);
      if (match) {
          return {
              r: parseIntFromHex(match[1]),
              g: parseIntFromHex(match[2]),
              b: parseIntFromHex(match[3]),
              format: named ? 'name' : 'hex',
          };
      }
      match = matchers.hex4.exec(color);
      if (match) {
          return {
              r: parseIntFromHex(match[1] + match[1]),
              g: parseIntFromHex(match[2] + match[2]),
              b: parseIntFromHex(match[3] + match[3]),
              a: convertHexToDecimal(match[4] + match[4]),
              format: named ? 'name' : 'hex8',
          };
      }
      match = matchers.hex3.exec(color);
      if (match) {
          return {
              r: parseIntFromHex(match[1] + match[1]),
              g: parseIntFromHex(match[2] + match[2]),
              b: parseIntFromHex(match[3] + match[3]),
              format: named ? 'name' : 'hex',
          };
      }
      return false;
  }
  /**
   * Check to see if it looks like a CSS unit
   * (see `matchers` above for definition).
   */
  function isValidCSSUnit(color) {
      return Boolean(matchers.CSS_UNIT.exec(String(color)));
  }

  var TinyColor = /** @class */ (function () {
      function TinyColor(color, opts) {
          if (color === void 0) { color = ''; }
          if (opts === void 0) { opts = {}; }
          var _a;
          // If input is already a tinycolor, return itself
          if (color instanceof TinyColor) {
              // eslint-disable-next-line no-constructor-return
              return color;
          }
          if (typeof color === 'number') {
              color = numberInputToObject(color);
          }
          this.originalInput = color;
          var rgb = inputToRGB(color);
          this.originalInput = color;
          this.r = rgb.r;
          this.g = rgb.g;
          this.b = rgb.b;
          this.a = rgb.a;
          this.roundA = Math.round(100 * this.a) / 100;
          this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
          this.gradientType = opts.gradientType;
          // Don't let the range of [0,255] come back in [0,1].
          // Potentially lose a little bit of precision here, but will fix issues where
          // .5 gets interpreted as half of the total, instead of half of 1
          // If it was supposed to be 128, this was already taken care of by `inputToRgb`
          if (this.r < 1) {
              this.r = Math.round(this.r);
          }
          if (this.g < 1) {
              this.g = Math.round(this.g);
          }
          if (this.b < 1) {
              this.b = Math.round(this.b);
          }
          this.isValid = rgb.ok;
      }
      TinyColor.prototype.isDark = function () {
          return this.getBrightness() < 128;
      };
      TinyColor.prototype.isLight = function () {
          return !this.isDark();
      };
      /**
       * Returns the perceived brightness of the color, from 0-255.
       */
      TinyColor.prototype.getBrightness = function () {
          // http://www.w3.org/TR/AERT#color-contrast
          var rgb = this.toRgb();
          return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      };
      /**
       * Returns the perceived luminance of a color, from 0-1.
       */
      TinyColor.prototype.getLuminance = function () {
          // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
          var rgb = this.toRgb();
          var R;
          var G;
          var B;
          var RsRGB = rgb.r / 255;
          var GsRGB = rgb.g / 255;
          var BsRGB = rgb.b / 255;
          if (RsRGB <= 0.03928) {
              R = RsRGB / 12.92;
          }
          else {
              // eslint-disable-next-line prefer-exponentiation-operator
              R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
          }
          if (GsRGB <= 0.03928) {
              G = GsRGB / 12.92;
          }
          else {
              // eslint-disable-next-line prefer-exponentiation-operator
              G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
          }
          if (BsRGB <= 0.03928) {
              B = BsRGB / 12.92;
          }
          else {
              // eslint-disable-next-line prefer-exponentiation-operator
              B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
          }
          return 0.2126 * R + 0.7152 * G + 0.0722 * B;
      };
      /**
       * Returns the alpha value of a color, from 0-1.
       */
      TinyColor.prototype.getAlpha = function () {
          return this.a;
      };
      /**
       * Sets the alpha value on the current color.
       *
       * @param alpha - The new alpha value. The accepted range is 0-1.
       */
      TinyColor.prototype.setAlpha = function (alpha) {
          this.a = boundAlpha(alpha);
          this.roundA = Math.round(100 * this.a) / 100;
          return this;
      };
      /**
       * Returns the object as a HSVA object.
       */
      TinyColor.prototype.toHsv = function () {
          var hsv = rgbToHsv(this.r, this.g, this.b);
          return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
      };
      /**
       * Returns the hsva values interpolated into a string with the following format:
       * "hsva(xxx, xxx, xxx, xx)".
       */
      TinyColor.prototype.toHsvString = function () {
          var hsv = rgbToHsv(this.r, this.g, this.b);
          var h = Math.round(hsv.h * 360);
          var s = Math.round(hsv.s * 100);
          var v = Math.round(hsv.v * 100);
          return this.a === 1 ? "hsv(".concat(h, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
      };
      /**
       * Returns the object as a HSLA object.
       */
      TinyColor.prototype.toHsl = function () {
          var hsl = rgbToHsl(this.r, this.g, this.b);
          return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
      };
      /**
       * Returns the hsla values interpolated into a string with the following format:
       * "hsla(xxx, xxx, xxx, xx)".
       */
      TinyColor.prototype.toHslString = function () {
          var hsl = rgbToHsl(this.r, this.g, this.b);
          var h = Math.round(hsl.h * 360);
          var s = Math.round(hsl.s * 100);
          var l = Math.round(hsl.l * 100);
          return this.a === 1 ? "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
      };
      /**
       * Returns the hex value of the color.
       * @param allow3Char will shorten hex value to 3 char if possible
       */
      TinyColor.prototype.toHex = function (allow3Char) {
          if (allow3Char === void 0) { allow3Char = false; }
          return rgbToHex(this.r, this.g, this.b, allow3Char);
      };
      /**
       * Returns the hex value of the color -with a # appened.
       * @param allow3Char will shorten hex value to 3 char if possible
       */
      TinyColor.prototype.toHexString = function (allow3Char) {
          if (allow3Char === void 0) { allow3Char = false; }
          return '#' + this.toHex(allow3Char);
      };
      /**
       * Returns the hex 8 value of the color.
       * @param allow4Char will shorten hex value to 4 char if possible
       */
      TinyColor.prototype.toHex8 = function (allow4Char) {
          if (allow4Char === void 0) { allow4Char = false; }
          return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
      };
      /**
       * Returns the hex 8 value of the color -with a # appened.
       * @param allow4Char will shorten hex value to 4 char if possible
       */
      TinyColor.prototype.toHex8String = function (allow4Char) {
          if (allow4Char === void 0) { allow4Char = false; }
          return '#' + this.toHex8(allow4Char);
      };
      /**
       * Returns the object as a RGBA object.
       */
      TinyColor.prototype.toRgb = function () {
          return {
              r: Math.round(this.r),
              g: Math.round(this.g),
              b: Math.round(this.b),
              a: this.a,
          };
      };
      /**
       * Returns the RGBA values interpolated into a string with the following format:
       * "RGBA(xxx, xxx, xxx, xx)".
       */
      TinyColor.prototype.toRgbString = function () {
          var r = Math.round(this.r);
          var g = Math.round(this.g);
          var b = Math.round(this.b);
          return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(this.roundA, ")");
      };
      /**
       * Returns the object as a RGBA object.
       */
      TinyColor.prototype.toPercentageRgb = function () {
          var fmt = function (x) { return "".concat(Math.round(bound01(x, 255) * 100), "%"); };
          return {
              r: fmt(this.r),
              g: fmt(this.g),
              b: fmt(this.b),
              a: this.a,
          };
      };
      /**
       * Returns the RGBA relative values interpolated into a string
       */
      TinyColor.prototype.toPercentageRgbString = function () {
          var rnd = function (x) { return Math.round(bound01(x, 255) * 100); };
          return this.a === 1
              ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)")
              : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
      };
      /**
       * The 'real' name of the color -if there is one.
       */
      TinyColor.prototype.toName = function () {
          if (this.a === 0) {
              return 'transparent';
          }
          if (this.a < 1) {
              return false;
          }
          var hex = '#' + rgbToHex(this.r, this.g, this.b, false);
          for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
              var _b = _a[_i], key = _b[0], value = _b[1];
              if (hex === value) {
                  return key;
              }
          }
          return false;
      };
      TinyColor.prototype.toString = function (format) {
          var formatSet = Boolean(format);
          format = format !== null && format !== void 0 ? format : this.format;
          var formattedString = false;
          var hasAlpha = this.a < 1 && this.a >= 0;
          var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith('hex') || format === 'name');
          if (needsAlphaFormat) {
              // Special case for "transparent", all other non-alpha formats
              // will return rgba when there is transparency.
              if (format === 'name' && this.a === 0) {
                  return this.toName();
              }
              return this.toRgbString();
          }
          if (format === 'rgb') {
              formattedString = this.toRgbString();
          }
          if (format === 'prgb') {
              formattedString = this.toPercentageRgbString();
          }
          if (format === 'hex' || format === 'hex6') {
              formattedString = this.toHexString();
          }
          if (format === 'hex3') {
              formattedString = this.toHexString(true);
          }
          if (format === 'hex4') {
              formattedString = this.toHex8String(true);
          }
          if (format === 'hex8') {
              formattedString = this.toHex8String();
          }
          if (format === 'name') {
              formattedString = this.toName();
          }
          if (format === 'hsl') {
              formattedString = this.toHslString();
          }
          if (format === 'hsv') {
              formattedString = this.toHsvString();
          }
          return formattedString || this.toHexString();
      };
      TinyColor.prototype.toNumber = function () {
          return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
      };
      TinyColor.prototype.clone = function () {
          return new TinyColor(this.toString());
      };
      /**
       * Lighten the color a given amount. Providing 100 will always return white.
       * @param amount - valid between 1-100
       */
      TinyColor.prototype.lighten = function (amount) {
          if (amount === void 0) { amount = 10; }
          var hsl = this.toHsl();
          hsl.l += amount / 100;
          hsl.l = clamp01(hsl.l);
          return new TinyColor(hsl);
      };
      /**
       * Brighten the color a given amount, from 0 to 100.
       * @param amount - valid between 1-100
       */
      TinyColor.prototype.brighten = function (amount) {
          if (amount === void 0) { amount = 10; }
          var rgb = this.toRgb();
          rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
          rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
          rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
          return new TinyColor(rgb);
      };
      /**
       * Darken the color a given amount, from 0 to 100.
       * Providing 100 will always return black.
       * @param amount - valid between 1-100
       */
      TinyColor.prototype.darken = function (amount) {
          if (amount === void 0) { amount = 10; }
          var hsl = this.toHsl();
          hsl.l -= amount / 100;
          hsl.l = clamp01(hsl.l);
          return new TinyColor(hsl);
      };
      /**
       * Mix the color with pure white, from 0 to 100.
       * Providing 0 will do nothing, providing 100 will always return white.
       * @param amount - valid between 1-100
       */
      TinyColor.prototype.tint = function (amount) {
          if (amount === void 0) { amount = 10; }
          return this.mix('white', amount);
      };
      /**
       * Mix the color with pure black, from 0 to 100.
       * Providing 0 will do nothing, providing 100 will always return black.
       * @param amount - valid between 1-100
       */
      TinyColor.prototype.shade = function (amount) {
          if (amount === void 0) { amount = 10; }
          return this.mix('black', amount);
      };
      /**
       * Desaturate the color a given amount, from 0 to 100.
       * Providing 100 will is the same as calling greyscale
       * @param amount - valid between 1-100
       */
      TinyColor.prototype.desaturate = function (amount) {
          if (amount === void 0) { amount = 10; }
          var hsl = this.toHsl();
          hsl.s -= amount / 100;
          hsl.s = clamp01(hsl.s);
          return new TinyColor(hsl);
      };
      /**
       * Saturate the color a given amount, from 0 to 100.
       * @param amount - valid between 1-100
       */
      TinyColor.prototype.saturate = function (amount) {
          if (amount === void 0) { amount = 10; }
          var hsl = this.toHsl();
          hsl.s += amount / 100;
          hsl.s = clamp01(hsl.s);
          return new TinyColor(hsl);
      };
      /**
       * Completely desaturates a color into greyscale.
       * Same as calling `desaturate(100)`
       */
      TinyColor.prototype.greyscale = function () {
          return this.desaturate(100);
      };
      /**
       * Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
       * Values outside of this range will be wrapped into this range.
       */
      TinyColor.prototype.spin = function (amount) {
          var hsl = this.toHsl();
          var hue = (hsl.h + amount) % 360;
          hsl.h = hue < 0 ? 360 + hue : hue;
          return new TinyColor(hsl);
      };
      /**
       * Mix the current color a given amount with another color, from 0 to 100.
       * 0 means no mixing (return current color).
       */
      TinyColor.prototype.mix = function (color, amount) {
          if (amount === void 0) { amount = 50; }
          var rgb1 = this.toRgb();
          var rgb2 = new TinyColor(color).toRgb();
          var p = amount / 100;
          var rgba = {
              r: (rgb2.r - rgb1.r) * p + rgb1.r,
              g: (rgb2.g - rgb1.g) * p + rgb1.g,
              b: (rgb2.b - rgb1.b) * p + rgb1.b,
              a: (rgb2.a - rgb1.a) * p + rgb1.a,
          };
          return new TinyColor(rgba);
      };
      TinyColor.prototype.analogous = function (results, slices) {
          if (results === void 0) { results = 6; }
          if (slices === void 0) { slices = 30; }
          var hsl = this.toHsl();
          var part = 360 / slices;
          var ret = [this];
          for (hsl.h = (hsl.h - ((part * results) >> 1) + 720) % 360; --results;) {
              hsl.h = (hsl.h + part) % 360;
              ret.push(new TinyColor(hsl));
          }
          return ret;
      };
      /**
       * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
       */
      TinyColor.prototype.complement = function () {
          var hsl = this.toHsl();
          hsl.h = (hsl.h + 180) % 360;
          return new TinyColor(hsl);
      };
      TinyColor.prototype.monochromatic = function (results) {
          if (results === void 0) { results = 6; }
          var hsv = this.toHsv();
          var h = hsv.h;
          var s = hsv.s;
          var v = hsv.v;
          var res = [];
          var modification = 1 / results;
          while (results--) {
              res.push(new TinyColor({ h: h, s: s, v: v }));
              v = (v + modification) % 1;
          }
          return res;
      };
      TinyColor.prototype.splitcomplement = function () {
          var hsl = this.toHsl();
          var h = hsl.h;
          return [
              this,
              new TinyColor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
              new TinyColor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }),
          ];
      };
      /**
       * Compute how the color would appear on a background
       */
      TinyColor.prototype.onBackground = function (background) {
          var fg = this.toRgb();
          var bg = new TinyColor(background).toRgb();
          return new TinyColor({
              r: bg.r + (fg.r - bg.r) * fg.a,
              g: bg.g + (fg.g - bg.g) * fg.a,
              b: bg.b + (fg.b - bg.b) * fg.a,
          });
      };
      /**
       * Alias for `polyad(3)`
       */
      TinyColor.prototype.triad = function () {
          return this.polyad(3);
      };
      /**
       * Alias for `polyad(4)`
       */
      TinyColor.prototype.tetrad = function () {
          return this.polyad(4);
      };
      /**
       * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
       * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
       */
      TinyColor.prototype.polyad = function (n) {
          var hsl = this.toHsl();
          var h = hsl.h;
          var result = [this];
          var increment = 360 / n;
          for (var i = 1; i < n; i++) {
              result.push(new TinyColor({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l }));
          }
          return result;
      };
      /**
       * compare color vs current color
       */
      TinyColor.prototype.equals = function (color) {
          return this.toRgbString() === new TinyColor(color).toRgbString();
      };
      return TinyColor;
  }());

  const gradientSize = 64;
  const gradientResolution = 4;
  const gradientSizeHalf = gradientSize >> 1;

  class Particle extends SpriteBase {
    constructor(givenParameter) {
      super(givenParameter);
      this._currentScaleX = void 0;
      this._currentPixelSmoothing = false;
    }

    _getParameterList() {
      return Object.assign({}, super._getParameterList(), {
        x: 0,
        y: 0,
        // scalling
        scaleX: (value, givenParameter) => {
          return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
        },
        scaleY: (value, givenParameter) => {
          return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
        },
        color: '#FFF',
        alpha: 1,
        compositeOperation: "source-over"
      });
    }

    static getGradientImage(r, g, b) {
      let cr = r >> gradientResolution,
          cg = g >> gradientResolution,
          cb = b >> gradientResolution;

      if (!Particle._Gradient) {
        const length = 256 >> gradientResolution;
        Particle._Gradient = Array.from({
          length
        }, a => Array.from({
          length
        }, a => Array.from({
          length
        })));
      }

      if (!Particle._Gradient[cr][cg][cb]) {
        Particle._Gradient[cr][cg][cb] = Particle.generateGradientImage(cr, cg, cb);
      }

      return Particle._Gradient[cr][cg][cb];
    }

    static generateGradientImage(cr, cg, cb) {
      let canvas = document.createElement("canvas");
      canvas.width = canvas.height = gradientSize;
      let txtc = canvas.getContext("2d");
      txtc.globalAlpha = 1;
      txtc.globalCompositeOperation = "source-over";
      txtc.clearRect(0, 0, gradientSize, gradientSize);
      let grad = txtc.createRadialGradient(gradientSizeHalf, gradientSizeHalf, 0, gradientSizeHalf, gradientSizeHalf, gradientSizeHalf);
      grad.addColorStop(0, "rgba(" + ((cr << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cg << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cb << gradientResolution) + (1 << gradientResolution) - 1) + ",1)");
      grad.addColorStop(0.3, "rgba(" + ((cr << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cg << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cb << gradientResolution) + (1 << gradientResolution) - 1) + ",0.4)");
      grad.addColorStop(1, "rgba(" + ((cr << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cg << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cb << gradientResolution) + (1 << gradientResolution) - 1) + ",0)");
      txtc.fillStyle = grad;
      txtc.fillRect(0, 0, gradientSize, gradientSize);
      return canvas;
    }

    resize(output, additionalModifier) {
      this._currentScaleX = undefined;
    } // draw-methode


    draw(context, additionalModifier) {
      const p = this.p;

      if (p.enabled && p.alpha > 0) {
        // faster than: if (!(this.color instanceof TinyColor && this.color.model === 'rgb')) {
        if (!p.color || !p.color.r) {
          p.color = new TinyColor(p.color).toRgb();
        }

        if (this._currentScaleX !== p.scaleX) {
          this._currentScaleX = p.scaleX;
          this._currentPixelSmoothing = p.scaleX * additionalModifier.widthInPixel / additionalModifier.width > gradientSize;
        }

        const {
          r,
          g,
          b
        } = p.color;
        context.globalCompositeOperation = p.compositeOperation;
        context.globalAlpha = p.alpha * additionalModifier.alpha;
        context.imageSmoothingEnabled = this._currentPixelSmoothing;
        context.drawImage(Particle.getGradientImage(r, g, b), 0, 0, gradientSize, gradientSize, p.x - p.scaleX / 2, p.y - p.scaleY / 2, p.scaleX, p.scaleY);
        context.imageSmoothingEnabled = true;
      }
    }

  }

  Particle._Gradient = [[[]]];

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  /**
   * pasition v1.0.2 By dntzhang
   * Github: https://github.com/AlloyTeam/pasition
   * MIT Licensed.
   */

  var pasition = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
    module.exports = factory() ;
  }(commonjsGlobal, (function () {
  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  //https://github.com/colinmeinke/svg-arc-to-cubic-bezier

  var TAU = Math.PI * 2;

  var mapToEllipse = function mapToEllipse(_ref, rx, ry, cosphi, sinphi, centerx, centery) {
      var x = _ref.x,
          y = _ref.y;

      x *= rx;
      y *= ry;

      var xp = cosphi * x - sinphi * y;
      var yp = sinphi * x + cosphi * y;

      return {
          x: xp + centerx,
          y: yp + centery
      };
  };

  var approxUnitArc = function approxUnitArc(ang1, ang2) {
      var a = 4 / 3 * Math.tan(ang2 / 4);

      var x1 = Math.cos(ang1);
      var y1 = Math.sin(ang1);
      var x2 = Math.cos(ang1 + ang2);
      var y2 = Math.sin(ang1 + ang2);

      return [{
          x: x1 - y1 * a,
          y: y1 + x1 * a
      }, {
          x: x2 + y2 * a,
          y: y2 - x2 * a
      }, {
          x: x2,
          y: y2
      }];
  };

  var vectorAngle = function vectorAngle(ux, uy, vx, vy) {
      var sign = ux * vy - uy * vx < 0 ? -1 : 1;
      var umag = Math.sqrt(ux * ux + uy * uy);
      var vmag = Math.sqrt(ux * ux + uy * uy);
      var dot = ux * vx + uy * vy;

      var div = dot / (umag * vmag);

      if (div > 1) {
          div = 1;
      }

      if (div < -1) {
          div = -1;
      }

      return sign * Math.acos(div);
  };

  var getArcCenter = function getArcCenter(px, py, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinphi, cosphi, pxp, pyp) {
      var rxsq = Math.pow(rx, 2);
      var rysq = Math.pow(ry, 2);
      var pxpsq = Math.pow(pxp, 2);
      var pypsq = Math.pow(pyp, 2);

      var radicant = rxsq * rysq - rxsq * pypsq - rysq * pxpsq;

      if (radicant < 0) {
          radicant = 0;
      }

      radicant /= rxsq * pypsq + rysq * pxpsq;
      radicant = Math.sqrt(radicant) * (largeArcFlag === sweepFlag ? -1 : 1);

      var centerxp = radicant * rx / ry * pyp;
      var centeryp = radicant * -ry / rx * pxp;

      var centerx = cosphi * centerxp - sinphi * centeryp + (px + cx) / 2;
      var centery = sinphi * centerxp + cosphi * centeryp + (py + cy) / 2;

      var vx1 = (pxp - centerxp) / rx;
      var vy1 = (pyp - centeryp) / ry;
      var vx2 = (-pxp - centerxp) / rx;
      var vy2 = (-pyp - centeryp) / ry;

      var ang1 = vectorAngle(1, 0, vx1, vy1);
      var ang2 = vectorAngle(vx1, vy1, vx2, vy2);

      if (sweepFlag === 0 && ang2 > 0) {
          ang2 -= TAU;
      }

      if (sweepFlag === 1 && ang2 < 0) {
          ang2 += TAU;
      }

      return [centerx, centery, ang1, ang2];
  };

  var arcToBezier = function arcToBezier(_ref2) {
      var px = _ref2.px,
          py = _ref2.py,
          cx = _ref2.cx,
          cy = _ref2.cy,
          rx = _ref2.rx,
          ry = _ref2.ry,
          _ref2$xAxisRotation = _ref2.xAxisRotation,
          xAxisRotation = _ref2$xAxisRotation === undefined ? 0 : _ref2$xAxisRotation,
          _ref2$largeArcFlag = _ref2.largeArcFlag,
          largeArcFlag = _ref2$largeArcFlag === undefined ? 0 : _ref2$largeArcFlag,
          _ref2$sweepFlag = _ref2.sweepFlag,
          sweepFlag = _ref2$sweepFlag === undefined ? 0 : _ref2$sweepFlag;

      var curves = [];

      if (rx === 0 || ry === 0) {
          return [];
      }

      var sinphi = Math.sin(xAxisRotation * TAU / 360);
      var cosphi = Math.cos(xAxisRotation * TAU / 360);

      var pxp = cosphi * (px - cx) / 2 + sinphi * (py - cy) / 2;
      var pyp = -sinphi * (px - cx) / 2 + cosphi * (py - cy) / 2;

      if (pxp === 0 && pyp === 0) {
          return [];
      }

      rx = Math.abs(rx);
      ry = Math.abs(ry);

      var lambda = Math.pow(pxp, 2) / Math.pow(rx, 2) + Math.pow(pyp, 2) / Math.pow(ry, 2);

      if (lambda > 1) {
          rx *= Math.sqrt(lambda);
          ry *= Math.sqrt(lambda);
      }

      var _getArcCenter = getArcCenter(px, py, cx, cy, rx, ry, largeArcFlag, sweepFlag, sinphi, cosphi, pxp, pyp),
          _getArcCenter2 = slicedToArray(_getArcCenter, 4),
          centerx = _getArcCenter2[0],
          centery = _getArcCenter2[1],
          ang1 = _getArcCenter2[2],
          ang2 = _getArcCenter2[3];

      var segments = Math.max(Math.ceil(Math.abs(ang2) / (TAU / 4)), 1);

      ang2 /= segments;

      for (var i = 0; i < segments; i++) {
          curves.push(approxUnitArc(ang1, ang2));
          ang1 += ang2;
      }

      return curves.map(function (curve) {
          var _mapToEllipse = mapToEllipse(curve[0], rx, ry, cosphi, sinphi, centerx, centery),
              x1 = _mapToEllipse.x,
              y1 = _mapToEllipse.y;

          var _mapToEllipse2 = mapToEllipse(curve[1], rx, ry, cosphi, sinphi, centerx, centery),
              x2 = _mapToEllipse2.x,
              y2 = _mapToEllipse2.y;

          var _mapToEllipse3 = mapToEllipse(curve[2], rx, ry, cosphi, sinphi, centerx, centery),
              x = _mapToEllipse3.x,
              y = _mapToEllipse3.y;

          return { x1: x1, y1: y1, x2: x2, y2: y2, x: x, y: y };
      });
  };

  //https://github.com/jkroso/parse-svg-path/blob/master/index.js
  /**
   * expected argument lengths
   * @type {Object}
   */

  var length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0

      /**
       * segment pattern
       * @type {RegExp}
       */

  };var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;

  /**
   * parse an svg path data string. Generates an Array
   * of commands where each command is an Array of the
   * form `[command, arg1, arg2, ...]`
   *
   * @param {String} path
   * @return {Array}
   */

  function parse(path) {
      var data = [];
      path.replace(segment, function (_, command, args) {
          var type = command.toLowerCase();
          args = parseValues(args);

          // overloaded moveTo
          if (type == 'm' && args.length > 2) {
              data.push([command].concat(args.splice(0, 2)));
              type = 'l';
              command = command == 'm' ? 'l' : 'L';
          }

          while (true) {
              if (args.length == length[type]) {
                  args.unshift(command);
                  return data.push(args);
              }
              if (args.length < length[type]) throw new Error('malformed path data');
              data.push([command].concat(args.splice(0, length[type])));
          }
      });
      return data;
  }

  var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;

  function parseValues(args) {
      var numbers = args.match(number);
      return numbers ? numbers.map(Number) : [];
  }

  function shapeBox(shape) {
      var minX = shape[0][0],
          minY = shape[0][1],
          maxX = minX,
          maxY = minY;
      shape.forEach(function (curve) {
          var x1 = curve[0],
              x2 = curve[2],
              x3 = curve[4],
              x4 = curve[6],
              y1 = curve[1],
              y2 = curve[3],
              y3 = curve[5],
              y4 = curve[7];

          minX = Math.min(minX, x1, x2, x3, x4);
          minY = Math.min(minY, y1, y2, y3, y4);
          maxX = Math.max(maxX, x1, x2, x3, x4);
          maxY = Math.max(maxY, y1, y2, y3, y4);
      });

      return [minX, minY, maxX, maxY];
  }

  function boxDistance(boxA, boxB) {
      return Math.sqrt(Math.pow(boxA[0] - boxB[0], 2) + Math.pow(boxA[1] - boxB[1], 2)) + Math.sqrt(Math.pow(boxA[2] - boxB[2], 2) + Math.pow(boxA[3] - boxB[3], 2));
  }

  function curveDistance(curveA, curveB) {
      var x1 = curveA[0],
          x2 = curveA[2],
          x3 = curveA[4],
          x4 = curveA[6],
          y1 = curveA[1],
          y2 = curveA[3],
          y3 = curveA[5],
          y4 = curveA[7],
          xb1 = curveB[0],
          xb2 = curveB[2],
          xb3 = curveB[4],
          xb4 = curveB[6],
          yb1 = curveB[1],
          yb2 = curveB[3],
          yb3 = curveB[5],
          yb4 = curveB[7];

      return Math.sqrt(Math.pow(xb1 - x1, 2) + Math.pow(yb1 - y1, 2)) + Math.sqrt(Math.pow(xb2 - x2, 2) + Math.pow(yb2 - y2, 2)) + Math.sqrt(Math.pow(xb3 - x3, 2) + Math.pow(yb3 - y3, 2)) + Math.sqrt(Math.pow(xb4 - x4, 2) + Math.pow(yb4 - y4, 2));
  }

  function sortCurves(curvesA, curvesB) {

      var arrList = permuteCurveNum(curvesA.length);

      var list = [];
      arrList.forEach(function (arr) {
          var distance = 0;
          var i = 0;
          arr.forEach(function (index) {
              distance += curveDistance(curvesA[index], curvesB[i++]);
          });
          list.push({ index: arr, distance: distance });
      });

      list.sort(function (a, b) {
          return a.distance - b.distance;
      });

      var result = [];

      list[0].index.forEach(function (index) {
          result.push(curvesA[index]);
      });

      return result;
  }

  function sort(pathA, pathB) {

      var arrList = permuteNum(pathA.length);

      var list = [];
      arrList.forEach(function (arr) {
          var distance = 0;
          arr.forEach(function (index) {
              distance += boxDistance(shapeBox(pathA[index]), shapeBox(pathB[index]));
          });
          list.push({ index: arr, distance: distance });
      });

      list.sort(function (a, b) {
          return a.distance - b.distance;
      });

      var result = [];

      list[0].index.forEach(function (index) {
          result.push(pathA[index]);
      });

      return result;
  }

  function permuteCurveNum(num) {
      var arr = [];

      for (var i = 0; i < num; i++) {
          var indexArr = [];
          for (var j = 0; j < num; j++) {
              var index = j + i;
              if (index > num - 1) index -= num;
              indexArr[index] = j;
          }

          arr.push(indexArr);
      }

      return arr;
  }

  function permuteNum(num) {
      var arr = [];
      for (var i = 0; i < num; i++) {
          arr.push(i);
      }

      return permute(arr);
  }

  function permute(input) {
      var permArr = [],
          usedChars = [];
      function main(input) {
          var i, ch;
          for (i = 0; i < input.length; i++) {
              ch = input.splice(i, 1)[0];
              usedChars.push(ch);
              if (input.length == 0) {
                  permArr.push(usedChars.slice());
              }
              main(input);
              input.splice(i, 0, ch);
              usedChars.pop();
          }
          return permArr;
      }
      return main(input);
  }

  var pasition = {};
  pasition.parser = parse;

  pasition.lerpCurve = function (pathA, pathB, t) {

      return pasition.lerpPoints(pathA[0], pathA[1], pathB[0], pathB[1], t).concat(pasition.lerpPoints(pathA[2], pathA[3], pathB[2], pathB[3], t)).concat(pasition.lerpPoints(pathA[4], pathA[5], pathB[4], pathB[5], t)).concat(pasition.lerpPoints(pathA[6], pathA[7], pathB[6], pathB[7], t));
  };

  pasition.lerpPoints = function (x1, y1, x2, y2, t) {
      return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
  };

  pasition.q2b = function (x1, y1, x2, y2, x3, y3) {
      return [x1, y1, (x1 + 2 * x2) / 3, (y1 + 2 * y2) / 3, (x3 + 2 * x2) / 3, (y3 + 2 * y2) / 3, x3, y3];
  };

  pasition.path2shapes = function (path) {
      //https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
      //M = moveto
      //L = lineto
      //H = horizontal lineto
      //V = vertical lineto
      //C = curveto
      //S = smooth curveto
      //Q = quadratic Belzier curve
      //T = smooth quadratic Belzier curveto
      //A = elliptical Arc
      //Z = closepath
      //以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位(从上一个点开始)。
      var cmds = pasition.parser(path),
          preX = 0,
          preY = 0,
          j = 0,
          len = cmds.length,
          shapes = [],
          current = null,
          closeX = void 0,
          closeY = void 0,
          preCX = void 0,
          preCY = void 0,
          sLen = void 0,
          curves = void 0,
          lastCurve = void 0;

      for (; j < len; j++) {
          var item = cmds[j];
          var action = item[0];
          var preItem = cmds[j - 1];

          switch (action) {
              case 'm':
                  sLen = shapes.length;
                  shapes[sLen] = [];
                  current = shapes[sLen];
                  preX = preX + item[1];
                  preY = preY + item[2];
                  break;
              case 'M':

                  sLen = shapes.length;
                  shapes[sLen] = [];
                  current = shapes[sLen];
                  preX = item[1];
                  preY = item[2];
                  break;

              case 'l':
                  current.push([preX, preY, preX, preY, preX, preY, preX + item[1], preY + item[2]]);
                  preX += item[1];
                  preY += item[2];
                  break;

              case 'L':

                  current.push([preX, preY, item[1], item[2], item[1], item[2], item[1], item[2]]);
                  preX = item[1];
                  preY = item[2];

                  break;

              case 'h':

                  current.push([preX, preY, preX, preY, preX, preY, preX + item[1], preY]);
                  preX += item[1];
                  break;

              case 'H':
                  current.push([preX, preY, item[1], preY, item[1], preY, item[1], preY]);
                  preX = item[1];
                  break;

              case 'v':
                  current.push([preX, preY, preX, preY, preX, preY, preX, preY + item[1]]);
                  preY += item[1];
                  break;

              case 'V':
                  current.push([preX, preY, preX, item[1], preX, item[1], preX, item[1]]);
                  preY = item[1];
                  break;

              case 'C':

                  current.push([preX, preY, item[1], item[2], item[3], item[4], item[5], item[6]]);
                  preX = item[5];
                  preY = item[6];
                  break;
              case 'S':
                  if (preItem[0] === 'C' || preItem[0] === 'c') {
                      current.push([preX, preY, preX + preItem[5] - preItem[3], preY + preItem[6] - preItem[4], item[1], item[2], item[3], item[4]]);
                  } else if (preItem[0] === 'S' || preItem[0] === 's') {
                      current.push([preX, preY, preX + preItem[3] - preItem[1], preY + preItem[4] - preItem[2], item[1], item[2], item[3], item[4]]);
                  }
                  preX = item[3];
                  preY = item[4];
                  break;

              case 'c':
                  current.push([preX, preY, preX + item[1], preY + item[2], preX + item[3], preY + item[4], preX + item[5], preY + item[6]]);
                  preX = preX + item[5];
                  preY = preY + item[6];
                  break;
              case 's':
                  if (preItem[0] === 'C' || preItem[0] === 'c') {

                      current.push([preX, preY, preX + preItem[5] - preItem[3], preY + preItem[6] - preItem[4], preX + item[1], preY + item[2], preX + item[3], preY + item[4]]);
                  } else if (preItem[0] === 'S' || preItem[0] === 's') {
                      current.push([preX, preY, preX + preItem[3] - preItem[1], preY + preItem[4] - preItem[2], preX + item[1], preY + item[2], preX + item[3], preY + item[4]]);
                  }

                  preX = preX + item[3];
                  preY = preY + item[4];

                  break;
              case 'a':
                  curves = arcToBezier({
                      rx: item[1],
                      ry: item[2],
                      px: preX,
                      py: preY,
                      xAxisRotation: item[3],
                      largeArcFlag: item[4],
                      sweepFlag: item[5],
                      cx: preX + item[6],
                      cy: preY + item[7]
                  });
                  lastCurve = curves[curves.length - 1];

                  curves.forEach(function (curve, index) {
                      if (index === 0) {
                          current.push([preX, preY, curve.x1, curve.y1, curve.x2, curve.y2, curve.x, curve.y]);
                      } else {
                          current.push([curves[index - 1].x, curves[index - 1].y, curve.x1, curve.y1, curve.x2, curve.y2, curve.x, curve.y]);
                      }
                  });

                  preX = lastCurve.x;
                  preY = lastCurve.y;

                  break;

              case 'A':

                  curves = arcToBezier({
                      rx: item[1],
                      ry: item[2],
                      px: preX,
                      py: preY,
                      xAxisRotation: item[3],
                      largeArcFlag: item[4],
                      sweepFlag: item[5],
                      cx: item[6],
                      cy: item[7]
                  });
                  lastCurve = curves[curves.length - 1];

                  curves.forEach(function (curve, index) {
                      if (index === 0) {
                          current.push([preX, preY, curve.x1, curve.y1, curve.x2, curve.y2, curve.x, curve.y]);
                      } else {
                          current.push([curves[index - 1].x, curves[index - 1].y, curve.x1, curve.y1, curve.x2, curve.y2, curve.x, curve.y]);
                      }
                  });

                  preX = lastCurve.x;
                  preY = lastCurve.y;

                  break;
              case 'Q':
                  current.push(pasition.q2b(preX, preY, item[1], item[2], item[3], item[4]));
                  preX = item[3];
                  preY = item[4];

                  break;
              case 'q':
                  current.push(pasition.q2b(preX, preY, preX + item[1], preY + item[2], item[3] + preX, item[4] + preY));
                  preX += item[3];
                  preY += item[4];
                  break;

              case 'T':

                  if (preItem[0] === 'Q' || preItem[0] === 'q') {
                      preCX = preX + preItem[3] - preItem[1];
                      preCY = preY + preItem[4] - preItem[2];
                      current.push(pasition.q2b(preX, preY, preCX, preCY, item[1], item[2]));
                  } else if (preItem[0] === 'T' || preItem[0] === 't') {
                      current.push(pasition.q2b(preX, preY, preX + preX - preCX, preY + preY - preCY, item[1], item[2]));
                      preCX = preX + preX - preCX;
                      preCY = preY + preY - preCY;
                  }

                  preX = item[1];
                  preY = item[2];
                  break;

              case 't':
                  if (preItem[0] === 'Q' || preItem[0] === 'q') {
                      preCX = preX + preItem[3] - preItem[1];
                      preCY = preY + preItem[4] - preItem[2];
                      current.push(pasition.q2b(preX, preY, preCX, preCY, preX + item[1], preY + item[2]));
                  } else if (preItem[0] === 'T' || preItem[0] === 't') {
                      current.push(pasition.q2b(preX, preY, preX + preX - preCX, preY + preY - preCY, preX + item[1], preY + item[2]));
                      preCX = preX + preX - preCX;
                      preCY = preY + preY - preCY;
                  }

                  preX += item[1];
                  preY += item[2];
                  break;

              case 'Z':
                  closeX = current[0][0];
                  closeY = current[0][1];
                  current.push([preX, preY, closeX, closeY, closeX, closeY, closeX, closeY]);
                  break;
              case 'z':
                  closeX = current[0][0];
                  closeY = current[0][1];
                  current.push([preX, preY, closeX, closeY, closeX, closeY, closeX, closeY]);
                  break;
          }
      }

      return shapes;
  };

  pasition._upCurves = function (curves, count) {
      var i = 0,
          index = 0,
          len = curves.length;
      for (; i < count; i++) {
          curves.push(curves[index].slice(0));
          index++;
          if (index > len - 1) {
              index -= len;
          }
      }
  };

  function split(x1, y1, x2, y2, x3, y3, x4, y4, t) {
      return {
          left: _split(x1, y1, x2, y2, x3, y3, x4, y4, t),
          right: _split(x4, y4, x3, y3, x2, y2, x1, y1, 1 - t, true)
      };
  }

  function _split(x1, y1, x2, y2, x3, y3, x4, y4, t, reverse) {

      var x12 = (x2 - x1) * t + x1;
      var y12 = (y2 - y1) * t + y1;

      var x23 = (x3 - x2) * t + x2;
      var y23 = (y3 - y2) * t + y2;

      var x34 = (x4 - x3) * t + x3;
      var y34 = (y4 - y3) * t + y3;

      var x123 = (x23 - x12) * t + x12;
      var y123 = (y23 - y12) * t + y12;

      var x234 = (x34 - x23) * t + x23;
      var y234 = (y34 - y23) * t + y23;

      var x1234 = (x234 - x123) * t + x123;
      var y1234 = (y234 - y123) * t + y123;

      if (reverse) {
          return [x1234, y1234, x123, y123, x12, y12, x1, y1];
      }
      return [x1, y1, x12, y12, x123, y123, x1234, y1234];
  }

  pasition._splitCurves = function (curves, count) {
      var i = 0,
          index = 0;

      for (; i < count; i++) {
          var curve = curves[index];
          var cs = split(curve[0], curve[1], curve[2], curve[3], curve[4], curve[5], curve[6], curve[7], 0.5);
          curves.splice(index, 1);
          curves.splice(index, 0, cs.left, cs.right);

          index += 2;
          if (index >= curves.length - 1) {
              index = 0;
          }
      }
  };

  function sync(shapes, count) {
      var _loop = function _loop(i) {
          var shape = shapes[shapes.length - 1];
          var newShape = [];

          shape.forEach(function (curve) {
              newShape.push(curve.slice(0));
          });
          shapes.push(newShape);
      };

      for (var i = 0; i < count; i++) {
          _loop();
      }
  }

  pasition.lerp = function (pathA, pathB, t) {
      return pasition._lerp(pasition.path2shapes(pathA), pasition.path2shapes(pathB), t);
  };

  pasition.MIM_CURVES_COUNT = 100;

  pasition._preprocessing = function (pathA, pathB) {

      var lenA = pathA.length,
          lenB = pathB.length,
          clonePathA = JSON.parse(JSON.stringify(pathA)),
          clonePathB = JSON.parse(JSON.stringify(pathB));

      if (lenA > lenB) {
          sync(clonePathB, lenA - lenB);
      } else if (lenA < lenB) {
          sync(clonePathA, lenB - lenA);
      }

      clonePathA = sort(clonePathA, clonePathB);

      clonePathA.forEach(function (curves, index) {

          var lenA = curves.length,
              lenB = clonePathB[index].length;

          if (lenA > lenB) {
              if (lenA < pasition.MIM_CURVES_COUNT) {
                  pasition._splitCurves(curves, pasition.MIM_CURVES_COUNT - lenA);
                  pasition._splitCurves(clonePathB[index], pasition.MIM_CURVES_COUNT - lenB);
              } else {
                  pasition._splitCurves(clonePathB[index], lenA - lenB);
              }
          } else if (lenA < lenB) {
              if (lenB < pasition.MIM_CURVES_COUNT) {
                  pasition._splitCurves(curves, pasition.MIM_CURVES_COUNT - lenA);
                  pasition._splitCurves(clonePathB[index], pasition.MIM_CURVES_COUNT - lenB);
              } else {
                  pasition._splitCurves(curves, lenB - lenA);
              }
          }
      });

      clonePathA.forEach(function (curves, index) {
          clonePathA[index] = sortCurves(curves, clonePathB[index]);
      });

      return [clonePathA, clonePathB];
  };

  pasition._lerp = function (pathA, pathB, t) {

      var shapes = [];
      pathA.forEach(function (curves, index) {
          var newCurves = [];
          curves.forEach(function (curve, curveIndex) {
              newCurves.push(pasition.lerpCurve(curve, pathB[index][curveIndex], t));
          });
          shapes.push(newCurves);
      });
      return shapes;
  };

  pasition.animate = function (option) {
      var pathA = pasition.path2shapes(option.from);
      var pathB = pasition.path2shapes(option.to);
      var pathArr = pasition._preprocessing(pathA, pathB);

      var beginTime = new Date(),
          end = option.end || function () {},
          progress = option.progress || function () {},
          begin = option.begin || function () {},
          easing = option.easing || function (v) {
          return v;
      },
          tickId = null,
          outShape = null,
          time = option.time;

      begin(pathA);

      var tick = function tick() {
          var dt = new Date() - beginTime;
          if (dt >= time) {
              outShape = pathB;
              progress(outShape, 1);
              end(outShape);
              cancelAnimationFrame(tickId);
              return;
          }
          var percent = easing(dt / time);
          outShape = pasition._lerp(pathArr[0], pathArr[1], percent);
          progress(outShape, percent);
          tickId = requestAnimationFrame(tick);
      };
      tick();
  };

  return pasition;

  })));
  });

  class Path extends Group {
    constructor(givenParameters) {
      super(givenParameters);
      this._oldPath = void 0;
      this._path2D = new Path2D();

      if (this.p.polyfill) {
        if (typeof Path2D !== "function") {
          let head = document.getElementsByTagName("head")[0];
          let script = document.createElement("script");
          script.type = "text/javascript";
          script.src = "https://cdn.jsdelivr.net/npm/canvas-5-polyfill@0.1.5/canvas.min.js";
          head.appendChild(script);
        } else {
          // create a new context
          let ctx = document.createElement("canvas").getContext("2d"); // stroke a simple path

          ctx.stroke(new Path2D("M0,0H1")); // check it did paint something

          if (ctx.getImageData(0, 0, 1, 1).data[3]) {
            this.p.polyfill = false;
          }
        }
      }
    }

    _getParameterList() {
      return Object.assign({}, super._getParameterList(), {
        // set path
        path: undefined,
        color: undefined,
        borderColor: undefined,
        lineWidth: 1,
        clip: false,
        fixed: false,
        polyfill: true
      });
    } // helper function for changeTo


    changeToPathInit(from, to) {
      return pasition._preprocessing(typeof from === "string" ? pasition.path2shapes(from) : from, typeof to === "string" ? pasition.path2shapes(to) : to);
    }

    changeToPath(progress, data) {
      return pasition._lerp(data.pathFrom, data.pathTo, progress);
    }

    detect(context, x, y) {
      return this._detectHelper(this.p, context, x, y, false, () => {
        return context.isPointInPath(this._path2D, x, y);
      });
    } // draw-methode


    draw(context, additionalModifier) {
      const p = this.p;

      if (p.enabled) {
        const a = p.alpha * additionalModifier.alpha;

        if (this._oldPath !== p.path) {
          if (p.polyfill && typeof p.path === "string") {
            p.path = pasition.path2shapes(p.path);
          }

          if (Array.isArray(p.path)) {
            this._path2D = new Path2D();
            p.path.forEach(curve => {
              this._path2D.moveTo(curve[0][0], curve[0][1]);

              curve.forEach(points => {
                this._path2D.bezierCurveTo(points[2], points[3], points[4], points[5], points[6], points[7]);
              });

              this._path2D.closePath();
            });
          } else if (p.path instanceof Path2D) {
            this._path2D = p.path;
          } else {
            this._path2D = new Path2D(p.path);
          }

          this._oldPath = p.path;
        }

        let scaleX = p.scaleX,
            scaleY = p.scaleY;

        if (p.fixed) {
          if (scaleX == 0) {
            scaleX = Number.EPSILON;
          }

          if (scaleY == 0) {
            scaleY = Number.EPSILON;
          }
        }

        context.globalCompositeOperation = p.compositeOperation;
        context.globalAlpha = a;
        context.save();
        context.translate(p.x, p.y);
        context.scale(scaleX, scaleY);
        context.rotate(p.rotation);

        if (p.color) {
          context.fillStyle = p.color;
          context.fill(this._path2D);
        }

        context.save();

        if (p.clip) {
          context.clip(this._path2D);

          if (p.fixed) {
            context.rotate(-p.rotation);
            context.scale(1 / scaleX, 1 / scaleY);
            context.translate(-p.x, -p.y);
          }
        } // draw all sprites


        for (const sprite of p.sprite) {
          sprite.draw(context, additionalModifier);
        }

        context.restore();

        if (p.borderColor) {
          context.strokeStyle = p.borderColor;
          context.lineWidth = p.lineWidth;
          context.stroke(this._path2D);
        }

        context.restore();
      }
    }

  }

  // Draw a Circle

  class Rect extends SpriteBase {
    constructor(givenParameters) {
      super(givenParameters);
    }

    _getParameterList() {
      return Object.assign({}, super._getParameterList(), CircleParameterList, {
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined,
        borderColor: undefined,
        color: undefined,
        lineWidth: 1,
        clear: false,
        norm: (value, givenParameter) => ifNull(calc(value), calc(givenParameter.x) === undefined && calc(givenParameter.y) === undefined && calc(givenParameter.width) === undefined && calc(givenParameter.height) === undefined),
        // relative position
        position: exports.Position.CENTER
      });
    }

    _normalizeFullScreen(additionalModifier) {
      if (this.p.norm || this.p.width === undefined) {
        this.p.width = additionalModifier.visibleScreen.width;
      }

      if (this.p.norm || this.p.height === undefined) {
        this.p.height = additionalModifier.visibleScreen.height;
      }

      if (this.p.norm || this.p.x === undefined) {
        this.p.x = additionalModifier.visibleScreen.x;

        if (this.p.position === exports.Position.CENTER) {
          this.p.x += this.p.width / 2;
        }
      }

      if (this.p.norm || this.p.y === undefined) {
        this.p.y = additionalModifier.visibleScreen.y;

        if (this.p.position === exports.Position.CENTER) {
          this.p.y += this.p.height / 2;
        }
      }
    }

    resize(output, additionalModifier) {
      this._needInit = true;
    }

    init(context, additionalModifier) {
      this._normalizeFullScreen(additionalModifier);
    }

    detect(context, x, y) {
      return this._detectHelper(this.p, context, x, y, this.p.position === exports.Position.LEFT_TOP);
    } // Draw-Funktion


    draw(context, additionalModifier) {
      const p = this.p;

      if (p.enabled && p.alpha > 0) {
        context.globalCompositeOperation = p.compositeOperation;
        context.globalAlpha = p.alpha * additionalModifier.alpha;

        if (p.rotation === 0 && p.position === exports.Position.LEFT_TOP) {
          if (p.clear) {
            context.clearRect(p.x, p.y, p.width, p.height);
          } else if (p.color) {
            context.fillStyle = p.color;
            context.fillRect(p.x, p.y, p.width, p.height);
          }

          if (p.borderColor) {
            context.beginPath();
            context.lineWidth = p.lineWidth;
            context.strokeStyle = p.borderColor;
            context.rect(p.x, p.y, p.width, p.height);
            context.stroke();
          }
        } else {
          let hw = p.width / 2;
          let hh = p.height / 2;
          context.save();

          if (p.position === exports.Position.LEFT_TOP) {
            context.translate(p.x + hw, p.y + hh);
          } else {
            context.translate(p.x, p.y);
          }

          context.scale(p.scaleX, p.scaleY);
          context.rotate(p.rotation);

          if (p.clear) {
            context.clearRect(-hw, -hh, p.width, p.height);
          } else if (p.color) {
            context.fillStyle = p.color;
            context.fillRect(-hw, -hh, p.width, p.height);
          }

          if (p.borderColor) {
            context.beginPath();
            context.lineWidth = p.lineWidth;
            context.strokeStyle = p.borderColor;
            context.rect(-hw, -hh, p.width, p.height);
            context.stroke();
          }

          context.restore();
        }
      }
    }

  }

  class Scroller extends Emitter {
    constructor(givenParameters) {
      let text = calc(givenParameters.text);
      let characterList = Array.isArray(text) ? text : [...text];
      super(Object.assign({}, givenParameters, {
        class: Text,
        count: characterList.length,
        text: index => characterList[index],
        enabled: index => characterList[index] !== " " && calc(givenParameters.enabled)
      }));
    }

  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  /* eslint-disable no-bitwise -- used for calculations */

  /* eslint-disable unicorn/prefer-query-selector -- aiming at
    backward-compatibility */

  /**
  * StackBlur - a fast almost Gaussian Blur For Canvas
  *
  * In case you find this class useful - especially in commercial projects -
  * I am not totally unhappy for a small donation to my PayPal account
  * mario@quasimondo.de
  *
  * Or support me on flattr:
  * {@link https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript}.
  *
  * @module StackBlur
  * @author Mario Klingemann
  * Contact: mario@quasimondo.com
  * Website: {@link http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html}
  * Twitter: @quasimondo
  *
  * @copyright (c) 2010 Mario Klingemann
  *
  * Permission is hereby granted, free of charge, to any person
  * obtaining a copy of this software and associated documentation
  * files (the "Software"), to deal in the Software without
  * restriction, including without limitation the rights to use,
  * copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the
  * Software is furnished to do so, subject to the following
  * conditions:
  *
  * The above copyright notice and this permission notice shall be
  * included in all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  * OTHER DEALINGS IN THE SOFTWARE.
  */
  var mulTable = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
  var shgTable = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
  /**
   * @param {ImageData} imageData
   * @param {Integer} topX
   * @param {Integer} topY
   * @param {Integer} width
   * @param {Integer} height
   * @param {Float} radius
   * @returns {ImageData}
   */


  function processImageDataRGBA(imageData, topX, topY, width, height, radius) {
    var pixels = imageData.data;
    var div = 2 * radius + 1; // const w4 = width << 2;

    var widthMinus1 = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1 = radius + 1;
    var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
    var stackStart = new BlurStack();
    var stack = stackStart;
    var stackEnd;

    for (var i = 1; i < div; i++) {
      stack = stack.next = new BlurStack();

      if (i === radiusPlus1) {
        stackEnd = stack;
      }
    }

    stack.next = stackStart;
    var stackIn = null,
        stackOut = null,
        yw = 0,
        yi = 0;
    var mulSum = mulTable[radius];
    var shgSum = shgTable[radius];

    for (var y = 0; y < height; y++) {
      stack = stackStart;
      var pr = pixels[yi],
          pg = pixels[yi + 1],
          pb = pixels[yi + 2],
          pa = pixels[yi + 3];

      for (var _i = 0; _i < radiusPlus1; _i++) {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack.a = pa;
        stack = stack.next;
      }

      var rInSum = 0,
          gInSum = 0,
          bInSum = 0,
          aInSum = 0,
          rOutSum = radiusPlus1 * pr,
          gOutSum = radiusPlus1 * pg,
          bOutSum = radiusPlus1 * pb,
          aOutSum = radiusPlus1 * pa,
          rSum = sumFactor * pr,
          gSum = sumFactor * pg,
          bSum = sumFactor * pb,
          aSum = sumFactor * pa;

      for (var _i2 = 1; _i2 < radiusPlus1; _i2++) {
        var p = yi + ((widthMinus1 < _i2 ? widthMinus1 : _i2) << 2);
        var r = pixels[p],
            g = pixels[p + 1],
            b = pixels[p + 2],
            a = pixels[p + 3];
        var rbs = radiusPlus1 - _i2;
        rSum += (stack.r = r) * rbs;
        gSum += (stack.g = g) * rbs;
        bSum += (stack.b = b) * rbs;
        aSum += (stack.a = a) * rbs;
        rInSum += r;
        gInSum += g;
        bInSum += b;
        aInSum += a;
        stack = stack.next;
      }

      stackIn = stackStart;
      stackOut = stackEnd;

      for (var x = 0; x < width; x++) {
        var paInitial = aSum * mulSum >> shgSum;
        pixels[yi + 3] = paInitial;

        if (paInitial !== 0) {
          var _a2 = 255 / paInitial;

          pixels[yi] = (rSum * mulSum >> shgSum) * _a2;
          pixels[yi + 1] = (gSum * mulSum >> shgSum) * _a2;
          pixels[yi + 2] = (bSum * mulSum >> shgSum) * _a2;
        } else {
          pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
        }

        rSum -= rOutSum;
        gSum -= gOutSum;
        bSum -= bOutSum;
        aSum -= aOutSum;
        rOutSum -= stackIn.r;
        gOutSum -= stackIn.g;
        bOutSum -= stackIn.b;
        aOutSum -= stackIn.a;

        var _p = x + radius + 1;

        _p = yw + (_p < widthMinus1 ? _p : widthMinus1) << 2;
        rInSum += stackIn.r = pixels[_p];
        gInSum += stackIn.g = pixels[_p + 1];
        bInSum += stackIn.b = pixels[_p + 2];
        aInSum += stackIn.a = pixels[_p + 3];
        rSum += rInSum;
        gSum += gInSum;
        bSum += bInSum;
        aSum += aInSum;
        stackIn = stackIn.next;
        var _stackOut = stackOut,
            _r = _stackOut.r,
            _g = _stackOut.g,
            _b = _stackOut.b,
            _a = _stackOut.a;
        rOutSum += _r;
        gOutSum += _g;
        bOutSum += _b;
        aOutSum += _a;
        rInSum -= _r;
        gInSum -= _g;
        bInSum -= _b;
        aInSum -= _a;
        stackOut = stackOut.next;
        yi += 4;
      }

      yw += width;
    }

    for (var _x = 0; _x < width; _x++) {
      yi = _x << 2;

      var _pr = pixels[yi],
          _pg = pixels[yi + 1],
          _pb = pixels[yi + 2],
          _pa = pixels[yi + 3],
          _rOutSum = radiusPlus1 * _pr,
          _gOutSum = radiusPlus1 * _pg,
          _bOutSum = radiusPlus1 * _pb,
          _aOutSum = radiusPlus1 * _pa,
          _rSum = sumFactor * _pr,
          _gSum = sumFactor * _pg,
          _bSum = sumFactor * _pb,
          _aSum = sumFactor * _pa;

      stack = stackStart;

      for (var _i3 = 0; _i3 < radiusPlus1; _i3++) {
        stack.r = _pr;
        stack.g = _pg;
        stack.b = _pb;
        stack.a = _pa;
        stack = stack.next;
      }

      var yp = width;
      var _gInSum = 0,
          _bInSum = 0,
          _aInSum = 0,
          _rInSum = 0;

      for (var _i4 = 1; _i4 <= radius; _i4++) {
        yi = yp + _x << 2;

        var _rbs = radiusPlus1 - _i4;

        _rSum += (stack.r = _pr = pixels[yi]) * _rbs;
        _gSum += (stack.g = _pg = pixels[yi + 1]) * _rbs;
        _bSum += (stack.b = _pb = pixels[yi + 2]) * _rbs;
        _aSum += (stack.a = _pa = pixels[yi + 3]) * _rbs;
        _rInSum += _pr;
        _gInSum += _pg;
        _bInSum += _pb;
        _aInSum += _pa;
        stack = stack.next;

        if (_i4 < heightMinus1) {
          yp += width;
        }
      }

      yi = _x;
      stackIn = stackStart;
      stackOut = stackEnd;

      for (var _y = 0; _y < height; _y++) {
        var _p2 = yi << 2;

        pixels[_p2 + 3] = _pa = _aSum * mulSum >> shgSum;

        if (_pa > 0) {
          _pa = 255 / _pa;
          pixels[_p2] = (_rSum * mulSum >> shgSum) * _pa;
          pixels[_p2 + 1] = (_gSum * mulSum >> shgSum) * _pa;
          pixels[_p2 + 2] = (_bSum * mulSum >> shgSum) * _pa;
        } else {
          pixels[_p2] = pixels[_p2 + 1] = pixels[_p2 + 2] = 0;
        }

        _rSum -= _rOutSum;
        _gSum -= _gOutSum;
        _bSum -= _bOutSum;
        _aSum -= _aOutSum;
        _rOutSum -= stackIn.r;
        _gOutSum -= stackIn.g;
        _bOutSum -= stackIn.b;
        _aOutSum -= stackIn.a;
        _p2 = _x + ((_p2 = _y + radiusPlus1) < heightMinus1 ? _p2 : heightMinus1) * width << 2;
        _rSum += _rInSum += stackIn.r = pixels[_p2];
        _gSum += _gInSum += stackIn.g = pixels[_p2 + 1];
        _bSum += _bInSum += stackIn.b = pixels[_p2 + 2];
        _aSum += _aInSum += stackIn.a = pixels[_p2 + 3];
        stackIn = stackIn.next;
        _rOutSum += _pr = stackOut.r;
        _gOutSum += _pg = stackOut.g;
        _bOutSum += _pb = stackOut.b;
        _aOutSum += _pa = stackOut.a;
        _rInSum -= _pr;
        _gInSum -= _pg;
        _bInSum -= _pb;
        _aInSum -= _pa;
        stackOut = stackOut.next;
        yi += width;
      }
    }

    return imageData;
  }
  /**
   *
   */


  var BlurStack =
  /**
   * Set properties.
   */
  function BlurStack() {
    _classCallCheck(this, BlurStack);

    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
  };

  class StackBlur extends FastBlur {
    constructor(givenParameter) {
      super(givenParameter);
      this._currentRadiusPart = void 0;
    }

    _getParameterList() {
      return Object.assign({}, super._getParameterList(), {
        // work directly on the main canvas
        onCanvas: false,
        radius: undefined,
        radiusPart: undefined,
        radiusScale: true
      });
    }

    normalizeFullScreen(additionalModifier) {
      const p = this.p;

      if (p.norm && p.onCanvas) {
        p.x = 0;
        p.y = 0;
        p.width = additionalModifier.widthInPixel;
        p.height = additionalModifier.heightInPixel;
      } else {
        super.normalizeFullScreen(additionalModifier);
      }
    }

    resize(output, additionalModifier) {
      super.resize(output, additionalModifier);

      if (this.p.radiusPart) {
        this.p.radius = undefined;
      }
    }

    additionalBlur(targetW, targetH, additionalModifier) {
      const imageData = this._tctx.getImageData(0, 0, targetW, targetH);

      processImageDataRGBA(imageData, 0, 0, targetW, targetH, additionalModifier.radius || 1);

      this._tctx.putImageData(imageData, 0, 0);
    } // draw-methode


    draw(context, additionalModifier) {
      const p = this.p;

      if (p.enabled) {
        if (p.radius === undefined || this._currentRadiusPart !== p.radiusPart) {
          p.radius = Math.round((additionalModifier.widthInPixel + additionalModifier.heightInPixel) / 2 / p.radiusPart);
          this._currentRadiusPart = p.radiusPart;
        }

        const radius = Math.round(p.radius * (p.radiusScale && additionalModifier.cam ? additionalModifier.cam.zoom : 1) / additionalModifier.scaleCanvas);

        if (radius) {
          if (p.onCanvas) {
            if (p.width === undefined || p.height === undefined) {
              this.normalizeFullScreen(additionalModifier);
            }

            const x = Math.round(p.x);
            const y = Math.round(p.y);
            const w = Math.round(p.width);
            const h = Math.round(p.height);
            const imageData = context.getImageData(x, y, w, h);
            processImageDataRGBA(imageData, 0, 0, w - x, h - y, radius);
            context.putImageData(imageData, x, y, 0, 0, w, h);
          } else {
            additionalModifier.radius = radius;
            super.draw(context, additionalModifier);
          }
        }
      } else {
        super.draw(context, additionalModifier);
      }
    }

  }

  // Draw a Circle

  class StarField extends SpriteBase {
    constructor(givenParameters) {
      super(givenParameters);
      this._starsX = [];
      this._starsY = [];
      this._starsZ = [];
      this._starsOldX = [];
      this._starsOldY = [];
      this._starsNewX = [];
      this._starsNewY = [];
      this._starsEnabled = [];
      this._starsLineWidth = [];
      this._centerX = 0;
      this._centerY = 0;
      this._scaleZ = 0;
    }

    _getParameterList() {
      return Object.assign({}, super._getParameterList(), {
        // set image
        count: 40,
        // relative position
        moveX: 0,
        moveY: 0,
        moveZ: 0,
        lineWidth: undefined,
        highScale: true,
        color: "#FFF" // here default color is white

      });
    }

    init(context, additionalModifier) {
      const p = this.p;
      p.width = p.width || additionalModifier.width;
      p.height = p.height || additionalModifier.height;
      p.x = p.x === undefined ? additionalModifier.x : p.x;
      p.y = p.y === undefined ? additionalModifier.y : p.y;
      p.lineWidth = p.lineWidth || Math.min(additionalModifier.height / additionalModifier.heightInPixel, additionalModifier.width / additionalModifier.widthInPixel) / 2;
      this._centerX = p.width / 2 + p.x;
      this._centerY = p.height / 2 + p.y;
      this._scaleZ = Math.max(p.width, p.height) / 2;

      function clampOrRandom(val, min, max) {
        if (max === void 0) {
          max = -min;
        }

        return val === undefined || val < min || val >= max ? Math.random() * (max - min) + min : val;
      }

      for (let i = 0; i < p.count; i++) {
        this._starsX[i] = clampOrRandom(this._starsX[i], -p.width / 2);
        this._starsY[i] = clampOrRandom(this._starsY[i], -p.height / 2);
        this._starsZ[i] = clampOrRandom(this._starsZ[i], 0, this._scaleZ);
      }
    }

    _moveStar(i, scaled_timepassed, firstPass) {
      const p = this.p;
      const hw = p.width / 2;
      const hh = p.height / 2;

      if (firstPass) {
        this._starsEnabled[i] = true;
      }

      let x = this._starsX[i] + p.moveX * scaled_timepassed,
          y = this._starsY[i] + p.moveY * scaled_timepassed,
          z = this._starsZ[i] + p.moveZ * scaled_timepassed;

      while (x < -hw) {
        x += p.width;
        y = Math.random() * p.height - hh;
        this._starsEnabled[i] = false;
      }

      while (x > hw) {
        x -= p.width;
        y = Math.random() * p.height - hh;
        this._starsEnabled[i] = false;
      }

      while (y < -hh) {
        y += p.height;
        x = Math.random() * p.width - hw;
        this._starsEnabled[i] = false;
      }

      while (y > hh) {
        y -= p.height;
        x = Math.random() * p.width - hw;
        this._starsEnabled[i] = false;
      }

      while (z <= 0) {
        z += this._scaleZ;
        x = Math.random() * p.width - hw;
        y = Math.random() * p.height - hh;
        this._starsEnabled[i] = false;
      }

      while (z > this._scaleZ) {
        z -= this._scaleZ;
        x = Math.random() * p.width - hw;
        y = Math.random() * p.height - hh;
        this._starsEnabled[i] = false;
      }

      const projectX = this._centerX + x / z * hw;
      const projectY = this._centerY + y / z * hh;
      this._starsEnabled[i] = this._starsEnabled[i] && projectX >= p.x && projectY >= p.y && projectX < p.x + p.width && projectY < p.y + p.height;

      if (firstPass) {
        this._starsX[i] = x;
        this._starsY[i] = y;
        this._starsZ[i] = z;
        this._starsNewX[i] = projectX;
        this._starsNewY[i] = projectY;
      } else {
        this._starsOldX[i] = projectX;
        this._starsOldY[i] = projectY;
        let lw = (1 - this._starsZ[i] / this._scaleZ) * 4;

        if (!p.highScale) {
          lw = Math.ceil(lw);
        }

        this._starsLineWidth[i] = lw;
      }
    }

    animate(timepassed) {
      let ret = super.animate(timepassed);

      if (this.p.enabled && this._centerX !== undefined) {
        let i = this.p.count;

        while (i--) {
          this._moveStar(i, timepassed / 16, true);

          if (this._starsEnabled[i]) {
            this._moveStar(i, -5, false);
          }
        }
      }

      return ret;
    }

    resize(output, additionalModifier) {
      this._needInit = true;
    }

    detect(context, x, y) {
      return this._detectHelper(this.p, context, x, y, false);
    } // Draw-Funktion


    draw(context, additionalModifier) {
      if (this.p.enabled) {
        const p = this.p;
        context.globalCompositeOperation = p.compositeOperation;
        context.globalAlpha = p.alpha * additionalModifier.alpha;

        if (p.moveY == 0 && p.moveZ == 0 && p.moveX < 0) {
          context.fillStyle = p.color;
          let i = p.count;

          while (i--) {
            if (this._starsEnabled[i]) {
              context.fillRect(this._starsNewX[i], this._starsNewY[i] - this._starsLineWidth[i] * p.lineWidth / 2, this._starsOldX[i] - this._starsNewX[i], this._starsLineWidth[i] * p.lineWidth);
            }
          }
        } else {
          context.strokeStyle = p.color;

          if (p.highScale) {
            let i = p.count;

            while (i--) {
              if (this._starsEnabled[i]) {
                context.beginPath();
                context.lineWidth = this._starsLineWidth[i] * p.lineWidth;
                context.moveTo(this._starsOldX[i], this._starsOldY[i]);
                context.lineTo(this._starsNewX[i], this._starsNewY[i]);
                context.stroke();
                context.closePath();
              }
            }
          } else {
            let lw = 5,
                i;

            while (--lw) {
              context.beginPath();
              context.lineWidth = lw * p.lineWidth;
              i = p.count;

              while (i--) {
                if (this._starsEnabled[i] && this._starsLineWidth[i] === lw) {
                  context.moveTo(this._starsOldX[i], this._starsOldY[i]);
                  context.lineTo(this._starsNewX[i], this._starsNewY[i]);
                }
              }

              context.stroke();
              context.closePath();
            }
          }
        }
      }
    }

  }

  var Sprites = {
    Callback: Callback$1,
    Canvas,
    Circle,
    Emitter,
    FastBlur,
    Group,
    Image: Image$1,
    Text,
    Particle,
    Path,
    Rect,
    Scroller,
    StackBlur,
    StarField
  };

  class Callback {
    constructor(callback, duration) {
      this._callback = void 0;
      this._duration = void 0;
      this._initialized = false;
      this._callback = callback;
      this._duration = ifNull(calc(duration), undefined);
    }

    reset() {
      this._initialized = false;
    }

    run(sprite, time) {
      let result;

      if (this._duration !== undefined) {
        this._callback(sprite, Math.min(time, this._duration), !this._initialized);

        this._initialized = true;
        return time - this._duration;
      } else {
        result = this._callback(sprite, time, !this._initialized);
        this._initialized = true;
        return result;
      }
    }

  }

  const degToRad = Math.PI / 180;

  function moveDefault(progress, data) {
    return data.from + progress * data.delta;
  }

  function moveStatic(progress, data) {
    return progress >= 0.5 ? data.to : data.from;
  }

  function moveBezier(progress, data) {
    var copy = [...data.values],
        copyLength = copy.length,
        i;

    while (copyLength > 1) {
      copyLength--;

      for (i = 0; i < copyLength; i++) {
        copy[i] = copy[i] + progress * (copy[i + 1] - copy[i]);
      }
    }

    return copy[0];
  }

  function moveColor(progress, data) {
    return data.colorFrom.mix(data.colorTo, progress * 100).toString();
  }

  function movePath(progress, _ref, sprite) {
    let {
      pathFrom,
      pathTo
    } = _ref;
    return sprite.changeToPath(progress, {
      pathFrom: pathFrom,
      pathTo: pathTo
    });
  } // to values of a object


  class ChangeTo {
    constructor(changeValues, duration, ease) {
      this._initialized = false;
      this._changeValues = void 0;
      this._duration = void 0;
      this._ease = void 0;
      this._changeValues = [];

      for (let k in changeValues) {
        const orgValue = changeValues[k];
        const value = k === "rotationInDegree" ? orgValue * degToRad : orgValue;
        const isColor = k === "color" || k === "borderColor";
        const isPath = k === "path";
        const isStatic = k === "text";
        const isFunction = typeof value === "function";
        const isBezier = !isColor && Array.isArray(value);
        const names = k === "scale" ? ["scaleX", "scaleY"] : k === "rotationInRadian" || k === "rotationInDegree" ? ["rotation"] : [k];

        for (const name of names) {
          this._changeValues.push({
            name,
            to: isBezier ? value[value.length - 1] : calc(value),
            bezier: isBezier ? value : undefined,
            isColor,
            isPath,
            isStatic,
            isFunction: isFunction ? value : undefined,
            moveAlgorithm: isColor ? moveColor : isPath ? movePath : isBezier ? moveBezier : isStatic ? moveStatic : moveDefault
          });
        }
      }

      this._duration = ifNull(calc(duration), 0);
      this._ease = ifNull(ease, t => t);
    }

    reset() {
      this._initialized = false;
    }

    _init(sprite, time) {
      let l = this._changeValues.length;

      while (l--) {
        const data = this._changeValues[l]; // @ts-ignore

        const from = sprite[data.name];

        if (data.isFunction) {
          data.from = from; // @ts-ignore

          data.to = data.isFunction(data.from);

          if (data.isColor) {
            data.colorFrom = new TinyColor(data.from);
            data.colorTo = new TinyColor(data.to);
            data.moveAlgorithm = moveColor;
          } else if (data.isPath) {
            [data.pathFrom, data.pathTo] = sprite.changeToPathInit(data.from, data.to);
            data.moveAlgorithm = movePath;
          } else if (Array.isArray(data.to)) {
            data.values = [from, ...data.to];
            data.moveAlgorithm = moveBezier;
          } else if (!data.isStatic) {
            data.delta = data.to - data.from;
            data.moveAlgorithm = moveDefault;
          }
        } else if (data.isColor) {
          //
          data.colorFrom = new TinyColor(from);
          data.colorTo = new TinyColor(data.to);
        } else if (data.isPath) {
          [data.pathFrom, data.pathTo] = sprite.changeToPathInit(from, data.to);
        } else if (data.bezier) {
          data.values = [from, ...data.bezier];
        } else {
          data.from = from;
          data.delta = data.to - data.from;
        }
      }
    }

    run(sprite, time) {
      if (!this._initialized) {
        this._initialized = true;

        this._init(sprite, time);
      } // return time left


      if (this._duration <= time) {
        let l = this._changeValues.length;
        let data; // prevent round errors by applying end-data

        while (l--) {
          data = this._changeValues[l]; // @ts-ignore

          sprite[data.name] = data.to;
        }
      } else {
        let l = this._changeValues.length;
        let data;

        const progress = this._ease(time / this._duration);

        while (l--) {
          data = this._changeValues[l]; // @ts-ignore

          sprite[data.name] = data.moveAlgorithm(progress, data, sprite);
        }
      }

      return time - this._duration;
    }

  }

  class EndDisabled$2 {
    constructor() {}

    run(sprite, time) {
      return SequenceRunCommand.FORCE_DISABLE;
    }

  }

  class EndDisabled$1 {
    constructor() {}

    run(sprite, time) {
      sprite.p.enabled = false;
      return SequenceRunCommand.FORCE_DISABLE;
    }

  }

  class Forever {
    constructor() {
      this._Aniobject = void 0;
      var Aniobject = [].slice.call(arguments);
      this._Aniobject = Aniobject[0] instanceof Sequence ? Aniobject[0] : new Sequence(...Aniobject);
    }

    reset(timelapsed) {
      var _this$_Aniobject$rese, _this$_Aniobject;

      if (timelapsed === void 0) {
        timelapsed = 0;
      }

      (_this$_Aniobject$rese = (_this$_Aniobject = this._Aniobject).reset) == null ? void 0 : _this$_Aniobject$rese.call(_this$_Aniobject, timelapsed);
    }

    play(label, timelapsed) {
      var _this$_Aniobject$play, _this$_Aniobject2;

      if (label === void 0) {
        label = "";
      }

      if (timelapsed === void 0) {
        timelapsed = 0;
      }

      return (_this$_Aniobject$play = (_this$_Aniobject2 = this._Aniobject).play) == null ? void 0 : _this$_Aniobject$play.call(_this$_Aniobject2, label, timelapsed);
    }

    run(sprite, time, isDifference) {
      let t = time;

      while (t >= 0) {
        t = this._Aniobject.run(sprite, t, isDifference);
        isDifference = true;

        if (t === true) {
          return true;
        }

        if (t >= 0) {
          var _this$_Aniobject$rese2, _this$_Aniobject3;

          (_this$_Aniobject$rese2 = (_this$_Aniobject3 = this._Aniobject).reset) == null ? void 0 : _this$_Aniobject$rese2.call(_this$_Aniobject3);
        }
      }

      return t;
    }

  }

  class If {
    constructor(ifCallback, Aniobject, AniobjectElse) {
      this._ifCallback = void 0;
      this._Aniobject = void 0;
      this._AniobjectElse = void 0;
      this._ifCallback = ifCallback;
      this._Aniobject = Aniobject;
      this._AniobjectElse = ifNull(AniobjectElse, () => 0);
    }

    play(label, timelapsed) {
      var _this$_Aniobject$play, _this$_Aniobject, _this$_AniobjectElse$, _this$_AniobjectElse;

      if (label === void 0) {
        label = "";
      }

      if (timelapsed === void 0) {
        timelapsed = 0;
      }

      return ((_this$_Aniobject$play = (_this$_Aniobject = this._Aniobject).play) == null ? void 0 : _this$_Aniobject$play.call(_this$_Aniobject, label, timelapsed)) || ((_this$_AniobjectElse$ = (_this$_AniobjectElse = this._AniobjectElse).play) == null ? void 0 : _this$_AniobjectElse$.call(_this$_AniobjectElse, label, timelapsed));
    }

    run(sprite, time) {
      const AniObject = calc(this._ifCallback) ? this._Aniobject : this._AniobjectElse;
      return AniObject.run ? AniObject.run(sprite, time) : AniObject(sprite, time);
    }

  }

  class Image {
    constructor(image, durationBetweenFrames) {
      this._initialized = false;
      this._image = void 0;
      this._count = void 0;
      this._durationBetweenFrames = void 0;
      this._duration = void 0;
      this._current = -1;
      const imageCalced = calc(image);
      this._durationBetweenFrames = ifNull(calc(durationBetweenFrames), 0);

      if (Array.isArray(imageCalced)) {
        this._image = imageCalced;
        this._count = imageCalced.length;
      } else {
        this._image = [imageCalced];
        this._count = 1;
      }

      this._duration = this._count * this._durationBetweenFrames;
    }

    reset() {
      this._initialized = false;
    }

    run(sprite, time) {
      if (!this._initialized) {
        this._initialized = true;
        this._current = -1;
      } // return time left


      if (time >= this._duration) {
        sprite.p.image = ImageManager$1.getImage(this._image[this._image.length - 1]);
      } else {
        let currentFrame = Math.floor(time / this._durationBetweenFrames);

        if (currentFrame !== this._current) {
          this._current = currentFrame;
          sprite.p.image = ImageManager$1.getImage(this._image[this._current]);
        }
      }

      return time - this._duration;
    }

  }

  class ImageFrame {
    constructor(frameNumber, framesToRight, durationBetweenFrames) {
      this._frameNumber = void 0;
      this._durationBetweenFrames = void 0;
      this._duration = void 0;
      this._framesToRight = void 0;
      const frameNumberCalc = calc(frameNumber);
      this._framesToRight = ifNull(calc(framesToRight), true);
      this._durationBetweenFrames = ifNull(calc(durationBetweenFrames), 0);
      this._frameNumber = Array.isArray(frameNumberCalc) ? frameNumberCalc : [frameNumberCalc];
      this._duration = this._frameNumber.length * this._durationBetweenFrames;
    }

    run(sprite, time) {
      let currentFrame = 0;

      if (time >= this._duration) {
        currentFrame = this._frameNumber[this._frameNumber.length - 1];
      } else {
        currentFrame = this._frameNumber[Math.floor(time / this._durationBetweenFrames)];
      }

      if (this._framesToRight) {
        sprite.p.frameX = sprite.p.frameWidth * currentFrame;
      } else {
        sprite.p.frameY = sprite.p.frameHeight * currentFrame;
      }

      return time - this._duration;
    }

  }

  class Loop {
    constructor(times) {
      this._Aniobject = void 0;
      this._times = void 0;
      this._timesOrg = void 0;
      var Aniobject = [].slice.call(arguments, 1);
      this._Aniobject = Aniobject[0] instanceof Sequence ? Aniobject[0] : new Sequence(...Aniobject);
      this._times = this._timesOrg = ifNull(calc(times), 1);
    }

    reset(timelapsed) {
      var _this$_Aniobject$rese, _this$_Aniobject;

      if (timelapsed === void 0) {
        timelapsed = 0;
      }

      this._times = this._timesOrg;
      (_this$_Aniobject$rese = (_this$_Aniobject = this._Aniobject).reset) == null ? void 0 : _this$_Aniobject$rese.call(_this$_Aniobject, timelapsed);
    }

    play(label, timelapsed) {
      var _this$_Aniobject$play, _this$_Aniobject2;

      if (label === void 0) {
        label = "";
      }

      if (timelapsed === void 0) {
        timelapsed = 0;
      }

      this._times = this._timesOrg;
      const b = (_this$_Aniobject$play = (_this$_Aniobject2 = this._Aniobject).play) == null ? void 0 : _this$_Aniobject$play.call(_this$_Aniobject2, label, timelapsed);

      if (b) {
        this._times = this._timesOrg;
      }

      return b;
    }

    run(sprite, time, isDifference) {
      let t = time;

      while (t >= 0 && this._times > 0) {
        t = this._Aniobject.run(sprite, t, isDifference);
        isDifference = true;

        if (t === true) {
          return true;
        }

        if (t >= 0) {
          var _this$_Aniobject$rese2, _this$_Aniobject3;

          this._times--;
          (_this$_Aniobject$rese2 = (_this$_Aniobject3 = this._Aniobject).reset) == null ? void 0 : _this$_Aniobject$rese2.call(_this$_Aniobject3);
        }
      }

      return t;
    }

  }

  class Remove {
    constructor() {}

    run(sprite, time) {
      return SequenceRunCommand.REMOVE;
    }

  }

  class Once {
    constructor(Aniobject, times) {
      this._Aniobject = void 0;
      this._times = void 0;
      this._Aniobject = Aniobject;
      this._times = ifNull(calc(times), 1);
    }

    run(sprite, time) {
      if (this._times <= 0) {
        return time;
      } else {
        let t = this._Aniobject.run(sprite, time);

        if (t >= 0) {
          this._times--;
        }

        return t;
      }
    }

  }

  class Shake {
    constructor(shakediff, duration) {
      this._initialized = false;
      this._duration = void 0;
      this._shakeDiff = void 0;
      this._shakeDiffHalf = void 0;
      this._x = 0;
      this._y = 0;
      this._duration = calc(duration);
      this._shakeDiff = calc(shakediff);
      this._shakeDiffHalf = this._shakeDiff / 2;
    }

    reset() {
      this._initialized = false;
    }

    run(sprite, time) {
      if (!this._initialized) {
        this._initialized = true;
        this._x = sprite.p.x;
        this._y = sprite.p.y;
      } // return time left


      if (time >= this._duration) {
        // prevent round errors
        sprite.p.x = this._x;
        sprite.p.y = this._y;
      } else {
        // shake sprite
        sprite.p.x = this._x + Math.random() * this._shakeDiff - this._shakeDiffHalf;
        sprite.p.y = this._y + Math.random() * this._shakeDiff - this._shakeDiffHalf;
      }

      return time - this._duration;
    }

  }

  class ShowOnce {
    constructor() {
      this._showOnce = true;
    }

    run(sprite, time) {
      sprite.p.enabled = sprite.p.enabled && this._showOnce;
      this._showOnce = false;
      return 0;
    }

  }

  class State {
    constructor(_ref) {
      let {
        states = {},
        transitions = {},
        defaultState
      } = _ref;
      this._states = void 0;
      this._transitions = void 0;
      this._currentStateName = void 0;
      this._currentState = void 0;
      this._isTransitioningToStateName = undefined;
      // save possible states
      this._states = Object.fromEntries(Object.entries(states).map(_ref2 => {
        let [key, value] = _ref2;
        return [key, Array.isArray(value) ? new Sequence(value) : value];
      })); // save transitions

      this._transitions = Object.fromEntries(Object.entries(transitions).map(_ref3 => {
        let [key, value] = _ref3;
        return [key, Array.isArray(value) ? new Sequence(value) : value];
      })); // set start state

      this._currentStateName = defaultState;
      this._currentState = this._states[defaultState];
    }

    setState(name) {
      if (name !== this._currentStateName) {
        this._isTransitioningToStateName = name;
        const UCFirstName = "" + name.charAt(0).toUpperCase() + name.slice(1);
        const possibleTransitionNames = [this._currentStateName + "To" + UCFirstName, this._currentStateName + "To", "to" + UCFirstName];
        const transitionName = possibleTransitionNames.find(name => name in this._transitions);

        if (transitionName) {
          var _this$_currentState;

          this._currentStateName = this._isTransitioningToStateName;
          this._currentState = this._transitions[transitionName];
          (_this$_currentState = this._currentState) == null ? void 0 : _this$_currentState.reset == null ? void 0 : _this$_currentState.reset();
        } else {
          var _this$_currentState2;

          this._currentStateName = this._isTransitioningToStateName;
          this._currentState = this._states[this._currentStateName];
          (_this$_currentState2 = this._currentState) == null ? void 0 : _this$_currentState2.reset == null ? void 0 : _this$_currentState2.reset();
          this._isTransitioningToStateName = undefined;
        }
      } // search through transitions
      // delegateTo - search through list

    }

    play(label, timelapsed) {
      var _this$_currentState3;

      if (label === void 0) {
        label = "";
      }

      if (timelapsed === void 0) {
        timelapsed = 0;
      }

      return (_this$_currentState3 = this._currentState) == null ? void 0 : _this$_currentState3.play == null ? void 0 : _this$_currentState3.play(label, timelapsed);
    }

    run(sprite, time, is_difference) {
      let timeLeft = time;
      let isDifference = is_difference;

      if (this._currentState) {
        timeLeft = this._currentState.run(sprite, timeLeft, isDifference);

        if (timeLeft === true) {
          return true;
        }

        isDifference = true;
      }

      if (timeLeft >= 0 || !this._currentState) {
        if (this._isTransitioningToStateName) {
          var _this$_currentState4;

          this._currentStateName = this._isTransitioningToStateName;
          this._currentState = this._states[this._currentStateName];
          (_this$_currentState4 = this._currentState) == null ? void 0 : _this$_currentState4.reset == null ? void 0 : _this$_currentState4.reset();
          this._isTransitioningToStateName = undefined;
          timeLeft = this._currentState.run(sprite, timeLeft, isDifference);

          if (timeLeft === true) {
            return true;
          }
        } else {
          this._currentState = undefined;
        }
      }

      return -1;
    }

  }

  class End {
    constructor() {}

    run(sprite, time) {
      return SequenceRunCommand.STOP;
    }

  }

  class EndDisabled {
    constructor() {}

    run(sprite, time) {
      sprite.p.enabled = false;
      return SequenceRunCommand.STOP;
    }

  }

  class WaitDisabled {
    constructor(duration) {
      this.duration = void 0;
      this.duration = ifNull(calc(duration), 0);
    }

    run(sprite, time) {
      // return time left
      sprite.p.enabled = time >= this.duration;
      return time - this.duration;
    }

  }

  var Animations = {
    Callback,
    ChangeTo,
    End: EndDisabled$2,
    EndDisabled: EndDisabled$1,
    Forever,
    If,
    Image,
    ImageFrame,
    Loop,
    Once,
    Remove,
    Sequence,
    Shake,
    ShowOnce,
    State,
    Stop: End,
    StopDisabled: EndDisabled,
    Wait,
    WaitDisabled
  };

  function backInOut(t) {
    var s = 1.70158 * 1.525;
    if ((t *= 2) < 1)
      return 0.5 * (t * t * ((s + 1) * t - s))
    return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2)
  }

  var backInOut_1 = backInOut;

  function backIn(t) {
    var s = 1.70158;
    return t * t * ((s + 1) * t - s)
  }

  var backIn_1 = backIn;

  function backOut(t) {
    var s = 1.70158;
    return --t * t * ((s + 1) * t + s) + 1
  }

  var backOut_1 = backOut;

  function bounceOut(t) {
    var a = 4.0 / 11.0;
    var b = 8.0 / 11.0;
    var c = 9.0 / 10.0;

    var ca = 4356.0 / 361.0;
    var cb = 35442.0 / 1805.0;
    var cc = 16061.0 / 1805.0;

    var t2 = t * t;

    return t < a
      ? 7.5625 * t2
      : t < b
        ? 9.075 * t2 - 9.9 * t + 3.4
        : t < c
          ? ca * t2 - cb * t + cc
          : 10.8 * t * t - 20.52 * t + 10.72
  }

  var bounceOut_1 = bounceOut;

  function bounceInOut(t) {
    return t < 0.5
      ? 0.5 * (1.0 - bounceOut_1(1.0 - t * 2.0))
      : 0.5 * bounceOut_1(t * 2.0 - 1.0) + 0.5
  }

  var bounceInOut_1 = bounceInOut;

  function bounceIn(t) {
    return 1.0 - bounceOut_1(1.0 - t)
  }

  var bounceIn_1 = bounceIn;

  function circInOut(t) {
    if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1)
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
  }

  var circInOut_1 = circInOut;

  function circIn(t) {
    return 1.0 - Math.sqrt(1.0 - t * t)
  }

  var circIn_1 = circIn;

  function circOut(t) {
    return Math.sqrt(1 - ( --t * t ))
  }

  var circOut_1 = circOut;

  function cubicInOut(t) {
    return t < 0.5
      ? 4.0 * t * t * t
      : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0
  }

  var cubicInOut_1 = cubicInOut;

  function cubicIn(t) {
    return t * t * t
  }

  var cubicIn_1 = cubicIn;

  function cubicOut(t) {
    var f = t - 1.0;
    return f * f * f + 1.0
  }

  var cubicOut_1 = cubicOut;

  function elasticInOut(t) {
    return t < 0.5
      ? 0.5 * Math.sin(+13.0 * Math.PI/2 * 2.0 * t) * Math.pow(2.0, 10.0 * (2.0 * t - 1.0))
      : 0.5 * Math.sin(-13.0 * Math.PI/2 * ((2.0 * t - 1.0) + 1.0)) * Math.pow(2.0, -10.0 * (2.0 * t - 1.0)) + 1.0
  }

  var elasticInOut_1 = elasticInOut;

  function elasticIn(t) {
    return Math.sin(13.0 * t * Math.PI/2) * Math.pow(2.0, 10.0 * (t - 1.0))
  }

  var elasticIn_1 = elasticIn;

  function elasticOut(t) {
    return Math.sin(-13.0 * (t + 1.0) * Math.PI/2) * Math.pow(2.0, -10.0 * t) + 1.0
  }

  var elasticOut_1 = elasticOut;

  function expoInOut(t) {
    return (t === 0.0 || t === 1.0)
      ? t
      : t < 0.5
        ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
        : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0
  }

  var expoInOut_1 = expoInOut;

  function expoIn(t) {
    return t === 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0))
  }

  var expoIn_1 = expoIn;

  function expoOut(t) {
    return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t)
  }

  var expoOut_1 = expoOut;

  function linear(t) {
    return t
  }

  var linear_1 = linear;

  function quadInOut(t) {
      t /= 0.5;
      if (t < 1) return 0.5*t*t
      t--;
      return -0.5 * (t*(t-2) - 1)
  }

  var quadInOut_1 = quadInOut;

  function quadIn(t) {
    return t * t
  }

  var quadIn_1 = quadIn;

  function quadOut(t) {
    return -t * (t - 2.0)
  }

  var quadOut_1 = quadOut;

  function quarticInOut(t) {
    return t < 0.5
      ? +8.0 * Math.pow(t, 4.0)
      : -8.0 * Math.pow(t - 1.0, 4.0) + 1.0
  }

  var quartInOut = quarticInOut;

  function quarticIn(t) {
    return Math.pow(t, 4.0)
  }

  var quartIn = quarticIn;

  function quarticOut(t) {
    return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0
  }

  var quartOut = quarticOut;

  function qinticInOut(t) {
      if ( ( t *= 2 ) < 1 ) return 0.5 * t * t * t * t * t
      return 0.5 * ( ( t -= 2 ) * t * t * t * t + 2 )
  }

  var quintInOut = qinticInOut;

  function qinticIn(t) {
    return t * t * t * t * t
  }

  var quintIn = qinticIn;

  function qinticOut(t) {
    return --t * t * t * t * t + 1
  }

  var quintOut = qinticOut;

  function sineInOut(t) {
    return -0.5 * (Math.cos(Math.PI*t) - 1)
  }

  var sineInOut_1 = sineInOut;

  function sineIn (t) {
    var v = Math.cos(t * Math.PI * 0.5);
    if (Math.abs(v) < 1e-14) return 1
    else return 1 - v
  }

  var sineIn_1 = sineIn;

  function sineOut(t) {
    return Math.sin(t * Math.PI/2)
  }

  var sineOut_1 = sineOut;

  var eases = {
  	'backInOut': backInOut_1,
  	'backIn': backIn_1,
  	'backOut': backOut_1,
  	'bounceInOut': bounceInOut_1,
  	'bounceIn': bounceIn_1,
  	'bounceOut': bounceOut_1,
  	'circInOut': circInOut_1,
  	'circIn': circIn_1,
  	'circOut': circOut_1,
  	'cubicInOut': cubicInOut_1,
  	'cubicIn': cubicIn_1,
  	'cubicOut': cubicOut_1,
  	'elasticInOut': elasticInOut_1,
  	'elasticIn': elasticIn_1,
  	'elasticOut': elasticOut_1,
  	'expoInOut': expoInOut_1,
  	'expoIn': expoIn_1,
  	'expoOut': expoOut_1,
  	'linear': linear_1,
  	'quadInOut': quadInOut_1,
  	'quadIn': quadIn_1,
  	'quadOut': quadOut_1,
  	'quartInOut': quartInOut,
  	'quartIn': quartIn,
  	'quartOut': quartOut,
  	'quintInOut': quintInOut,
  	'quintIn': quintIn,
  	'quintOut': quintOut,
  	'sineInOut': sineInOut_1,
  	'sineIn': sineIn_1,
  	'sineOut': sineOut_1
  };

  class Camera {
    constructor(config) {
      if (config === void 0) {
        config = {};
      }

      this.type = "camera";
      this.cam = void 0;
      this.type = "camera";
      this.cam = Object.assign({
        zoom: 1,
        x: 0,
        y: 0
      }, config);
    }

    viewport(_ref, matrix) {
      return matrix.scale(this.cam.zoom, this.cam.zoom).translate(-this.cam.x, -this.cam.y);
    }

    viewportByCam(_ref2, cam) {
      let {
        engine
      } = _ref2;
      const hw = engine.getWidth() / 2;
      const hh = engine.getHeight() / 2;
      const scale = engine.getRatio() > 1 ? hw : hh;
      return new Transform().translate(hw, hh).scale(scale, scale).scale(cam.zoom, cam.zoom).translate(-cam.x, -cam.y);
    }

    additionalModifier(_ref3, additionalModifier) {
      additionalModifier.cam = Object.assign({}, this.cam);
      return additionalModifier;
    }

    clampView(params, cam) {
      const {
        engine,
        scene,
        clampLimits
      } = params;
      const cl = clampLimits || {
        x1: scene.additionalModifier.x,
        y1: scene.additionalModifier.y,
        x2: scene.additionalModifier.x + scene.additionalModifier.width,
        y2: scene.additionalModifier.y + scene.additionalModifier.height
      };
      const invert = this.viewportByCam(params, cam).invert();
      const [x1, y1] = invert.transformPoint(0, 0);
      const [x2, y2] = invert.transformPoint(engine.getWidth(), engine.getHeight()); // check for x
      // is there a zoom in?

      if (x2 - x1 <= cl.x2 - cl.x1) {
        if (x1 < cl.x1) {
          if (x2 <= cl.x2) {
            cam.x += cl.x1 - x1;
          }
        } else {
          if (x2 > cl.x2) {
            cam.x += cl.x2 - x2;
          }
        }
      } else {
        if (x1 > cl.x1) {
          cam.x += cl.x1 - x1;
        } else {
          if (x2 < cl.x2) {
            cam.x += cl.x2 - x2;
          }
        }
      } // check for y
      // zoom in?


      if (y2 - y1 <= cl.y2 - cl.y1) {
        if (y1 < cl.y1) {
          if (y2 <= cl.y2) {
            cam.y += cl.y1 - y1;
          }
        } else {
          if (y2 > cl.y2) {
            cam.y += cl.y2 - y2;
          }
        }
      } else {
        if (y1 > cl.y1) {
          cam.y += cl.y1 - y1;
        } else {
          if (y2 < cl.y2) {
            cam.y += cl.y2 - y2;
          }
        }
      }

      return cam;
    }

    set zoom(value) {
      this.cam.zoom = value;
    }

    set camX(v) {
      this.cam.x = v;
    }

    set camY(v) {
      this.cam.y = v;
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

    zoomToFullScreen(_ref4) {
      let {
        scene
      } = _ref4;
      return Math.min(scene.additionalModifier.fullScreen.width / scene.additionalModifier.width, scene.additionalModifier.fullScreen.height / scene.additionalModifier.height);
    }

    zoomTo(params) {
      const {
        scene,
        engine,
        cam,
        x1,
        y1,
        x2,
        y2
      } = params;
      const scale = scene.additionalModifier.scaleCanvas;
      const invert = this.viewportByCam(params, cam || this.cam).invert();
      const [sx1, sy1] = invert.transformPoint(0, 0);
      const [sx2, sy2] = invert.transformPoint(engine.getWidth() * scale, engine.getHeight() * scale);
      const sw = sx2 - sx1;
      const sh = sy2 - sy1;
      const w = x2 - x1;
      const h = y2 - y1;
      const mx = x1 + w / 2;
      const my = y1 + h / 2;
      const zoomX = sw / w;
      const zoomY = sh / h;
      const ret = {
        x: mx,
        y: my,
        zoom: (cam || this.cam).zoom * Math.max(Math.min(zoomX, zoomY), Number.MIN_VALUE)
      };

      if (cam) {
        cam.x = ret.x;
        cam.y = ret.y;
        cam.zoom = ret.zoom;
      } else {
        this.cam = ret;
      }
    }

  }

  const clickTime$1 = 300;
  class CameraControl {
    constructor(config) {
      if (config === void 0) {
        config = {};
      }

      this.type = "control";
      this._mousePos = {};
      this.toCam = {
        zoom: 1,
        x: 0,
        y: 0
      };
      this._config = void 0;
      this._scene = void 0;
      this._instant = false;
      this._config = Object.assign({
        zoomMax: 10,
        zoomMin: 0.5,
        zoomFactor: 1.2,
        tween: 2,
        callResize: true
      }, config);
    }

    init(_ref) {
      let {
        scene
      } = _ref;
      this._scene = scene;
      this.toCam = Object.assign({}, scene.camera.cam);
    }

    mouseDown(_ref2) {
      var _e$touches;

      let {
        event: e,
        position: [mx, my],
        button: i
      } = _ref2;
      this._mousePos[i] = Object.assign({}, this._mousePos[i], {
        x: mx,
        y: my,
        _cx: this.toCam.x,
        _cy: this.toCam.y,
        _isDown: true,
        _numOfFingers: ((_e$touches = e.touches) == null ? void 0 : _e$touches.length) || 1,
        _distance: undefined,
        _timestamp: Date.now()
      });
    }

    mouseUp(_ref3) {
      var _e$changedTouches;

      let {
        event: e,
        position: [mx, my],
        button: i,
        scene
      } = _ref3;

      if (!this._mousePos[i]) {
        delete this._mousePos[i];
      }

      const down = this._mousePos[i]._isDown;
      const numCurrentFingers = ((_e$changedTouches = e.changedTouches) == null ? void 0 : _e$changedTouches.length) || 1;
      const numOfFingers = Math.max(this._mousePos[i]._numOfFingers, numCurrentFingers);
      this._mousePos[i]._isDown = false;
      this._mousePos[i]._numOfFingers -= numCurrentFingers;

      if (!down || numOfFingers > 1) {
        scene.stopPropagation();
        return;
      }

      if (!(Date.now() - this._mousePos[i]._timestamp < clickTime$1 && Math.abs(this._mousePos[i].x - mx) < 5 && Math.abs(this._mousePos[i].y - my) < 5 && i === 1 // i === 0
      )) {
        scene.stopPropagation();
      }
    }

    mouseOut(_ref4) {
      let {
        button: i
      } = _ref4;
      if (this._mousePos[i]) this._mousePos[i]._isDown = false;
    }

    mouseMove(_ref5) {
      var _e$touches2;

      let {
        event: e,
        position: [mx, my],
        button: i,
        scene
      } = _ref5;

      if (!this._mousePos[i] || !this._mousePos[i]._isDown || e.which === 0 && !e.touches) {
        return;
      }

      const scale = scene.additionalModifier.scaleCanvas;

      if (((_e$touches2 = e.touches) == null ? void 0 : _e$touches2.length) >= 2) {
        const t = e.touches; // get distance of two finger

        const distance = Math.sqrt((t[0].pageX - t[1].pageX) * (t[0].pageX - t[1].pageX) + (t[0].pageY - t[1].pageY) * (t[0].pageY - t[1].pageY));

        if (this._mousePos[i]._distance === undefined) {
          if (distance > 0) {
            this._mousePos[i]._distance = distance;
            this._mousePos[i]._czoom = this.toCam.zoom;
          }
        } else {
          this.toCam.zoom = Math.max(this._config.zoomMin, Math.min(this._config.zoomMax, this._mousePos[i]._czoom * distance / this._mousePos[i]._distance));
          this.toCam = scene.camera.clampView(arguments[0], this.toCam);
        }

        return;
      } else {
        this._mousePos[i]._distance = undefined;
        const viewMatrix = scene.camera.viewportByCam(arguments[0], this.toCam).invert();
        const [ox, oy] = viewMatrix.transformPoint(this._mousePos[i].x * scale, this._mousePos[i].y * scale);
        const [nx, ny] = viewMatrix.transformPoint(mx * scale, my * scale);
        this.toCam.x = this._mousePos[i]._cx + ox - nx;
        this.toCam.y = this._mousePos[i]._cy + oy - ny;
        this.toCam = scene.camera.clampView(arguments[0], this.toCam);
      }
    }

    mouseWheel(_ref6) {
      let {
        event: e,
        position: [mx, my],
        scene
      } = _ref6;
      const scale = scene.additionalModifier.scaleCanvas;
      const [ox, oy] = scene.camera.viewportByCam(arguments[0], this.toCam).invert().transformPoint(mx * scale, my * scale); // @ts-ignore

      const wheelData = e.wheelDelta || e.deltaY * -1;

      if (wheelData / 120 > 0) {
        this.zoomIn();
        const [nx, ny] = scene.camera.viewportByCam(arguments[0], this.toCam).invert().transformPoint(mx * scale, my * scale);
        this.toCam.x -= nx - ox;
        this.toCam.y -= ny - oy;
        this.toCam = scene.camera.clampView(arguments[0], this.toCam);
      } else {
        this.zoomOut(arguments[0]);
      }
    }

    hasCamChanged() {
      const t = this._config.tween || 1;
      return Math.abs(this.toCam.x - this._scene.camera.cam.x) >= Number.EPSILON * t || Math.abs(this.toCam.y - this._scene.camera.cam.y) >= Number.EPSILON * t || Math.abs(this.toCam.zoom - this._scene.camera.cam.zoom) >= Number.EPSILON * t;
    }

    fixedUpdate(_ref7) {
      let {
        scene,
        lastCall
      } = _ref7;

      if (this._config.tween && !this._instant && this.hasCamChanged()) {
        scene.camera.cam.x += (this.toCam.x - scene.camera.cam.x) / this._config.tween;
        scene.camera.cam.y += (this.toCam.y - scene.camera.cam.y) / this._config.tween;
        scene.camera.cam.zoom += (this.toCam.zoom - scene.camera.cam.zoom) / this._config.tween;

        if (lastCall) {
          scene.additionalModifier.cam = scene.camera.cam;

          if (this._config.callResize) {
            scene.resize();
          } else {
            scene.cacheClear();
          }
        }
      }
    }

    update(_ref8) {
      let {
        scene
      } = _ref8;

      if ((!this._config.tween || this._instant) && this.hasCamChanged()) {
        this._instant = false;
        scene.camera.cam = Object.assign({}, this.toCam);

        if (this._config.callResize) {
          scene.resize();
        } else {
          scene.cacheClear();
        }
      }
    }

    camInstant() {
      this._instant = true;
    }

    resize(args) {
      this.toCam = args.scene.camera.clampView(args, this.toCam);
    }

    zoomToNorm() {
      this.toCam.zoom = 1;
      return this;
    }

    zoomIn() {
      this.toCam.zoom = Math.min(this._config.zoomMax, this.toCam.zoom * this._config.zoomFactor);
      return this;
    }

    zoomOut(args) {
      this.toCam.zoom = Math.max(this._config.zoomMin, this.toCam.zoom / this._config.zoomFactor);
      this.toCam = args.scene.camera.clampView(args, this.toCam);
      return this;
    }

    zoomTo(params) {
      params.scene.camera.zoomTo(Object.assign(params, {
        cam: this.toCam
      }));
    }

  }

  const clickTime = 300;
  class CameraControlSecondButton extends CameraControl {
    mouseUp(_ref) {
      var _e$changedTouches;

      let {
        event: e,
        position: [mx, my],
        button: i,
        scene
      } = _ref;

      if (!this._mousePos[i]) {
        delete this._mousePos[i];
      }

      const down = this._mousePos[i]._isDown;
      const numCurrentFingers = ((_e$changedTouches = e.changedTouches) == null ? void 0 : _e$changedTouches.length) || 1;
      const numOfFingers = Math.max(this._mousePos[i]._numOfFingers, numCurrentFingers);
      this._mousePos[i]._isDown = false;
      this._mousePos[i]._numOfFingers -= numCurrentFingers;

      if (!down || numOfFingers > 1) {
        scene.stopPropagation();
        return;
      }

      if ((Date.now() - this._mousePos[i]._timestamp > clickTime || Math.abs(this._mousePos[i].x - mx) >= 5 || Math.abs(this._mousePos[i].y - my) >= 5) && i === 1) {
        scene.stopPropagation();
        const [x, y] = scene.transformPoint(mx, my);
        const [ox, oy] = scene.transformPoint(this._mousePos[i].x, this._mousePos[i].y);
        scene.map("region", {
          event: e,
          x1: Math.min(ox, x),
          y1: Math.min(oy, y),
          x2: Math.max(ox, x),
          y2: Math.max(oy, y),
          fromX: ox,
          fromY: oy,
          toX: x,
          toY: y
        });
      }
    }

    mouseMove(_ref2) {
      var _e$touches;

      let {
        event: e,
        position: [mx, my],
        button: i,
        scene
      } = _ref2;

      if (!this._mousePos[i] || !this._mousePos[i]._isDown || e.which === 0 && !e.touches) {
        return;
      }

      const scale = scene.additionalModifier.scaleCanvas;

      if (((_e$touches = e.touches) == null ? void 0 : _e$touches.length) >= 2) {
        const t = e.touches; // get distance of two finger

        const distance = Math.sqrt((t[0].pageX - t[1].pageX) * (t[0].pageX - t[1].pageX) + (t[0].pageY - t[1].pageY) * (t[0].pageY - t[1].pageY));

        if (this._mousePos[i]._distance === undefined) {
          if (distance > 0) {
            this._mousePos[i]._distance = distance;
            this._mousePos[i]._czoom = this.toCam.zoom;
          }
        } else {
          this.toCam.zoom = Math.max(this._config.zoomMin, Math.min(this._config.zoomMax, this._mousePos[i]._czoom * distance / this._mousePos[i]._distance));
          const viewMatrix = scene.camera.viewportByCam(arguments[0], this.toCam).invert();
          const [ox, oy] = viewMatrix.transformPoint(this._mousePos[i].x * scale, this._mousePos[i].y * scale);
          const [nx, ny] = viewMatrix.transformPoint(mx * scale, my * scale);
          this.toCam.x = this._mousePos[i]._cx + ox - nx;
          this.toCam.y = this._mousePos[i]._cy + oy - ny;
          this.toCam = scene.camera.clampView(arguments[0], this.toCam);
        }

        return;
      } else {
        this._mousePos[i]._distance = undefined;

        if (i === 2) {
          const viewMatrix = scene.camera.viewportByCam(arguments[0], this.toCam).invert();
          const [ox, oy] = viewMatrix.transformPoint(this._mousePos[i].x * scale, this._mousePos[i].y * scale);
          const [nx, ny] = viewMatrix.transformPoint(mx * scale, my * scale);
          this.toCam.x = this._mousePos[i]._cx + ox - nx;
          this.toCam.y = this._mousePos[i]._cy + oy - ny;
          this.toCam = scene.camera.clampView(arguments[0], this.toCam);
        }
      }

      if (i === 1 && scene.has("regionMove") && !(Date.now() - this._mousePos[i]._timestamp < clickTime && Math.abs(this._mousePos[i].x - mx) < 5 && Math.abs(this._mousePos[i].y - my) < 5) && (!e.touches || e.touches.length === 1)) {
        const [x, y] = scene.transformPoint(mx, my);
        const [ox, oy] = scene.transformPoint(this._mousePos[i].x, this._mousePos[i].y);
        scene.map("regionMove", {
          event: e,
          x1: Math.min(ox, x),
          y1: Math.min(oy, y),
          x2: Math.max(ox, x),
          y2: Math.max(oy, y),
          fromX: ox,
          fromY: oy,
          toX: x,
          toY: y
        });
      }
    }

  }

  class Click {
    constructor(_temp) {
      let {
        doubleClickDetectInterval = 350
      } = _temp === void 0 ? {} : _temp;
      this._doubleClickElementTimer = void 0;
      this._doubleClickDetectInterval = void 0;
      this._doubleClickDetectInterval = doubleClickDetectInterval;
    }

    mouseUp(param) {
      const {
        scene,
        button
      } = param;

      if (button === 1) {
        if (scene.has("doubleClick")) {
          if (this._doubleClickElementTimer) {
            clearTimeout(this._doubleClickElementTimer);
            this._doubleClickElementTimer = 0;
            scene.map("doubleClick", param);
          } else {
            this._doubleClickElementTimer = window.setTimeout(() => {
              this._doubleClickElementTimer = 0;
              scene.map("click", param);
            }, this._doubleClickDetectInterval);
          }
        } else {
          scene.map("click", param);
        }
      }
    }

  }

  class Element {
    constructor(_temp) {
      let {
        doubleClickDetectInterval = 350
      } = _temp === void 0 ? {} : _temp;
      this._clickIntend = undefined;
      this._hoverIntend = undefined;
      this._hasDetectImage = false;
      this._doubleClickElementTimer = undefined;
      this._doubleClickDetectInterval = void 0;
      this._doubleClickDetectInterval = doubleClickDetectInterval;
    }

    isDrawFrame() {
      return this._hasDetectImage ? 1 : 0;
    }

    _dispatchEvent(scene, isClick, param) {
      if (isClick) {
        if (scene.has("doubleClickElement")) {
          if (this._doubleClickElementTimer) {
            window.clearTimeout(this._doubleClickElementTimer);
            this._doubleClickElementTimer = 0;
            scene.map("doubleClickElement", param);
          } else {
            this._doubleClickElementTimer = window.setTimeout(() => {
              this._doubleClickElementTimer = 0;
              scene.map("clickElement", param);
            }, this._doubleClickDetectInterval);
          }
        } else {
          scene.map("clickElement", param);
        }
      } else {
        scene.map("hoverElement", param);
      }
    }

    _dispatchNonEvent(scene, isClick, param) {
      if (isClick) {
        if (scene.has("doubleClickNonElement")) {
          if (this._doubleClickElementTimer) {
            clearTimeout(this._doubleClickElementTimer);
            this._doubleClickElementTimer = undefined;
            scene.map("doubleClickNonElement", param);
          } else {
            this._doubleClickElementTimer = window.setTimeout(() => {
              this._doubleClickElementTimer = undefined;
              scene.map("clickNonElement", param);
            }, this._doubleClickDetectInterval);
          }
        } else {
          scene.map("clickNonElement", param);
        }
      } else {
        scene.map("hoverNonElement", param);
      }
    }

    initSprites(params) {
      const {
        scene,
        output,
        layerManager,
        canvasId
      } = params;
      this._hasDetectImage = false;

      if (this._clickIntend || this._hoverIntend) {
        const isClick = !!this._clickIntend;
        const {
          mx,
          my
        } = this._clickIntend || this._hoverIntend;
        const scale = scene.additionalModifier.scaleCanvas;
        const ctx = output.context[canvasId || 0];
        const cx = Math.round(mx / scale);
        const cy = Math.round(my / scale);
        const [x, y] = scene.transformPoint(mx, my);
        ctx.save();
        ctx.setTransform(...scene.viewport().m);
        let found = undefined;
        layerManager.forEach(_ref => {
          let {
            layerId,
            element,
            isFunction,
            elementId
          } = _ref;

          if (!isFunction) {
            const a = element.detect(ctx, cx, cy);

            if (a === "c") {
              found = "c";
            } else if (a) {
              found = {
                layerId,
                element: a,
                elementId
              };
              return false;
            }
          }
        });
        ctx.restore();

        if (found === "c") {
          this._hasDetectImage = true;
        } else {
          this._clickIntend = undefined;
          this._hoverIntend = undefined;
          const param = Object.assign({
            mx,
            my,
            x,
            y
          }, params);

          if (found) {
            Object.assign(param, found);

            this._dispatchEvent(scene, isClick, param);
          } else {
            this._dispatchNonEvent(scene, isClick, param);
          }
        }
      }
    }

    draw(params) {
      const {
        engine,
        scene,
        layerManager,
        output,
        canvasId
      } = params;

      if (!canvasId && this._hasDetectImage) {
        const isClick = !!this._clickIntend;
        const {
          mx,
          my
        } = this._clickIntend || this._hoverIntend;
        const scale = scene.additionalModifier.scaleCanvas;
        const ctx = output.context[0];
        const cx = Math.round(mx / scale);
        const cy = Math.round(my / scale);
        const [x, y] = scene.transformPoint(mx, my);
        const param = Object.assign({
          mx,
          my,
          x,
          y
        }, params);
        const oldISE = ctx.imageSmoothingEnabled;
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.save();
        ctx.setTransform(...scene.viewport().m);
        layerManager.forEach(_ref2 => {
          let {
            layerId,
            element,
            isFunction,
            elementId
          } = _ref2;

          if (!isFunction) {
            const color = "rgb(" + (elementId & 0xff) + ", " + ((elementId & 0xff00) >> 8) + ", " + (layerId & 0xff) + ")";
            element.detectDraw(ctx, color);
          }
        }, 0);
        ctx.restore();
        ctx.imageSmoothingEnabled = oldISE;
        engine.normContext(ctx);
        this._clickIntend = undefined;
        this._hoverIntend = undefined;
        const p = ctx.getImageData(cx, cy, 1, 1).data;

        if (p[3]) {
          Object.assign(param, {
            layerId: p[2],
            elementId: p[0] + (p[1] << 8),
            element: layerManager.getById(param.layerId).getById(param.elementId)
          });

          this._dispatchEvent(scene, isClick, param);
        } else {
          this._dispatchNonEvent(scene, isClick, param);
        }
      }
    }

    mouseUp(_ref3) {
      let {
        scene,
        position: [mx, my],
        button
      } = _ref3;
      this._clickIntend = button === 1 && scene.has("clickElement") ? {
        mx,
        my
      } : undefined;
    }

    mouseMove(_ref4) {
      let {
        scene,
        position: [mx, my]
      } = _ref4;
      this._hoverIntend = scene.has("hoverElement") ? {
        mx,
        my
      } : undefined;
    }

  }

  class Events {
    constructor() {
      this.type = "events";
      this._reseted = false;
      this._events = [];
    }

    _pushEvent(command, event, scene) {
      if (ifNull(scene.value("preventDefault"), true)) {
        event.preventDefault();
      }

      if (!this._reseted) {
        return;
      }

      const [mx, my] = this.getMousePosition({
        event
      });
      const [x, y] = scene.transformPoint(mx, my);
      scene.pipeBack(command, {
        event,
        position: [mx, my],
        x,
        y,
        button: this.getMouseButton({
          event
        })
      });
    }

    events(_ref) {
      let {
        scene
      } = _ref;
      return [scene.has("mouseDown") && [["touchstart", "mousedown"], event => this._pushEvent("mouseDown", event, scene)], scene.has("mouseUp") && [["touchend", "mouseup"], event => this._pushEvent("mouseUp", event, scene)], scene.has("mouseOut") && [["touchendoutside", "mouseout"], event => this._pushEvent("mouseOut", event, scene)], scene.has("mouseMove") && [["touchmove", "mousemove"], event => this._pushEvent("mouseMove", event, scene)], scene.has("mouseWheel") && [["wheel"], event => this._pushEvent("mouseWheel", event, scene)], ifNull(scene.value("preventDefault"), true) && [["contextmenu"], e => e.preventDefault()]].filter(v => v);
    }

    init(_ref2) {
      let {
        output,
        scene
      } = _ref2;
      const element = output.canvas[0];
      const events = scene.map("events", {});
      this._events = events.filter(Array.isArray) // flat(1)
      .reduce((acc, cur) => {
        acc.push.apply(acc, cur);
        return acc;
      }, []) // convert strings to call to function with the same name
      .map(cur => Array.isArray(cur) ? cur : [[cur], event => {
        if (ifNull(scene.value("preventDefault"), true)) event.preventDefault();
        scene.pipeBack(cur, {
          event
        });
      }]).map(_ref3 => {
        let [events, func] = _ref3;
        return events.map(e => ({
          n: element,
          e: e,
          f: func
        }));
      }) // workaround for .flat(1) for edge
      .reduce((acc, cur) => {
        if (Array.isArray(cur)) {
          acc.push.apply(acc, cur);
        } else {
          acc.push(cur);
        }

        return acc;
      }, []);

      this._events.forEach(v => {
        v.n.addEventListener(v.e, v.f, true);
      });
    }

    destroy() {
      this._events.forEach(v => {
        v.n.removeEventListener(v.e, v.f, true);
      });

      this._events = [];
    }

    reset(params, layerManager) {
      return layerManager;
    }

    getMousePosition(_ref4) {
      let {
        event: e
      } = _ref4;
      let touches;

      if (e.touches && e.touches.length > 0) {
        touches = e.targetTouches;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        touches = e.changedTouches;
      }

      if (touches) {
        const rect = e.target.getBoundingClientRect();
        const length = touches.length;
        touches = Array.from(touches);
        return [touches.reduce((sum, v) => sum + v.pageX, 0) / length - rect.left, touches.reduce((sum, v) => sum + v.pageY, 0) / length - rect.top];
      }

      if (e.offsetX === undefined) {
        const rect = e.target.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
      }

      return [e.offsetX, e.offsetY];
    }

    getMouseButton(_ref5) {
      let {
        event: e
      } = _ref5;
      return e.touches ? e.touches.length || e.changedTouches.length : ifNull(e.buttons ? e.buttons : [0, 1, 4, 2][e.which], 1);
    }

  }

  class LoadingScreen {
    loading(_ref) {
      let {
        output,
        progress
      } = _ref;
      const ctx = output.context[0];
      const isNumber = typeof progress === "number";
      const loadedHeight = isNumber ? Math.max(1, progress * output.height) : output.height;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, output.width, output.height);
      ctx.fillStyle = "_aaa";
      ctx.fillRect(0, output.height / 2 - loadedHeight / 2, output.width, loadedHeight);
      ctx.font = "20px Georgia";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.fillText(isNumber ? "Loading " + Math.round(100 * progress) + "%" : progress, 10 + Math.random() * 3, output.height - 10 + Math.random() * 3);
    }

  }

  class Norm {
    viewport(_ref, matrix) {
      let {
        engine
      } = _ref;
      const hw = engine.getWidth() / 2;
      const hh = engine.getHeight() / 2;
      const scale = engine.getRatio() > 1 ? hw : hh;
      return matrix.translate(hw, hh).scale(scale, scale);
    }

    additionalModifier(_ref2) {
      let {
        engine,
        output,
        scene
      } = _ref2;
      scene.cacheClear();
      const [x1, y1] = scene.transformPoint(0, 0, 1);
      const [x2, y2] = scene.transformPoint(output.width, output.height, 1);
      const hw = engine.getWidth() / 2;
      const hh = engine.getHeight() / 2;
      const scale = engine.getRatio() > 1 ? hw : hh;
      const transformInvert = new Transform().translate(hw, hh).scale(scale, scale).invert();
      const [sx1, sy1] = transformInvert.transformPoint(0, 0);
      const [sx2, sy2] = transformInvert.transformPoint(output.width, output.height);
      return {
        alpha: 1,
        x: -1,
        y: -1,
        width: 2,
        height: 2,
        widthInPixel: output.width,
        heightInPixel: output.height,
        scaleCanvas: output.width / output.canvas[0].clientWidth,
        visibleScreen: {
          x: x1,
          y: y1,
          width: x2 - x1,
          height: y2 - y1
        },
        fullScreen: {
          x: sx1,
          y: sy1,
          width: sx2 - sx1,
          height: sy2 - sy1
        }
      };
    }

  }

  class TimingAudio extends TimingDefault {
    constructor(configuration) {
      super({ ...configuration,
        maxSkippedTickChunk: Number.POSITIVE_INFINITY
      });
      this._maxSkippedTickChunk = Number.POSITIVE_INFINITY;
      this._audioStartTime = undefined;
      this._audioPosition = undefined;
      this._enableAndroidHack = false;
      this._audioElement = void 0;
      this._audioElement = configuration.audioElement;
    }

    get audioElement() {
      return this._audioElement;
    }

    init(_params) {
      if (this._audioElement) {
        // Android hack
        // @ts-ignore
        if (typeof MediaController === "function") {
          // @ts-ignore
          this._audioElement.controller = new MediaController();
          this._enableAndroidHack = true;
        }

        this._audioElement.preload = "auto";
        return new Promise((resolve, reject) => {
          const canplaythrough = () => {
            this._audioElement.removeEventListener("canplaythrough", canplaythrough);

            const playPromise = this._audioElement.play();

            if (playPromise) {
              playPromise.catch(e => {});
            }

            resolve(undefined);
          };

          this._audioElement.addEventListener("canplaythrough", canplaythrough);

          this._audioElement.onerror = () => {
            this._audioElement = undefined;
            resolve(undefined);
          };

          this._audioElement.load();
        });
      }
    }

    endTime() {
      return this._audioElement ? this._audioElement.duration * 1000 : Number.POSITIVE_INFINITY;
    }

    currentTime() {
      let currentTime = super.currentTime();

      if (this._audioElement) {
        if (this._audioElement.ended && this._audioElement.duration) {
          return this._audioElement.duration * 1000;
        }

        const currentAudioTime = this._audioElement.currentTime * 1000; // Android workaround

        if (this._enableAndroidHack) {
          if (this._audioStartTime === undefined) {
            this._audioStartTime = currentTime;
            this._audioPosition = currentAudioTime;
            return currentAudioTime;
          } else {
            if (this._audioElement.controller.playbackState === "playing") {
              if (currentAudioTime === this._audioPosition) {
                return this._audioPosition + Math.min(260, currentTime - this._audioStartTime);
              } else if (currentAudioTime - this._audioPosition < 500 && currentAudioTime > this._audioPosition && currentTime - this._audioStartTime < 350) {
                this._audioStartTime = this._audioStartTime + (currentAudioTime - this._audioPosition);
                this._audioPosition = currentAudioTime;
                return this._audioPosition + currentTime - this._audioStartTime;
              }
            }

            this._audioStartTime = currentTime;
            this._audioPosition = currentAudioTime;
            return this._audioPosition;
          }
        } else {
          return currentAudioTime;
        }
      } else {
        return currentTime;
      }
    }

    clampTime(_ref) {
      let {
        timePassed
      } = _ref;
      return timePassed;
    }

    shiftTime() {
      return 0;
    }

  }

  var Middleware = {
    Callback: Camera,
    Camera,
    CameraControl,
    CameraControlSecondButton,
    Click,
    Element,
    Event: Events,
    LoadingScreen,
    Norm,
    TimingAudio,
    TimingDefault
  };

  exports.Animations = Animations;
  exports.Easing = eases;
  exports.Engine = Engine;
  exports.ImageManager = ImageManager$1;
  exports.Middleware = Middleware;
  exports.Scene = Scene;
  exports.Sprites = Sprites;

}));
//# sourceMappingURL=animationvideo.umd.js.map
