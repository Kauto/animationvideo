(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.AnimationVideo = {}));
}(this, (function (exports) {
	// A type of promise-like that resolves synchronously and supports only one observer
	const _Pact = /*#__PURE__*/(function() {
		function _Pact() {}
		_Pact.prototype.then = function(onFulfilled, onRejected) {
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
			this.o = function(_this) {
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
	})();

	// Settles a pact synchronously
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

	function _isSettledPact(thenable) {
		return thenable instanceof _Pact && thenable.s & 1;
	}

	// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
	function _forTo(array, body, check) {
		var i = -1, pact, reject;
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

	const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

	// Asynchronously iterate through an object's values
	// Uses for...of if the runtime supports it, otherwise iterates until length on a copy
	function _forOf(target, body, check) {
		if (typeof target[_iteratorSymbol] === "function") {
			var iterator = target[_iteratorSymbol](), step, pact, reject;
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
				var _fixup = function(value) {
					try {
						if (!step.done) {
							iterator.return();
						}
					} catch(e) {
					}
					return value;
				};
				if (pact && pact.then) {
					return pact.then(_fixup, function(e) {
						throw _fixup(e);
					});
				}
				_fixup();
			}
			return pact;
		}
		// No support for Symbol.iterator
		if (!("length" in target)) {
			throw new TypeError("Object is not iterable");
		}
		// Handle live collections properly
		var values = [];
		for (var i = 0; i < target.length; i++) {
			values.push(target[i]);
		}
		return _forTo(values, function(i) { return body(values[i]); }, check);
	}

	const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

	// Asynchronously implement a generic for loop
	function _for(test, update, body) {
		var stage;
		for (;;) {
			var shouldContinue = test();
			if (_isSettledPact(shouldContinue)) {
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
				if (_isSettledPact(result)) {
					result = result.s;
				} else {
					stage = 1;
					break;
				}
			}
			if (update) {
				var updateValue = update();
				if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
					stage = 2;
					break;
				}
			}
		}
		var pact = new _Pact();
		var reject = _settle.bind(null, pact, 2);
		(stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
		return pact;
		function _resumeAfterBody(value) {
			result = value;
			do {
				if (update) {
					updateValue = update();
					if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
						updateValue.then(_resumeAfterUpdate).then(void 0, reject);
						return;
					}
				}
				shouldContinue = test();
				if (!shouldContinue || (_isSettledPact(shouldContinue) && !shouldContinue.v)) {
					_settle(pact, 1, result);
					return;
				}
				if (shouldContinue.then) {
					shouldContinue.then(_resumeAfterTest).then(void 0, reject);
					return;
				}
				result = body();
				if (_isSettledPact(result)) {
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
				_settle(pact, 1, result);
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
				_settle(pact, 1, result);
			}
		}
	}

	function calc(c, obj) {
	  if (obj === void 0) {
	    obj = null;
	  }

	  for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    params[_key - 2] = arguments[_key];
	  }

	  return typeof c === "function" ? c.apply(obj, params) : c;
	}

	function toArray(value) {
	  return value === undefined || value === null ? [] : Array.isArray(value) ? value : [value];
	}

	var Engine =
	/*#__PURE__*/
	function () {
	  function Engine(canvasOrOptions) {
	    var _this = this;

	    var givenOptions = canvasOrOptions;

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

	    var options = Object.assign({}, givenOptions);
	    this._output = {
	      canvas: [],
	      context: [],
	      width: 0,
	      height: 0,
	      ratio: 1
	    };
	    this._events = [];
	    this._scene = null;
	    this._isSceneInitialized = false;
	    this._lastTimestamp = 0;
	    this._recalculateCanvasIntend = false;
	    this._referenceRequestAnimationFrame = null;
	    this._output.canvas = toArray(options.canvas);

	    if (options.autoSize) {
	      var defaultAutoSizeSettings = {
	        enabled: true,
	        scaleLimitMin: 1,
	        scaleLimitMax: 2.5,
	        scaleFactor: 1.07,
	        referenceWidth: function referenceWidth() {
	          return _this._output.canvas[0].clientWidth;
	        },
	        referenceHeight: function referenceHeight() {
	          return _this._output.canvas[0].clientHeight;
	        },
	        currentScale: 1,
	        waitTime: 100,
	        currentWaitedTime: 0,
	        currentOffsetTime: 0,
	        offsetTimeLimitUp: 300,
	        offsetTimeLimitDown: 300,
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
	        this._events = ["resize", "orientationchange"].map(function (e) {
	          return {
	            n: window,
	            e: e,
	            f: _this.recalculateCanvas.bind(_this)
	          };
	        });
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

	    this._output.canvas.forEach(function (canvas, index) {
	      _this._output.context[index] = canvas.getContext("2d");
	    });

	    this._canvasCount = this._output.canvas.length;
	    this._drawFrame = Array.from({
	      length: this._canvasCount
	    }, function (v) {
	      return 0;
	    });

	    if (options.clickToPlayAudio) {
	      this._events.push({
	        n: this._output.canvas[0],
	        e: "click",
	        f: this.playAudioOfScene.bind(this)
	      });
	    }

	    this._reduceFramerate = options.reduceFramerate;

	    this._events.forEach(function (v) {
	      v.n.addEventListener(v.e, v.f);
	    });

	    this.switchScene(options.scene, options.sceneParameter || {});
	  }

	  var _proto = Engine.prototype;

	  _proto.handleVisibilityChange = function handleVisibilityChange() {
	    this._autoSize.enabled = !(document.visibilityState == "hidden");
	  };

	  _proto.playAudioOfScene = function playAudioOfScene() {
	    if (this._isSceneInitialized && this._scene && this._scene.timing.audioElement) {
	      this._scene.timing.audioElement.play();
	    }
	  };

	  _proto.normContext = function normContext(ctx) {
	    ctx.textBaseline = "middle";
	    ctx.textAlign = "center";
	    ctx.globalAlpha = 1;
	    ctx.globalCompositeOperation = "source-over";
	  };

	  _proto.getWidth = function getWidth() {
	    return this._output.width;
	  };

	  _proto.getHeight = function getHeight() {
	    return this._output.height;
	  };

	  _proto.getRatio = function getRatio() {
	    return this._output.ratio;
	  };

	  _proto.getOutput = function getOutput() {
	    return this._output;
	  };

	  _proto.recalculateCanvas = function recalculateCanvas() {
	    this._recalculateCanvasIntend = true;
	    return this;
	  };

	  _proto._recalculateCanvas = function _recalculateCanvas() {
	    var _this2 = this;

	    if (this._autoSize) {
	      var width = calc(this._autoSize.referenceWidth);
	      var height = calc(this._autoSize.referenceHeight);

	      if (width <= 0 || height <= 0) {
	        return;
	      }

	      this._output.canvas.forEach(function (canvas) {
	        canvas.width = Math.round(width / _this2._autoSize.currentScale);
	        canvas.height = Math.round(height / _this2._autoSize.currentScale);

	        if (_this2._autoSize.setCanvasStyle) {
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
	  };

	  _proto.recalculateFPS = function recalculateFPS() {
	    try {
	      var _this4 = this;

	      if (_this4._referenceRequestAnimationFrame) {
	        window.cancelAnimationFrame(_this4._referenceRequestAnimationFrame);
	        _this4._referenceRequestAnimationFrame = false;
	      }

	      return Promise.resolve(new Promise(function (resolve) {
	        return requestAnimationFrame(resolve);
	      })).then(function () {
	        function _temp2() {
	          var timeBetweenFrames = (_this4._now() - start) / count;
	          _this4._autoSize.offsetTimeTarget = timeBetweenFrames;
	          _this4._autoSize.offsetTimeDelta = timeBetweenFrames / 3;

	          if (_this4._referenceRequestAnimationFrame === false) {
	            _this4._realLastTimestamp = false;
	            _this4._referenceRequestAnimationFrame = window.requestAnimationFrame(_this4._mainLoop.bind(_this4));
	          }
	        }

	        var start = _this4._now();

	        var count = 3;
	        var i = count;

	        var _temp = _for(function () {
	          return i--;
	        }, void 0, function () {
	          return Promise.resolve(new Promise(function (resolve) {
	            return requestAnimationFrame(resolve);
	          })).then(function () {});
	        });

	        return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
	      });
	    } catch (e) {
	      return Promise.reject(e);
	    }
	  };

	  _proto.resize = function resize() {
	    if (this._scene && this._scene.resize) {
	      this._scene.resize();
	    }

	    return this;
	  };

	  _proto.switchScene = function switchScene(scene, sceneParameter) {
	    if (scene) {
	      this._newScene = scene;
	      this._sceneParameter = sceneParameter;
	    }

	    return this;
	  };

	  _proto._now = function _now() {
	    return window.performance ? performance.now() : Date.now();
	  };

	  _proto._mainLoop = function _mainLoop(timestamp) {
	    var _this5 = this;

	    if (!this._referenceRequestAnimationFrame) return;
	    this._referenceRequestAnimationFrame = window.requestAnimationFrame(this._mainLoop.bind(this));
	    var isRecalculatedCanvas = this._recalculateCanvasIntend && (!this._reduceFramerate || !this._isOddFrame);

	    if (isRecalculatedCanvas) {
	      this._recalculateCanvas();

	      this._recalculateCanvasIntend = false;
	    }

	    for (var _i = 0; _i < this._canvasCount; _i++) {
	      this._drawFrame[_i] = Math.max(this._drawFrame[_i] - 1, isRecalculatedCanvas ? 1 : 0);
	    }

	    if (!this._realLastTimestamp) {
	      this._realLastTimestamp = timestamp;
	    }

	    if (!this._initializedStartTime) {
	      this._initializedStartTime = timestamp;
	    }

	    if (this._newScene && !this._promiseSceneDestroying) {
	      this._promiseSceneDestroying = Promise.resolve(this._scene ? this._scene.destroy() : {});

	      this._promiseSceneDestroying.then(function (destroyParameterForNewScene) {
	        _this5._newScene.callInit({
	          run: _this5._runParameter,
	          scene: _this5._sceneParameter,
	          destroy: destroyParameterForNewScene
	        }, _this5);

	        _this5._scene = _this5._newScene;
	        _this5._newScene = undefined;
	        _this5._promiseSceneDestroying = undefined;
	        _this5._isSceneInitialized = false;
	        _this5._lastTimestamp = _this5._scene.currentTime();
	        _this5._initializedStartTime = timestamp;
	      });
	    }

	    if (this._scene) {
	      if (this._reduceFramerate) {
	        this._isOddFrame = !this._isOddFrame;
	      }

	      if (!this._reduceFramerate || this._isOddFrame) {
	        var now = this._scene.currentTime();

	        var timePassed = this._scene.clampTime(now - this._lastTimestamp);

	        var shiftTime = this._scene.shiftTime(timePassed);

	        timePassed = timePassed + shiftTime;
	        this._lastTimestamp = now + shiftTime;

	        if (this._isSceneInitialized) {
	          var moveFrame = timePassed !== 0 || this._moveOnce;
	          this._moveOnce = false;

	          var nowAutoSize = this._now();

	          if (this._output.canvas[0].width) {
	            for (var index = 0; index < this._canvasCount; index++) {
	              var ctx = this._output.context[index];
	              this.normContext(ctx);

	              this._scene.initSprites(index);
	            }
	          }

	          var drawFrame = this._scene.isDrawFrame(timePassed);

	          if (Array.isArray(drawFrame)) {
	            for (var _i2 = 0; _i2 < this._canvasCount; _i2++) {
	              this._drawFrame[_i2] = Math.max(this._drawFrame[_i2], drawFrame[_i2], 0);
	            }
	          } else {
	            for (var _i3 = 0; _i3 < this._canvasCount; _i3++) {
	              this._drawFrame[_i3] = Math.max(this._drawFrame[_i3], drawFrame, 0);
	            }
	          }

	          if (moveFrame) {
	            this._scene.move(timePassed);
	          }

	          if (this._output.canvas[0].width) {
	            for (var _index = 0; _index < this._canvasCount; _index++) {
	              if (this._drawFrame[_index]) {
	                this._scene.draw(_index);
	              }
	            }
	          }

	          if (this._autoSize && this._autoSize.enabled) {
	            var deltaTimestamp = timestamp - this._realLastTimestamp;

	            if (this._autoSize.currentWaitedTime < this._autoSize.waitTime) {
	              this._autoSize.currentWaitedTime += deltaTimestamp;
	            } else if (moveFrame) {
	              var targetTime = this._autoSize.offsetTimeTarget * (this._reduceFramerate ? 2 : 1);
	              var deltaFrame = this._now() - nowAutoSize;
	              var delta = (Math.abs(deltaTimestamp - targetTime) > Math.abs(deltaFrame - targetTime) ? deltaTimestamp : deltaFrame) - targetTime;

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
	          for (var _i4 = 0; _i4 < this._canvasCount; _i4++) {
	            this.normContext(this._output.context[_i4]);
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
	  };

	  _proto.run = function run(runParameter) {
	    try {
	      var _this7 = this;

	      _this7._runParameter = runParameter || {};
	      return Promise.resolve(_this7.stop()).then(function () {
	        function _temp4() {
	          _this7._referenceRequestAnimationFrame = window.requestAnimationFrame(_this7._mainLoop.bind(_this7));
	          return _this7;
	        }

	        _this7._realLastTimestamp = _this7._initializedStartTime = false;

	        var _temp3 = function () {
	          if (_this7._autoSize && !_this7._autoSize.offsetTimeTarget) {
	            return Promise.resolve(_this7.recalculateFPS()).then(function () {});
	          }
	        }();

	        return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
	      });
	    } catch (e) {
	      return Promise.reject(e);
	    }
	  };

	  _proto.stop = function stop() {
	    try {
	      var _temp6 = function _temp6(_this8$_scene$destroy) {
	        _this8$_scene$destroy;
	      };

	      var _this9 = this;

	      window.cancelAnimationFrame(_this9._referenceRequestAnimationFrame);
	      _this9._referenceRequestAnimationFrame = null;
	      var _this8$_scene2 = _this9._scene;
	      return Promise.resolve(_this8$_scene2 ? Promise.resolve(_this9._scene.destroy()).then(_temp6) : _temp6(_this8$_scene2));
	    } catch (e) {
	      return Promise.reject(e);
	    }
	  };

	  _proto.destroy = function destroy() {
	    try {
	      var _this11 = this;

	      return Promise.resolve(_this11.stop()).then(function () {
	        _this11._events.forEach(function (v) {
	          v.n.removeEventListener(v.e, v.f);
	        });

	        _this11._events = [];
	        return _this11;
	      });
	    } catch (e) {
	      return Promise.reject(e);
	    }
	  };

	  return Engine;
	}();

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _extends() {
	  _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends.apply(this, arguments);
	}

	function _inheritsLoose(subClass, superClass) {
	  subClass.prototype = Object.create(superClass.prototype);
	  subClass.prototype.constructor = subClass;
	  subClass.__proto__ = superClass;
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _construct(Parent, args, Class) {
	  if (isNativeReflectConstruct()) {
	    _construct = Reflect.construct;
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }

	  return _construct.apply(null, arguments);
	}

	function _objectDestructuringEmpty(obj) {
	  if (obj == null) throw new TypeError("Cannot destructure undefined");
	}

	var ImageManager =
	/*#__PURE__*/
	function () {
	  function ImageManager() {
	    this.Images = {};
	    this.count = 0;
	    this.loaded = 0;
	  }

	  ImageManager.add = function add(Images, Callbacks) {
	    var self = this || ImageManager;

	    var _loop = function _loop(i) {
	      if (!self.Images[i]) {
	        self.Images[i] = new window.Image();

	        self.Images[i].onload = function () {
	          self.loaded++;

	          if (Callbacks && typeof Callbacks === "function") {
	            if (self.isLoaded()) {
	              Callbacks();
	            }
	          } else if (Callbacks && typeof Callbacks[i] === "function") {
	            Callbacks[i](i, self.Images[i]);
	          }

	          if (self.resolve && self.isLoaded()) {
	            self.resolve();
	            self.resolve = null;
	          }
	        };

	        if (Images[i].substr(0, 4) === "<svg") {
	          var DOMURL = window.URL || window.webkitURL || window;
	          var svg = new window.Blob([Images[i]], {
	            type: "image/svg+xml"
	          });
	          self.Images[i].src = DOMURL.createObjectURL(svg);
	        } else {
	          if (/^(https?:)?\/\//.test(Images[i])) {
	            self.Images[i].onerror = function () {
	              var img = new window.Image();
	              img.onload = self.Images[i].onload;
	              self.Images[i] = img;
	              self.Images[i].src = Images[i];
	            };

	            self.Images[i].crossOrigin = "anonymous";
	          }

	          self.Images[i].src = Images[i];
	        }

	        self.count++;
	      } else {
	        if (Callbacks && typeof Callbacks[i] === "function") {
	          Callbacks[i](i, self.Images[i]);
	        }
	      }
	    };

	    for (var i in Images) {
	      _loop(i);
	    }

	    if (Callbacks && typeof Callbacks === "function" && self.isLoaded()) {
	      Callbacks();
	    }

	    if (self.resolve && self.isLoaded()) {
	      self.resolve();
	      self.resolve = null;
	    }

	    return self;
	  };

	  ImageManager.reset = function reset() {
	    var self = this || ImageManager;
	    self.Images = {};
	    self.count = 0;
	    self.loaded = 0;
	    return self;
	  };

	  ImageManager.getLoaded = function getLoaded() {
	    return (this || ImageManager).loaded;
	  };

	  ImageManager.getCount = function getCount() {
	    return (this || ImageManager).count;
	  };

	  ImageManager.isLoaded = function isLoaded() {
	    var self = this || ImageManager;
	    return self.loaded === self.count;
	  };

	  ImageManager.getImage = function getImage(nameOrImage) {
	    return typeof nameOrImage === "object" ? nameOrImage : (this || ImageManager).Images[nameOrImage];
	  };

	  ImageManager.isLoadedPromise = function isLoadedPromise() {
	    var self = this || ImageManager;
	    return self.isLoaded() ? true : new Promise(function (resolve, reject) {
	      self.resolve = resolve;
	    });
	  };

	  return ImageManager;
	}();

	ImageManager.Images = {};
	ImageManager.count = 0;
	ImageManager.loaded = 0;

	var Layer =
	/*#__PURE__*/
	function () {
	  function Layer(canvasIds) {
	    this._layer = [];
	    this._isFunction = [];
	    this._start = 0;
	    this._nextFree = 0;
	    this._canvasIds = canvasIds === undefined ? [] : Array.isArray(canvasIds) ? canvasIds : [canvasIds];
	  }

	  var _proto = Layer.prototype;

	  _proto.addElement = function addElement(element) {
	    this.addElementForId(element);
	    return element;
	  };

	  _proto.addElements = function addElements(arrayOfElements) {
	    this.addElementsForIds(arrayOfElements);
	    return arrayOfElements;
	  };

	  _proto.addElementForId = function addElementForId(element) {
	    var len = this._layer.length;
	    var id = this._nextFree;
	    this._layer[id] = element;
	    this._isFunction[id] = typeof element === "function";

	    if (len === id) {
	      len++;
	    }

	    var nextFree = this._nextFree + 1;

	    while (nextFree !== len && this._layer[nextFree]) {
	      nextFree++;
	    }

	    this._nextFree = nextFree;

	    if (this._start > id) {
	      this._start = id;
	    }

	    return id;
	  };

	  _proto.addElementsForIds = function addElementsForIds(arrayOfElements) {
	    var _this = this;

	    var len = this._layer.length;
	    var id = this._nextFree;

	    if (len === id) {
	      this._layer = this._layer.concat(arrayOfElements);
	      this._nextFree = this._layer.length;
	      arrayOfElements.forEach(function (v, k) {
	        _this._isFunction[len + k] = typeof v === "function";
	      });
	      return Array.from({
	        length: arrayOfElements.length
	      }, function (v, k) {
	        return k + len;
	      });
	    } else {
	      return arrayOfElements.map(function (element) {
	        return _this.addElement(element);
	      });
	    }
	  };

	  _proto.getById = function getById(elementId) {
	    return this._layer[elementId];
	  };

	  _proto.getIdByElement = function getIdByElement(element) {
	    return this._layer.indexOf(element);
	  };

	  _proto.deleteByElement = function deleteByElement(element) {
	    var elementId = this.getIdByElement(element);

	    if (elementId >= 0) {
	      this.deleteById(elementId);
	    }
	  };

	  _proto.deleteById = function deleteById(elementId) {
	    var len = this._layer.length - 1;

	    if (len > 0 && elementId === len) {
	      this._layer[elementId] = null;

	      while (len && !this._layer[len - 1]) {
	        len--;
	      }

	      this._layer.length = len;
	      this._isFunction.length = len;
	      this._nextFree = Math.min(this._nextFree, len);
	      this._start = Math.min(this._start, len);
	    } else if (this._layer[elementId]) {
	      this._layer[elementId] = null;
	      this._nextFree = Math.min(this._nextFree, elementId);

	      if (this._start === elementId) {
	        this._start = elementId + 1;
	      }
	    }
	  };

	  _proto.isCanvasId = function isCanvasId(canvasId) {
	    return canvasId === undefined || !this._canvasIds.length || this._canvasIds.includes(canvasId);
	  };

	  _proto.forEach = function forEach(callback, layerId) {
	    if (layerId === void 0) {
	      layerId = 0;
	    }

	    var index, element;
	    var l = this._layer.length;

	    for (index = this._start; index < l; index++) {
	      element = this._layer[index];

	      if (element) {
	        if (callback({
	          elementId: index,
	          layerId: layerId,
	          element: element,
	          isFunction: this._isFunction[index],
	          layer: this
	        }) === false) {
	          return;
	        }
	      }
	    }
	  };

	  _proto.getElementsByTag = function getElementsByTag(tag) {
	    var result = [];
	    this.forEach(function (_ref) {
	      var element = _ref.element,
	          isFunction = _ref.isFunction;

	      if (!isFunction) {
	        var ans = element.getElementsByTag(tag);

	        if (ans) {
	          result = result.concat(ans);
	        }
	      }
	    });
	    return result;
	  };

	  _proto.play = function play(label, timelapsed) {
	    if (label === void 0) {
	      label = "";
	    }

	    if (timelapsed === void 0) {
	      timelapsed = 0;
	    }

	    this.forEach(function (_ref2) {
	      var element = _ref2.element,
	          isFunction = _ref2.isFunction;
	      return !isFunction && element.play(label, timelapsed);
	    });
	  };

	  _proto.count = function count() {
	    var count = 0;
	    var l = this._layer.length;

	    for (var index = this._start; index < l; index++) {
	      if (this._layer[index]) count++;
	    }

	    return count;
	  };

	  _proto.clear = function clear() {
	    this._layer = [];
	    this._isFunction = [];
	    this._start = 0;
	    this._nextFree = 0;
	  };

	  return Layer;
	}();

	var LayerManager =
	/*#__PURE__*/
	function () {
	  function LayerManager() {
	    this._layers = [];
	  }

	  var _proto = LayerManager.prototype;

	  _proto.addLayer = function addLayer(canvasIds) {
	    this._layers[this._layers.length] = new Layer(canvasIds);
	    return this._layers[this._layers.length - 1];
	  };

	  _proto.addLayers = function addLayers(numberOfLayer, canvasIds) {
	    if (numberOfLayer === void 0) {
	      numberOfLayer = 1;
	    }

	    var newLayers = Array.from({
	      length: numberOfLayer
	    }, function (v) {
	      return new Layer(canvasIds);
	    });
	    this._layers = this._layers.concat(newLayers);
	    return newLayers;
	  };

	  _proto.addLayerForId = function addLayerForId(canvasIds) {
	    this._layers[this._layers.length] = new Layer(canvasIds);
	    return this._layers.length - 1;
	  };

	  _proto.addLayersForIds = function addLayersForIds(numberOfLayer, canvasIds) {
	    var _this = this;

	    if (numberOfLayer === void 0) {
	      numberOfLayer = 1;
	    }

	    var result = Array.from({
	      length: numberOfLayer
	    }, function (v, k) {
	      return k + _this._layers.length;
	    });
	    this._layers = this._layers.concat(Array.from({
	      length: numberOfLayer
	    }, function (v) {
	      return new Layer(canvasIds);
	    }));
	    return result;
	  };

	  _proto.getById = function getById(layerId) {
	    return this._layers[layerId];
	  };

	  _proto.forEach = function forEach(callback, canvasId) {
	    var i;
	    var l = this._layers.length;

	    for (i = 0; i < l; i++) {
	      if (this._layers[i].isCanvasId(canvasId)) {
	        if (this._layers[i].forEach(callback, i) === false) {
	          break;
	        }
	      }
	    }
	  };

	  _proto.play = function play(label, timelapsed) {
	    if (label === void 0) {
	      label = "";
	    }

	    if (timelapsed === void 0) {
	      timelapsed = 0;
	    }

	    this.forEach(function (_ref) {
	      var element = _ref.element,
	          isFunction = _ref.isFunction;
	      return !isFunction && element.play(label, timelapsed);
	    });
	  };

	  _proto.getElementsByTag = function getElementsByTag(tag) {
	    var result = [];
	    this.forEach(function (_ref2) {
	      var element = _ref2.element,
	          isFunction = _ref2.isFunction;

	      if (!isFunction) {
	        var ans = element.getElementsByTag(tag);

	        if (ans) {
	          result = result.concat(ans);
	        }
	      }
	    });
	    return result;
	  };

	  _proto.count = function count() {
	    return this._layers.length;
	  };

	  _proto.clear = function clear() {
	    this._layers = [];
	  };

	  return LayerManager;
	}();

	function Transform() {
	  this.reset();
	}

	Transform.prototype.reset = function () {
	  this.m = [1, 0, 0, 1, 0, 0];
	  return this;
	};

	Transform.prototype.multiply = function (matrix) {
	  var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
	  var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
	  var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
	  var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
	  var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
	  var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
	  this.m[0] = m11;
	  this.m[1] = m12;
	  this.m[2] = m21;
	  this.m[3] = m22;
	  this.m[4] = dx;
	  this.m[5] = dy;
	  return this;
	};

	Transform.prototype.invert = function () {
	  var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
	  var m0 = this.m[3] * d;
	  var m1 = -this.m[1] * d;
	  var m2 = -this.m[2] * d;
	  var m3 = this.m[0] * d;
	  var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
	  var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
	  this.m[0] = m0;
	  this.m[1] = m1;
	  this.m[2] = m2;
	  this.m[3] = m3;
	  this.m[4] = m4;
	  this.m[5] = m5;
	  return this;
	};

	Transform.prototype.rotate = function (rad) {
	  var c = Math.cos(rad);
	  var s = Math.sin(rad);
	  var m11 = this.m[0] * c + this.m[2] * s;
	  var m12 = this.m[1] * c + this.m[3] * s;
	  var m21 = this.m[0] * -s + this.m[2] * c;
	  var m22 = this.m[1] * -s + this.m[3] * c;
	  this.m[0] = m11;
	  this.m[1] = m12;
	  this.m[2] = m21;
	  this.m[3] = m22;
	  return this;
	};

	Transform.prototype.translate = function (x, y) {
	  this.m[4] += this.m[0] * x + this.m[2] * y;
	  this.m[5] += this.m[1] * x + this.m[3] * y;
	  return this;
	};

	Transform.prototype.scale = function (sx, sy) {
	  this.m[0] *= sx;
	  this.m[1] *= sx;
	  this.m[2] *= sy;
	  this.m[3] *= sy;
	  return this;
	};

	Transform.prototype.transformPoint = function (px, py) {
	  var x = px;
	  var y = py;
	  px = x * this.m[0] + y * this.m[2] + this.m[4];
	  py = x * this.m[1] + y * this.m[3] + this.m[5];
	  return [px, py];
	};

	Transform.prototype.clone = function () {
	  var n = new Transform();
	  n.m = this.m.slice(0);
	  return n;
	};

	function ifNull(value, alternative) {
	  return value === undefined || value === null || value === "" ? alternative : value;
	}

	var TimingDefault =
	/*#__PURE__*/
	function () {
	  function TimingDefault(configuration) {
	    if (configuration === void 0) {
	      configuration = {};
	    }

	    this.type = "timing";
	    this._configuration = configuration;
	    this._tickChunk = ifNull(calc(this._configuration.tickChunk), 100 / 6);
	    this._maxSkippedTickChunk = ifNull(calc(this._configuration.maxSkippedTickChunk), 120);
	    this._tickChunkTolerance = ifNull(calc(this._configuration.tickChunkTolerance), 0.1);
	    this.totalTimePassed = 0;
	  }

	  var _proto = TimingDefault.prototype;

	  _proto.init = function init() {};

	  _proto.currentTime = function currentTime() {
	    return window.performance ? performance.now() : Date.now();
	  };

	  _proto.clampTime = function clampTime(_ref) {
	    var timePassed = _ref.timePassed;
	    var maxTime = this._tickChunk ? this._tickChunk * this._maxSkippedTickChunk : 2000;

	    if (timePassed > maxTime) {
	      return maxTime;
	    }

	    return timePassed;
	  };

	  _proto.shiftTime = function shiftTime(_ref2) {
	    var timePassed = _ref2.timePassed;
	    return this._tickChunk ? -(timePassed % this._tickChunk) : 0;
	  };

	  _proto.isChunked = function isChunked() {
	    return this._tickChunk;
	  };

	  _proto.hasOneChunkedFrame = function hasOneChunkedFrame(_ref3) {
	    var timePassed = _ref3.timePassed;
	    return timePassed >= this._tickChunk - this._tickChunkTolerance;
	  };

	  _proto.calcFrames = function calcFrames(_ref4) {
	    var timePassed = _ref4.timePassed;
	    return Math.min(this._maxSkippedTickChunk, Math.floor((timePassed + this._tickChunkTolerance) / this._tickChunk));
	  };

	  _createClass(TimingDefault, [{
	    key: "tickChunk",
	    get: function get() {
	      return this._tickChunk;
	    }
	  }]);

	  return TimingDefault;
	}();

	var Scene =
	/*#__PURE__*/
	function () {
	  function Scene() {
	    this._layerManager = new LayerManager();
	    this._totalTimePassed = 0;
	    this._imageManager = ImageManager;

	    for (var _len = arguments.length, configurationClassOrObjects = new Array(_len), _key = 0; _key < _len; _key++) {
	      configurationClassOrObjects[_key] = arguments[_key];
	    }

	    this.middlewares = configurationClassOrObjects;

	    if (!this.middlewareByType("timing")) {
	      this.middlewares = [TimingDefault].concat(this.middlewares);
	    }
	  }

	  var _proto = Scene.prototype;

	  _proto.middlewareByType = function middlewareByType(type) {
	    var objs = this._middleware._all.filter(function (c) {
	      return c.type == type;
	    });

	    if (objs.length) {
	      return objs[objs.length - 1];
	    }
	  };

	  _proto.has = function has(command) {
	    return command in this._middleware || this._middleware._all.filter(function (c) {
	      return command in c;
	    }).length > 0;
	  };

	  _proto["do"] = function _do(command, params, defaultValue, func) {
	    var objs = this._middleware[command] || this._middleware._all.filter(function (c) {
	      return command in c;
	    });

	    objs = objs.filter(function (v) {
	      return v.enabled;
	    });

	    if (!objs.length) {
	      return defaultValue;
	    }

	    var fullParams = this._param(params);

	    return func(objs, fullParams, defaultValue);
	  };

	  _proto.map = function map(command, params) {
	    if (params === void 0) {
	      params = {};
	    }

	    return this["do"](command, params, [], function (objs, fullParams) {
	      return objs.map(function (c) {
	        return c[command](fullParams);
	      });
	    });
	  };

	  _proto.pipe = function pipe(command, params, _pipe) {
	    var _this = this;

	    if (params === void 0) {
	      params = {};
	    }

	    return this["do"](command, params, _pipe, function (objs, fullParams) {
	      var res = _pipe;
	      _this._stopPropagation = false;

	      for (var _iterator = objs, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	        var _ref;

	        if (_isArray) {
	          if (_i >= _iterator.length) break;
	          _ref = _iterator[_i++];
	        } else {
	          _i = _iterator.next();
	          if (_i.done) break;
	          _ref = _i.value;
	        }

	        var c = _ref;
	        res = c[command](fullParams, res);
	        if (_this._stopPropagation) break;
	      }

	      return res;
	    });
	  };

	  _proto.pipeBack = function pipeBack(command, params, pipe) {
	    var _this2 = this;

	    if (params === void 0) {
	      params = {};
	    }

	    return this["do"](command, params, pipe, function (objs, fullParams) {
	      var res = pipe;
	      _this2._stopPropagation = false;

	      for (var i = objs.length - 1; i >= 0; i--) {
	        var c = objs[i];
	        res = c[command](fullParams, res);
	        if (_this2._stopPropagation) break;
	      }

	      return res;
	    });
	  };

	  _proto.pipeMax = function pipeMax(command, params, pipe) {
	    var _this3 = this;

	    if (params === void 0) {
	      params = {};
	    }

	    return this["do"](command, params, pipe, function (objs, fullParams) {
	      var res = pipe;
	      _this3._stopPropagation = false;

	      var _loop = function _loop() {
	        if (_isArray2) {
	          if (_i2 >= _iterator2.length) return "break";
	          _ref2 = _iterator2[_i2++];
	        } else {
	          _i2 = _iterator2.next();
	          if (_i2.done) return "break";
	          _ref2 = _i2.value;
	        }

	        var c = _ref2;
	        var newRes = c[command](fullParams, res);

	        if (Array.isArray(newRes)) {
	          if (Array.isArray(res)) {
	            res = res.map(function (v, i) {
	              return Math.max(v, newRes[i]);
	            });
	          } else {
	            res = newRes.map(function (v) {
	              return Math.max(v, res);
	            });
	          }
	        } else {
	          if (Array.isArray(res)) {
	            res = res.map(function (v, i) {
	              return Math.max(v, newRes);
	            });
	          } else {
	            res = Math.max(newRes, res);
	          }
	        }

	        if (_this3._stopPropagation) return "break";
	      };

	      for (var _iterator2 = objs, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	        var _ref2;

	        var _ret = _loop();

	        if (_ret === "break") break;
	      }

	      return res;
	    });
	  };

	  _proto.pipeAsync = function pipeAsync(command, params, pipe) {
	    var _this4 = this;

	    if (params === void 0) {
	      params = {};
	    }

	    return this["do"](command, params, pipe, function (objs, fullParams) {
	      try {
	        var _interrupt2 = false;
	        var res = pipe;
	        _this4._stopPropagation = false;

	        var _temp2 = _forOf(objs, function (c) {
	          return Promise.resolve(c[command](fullParams, res)).then(function (_c$command) {
	            res = _c$command;

	            if (_this4._stopPropagation) {
	              _interrupt2 = true;
	            }
	          });
	        }, function () {
	          return _interrupt2;
	        });

	        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {
	          return res;
	        }) : res);
	      } catch (e) {
	        return Promise.reject(e);
	      }
	    });
	  };

	  _proto.value = function value(command, params) {
	    if (params === void 0) {
	      params = {};
	    }

	    var objs = this._middleware[command] || this._middleware._all.filter(function (c) {
	      return command in c;
	    });

	    objs.filter(function (v) {
	      return v.enabled;
	    });

	    if (!objs.length) {
	      return undefined;
	    }

	    var obj = objs[objs.length - 1];
	    return calc(obj[command], obj, this._param(params));
	  };

	  _proto.stopPropagation = function stopPropagation() {
	    this._stopPropagation = true;
	  };

	  _proto.currentTime = function currentTime() {
	    return this.pipe("currentTime");
	  };

	  _proto.clampTime = function clampTime(timePassed) {
	    return this.pipe("clampTime", {
	      timePassed: timePassed
	    });
	  };

	  _proto.shiftTime = function shiftTime(timePassed) {
	    return this.pipe("shiftTime", {
	      timePassed: timePassed
	    });
	  };

	  _proto.cacheClear = function cacheClear() {
	    this._transform = 0;
	    this._transformInvert = 0;
	  };

	  _proto.viewport = function viewport() {
	    if (!this._engine) return new Transform();

	    if (!this._transform) {
	      this._transform = this.pipe("viewport", {}, new Transform());
	      this._transformInvert = null;
	    }

	    return this._transform;
	  };

	  _proto.transformPoint = function transformPoint(x, y, scale) {
	    if (scale === void 0) {
	      scale = this._additionalModifier.scaleCanvas;
	    }

	    if (!this._transformInvert) {
	      this._transformInvert = this.viewport().clone().invert();
	    }

	    return this._transformInvert.transformPoint(x * scale, y * scale);
	  };

	  _proto.callInit = function callInit(parameter, engine) {
	    var _this5 = this;

	    this._engine = engine;
	    this.resize();
	    var images = this.value("images");

	    if (images) {
	      this._imageManager.add(images);
	    }

	    Promise.all(this.map("init", {
	      parameter: parameter
	    })).then(function (res) {
	      return _this5._initDone = true;
	    });
	  };

	  _proto.updateAdditionalModifier = function updateAdditionalModifier() {
	    var output = this._output;
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
	  };

	  _proto.resize = function resize() {
	    var _this6 = this;

	    var output = this._output;
	    this.updateAdditionalModifier();
	    this.pipe("resize");

	    this._layerManager.forEach(function (_ref3) {
	      var element = _ref3.element,
	          isFunction = _ref3.isFunction;

	      if (!isFunction) {
	        element.resize(output, _this6._additionalModifier);
	      }
	    });
	  };

	  _proto.destroy = function destroy() {
	    try {
	      var _this8 = this;

	      return Promise.resolve(_this8.pipeAsync("destroy")).then(function (parameter) {
	        _this8._initDone = false;
	        return parameter;
	      });
	    } catch (e) {
	      return Promise.reject(e);
	    }
	  };

	  _proto._param = function _param(additionalParameter) {
	    return _extends({
	      engine: this._engine,
	      scene: this,
	      imageManager: this._imageManager,
	      layerManager: this._layerManager,
	      totalTimePassed: this._totalTimePassed,
	      output: this._engine && this._output
	    }, additionalParameter);
	  };

	  _proto.callLoading = function callLoading(args) {
	    if (this._imageManager.isLoaded() && this._initDone) {
	      this._endTime = this.value("endTime");
	      args.progress = "Click to play";
	      this.value("loading", {
	        args: args
	      });
	      return true;
	    }

	    args.progress = this._imageManager.getCount() ? this._imageManager.getLoaded() / this._imageManager.getCount() : "Loading...";
	    this.value("loading", {
	      args: args
	    });
	    return false;
	  };

	  _proto.fixedUpdate = function fixedUpdate(timePassed, lastCall) {
	    this.map("fixedUpdate", {
	      timePassed: timePassed,
	      lastCall: lastCall
	    });
	  };

	  _proto.isDrawFrame = function isDrawFrame(timePassed) {
	    return this.pipeMax("isDrawFrame", {
	      timePassed: timePassed
	    }, timePassed !== 0);
	  };

	  _proto.move = function move(timePassed) {
	    this._totalTimePassed += timePassed;

	    if (this._resetIntend) {
	      this.reset();
	    } else if (timePassed < 0) {
	      timePassed = this._totalTimePassed;
	      this.reset();
	      this._totalTimePassed = timePassed;
	    } else if (this._endTime && this._endTime <= this._totalTimePassed) {
	      timePassed -= this._totalTimePassed - this._endTime;
	      this._totalTimePassed = this._endTime;
	      this.map("end", {
	        timePassed: timePassed
	      });
	    }

	    if (this.value("isChunked")) {
	      if (this.value("hasOneChunkedFrame", {
	        timePassed: timePassed
	      })) {
	        var frames = this.value('calcFrames', {
	          timePassed: timePassed
	        }) - 1;

	        for (var calcFrame = 0; calcFrame <= frames; calcFrame++) {
	          this.fixedUpdate(this.value("tickChunk"), calcFrame === frames);
	        }
	      }
	    } else {
	      this.fixedUpdate(timePassed, true);
	    }

	    this.map("update", {
	      timePassed: timePassed
	    });

	    this._layerManager.forEach(function (_ref4) {
	      var element = _ref4.element,
	          isFunction = _ref4.isFunction,
	          layer = _ref4.layer,
	          elementId = _ref4.elementId;

	      if (!isFunction) {
	        if (element.animate(timePassed)) {
	          layer.deleteById(elementId);
	        }
	      }
	    });
	  };

	  _proto.draw = function draw(canvasId) {
	    var _this9 = this;

	    this.map("draw", {
	      canvasId: canvasId
	    });
	    var context = this._output.context[canvasId];
	    context.save();
	    context.setTransform.apply(context, this.viewport().m);

	    this._layerManager.forEach(function (_ref5) {
	      var layer = _ref5.layer,
	          layerId = _ref5.layerId,
	          element = _ref5.element,
	          isFunction = _ref5.isFunction,
	          elementId = _ref5.elementId;

	      if (isFunction) {
	        if (element(_this9._param({
	          layerId: layerId,
	          elementId: elementId,
	          layer: layer,
	          context: context
	        }))) {
	          layer.deleteById(elementId);
	        }
	      } else {
	        element.draw(context, _this9._additionalModifier);
	      }
	    }, canvasId);

	    context.restore();
	  };

	  _proto.initSprites = function initSprites(canvasId) {
	    var _this10 = this;

	    var context = this._output.context[canvasId];

	    this._layerManager.forEach(function (_ref6) {
	      var element = _ref6.element,
	          isFunction = _ref6.isFunction;

	      if (!isFunction) {
	        element.callInit(context, _this10._additionalModifier);
	      }
	    }, canvasId);

	    this.map("initSprites", {
	      canvasId: canvasId
	    });
	  };

	  _proto.resetIntend = function resetIntend() {
	    this._resetIntend = true;
	  };

	  _proto.reset = function reset() {
	    this._totalTimePassed = 0;
	    this._resetIntend = false;
	    var result = this.pipe("reset", {
	      engine: this._engine,
	      scene: this,
	      layerManager: this._layerManager,
	      imageManager: this._imageManager
	    }, new LayerManager());
	    console.log(result);

	    if (Array.isArray(result)) {
	      var layers = result;
	      result = new LayerManager();
	      layers.forEach(function (v) {
	        result.addLayer().addElements(v);
	      });
	    }

	    if (result) {
	      this._layerManager = result;
	    }
	  };

	  _createClass(Scene, [{
	    key: "_output",
	    get: function get() {
	      return this._engine.getOutput();
	    }
	  }, {
	    key: "middlewares",
	    set: function set(middlewares) {
	      this._middleware = toArray(middlewares).map(function (configurationClassOrObject) {
	        return typeof configurationClassOrObject === "function" ? new configurationClassOrObject() : configurationClassOrObject;
	      }).reduce(function (middlewareCommandList, c) {
	        for (var _i3 = 0, _Object$keys = Object.keys(middlewareCommandList); _i3 < _Object$keys.length; _i3++) {
	          var command = _Object$keys[_i3];

	          if (command in c) {
	            middlewareCommandList[command].push(c);
	          }
	        }

	        middlewareCommandList._all.push(c);

	        if (!("enabled" in c)) c.enabled = true;
	        if (c.type) middlewareCommandList["_" + c.type] = c;
	        return middlewareCommandList;
	      }, {
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
	      console.log(this._middleware);
	    },
	    get: function get() {
	      return this._middleware._all;
	    }
	  }, {
	    key: "additionalModifier",
	    get: function get() {
	      return this._additionalModifier;
	    }
	  }, {
	    key: "timing",
	    get: function get() {
	      return this._middleware._timing;
	    }
	  }, {
	    key: "camera",
	    get: function get() {
	      return this._middleware._camera;
	    }
	  }, {
	    key: "control",
	    get: function get() {
	      return this._middleware._control;
	    }
	  }, {
	    key: "totalTimePassed",
	    get: function get() {
	      return this._totalTimePassed;
	    }
	  }]);

	  return Scene;
	}();

	var Wait =
	/*#__PURE__*/
	function () {
	  function Wait(duration) {
	    this.duration = calc(duration) - 0;
	  }

	  var _proto = Wait.prototype;

	  _proto.run = function run(sprite, time) {
	    return time - this.duration;
	  };

	  return Wait;
	}();

	var Sequence =
	/*#__PURE__*/
	function () {
	  function Sequence() {
	    var timeWait = 0;

	    for (var _len = arguments.length, sequences = new Array(_len), _key = 0; _key < _len; _key++) {
	      sequences[_key] = arguments[_key];
	    }

	    if (typeof sequences[0] === "number") {
	      timeWait = sequences.shift();
	    }

	    this.sequences = sequences.map(function (sequence) {
	      if (!Array.isArray(sequence)) {
	        sequence = [sequence];
	      }

	      var thisTimeWait = timeWait;

	      if (typeof sequence[0] === "number") {
	        thisTimeWait = sequence.shift();
	      }

	      return {
	        position: 0,
	        timelapsed: -thisTimeWait,
	        sequence: sequence.map(function (command) {
	          return typeof command.run !== "function" ? typeof command === "number" ? new Wait(command) : {
	            run: command
	          } : command;
	        }).filter(function (command) {
	          return typeof command.run === "function";
	        }),
	        label: sequence.reduce(function (arr, command, index) {
	          if (typeof command === "string") {
	            arr[command] = index - Object.keys(arr).length;
	          }

	          return arr;
	        }, {}),
	        enabled: true
	      };
	    });
	    this.lastTimestamp = 0;
	    this.enabled = true;
	  }

	  var _proto = Sequence.prototype;

	  _proto.reset = function reset(timelapsed) {
	    if (timelapsed === void 0) {
	      timelapsed = 0;
	    }

	    this.sequences.forEach(function (sequencePosition) {
	      sequencePosition.enabled = true;
	      sequencePosition.position = 0;
	      sequencePosition.timelapsed = timelapsed;
	      sequencePosition.sequence[0] && sequencePosition.sequence[0].reset && sequencePosition.sequence[0].reset(timelapsed);
	    });
	    this.enabled = true;
	  };

	  _proto.play = function play(label, timelapsed) {
	    if (label === void 0) {
	      label = "";
	    }

	    if (timelapsed === void 0) {
	      timelapsed = 0;
	    }

	    if (label) {
	      var b = this.sequences.reduce(function (b, sequencePosition) {
	        if (sequencePosition.label.hasOwnProperty(label)) {
	          b = true;
	          sequencePosition.position = sequencePosition.label[label];
	          sequencePosition.enabled = true;
	          sequencePosition.timelapsed = timelapsed;
	          sequencePosition.sequence[sequencePosition.position] && sequencePosition.sequence[sequencePosition.position].reset && sequencePosition.sequence[sequencePosition.position].reset();
	        } else {
	          b |= sequencePosition.sequence.find(function (seq) {
	            return seq.play && seq.play(label, timelapsed);
	          }) >= 0;
	        }

	        return b;
	      }, false);

	      if (b) {
	        this.enabled = true;
	      }

	      return b;
	    } else {
	      this.sequences.forEach(function (sequencePosition) {
	        return sequencePosition.enabled = true;
	      });
	      this.enabled = true;
	      return true;
	    }
	  };

	  _proto.runSequence = function runSequence(sprite, sequencePosition, timePassed) {
	    var timeLeft = timePassed;

	    while (sequencePosition.sequence[sequencePosition.position] && timeLeft >= 0) {
	      sequencePosition.timelapsed += timeLeft;

	      if (sequencePosition.timelapsed < 0) {
	        return -1;
	      }

	      timeLeft = sequencePosition.sequence[sequencePosition.position].run(sprite, sequencePosition.timelapsed);

	      if (timeLeft === true) {
	        timeLeft = 0;
	      } else if (timeLeft === false) {
	        return -1;
	      } else if (timeLeft === Sequence._TIMELAPSE_TO_FORCE_DISABLE) {
	        sequencePosition.enabled = false;
	        this.enabled = false;
	        return timePassed;
	      } else if (timeLeft === Sequence._TIMELAPSE_TO_STOP) {
	        sequencePosition.enabled = false;
	        return timePassed;
	      } else if (timeLeft === Sequence._TIMELAPSE_TO_REMOVE) {
	        return true;
	      }

	      if (timeLeft >= 0) {
	        sequencePosition.position = (sequencePosition.position + 1) % sequencePosition.sequence.length;
	        sequencePosition.sequence[sequencePosition.position] && sequencePosition.sequence[sequencePosition.position].reset && sequencePosition.sequence[sequencePosition.position].reset();
	        sequencePosition.timelapsed = 0;

	        if (sequencePosition.position === 0) {
	          sequencePosition.enabled = false;
	          return timeLeft;
	        }
	      }
	    }

	    return timeLeft;
	  };

	  _proto.run = function run(sprite, time, is_difference) {
	    var timePassed = time;

	    if (!is_difference) {
	      timePassed = time - this.lastTimestamp;
	      this.lastTimestamp = time;
	    }

	    if (!this.enabled) {
	      return timePassed;
	    }

	    var length = this.sequences.length;
	    var disableVote = 0;
	    var restTime = Infinity;

	    for (var i = 0; i < length; i++) {
	      if (this.sequences[i].enabled) {
	        var timeLeft = this.runSequence(sprite, this.sequences[i], timePassed);

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
	  };

	  return Sequence;
	}();

	Sequence._TIMELAPSE_TO_FORCE_DISABLE = "F";
	Sequence._TIMELAPSE_TO_STOP = "S";
	Sequence._TIMELAPSE_TO_REMOVE = "R";

	var degToRad = 0.017453292519943295;

	var Circle =
	/*#__PURE__*/
	function () {
	  function Circle(givenParameter) {
	    this._parseParameterList(this, this._getParameterList(), givenParameter);

	    this._needInit = true;
	  }

	  var _proto = Circle.prototype;

	  _proto._parseParameterList = function _parseParameterList(obj, parameterList, givenParameter) {
	    Object.keys(parameterList).forEach(function (name) {
	      var d = parameterList[name];
	      obj[name] = typeof d === "function" ? d(givenParameter[name], givenParameter, obj) : ifNull(calc(givenParameter[name]), d);
	    });
	  };

	  _proto._getBaseParameterList = function _getBaseParameterList() {
	    return {
	      animation: function animation(value, givenParameter) {
	        var result = calc(value);
	        return Array.isArray(result) ? new Sequence(result) : result;
	      },
	      enabled: true,
	      isClickable: false,
	      tag: function tag(value) {
	        return Array.isArray(value) ? value : value ? [value] : [];
	      }
	    };
	  };

	  _proto._getParameterList = function _getParameterList() {
	    return Object.assign({}, this._getBaseParameterList(), {
	      x: 0,
	      y: 0,
	      rotation: function rotation(value, givenParameter) {
	        return ifNull(calc(value), ifNull(calc(givenParameter.rotationInRadian), ifNull(calc(givenParameter.rotationInDegree), 0) * degToRad));
	      },
	      scaleX: function scaleX(value, givenParameter) {
	        return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
	      },
	      scaleY: function scaleY(value, givenParameter) {
	        return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
	      },
	      alpha: 1,
	      compositeOperation: "source-over",
	      color: "#fff"
	    });
	  };

	  _proto.getElementsByTag = function getElementsByTag(tag) {
	    var _this = this;

	    if (typeof tag === "function") {
	      if (this.tag.filter(tag).length) {
	        return [this];
	      }
	    } else {
	      var aTag = Array.isArray(tag) ? tag : [tag];

	      if (aTag.filter(function (tag) {
	        return _this.tag.includes(tag);
	      }).length) {
	        return [this];
	      }
	    }

	    return [];
	  };

	  _proto.animate = function animate(timepassed) {
	    if (this.animation) {
	      if (this.animation.run(this, timepassed, true) === true) {
	        this.enabled = false;
	        return true;
	      }
	    }

	    return false;
	  };

	  _proto.play = function play(label, timelapsed) {
	    if (label === void 0) {
	      label = "";
	    }

	    if (timelapsed === void 0) {
	      timelapsed = 0;
	    }

	    if (this.animation) {
	      this.animation.play && this.animation.play(label, timelapsed);
	    }
	  };

	  _proto.init = function init(context, additionalModifier) {};

	  _proto.callInit = function callInit(context, additionalModifier) {
	    if (this._needInit) {
	      this.init(context, additionalModifier);
	      this._needInit = false;
	    }
	  };

	  _proto.resize = function resize(output, additionalModifier) {};

	  _proto._detectHelper = function _detectHelper(context, x, y, moveToCenter, callback) {
	    var a = false;

	    if (this.enabled && this.isClickable) {
	      var hw = this.width / 2;
	      var hh = this.height / 2;
	      context.save();

	      if (moveToCenter) {
	        context.translate(this.x + hw, this.y + hh);
	      } else {
	        context.translate(this.x, this.y);
	      }

	      context.scale(this.scaleX, this.scaleY);
	      context.rotate(this.rotation);
	      context.beginPath();

	      if (callback) {
	        a = callback(hw, hh);
	      } else {
	        context.rect(-hw, -hh, this.width, this.height);
	        context.closePath();
	        a = context.isPointInPath(x, y);
	      }

	      context.restore();
	    }

	    return a ? this : false;
	  };

	  _proto.detectDraw = function detectDraw(context, color) {};

	  _proto.detect = function detect(context, x, y) {
	    var _this2 = this;

	    return this._detectHelper(context, x, y, false, function () {
	      context.arc(0, 0, 1, Math.PI / 2 + _this2.rotation, Math.PI * 2.5 - _this2.rotation, false);
	      return context.isPointInPath(x, y);
	    });
	  };

	  _proto.draw = function draw(context, additionalModifier) {
	    if (this.enabled) {
	      context.globalCompositeOperation = this.compositeOperation;
	      context.globalAlpha = this.alpha * additionalModifier.alpha;
	      context.save();
	      context.translate(this.x, this.y);
	      context.scale(this.scaleX, this.scaleY);
	      context.beginPath();
	      context.fillStyle = this.color;
	      context.arc(0, 0, 1, Math.PI / 2 + this.rotation, Math.PI * 2.5 - this.rotation, false);
	      context.fill();
	      context.restore();
	    }
	  };

	  return Circle;
	}();

	var Callback =
	/*#__PURE__*/
	function (_Circle) {
	  _inheritsLoose(Callback, _Circle);

	  function Callback(givenParameter) {
	    var _this;

	    if (typeof givenParameter === "function") {
	      givenParameter = {
	        callback: givenParameter
	      };
	    }

	    _this = _Circle.call(this, givenParameter) || this;
	    _this._timePassed = 0;
	    _this._deltaTime = 0;
	    return _this;
	  }

	  var _proto = Callback.prototype;

	  _proto._getParameterList = function _getParameterList() {
	    return Object.assign({}, this._getBaseParameterList(), {
	      callback: function callback(v) {
	        return typeof v === undefined ? function () {} : v;
	      }
	    });
	  };

	  _proto.animate = function animate(timePassed) {
	    if (this.enabled) {
	      this._timePassed += timePassed;
	      this._deltaTime += timePassed;
	    }

	    return _Circle.prototype.animate.call(this, timePassed);
	  };

	  _proto.detect = function detect(context, color) {};

	  _proto.draw = function draw(context, additionalParameter) {
	    if (this.enabled) {
	      this.callback(context, this._timePassed, additionalParameter, this);
	    }

	    this._deltaTime = 0;
	  };

	  return Callback;
	}(Circle);

	var Group =
	/*#__PURE__*/
	function (_Circle) {
	  _inheritsLoose(Group, _Circle);

	  function Group(givenParameter) {
	    return _Circle.call(this, givenParameter) || this;
	  }

	  var _proto = Group.prototype;

	  _proto._getParameterList = function _getParameterList() {
	    return Object.assign({}, _Circle.prototype._getParameterList.call(this), {
	      sprite: []
	    });
	  };

	  _proto.getElementsByTag = function getElementsByTag(tag) {
	    var result = _Circle.prototype.getElementsByTag.call(this, tag);

	    for (var _iterator = this.sprite, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	      var _ref;

	      if (_isArray) {
	        if (_i >= _iterator.length) break;
	        _ref = _iterator[_i++];
	      } else {
	        _i = _iterator.next();
	        if (_i.done) break;
	        _ref = _i.value;
	      }

	      var sprite = _ref;
	      var ans = sprite.getElementsByTag(tag);

	      if (ans) {
	        result = result.concat(ans);
	      }
	    }

	    return result;
	  };

	  _proto.animate = function animate(timepassed) {
	    var finished = _Circle.prototype.animate.call(this, timepassed),
	        spriteFinished = false;

	    if (this.enabled) {
	      for (var _iterator2 = this.sprite, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	        var _ref2;

	        if (_isArray2) {
	          if (_i2 >= _iterator2.length) break;
	          _ref2 = _iterator2[_i2++];
	        } else {
	          _i2 = _iterator2.next();
	          if (_i2.done) break;
	          _ref2 = _i2.value;
	        }

	        var sprite = _ref2;
	        spriteFinished = spriteFinished || sprite.animate(timepassed) === true;
	      }
	    }

	    if (this.animation) {
	      return finished;
	    } else {
	      if (spriteFinished) {
	        this.enabled = false;
	      }

	      return spriteFinished;
	    }
	  };

	  _proto.play = function play(label, timelapsed) {
	    if (label === void 0) {
	      label = "";
	    }

	    if (timelapsed === void 0) {
	      timelapsed = 0;
	    }

	    if (this.animation) {
	      this.animation.play && this.animation.play(label, timelapsed);
	    }

	    for (var _iterator3 = this.sprite, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
	      var _ref3;

	      if (_isArray3) {
	        if (_i3 >= _iterator3.length) break;
	        _ref3 = _iterator3[_i3++];
	      } else {
	        _i3 = _iterator3.next();
	        if (_i3.done) break;
	        _ref3 = _i3.value;
	      }

	      var sprite = _ref3;
	      sprite.play && sprite.play(label, timelapsed);
	    }
	  };

	  _proto.resize = function resize(output, additionalModifier) {
	    for (var _iterator4 = this.sprite, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
	      var _ref4;

	      if (_isArray4) {
	        if (_i4 >= _iterator4.length) break;
	        _ref4 = _iterator4[_i4++];
	      } else {
	        _i4 = _iterator4.next();
	        if (_i4.done) break;
	        _ref4 = _i4.value;
	      }

	      var sprite = _ref4;
	      sprite.resize(output, additionalModifier);
	    }
	  };

	  _proto.callInit = function callInit(context, additionalModifier) {
	    _Circle.prototype.callInit.call(this, context, additionalModifier);

	    for (var _iterator5 = this.sprite, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
	      var _ref5;

	      if (_isArray5) {
	        if (_i5 >= _iterator5.length) break;
	        _ref5 = _iterator5[_i5++];
	      } else {
	        _i5 = _iterator5.next();
	        if (_i5.done) break;
	        _ref5 = _i5.value;
	      }

	      var sprite = _ref5;
	      sprite.callInit(context, additionalModifier);
	    }
	  };

	  _proto.detectImage = function detectImage(context, color) {
	    if (this.enabled) {
	      for (var _iterator6 = this.sprite, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
	        var _ref6;

	        if (_isArray6) {
	          if (_i6 >= _iterator6.length) break;
	          _ref6 = _iterator6[_i6++];
	        } else {
	          _i6 = _iterator6.next();
	          if (_i6.done) break;
	          _ref6 = _i6.value;
	        }

	        var sprite = _ref6;
	        sprite.detectImage(context, color);
	      }
	    }
	  };

	  _proto.detect = function detect(context, x, y) {
	    if (this.enabled) {
	      for (var _iterator7 = this.sprite, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
	        var _ref7;

	        if (_isArray7) {
	          if (_i7 >= _iterator7.length) break;
	          _ref7 = _iterator7[_i7++];
	        } else {
	          _i7 = _iterator7.next();
	          if (_i7.done) break;
	          _ref7 = _i7.value;
	        }

	        var sprite = _ref7;
	        var a = sprite.detect(context, x, y);
	        if (a) return a;
	      }
	    }

	    return false;
	  };

	  _proto.draw = function draw(context, additionalModifier) {
	    if (this.enabled) {
	      if (this.alpha < 1) {
	        additionalModifier = Object.assign({}, additionalModifier);
	        additionalModifier.alpha *= this.alpha;
	      }

	      context.save();
	      context.translate(this.x, this.y);
	      context.scale(this.scaleX, this.scaleY);
	      context.rotate(this.rotation);

	      for (var _iterator8 = this.sprite, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
	        var _ref8;

	        if (_isArray8) {
	          if (_i8 >= _iterator8.length) break;
	          _ref8 = _iterator8[_i8++];
	        } else {
	          _i8 = _iterator8.next();
	          if (_i8.done) break;
	          _ref8 = _i8.value;
	        }

	        var sprite = _ref8;
	        sprite.draw(context, additionalModifier);
	      }

	      context.restore();
	    }
	  };

	  return Group;
	}(Circle);

	var Canvas =
	/*#__PURE__*/
	function (_Group) {
	  _inheritsLoose(Canvas, _Group);

	  function Canvas(givenParameter) {
	    var _this;

	    _this = _Group.call(this, givenParameter) || this;
	    _this._currentGridSize = false;
	    _this._drawFrame = 2;
	    return _this;
	  }

	  var _proto = Canvas.prototype;

	  _proto._getParameterList = function _getParameterList() {
	    return Object.assign({}, _Group.prototype._getParameterList.call(this), {
	      x: undefined,
	      y: undefined,
	      width: undefined,
	      height: undefined,
	      canvasWidth: undefined,
	      canvasHeight: undefined,
	      gridSize: undefined,
	      norm: function norm(value, givenParameter, setParameter) {
	        return ifNull(calc(value), setParameter.x === undefined && setParameter.y === undefined && setParameter.width === undefined && setParameter.height === undefined);
	      },
	      isDrawFrame: function isDrawFrame(value, givenParameter, setParameter) {
	        return ifNull(value, true);
	      }
	    });
	  };

	  _proto._generateTempCanvas = function _generateTempCanvas(additionalModifier) {
	    var w = additionalModifier.widthInPixel;
	    var h = additionalModifier.heightInPixel;
	    this._temp_canvas = document.createElement("canvas");

	    if (this.canvasWidth && this.canvasHeight) {
	      this._temp_canvas.width = this.canvasWidth;
	      this._temp_canvas.height = this.canvasHeight;
	    } else if (this.gridSize) {
	      this._currentGridSize = this.gridSize;
	      this._temp_canvas.width = Math.round(this._currentGridSize);
	      this._temp_canvas.height = Math.round(this._currentGridSize);
	    } else {
	      this._temp_canvas.width = Math.round(w / this.scaleX);
	      this._temp_canvas.height = Math.round(h / this.scaleY);
	    }

	    this._tctx = this._temp_canvas.getContext("2d");
	  };

	  _proto.normalizeFullScreen = function normalizeFullScreen(additionalModifier) {
	    if (this.norm || this.x === undefined) {
	      this.x = additionalModifier.visibleScreen.x;
	    }

	    if (this.norm || this.y === undefined) {
	      this.y = additionalModifier.visibleScreen.y;
	    }

	    if (this.norm || this.width === undefined) {
	      this.width = additionalModifier.visibleScreen.width;
	    }

	    if (this.norm || this.height === undefined) {
	      this.height = additionalModifier.visibleScreen.height;
	    }
	  };

	  _proto.resize = function resize(output, additionalModifier) {
	    if (this._temp_canvas && this._currentGridSize !== this.gridSize && !this.canvasWidth) {
	      var oldTempCanvas = this._temp_canvas;

	      this._generateTempCanvas(additionalModifier);

	      this._tctx.globalCompositeOperation = "copy";

	      this._tctx.drawImage(oldTempCanvas, 0, 0, oldTempCanvas.width, oldTempCanvas.height, 0, 0, this._temp_canvas.width, this._temp_canvas.height);

	      this._tctx.globalCompositeOperation = "source-over";
	      this._drawFrame = 2;
	    }

	    this.normalizeFullScreen(additionalModifier);

	    _Group.prototype.resize.call(this, output, additionalModifier);
	  };

	  _proto.detect = function detect(context, x, y) {
	    return this._detectHelper(context, x, y, false);
	  };

	  _proto.init = function init(context, additionalModifier) {
	    this._generateTempCanvas(additionalModifier);

	    this.normalizeFullScreen(additionalModifier);
	  };

	  _proto.draw = function draw(context, additionalModifier) {
	    if (this.enabled) {
	      if (this.gridSize && this._currentGridSize !== this.gridSize) {
	        this.resize(additionalModifier);
	      }

	      this._drawFrame = Math.max(this._drawFrame - 1, calc(this.isDrawFrame, context, additionalModifier));
	      var w = this.width,
	          h = this.height,
	          wh = w / 2,
	          hh = h / 2,
	          tw = this._temp_canvas.width,
	          th = this._temp_canvas.height;

	      if (this._drawFrame) {
	        this._tctx.textBaseline = "middle";
	        this._tctx.textAlign = "center";
	        this._tctx.globalAlpha = 1;
	        this._tctx.globalCompositeOperation = "source-over";

	        this._tctx.save();

	        var cam = additionalModifier.cam;

	        if (this.norm && cam) {
	          var scale = Math.max(tw, th) / 2;

	          this._tctx.translate(tw / 2, th / 2);

	          this._tctx.scale(scale, scale);

	          this._tctx.scale(cam.zoom, cam.zoom);

	          this._tctx.translate(-cam.x, -cam.y);
	        }

	        for (var _iterator = this.sprite, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	          var _ref;

	          if (_isArray) {
	            if (_i >= _iterator.length) break;
	            _ref = _iterator[_i++];
	          } else {
	            _i = _iterator.next();
	            if (_i.done) break;
	            _ref = _i.value;
	          }

	          var sprite = _ref;
	          sprite.draw(this._tctx, this.norm ? Object.assign({}, additionalModifier, {
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
	            visibleScreen: {
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
	      context.globalCompositeOperation = this.compositeOperation;
	      context.globalAlpha = this.alpha * additionalModifier.alpha;
	      context.translate(this.x + wh, this.y + hh);
	      context.scale(this.scaleX, this.scaleY);
	      context.rotate(this.rotation);
	      context.drawImage(this._temp_canvas, 0, 0, tw, th, -wh, -hh, w, h);
	      context.restore();
	    }
	  };

	  return Canvas;
	}(Group);

	var Emitter =
	/*#__PURE__*/
	function (_Group) {
	  _inheritsLoose(Emitter, _Group);

	  function Emitter(givenParameter) {
	    var _this;

	    _this = _Group.call(this, givenParameter.self || {}) || this;
	    var count = ifNull(calc(givenParameter.count), 1);
	    _this.sprite = [];
	    var classToEmit = givenParameter["class"];

	    for (var i = 0; i < count; i++) {
	      var parameter = {};

	      for (var index in givenParameter) {
	        if (!["self", "class", "count"].includes(index)) {
	          if (typeof givenParameter[index] === "function") {
	            parameter[index] = givenParameter[index].call(givenParameter, i);
	          } else {
	            parameter[index] = givenParameter[index];
	          }
	        }
	      }

	      _this.sprite[i] = new classToEmit(parameter);
	    }

	    return _this;
	  }

	  return Emitter;
	}(Group);

	var FastBlur =
	/*#__PURE__*/
	function (_Circle) {
	  _inheritsLoose(FastBlur, _Circle);

	  function FastBlur(givenParameter) {
	    var _this;

	    _this = _Circle.call(this, givenParameter) || this;
	    _this._currentGridSize = false;
	    return _this;
	  }

	  var _proto = FastBlur.prototype;

	  _proto._getParameterList = function _getParameterList() {
	    return Object.assign({}, _Circle.prototype._getParameterList.call(this), {
	      x: undefined,
	      y: undefined,
	      width: undefined,
	      height: undefined,
	      gridSize: undefined,
	      darker: 0,
	      pixel: false,
	      clear: false,
	      norm: function norm(value, givenParameter, setParameter) {
	        return ifNull(calc(value), setParameter.x === undefined && setParameter.y === undefined && setParameter.width === undefined && setParameter.height === undefined);
	      }
	    });
	  };

	  _proto._generateTempCanvas = function _generateTempCanvas(additionalModifier) {
	    var w = additionalModifier.widthInPixel;
	    var h = additionalModifier.heightInPixel;
	    this._temp_canvas = document.createElement("canvas");

	    if (this.gridSize) {
	      this._currentGridSize = this.gridSize;
	      this._temp_canvas.width = Math.round(this._currentGridSize);
	      this._temp_canvas.height = Math.round(this._currentGridSize);
	    } else {
	      this._temp_canvas.width = Math.ceil(w / this.scaleX);
	      this._temp_canvas.height = Math.ceil(h / this.scaleY);
	    }

	    this._tctx = this._temp_canvas.getContext("2d");
	    this._tctx.globalCompositeOperation = "source-over";
	    this._tctx.globalAlpha = 1;
	  };

	  _proto.normalizeFullScreen = function normalizeFullScreen(additionalModifier) {
	    if (this.norm || this.x === undefined) {
	      this.x = additionalModifier.visibleScreen.x;
	    }

	    if (this.norm || this.y === undefined) {
	      this.y = additionalModifier.visibleScreen.y;
	    }

	    if (this.norm || this.width === undefined) {
	      this.width = additionalModifier.visibleScreen.width;
	    }

	    if (this.norm || this.height === undefined) {
	      this.height = additionalModifier.visibleScreen.height;
	    }
	  };

	  _proto.resize = function resize(output, additionalModifier) {
	    if (this._temp_canvas && this._currentGridSize !== this.gridSize) {
	      var oldTempCanvas = this._temp_canvas;

	      this._generateTempCanvas(additionalModifier);

	      this._tctx.globalCompositeOperation = "copy";

	      this._tctx.drawImage(oldTempCanvas, 0, 0, oldTempCanvas.width, oldTempCanvas.height, 0, 0, this._temp_canvas.width, this._temp_canvas.height);

	      this._tctx.globalCompositeOperation = "source-over";
	    }

	    this.normalizeFullScreen(additionalModifier);
	  };

	  _proto.detect = function detect(context, x, y) {
	    return this._detectHelper(context, x, y, false);
	  };

	  _proto.init = function init(context, additionalModifier) {
	    this._generateTempCanvas(additionalModifier);

	    this.normalizeFullScreen(additionalModifier);
	  };

	  _proto.draw = function draw(context, additionalModifier) {
	    if (this.enabled && this.alpha > 0) {
	      if (this.gridSize && this._currentGridSize !== this.gridSize) {
	        this.resize(context, additionalModifier);
	      }

	      var a = this.alpha * additionalModifier.alpha,
	          w = this.width,
	          h = this.height,
	          targetW = this._temp_canvas.width,
	          targetH = this._temp_canvas.height;

	      if (a > 0 && targetW && targetH) {
	        this._tctx.globalCompositeOperation = "copy";
	        this._tctx.globalAlpha = 1;

	        this._tctx.drawImage(context.canvas, 0, 0, context.canvas.width, context.canvas.height, 0, 0, targetW, targetH);

	        if (this.darker > 0) {
	          this._tctx.globalCompositeOperation = this.clear ? "source-atop" : "source-over";
	          this._tctx.fillStyle = "rgba(0,0,0," + this.darker + ")";

	          this._tctx.fillRect(0, 0, targetW, targetH);
	        }

	        this.additionalBlur && this.additionalBlur(targetW, targetH, additionalModifier);

	        if (this.clear) {
	          context.globalCompositeOperation = "source-over";
	          context.globalAlpha = 1;
	          context.clearRect(this.x, this.y, w, h);
	        }

	        context.globalCompositeOperation = this.compositeOperation;
	        context.globalAlpha = a;
	        var oldValue = context.imageSmoothingEnabled;
	        context.imageSmoothingEnabled = !this.pixel;
	        context.drawImage(this._temp_canvas, 0, 0, targetW, targetH, this.x, this.y, w, h);
	        context.imageSmoothingEnabled = oldValue;
	      }
	    } else {
	      if (this.clear) {
	        if (!this.x) {
	          this.x = additionalModifier.x;
	        }

	        if (!this.y) {
	          this.y = additionalModifier.y;
	        }

	        if (!this.width) {
	          this.width = additionalModifier.width;
	        }

	        if (!this.height) {
	          this.height = additionalModifier.height;
	        }

	        context.clearRect(this.x, this.y, this.width, this.height);
	      }
	    }
	  };

	  return FastBlur;
	}(Circle);

	var Image =
	/*#__PURE__*/
	function (_Circle) {
	  _inheritsLoose(Image, _Circle);

	  function Image(givenParameter) {
	    var _this;

	    _this = _Circle.call(this, givenParameter) || this;
	    _this._currentTint = false;
	    return _this;
	  }

	  var _proto = Image.prototype;

	  _proto._getParameterList = function _getParameterList() {
	    return Object.assign({}, _Circle.prototype._getParameterList.call(this), {
	      image: function image(v) {
	        return ImageManager.getImage(calc(v));
	      },
	      position: Image.CENTER,
	      frameX: 0,
	      frameY: 0,
	      frameWidth: 0,
	      frameHeight: 0,
	      width: undefined,
	      height: undefined,
	      norm: false,
	      normCover: false,
	      normToScreen: false,
	      clickExact: false,
	      color: "#FFF",
	      tint: 0
	    });
	  };

	  _proto.resize = function resize(output, additionalModifier) {
	    this._needInit = true;
	  };

	  _proto.init = function init(context, additionalModifier) {
	    var frameWidth = this.frameWidth || this.image.width;
	    var frameHeight = this.frameHeight || this.image.height;
	    this._normScale = this.normToScreen ? this.normCover ? Math.max(additionalModifier.fullScreen.width / frameWidth, additionalModifier.fullScreen.height / frameHeight) : this.norm ? Math.min(additionalModifier.fullScreen.width / frameWidth, additionalModifier.fullScreen.height / frameHeight) : 1 : this.normCover ? Math.max(additionalModifier.width / frameWidth, additionalModifier.height / frameHeight) : this.norm ? Math.min(additionalModifier.width / frameWidth, additionalModifier.height / frameHeight) : 1;
	  };

	  _proto._tintCacheKey = function _tintCacheKey() {
	    var frameWidth = this.frameWidth || this.image.width;
	    var frameHeight = this.frameHeight || this.image.height;
	    return [this.tint, frameWidth, frameHeight, this.color, this.frameX, this.frameY].join(";");
	  };

	  _proto._temp_context = function _temp_context(frameWidth, frameHeight) {
	    if (!this._temp_canvas) {
	      this._temp_canvas = document.createElement("canvas");
	      this._tctx = this._temp_canvas.getContext("2d");
	    }

	    this._temp_canvas.width = frameWidth;
	    this._temp_canvas.height = frameHeight;
	    return this._tctx;
	  };

	  _proto.detectDraw = function detectDraw(context, color) {
	    if (this.enabled && this.isClickable && this.clickExact) {
	      var frameWidth = this.frameWidth || this.image.width;
	      var frameHeight = this.frameHeight || this.image.height;
	      var sX = (this.width ? this.width : frameWidth) * this._normScale * this.scaleX;
	      var sY = (this.height ? this.height : frameHeight) * this._normScale * this.scaleY;
	      var isTopLeft = this.position === Image.LEFT_TOP;

	      var tctx = this._temp_context(frameWidth, frameHeight);

	      tctx.globalAlpha = 1;
	      tctx.globalCompositeOperation = "source-over";
	      tctx.fillStyle = color;
	      tctx.fillRect(0, 0, frameWidth, frameHeight);
	      tctx.globalCompositeOperation = "destination-atop";
	      tctx.drawImage(this.image, this.frameX, this.frameY, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
	      context.save();
	      context.translate(this.x, this.y);
	      context.scale(this.scaleX, this.scaleY);
	      context.rotate(this.rotation);
	      context.drawImage(this._temp_canvas, 0, 0, frameWidth, frameHeight, isTopLeft ? 0 : -sX / 2, isTopLeft ? 0 : -sY / 2, sX, sY);
	      context.restore();
	      this._currentTint = false;
	    }
	  };

	  _proto.detect = function detect(context, x, y) {
	    if (this.enabled && this.isClickable && this.clickExact) return "c";
	    return this._detectHelper(context, x, y, false);
	  };

	  _proto.draw = function draw(context, additionalModifier) {
	    if (this.enabled && this.image && this.alpha > 0) {
	      var frameWidth = this.frameWidth || this.image.width,
	          frameHeight = this.frameHeight || this.image.height;
	      var sX = (this.width ? this.width : frameWidth) * this._normScale * this.scaleX,
	          sY = (this.height ? this.height : frameHeight) * this._normScale * this.scaleY;
	      context.globalCompositeOperation = this.compositeOperation;
	      context.globalAlpha = this.alpha * additionalModifier.alpha;
	      var isTopLeft = this.position === Image.LEFT_TOP;

	      if (this.tint && this._currentTint !== this._tintCacheKey()) {
	        var tctx = this._temp_context(frameWidth, frameHeight);

	        tctx.globalAlpha = 1;
	        tctx.globalCompositeOperation = "source-over";
	        tctx.clearRect(0, 0, frameWidth, frameHeight);
	        tctx.globalAlpha = this.tint;
	        tctx.fillStyle = this.color;
	        tctx.fillRect(0, 0, frameWidth, frameHeight);
	        tctx.globalAlpha = 1;
	        tctx.globalCompositeOperation = "destination-atop";
	        tctx.drawImage(this.image, this.frameX, this.frameY, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
	        this._currentTint = this._tintCacheKey();
	      }

	      if (this.rotation == 0) {
	        if (isTopLeft) {
	          context.drawImage(this.tint ? this._temp_canvas : this.image, this.tint ? 0 : this.frameX, this.tint ? 0 : this.frameY, frameWidth, frameHeight, this.x, this.y, sX, sY);
	        } else {
	          context.drawImage(this.tint ? this._temp_canvas : this.image, this.tint ? 0 : this.frameX, this.tint ? 0 : this.frameY, frameWidth, frameHeight, this.x - sX / 2, this.y - sY / 2, sX, sY);
	        }
	      } else {
	        context.save();
	        context.translate(this.x, this.y);
	        context.rotate(this.rotation);
	        context.drawImage(this.tint ? this._temp_canvas : this.image, this.tint ? 0 : this.frameX, this.tint ? 0 : this.frameY, frameWidth, frameHeight, isTopLeft ? 0 : -sX / 2, isTopLeft ? 0 : -sY / 2, sX, sY);
	        context.restore();
	      }
	    }
	  };

	  return Image;
	}(Circle);

	Image.LEFT_TOP = 0;
	Image.CENTER = 1;

	var Text =
	/*#__PURE__*/
	function (_Circle) {
	  _inheritsLoose(Text, _Circle);

	  function Text(givenParameters) {
	    return _Circle.call(this, givenParameters) || this;
	  }

	  var _proto = Text.prototype;

	  _proto._getParameterList = function _getParameterList() {
	    return Object.assign({}, _Circle.prototype._getParameterList.call(this), {
	      text: undefined,
	      font: '2em monospace',
	      position: Text.CENTER,
	      color: undefined,
	      borderColor: undefined,
	      lineWidth: 1
	    });
	  };

	  _proto.detectDraw = function detectDraw(context, color) {
	    if (this.enabled && this.isClickable) {
	      context.save();
	      context.translate(this.x, this.y);
	      context.scale(this.scaleX, this.scaleY);
	      context.rotate(this.rotation);

	      if (!this.position) {
	        context.textAlign = 'left';
	        context.textBaseline = 'top';
	      }

	      context.font = this.font;
	      context.fillStyle = color;
	      context.fillText(this.text, 0, 0);
	      context.restore();
	    }
	  };

	  _proto.detect = function detect(context, color) {
	    return "c";
	  };

	  _proto.draw = function draw(context, additionalModifier) {
	    if (this.enabled) {
	      context.globalCompositeOperation = this.compositeOperation;
	      context.globalAlpha = this.alpha * additionalModifier.alpha;
	      context.save();

	      if (!this.position) {
	        context.textAlign = 'left';
	        context.textBaseline = 'top';
	      }

	      context.translate(this.x, this.y);
	      context.scale(this.scaleX, this.scaleY);
	      context.rotate(this.rotation);
	      context.font = this.font;

	      if (this.color) {
	        context.fillStyle = this.color;
	        context.fillText(this.text, 0, 0);
	      }

	      if (this.borderColor) {
	        context.strokeStyle = this.borderColor;
	        context.lineWidth = this.lineWidth;
	        context.strokeText(this.text, 0, 0);
	      }

	      context.restore();
	    }
	  };

	  return Text;
	}(Circle);

	Text.LEFT_TOP = 0;
	Text.CENTER = 1;

	function bound01(n, max) {
	    if (isOnePointZero(n)) {
	        n = '100%';
	    }
	    var processPercent = isPercentage(n);
	    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
	    if (processPercent) {
	        n = parseInt(String(n * max), 10) / 100;
	    }
	    if (Math.abs(n - max) < 0.000001) {
	        return 1;
	    }
	    if (max === 360) {
	        n = (n < 0 ? (n % max) + max : n % max) / parseFloat(String(max));
	    }
	    else {
	        n = (n % max) / parseFloat(String(max));
	    }
	    return n;
	}
	function clamp01(val) {
	    return Math.min(1, Math.max(0, val));
	}
	function isOnePointZero(n) {
	    return typeof n === 'string' && n.includes('.') && parseFloat(n) === 1;
	}
	function isPercentage(n) {
	    return typeof n === 'string' && n.includes('%');
	}
	function boundAlpha(a) {
	    a = parseFloat(a);
	    if (isNaN(a) || a < 0 || a > 1) {
	        a = 1;
	    }
	    return a;
	}
	function convertToPercentage(n) {
	    if (n <= 1) {
	        return Number(n) * 100 + "%";
	    }
	    return n;
	}
	function pad2(c) {
	    return c.length === 1 ? '0' + c : String(c);
	}

	function rgbToRgb(r, g, b) {
	    return {
	        r: bound01(r, 255) * 255,
	        g: bound01(g, 255) * 255,
	        b: bound01(b, 255) * 255,
	    };
	}
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
	        h = 0;
	    }
	    else {
	        var d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        switch (max) {
	            case r:
	                h = ((g - b) / d) + (g < b ? 6 : 0);
	                break;
	            case g:
	                h = ((b - r) / d) + 2;
	                break;
	            case b:
	                h = ((r - g) / d) + 4;
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
	        return p + ((q - p) * (6 * t));
	    }
	    if (t < 1 / 2) {
	        return q;
	    }
	    if (t < 2 / 3) {
	        return p + ((q - p) * ((2 / 3) - t) * 6);
	    }
	    return p;
	}
	function hslToRgb(h, s, l) {
	    var r;
	    var g;
	    var b;
	    h = bound01(h, 360);
	    s = bound01(s, 100);
	    l = bound01(l, 100);
	    if (s === 0) {
	        g = l;
	        b = l;
	        r = l;
	    }
	    else {
	        var q = l < 0.5 ? (l * (1 + s)) : (l + s - (l * s));
	        var p = (2 * l) - q;
	        r = hue2rgb(p, q, h + (1 / 3));
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - (1 / 3));
	    }
	    return { r: r * 255, g: g * 255, b: b * 255 };
	}
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
	        h = 0;
	    }
	    else {
	        switch (max) {
	            case r:
	                h = ((g - b) / d) + (g < b ? 6 : 0);
	                break;
	            case g:
	                h = ((b - r) / d) + 2;
	                break;
	            case b:
	                h = ((r - g) / d) + 4;
	                break;
	        }
	        h /= 6;
	    }
	    return { h: h, s: s, v: v };
	}
	function hsvToRgb(h, s, v) {
	    h = bound01(h, 360) * 6;
	    s = bound01(s, 100);
	    v = bound01(v, 100);
	    var i = Math.floor(h);
	    var f = h - i;
	    var p = v * (1 - s);
	    var q = v * (1 - (f * s));
	    var t = v * (1 - ((1 - f) * s));
	    var mod = i % 6;
	    var r = [v, q, p, p, t, v][mod];
	    var g = [t, v, v, q, p, p][mod];
	    var b = [p, p, t, v, v, q][mod];
	    return { r: r * 255, g: g * 255, b: b * 255 };
	}
	function rgbToHex(r, g, b, allow3Char) {
	    var hex = [
	        pad2(Math.round(r).toString(16)),
	        pad2(Math.round(g).toString(16)),
	        pad2(Math.round(b).toString(16)),
	    ];
	    if (allow3Char &&
	        hex[0].startsWith(hex[0].charAt(1)) &&
	        hex[1].startsWith(hex[1].charAt(1)) &&
	        hex[2].startsWith(hex[2].charAt(1))) {
	        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
	    }
	    return hex.join('');
	}
	function rgbaToHex(r, g, b, a, allow4Char) {
	    var hex = [
	        pad2(Math.round(r).toString(16)),
	        pad2(Math.round(g).toString(16)),
	        pad2(Math.round(b).toString(16)),
	        pad2(convertDecimalToHex(a)),
	    ];
	    if (allow4Char &&
	        hex[0].startsWith(hex[0].charAt(1)) &&
	        hex[1].startsWith(hex[1].charAt(1)) &&
	        hex[2].startsWith(hex[2].charAt(1)) &&
	        hex[3].startsWith(hex[3].charAt(1))) {
	        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
	    }
	    return hex.join('');
	}
	function convertDecimalToHex(d) {
	    return Math.round(parseFloat(d) * 255).toString(16);
	}
	function convertHexToDecimal(h) {
	    return parseIntFromHex(h) / 255;
	}
	function parseIntFromHex(val) {
	    return parseInt(val, 16);
	}

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
	    gold: '#ffd700',
	    goldenrod: '#daa520',
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
	    lavender: '#e6e6fa',
	    lavenderblush: '#fff0f5',
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
	var CSS_INTEGER = '[-\\+]?\\d+%?';
	var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
	var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
	var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
	var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
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
	function isValidCSSUnit(color) {
	    return Boolean(matchers.CSS_UNIT.exec(String(color)));
	}

	var TinyColor = (function () {
	    function TinyColor(color, opts) {
	        if (color === void 0) { color = ''; }
	        if (opts === void 0) { opts = {}; }
	        var _a;
	        if (color instanceof TinyColor) {
	            return color;
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
	    TinyColor.prototype.getBrightness = function () {
	        var rgb = this.toRgb();
	        return ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
	    };
	    TinyColor.prototype.getLuminance = function () {
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
	            R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);
	        }
	        if (GsRGB <= 0.03928) {
	            G = GsRGB / 12.92;
	        }
	        else {
	            G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);
	        }
	        if (BsRGB <= 0.03928) {
	            B = BsRGB / 12.92;
	        }
	        else {
	            B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);
	        }
	        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
	    };
	    TinyColor.prototype.getAlpha = function () {
	        return this.a;
	    };
	    TinyColor.prototype.setAlpha = function (alpha) {
	        this.a = boundAlpha(alpha);
	        this.roundA = Math.round(100 * this.a) / 100;
	        return this;
	    };
	    TinyColor.prototype.toHsv = function () {
	        var hsv = rgbToHsv(this.r, this.g, this.b);
	        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
	    };
	    TinyColor.prototype.toHsvString = function () {
	        var hsv = rgbToHsv(this.r, this.g, this.b);
	        var h = Math.round(hsv.h * 360);
	        var s = Math.round(hsv.s * 100);
	        var v = Math.round(hsv.v * 100);
	        return this.a === 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this.roundA + ")";
	    };
	    TinyColor.prototype.toHsl = function () {
	        var hsl = rgbToHsl(this.r, this.g, this.b);
	        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
	    };
	    TinyColor.prototype.toHslString = function () {
	        var hsl = rgbToHsl(this.r, this.g, this.b);
	        var h = Math.round(hsl.h * 360);
	        var s = Math.round(hsl.s * 100);
	        var l = Math.round(hsl.l * 100);
	        return this.a === 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this.roundA + ")";
	    };
	    TinyColor.prototype.toHex = function (allow3Char) {
	        if (allow3Char === void 0) { allow3Char = false; }
	        return rgbToHex(this.r, this.g, this.b, allow3Char);
	    };
	    TinyColor.prototype.toHexString = function (allow3Char) {
	        if (allow3Char === void 0) { allow3Char = false; }
	        return '#' + this.toHex(allow3Char);
	    };
	    TinyColor.prototype.toHex8 = function (allow4Char) {
	        if (allow4Char === void 0) { allow4Char = false; }
	        return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
	    };
	    TinyColor.prototype.toHex8String = function (allow4Char) {
	        if (allow4Char === void 0) { allow4Char = false; }
	        return '#' + this.toHex8(allow4Char);
	    };
	    TinyColor.prototype.toRgb = function () {
	        return {
	            r: Math.round(this.r),
	            g: Math.round(this.g),
	            b: Math.round(this.b),
	            a: this.a,
	        };
	    };
	    TinyColor.prototype.toRgbString = function () {
	        var r = Math.round(this.r);
	        var g = Math.round(this.g);
	        var b = Math.round(this.b);
	        return this.a === 1 ? "rgb(" + r + ", " + g + ", " + b + ")" : "rgba(" + r + ", " + g + ", " + b + ", " + this.roundA + ")";
	    };
	    TinyColor.prototype.toPercentageRgb = function () {
	        var fmt = function (x) { return Math.round(bound01(x, 255) * 100) + "%"; };
	        return {
	            r: fmt(this.r),
	            g: fmt(this.g),
	            b: fmt(this.b),
	            a: this.a,
	        };
	    };
	    TinyColor.prototype.toPercentageRgbString = function () {
	        var rnd = function (x) { return Math.round(bound01(x, 255) * 100); };
	        return this.a === 1 ?
	            "rgb(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%)" :
	            "rgba(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%, " + this.roundA + ")";
	    };
	    TinyColor.prototype.toName = function () {
	        if (this.a === 0) {
	            return 'transparent';
	        }
	        if (this.a < 1) {
	            return false;
	        }
	        var hex = '#' + rgbToHex(this.r, this.g, this.b, false);
	        for (var _i = 0, _a = Object.keys(names); _i < _a.length; _i++) {
	            var key = _a[_i];
	            if (names[key] === hex) {
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
	    TinyColor.prototype.clone = function () {
	        return new TinyColor(this.toString());
	    };
	    TinyColor.prototype.lighten = function (amount) {
	        if (amount === void 0) { amount = 10; }
	        var hsl = this.toHsl();
	        hsl.l += amount / 100;
	        hsl.l = clamp01(hsl.l);
	        return new TinyColor(hsl);
	    };
	    TinyColor.prototype.brighten = function (amount) {
	        if (amount === void 0) { amount = 10; }
	        var rgb = this.toRgb();
	        rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
	        rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
	        rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
	        return new TinyColor(rgb);
	    };
	    TinyColor.prototype.darken = function (amount) {
	        if (amount === void 0) { amount = 10; }
	        var hsl = this.toHsl();
	        hsl.l -= amount / 100;
	        hsl.l = clamp01(hsl.l);
	        return new TinyColor(hsl);
	    };
	    TinyColor.prototype.tint = function (amount) {
	        if (amount === void 0) { amount = 10; }
	        return this.mix('white', amount);
	    };
	    TinyColor.prototype.shade = function (amount) {
	        if (amount === void 0) { amount = 10; }
	        return this.mix('black', amount);
	    };
	    TinyColor.prototype.desaturate = function (amount) {
	        if (amount === void 0) { amount = 10; }
	        var hsl = this.toHsl();
	        hsl.s -= amount / 100;
	        hsl.s = clamp01(hsl.s);
	        return new TinyColor(hsl);
	    };
	    TinyColor.prototype.saturate = function (amount) {
	        if (amount === void 0) { amount = 10; }
	        var hsl = this.toHsl();
	        hsl.s += amount / 100;
	        hsl.s = clamp01(hsl.s);
	        return new TinyColor(hsl);
	    };
	    TinyColor.prototype.greyscale = function () {
	        return this.desaturate(100);
	    };
	    TinyColor.prototype.spin = function (amount) {
	        var hsl = this.toHsl();
	        var hue = (hsl.h + amount) % 360;
	        hsl.h = hue < 0 ? 360 + hue : hue;
	        return new TinyColor(hsl);
	    };
	    TinyColor.prototype.mix = function (color, amount) {
	        if (amount === void 0) { amount = 50; }
	        var rgb1 = this.toRgb();
	        var rgb2 = new TinyColor(color).toRgb();
	        var p = amount / 100;
	        var rgba = {
	            r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
	            g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
	            b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
	            a: ((rgb2.a - rgb1.a) * p) + rgb1.a,
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
	    TinyColor.prototype.triad = function () {
	        return this.polyad(3);
	    };
	    TinyColor.prototype.tetrad = function () {
	        return this.polyad(4);
	    };
	    TinyColor.prototype.polyad = function (n) {
	        var hsl = this.toHsl();
	        var h = hsl.h;
	        var result = [this];
	        var increment = 360 / n;
	        for (var i = 1; i < n; i++) {
	            result.push(new TinyColor({ h: (h + (i * increment)) % 360, s: hsl.s, l: hsl.l }));
	        }
	        return result;
	    };
	    TinyColor.prototype.equals = function (color) {
	        return this.toRgbString() === new TinyColor(color).toRgbString();
	    };
	    return TinyColor;
	}());
	function tinycolor(color, opts) {
	    if (color === void 0) { color = ''; }
	    if (opts === void 0) { opts = {}; }
	    return new TinyColor(color, opts);
	}

	var tinycolorf = typeof tinycolor === 'function' ? tinycolor : tinycolor.tinycolor;
	var gradientSize = 64;
	var gradientResolution = 4;
	var gradientSizeHalf = gradientSize >> 1;

	var Particle =
	/*#__PURE__*/
	function (_Circle) {
	  _inheritsLoose(Particle, _Circle);

	  function Particle(givenParameter) {
	    var _this;

	    _this = _Circle.call(this, givenParameter) || this;
	    _this._currentScaleX = undefined;
	    _this._currentPixelSmoothing = false;
	    return _this;
	  }

	  Particle.getGradientImage = function getGradientImage(r, g, b) {
	    var cr = r >> gradientResolution,
	        cg = g >> gradientResolution,
	        cb = b >> gradientResolution;

	    if (!Particle._Gradient) {
	      var length = 256 >> gradientResolution;
	      Particle._Gradient = Array.from({
	        length: length
	      }, function (a) {
	        return Array.from({
	          length: length
	        }, function (a) {
	          return Array.from({
	            length: length
	          });
	        });
	      });
	    }

	    if (!Particle._Gradient[cr][cg][cb]) {
	      Particle._Gradient[cr][cg][cb] = Particle.generateGradientImage(cr, cg, cb);
	    }

	    return Particle._Gradient[cr][cg][cb];
	  };

	  Particle.generateGradientImage = function generateGradientImage(cr, cg, cb) {
	    var canvas = document.createElement("canvas");
	    canvas.width = canvas.height = gradientSize;
	    var txtc = canvas.getContext("2d");
	    txtc.globalAlpha = 1;
	    txtc.globalCompositeOperation = "source-over";
	    txtc.clearRect(0, 0, gradientSize, gradientSize);
	    var grad = txtc.createRadialGradient(gradientSizeHalf, gradientSizeHalf, 0, gradientSizeHalf, gradientSizeHalf, gradientSizeHalf);
	    grad.addColorStop(0, "rgba(" + ((cr << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cg << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cb << gradientResolution) + (1 << gradientResolution) - 1) + ",1)");
	    grad.addColorStop(0.3, "rgba(" + ((cr << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cg << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cb << gradientResolution) + (1 << gradientResolution) - 1) + ",0.4)");
	    grad.addColorStop(1, "rgba(" + ((cr << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cg << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cb << gradientResolution) + (1 << gradientResolution) - 1) + ",0)");
	    txtc.fillStyle = grad;
	    txtc.fillRect(0, 0, gradientSize, gradientSize);
	    return canvas;
	  };

	  var _proto = Particle.prototype;

	  _proto.resize = function resize(output, additionalModifier) {
	    this._currentScaleX = undefined;
	  };

	  _proto.draw = function draw(context, additionalModifier) {
	    if (this.enabled) {
	      if (!this.color || !this.color.r) {
	        this.color = tinycolorf(this.color).toRgb();
	      }

	      if (this._currentScaleX !== this.scaleX) {
	        this._currentScaleX = this.scaleX;
	        this._currentPixelSmoothing = this.scaleX * additionalModifier.widthInPixel / additionalModifier.width > gradientSize;
	      }

	      var _this$color = this.color,
	          r = _this$color.r,
	          g = _this$color.g,
	          b = _this$color.b;
	      context.globalCompositeOperation = this.compositeOperation;
	      context.globalAlpha = this.alpha * additionalModifier.alpha;
	      context.imageSmoothingEnabled = this._currentPixelSmoothing;
	      context.drawImage(Particle.getGradientImage(r, g, b), 0, 0, gradientSize, gradientSize, this.x - this.scaleX / 2, this.y - this.scaleY / 2, this.scaleX, this.scaleY);
	      context.imageSmoothingEnabled = true;
	    }
	  };

	  return Particle;
	}(Circle);

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var pasition = createCommonjsModule(function (module, exports) {
	/**
	 * pasition v1.0.2 By dntzhang
	 * Github: https://github.com/AlloyTeam/pasition
	 * MIT Licensed.
	 */

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

	var Path =
	/*#__PURE__*/
	function (_Group) {
	  _inheritsLoose(Path, _Group);

	  function Path(givenParameters) {
	    var _this;

	    _this = _Group.call(this, givenParameters) || this;
	    _this.oldPath = undefined;
	    _this.path2D = new Path2D();

	    if (_this.polyfill) {
	      if (typeof Path2D !== "function") {
	        var head = document.getElementsByTagName("head")[0];
	        var script = document.createElement("script");
	        script.type = "text/javascript";
	        script.src = "https://cdn.jsdelivr.net/npm/canvas-5-polyfill@0.1.5/canvas.min.js";
	        head.appendChild(script);
	      } else {
	        var ctx = document.createElement("canvas").getContext("2d");
	        ctx.stroke(new Path2D("M0,0H1"));

	        if (ctx.getImageData(0, 0, 1, 1).data[3]) {
	          _this.polyfill = false;
	        }
	      }
	    }

	    return _this;
	  }

	  var _proto = Path.prototype;

	  _proto._getParameterList = function _getParameterList() {
	    return Object.assign({}, _Group.prototype._getParameterList.call(this), {
	      path: undefined,
	      color: undefined,
	      borderColor: undefined,
	      lineWidth: 1,
	      clip: false,
	      fixed: false,
	      polyfill: true
	    });
	  };

	  _proto.changeToPathInit = function changeToPathInit(from, to) {
	    return pasition._preprocessing(typeof from === "string" ? pasition.path2shapes(from) : from, typeof to === "string" ? pasition.path2shapes(to) : to);
	  };

	  _proto.changeToPath = function changeToPath(progress, data, sprite) {
	    return pasition._lerp(data.pathFrom, data.pathTo, progress);
	  };

	  _proto.detect = function detect(context, x, y) {
	    var _this2 = this;

	    return this._detectHelper(context, x, y, false, function () {
	      return context.isPath(_this2.path2D, x, y);
	    });
	  };

	  _proto.draw = function draw(context, additionalModifier) {
	    var _this3 = this;

	    if (this.enabled) {
	      var a = this.alpha * additionalModifier.alpha;

	      if (this.oldPath !== this.path) {
	        if (this.polyfill && typeof this.path === "string") {
	          this.path = pasition.path2shapes(this.path);
	        }

	        if (Array.isArray(this.path)) {
	          this.path2D = new Path2D();
	          this.path.forEach(function (curve) {
	            _this3.path2D.moveTo(curve[0][0], curve[0][1]);

	            curve.forEach(function (points) {
	              _this3.path2D.bezierCurveTo(points[2], points[3], points[4], points[5], points[6], points[7]);
	            });

	            _this3.path2D.closePath();
	          });
	        } else if (this.path instanceof Path2D) {
	          this.path2D = this.path;
	        } else {
	          this.path2D = new Path2D(this.path);
	        }

	        this.oldPath = this.path;
	      }

	      var scaleX = this.scaleX,
	          scaleY = this.scaleY;

	      if (this.fixed) {
	        if (scaleX == 0) {
	          scaleX = Number.EPSILON;
	        }

	        if (scaleY == 0) {
	          scaleY = Number.EPSILON;
	        }
	      }

	      context.globalCompositeOperation = this.compositeOperation;
	      context.globalAlpha = a;
	      context.save();
	      context.translate(this.x, this.y);
	      context.scale(scaleX, scaleY);
	      context.rotate(this.rotation);

	      if (this.color) {
	        context.fillStyle = this.color;
	        context.fill(this.path2D);
	      }

	      context.save();

	      if (this.clip) {
	        context.clip(this.path2D);

	        if (this.fixed) {
	          context.rotate(-this.rotation);
	          context.scale(1 / scaleX, 1 / scaleY);
	          context.translate(-this.x, -this.y);
	        }
	      }

	      for (var _iterator = this.sprite, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	        var _ref;

	        if (_isArray) {
	          if (_i >= _iterator.length) break;
	          _ref = _iterator[_i++];
	        } else {
	          _i = _iterator.next();
	          if (_i.done) break;
	          _ref = _i.value;
	        }

	        var sprite = _ref;
	        sprite.draw(context, additionalModifier);
	      }

	      context.restore();

	      if (this.borderColor) {
	        context.strokeStyle = this.borderColor;
	        context.lineWidth = this.lineWidth;
	        context.stroke(this.path2D);
	      }

	      context.restore();
	    }
	  };

	  return Path;
	}(Group);

	var Rect =
	/*#__PURE__*/
	function (_Circle) {
	  _inheritsLoose(Rect, _Circle);

	  function Rect(givenParameters) {
	    return _Circle.call(this, givenParameters) || this;
	  }

	  var _proto = Rect.prototype;

	  _proto._getParameterList = function _getParameterList() {
	    return Object.assign({}, _Circle.prototype._getParameterList.call(this), {
	      x: undefined,
	      y: undefined,
	      width: undefined,
	      height: undefined,
	      borderColor: undefined,
	      color: undefined,
	      lineWidth: 1,
	      clear: false,
	      norm: function norm(value, givenParameter, setParameter) {
	        return ifNull(calc(value), setParameter.x === undefined && setParameter.y === undefined && setParameter.width === undefined && setParameter.height === undefined);
	      },
	      position: Rect.CENTER
	    });
	  };

	  _proto.normalizeFullScreen = function normalizeFullScreen(additionalModifier) {
	    if (this.norm || this.width === undefined) {
	      this.width = additionalModifier.visibleScreen.width;
	    }

	    if (this.norm || this.height === undefined) {
	      this.height = additionalModifier.visibleScreen.height;
	    }

	    if (this.norm || this.x === undefined) {
	      this.x = additionalModifier.visibleScreen.x;

	      if (this.position === Rect.CENTER) {
	        this.x += this.width / 2;
	      }
	    }

	    if (this.norm || this.y === undefined) {
	      this.y = additionalModifier.visibleScreen.y;

	      if (this.position === Rect.CENTER) {
	        this.y += this.height / 2;
	      }
	    }
	  };

	  _proto.resize = function resize(output, additionalModifier) {
	    this._needInit = true;
	  };

	  _proto.init = function init(context, additionalModifier) {
	    this.normalizeFullScreen(additionalModifier);
	  };

	  _proto.detect = function detect(context, x, y) {
	    return this._detectHelper(context, x, y, this.position === Rect.LEFT_TOP);
	  };

	  _proto.draw = function draw(context, additionalModifier) {
	    if (this.enabled && this.alpha > 0) {
	      context.globalCompositeOperation = this.compositeOperation;
	      context.globalAlpha = this.alpha * additionalModifier.alpha;

	      if (this.rotation === 0 && this.position === Rect.LEFT_TOP) {
	        if (this.clear) {
	          context.clearRect(this.x, this.y, this.width, this.height);
	        } else if (this.color) {
	          context.fillStyle = this.color;
	          context.fillRect(this.x, this.y, this.width, this.height);
	        }

	        if (this.borderColor) {
	          context.beginPath();
	          context.lineWidth = this.lineWidth;
	          context.strokeStyle = this.borderColor;
	          context.rect(this.x, this.y, this.width, this.height);
	          context.stroke();
	        }
	      } else {
	        var hw = this.width / 2;
	        var hh = this.height / 2;
	        context.save();

	        if (this.position === Rect.LEFT_TOP) {
	          context.translate(this.x + hw, this.y + hh);
	        } else {
	          context.translate(this.x, this.y);
	        }

	        context.scale(this.scaleX, this.scaleY);
	        context.rotate(this.rotation);

	        if (this.clear) {
	          context.clearRect(-hw, -hh, this.width, this.height);
	        } else if (this.color) {
	          context.fillStyle = this.color;
	          context.fillRect(-hw, -hh, this.width, this.height);
	        }

	        if (this.borderColor) {
	          context.beginPath();
	          context.lineWidth = this.lineWidth;
	          context.strokeStyle = this.borderColor;
	          context.rect(-hw, -hh, this.width, this.height);
	          context.stroke();
	        }

	        context.restore();
	      }
	    }
	  };

	  return Rect;
	}(Circle);

	Rect.LEFT_TOP = 0;
	Rect.CENTER = 1;

	var Scroller =
	/*#__PURE__*/
	function (_Emitter) {
	  _inheritsLoose(Scroller, _Emitter);

	  function Scroller(givenParameters) {
	    var text = calc(givenParameters.text);
	    var characterList = Array.isArray(text) ? text : [].concat(text);
	    return _Emitter.call(this, Object.assign({}, givenParameters, {
	      "class": Text,
	      count: characterList.length,
	      text: function text(index) {
	        return characterList[index];
	      },
	      enabled: function enabled(index) {
	        return characterList[index] !== " " && calc(givenParameters.enabled, index);
	      }
	    })) || this;
	  }

	  return Scroller;
	}(Emitter);

	function _typeof(obj) {
	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	/**
	* StackBlur - a fast almost Gaussian Blur For Canvas
	*
	* In case you find this class useful - especially in commercial projects -
	* I am not totally unhappy for a small donation to my PayPal account
	* mario@quasimondo.de
	*
	* Or support me on flattr:
	* {@link https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript}
	* @module StackBlur
	* @version 0.5
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
	 * @param {string|HTMLImageElement} img
	 * @param {string|HTMLCanvasElement} canvas
	 * @param {Float} radius
	 * @param {boolean} blurAlphaChannel
	 * @returns {undefined}
	 */

	function processImage(img, canvas, radius, blurAlphaChannel) {
	  if (typeof img === 'string') {
	    img = document.getElementById(img);
	  }

	  if (!img || !('naturalWidth' in img)) {
	    return;
	  }

	  var w = img.naturalWidth;
	  var h = img.naturalHeight;

	  if (typeof canvas === 'string') {
	    canvas = document.getElementById(canvas);
	  }

	  if (!canvas || !('getContext' in canvas)) {
	    return;
	  }

	  canvas.style.width = w + 'px';
	  canvas.style.height = h + 'px';
	  canvas.width = w;
	  canvas.height = h;
	  var context = canvas.getContext('2d');
	  context.clearRect(0, 0, w, h);
	  context.drawImage(img, 0, 0);

	  if (isNaN(radius) || radius < 1) {
	    return;
	  }

	  if (blurAlphaChannel) {
	    processCanvasRGBA(canvas, 0, 0, w, h, radius);
	  } else {
	    processCanvasRGB(canvas, 0, 0, w, h, radius);
	  }
	}
	/**
	 * @param {string|HTMLCanvasElement} canvas
	 * @param {Integer} topX
	 * @param {Integer} topY
	 * @param {Integer} width
	 * @param {Integer} height
	 * @throws {Error|TypeError}
	 * @returns {ImageData} See {@link https://html.spec.whatwg.org/multipage/canvas.html#imagedata}
	 */


	function getImageDataFromCanvas(canvas, topX, topY, width, height) {
	  if (typeof canvas === 'string') {
	    canvas = document.getElementById(canvas);
	  }

	  if (!canvas || _typeof(canvas) !== 'object' || !('getContext' in canvas)) {
	    throw new TypeError('Expecting canvas with `getContext` method in processCanvasRGB(A) calls!');
	  }

	  var context = canvas.getContext('2d');

	  try {
	    return context.getImageData(topX, topY, width, height);
	  } catch (e) {
	    throw new Error('unable to access image data: ' + e);
	  }
	}
	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {Integer} topX
	 * @param {Integer} topY
	 * @param {Integer} width
	 * @param {Integer} height
	 * @param {Float} radius
	 * @returns {undefined}
	 */


	function processCanvasRGBA(canvas, topX, topY, width, height, radius) {
	  if (isNaN(radius) || radius < 1) {
	    return;
	  }

	  radius |= 0;
	  var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
	  imageData = processImageDataRGBA(imageData, topX, topY, width, height, radius);
	  canvas.getContext('2d').putImageData(imageData, topX, topY);
	}
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
	  var x, y, i, p, yp, yi, yw, rSum, gSum, bSum, aSum, rOutSum, gOutSum, bOutSum, aOutSum, rInSum, gInSum, bInSum, aInSum, pr, pg, pb, pa, rbs;
	  var div = 2 * radius + 1; // const w4 = width << 2;

	  var widthMinus1 = width - 1;
	  var heightMinus1 = height - 1;
	  var radiusPlus1 = radius + 1;
	  var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
	  var stackStart = new BlurStack();
	  var stack = stackStart;
	  var stackEnd;

	  for (i = 1; i < div; i++) {
	    stack = stack.next = new BlurStack();

	    if (i === radiusPlus1) {
	      stackEnd = stack;
	    }
	  }

	  stack.next = stackStart;
	  var stackIn = null;
	  var stackOut = null;
	  yw = yi = 0;
	  var mulSum = mulTable[radius];
	  var shgSum = shgTable[radius];

	  for (y = 0; y < height; y++) {
	    rInSum = gInSum = bInSum = aInSum = rSum = gSum = bSum = aSum = 0;
	    rOutSum = radiusPlus1 * (pr = pixels[yi]);
	    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
	    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
	    aOutSum = radiusPlus1 * (pa = pixels[yi + 3]);
	    rSum += sumFactor * pr;
	    gSum += sumFactor * pg;
	    bSum += sumFactor * pb;
	    aSum += sumFactor * pa;
	    stack = stackStart;

	    for (i = 0; i < radiusPlus1; i++) {
	      stack.r = pr;
	      stack.g = pg;
	      stack.b = pb;
	      stack.a = pa;
	      stack = stack.next;
	    }

	    for (i = 1; i < radiusPlus1; i++) {
	      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
	      rSum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
	      gSum += (stack.g = pg = pixels[p + 1]) * rbs;
	      bSum += (stack.b = pb = pixels[p + 2]) * rbs;
	      aSum += (stack.a = pa = pixels[p + 3]) * rbs;
	      rInSum += pr;
	      gInSum += pg;
	      bInSum += pb;
	      aInSum += pa;
	      stack = stack.next;
	    }

	    stackIn = stackStart;
	    stackOut = stackEnd;

	    for (x = 0; x < width; x++) {
	      pixels[yi + 3] = pa = aSum * mulSum >> shgSum;

	      if (pa !== 0) {
	        pa = 255 / pa;
	        pixels[yi] = (rSum * mulSum >> shgSum) * pa;
	        pixels[yi + 1] = (gSum * mulSum >> shgSum) * pa;
	        pixels[yi + 2] = (bSum * mulSum >> shgSum) * pa;
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
	      p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
	      rInSum += stackIn.r = pixels[p];
	      gInSum += stackIn.g = pixels[p + 1];
	      bInSum += stackIn.b = pixels[p + 2];
	      aInSum += stackIn.a = pixels[p + 3];
	      rSum += rInSum;
	      gSum += gInSum;
	      bSum += bInSum;
	      aSum += aInSum;
	      stackIn = stackIn.next;
	      rOutSum += pr = stackOut.r;
	      gOutSum += pg = stackOut.g;
	      bOutSum += pb = stackOut.b;
	      aOutSum += pa = stackOut.a;
	      rInSum -= pr;
	      gInSum -= pg;
	      bInSum -= pb;
	      aInSum -= pa;
	      stackOut = stackOut.next;
	      yi += 4;
	    }

	    yw += width;
	  }

	  for (x = 0; x < width; x++) {
	    gInSum = bInSum = aInSum = rInSum = gSum = bSum = aSum = rSum = 0;
	    yi = x << 2;
	    rOutSum = radiusPlus1 * (pr = pixels[yi]);
	    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
	    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
	    aOutSum = radiusPlus1 * (pa = pixels[yi + 3]);
	    rSum += sumFactor * pr;
	    gSum += sumFactor * pg;
	    bSum += sumFactor * pb;
	    aSum += sumFactor * pa;
	    stack = stackStart;

	    for (i = 0; i < radiusPlus1; i++) {
	      stack.r = pr;
	      stack.g = pg;
	      stack.b = pb;
	      stack.a = pa;
	      stack = stack.next;
	    }

	    yp = width;

	    for (i = 1; i <= radius; i++) {
	      yi = yp + x << 2;
	      rSum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
	      gSum += (stack.g = pg = pixels[yi + 1]) * rbs;
	      bSum += (stack.b = pb = pixels[yi + 2]) * rbs;
	      aSum += (stack.a = pa = pixels[yi + 3]) * rbs;
	      rInSum += pr;
	      gInSum += pg;
	      bInSum += pb;
	      aInSum += pa;
	      stack = stack.next;

	      if (i < heightMinus1) {
	        yp += width;
	      }
	    }

	    yi = x;
	    stackIn = stackStart;
	    stackOut = stackEnd;

	    for (y = 0; y < height; y++) {
	      p = yi << 2;
	      pixels[p + 3] = pa = aSum * mulSum >> shgSum;

	      if (pa > 0) {
	        pa = 255 / pa;
	        pixels[p] = (rSum * mulSum >> shgSum) * pa;
	        pixels[p + 1] = (gSum * mulSum >> shgSum) * pa;
	        pixels[p + 2] = (bSum * mulSum >> shgSum) * pa;
	      } else {
	        pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
	      }

	      rSum -= rOutSum;
	      gSum -= gOutSum;
	      bSum -= bOutSum;
	      aSum -= aOutSum;
	      rOutSum -= stackIn.r;
	      gOutSum -= stackIn.g;
	      bOutSum -= stackIn.b;
	      aOutSum -= stackIn.a;
	      p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
	      rSum += rInSum += stackIn.r = pixels[p];
	      gSum += gInSum += stackIn.g = pixels[p + 1];
	      bSum += bInSum += stackIn.b = pixels[p + 2];
	      aSum += aInSum += stackIn.a = pixels[p + 3];
	      stackIn = stackIn.next;
	      rOutSum += pr = stackOut.r;
	      gOutSum += pg = stackOut.g;
	      bOutSum += pb = stackOut.b;
	      aOutSum += pa = stackOut.a;
	      rInSum -= pr;
	      gInSum -= pg;
	      bInSum -= pb;
	      aInSum -= pa;
	      stackOut = stackOut.next;
	      yi += width;
	    }
	  }

	  return imageData;
	}
	/**
	 * @param {HTMLCanvasElement} canvas
	 * @param {Integer} topX
	 * @param {Integer} topY
	 * @param {Integer} width
	 * @param {Integer} height
	 * @param {Float} radius
	 * @returns {undefined}
	 */


	function processCanvasRGB(canvas, topX, topY, width, height, radius) {
	  if (isNaN(radius) || radius < 1) {
	    return;
	  }

	  radius |= 0;
	  var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
	  imageData = processImageDataRGB(imageData, topX, topY, width, height, radius);
	  canvas.getContext('2d').putImageData(imageData, topX, topY);
	}
	/**
	 * @param {ImageData} imageData
	 * @param {Integer} topX
	 * @param {Integer} topY
	 * @param {Integer} width
	 * @param {Integer} height
	 * @param {Float} radius
	 * @returns {ImageData}
	 */


	function processImageDataRGB(imageData, topX, topY, width, height, radius) {
	  var pixels = imageData.data;
	  var x, y, i, p, yp, yi, yw, rSum, gSum, bSum, rOutSum, gOutSum, bOutSum, rInSum, gInSum, bInSum, pr, pg, pb, rbs;
	  var div = 2 * radius + 1; // const w4 = width << 2;

	  var widthMinus1 = width - 1;
	  var heightMinus1 = height - 1;
	  var radiusPlus1 = radius + 1;
	  var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
	  var stackStart = new BlurStack();
	  var stack = stackStart;
	  var stackEnd;

	  for (i = 1; i < div; i++) {
	    stack = stack.next = new BlurStack();

	    if (i === radiusPlus1) {
	      stackEnd = stack;
	    }
	  }

	  stack.next = stackStart;
	  var stackIn = null;
	  var stackOut = null;
	  yw = yi = 0;
	  var mulSum = mulTable[radius];
	  var shgSum = shgTable[radius];

	  for (y = 0; y < height; y++) {
	    rInSum = gInSum = bInSum = rSum = gSum = bSum = 0;
	    rOutSum = radiusPlus1 * (pr = pixels[yi]);
	    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
	    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
	    rSum += sumFactor * pr;
	    gSum += sumFactor * pg;
	    bSum += sumFactor * pb;
	    stack = stackStart;

	    for (i = 0; i < radiusPlus1; i++) {
	      stack.r = pr;
	      stack.g = pg;
	      stack.b = pb;
	      stack = stack.next;
	    }

	    for (i = 1; i < radiusPlus1; i++) {
	      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
	      rSum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
	      gSum += (stack.g = pg = pixels[p + 1]) * rbs;
	      bSum += (stack.b = pb = pixels[p + 2]) * rbs;
	      rInSum += pr;
	      gInSum += pg;
	      bInSum += pb;
	      stack = stack.next;
	    }

	    stackIn = stackStart;
	    stackOut = stackEnd;

	    for (x = 0; x < width; x++) {
	      pixels[yi] = rSum * mulSum >> shgSum;
	      pixels[yi + 1] = gSum * mulSum >> shgSum;
	      pixels[yi + 2] = bSum * mulSum >> shgSum;
	      rSum -= rOutSum;
	      gSum -= gOutSum;
	      bSum -= bOutSum;
	      rOutSum -= stackIn.r;
	      gOutSum -= stackIn.g;
	      bOutSum -= stackIn.b;
	      p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
	      rInSum += stackIn.r = pixels[p];
	      gInSum += stackIn.g = pixels[p + 1];
	      bInSum += stackIn.b = pixels[p + 2];
	      rSum += rInSum;
	      gSum += gInSum;
	      bSum += bInSum;
	      stackIn = stackIn.next;
	      rOutSum += pr = stackOut.r;
	      gOutSum += pg = stackOut.g;
	      bOutSum += pb = stackOut.b;
	      rInSum -= pr;
	      gInSum -= pg;
	      bInSum -= pb;
	      stackOut = stackOut.next;
	      yi += 4;
	    }

	    yw += width;
	  }

	  for (x = 0; x < width; x++) {
	    gInSum = bInSum = rInSum = gSum = bSum = rSum = 0;
	    yi = x << 2;
	    rOutSum = radiusPlus1 * (pr = pixels[yi]);
	    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
	    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
	    rSum += sumFactor * pr;
	    gSum += sumFactor * pg;
	    bSum += sumFactor * pb;
	    stack = stackStart;

	    for (i = 0; i < radiusPlus1; i++) {
	      stack.r = pr;
	      stack.g = pg;
	      stack.b = pb;
	      stack = stack.next;
	    }

	    yp = width;

	    for (i = 1; i <= radius; i++) {
	      yi = yp + x << 2;
	      rSum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
	      gSum += (stack.g = pg = pixels[yi + 1]) * rbs;
	      bSum += (stack.b = pb = pixels[yi + 2]) * rbs;
	      rInSum += pr;
	      gInSum += pg;
	      bInSum += pb;
	      stack = stack.next;

	      if (i < heightMinus1) {
	        yp += width;
	      }
	    }

	    yi = x;
	    stackIn = stackStart;
	    stackOut = stackEnd;

	    for (y = 0; y < height; y++) {
	      p = yi << 2;
	      pixels[p] = rSum * mulSum >> shgSum;
	      pixels[p + 1] = gSum * mulSum >> shgSum;
	      pixels[p + 2] = bSum * mulSum >> shgSum;
	      rSum -= rOutSum;
	      gSum -= gOutSum;
	      bSum -= bOutSum;
	      rOutSum -= stackIn.r;
	      gOutSum -= stackIn.g;
	      bOutSum -= stackIn.b;
	      p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
	      rSum += rInSum += stackIn.r = pixels[p];
	      gSum += gInSum += stackIn.g = pixels[p + 1];
	      bSum += bInSum += stackIn.b = pixels[p + 2];
	      stackIn = stackIn.next;
	      rOutSum += pr = stackOut.r;
	      gOutSum += pg = stackOut.g;
	      bOutSum += pb = stackOut.b;
	      rInSum -= pr;
	      gInSum -= pg;
	      bInSum -= pb;
	      stackOut = stackOut.next;
	      yi += width;
	    }
	  }

	  return imageData;
	}
	/**
	 *
	 */


	var BlurStack = function BlurStack() {
	  _classCallCheck(this, BlurStack);

	  this.r = 0;
	  this.g = 0;
	  this.b = 0;
	  this.a = 0;
	  this.next = null;
	};

	var stackblur = {
		__proto__: null,
		BlurStack: BlurStack,
		image: processImage,
		canvasRGBA: processCanvasRGBA,
		canvasRGB: processCanvasRGB,
		imageDataRGBA: processImageDataRGBA,
		imageDataRGB: processImageDataRGB
	};

	var _ref = undefined || stackblur,
	    imageDataRGBA = _ref.imageDataRGBA;

	var StackBlur =
	/*#__PURE__*/
	function (_FastBlur) {
	  _inheritsLoose(StackBlur, _FastBlur);

	  function StackBlur(givenParameter) {
	    var _this;

	    _this = _FastBlur.call(this, givenParameter) || this;
	    _this._currentGridSize = false;
	    _this._currentRadiusPart = undefined;
	    return _this;
	  }

	  var _proto = StackBlur.prototype;

	  _proto._getParameterList = function _getParameterList() {
	    return Object.assign({}, _FastBlur.prototype._getParameterList.call(this), {
	      onCanvas: false,
	      radius: undefined,
	      radiusPart: undefined,
	      radiusScale: true
	    });
	  };

	  _proto.normalizeFullScreen = function normalizeFullScreen(additionalModifier) {
	    if (this.norm && this.onCanvas) {
	      this.x = 0;
	      this.y = 0;
	      this.width = additionalModifier.widthInPixel;
	      this.height = additionalModifier.heightInPixel;
	    } else {
	      _FastBlur.prototype.normalizeFullScreen.call(this, additionalModifier);
	    }
	  };

	  _proto.resize = function resize(output, additionalModifier) {
	    _FastBlur.prototype.resize.call(this, output, additionalModifier);

	    if (this.radiusPart) {
	      this.radius = undefined;
	    }
	  };

	  _proto.additionalBlur = function additionalBlur(targetW, targetH, additionalModifier) {
	    var imageData = this._tctx.getImageData(0, 0, targetW, targetH);

	    imageDataRGBA(imageData, 0, 0, targetW, targetH, additionalModifier.radius);

	    this._tctx.putImageData(imageData, 0, 0);
	  };

	  _proto.detect = function detect(context, x, y) {
	    return this._detectHelper(context, x, y, false);
	  };

	  _proto.draw = function draw(context, additionalModifier) {
	    if (this.enabled) {
	      if (this.radius === undefined || this._currentRadiusPart !== this.radiusPart) {
	        this.radius = Math.round((additionalModifier.widthInPixel + additionalModifier.heightInPixel) / 2 / this.radiusPart);
	        this._currentRadiusPart = this.radiusPart;
	      }

	      var radius = Math.round(this.radius * (this.radiusScale && (additionalModifier.cam ? additionalModifier.cam.zoom : 1) / additionalModifier.scaleCanvas));

	      if (radius) {
	        if (this.onCanvas) {
	          if (this.width === undefined || this.height === undefined) {
	            this.normalizeFullScreen(additionalModifier);
	          }

	          var x = Math.round(this.x);
	          var y = Math.round(this.y);
	          var w = Math.round(this.width);
	          var h = Math.round(this.height);
	          this.imageData = context.getImageData(x, y, w, h);
	          imageDataRGBA(this.imageData, 0, 0, w - x, h - y, radius);
	          context.putImageData(this.imageData, x, y, 0, 0, w, h);
	        } else {
	          additionalModifier.radius = radius;

	          _FastBlur.prototype.draw.call(this, context, additionalModifier);
	        }
	      }
	    } else {
	      _FastBlur.prototype.draw.call(this, context, additionalModifier);
	    }
	  };

	  return StackBlur;
	}(FastBlur);

	var StarField =
	/*#__PURE__*/
	function (_Rect) {
	  _inheritsLoose(StarField, _Rect);

	  function StarField(givenParameters) {
	    var _this;

	    _this = _Rect.call(this, givenParameters) || this;
	    _this._starsX = [];
	    _this._starsY = [];
	    _this._starsZ = [];
	    _this._starsOldX = [];
	    _this._starsOldY = [];
	    _this._starsNewX = [];
	    _this._starsNewY = [];
	    _this._starsEnabled = [];
	    _this._starsLineWidth = [];
	    return _this;
	  }

	  var _proto = StarField.prototype;

	  _proto._getParameterList = function _getParameterList() {
	    return Object.assign({}, _Rect.prototype._getParameterList.call(this), {
	      count: 40,
	      moveX: 0,
	      moveY: 0,
	      moveZ: 0,
	      lineWidth: undefined,
	      highScale: true,
	      color: "#FFF"
	    });
	  };

	  _proto.init = function init(context, additionalModifier) {
	    this.width = this.width || additionalModifier.width;
	    this.height = this.height || additionalModifier.height;
	    this.x = this.x === undefined ? additionalModifier.x : this.x;
	    this.y = this.y === undefined ? additionalModifier.y : this.y;
	    this.lineWidth = this.lineWidth || Math.min(additionalModifier.height / additionalModifier.heightInPixel, additionalModifier.width / additionalModifier.widthInPixel) / 2;
	    this._centerX = this.width / 2 + this.x;
	    this._centerY = this.height / 2 + this.y;
	    this._scaleZ = Math.max(this.width, this.height) / 2;

	    function clampOrRandom(val, min, max) {
	      if (max === void 0) {
	        max = -min;
	      }

	      return val === undefined || val < min || val >= max ? Math.random() * (max - min) + min : val;
	    }

	    for (var i = 0; i < this.count; i++) {
	      this._starsX[i] = clampOrRandom(this._starsX[i], -this.width / 2);
	      this._starsY[i] = clampOrRandom(this._starsY[i], -this.height / 2);
	      this._starsZ[i] = clampOrRandom(this._starsZ[i], 0, this._scaleZ);
	    }
	  };

	  _proto.moveStar = function moveStar(i, scaled_timepassed, firstPass) {
	    if (firstPass) {
	      this._starsEnabled[i] = true;
	    }

	    var hw = this.width / 2;
	    var hh = this.height / 2;
	    var x = this._starsX[i] + this.moveX * scaled_timepassed,
	        y = this._starsY[i] + this.moveY * scaled_timepassed,
	        z = this._starsZ[i] + this.moveZ * scaled_timepassed;

	    while (x < -hw) {
	      x += this.width;
	      y = Math.random() * this.height - hh;
	      this._starsEnabled[i] = false;
	    }

	    while (x > hw) {
	      x -= this.width;
	      y = Math.random() * this.height - hh;
	      this._starsEnabled[i] = false;
	    }

	    while (y < -hh) {
	      y += this.height;
	      x = Math.random() * this.width - hw;
	      this._starsEnabled[i] = false;
	    }

	    while (y > hh) {
	      y -= this.height;
	      x = Math.random() * this.width - hw;
	      this._starsEnabled[i] = false;
	    }

	    while (z <= 0) {
	      z += this._scaleZ;
	      x = Math.random() * this.width - hw;
	      y = Math.random() * this.height - hh;
	      this._starsEnabled[i] = false;
	    }

	    while (z > this._scaleZ) {
	      z -= this._scaleZ;
	      x = Math.random() * this.width - hw;
	      y = Math.random() * this.height - hh;
	      this._starsEnabled[i] = false;
	    }

	    var projectX = this._centerX + x / z * hw;
	    var projectY = this._centerY + y / z * hh;
	    this._starsEnabled[i] = this._starsEnabled[i] && projectX >= this.x && projectY >= this.y && projectX < this.x + this.width && projectY < this.y + this.height;

	    if (firstPass) {
	      this._starsX[i] = x;
	      this._starsY[i] = y;
	      this._starsZ[i] = z;
	      this._starsNewX[i] = projectX;
	      this._starsNewY[i] = projectY;
	    } else {
	      this._starsOldX[i] = projectX;
	      this._starsOldY[i] = projectY;
	      var lw = (1 - this._starsZ[i] / this._scaleZ) * 4;

	      if (!this.highScale) {
	        lw = Math.ceil(lw);
	      }

	      this._starsLineWidth[i] = lw;
	    }
	  };

	  _proto.animate = function animate(timepassed) {
	    var ret = _Rect.prototype.animate.call(this, timepassed);

	    if (this.enabled && this._centerX !== undefined) {
	      var i = this.count;

	      while (i--) {
	        this.moveStar(i, timepassed / 16, true);

	        if (this._starsEnabled[i]) {
	          this.moveStar(i, -5, false);
	        }
	      }
	    }

	    return ret;
	  };

	  _proto.resize = function resize(output, additionalModifier) {
	    this._needInit = true;
	  };

	  _proto.detect = function detect(context, x, y) {
	    return this._detectHelper(context, x, y, false);
	  };

	  _proto.draw = function draw(context, additionalModifier) {
	    if (this.enabled) {
	      context.globalCompositeOperation = this.compositeOperation;
	      context.globalAlpha = this.alpha * additionalModifier.alpha;

	      if (this.moveY == 0 && this.moveZ == 0 && this.moveX < 0) {
	        context.fillStyle = this.color;
	        var i = this.count;

	        while (i--) {
	          if (this._starsEnabled[i]) {
	            context.fillRect(this._starsNewX[i], this._starsNewY[i] - this._starsLineWidth[i] * this.lineWidth / 2, this._starsOldX[i] - this._starsNewX[i], this._starsLineWidth[i] * this.lineWidth);
	          }
	        }
	      } else {
	        context.strokeStyle = this.color;

	        if (this.highScale) {
	          var _i = this.count;

	          while (_i--) {
	            if (this._starsEnabled[_i]) {
	              context.beginPath();
	              context.lineWidth = this._starsLineWidth[_i] * this.lineWidth;
	              context.moveTo(this._starsOldX[_i], this._starsOldY[_i]);
	              context.lineTo(this._starsNewX[_i], this._starsNewY[_i]);
	              context.stroke();
	              context.closePath();
	            }
	          }
	        } else {
	          var lw = 5,
	              _i2;

	          while (--lw) {
	            context.beginPath();
	            context.lineWidth = lw * this.lineWidth;
	            _i2 = this.count;

	            while (_i2--) {
	              if (this._starsEnabled[_i2] && this._starsLineWidth[_i2] === lw) {
	                context.moveTo(this._starsOldX[_i2], this._starsOldY[_i2]);
	                context.lineTo(this._starsNewX[_i2], this._starsNewY[_i2]);
	              }
	            }

	            context.stroke();
	            context.closePath();
	          }
	        }
	      }
	    }
	  };

	  return StarField;
	}(Rect);

	var Sprites = {
	  Callback: Callback,
	  Canvas: Canvas,
	  Circle: Circle,
	  Emitter: Emitter,
	  FastBlur: FastBlur,
	  Group: Group,
	  Image: Image,
	  Text: Text,
	  Particle: Particle,
	  Path: Path,
	  Rect: Rect,
	  Scroller: Scroller,
	  StackBlur: StackBlur,
	  StarField: StarField
	};

	var Callback$1 =
	/*#__PURE__*/
	function () {
	  function Callback(callback, duration) {
	    this.callback = callback;
	    this.duration = ifNull(calc(duration), undefined);
	    this.initialized = false;
	  }

	  var _proto = Callback.prototype;

	  _proto.reset = function reset() {
	    this.initialized = false;
	  };

	  _proto.run = function run(sprite, time) {
	    var result;

	    if (this.duration !== undefined) {
	      this.callback(sprite, Math.min(time, this.duration), !this.initialized);
	      this.initialized = true;
	      return time - this.duration;
	    } else {
	      result = this.callback(sprite, time, !this.initialized);
	      this.initialized = true;
	      return result;
	    }
	  };

	  return Callback;
	}();

	var tinycolorf$1 = typeof tinycolor === 'function' ? tinycolor : tinycolor.tinycolor;
	var degToRad$1 = 0.017453292519943295;

	function moveDefault(progress, data) {
	  return data.from + progress * data.delta;
	}

	function moveBezier(progress, data) {
	  var copy = [].concat(data.values),
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

	function moveColor(progress, data, sprite) {
	  return data.colorFrom.mix(data.colorTo, progress * 100).toString();
	}

	function movePath(progress, data, sprite) {
	  return sprite.changeToPath(progress, data, sprite);
	}

	var ChangeTo =
	/*#__PURE__*/
	function () {
	  function ChangeTo(changeValues, duration, ease) {
	    this.initialized = false;
	    this.changeValues = [];

	    for (var k in changeValues) {
	      var orgValue = changeValues[k];
	      var value = k === "rotationInDegree" ? orgValue * degToRad$1 : orgValue;
	      var isColor = k === "color" || k === "borderColor";
	      var isPath = k === "path";
	      var isFunction = typeof value === "function";
	      var isBezier = !isColor && Array.isArray(value);
	      var names = k === "scale" ? ["scaleX", "scaleY"] : k === "rotationInRadian" || k === "rotationInDegree" ? ["rotation"] : [k];

	      for (var _i = 0, _names = names; _i < _names.length; _i++) {
	        var name = _names[_i];
	        this.changeValues.push({
	          name: name,
	          to: isBezier ? value[value.length - 1] : calc(value, 1, {}),
	          bezier: isBezier ? value : false,
	          isColor: isColor,
	          isPath: isPath,
	          isFunction: isFunction ? value : false,
	          moveAlgorithm: isColor ? moveColor : isPath ? movePath : isBezier ? moveBezier : moveDefault
	        });
	      }
	    }

	    this.duration = ifNull(calc(duration), 0);
	    this.ease = ifNull(ease, function (t) {
	      return t;
	    });
	  }

	  var _proto = ChangeTo.prototype;

	  _proto.reset = function reset() {
	    this.initialized = false;
	  };

	  _proto.init = function init(sprite, time) {
	    var l = this.changeValues.length,
	        data;

	    while (l--) {
	      data = this.changeValues[l];

	      if (data.isFunction) {
	        data.from = sprite[data.name];
	        data.to = data.isFunction(data.from);

	        if (data.isColor) {
	          data.colorFrom = tinycolorf$1(data.from);
	          data.colorTo = tinycolorf$1(data.to);
	          data.moveAlgorithm = moveColor;
	        } else if (data.isPath) {
	          var _sprite$changeToPathI = sprite.changeToPathInit(data.from, data.to);

	          data.pathFrom = _sprite$changeToPathI[0];
	          data.pathTo = _sprite$changeToPathI[1];
	          data.moveAlgorithm = movePath;
	        } else if (Array.isArray(data.to)) {
	          data.values = [sprite[data.name]].concat(data.to);
	          data.moveAlgorithm = moveBezier;
	        } else {
	          data.delta = data.to - data.from;
	          data.moveAlgorithm = moveDefault;
	        }
	      } else if (data.isColor) {
	        data.colorFrom = tinycolorf$1(sprite[data.name]);
	        data.colorTo = tinycolorf$1(data.to);
	      } else if (data.isPath) {
	        var _sprite$changeToPathI2 = sprite.changeToPathInit(sprite[data.name], data.to);

	        data.pathFrom = _sprite$changeToPathI2[0];
	        data.pathTo = _sprite$changeToPathI2[1];
	      } else if (data.bezier) {
	        data.values = [sprite[data.name]].concat(data.bezier);
	      } else {
	        data.from = sprite[data.name];
	        data.delta = data.to - data.from;
	      }
	    }
	  };

	  _proto.run = function run(sprite, time) {
	    if (!this.initialized) {
	      this.initialized = true;
	      this.init(sprite, time);
	    }

	    if (this.duration <= time) {
	      var l = this.changeValues.length;
	      var data;

	      while (l--) {
	        data = this.changeValues[l];
	        sprite[data.name] = data.to;
	      }
	    } else {
	      var _l = this.changeValues.length;

	      var _data;

	      var progress = this.ease(time / this.duration);

	      while (_l--) {
	        _data = this.changeValues[_l];
	        sprite[_data.name] = _data.moveAlgorithm(progress, _data, sprite);
	      }
	    }

	    return time - this.duration;
	  };

	  return ChangeTo;
	}();

	var End =
	/*#__PURE__*/
	function () {
	  function End() {}

	  var _proto = End.prototype;

	  _proto.run = function run(sprite, time) {
	    return Sequence._TIMELAPSE_TO_FORCE_DISABLE;
	  };

	  return End;
	}();

	var EndDisabled =
	/*#__PURE__*/
	function () {
	  function EndDisabled() {}

	  var _proto = EndDisabled.prototype;

	  _proto.run = function run(sprite, time) {
	    sprite.enabled = false;
	    return Sequence._TIMELAPSE_TO_FORCE_DISABLE;
	  };

	  return EndDisabled;
	}();

	var Forever =
	/*#__PURE__*/
	function () {
	  function Forever() {
	    for (var _len = arguments.length, Aniobject = new Array(_len), _key = 0; _key < _len; _key++) {
	      Aniobject[_key] = arguments[_key];
	    }

	    this.Aniobject = Aniobject[0] instanceof Sequence ? Aniobject[0] : _construct(Sequence, Aniobject);
	  }

	  var _proto = Forever.prototype;

	  _proto.reset = function reset(timelapsed) {
	    if (timelapsed === void 0) {
	      timelapsed = 0;
	    }

	    this.Aniobject.reset && this.Aniobject.reset(timelapsed);
	  };

	  _proto.play = function play(label, timelapsed) {
	    if (label === void 0) {
	      label = "";
	    }

	    if (timelapsed === void 0) {
	      timelapsed = 0;
	    }

	    this.Aniobject.play && this.Aniobject.play(label, timelapsed);
	  };

	  _proto.run = function run(sprite, time, isDifference) {
	    var t = time;

	    while (t >= 0) {
	      t = this.Aniobject.run(sprite, t, isDifference);
	      isDifference = true;

	      if (t === true) {
	        return true;
	      }

	      if (t >= 0) {
	        this.Aniobject.reset && this.Aniobject.reset();
	      }
	    }

	    return t;
	  };

	  return Forever;
	}();

	var If =
	/*#__PURE__*/
	function () {
	  function If(ifCallback, Aniobject, AniobjectElse) {
	    this.ifCallback = ifCallback;
	    this.Aniobject = Aniobject;
	    this.AniobjectElse = ifNull(AniobjectElse, function () {
	      return 0;
	    });
	  }

	  var _proto = If.prototype;

	  _proto.run = function run(sprite, time) {
	    var AniObject = calc(this.ifCallback) ? this.Aniobject : this.AniobjectElse;
	    return AniObject.run ? AniObject.run(sprite, time) : AniObject(sprite, time);
	  };

	  return If;
	}();

	var Image$1 =
	/*#__PURE__*/
	function () {
	  function Image(image, durationBetweenFrames) {
	    this.initialized = false;
	    this.image = calc(image);
	    this.durationBetweenFrames = ifNull(calc(durationBetweenFrames), 0);

	    if (Array.isArray(this.image)) {
	      this.count = this.image.length;
	    } else {
	      this.image = [this.image];
	      this.count = 1;
	    }

	    this.duration = this.count * this.durationBetweenFrames;
	  }

	  var _proto = Image.prototype;

	  _proto.reset = function reset() {
	    this.initialized = false;
	  };

	  _proto.run = function run(sprite, time) {
	    if (!this.initialized) {
	      this.initialized = true;
	      this.current = -1;
	    }

	    if (time >= this.duration) {
	      sprite.image = ImageManager.getImage(this.image[this.image.length - 1]);
	    } else {
	      var currentFrame = Math.floor(time / this.durationBetweenFrames);

	      if (currentFrame !== this.current) {
	        this.current = currentFrame;
	        sprite.image = ImageManager.getImage(this.image[this.current]);
	      }
	    }

	    return time - this.duration;
	  };

	  return Image;
	}();

	var ImageFrame =
	/*#__PURE__*/
	function () {
	  function ImageFrame(frameNumber, framesToRight, durationBetweenFrames) {
	    this.initialized = false;
	    this.frameNumber = calc(frameNumber);
	    this.framesToRight = ifNull(calc(framesToRight), true);
	    this.durationBetweenFrames = ifNull(calc(durationBetweenFrames), 0);

	    if (!Array.isArray(this.frameNumber)) {
	      this.frameNumber = [this.frameNumber];
	    }

	    this.duration = this.frameNumber.length * this.durationBetweenFrames;
	  }

	  var _proto = ImageFrame.prototype;

	  _proto.run = function run(sprite, time) {
	    var currentFrame = 0;

	    if (time >= this.duration) {
	      currentFrame = this.frameNumber[this.frameNumber.length - 1];
	    } else {
	      currentFrame = this.frameNumber[Math.floor(time / this.durationBetweenFrames)];
	    }

	    if (this.framesToRight) {
	      sprite.frameX = sprite.frameWidth * currentFrame;
	    } else {
	      sprite.frameY = sprite.frameHeight * currentFrame;
	    }

	    return time - this.duration;
	  };

	  return ImageFrame;
	}();

	var Loop =
	/*#__PURE__*/
	function () {
	  function Loop(times) {
	    for (var _len = arguments.length, Aniobject = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      Aniobject[_key - 1] = arguments[_key];
	    }

	    this.Aniobject = Aniobject[0] instanceof Sequence ? Aniobject[0] : _construct(Sequence, Aniobject);
	    this.times = this.timesOrg = ifNull(calc(times), 1);
	  }

	  var _proto = Loop.prototype;

	  _proto.reset = function reset(timelapsed) {
	    if (timelapsed === void 0) {
	      timelapsed = 0;
	    }

	    this.times = this.timesOrg;
	    this.Aniobject.reset && this.Aniobject.reset(timelapsed);
	  };

	  _proto.play = function play(label, timelapsed) {
	    if (label === void 0) {
	      label = "";
	    }

	    if (timelapsed === void 0) {
	      timelapsed = 0;
	    }

	    this.times = this.timesOrg;
	    this.Aniobject.play && this.Aniobject.play(label, timelapsed);
	  };

	  _proto.run = function run(sprite, time, isDifference) {
	    var t = time;

	    while (t >= 0 && this.times > 0) {
	      t = this.Aniobject.run(sprite, t, isDifference);
	      isDifference = true;

	      if (t === true) {
	        return true;
	      }

	      if (t >= 0) {
	        this.times--;
	        this.Aniobject.reset && this.Aniobject.reset();
	      }
	    }

	    return t;
	  };

	  return Loop;
	}();

	var DURATION_FOR_1PX = 10;

	var Move =
	/*#__PURE__*/
	function (_ChangeTo) {
	  _inheritsLoose(Move, _ChangeTo);

	  function Move(x, y, speed, ease) {
	    var _this;

	    _this = _ChangeTo.call(this, {
	      x: x,
	      y: y
	    }, 0, ease) || this;
	    _this.speed = calc(speed) || 1;
	    return _this;
	  }

	  var _proto = Move.prototype;

	  _proto.init = function init(sprite, time) {
	    if (this.speed == 0 || this.targetX === sprite.x && this.targetY === sprite.y) {
	      this.duration = 0;
	    } else {
	      var x = this.changeValues[0],
	          y = this.changeValues[1];
	      x.from = sprite.x;
	      y.from = sprite.y;
	      x.delta = x.to - x.from;
	      y.delta = y.to - y.from;
	      var hypotenuse = Math.sqrt(x.delta * x.delta + y.delta * y.delta);
	      this.duration = hypotenuse * DURATION_FOR_1PX / this.speed;
	    }

	    _ChangeTo.prototype.init.call(this, sprite, time);
	  };

	  return Move;
	}(ChangeTo);

	var Remove =
	/*#__PURE__*/
	function () {
	  function Remove() {}

	  var _proto = Remove.prototype;

	  _proto.run = function run(sprite, time) {
	    return Sequence._TIMELAPSE_TO_REMOVE;
	  };

	  return Remove;
	}();

	var Once =
	/*#__PURE__*/
	function () {
	  function Once(Aniobject, times) {
	    this.Aniobject = Aniobject;
	    this.times = ifNull(calc(times), 1);
	  }

	  var _proto = Once.prototype;

	  _proto.run = function run(sprite, time) {
	    if (this.times <= 0) {
	      return time;
	    } else {
	      var t = this.Aniobject.run(sprite, time);

	      if (t >= 0) {
	        this.times--;
	      }

	      return t;
	    }
	  };

	  return Once;
	}();

	var Shake =
	/*#__PURE__*/
	function () {
	  function Shake(shakediff, duration) {
	    this.initialized = false;
	    this.duration = calc(duration);
	    this.shakeDiff = calc(shakediff);
	    this.shakeDiffHalf = this.shakeDiff / 2;
	  }

	  var _proto = Shake.prototype;

	  _proto.reset = function reset() {
	    this.initialized = false;
	  };

	  _proto.run = function run(sprite, time) {
	    if (!this.initialized) {
	      this.initialized = true;
	      this.x = sprite.x;
	      this.y = sprite.y;
	    }

	    if (time >= this.duration) {
	      sprite.x = this.x;
	      sprite.y = this.y;
	    } else {
	      sprite.x = this.x + Math.random() * this.shakeDiff - this.shakeDiffHalf;
	      sprite.y = this.y + Math.random() * this.shakeDiff - this.shakeDiffHalf;
	    }

	    return time - this.duration;
	  };

	  return Shake;
	}();

	var ShowOnce =
	/*#__PURE__*/
	function () {
	  function ShowOnce() {
	    this.showOnce = true;
	  }

	  var _proto = ShowOnce.prototype;

	  _proto.run = function run(sprite, time) {
	    sprite.enabled = sprite.enabled && this.showOnce;
	    this.showOnce = false;
	    return 0;
	  };

	  return ShowOnce;
	}();

	var State =
	/*#__PURE__*/
	function () {
	  function State(_temp) {
	    var _this = this;

	    var _ref = _temp === void 0 ? {} : _temp,
	        _ref$states = _ref.states,
	        states = _ref$states === void 0 ? {} : _ref$states,
	        _ref$transitions = _ref.transitions,
	        transitions = _ref$transitions === void 0 ? {} : _ref$transitions,
	        _ref$default = _ref["default"],
	        defaultState = _ref$default === void 0 ? undefined : _ref$default,
	        _ref$delegateTo = _ref.delegateTo,
	        delegateTo = _ref$delegateTo === void 0 ? undefined : _ref$delegateTo;

	    this.states = states;
	    Object.keys(this.states).forEach(function (i) {
	      if (Array.isArray(_this.states[i])) {
	        _this.states[i] = new Sequence(_this.states[i]);
	      }
	    });
	    this.transitions = transitions;
	    this.delegateTo = delegateTo;
	    this.currentStateName = defaultState;
	    this.currentState = this.states[defaultState];
	    this.isTransitioningToStateName = undefined;
	  }

	  var _proto = State.prototype;

	  _proto.setState = function setState(name, options) {
	    var _this2 = this;

	    if (name !== this.currentStateName) {
	      this.isTransitioningToStateName = name;
	      var UCFirstName = "" + name.charAt(0).toUpperCase() + name.slice(1);
	      var possibleTransitionNames = [this.currentStateName + "To" + UCFirstName, this.currentStateName + "To", "to" + UCFirstName];
	      var transitionName = possibleTransitionNames.find(function (name) {
	        return _this2.transitions[name];
	      });

	      if (transitionName) {
	        this.currentStateName = this.isTransitioningToStateName;
	        this.currentState = this.transitions[transitionName];
	        this.currentState && this.currentState.reset && this.currentState.reset();
	      } else {
	        this.currentStateName = this.isTransitioningToStateName;
	        this.currentState = this.states[this.currentStateName];
	        this.currentState && this.currentState.reset && this.currentState.reset();
	        this.isTransitioningToStateName = undefined;
	      }
	    }
	  };

	  _proto.play = function play(label, timelapsed) {
	    if (label === void 0) {
	      label = "";
	    }

	    if (timelapsed === void 0) {
	      timelapsed = 0;
	    }

	    this.currentState.play && this.currentState.play(label, timelapsed);
	  };

	  _proto.run = function run(sprite, time, is_difference) {
	    var timeLeft = time;
	    var isDifference = is_difference;

	    if (this.currentState) {
	      timeLeft = this.currentState.run(sprite, timeLeft, isDifference);

	      if (timeLeft === true) {
	        return true;
	      }

	      isDifference = true;
	    }

	    if (timeLeft >= 0 || !this.currentState) {
	      if (this.isTransitioningToStateName) {
	        this.currentStateName = this.isTransitioningToStateName;
	        this.currentState = this.states[this.currentStateName];
	        this.currentState && this.currentState.reset && this.currentState.reset();
	        this.isTransitioningToStateName = undefined;
	        timeLeft = this.currentState.run(sprite, timeLeft, isDifference);

	        if (timeLeft === true) {
	          return true;
	        }
	      } else {
	        this.currentState = undefined;
	      }
	    }

	    return -1;
	  };

	  return State;
	}();

	var End$1 =
	/*#__PURE__*/
	function () {
	  function End() {}

	  var _proto = End.prototype;

	  _proto.run = function run(sprite, time) {
	    return Sequence._TIMELAPSE_TO_STOP;
	  };

	  return End;
	}();

	var EndDisabled$1 =
	/*#__PURE__*/
	function () {
	  function EndDisabled() {}

	  var _proto = EndDisabled.prototype;

	  _proto.run = function run(sprite, time) {
	    sprite.enabled = false;
	    return Sequence._TIMELAPSE_TO_STOP;
	  };

	  return EndDisabled;
	}();

	var WaitDisabled =
	/*#__PURE__*/
	function () {
	  function WaitDisabled(duration) {
	    this.duration = ifNull(calc(duration), 0);
	  }

	  var _proto = WaitDisabled.prototype;

	  _proto.run = function run(sprite, time) {
	    sprite.enabled = time >= this.duration;
	    return time - this.duration;
	  };

	  return WaitDisabled;
	}();

	var Animations = {
	  Callback: Callback$1,
	  ChangeTo: ChangeTo,
	  End: End,
	  EndDisabled: EndDisabled,
	  Forever: Forever,
	  If: If,
	  Image: Image$1,
	  ImageFrame: ImageFrame,
	  Loop: Loop,
	  Move: Move,
	  Once: Once,
	  Remove: Remove,
	  Sequence: Sequence,
	  Shake: Shake,
	  ShowOnce: ShowOnce,
	  State: State,
	  Stop: End$1,
	  StopDisabled: EndDisabled$1,
	  Wait: Wait,
	  WaitDisabled: WaitDisabled
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

	function Transform$1() {
	  this.reset();
	}

	Transform$1.prototype.reset = function () {
	  this.m = [1, 0, 0, 1, 0, 0];
	  return this;
	};

	Transform$1.prototype.multiply = function (matrix) {
	  var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
	  var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];
	  var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
	  var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];
	  var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
	  var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];
	  this.m[0] = m11;
	  this.m[1] = m12;
	  this.m[2] = m21;
	  this.m[3] = m22;
	  this.m[4] = dx;
	  this.m[5] = dy;
	  return this;
	};

	Transform$1.prototype.invert = function () {
	  var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
	  var m0 = this.m[3] * d;
	  var m1 = -this.m[1] * d;
	  var m2 = -this.m[2] * d;
	  var m3 = this.m[0] * d;
	  var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
	  var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
	  this.m[0] = m0;
	  this.m[1] = m1;
	  this.m[2] = m2;
	  this.m[3] = m3;
	  this.m[4] = m4;
	  this.m[5] = m5;
	  return this;
	};

	Transform$1.prototype.rotate = function (rad) {
	  var c = Math.cos(rad);
	  var s = Math.sin(rad);
	  var m11 = this.m[0] * c + this.m[2] * s;
	  var m12 = this.m[1] * c + this.m[3] * s;
	  var m21 = this.m[0] * -s + this.m[2] * c;
	  var m22 = this.m[1] * -s + this.m[3] * c;
	  this.m[0] = m11;
	  this.m[1] = m12;
	  this.m[2] = m21;
	  this.m[3] = m22;
	  return this;
	};

	Transform$1.prototype.translate = function (x, y) {
	  this.m[4] += this.m[0] * x + this.m[2] * y;
	  this.m[5] += this.m[1] * x + this.m[3] * y;
	  return this;
	};

	Transform$1.prototype.scale = function (sx, sy) {
	  this.m[0] *= sx;
	  this.m[1] *= sx;
	  this.m[2] *= sy;
	  this.m[3] *= sy;
	  return this;
	};

	Transform$1.prototype.transformPoint = function (px, py) {
	  var x = px;
	  var y = py;
	  px = x * this.m[0] + y * this.m[2] + this.m[4];
	  py = x * this.m[1] + y * this.m[3] + this.m[5];
	  return [px, py];
	};

	Transform$1.prototype.clone = function () {
	  var n = new Transform$1();
	  n.m = this.m.slice(0);
	  return n;
	};

	var Camera =
	/*#__PURE__*/
	function () {
	  function Camera() {
	    this.type = "camera";
	    this.cam = {
	      zoom: 1,
	      x: 0,
	      y: 0
	    };
	  }

	  var _proto = Camera.prototype;

	  _proto.viewport = function viewport(_ref, matrix) {
	    _objectDestructuringEmpty(_ref);

	    console.log(this.cam);
	    return matrix.scale(this.cam.zoom, this.cam.zoom).translate(-this.cam.x, -this.cam.y);
	  };

	  _proto.viewportByCam = function viewportByCam(_ref2, cam) {
	    var engine = _ref2.engine;
	    var hw = engine.getWidth() / 2;
	    var hh = engine.getHeight() / 2;
	    var scale = engine.getRatio() > 1 ? hw : hh;
	    return new Transform$1().translate(hw, hh).scale(scale, scale).scale(cam.zoom, cam.zoom).translate(-cam.x, -cam.y);
	  };

	  _proto.additionalModifier = function additionalModifier(_ref3, _additionalModifier) {
	    _objectDestructuringEmpty(_ref3);

	    _additionalModifier.cam = this.cam;
	    cl = {
	      x1: _additionalModifier.x,
	      y1: _additionalModifier.y,
	      x2: _additionalModifier.x + _additionalModifier.width,
	      y2: _additionalModifier.y + _additionalModifier.height,
	      _w: _additionalModifier.width,
	      _h: _additionalModifier.height
	    };
	    return _additionalModifier;
	  };

	  _proto.clampView = function clampView(_ref4, cam) {
	    var engine = _ref4.engine,
	        scene = _ref4.scene,
	        clampLimits = _ref4.clampLimits;
	    var cl = clampLimits || {
	      x1: scene.additionalModifier.x,
	      y1: scene.additionalModifier.y,
	      x2: scene.additionalModifier.x + scene.additionalModifier.width,
	      y2: scene.additionalModifier.y + scene.additionalModifier.height
	    };
	    var invert = this.viewportByCam({
	      engine: engine
	    }, cam).invert();

	    var _invert$transformPoin = invert.transformPoint(0, 0),
	        x1 = _invert$transformPoin[0],
	        y1 = _invert$transformPoin[1];

	    var _invert$transformPoin2 = invert.transformPoint(engine.getWidth(), engine.getHeight()),
	        x2 = _invert$transformPoin2[0],
	        y2 = _invert$transformPoin2[1];

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
	    }

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
	  };

	  _proto.zoomToFullScreen = function zoomToFullScreen(_ref5) {
	    var scene = _ref5.scene;
	    return Math.min(scene.additionalModifier.fullScreen.width / scene.additionalModifier.width, scene.additionalModifier.fullScreen.height / scene.additionalModifier.height);
	  };

	  _proto.zoomTo = function zoomTo(_ref6) {
	    var scene = _ref6.scene,
	        engine = _ref6.engine,
	        cam = _ref6.cam,
	        x1 = _ref6.x1,
	        y1 = _ref6.y1,
	        x2 = _ref6.x2,
	        y2 = _ref6.y2;
	    var scale = scene.additionalModifier.scaleCanvas;
	    var invert = this.viewportByCam({
	      engine: engine
	    }, cam).invert();

	    var _invert$transformPoin3 = invert.transformPoint(0, 0),
	        sx1 = _invert$transformPoin3[0],
	        sy1 = _invert$transformPoin3[1];

	    var _invert$transformPoin4 = invert.transformPoint(engine.getWidth() * scale, engine.getHeight() * scale),
	        sx2 = _invert$transformPoin4[0],
	        sy2 = _invert$transformPoin4[1];

	    var sw = sx2 - sx1;
	    var sh = sy2 - sy1;
	    var w = x2 - x1;
	    var h = y2 - y1;
	    var mx = x1 + w / 2;
	    var my = y1 + h / 2;
	    var zoomX = sw / w;
	    var zoomY = sh / h;
	    return {
	      x: mx,
	      y: my,
	      zoom: this.toCam.zoom * Math.max(Math.min(zoomX, zoomY), Number.MIN_VALUE)
	    };
	  };

	  _createClass(Camera, [{
	    key: "zoom",
	    set: function set(value) {
	      this.cam.zoom = value;
	    },
	    get: function get() {
	      return this.cam.zoom;
	    }
	  }, {
	    key: "camX",
	    set: function set(v) {
	      this.cam.x = v;
	    },
	    get: function get() {
	      return this.cam.x;
	    }
	  }, {
	    key: "camY",
	    set: function set(v) {
	      this.cam.y = v;
	    },
	    get: function get() {
	      return this.cam.y;
	    }
	  }]);

	  return Camera;
	}();

	var clickTime$1 = 300;

	var CameraControl =
	/*#__PURE__*/
	function () {
	  function CameraControl(config) {
	    if (config === void 0) {
	      config = {};
	    }

	    this.type = "control";
	    this._mousePos = {};
	    this.toCam = {};
	    this.config = Object.assign({
	      zoomMax: 10,
	      zoomMin: 0.5,
	      zoomFactor: 1.2,
	      tween: 2,
	      callResize: true
	    }, config);
	  }

	  var _proto = CameraControl.prototype;

	  _proto.init = function init(_ref) {
	    var scene = _ref.scene;
	    this._scene = scene;
	    this.toCam = scene.camera.cam;
	  };

	  _proto.mouseDown = function mouseDown(_ref2) {
	    var e = _ref2.event,
	        _ref2$position = _ref2.position,
	        mx = _ref2$position[0],
	        my = _ref2$position[1],
	        i = _ref2.button;
	    this._mousePos[i] = Object.assign({}, this._mousePos[i], {
	      x: mx,
	      y: my,
	      _cx: this.toCam.x,
	      _cy: this.toCam.y,
	      _isDown: true,
	      _numOfFingers: e.touches && e.touches.length || 1,
	      _distance: undefined,
	      _timestamp: Date.now()
	    });
	  };

	  _proto.mouseUp = function mouseUp(_ref3) {
	    var e = _ref3.event,
	        _ref3$position = _ref3.position,
	        mx = _ref3$position[0],
	        my = _ref3$position[1],
	        i = _ref3.button,
	        scene = _ref3.scene;

	    if (!this._mousePos[i]) {
	      this._mousePos[i] = {};
	    }

	    var down = this._mousePos[i]._isDown;
	    var numCurrentFingers = e.changedTouches && e.changedTouches.length || 1;
	    var numOfFingers = Math.max(this._mousePos[i]._numOfFingers, numCurrentFingers);
	    this._mousePos[i]._isDown = false;
	    this._mousePos[i]._numOfFingers -= numCurrentFingers;

	    if (!down || numOfFingers > 1) {
	      scene.stopPropagation();
	      return;
	    }

	    if (!(Date.now() - this._mousePos[i]._timestamp < clickTime$1 && Math.abs(this._mousePos[i].x - mx) < 5 && Math.abs(this._mousePos[i].y - my) < 5 && !i)) {
	      scene.stopPropagation();
	    }
	  };

	  _proto.mouseOut = function mouseOut(_ref4) {
	    var i = _ref4.button;
	    if (this._mousePos[i]) this._mousePos[i]._isDown = false;
	  };

	  _proto.mouseMove = function mouseMove(_ref5) {
	    var e = _ref5.event,
	        _ref5$position = _ref5.position,
	        mx = _ref5$position[0],
	        my = _ref5$position[1],
	        i = _ref5.button,
	        scene = _ref5.scene;

	    if (!this._mousePos[i] || !this._mousePos[i]._isDown || e.which === 0 && !e.touches) {
	      return;
	    }

	    var scale = scene.additionalModifier.scaleCanvas;

	    if (e.touches && e.touches.length >= 2) {
	      var t = e.touches;
	      var distance = Math.sqrt((t[0].pageX - t[1].pageX) * (t[0].pageX - t[1].pageX) + (t[0].pageY - t[1].pageY) * (t[0].pageY - t[1].pageY));

	      if (this._mousePos[i]._distance === undefined) {
	        if (distance > 0) {
	          this._mousePos[i]._distance = distance;
	          this._mousePos[i]._czoom = this.toCam.zoom;
	        }
	      } else {
	        this.toCam.zoom = Math.max(this.config.zoomMin, Math.min(this.config.zoomMax, this._mousePos[i]._czoom * distance / this._mousePos[i]._distance));
	        this.toCam = scene.camera.clampView(arguments[0], this.toCam);
	      }

	      return;
	    } else {
	      this._mousePos[i]._distance = undefined;
	      var viewMatrix = scene.camera.viewportByCam(arguments[0], this.toCam).invert();

	      var _viewMatrix$transform = viewMatrix.transformPoint(this._mousePos[i].x * scale, this._mousePos[i].y * scale),
	          ox = _viewMatrix$transform[0],
	          oy = _viewMatrix$transform[1];

	      var _viewMatrix$transform2 = viewMatrix.transformPoint(mx * scale, my * scale),
	          nx = _viewMatrix$transform2[0],
	          ny = _viewMatrix$transform2[1];

	      this.toCam.x = this._mousePos[i]._cx + ox - nx;
	      this.toCam.y = this._mousePos[i]._cy + oy - ny;
	      this.toCam = scene.camera.clampView(arguments[0], this.toCam);
	    }
	  };

	  _proto.mouseWheel = function mouseWheel(_ref6) {
	    var e = _ref6.event,
	        _ref6$position = _ref6.position,
	        mx = _ref6$position[0],
	        my = _ref6$position[1],
	        scene = _ref6.scene;
	    if (this.config.preventDefault) e.preventDefault();

	    if (this.config.enabled) {
	      var scale = scene.additionalModifier.scaleCanvas;

	      var _scene$camera$viewpor = scene.camera.viewportByCam(arguments[0], this.toCam).invert().transformPoint(mx * scale, my * scale),
	          ox = _scene$camera$viewpor[0],
	          oy = _scene$camera$viewpor[1];

	      var wheelData = e.wheelDelta || e.deltaY * -1;

	      if (wheelData / 120 > 0) {
	        this.zoomIn();

	        var _this$_getViewportByC = this._getViewportByCam(this.toCam).invert().transformPoint(mx * scale, my * scale),
	            nx = _this$_getViewportByC[0],
	            ny = _this$_getViewportByC[1];

	        this.toCam.x -= nx - ox;
	        this.toCam.y -= ny - oy;
	        this.toCam = scene.camera.clampView(arguments[0], this.toCam);
	      } else {
	        this.zoomOut(arguments[0]);
	      }
	    }
	  };

	  _proto.hasCamChanged = function hasCamChanged() {
	    var t = this.config.tween || 1;
	    return Math.abs(this.toCam.x - this._scene.camera.cam.x) >= Number.EPSILON * t || Math.abs(this.toCam.y - this._scene.camera.cam.y) >= Number.EPSILON * t || Math.abs(this.toCam.zoom - this._scene.camera.cam.zoom) >= Number.EPSILON * t;
	  };

	  _proto.fixedUpdate = function fixedUpdate(_ref7) {
	    var scene = _ref7.scene,
	        lastCall = _ref7.lastCall;

	    if (this.config.tween && !this._instant && this.hasCamChanged()) {
	      scene.camera.cam.x += (this.toCam.x - scene.camera.cam.x) / this.config.tween;
	      scene.camera.cam.y += (this.toCam.y - scene.camera.cam.y) / this.config.tween;
	      scene.camera.cam.zoom += (this.toCam.zoom - scene.camera.cam.zoom) / this.config.tween;

	      if (lastCall) {
	        scene.additionalModifier.cam = this.cam;

	        if (this.config.callResize) {
	          scene.resize();
	        } else {
	          scene.cacheClear();
	        }
	      }
	    }
	  };

	  _proto.update = function update(_ref8) {
	    var scene = _ref8.scene;

	    if ((!this.config.tween || this._instant) && this.hasCamChanged()) {
	      this._instant = false;
	      scene.camera.cam = Object.assign({}, this.toCam);

	      if (this.config.callResize) {
	        scene.resize();
	      } else {
	        scene.cacheClear();
	      }
	    }
	  };

	  _proto.camInstant = function camInstant() {
	    this._instant = true;
	  };

	  _proto.resize = function resize(args) {
	    this.toCam = args.scene.camera.clampView(args, this.toCam);
	  };

	  _proto.zoomToNorm = function zoomToNorm() {
	    this.toCam.zoom = 1;
	    return this;
	  };

	  _proto.zoomIn = function zoomIn() {
	    this.toCam.zoom = Math.min(this.config.zoomMax, this.toCam.zoom * this.config.zoomFactor);
	    return this;
	  };

	  _proto.zoomOut = function zoomOut(args) {
	    this.toCam.zoom = Math.max(this.config.zoomMin, this.toCam.zoom / this.config.zoomFactor);
	    this.toCam = this._scene.camera.clampView(args, this.toCam);
	    return this;
	  };

	  return CameraControl;
	}();

	var CameraControlSecondButton =
	/*#__PURE__*/
	function (_CameraControl) {
	  _inheritsLoose(CameraControlSecondButton, _CameraControl);

	  function CameraControlSecondButton() {
	    return _CameraControl.apply(this, arguments) || this;
	  }

	  var _proto = CameraControlSecondButton.prototype;

	  _proto.mouseUp = function mouseUp(_ref) {
	    var e = _ref.event,
	        _ref$position = _ref.position,
	        mx = _ref$position[0],
	        my = _ref$position[1],
	        i = _ref.button,
	        scene = _ref.scene;

	    if (!this._mousePos[i]) {
	      this._mousePos[i] = {};
	    }

	    var down = this._mousePos[i]._isDown;
	    var numCurrentFingers = e.changedTouches && e.changedTouches.length || 1;
	    var numOfFingers = Math.max(this._mousePos[i]._numOfFingers, numCurrentFingers);
	    this._mousePos[i]._isDown = false;
	    this._mousePos[i]._numOfFingers -= numCurrentFingers;

	    if (!down || numOfFingers > 1) {
	      scene.stopPropagation();
	      return;
	    }

	    if (!(Date.now() - this._mousePos[i]._timestamp < clickTime && Math.abs(this._mousePos[i].x - mx) < 5 && Math.abs(this._mousePos[i].y - my) < 5 && !i)) {
	      scene.stopPropagation();

	      var _this$transformPoint = this.transformPoint(mx, my),
	          x = _this$transformPoint[0],
	          y = _this$transformPoint[1];

	      var _this$transformPoint2 = this.transformPoint(this._mousePos[i].x, this._mousePos[i].y),
	          ox = _this$transformPoint2[0],
	          oy = _this$transformPoint2[1];

	      scene.map('region', {
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
	  };

	  _proto.mouseMove = function mouseMove(_ref2) {
	    var e = _ref2.event,
	        _ref2$position = _ref2.position,
	        mx = _ref2$position[0],
	        my = _ref2$position[1],
	        i = _ref2.button,
	        scene = _ref2.scene;

	    if (!this._mousePos[i] || !this._mousePos[i]._isDown || e.which === 0 && !e.touches) {
	      return;
	    }

	    var scale = scene.additionalModifier.scaleCanvas;

	    if (e.touches && e.touches.length >= 2) {
	      var t = e.touches;
	      var distance = Math.sqrt((t[0].pageX - t[1].pageX) * (t[0].pageX - t[1].pageX) + (t[0].pageY - t[1].pageY) * (t[0].pageY - t[1].pageY));

	      if (this._mousePos[i]._distance === undefined) {
	        if (distance > 0) {
	          this._mousePos[i]._distance = distance;
	          this._mousePos[i]._czoom = this.toCam.zoom;
	        }
	      } else {
	        this.toCam.zoom = Math.max(this.config.zoomMin, Math.min(this.config.zoomMax, this._mousePos[i]._czoom * distance / this._mousePos[i]._distance));
	        var viewMatrix = scene.camera.viewportByCam(arguments[0], this.toCam).invert();

	        var _viewMatrix$transform = viewMatrix.transformPoint(this._mousePos[i].x * scale, this._mousePos[i].y * scale),
	            ox = _viewMatrix$transform[0],
	            oy = _viewMatrix$transform[1];

	        var _viewMatrix$transform2 = viewMatrix.transformPoint(mx * scale, my * scale),
	            nx = _viewMatrix$transform2[0],
	            ny = _viewMatrix$transform2[1];

	        this.toCam.x = this._mousePos[i]._cx + ox - nx;
	        this.toCam.y = this._mousePos[i]._cy + oy - ny;
	        this.toCam = scene.camera.clampView(arguments[0], this.toCam);
	      }

	      return;
	    } else {
	      this._mousePos[i]._distance = undefined;

	      if (i === 2) {
	        var _viewMatrix = scene.camera.viewportByCam(arguments[0], this.toCam).invert();

	        var _viewMatrix$transform3 = _viewMatrix.transformPoint(this._mousePos[i].x * scale, this._mousePos[i].y * scale),
	            _ox = _viewMatrix$transform3[0],
	            _oy = _viewMatrix$transform3[1];

	        var _viewMatrix$transform4 = _viewMatrix.transformPoint(mx * scale, my * scale),
	            _nx = _viewMatrix$transform4[0],
	            _ny = _viewMatrix$transform4[1];

	        this.toCam.x = this._mousePos[i]._cx + _ox - _nx;
	        this.toCam.y = this._mousePos[i]._cy + _oy - _ny;
	        this.toCam = scene.camera.clampView(arguments[0], this.toCam);
	      }
	    }

	    if (i === 0 && scene.has('regionMove') && !(Date.now() - this._mousePos[i]._timestamp < clickTime && Math.abs(this._mousePos[i].x - mx) < 5 && Math.abs(this._mousePos[i].y - my) < 5) && (!e.touches || e.touches.length === 1)) {
	      var _scene$transformPoint = scene.transformPoint(mx, my),
	          x = _scene$transformPoint[0],
	          y = _scene$transformPoint[1];

	      var _scene$transformPoint2 = scene.transformPoint(this._mousePos[i].x, this._mousePos[i].y),
	          _ox2 = _scene$transformPoint2[0],
	          _oy2 = _scene$transformPoint2[1];

	      scene.map('regionMove', {
	        event: e,
	        x1: Math.min(_ox2, x),
	        y1: Math.min(_oy2, y),
	        x2: Math.max(_ox2, x),
	        y2: Math.max(_oy2, y),
	        fromX: _ox2,
	        fromY: _oy2,
	        toX: x,
	        toY: y
	      });
	    }
	  };

	  return CameraControlSecondButton;
	}(CameraControl);

	var Click =
	/*#__PURE__*/
	function () {
	  function Click(_temp) {
	    var _ref = _temp === void 0 ? {} : _temp,
	        _ref$doubleClickDetec = _ref.doubleClickDetectInterval,
	        doubleClickDetectInterval = _ref$doubleClickDetec === void 0 ? 350 : _ref$doubleClickDetec;

	    this._doubleClickDetectInterval = doubleClickDetectInterval;
	  }

	  var _proto = Click.prototype;

	  _proto.mouseUp = function mouseUp(_ref2) {
	    var _this = this;

	    var event = _ref2.event,
	        position = _ref2.position;
	    var param = {
	      event: event,
	      position: position
	    };

	    if (scene.has("doubleClick")) {
	      if (this._doubleClickElementTimer) {
	        clearTimeout(this._doubleClickElementTimer);
	        this._doubleClickElementTimer = 0;
	        scene.map("doubleClick", param);
	      } else {
	        this._doubleClickElementTimer = setTimeout(function () {
	          _this._doubleClickElementTimer = 0;
	          scene.map("click", param);
	        }, this._doubleClickDetectInterval);
	      }
	    } else {
	      scene.map("click", param);
	    }
	  };

	  return Click;
	}();

	var Element =
	/*#__PURE__*/
	function () {
	  function Element(_temp) {
	    var _ref = _temp === void 0 ? {} : _temp,
	        _ref$doubleClickDetec = _ref.doubleClickDetectInterval,
	        doubleClickDetectInterval = _ref$doubleClickDetec === void 0 ? 350 : _ref$doubleClickDetec;

	    this._doubleClickDetectInterval = doubleClickDetectInterval;
	  }

	  var _proto = Element.prototype;

	  _proto.isDrawFrame = function isDrawFrame() {
	    return this._hasDetectImage ? 1 : 0;
	  };

	  _proto._dispatchEvent = function _dispatchEvent(scene, isClick, param) {
	    var _this = this;

	    if (isClick) {
	      if (scene.has('doubleClickElement')) {
	        if (this._doubleClickElementTimer) {
	          clearTimeout(this._doubleClickElementTimer);
	          this._doubleClickElementTimer = 0;
	          scene.map('doubleClickElement', param);
	        } else {
	          this._doubleClickElementTimer = setTimeout(function () {
	            _this._doubleClickElementTimer = 0;
	            scene.map('clickElement', param);
	          }, this._doubleClickDetectInterval);
	        }
	      } else {
	        scene.map('clickElement', param);
	      }
	    } else {
	      scene.map('hoverElement', param);
	    }
	  };

	  _proto._dispatchNonEvent = function _dispatchNonEvent(scene, isClick, param) {
	    var _this2 = this;

	    if (isClick) {
	      if (scene.has('doubleClickNonElement')) {
	        if (this._doubleClickElementTimer) {
	          clearTimeout(this._doubleClickElementTimer);
	          this._doubleClickElementTimer = undefined;
	          scene.map('doubleClickNonElement', param);
	        } else {
	          this._doubleClickElementTimer = setTimeout(function () {
	            _this2._doubleClickElementTimer = undefined;
	            scene.map('clickNonElement', param);
	          }, this._doubleClickDetectInterval);
	        }
	      } else {
	        scene.map('clickNonElement', param);
	      }
	    } else {
	      scene.map('hoverNonElement', param);
	    }
	  };

	  _proto.initSprite = function initSprite(_ref2) {
	    var scene = _ref2.scene,
	        output = _ref2.output,
	        layerManager = _ref2.layerManager,
	        canvasId = _ref2.canvasId;
	    this._hasDetectImage = false;

	    if (this._clickIntend || this._hoverIntend) {
	      var isClick = !!this._clickIntend;

	      var _ref3 = this._clickIntend || this._hoverIntend,
	          mx = _ref3.mx,
	          my = _ref3.my;

	      var scale = scene.additionalModifier.scaleCanvas;
	      var ctx = output.context[canvasId];
	      var cx = Math.round(mx / scale);
	      var cy = Math.round(my / scale);

	      var _scene$transformPoint = scene.transformPoint(mx, my),
	          x = _scene$transformPoint[0],
	          y = _scene$transformPoint[1];

	      ctx.save();
	      ctx.setTransform.apply(ctx, scene.viewport().m);
	      var found = 0;
	      layerManager.forEach(function (_ref4) {
	        var layerId = _ref4.layerId,
	            element = _ref4.element,
	            isFunction = _ref4.isFunction,
	            elementId = _ref4.elementId;

	        if (!isFunction) {
	          var a = element.detect(ctx, cx, cy);

	          if (a === "c") {
	            found = "c";
	          } else if (a) {
	            found = {
	              layerId: layerId,
	              element: a,
	              elementId: elementId
	            };
	            return false;
	          }
	        }
	      });
	      ctx.restore();

	      if (found === "c") {
	        this._hasDetectImage = true;
	      } else {
	        this._clickIntend = false;
	        this._hoverIntend = false;
	        var param = {
	          mx: mx,
	          my: my,
	          x: x,
	          y: y
	        };

	        if (found) {
	          Object.assign(param, found);

	          this._dispatchEvent(scene, isClick, param);
	        } else {
	          this._dispatchNonEvent(scene, isClick, param);
	        }
	      }
	    }
	  };

	  _proto.draw = function draw(_ref5) {
	    var engine = _ref5.engine,
	        scene = _ref5.scene,
	        layerManager = _ref5.layerManager,
	        output = _ref5.output,
	        canvasId = _ref5.canvasId;

	    if (!canvasId && this._hasDetectImage) {
	      var isClick = !!this._clickIntend;

	      var _ref6 = this._clickIntend || this._hoverIntend,
	          mx = _ref6.mx,
	          my = _ref6.my;

	      var scale = scene.additionalModifier.scaleCanvas;
	      var ctx = output.context[canvasId];
	      var cx = Math.round(mx / scale);
	      var cy = Math.round(my / scale);

	      var _this$transformPoint = this.transformPoint(mx, my),
	          x = _this$transformPoint[0],
	          y = _this$transformPoint[1];

	      var param = {
	        mx: mx,
	        my: my,
	        x: x,
	        y: y
	      };
	      var oldISE = ctx.imageSmoothingEnabled;
	      ctx.imageSmoothingEnabled = false;
	      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	      ctx.save();
	      ctx.setTransform.apply(ctx, scene.viewport().m);
	      layerManager.forEach(function (_ref7) {
	        var layerId = _ref7.layerId,
	            element = _ref7.element,
	            isFunction = _ref7.isFunction,
	            elementId = _ref7.elementId;

	        if (!isFunction) {
	          var color = "rgb(" + (elementId & 0xff) + ", " + ((elementId & 0xff00) >> 8) + ", " + (layerId & 0xff) + ")";
	          element.detectDraw(ctx, color);
	        }
	      }, 0);
	      ctx.restore();
	      ctx.imageSmoothingEnabled = oldISE;
	      engine.normContext(ctx);
	      this._clickIntend = false;
	      this._hoverIntend = false;
	      var p = ctx.getImageData(cx, cy, 1, 1).data;

	      if (p[3]) {
	        param.layerId = p[2];
	        param.elementId = p[0] + (p[1] << 8);
	        param.element = layerManager.getById(param.layerId).getById(param.elementId);

	        this._dispatchEvent(scene, isClick, param);
	      } else {
	        this._dispatchNonEvent(scene, isClick, param);
	      }
	    }
	  };

	  _proto.mouseUp = function mouseUp(_ref8) {
	    var scene = _ref8.scene,
	        _ref8$position = _ref8.position,
	        mx = _ref8$position[0],
	        my = _ref8$position[1];
	    this._clickIntend = scene.has('clickElement') && {
	      mx: mx,
	      my: my
	    };
	  };

	  _proto.mouseMove = function mouseMove(_ref9) {
	    var scene = _ref9.scene,
	        _ref9$position = _ref9.position,
	        mx = _ref9$position[0],
	        my = _ref9$position[1];
	    this._hoverIntend = scene.has('hoverElement') && {
	      mx: mx,
	      my: my
	    };
	  };

	  return Element;
	}();

	var Events =
	/*#__PURE__*/
	function () {
	  function Events() {
	    this.type = "events";
	  }

	  var _proto = Events.prototype;

	  _proto._pushEvent = function _pushEvent(command, event, scene) {
	    if (scene.value("preventDefault")) event.preventDefault();

	    var _this$getMousePositio = this.getMousePosition({
	      event: event
	    }),
	        mx = _this$getMousePositio[0],
	        my = _this$getMousePositio[1];

	    var _scene$transformPoint = scene.transformPoint(mx, my),
	        x = _scene$transformPoint[0],
	        y = _scene$transformPoint[1];

	    scene.pipeBack(command, {
	      event: event,
	      position: [mx, my],
	      x: x,
	      y: y,
	      button: this.getMouseButton({
	        event: event
	      })
	    });
	  };

	  _proto.init = function init(_ref) {
	    var _this = this;

	    var output = _ref.output,
	        scene = _ref.scene;
	    var element = output.canvas[0];
	    var events = scene.map("events");
	    events.push([scene.value("preventDefault") && [["contextmenu"], function (e) {
	      return e.preventDefault();
	    }], scene.has("mouseDown") && [["touchstart", "mousedown"], function (event) {
	      return _this._pushEvent("mouseDown", event, scene);
	    }], scene.has("mouseUp") && [["touchend", "mouseup"], function (event) {
	      return _this._pushEvent("mouseUp", event, scene);
	    }], scene.has("mouseOut") && [["touchendoutside", "mouseout"], function (event) {
	      return _this._pushEvent("mouseOut", event, scene);
	    }], scene.has("mouseMove") && [["touchmove", "mousemove"], function (event) {
	      return _this._pushEvent("mouseMove", event, scene);
	    }], scene.has("mouseWheel") && [["wheel"], function (event) {
	      return _this._pushEvent("mouseWheel", event, scene);
	    }]].filter(function (v) {
	      return v;
	    }));
	    this._events = events.filter(Array.isArray).reduce(function (acc, cur) {
	      acc.push.apply(acc, cur);
	      return acc;
	    }, []).map(function (_ref2) {
	      var events = _ref2[0],
	          func = _ref2[1];
	      return events.map(function (e) {
	        return {
	          n: element,
	          e: e,
	          f: func
	        };
	      });
	    }).reduce(function (acc, cur) {
	      if (Array.isArray(cur)) {
	        acc.push.apply(acc, cur);
	      } else {
	        acc.push(cur);
	      }

	      return acc;
	    }, []);

	    this._events.forEach(function (v) {
	      v.n.addEventListener(v.e, v.f, true);
	    });
	  };

	  _proto.destroy = function destroy() {
	    this._events.forEach(function (v) {
	      v.n.removeEventListener(v.e, v.f, true);
	    });

	    this._events = [];
	  };

	  _proto.getMousePosition = function getMousePosition(_ref3) {
	    var e = _ref3.event;
	    var touches;

	    if (e.touches && e.touches.length > 0) {
	      touches = e.targetTouches;
	    } else if (e.changedTouches && e.changedTouches.length > 0) {
	      touches = e.changedTouches;
	    }

	    if (touches) {
	      var rect = e.target.getBoundingClientRect();
	      var length = touches.length;
	      touches = Array.from(touches);
	      return [touches.reduce(function (sum, v) {
	        return sum + v.pageX;
	      }, 0) / length - rect.left, touches.reduce(function (sum, v) {
	        return sum + v.pageY;
	      }, 0) / length - rect.top];
	    }

	    if (e.offsetX === undefined) {
	      var _rect = e.target.getBoundingClientRect();

	      return [e.clientX - _rect.left, e.clientY - _rect.top];
	    }

	    return [e.offsetX, e.offsetY];
	  };

	  _proto.getMouseButton = function getMouseButton(_ref4) {
	    var e = _ref4.event;
	    return e.which ? e.which - 1 : e.button || 0;
	  };

	  return Events;
	}();

	var LoadingScreen =
	/*#__PURE__*/
	function () {
	  function LoadingScreen() {}

	  var _proto = LoadingScreen.prototype;

	  _proto.loading = function loading(_ref) {
	    var output = _ref.output,
	        progress = _ref.progress;
	    var ctx = output.context[0];
	    var loadedHeight = typeof progress === "number" ? Math.max(1, progress * output.height) : output.height;
	    ctx.globalCompositeOperation = "source-over";
	    ctx.globalAlpha = 1;
	    ctx.clearRect(0, 0, output.width, output.height);
	    ctx.fillStyle = "#aaa";
	    ctx.fillRect(0, output.height / 2 - loadedHeight / 2, output.width, loadedHeight);
	    ctx.font = "20px Georgia";
	    ctx.fillStyle = "#fff";
	    ctx.textAlign = "left";
	    ctx.textBaseline = "bottom";
	    ctx.fillText(isNaN(parseFloat(progress)) ? progress : "Loading " + Math.round(100 * progress) + "%", 10 + Math.random() * 3, output.height - 10 + Math.random() * 3);
	  };

	  return LoadingScreen;
	}();

	var Norm =
	/*#__PURE__*/
	function () {
	  function Norm() {}

	  var _proto = Norm.prototype;

	  _proto.viewport = function viewport(_ref, matrix) {
	    var engine = _ref.engine;
	    var hw = engine.getWidth() / 2;
	    var hh = engine.getHeight() / 2;
	    var scale = engine.getRatio() > 1 ? hw : hh;
	    return matrix.translate(hw, hh).scale(scale, scale);
	  };

	  _proto.additionalModifier = function additionalModifier(_ref2) {
	    var engine = _ref2.engine,
	        output = _ref2.output,
	        scene = _ref2.scene;
	    scene.cacheClear();
	    var additionalModifier = {
	      alpha: 1,
	      x: -1,
	      y: -1,
	      width: 2,
	      height: 2,
	      widthInPixel: output.width,
	      heightInPixel: output.height,
	      scaleCanvas: output.width / output.canvas[0].clientWidth
	    };

	    var _scene$transformPoint = scene.transformPoint(0, 0, 1),
	        x1 = _scene$transformPoint[0],
	        y1 = _scene$transformPoint[1];

	    var _scene$transformPoint2 = scene.transformPoint(output.width, output.height, 1),
	        x2 = _scene$transformPoint2[0],
	        y2 = _scene$transformPoint2[1];

	    additionalModifier.visibleScreen = {
	      x: x1,
	      y: y1,
	      width: x2 - x1,
	      height: y2 - y1
	    };
	    var hw = engine.getWidth() / 2;
	    var hh = engine.getHeight() / 2;
	    var scale = engine.getRatio() > 1 ? hw : hh;
	    var transformInvert = new Transform$1().translate(hw, hh).scale(scale, scale).invert();

	    var _transformInvert$tran = transformInvert.transformPoint(0, 0, 1),
	        sx1 = _transformInvert$tran[0],
	        sy1 = _transformInvert$tran[1];

	    var _transformInvert$tran2 = transformInvert.transformPoint(output.width, output.height, 1),
	        sx2 = _transformInvert$tran2[0],
	        sy2 = _transformInvert$tran2[1];

	    additionalModifier.fullScreen = {
	      x: sx1,
	      y: sy1,
	      width: sx2 - sx1,
	      height: sy2 - sy1
	    };
	    return additionalModifier;
	  };

	  return Norm;
	}();

	var TimingAudio =
	/*#__PURE__*/
	function (_TimingDefault) {
	  _inheritsLoose(TimingAudio, _TimingDefault);

	  function TimingAudio(configuration) {
	    var _this;

	    if (configuration === void 0) {
	      configuration = {};
	    }

	    _this = _TimingDefault.call(this, configuration) || this;
	    _this._maxSkippedTickChunk = Number.POSITIVE_INFINITY;
	    _this._audioStartTime = null;
	    _this._audioPosition = null;
	    _this._enableAndroidHack = false;
	    _this._audioElement = _this._configuration.audioElement;
	    return _this;
	  }

	  var _proto = TimingAudio.prototype;

	  _proto.init = function init() {
	    var _this2 = this;

	    if (this._audioElement) {
	      if (typeof MediaController === "function") {
	        this._audioElement.controller = new MediaController();
	        this._enableAndroidHack = true;
	      }

	      this._audioElement.preload = "auto";
	      return new Promise(function (resolve) {
	        var canplaythrough = function canplaythrough() {
	          _this2._audioElement.removeEventListener("canplaythrough", canplaythrough);

	          var playPromise = _this2._audioElement.play();

	          if (playPromise) {
	            playPromise["catch"](function (e) {});
	          }

	          resolve();
	        };

	        _this2._audioElement.addEventListener("canplaythrough", canplaythrough);

	        _this2._audioElement.load();
	      });
	    }
	  };

	  _proto.endTime = function endTime() {
	    return this._audioElement.duration * 1000;
	  };

	  _proto.currentTime = function currentTime() {
	    var currentTime = _TimingDefault.prototype.currentTime.call(this);

	    if (this._audioElement) {
	      var currentAudioTime = (this._audioElement.ended ? this._audioElement.duration : this._audioElement.currentTime) * 1000;

	      if (this._enableAndroidHack) {
	        if (this._audioStartTime === null) {
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
	  };

	  _proto.clampTime = function clampTime(_ref) {
	    var timePassed = _ref.timePassed;
	    return timePassed;
	  };

	  _proto.shiftTime = function shiftTime() {
	    return 0;
	  };

	  _createClass(TimingAudio, [{
	    key: "audioElement",
	    get: function get() {
	      return this._audioElement;
	    }
	  }]);

	  return TimingAudio;
	}(TimingDefault);

	var Middleware = {
	  Callback: Camera,
	  Camera: Camera,
	  CameraControl: CameraControl,
	  CameraControlSecondButton: CameraControlSecondButton,
	  Click: Click,
	  Element: Element,
	  Event: Events,
	  LoadingScreen: LoadingScreen,
	  Norm: Norm,
	  TimingAudio: TimingAudio,
	  TimingDefault: TimingDefault
	};

	exports.Animations = Animations;
	exports.Easing = eases;
	exports.Engine = Engine;
	exports.ImageManager = ImageManager;
	exports.Middleware = Middleware;
	exports.Scene = Scene;
	exports.Sprites = Sprites;

})));
//# sourceMappingURL=animationvideo.umd.js.map
