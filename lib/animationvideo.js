(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("AnimationVideo", [], factory);
	else if(typeof exports === 'object')
		exports["AnimationVideo"] = factory();
	else
		root["AnimationVideo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 36);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = calc;
function calc(c) {
	for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		params[_key - 1] = arguments[_key];
	}

	return typeof c === "function" ? c.apply(null, params) : c;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = ifNull;
function ifNull(value, alternative) {
	return typeof value === "undefined" || value === null || value === "" ? alternative : value;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var degToRad = 0.017453292519943295; //Math.PI / 180;

// Sprite
// Draw a Circle

var Circle = function () {
  function Circle(params) {
    _classCallCheck(this, Circle);

    // Position
    this.x = (0, _ifnull2.default)((0, _calc2.default)(params.x), 0);
    this.y = (0, _ifnull2.default)((0, _calc2.default)(params.y), 0);
    // rotation
    this.arc = (0, _ifnull2.default)((0, _calc2.default)(params.arc), 0);
    // Scale
    this.scaleX = (0, _ifnull2.default)((0, _calc2.default)(params.scaleX), 1);
    this.scaleY = (0, _ifnull2.default)((0, _calc2.default)(params.scaleY), 1);
    // Alpha
    this.a = (0, _ifnull2.default)((0, _calc2.default)(params.a), 1);
    // Alphamode
    this.alphaMode = (0, _ifnull2.default)((0, _calc2.default)(params.alphaMode), "source-over");
    // Color
    this.color = (0, _ifnull2.default)((0, _calc2.default)(params.color), "#fff");
    // Animation
    this.animation = (0, _calc2.default)(params.animation);
    // Sprite active
    this.enabled = (0, _ifnull2.default)((0, _calc2.default)(params.enabled), true);
  }

  _createClass(Circle, [{
    key: 'changeAnimationStatus',
    value: function changeAnimationStatus(ani) {
      if (_typeof(this.animation) === "object") {
        this.animation.changeAnimationStatus(ani);
      }
    }
  }, {
    key: 'animate',


    // Animation-Funktion
    value: function animate(timepassed) {
      if (_typeof(this.animation) === "object") {
        // run animation
        if (this.animation.run(this, timepassed, true) >= 0) {
          // disable
          this.enabled = false;
          return true;
        }
      }

      return false;
    }
  }, {
    key: 'draw',


    // Draw-Funktion
    value: function draw(context, additionalModifier) {
      if (this.enabled) {
        var a = this.a;
        if (additionalModifier) {
          a *= additionalModifier.a;
        }
        context.globalCompositeOperation = this.alphaMode;
        context.globalAlpha = a;
        context.save();
        context.translate(this.x, this.y);
        context.scale(this.scaleX, this.scaleY);
        context.beginPath();
        context.arc(0, 0, 1, (90 + this.arc) * degToRad, (450 - this.arc) * degToRad, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
        context.restore();
      }
    }
  }]);

  return Circle;
}();

exports.default = Circle;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(14),
    getRawTag = __webpack_require__(42),
    objectToString = __webpack_require__(43);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isString = __webpack_require__(40);

var _isString2 = _interopRequireDefault(_isString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageManager = function () {
  function ImageManager() {
    _classCallCheck(this, ImageManager);
  }

  _createClass(ImageManager, null, [{
    key: "add",
    value: function add(Images, Callbacks) {
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
          };
          self.Images[i].src = Images[i];
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
      return self;
    }
  }, {
    key: "reset",
    value: function reset() {
      var self = this || ImageManager;
      self.Images = {};
      self.count = 0;
      self.loaded = 0;
      return self;
    }
  }, {
    key: "getLoaded",
    value: function getLoaded() {
      return (this || ImageManager).loaded;
    }
  }, {
    key: "getCount",
    value: function getCount() {
      return (this || ImageManager).count;
    }
  }, {
    key: "isLoaded",
    value: function isLoaded() {
      var self = this || ImageManager;
      return self.loaded === self.count;
    }
  }, {
    key: "getImage",
    value: function getImage(nameOrImage) {
      return (0, _isString2.default)(nameOrImage) ? (this || ImageManager).Images[nameOrImage] : nameOrImage;
    }
  }]);

  return ImageManager;
}();

ImageManager.Images = {};
ImageManager.count = 0;
ImageManager.loaded = 0;

exports.default = ImageManager;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _Circle2 = __webpack_require__(2);

var _Circle3 = _interopRequireDefault(_Circle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var degToRad = 0.017453292519943295; //Math.PI / 180;

var Group = function (_Circle) {
  _inherits(Group, _Circle);

  function Group(params) {
    _classCallCheck(this, Group);

    // Sprite
    var _this = _possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).call(this, params));

    _this.sprite = (0, _ifnull2.default)(params.sprite, []);
    return _this;
  }

  // overwrite changeAnimationStatus


  _createClass(Group, [{
    key: 'changeAnimationStatus',
    value: function changeAnimationStatus(ani) {
      // call super
      _get(Group.prototype.__proto__ || Object.getPrototypeOf(Group.prototype), 'changeAnimationStatus', this).call(this, ani);
      // changeAnimationStatus for all sprites
      for (var i in this.sprite) {
        this.sprite[i].changeAnimationStatus(ani);
      }
    }

    // overwrite change

  }, {
    key: 'animate',
    value: function animate(timepassed) {
      // call super
      var finished = _get(Group.prototype.__proto__ || Object.getPrototypeOf(Group.prototype), 'animate', this).call(this, timepassed),
          spriteFinished = true;
      // animate all sprites
      if (this.enabled) {
        for (var i in this.sprite) {
          spriteFinished = this.sprite[i].animate(timepassed) && spriteFinished;
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
    }

    // draw-methode

  }, {
    key: 'draw',
    value: function draw(context, additionalModifier) {
      if (this.enabled) {
        if (!additionalModifier) {
          if (this.a < 1) {
            additionalModifier = {
              a: this.a
            };
          }
        }

        context.save();
        context.translate(this.x, this.y);
        context.scale(this.scaleX, this.scaleY);
        context.rotate(this.arc * degToRad);
        // draw all sprites
        for (var i in this.sprite) {
          this.sprite[i].draw(context, additionalModifier);
        }
        context.restore();
      }
    }
  }]);

  return Group;
}(_Circle3.default);

exports.default = Group;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sequence = function () {
  function Sequence(loop, timeShift, obj) {
    _classCallCheck(this, Sequence);

    this.loop = loop;
    // Timeshift - put the sprite into the future
    this.timeShift = (0, _ifnull2.default)(timeShift, 0);
    // Animations
    this.animation = obj || {};
    // init position-array
    this.animationPosition = {};
    for (var i in this.animation) {
      this.animationPosition[i] = {
        position: 0,
        timelapsed: (0, _calc2.default)(this.timeShift),
        object: (0, _calc2.default)(this.animation[i][0]),
        loop: (typeof loop === 'undefined' ? 'undefined' : _typeof(loop)) === "object" ? (0, _calc2.default)(loop[i]) : (0, _calc2.default)(loop),
        enabled: !((typeof loop === 'undefined' ? 'undefined' : _typeof(loop)) === "object" && (0, _calc2.default)(loop[i]) === false || (0, _calc2.default)(loop) === false)
      };
    }
    // init time
    this.last_timestamp = 0;

    this.hide_vote = false;
  }

  _createClass(Sequence, [{
    key: 'setObject',
    value: function setObject(i) {
      if (this.animationPosition[i].position < this.animation[i].length && this.animation[i][this.animationPosition[i].position] !== null) {
        if (typeof this.animation[i][this.animationPosition[i].position] === "function") {
          this.animationPosition[i].object = this.animation[i][this.animationPosition[i].position]();
        } else {
          this.animationPosition[i].object = this.animation[i][this.animationPosition[i].position];

          // Reset animation if possible
          if (typeof this.animationPosition[i].object.reset === "function") {
            this.animationPosition[i].object.reset();
          }
        }
      } else {
        // No object left
        this.animationPosition[i].object = null;
      }
    }
  }, {
    key: 'changeAnimationStatus',
    value: function changeAnimationStatus(ani) {
      var i = void 0;
      // set new parameter
      for (i in ani) {
        if (_typeof(this.animationPosition[i]) === "object") {
          if (ani[i].position !== null) {
            this.animationPosition[i].position = ani[i].position;
          }
          if (ani[i].loop !== null) {
            this.animationPosition[i].loop = ani[i].loop;
            this.animationPosition[i].enabled = !(ani[i].loop === false);
          }
          if (ani[i].timelapsed !== null) {
            this.animationPosition[i].timelapsed = ani[i].timelapsed;
          }
          this.setObject(i);
        }
      }

      // search for additional animations
      for (i in this.animation) {
        if (_typeof(this.animationPosition[i]) === "object" && this.animationPosition[i].object instanceof Sequence) {
          this.animationPosition[i].object.changeAnimationStatus(ani);
        }
      }
    }
  }, {
    key: 'run',


    // call other animations
    value: function run(sprite, time, is_difference) {
      // Calculate timedifference
      var timepassed = time,

      // Vote to disable the sprite
      disable_vote = 0,
          hide_vote = 0,
          animation_count = 0,

      // Loop variables
      timeleft = 0,
          current_animationPosition = null;

      if (!is_difference) {
        timepassed = time - this.last_timestamp;
        this.last_timestamp = time;
      }

      for (var i in this.animation) {
        animation_count++;
        current_animationPosition = this.animationPosition[i];
        if (current_animationPosition.enabled === true) {
          timeleft = timepassed;
          // Valid animation avaible?
          if (current_animationPosition.object === null) {
            disable_vote++;
            hide_vote++;
            timeleft = 0;
          } else {
            if (timeleft > 0) {
              while (timeleft > 0) {
                // New time-position in the animation
                current_animationPosition.timelapsed += timeleft;

                // Don't ran future animations
                if (current_animationPosition.timelapsed >= 0) {
                  // Do the animation
                  timeleft = current_animationPosition.object.run(sprite, current_animationPosition.timelapsed);

                  if (timeleft === Sequence.TIMELAPSE_TO_FORCE_DISABLE) {
                    return timepassed;
                  } else if (timeleft === Sequence.TIMELAPSE_TO_STOP) {
                    // reset current animation for the future
                    current_animationPosition.timelapsed = 0;
                    // create next obj
                    this.setObject(i);
                    // set object to null, so it disable votes every time
                    current_animationPosition.object = null;
                    disable_vote++;
                    timeleft = 0;
                  } else if (timeleft >= 0) {
                    // yes, next animation
                    current_animationPosition.position++;
                    // loop animation?
                    if (current_animationPosition.position >= this.animation[i].length) {
                      if (current_animationPosition.loop !== true) {
                        current_animationPosition.loop--;
                      }
                      if (current_animationPosition.loop) {
                        current_animationPosition.position = current_animationPosition.position % this.animation[i].length;
                      } else {
                        current_animationPosition.enabled = false;
                      }
                    }
                    // start from the beginning
                    current_animationPosition.timelapsed = 0;
                    // create next obj
                    this.setObject(i);

                    if (!current_animationPosition.enabled) {
                      current_animationPosition.object = null;
                      current_animationPosition.enabled = true;
                    }

                    if (current_animationPosition.object === null) {
                      disable_vote++;
                      timeleft = 0;
                    }
                  }
                } else {
                  timeleft = 0;
                  hide_vote++;
                }
              }
            } else {
              hide_vote++;
            }
          }
        }
      }

      if (animation_count > 0) {
        // Vote successful?
        if (disable_vote === animation_count) {
          // disable
          return timepassed;
        }

        // Vote successful?
        if (sprite.enabled && hide_vote === animation_count) {
          // disable
          sprite.enabled = false;
          this.hide_vote = true;
        } else if (this.hide_vote && hide_vote !== animation_count) {
          this.hide_vote = false;
          sprite.enabled = true;
        }
      }

      return -1;
    }
  }]);

  return Sequence;
}();

Sequence.TIMELAPSE_TO_FORCE_DISABLE = null;
Sequence.TIMELAPSE_TO_STOP = false;

exports.default = Sequence;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ImageManager = __webpack_require__(6);

var _ImageManager2 = _interopRequireDefault(_ImageManager);

var _isNumber = __webpack_require__(16);

var _isNumber2 = _interopRequireDefault(_isNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scene = function () {
  function Scene(endTime) {
    _classCallCheck(this, Scene);

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
  }

  _createClass(Scene, [{
    key: 'currentTime',
    value: function currentTime() {
      return Date.now();
    }
  }, {
    key: 'init',
    value: function init(callbackOrImages) {
      if (typeof callbackOrImages === 'function') {
        this.initCallback = callbackOrImages;
      } else {
        _ImageManager2.default.add(callbackOrImages);
      }
      return this;
    }
  }, {
    key: 'callInit',
    value: function callInit(output, parameter, engine) {
      this.initCallback && this.initCallback(output, parameter);

      this.engine = engine;
    }
  }, {
    key: 'destroy',
    value: function destroy(callback) {
      this.destroyCallback = callback;
      return this;
    }
  }, {
    key: 'scene',
    value: function scene(callback) {
      this.sceneCallback = callback;
      return this;
    }
  }, {
    key: 'callDestroy',
    value: function callDestroy(output) {
      if (this.destroyCallback) {
        return this.destroyCallback(output);
      } else {
        return true;
      }
    }
  }, {
    key: 'loadingscreen',
    value: function loadingscreen(output, progress) {
      var ctx = output.context,
          loadedHeight = Math.max(1, progress * output.h);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, output.w, output.h);
      ctx.fillStyle = "#aaa";
      ctx.fillRect(0, output.h / 2 - loadedHeight / 2, output.w, loadedHeight);
      ctx.font = "20px Georgia";
      ctx.fillStyle = "#fff";
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      var text = progress;

      if ((0, _isNumber2.default)(progress)) {
        text = "Loading " + Math.round(100 * progress) + "%";
      }
      ctx.fillText(text, 10 + Math.random() * 3, output.h - 10 + Math.random() * 3);

      this.engine && this.engine.normalizeContext(ctx);
    }
  }, {
    key: 'loading',
    value: function loading(callbackOrBool) {
      if (typeof callback === 'function') {
        this.loadingCallback = callback;
        this.loadingShow = true;
      } else {
        this.loadingCallback = null;
        this.loadingShow = !!callbackOrBool;
      }
      return this;
    }
  }, {
    key: 'callLoading',
    value: function callLoading(output) {
      var imagePercentage = _ImageManager2.default.getCount() && _ImageManager2.default.getLoaded() < _ImageManager2.default.getCount() && _ImageManager2.default.getLoaded() / _ImageManager2.default.getCount();

      if (this.loadingShow) {
        if (this.loadingCallback) {
          var result = this.loadingCallback(output, imagePercentage);
          if (result === null) {
            return false;
          } else if (result !== true) {
            this.loadingscreen(output, result ? result : imagePercentage || 'Loading...');
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
  }, {
    key: 'move',
    value: function move(output, timepassed) {
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

      var l = void 0,
          i = void 0,
          lay = void 0,
          layif = void 0;

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
  }, {
    key: 'draw',
    value: function draw(output) {
      var l = void 0,
          i = void 0,
          lay = void 0,
          layif = void 0;

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
            } else {
              this.layer[l][i].draw(output.context);
            }
          }
        }
      }
    }
  }, {
    key: 'calcLayerIsFunction',
    value: function calcLayerIsFunction() {
      this._cacheLayerIsFunction = new Array(this.layer.length);
      for (var l in this.layer) {
        this._cacheLayerIsFunction[l] = new Array(this.layer[l].length);
        for (var i in this.layer[l]) {
          this._cacheLayerIsFunction[l][i] = typeof this.layer[l][i] === "function";
        }
      }
    }
  }, {
    key: 'reset',
    value: function reset(output) {
      this.layer = this.sceneCallback(output, []);
      this.calcLayerIsFunction();
    }
  }]);

  return Scene;
}();

exports.default = Scene;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(15);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(27),
    isLength = __webpack_require__(30);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

function bounceOut(t) {
  var a = 4.0 / 11.0
  var b = 8.0 / 11.0
  var c = 9.0 / 10.0

  var ca = 4356.0 / 361.0
  var cb = 35442.0 / 1805.0
  var cc = 16061.0 / 1805.0

  var t2 = t * t

  return t < a
    ? 7.5625 * t2
    : t < b
      ? 9.075 * t2 - 9.9 * t + 3.4
      : t < c
        ? ca * t2 - cb * t + cc
        : 10.8 * t * t - 20.52 * t + 10.72
}

module.exports = bounceOut

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(10);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(41)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(4),
    isObjectLike = __webpack_require__(5);

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && baseGetTag(value) == numberTag);
}

module.exports = isNumber;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Default = __webpack_require__(9);

var _Default2 = _interopRequireDefault(_Default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SceneAudio = function (_Scene) {
  _inherits(SceneAudio, _Scene);

  function SceneAudio(audioElement) {
    _classCallCheck(this, SceneAudio);

    var _this = _possibleConstructorReturn(this, (SceneAudio.__proto__ || Object.getPrototypeOf(SceneAudio)).call(this));

    _this.audioStartTime = null;
    _this.audioPosition = null;
    _this.enableAndroidHack = false;
    _this.audioElement = audioElement;
    return _this;
  }

  _createClass(SceneAudio, [{
    key: 'currentTime',
    value: function currentTime() {
      var currentTime = _get(SceneAudio.prototype.__proto__ || Object.getPrototypeOf(SceneAudio.prototype), 'currentTime', this).call(this);
      if (this.audioElement) {
        // Android workaround
        if (this.enableAndroidHack) {
          if (this.audioStartTime === null) {
            this.audioStartTime = currentTime;
            this.audioPosition = this.audioElement.currentTime;
            return this.audioElement.currentTime * 1000;
          } else {
            if (this.audioElement.controller.playbackState === 'playing') {
              if (this.audioElement.currentTime === this.audioPosition) {
                return this.audioPosition * 1000 + Math.min(260, currentTime - this.audioStartTime);
              } else if (this.audioElement.currentTime - this.audioPosition < 0.5 && this.audioElement.currentTime > this.audioPosition && currentTime - this.audioStartTime < 350) {
                this.audioStartTime = this.audioStartTime + (this.audioElement.currentTime - this.audioPosition) * 1000;
                this.audioPosition = this.audioElement.currentTime;
                return this.audioPosition * 1000 + currentTime - this.audioStartTime;
              }
            }
            this.audioStartTime = currentTime;
            this.audioPosition = this.audioElement.currentTime;
            return this.audioPosition * 1000;
          }
        } else {
          return this.audioElement.currentTime * 1000;
        }
      } else {
        return currentTime;
      }
    }
  }, {
    key: 'init',
    value: function init() {
      var _get2;

      // init audio
      if (this.audioElement) {
        var canPlayType = this.audioElement.canPlayType("audio/mp3");
        if (canPlayType.match(/maybe|probably/i)) {}
        //this.audioshift = 1500;

        // Android hack
        if (typeof MediaController === 'function') {
          this.audioElement.controller = new MediaController();
          this.enableAndroidHack = true;
        }
        this.audioElement.preload = "auto";
        this.audioElement.load();
      }

      for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
        arg[_key] = arguments[_key];
      }

      return (_get2 = _get(SceneAudio.prototype.__proto__ || Object.getPrototypeOf(SceneAudio.prototype), 'init', this)).call.apply(_get2, [this].concat(arg));
    }
  }, {
    key: 'callLoading',
    value: function callLoading(output) {
      var loaded = _get(SceneAudio.prototype.__proto__ || Object.getPrototypeOf(SceneAudio.prototype), 'callLoading', this).call(this, output);

      if (loaded && this.audioElement) {
        if (!(this.audioElement.readyState >= this.audioElement.HAVE_ENOUGH_DATA)) {
          this.loadingscreen(output, "Waiting for Audio");
          return false;
        } else {
          this.audioElement.play();
          this.loadingscreen(output, "Click to play");
        }
      }

      return loaded;
    }
  }]);

  return SceneAudio;
}(_Default2.default);

exports.default = SceneAudio;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _Group2 = __webpack_require__(7);

var _Group3 = _interopRequireDefault(_Group2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Emitter = function (_Group) {
    _inherits(Emitter, _Group);

    function Emitter(params) {
        _classCallCheck(this, Emitter);

        var _this = _possibleConstructorReturn(this, (Emitter.__proto__ || Object.getPrototypeOf(Emitter)).call(this, params.self || {}));

        var staticArray = {},
            functionArray = {};

        for (var i in params) {
            if (['self', 'class', 'count'].indexOf(i) === -1) {
                if (typeof params[i] === 'function') {
                    functionArray[i] = params[i];
                } else {
                    staticArray[i] = params[i];
                }
            }
        }

        // add the letters
        var count = (0, _ifnull2.default)((0, _calc2.default)(params.count), 1);
        _this.sprite = [];

        for (var _i = 0; _i < count; _i++) {
            var classToEmit = params.class,
                parameter = {};
            for (var index in staticArray) {
                parameter[index] = staticArray[index];
            }
            for (var _index in functionArray) {
                parameter[_index] = functionArray[_index].call(null, _i);
            }
            _this.sprite[_i] = new classToEmit(parameter);
        }
        return _this;
    }

    return Emitter;
}(_Group3.default);

exports.default = Emitter;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _Circle2 = __webpack_require__(2);

var _Circle3 = _interopRequireDefault(_Circle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var degToRad = 0.017453292519943295; //Math.PI / 180;

var Text = function (_Circle) {
  _inherits(Text, _Circle);

  function Text(params) {
    _classCallCheck(this, Text);

    // Sprite
    var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, params));

    _this.text = (0, _calc2.default)(params.text);
    // font
    _this.font = (0, _ifnull2.default)((0, _calc2.default)(params.font), '26px monospace');
    // position
    _this.position = (0, _ifnull2.default)((0, _calc2.default)(params.position), Text.CENTER);

    _this.color = (0, _calc2.default)(params.color);
    _this.borderColor = (0, _calc2.default)(params.borderColor);
    _this.lineWidth = (0, _ifnull2.default)((0, _calc2.default)(params.lineWidth), 1);
    return _this;
  }

  // draw-methode


  _createClass(Text, [{
    key: 'draw',
    value: function draw(context, additionalModifier) {
      if (this.enabled) {
        var a = this.a;
        if (additionalModifier) {
          a *= additionalModifier.a;
        }
        context.globalCompositeOperation = this.alphaMode;
        context.globalAlpha = a;
        context.save();
        if (Text.LEFT_TOP) {
          context.textAlign = 'left';
          context.textBaseline = 'top';
        }
        context.translate(this.x, this.y);
        context.scale(this.scaleX, this.scaleY);
        context.rotate(this.arc * degToRad);
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
    }
  }]);

  return Text;
}(_Circle3.default);

// const


Text.LEFT_TOP = 0;
Text.CENTER = 1;

exports.default = Text;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var colorString = __webpack_require__(53);
var convert = __webpack_require__(56);

var _slice = [].slice;

var skippedModels = [
	// to be honest, I don't really feel like keyword belongs in color convert, but eh.
	'keyword',

	// gray conflicts with some method names, and has its own method defined.
	'gray',

	// shouldn't really be in color-convert either...
	'hex'
];

var hashedModelKeys = {};
Object.keys(convert).forEach(function (model) {
	hashedModelKeys[_slice.call(convert[model].labels).sort().join('')] = model;
});

var limiters = {};

function Color(obj, model) {
	if (!(this instanceof Color)) {
		return new Color(obj, model);
	}

	if (model && model in skippedModels) {
		model = null;
	}

	if (model && !(model in convert)) {
		throw new Error('Unknown model: ' + model);
	}

	var i;
	var channels;

	if (!obj) {
		this.model = 'rgb';
		this.color = [0, 0, 0];
		this.valpha = 1;
	} else if (obj instanceof Color) {
		this.model = obj.model;
		this.color = obj.color.slice();
		this.valpha = obj.valpha;
	} else if (typeof obj === 'string') {
		var result = colorString.get(obj);
		if (result === null) {
			throw new Error('Unable to parse color from string: ' + obj);
		}

		this.model = result.model;
		channels = convert[this.model].channels;
		this.color = result.value.slice(0, channels);
		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
	} else if (obj.length) {
		this.model = model || 'rgb';
		channels = convert[this.model].channels;
		var newArr = _slice.call(obj, 0, channels);
		this.color = zeroArray(newArr, channels);
		this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
	} else if (typeof obj === 'number') {
		// this is always RGB - can be converted later on.
		obj &= 0xFFFFFF;
		this.model = 'rgb';
		this.color = [
			(obj >> 16) & 0xFF,
			(obj >> 8) & 0xFF,
			obj & 0xFF
		];
		this.valpha = 1;
	} else {
		this.valpha = 1;

		var keys = Object.keys(obj);
		if ('alpha' in obj) {
			keys.splice(keys.indexOf('alpha'), 1);
			this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
		}

		var hashedKeys = keys.sort().join('');
		if (!(hashedKeys in hashedModelKeys)) {
			throw new Error('Unable to parse color from object: ' + JSON.stringify(obj));
		}

		this.model = hashedModelKeys[hashedKeys];

		var labels = convert[this.model].labels;
		var color = [];
		for (i = 0; i < labels.length; i++) {
			color.push(obj[labels[i]]);
		}

		this.color = zeroArray(color);
	}

	// perform limitations (clamping, etc.)
	if (limiters[this.model]) {
		channels = convert[this.model].channels;
		for (i = 0; i < channels; i++) {
			var limit = limiters[this.model][i];
			if (limit) {
				this.color[i] = limit(this.color[i]);
			}
		}
	}

	this.valpha = Math.max(0, Math.min(1, this.valpha));

	if (Object.freeze) {
		Object.freeze(this);
	}
}

Color.prototype = {
	toString: function () {
		return this.string();
	},

	toJSON: function () {
		return this[this.model]();
	},

	string: function (places) {
		var self = this.model in colorString.to ? this : this.rgb();
		self = self.round(typeof places === 'number' ? places : 1);
		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to[self.model](args);
	},

	percentString: function (places) {
		var self = this.rgb().round(typeof places === 'number' ? places : 1);
		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to.rgb.percent(args);
	},

	array: function () {
		return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
	},

	object: function () {
		var result = {};
		var channels = convert[this.model].channels;
		var labels = convert[this.model].labels;

		for (var i = 0; i < channels; i++) {
			result[labels[i]] = this.color[i];
		}

		if (this.valpha !== 1) {
			result.alpha = this.valpha;
		}

		return result;
	},

	unitArray: function () {
		var rgb = this.rgb().color;
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;

		if (this.valpha !== 1) {
			rgb.push(this.valpha);
		}

		return rgb;
	},

	unitObject: function () {
		var rgb = this.rgb().object();
		rgb.r /= 255;
		rgb.g /= 255;
		rgb.b /= 255;

		if (this.valpha !== 1) {
			rgb.alpha = this.valpha;
		}

		return rgb;
	},

	round: function (places) {
		places = Math.max(places || 0, 0);
		return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
	},

	alpha: function (val) {
		if (arguments.length) {
			return new Color(this.color.concat(Math.max(0, Math.min(1, val))), this.model);
		}

		return this.valpha;
	},

	// rgb
	red: getset('rgb', 0, maxfn(255)),
	green: getset('rgb', 1, maxfn(255)),
	blue: getset('rgb', 2, maxfn(255)),

	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, function (val) { return ((val % 360) + 360) % 360; }), // eslint-disable-line brace-style

	saturationl: getset('hsl', 1, maxfn(100)),
	lightness: getset('hsl', 2, maxfn(100)),

	saturationv: getset('hsv', 1, maxfn(100)),
	value: getset('hsv', 2, maxfn(100)),

	chroma: getset('hcg', 1, maxfn(100)),
	gray: getset('hcg', 2, maxfn(100)),

	white: getset('hwb', 1, maxfn(100)),
	wblack: getset('hwb', 2, maxfn(100)),

	cyan: getset('cmyk', 0, maxfn(100)),
	magenta: getset('cmyk', 1, maxfn(100)),
	yellow: getset('cmyk', 2, maxfn(100)),
	black: getset('cmyk', 3, maxfn(100)),

	x: getset('xyz', 0, maxfn(100)),
	y: getset('xyz', 1, maxfn(100)),
	z: getset('xyz', 2, maxfn(100)),

	l: getset('lab', 0, maxfn(100)),
	a: getset('lab', 1),
	b: getset('lab', 2),

	keyword: function (val) {
		if (arguments.length) {
			return new Color(val);
		}

		return convert[this.model].keyword(this.color);
	},

	hex: function (val) {
		if (arguments.length) {
			return new Color(val);
		}

		return colorString.to.hex(this.rgb().round().color);
	},

	rgbNumber: function () {
		var rgb = this.rgb().color;
		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
	},

	luminosity: function () {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		var rgb = this.rgb().color;

		var lum = [];
		for (var i = 0; i < rgb.length; i++) {
			var chan = rgb[i] / 255;
			lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
		}

		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast: function (color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		var lum1 = this.luminosity();
		var lum2 = color2.luminosity();

		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}

		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level: function (color2) {
		var contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7.1) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	dark: function () {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		var rgb = this.rgb().color;
		var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		return yiq < 128;
	},

	light: function () {
		return !this.dark();
	},

	negate: function () {
		var rgb = this.rgb();
		for (var i = 0; i < 3; i++) {
			rgb.color[i] = 255 - rgb.color[i];
		}
		return rgb;
	},

	lighten: function (ratio) {
		var hsl = this.hsl();
		hsl.color[2] += hsl.color[2] * ratio;
		return hsl;
	},

	darken: function (ratio) {
		var hsl = this.hsl();
		hsl.color[2] -= hsl.color[2] * ratio;
		return hsl;
	},

	saturate: function (ratio) {
		var hsl = this.hsl();
		hsl.color[1] += hsl.color[1] * ratio;
		return hsl;
	},

	desaturate: function (ratio) {
		var hsl = this.hsl();
		hsl.color[1] -= hsl.color[1] * ratio;
		return hsl;
	},

	whiten: function (ratio) {
		var hwb = this.hwb();
		hwb.color[1] += hwb.color[1] * ratio;
		return hwb;
	},

	blacken: function (ratio) {
		var hwb = this.hwb();
		hwb.color[2] += hwb.color[2] * ratio;
		return hwb;
	},

	grayscale: function () {
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		var rgb = this.rgb().color;
		var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		return Color.rgb(val, val, val);
	},

	fade: function (ratio) {
		return this.alpha(this.valpha - (this.valpha * ratio));
	},

	opaquer: function (ratio) {
		return this.alpha(this.valpha + (this.valpha * ratio));
	},

	rotate: function (degrees) {
		var hsl = this.hsl();
		var hue = hsl.color[0];
		hue = (hue + degrees) % 360;
		hue = hue < 0 ? 360 + hue : hue;
		hsl.color[0] = hue;
		return hsl;
	},

	mix: function (mixinColor, weight) {
		// ported from sass implementation in C
		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
		var color1 = this.rgb();
		var color2 = mixinColor.rgb();
		var p = weight === undefined ? 0.5 : weight;

		var w = 2 * p - 1;
		var a = color1.alpha() - color2.alpha();

		var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
		var w2 = 1 - w1;

		return Color.rgb(
				w1 * color1.red() + w2 * color2.red(),
				w1 * color1.green() + w2 * color2.green(),
				w1 * color1.blue() + w2 * color2.blue(),
				color1.alpha() * p + color2.alpha() * (1 - p));
	}
};

// model conversion methods and static constructors
Object.keys(convert).forEach(function (model) {
	if (skippedModels.indexOf(model) !== -1) {
		return;
	}

	var channels = convert[model].channels;

	// conversion methods
	Color.prototype[model] = function () {
		if (this.model === model) {
			return new Color(this);
		}

		if (arguments.length) {
			return new Color(arguments, model);
		}

		var newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
		return new Color(assertArray(convert[this.model][model].raw(this.color)).concat(newAlpha), model);
	};

	// 'static' construction methods
	Color[model] = function (color) {
		if (typeof color === 'number') {
			color = zeroArray(_slice.call(arguments), channels);
		}
		return new Color(color, model);
	};
});

function roundTo(num, places) {
	return Number(num.toFixed(places));
}

function roundToPlace(places) {
	return function (num) {
		return roundTo(num, places);
	};
}

function getset(model, channel, modifier) {
	model = Array.isArray(model) ? model : [model];

	model.forEach(function (m) {
		(limiters[m] || (limiters[m] = []))[channel] = modifier;
	});

	model = model[0];

	return function (val) {
		var result;

		if (arguments.length) {
			if (modifier) {
				val = modifier(val);
			}

			result = this[model]();
			result.color[channel] = val;
			return result;
		}

		result = this[model]().color[channel];
		if (modifier) {
			result = modifier(result);
		}

		return result;
	};
}

function maxfn(max) {
	return function (v) {
		return Math.max(0, Math.min(max, v));
	};
}

function assertArray(val) {
	return Array.isArray(val) ? val : [val];
}

function zeroArray(arr, length) {
	for (var i = 0; i < length; i++) {
		if (typeof arr[i] !== 'number') {
			arr[i] = 0;
		}
	}

	return arr;
}

module.exports = Color;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var cssKeywords = __webpack_require__(21);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

var reverseKeywords = {};
for (var key in cssKeywords) {
	if (cssKeywords.hasOwnProperty(key)) {
		reverseKeywords[cssKeywords[key]] = key;
	}
}

var convert = module.exports = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

// hide .channels and .labels properties
for (var model in convert) {
	if (convert.hasOwnProperty(model)) {
		if (!('channels' in convert[model])) {
			throw new Error('missing channels property: ' + model);
		}

		if (!('labels' in convert[model])) {
			throw new Error('missing channel labels property: ' + model);
		}

		if (convert[model].labels.length !== convert[model].channels) {
			throw new Error('channel and label counts mismatch: ' + model);
		}

		var channels = convert[model].channels;
		var labels = convert[model].labels;
		delete convert[model].channels;
		delete convert[model].labels;
		Object.defineProperty(convert[model], 'channels', {value: channels});
		Object.defineProperty(convert[model], 'labels', {value: labels});
	}
}

convert.rgb.hsl = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var l;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var v;

	if (max === 0) {
		s = 0;
	} else {
		s = (delta / max * 1000) / 10;
	}

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	v = ((max / 255) * 1000) / 10;

	return [h, s, v];
};

convert.rgb.hwb = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var h = convert.rgb.hsl(rgb)[0];
	var w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var c;
	var m;
	var y;
	var k;

	k = Math.min(1 - r, 1 - g, 1 - b);
	c = (1 - r - k) / (1 - k) || 0;
	m = (1 - g - k) / (1 - k) || 0;
	y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

/**
 * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
 * */
function comparativeDistance(x, y) {
	return (
		Math.pow(x[0] - y[0], 2) +
		Math.pow(x[1] - y[1], 2) +
		Math.pow(x[2] - y[2], 2)
	);
}

convert.rgb.keyword = function (rgb) {
	var reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	var currentClosestDistance = Infinity;
	var currentClosestKeyword;

	for (var keyword in cssKeywords) {
		if (cssKeywords.hasOwnProperty(keyword)) {
			var value = cssKeywords[keyword];

			// Compute comparative distance
			var distance = comparativeDistance(rgb, value);

			// Check if its less, if so set as closest
			if (distance < currentClosestDistance) {
				currentClosestDistance = distance;
				currentClosestKeyword = keyword;
			}
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;

	// assume sRGB
	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	var xyz = convert.rgb.xyz(rgb);
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	var h = hsl[0] / 360;
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var t1;
	var t2;
	var t3;
	var rgb;
	var val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	t1 = 2 * l - t2;

	rgb = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}
		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	var h = hsl[0];
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var smin = s;
	var lmin = Math.max(l, 0.01);
	var sv;
	var v;

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	v = (l + s) / 2;
	sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	var h = hsv[0] / 60;
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var hi = Math.floor(h) % 6;

	var f = h - Math.floor(h);
	var p = 255 * v * (1 - s);
	var q = 255 * v * (1 - (s * f));
	var t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	var h = hsv[0];
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var vmin = Math.max(v, 0.01);
	var lmin;
	var sl;
	var l;

	l = (2 - s) * v;
	lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	var h = hwb[0] / 360;
	var wh = hwb[1] / 100;
	var bl = hwb[2] / 100;
	var ratio = wh + bl;
	var i;
	var v;
	var f;
	var n;

	// wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	i = Math.floor(6 * h);
	v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	n = wh + f * (v - wh); // linear interpolation

	var r;
	var g;
	var b;
	switch (i) {
		default:
		case 6:
		case 0: r = v; g = n; b = wh; break;
		case 1: r = n; g = v; b = wh; break;
		case 2: r = wh; g = v; b = n; break;
		case 3: r = wh; g = n; b = v; break;
		case 4: r = n; g = wh; b = v; break;
		case 5: r = v; g = wh; b = n; break;
	}

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	var c = cmyk[0] / 100;
	var m = cmyk[1] / 100;
	var y = cmyk[2] / 100;
	var k = cmyk[3] / 100;
	var r;
	var g;
	var b;

	r = 1 - Math.min(1, c * (1 - k) + k);
	g = 1 - Math.min(1, m * (1 - k) + k);
	b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	var x = xyz[0] / 100;
	var y = xyz[1] / 100;
	var z = xyz[2] / 100;
	var r;
	var g;
	var b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// assume sRGB
	r = r > 0.0031308
		? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var x;
	var y;
	var z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	var y2 = Math.pow(y, 3);
	var x2 = Math.pow(x, 3);
	var z2 = Math.pow(z, 3);
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var hr;
	var h;
	var c;

	hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	var l = lch[0];
	var c = lch[1];
	var h = lch[2];
	var a;
	var b;
	var hr;

	hr = h / 360 * 2 * Math.PI;
	a = c * Math.cos(hr);
	b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];
	var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	var ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];

	// we use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	var ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	var color = args % 10;

	// handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	var mult = (~~(args > 50) + 1) * 0.5;
	var r = ((color & 1) * mult) * 255;
	var g = (((color >> 1) & 1) * mult) * 255;
	var b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// handle greyscale
	if (args >= 232) {
		var c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	var rem;
	var r = Math.floor(args / 36) / 5 * 255;
	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	var b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	var integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	var colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(function (char) {
			return char + char;
		}).join('');
	}

	var integer = parseInt(colorString, 16);
	var r = (integer >> 16) & 0xFF;
	var g = (integer >> 8) & 0xFF;
	var b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var max = Math.max(Math.max(r, g), b);
	var min = Math.min(Math.min(r, g), b);
	var chroma = (max - min);
	var grayscale;
	var hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma + 4;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var c = 1;
	var f = 0;

	if (l < 0.5) {
		c = 2.0 * s * l;
	} else {
		c = 2.0 * s * (1.0 - l);
	}

	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;

	var c = s * v;
	var f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	var h = hcg[0] / 360;
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	var pure = [0, 0, 0];
	var hi = (h % 1) * 6;
	var v = hi % 1;
	var w = 1 - v;
	var mg = 0;

	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var v = c + g * (1.0 - c);
	var f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var l = g * (1.0 - c) + 0.5 * c;
	var s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;
	var v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	var w = hwb[1] / 100;
	var b = hwb[2] / 100;
	var v = 1 - b;
	var c = v - w;
	var g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = convert.gray.hsv = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
	var integer = (val << 16) + (val << 8) + val;

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _Circle2 = __webpack_require__(2);

var _Circle3 = _interopRequireDefault(_Circle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var degToRad = 0.017453292519943295; //Math.PI / 180;

// Sprite
// Draw a Circle

var Rect = function (_Circle) {
  _inherits(Rect, _Circle);

  function Rect(params) {
    _classCallCheck(this, Rect);

    // Size
    var _this = _possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this, params));

    _this.width = (0, _calc2.default)(params.width);
    _this.height = (0, _calc2.default)(params.height);

    _this.borderColor = (0, _calc2.default)(params.borderColor);
    _this.lineWidth = (0, _ifnull2.default)((0, _calc2.default)(params.lineWidth), 1);
    return _this;
  }

  // Draw-Funktion


  _createClass(Rect, [{
    key: 'draw',
    value: function draw(context, additionalModifier) {
      if (this.enabled) {
        if (!this.width) {
          this.width = context.canvas.width;
        }
        if (!this.height) {
          this.height = context.canvas.height;
        }
        var a = this.a;
        if (additionalModifier) {
          a *= additionalModifier.a;
        }
        context.globalCompositeOperation = this.alphaMode;
        context.globalAlpha = a;
        if (this.arc === 0) {
          context.fillStyle = this.color;
          context.fillRect(this.x, this.y, this.width, this.height);
          if (this.borderColor) {
            context.beginPath();
            context.lineWidth = this.lineWidth;
            context.strokeStyle = this.borderColor;
            context.rect(this.x, this.y, this.width, this.height);
            context.stroke();
          }
        } else {
          context.save();
          context.translate(this.x + this.width / 2, this.y + this.height / 2);
          context.rotate(this.arc * degToRad);
          context.fillStyle = this.color;
          context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
          if (this.borderColor) {
            context.beginPath();
            context.lineWidth = this.lineWidth;
            context.strokeStyle = this.borderColor;
            context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            context.stroke();
          }
          context.restore();
        }
      }
    }
  }]);

  return Rect;
}(_Circle3.default);

exports.default = Rect;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(25),
    eq = __webpack_require__(28);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(26);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(61);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(4),
    isObject = __webpack_require__(11);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _linear = __webpack_require__(35);

var _linear2 = _interopRequireDefault(_linear);

var _isArray = __webpack_require__(3);

var _isArray2 = _interopRequireDefault(_isArray);

var _color = __webpack_require__(20);

var _color2 = _interopRequireDefault(_color);

var _pasition = __webpack_require__(94);

var _pasition2 = _interopRequireDefault(_pasition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function moveDefault(progress, data) {
  return data.from + progress * data.delta;
}

function moveBezier(progress, data) {
  var copy = [].concat(_toConsumableArray(data.values)),
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
  return data.colorTo.mix(data.colorFrom, progress).string();
}

function movePath(progress, data, sprite) {
  return _pasition2.default._lerp(data.pathFrom, data.pathTo, progress);
}

// to values of a object

var ChangeTo = function () {
  function ChangeTo(changeValues, duration, ease) {
    _classCallCheck(this, ChangeTo);

    this.initialized = false;
    this.changeValues = [];
    for (var k in changeValues) {
      var value = changeValues[k],
          isColor = k === 'color',
          isPath = k === 'path',
          isFunction = typeof value === 'function',
          isBezier = !isColor && (0, _isArray2.default)(value);
      this.changeValues.push({
        name: k,
        to: isBezier ? value[value.length - 1] : (0, _calc2.default)(value, 1, {}),
        bezier: isBezier ? value : false,
        isColor: isColor,
        isPath: isPath,
        isFunction: isFunction ? value : false,
        moveAlgorithm: isColor ? moveColor : isPath ? movePath : isBezier ? moveBezier : moveDefault
      });
    }
    this.duration = (0, _ifnull2.default)((0, _calc2.default)(duration), 0);
    this.ease = (0, _ifnull2.default)(ease, _linear2.default);
  }

  _createClass(ChangeTo, [{
    key: 'reset',
    value: function reset() {
      this.initialized = false;
    }
  }, {
    key: 'init',
    value: function init(sprite, time) {
      var l = this.changeValues.length,
          data;
      while (l--) {
        data = this.changeValues[l];
        if (data.isFunction) {
          data.from = sprite[data.name];
          data.to = data.isFunction(data.from);
          if (data.isColor) {
            data.colorFrom = (0, _color2.default)(data.from);
            data.colorTo = (0, _color2.default)(data.to);
            data.moveAlgorithm = moveColor;
          } else if (data.isPath) {
            var _pasition$_preprocess = _pasition2.default._preprocessing(_pasition2.default.path2shapes(data.from), _pasition2.default.path2shapes(data.to));

            var _pasition$_preprocess2 = _slicedToArray(_pasition$_preprocess, 2);

            data.pathFrom = _pasition$_preprocess2[0];
            data.pathTo = _pasition$_preprocess2[1];

            data.moveAlgorithm = movePath;
          } else if ((0, _isArray2.default)(data.to)) {
            data.values = [sprite[data.name]].concat(_toConsumableArray(data.to));
            data.moveAlgorithm = moveBezier;
          } else {
            data.delta = data.to - data.from;
            data.moveAlgorithm = moveDefault;
          }
        } else if (data.isColor) {
          data.colorFrom = (0, _color2.default)(sprite[data.name]);
          data.colorTo = (0, _color2.default)(data.to);
        } else if (data.isPath) {
          var _pasition$_preprocess3 = _pasition2.default._preprocessing(_pasition2.default.path2shapes(sprite[data.name]), _pasition2.default.path2shapes(data.to));

          var _pasition$_preprocess4 = _slicedToArray(_pasition$_preprocess3, 2);

          data.pathFrom = _pasition$_preprocess4[0];
          data.pathTo = _pasition$_preprocess4[1];
        } else if (data.bezier) {
          data.values = [sprite[data.name]].concat(_toConsumableArray(data.bezier));
        } else {
          data.from = sprite[data.name];
          data.delta = data.to - data.from;
        }
      }
    }
  }, {
    key: 'run',
    value: function run(sprite, time) {
      if (!this.initialized) {
        this.initialized = true;
        this.init(sprite, time);
      }

      // return time left
      if (this.duration <= time) {
        var l = this.changeValues.length,
            data = void 0;

        // prevent round errors by applying end-data
        while (l--) {
          data = this.changeValues[l];
          sprite[data.name] = data.to;
        }
      } else {
        var _l = this.changeValues.length,
            progress = this.ease(time / this.duration),
            _data = void 0;

        while (_l--) {
          _data = this.changeValues[_l];
          sprite[_data.name] = _data.moveAlgorithm(progress, _data, sprite);
        }
      }
      return time - this.duration;
    }
  }]);

  return ChangeTo;
}();

exports.default = ChangeTo;

/***/ }),
/* 35 */
/***/ (function(module, exports) {

function linear(t) {
  return t
}

module.exports = linear

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(37);


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Easing = exports.Animations = exports.Sequence = exports.Sprites = exports.ImageManager = exports.Scenes = exports.Engine = undefined;

var _Engine2 = __webpack_require__(38);

var _Engine3 = _interopRequireDefault(_Engine2);

var _Scenes = __webpack_require__(39);

var _Scenes2 = _interopRequireDefault(_Scenes);

var _ImageManager = __webpack_require__(6);

var _ImageManager2 = _interopRequireDefault(_ImageManager);

var _Sprites = __webpack_require__(47);

var _Sprites2 = _interopRequireDefault(_Sprites);

var _Sequence2 = __webpack_require__(8);

var _Sequence3 = _interopRequireDefault(_Sequence2);

var _Animations = __webpack_require__(92);

var _Animations2 = _interopRequireDefault(_Animations);

var _eases = __webpack_require__(107);

var _eases2 = _interopRequireDefault(_eases);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Engine = function Engine() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(_Engine3.default, [null].concat(args)))();
},
    Sequence = function Sequence() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return new (Function.prototype.bind.apply(_Sequence3.default, [null].concat(args)))();
};

exports.Engine = Engine;
exports.Scenes = _Scenes2.default;
exports.ImageManager = _ImageManager2.default;
exports.Sprites = _Sprites2.default;
exports.Sequence = Sequence;
exports.Animations = _Animations2.default;
exports.Easing = _eases2.default;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Engine = function () {
  function Engine(canvas, scene, autoresize) {
    var _this = this;

    _classCallCheck(this, Engine);

    this._output = {
      canvas: null,
      context: null,
      w: 0,
      h: 0,
      ratio: 1
    };

    // the current _scene-object
    this._scene = null;
    // is a _scene ready for action?
    this._isSceneInitialized = false;
    // new _scene to initialize
    this._newScene = null;

    // time measurement
    this._lastTimestamp = 0;
    this._timePassed = 0;

    // reference to
    this._referenceRequestAnimationFrame = null;

    // data about the _output canvas
    this._output.canvas = canvas;
    if (!((typeof canvas === 'undefined' ? 'undefined' : _typeof(canvas)) === "object" && canvas !== null && canvas.getContext)) {
      throw 'No context';
    }
    this._output.context = canvas.getContext("2d");
    this._output.w = this._output.canvas.width;
    this._output.h = this._output.canvas.height;
    this._output.ratio = this._output.w / this._output.h;

    if (autoresize) {
      window.addEventListener('resize', this.maximizeCanvas, false);
      window.addEventListener('orientationchange', this.maximizeCanvas, false);
      this.resize();

      canvas.addEventListener('click', function () {
        if (_this._isSceneInitialized && _this._scene.audioElement) {
          _this._scene.audioElement.play();
        }
      }, false);
    }
    this.changeScene(scene);
    this.normalizeContext(this._output.context);
  }

  _createClass(Engine, [{
    key: 'normalizeContext',
    value: function normalizeContext(ctx) {
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this._output.w;
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this._output.h;
    }
  }, {
    key: 'maximizeCanvas',
    value: function maximizeCanvas() {
      var gameArea = self.output.canvas;
      var newWidth = window.innerWidth;
      var newHeight = window.innerHeight;
      var newWidthToHeight = newWidth / newHeight;

      if (newWidthToHeight > self.output.ratio) {
        newWidth = newHeight * self.output.ratio;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
      } else {
        newHeight = newWidth / self.output.ratio;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
      }

      gameArea.style.marginTop = -newHeight / 2 + 'px';
      gameArea.style.marginLeft = -newWidth / 2 + 'px';

      $(self.output.canvas).css({
        width: newWidth,
        height: newHeight
      });
      $(self.output.canvas).siblings().css({
        width: newWidth
      });
    }
  }, {
    key: 'changeScene',
    value: function changeScene(scene) {
      this._newScene = scene;
    }
  }, {
    key: 'loadingscreen',
    value: function loadingscreen() {
      var ctx = this._output.context;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, this._output.w, this._output.h);

      ctx.font = "20px Georgia";
      ctx.fillStyle = "#FFF";
      var percent = this._isSceneInitialized ? this._scene.getPercentLoaded() : 0;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText("Loading " + percent + "%", 10 + Math.random() * 3, this._output.h - 10 + Math.random() * 3);

      this.normalizeContext(ctx);
    }
  }, {
    key: 'run',
    value: function run(initParameter) {

      initParameter = initParameter || {};

      function mainLoop() {
        this._referenceRequestAnimationFrame = window.requestAnimationFrame(mainLoop.bind(this));

        if (this._newScene !== null) {
          var parameterForNewScene = this._scene ? this._scene.destroy(this._output) : initParameter;
          if (parameterForNewScene) {
            this._newScene.callInit(this._output, parameterForNewScene, this);
            this._scene = this._newScene;
            this._newScene = null;
            this._isSceneInitialized = false;
          }
        }

        var now = this._scene.currentTime();
        this._timePassed = now - this._lastTimestamp;
        this._lastTimestamp = now;

        if (this._isSceneInitialized) {
          if (this._timePassed !== 0) {
            this._scene.move(this._output, this._timePassed);

            // if timepassed is negativ scene will do a reset. timepassed have to be the full new time
            if (this._timePassed < 0) {
              this._timePassed = this._scene.totalTimePassed;
            }

            this._scene.draw(this._output);
          }
        } else {
          this._isSceneInitialized = this._scene.callLoading(this._output);
        }
      }

      // First call ever
      this._referenceRequestAnimationFrame = window.requestAnimationFrame(mainLoop.bind(this));
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this._referenceRequestAnimationFrame && window.cancelAnimationFrame(this._referenceRequestAnimationFrame);
      this._referenceRequestAnimationFrame = null;
    }
  }]);

  return Engine;
}();

exports.default = Engine;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Default2 = __webpack_require__(9);

var _Default3 = _interopRequireDefault(_Default2);

var _Audio2 = __webpack_require__(17);

var _Audio3 = _interopRequireDefault(_Audio2);

var _Norm2 = __webpack_require__(44);

var _Norm3 = _interopRequireDefault(_Norm2);

var _NormAudio2 = __webpack_require__(46);

var _NormAudio3 = _interopRequireDefault(_NormAudio2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Default = function Default() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(_Default3.default, [null].concat(args)))();
},
    Norm = function Norm() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return new (Function.prototype.bind.apply(_Norm3.default, [null].concat(args)))();
},
    NormAudio = function NormAudio() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return new (Function.prototype.bind.apply(_NormAudio3.default, [null].concat(args)))();
},
    Audio = function Audio() {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return new (Function.prototype.bind.apply(_Audio3.default, [null].concat(args)))();
};

exports.default = {
  Default: Default,
  Audio: Audio,
  Norm: Norm,
  NormAudio: NormAudio
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(4),
    isArray = __webpack_require__(3),
    isObjectLike = __webpack_require__(5);

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

module.exports = isString;


/***/ }),
/* 41 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(14);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 43 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Default = __webpack_require__(9);

var _Default2 = _interopRequireDefault(_Default);

var _transform = __webpack_require__(45);

var _transform2 = _interopRequireDefault(_transform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SceneNorm = function (_Scene) {
  _inherits(SceneNorm, _Scene);

  function SceneNorm(endTime) {
    _classCallCheck(this, SceneNorm);

    return _possibleConstructorReturn(this, (SceneNorm.__proto__ || Object.getPrototypeOf(SceneNorm)).call(this, endTime));
  }

  _createClass(SceneNorm, [{
    key: '_getViewport',
    value: function _getViewport() {
      if (!this.engine) return new _transform2.default();

      var wh = this.engine._output.w / 2,
          hh = this.engine._output.h / 2,
          scale = this.engine._output.ratio > 1 ? wh : hh;

      return new _transform2.default().translate(wh, hh).scale(scale, scale);

      // Maybe move a cam in the future
      //			output.context.scale(cam.zoom,cam.zoom);
      //			output.context.translate(-cam.centerX,-cam.centerY);
      //output.context.translate(-0.5,-0.5);
    }
  }, {
    key: 'transformPoint',
    value: function transformPoint(x, y) {
      return this._getViewport().invert().transformPoint(x, y);
    }
  }, {
    key: 'draw',
    value: function draw(output) {
      var _output$context;

      output.context.save();

      (_output$context = output.context).setTransform.apply(_output$context, _toConsumableArray(this._getViewport().m));

      _get(SceneNorm.prototype.__proto__ || Object.getPrototypeOf(SceneNorm.prototype), 'draw', this).call(this, output);
      output.context.restore();
    }
  }]);

  return SceneNorm;
}(_Default2.default);

exports.default = SceneNorm;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
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

exports.default = Transform;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Audio = __webpack_require__(17);

var _Audio2 = _interopRequireDefault(_Audio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SceneNormAudio = function (_SceneAudio) {
  _inherits(SceneNormAudio, _SceneAudio);

  function SceneNormAudio(audioElement) {
    _classCallCheck(this, SceneNormAudio);

    return _possibleConstructorReturn(this, (SceneNormAudio.__proto__ || Object.getPrototypeOf(SceneNormAudio)).call(this, audioElement));
  }

  _createClass(SceneNormAudio, [{
    key: 'draw',
    value: function draw(output) {
      output.context.save();
      output.context.translate(output.w / 2, output.h / 2);
      output.context.scale(output.w, output.h);

      // Maybe move a cam in the future
      //			output.context.scale(cam.zoom,cam.zoom);
      //			output.context.translate(-cam.centerX,-cam.centerY);
      output.context.translate(-0.5, -0.5);

      _get(SceneNormAudio.prototype.__proto__ || Object.getPrototypeOf(SceneNormAudio.prototype), 'draw', this).call(this, output);
      output.context.restore();
    }
  }]);

  return SceneNormAudio;
}(_Audio2.default);

exports.default = SceneNormAudio;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Callback2 = __webpack_require__(48);

var _Callback3 = _interopRequireDefault(_Callback2);

var _Canvas2 = __webpack_require__(49);

var _Canvas3 = _interopRequireDefault(_Canvas2);

var _Circle2 = __webpack_require__(2);

var _Circle3 = _interopRequireDefault(_Circle2);

var _Emitter2 = __webpack_require__(18);

var _Emitter3 = _interopRequireDefault(_Emitter2);

var _FastBlur2 = __webpack_require__(50);

var _FastBlur3 = _interopRequireDefault(_FastBlur2);

var _Group2 = __webpack_require__(7);

var _Group3 = _interopRequireDefault(_Group2);

var _Image2 = __webpack_require__(51);

var _Image3 = _interopRequireDefault(_Image2);

var _Text2 = __webpack_require__(19);

var _Text3 = _interopRequireDefault(_Text2);

var _Particle2 = __webpack_require__(52);

var _Particle3 = _interopRequireDefault(_Particle2);

var _Path2 = __webpack_require__(58);

var _Path3 = _interopRequireDefault(_Path2);

var _Rect2 = __webpack_require__(23);

var _Rect3 = _interopRequireDefault(_Rect2);

var _Scroller2 = __webpack_require__(59);

var _Scroller3 = _interopRequireDefault(_Scroller2);

var _StarField2 = __webpack_require__(91);

var _StarField3 = _interopRequireDefault(_StarField2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Callback = function Callback() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(_Callback3.default, [null].concat(args)))();
},
    Canvas = function Canvas() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return new (Function.prototype.bind.apply(_Canvas3.default, [null].concat(args)))();
},
    Circle = function Circle() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return new (Function.prototype.bind.apply(_Circle3.default, [null].concat(args)))();
},
    Emitter = function Emitter() {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return new (Function.prototype.bind.apply(_Emitter3.default, [null].concat(args)))();
},
    FastBlur = function FastBlur() {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  return new (Function.prototype.bind.apply(_FastBlur3.default, [null].concat(args)))();
},
    Group = function Group() {
  for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  return new (Function.prototype.bind.apply(_Group3.default, [null].concat(args)))();
},
    Image = function Image() {
  for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    args[_key7] = arguments[_key7];
  }

  return new (Function.prototype.bind.apply(_Image3.default, [null].concat(args)))();
},
    Text = function Text() {
  for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
    args[_key8] = arguments[_key8];
  }

  return new (Function.prototype.bind.apply(_Text3.default, [null].concat(args)))();
},
    Particle = function Particle() {
  for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    args[_key9] = arguments[_key9];
  }

  return new (Function.prototype.bind.apply(_Particle3.default, [null].concat(args)))();
},
    Path = function Path() {
  for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
    args[_key10] = arguments[_key10];
  }

  return new (Function.prototype.bind.apply(_Path3.default, [null].concat(args)))();
},
    Rect = function Rect() {
  for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
    args[_key11] = arguments[_key11];
  }

  return new (Function.prototype.bind.apply(_Rect3.default, [null].concat(args)))();
},
    Scroller = function Scroller() {
  for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
    args[_key12] = arguments[_key12];
  }

  return new (Function.prototype.bind.apply(_Scroller3.default, [null].concat(args)))();
},
    StarField = function StarField() {
  for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
    args[_key13] = arguments[_key13];
  }

  return new (Function.prototype.bind.apply(_StarField3.default, [null].concat(args)))();
};

exports.default = {
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
  StarField: StarField
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Circle2 = __webpack_require__(2);

var _Circle3 = _interopRequireDefault(_Circle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Callback = function (_Circle) {
  _inherits(Callback, _Circle);

  function Callback(params) {
    _classCallCheck(this, Callback);

    // Callback
    var _this = _possibleConstructorReturn(this, (Callback.__proto__ || Object.getPrototypeOf(Callback)).call(this, params));

    _this.callback = params.callback;
    return _this;
  }

  _createClass(Callback, [{
    key: 'draw',
    value: function draw(context, additionalParameter) {
      if (this.enabled) {
        this.callback(context, additionalParameter, this);
      }
    }
  }]);

  return Callback;
}(_Circle3.default);

exports.default = Callback;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _Group2 = __webpack_require__(7);

var _Group3 = _interopRequireDefault(_Group2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var degToRad = 0.017453292519943295; //Math.PI / 180;

var Canvas = function (_Group) {
  _inherits(Canvas, _Group);

  function Canvas(params) {
    _classCallCheck(this, Canvas);

    // Size
    var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this, params));

    _this.width = (0, _calc2.default)(params.width);
    _this.height = (0, _calc2.default)(params.height);
    return _this;
  }

  _createClass(Canvas, [{
    key: 'generateTempCanvas',
    value: function generateTempCanvas(context) {
      var w = context.canvas.width,
          h = context.canvas.height;
      this.temp_canvas = document.createElement('canvas');
      this.temp_canvas.width = Math.round(w / this.scaleX);
      this.temp_canvas.height = Math.round(h / this.scaleY);
      this.tctx = this.temp_canvas.getContext('2d');
      this.tctx.globalCompositeOperation = "source-over";
      this.tctx.globalAlpha = 1;
      if (!this.width) {
        this.width = w;
      }
      if (!this.height) {
        this.height = h;
      }
    }

    // draw-methode

  }, {
    key: 'draw',
    value: function draw(context, additionalModifier) {
      if (this.enabled) {
        if (!this.temp_canvas) {
          this.generateTempCanvas(context);
        }

        var a = this.a,
            w = this.width,
            h = this.height,
            wh = w >> 1,
            hh = h >> 1;

        if (additionalModifier) {
          a *= additionalModifier.a;
        }

        // draw all sprites
        for (var i in this.sprite) {
          this.sprite[i].draw(this.tctx, false);
        }

        context.save();
        context.globalCompositeOperation = this.alphaMode;
        context.globalAlpha = a;
        context.translate(this.x + wh, this.y + hh);
        context.scale(this.scaleX, this.scaleY);
        context.rotate(this.arc * degToRad);
        context.drawImage(this.temp_canvas, 0, 0, w, h, -wh, -hh, w, h);
        context.restore();
      }
    }
  }]);

  return Canvas;
}(_Group3.default);

exports.default = Canvas;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _Circle2 = __webpack_require__(2);

var _Circle3 = _interopRequireDefault(_Circle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FastBlur = function (_Circle) {
  _inherits(FastBlur, _Circle);

  function FastBlur(params) {
    _classCallCheck(this, FastBlur);

    // Size
    var _this = _possibleConstructorReturn(this, (FastBlur.__proto__ || Object.getPrototypeOf(FastBlur)).call(this, params));

    _this.width = (0, _calc2.default)(params.width);
    _this.height = (0, _calc2.default)(params.height);
    // Darker
    _this.darker = (0, _ifnull2.default)((0, _calc2.default)(params.darker), 0);
    _this.pixel = (0, _ifnull2.default)((0, _calc2.default)(params.pixel), false);
    _this.clear = (0, _ifnull2.default)((0, _calc2.default)(params.clear), false);
    return _this;
  }

  _createClass(FastBlur, [{
    key: 'generateTempCanvas',
    value: function generateTempCanvas(context) {
      var w = context.canvas.width,
          h = context.canvas.height;
      this.temp_canvas = document.createElement('canvas');
      this.temp_canvas.width = Math.round(w / this.scaleX);
      this.temp_canvas.height = Math.round(h / this.scaleY);
      this.tctx = this.temp_canvas.getContext('2d');
      this.tctx.globalCompositeOperation = "source-over";
      this.tctx.globalAlpha = 1;
      if (!this.width) {
        this.width = w;
      }
      if (!this.height) {
        this.height = h;
      }
    }

    // draw-methode

  }, {
    key: 'draw',
    value: function draw(context, additionalModifier) {
      if (this.enabled) {
        if (!this.temp_canvas) {
          this.generateTempCanvas(context);
        }

        var a = this.a,
            _w = this.width,
            _h = this.height,
            targetW = Math.round(_w / this.scaleX),
            targetH = Math.round(_h / this.scaleY);

        if (additionalModifier) {
          a *= additionalModifier.a;
        }

        if (a > 0) {
          this.tctx.globalCompositeOperation = "copy";
          this.tctx.globalAlpha = 1;
          this.tctx.drawImage(context.canvas, 0, 0, context.canvas.width, context.canvas.height, 0, 0, targetW, targetH);

          if (this.darker > 0) {
            this.tctx.globalCompositeOperation = "source-over";
            this.tctx.fillStyle = "rgba(0,0,0," + this.darker + ")";
            this.tctx.fillRect(0, 0, targetW, targetH);
          }

          // optional: clear screen
          if (this.clear) {
            context.clearRect(this.x, this.y, _w, _h);
          }

          context.globalCompositeOperation = this.alphaMode;
          context.globalAlpha = a;
          context.imageSmoothingEnabled = !this.pixel;
          context.drawImage(this.temp_canvas, 0, 0, targetW, targetH, this.x, this.y, _w, _h);
          context.imageSmoothingEnabled = true;
        }
      } else {
        // optional: clear screen
        if (this.clear) {
          context.clearRect(this.x, this.y, w, h);
        }
      }
    }
  }]);

  return FastBlur;
}(_Circle3.default);

exports.default = FastBlur;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _ImageManager = __webpack_require__(6);

var _ImageManager2 = _interopRequireDefault(_ImageManager);

var _Circle2 = __webpack_require__(2);

var _Circle3 = _interopRequireDefault(_Circle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var degToRad = 0.017453292519943295; //Math.PI / 180;

// Sprite
// Draw a Image

var Image = function (_Circle) {
  _inherits(Image, _Circle);

  function Image(params) {
    _classCallCheck(this, Image);

    // Image
    var _this = _possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).call(this, params));

    _this.image = _ImageManager2.default.getImage((0, _calc2.default)(params.image));
    // relativ position
    _this.position = (0, _ifnull2.default)((0, _calc2.default)(params.position), Image.CENTER);
    _this.frameX = (0, _ifnull2.default)((0, _calc2.default)(params.frameX), 0);
    _this.frameY = (0, _ifnull2.default)((0, _calc2.default)(params.frameY), 0);
    _this.frameWidth = (0, _ifnull2.default)((0, _calc2.default)(params.frameWidth), 0);
    _this.frameHeight = (0, _ifnull2.default)((0, _calc2.default)(params.frameHeight), 0);
    return _this;
  }

  // Draw-Funktion


  _createClass(Image, [{
    key: 'draw',
    value: function draw(context, additionalModifier) {
      if (this.enabled) {
        var a = this.a,
            frameWidth = this.frameWidth || this.image.width,
            frameHeight = this.frameHeight || this.image.height,
            sX = frameWidth * this.scaleX,
            sY = frameHeight * this.scaleY;
        if (additionalModifier) {
          a *= additionalModifier.a;
        }
        context.globalCompositeOperation = this.alphaMode;
        context.globalAlpha = a;
        if (this.arc == 0) {
          if (this.position === Image.LEFT_TOP) {
            context.drawImage(this.image, this.frameX, this.frameY, frameWidth, frameHeight, this.x, this.y, sX, sY);
          } else {
            context.drawImage(this.image, this.frameX, this.frameY, frameWidth, frameHeight, this.x - sX / 2, this.y - sY / 2, sX, sY);
          }
        } else {
          context.save();
          context.translate(this.x, this.y);
          context.rotate(this.arc * degToRad);
          context.drawImage(this.image, this.frameX, this.frameY, frameWidth, frameHeight, -(sX >> 1), -(sY >> 1), sX, sY);
          context.restore();
        }
      }
    }
  }]);

  return Image;
}(_Circle3.default);

Image.LEFT_TOP = 0;
Image.CENTER = 1;

exports.default = Image;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Circle2 = __webpack_require__(2);

var _Circle3 = _interopRequireDefault(_Circle2);

var _color = __webpack_require__(20);

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var gradientSize = 64;
var gradientResolution = 4;
var gradientSizeHalf = gradientSize >> 1;

var Particle = function (_Circle) {
  _inherits(Particle, _Circle);

  function Particle(params) {
    _classCallCheck(this, Particle);

    return _possibleConstructorReturn(this, (Particle.__proto__ || Object.getPrototypeOf(Particle)).call(this, params));
  }

  _createClass(Particle, [{
    key: 'draw',


    // draw-methode
    value: function draw(context, additionalModifier) {
      if (this.enabled) {
        // faster as: if (!(this.color instanceof Color && this.color.model === 'rgb')) {
        if (!this.color || !this.color.color) {
          this.color = (0, _color2.default)(this.color).rgb();
        }
        var a = this.a,
            color = this.color.color;
        if (additionalModifier) {
          a *= additionalModifier.a;
        }
        context.globalCompositeOperation = this.alphaMode;
        context.globalAlpha = a;
        context.imageSmoothingEnabled = this.scaleX > gradientSize;
        context.drawImage(Particle.getGradientImage(color[0], color[1], color[2]), 0, 0, gradientSize, gradientSize, this.x - (this.scaleX >> 1), this.y - (this.scaleY >> 1), this.scaleX, this.scaleY);
        context.imageSmoothingEnabled = true;
      }
    }
  }], [{
    key: 'getGradientImage',
    value: function getGradientImage(r, g, b) {
      var rIndex = void 0,
          gIndex = void 0,
          cr = r >> gradientResolution,
          cg = g >> gradientResolution,
          cb = b >> gradientResolution;

      if (!Particle.Gradient) {
        Particle.Gradient = new Array(256 >> gradientResolution);
        for (rIndex = 0; rIndex < Particle.Gradient.length; rIndex++) {
          Particle.Gradient[rIndex] = new Array(256 >> gradientResolution);
          for (gIndex = 0; gIndex < Particle.Gradient[rIndex].length; gIndex++) {
            Particle.Gradient[rIndex][gIndex] = new Array(256 >> gradientResolution);
          }
        }
      }
      if (!Particle.Gradient[cr][cg][cb]) {
        Particle.Gradient[cr][cg][cb] = Particle.generateGradientImage(cr, cg, cb);
      }
      return Particle.Gradient[cr][cg][cb];
    }
  }, {
    key: 'generateGradientImage',
    value: function generateGradientImage(cr, cg, cb) {
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = gradientSize;

      var txtc = canvas.getContext('2d');
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
    }
  }]);

  return Particle;
}(_Circle3.default);

Particle.Gradient = null;

exports.default = Particle;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var colorNames = __webpack_require__(21);
var swizzle = __webpack_require__(54);

var reverseNames = {};

// create a list of reverse color names
for (var name in colorNames) {
	if (colorNames.hasOwnProperty(name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = module.exports = {
	to: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-fA-F0-9]{3})$/;
	var hex = /^#([a-fA-F0-9]{6})$/;
	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var keyword = /(\D+)/;

	var rgb = [0, 0, 0, 1];
	var match;
	var i;

	if (match = string.match(abbr)) {
		match = match[1];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}
	} else if (match = string.match(hex)) {
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		rgb = colorNames[match[1]];

		if (!rgb) {
			return null;
		}

		rgb[3] = 1;

		return rgb;
	}

	for (i = 0; i < rgb.length; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.to.hex = function (rgb) {
	return '#' + hexDouble(rgb[0]) + hexDouble(rgb[1]) + hexDouble(rgb[2]);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = num.toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArrayish = __webpack_require__(55);

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var swizzle = module.exports = function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle.wrap = function (fn) {
	return function () {
		return fn(swizzle(arguments));
	};
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isArrayish(obj) {
	if (!obj || typeof obj === 'string') {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(22);
var route = __webpack_require__(57);

var convert = {};

var models = Object.keys(conversions);

function wrapRaw(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		return fn(args);
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		var result = fn(args);

		// we're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (var len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(function (fromModel) {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	var routes = route(fromModel);
	var routeModels = Object.keys(routes);

	routeModels.forEach(function (toModel) {
		var fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(22);

/*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

// https://jsperf.com/object-keys-vs-for-in-with-closure/3
var models = Object.keys(conversions);

function buildGraph() {
	var graph = {};

	for (var len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	var graph = buildGraph();
	var queue = [fromModel]; // unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		var current = queue.pop();
		var adjacents = Object.keys(conversions[current]);

		for (var len = adjacents.length, i = 0; i < len; i++) {
			var adjacent = adjacents[i];
			var node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	var path = [graph[toModel].parent, toModel];
	var fn = conversions[graph[toModel].parent][toModel];

	var cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	var graph = deriveBFS(fromModel);
	var conversion = {};

	var models = Object.keys(graph);
	for (var len = models.length, i = 0; i < len; i++) {
		var toModel = models[i];
		var node = graph[toModel];

		if (node.parent === null) {
			// no possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _Group2 = __webpack_require__(7);

var _Group3 = _interopRequireDefault(_Group2);

var _isArray2 = __webpack_require__(3);

var _isArray3 = _interopRequireDefault(_isArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var degToRad = 0.017453292519943295; //Math.PI / 180;

var Path = function (_Group) {
  _inherits(Path, _Group);

  function Path(params) {
    _classCallCheck(this, Path);

    var _this = _possibleConstructorReturn(this, (Path.__proto__ || Object.getPrototypeOf(Path)).call(this, params));

    _this.oldPath = undefined;
    _this.path = (0, _calc2.default)(params.path);
    _this.path2D = new Path2D();

    _this.color = (0, _calc2.default)(params.color);
    _this.borderColor = (0, _calc2.default)(params.borderColor);
    _this.lineWidth = (0, _ifnull2.default)((0, _calc2.default)(params.lineWidth), 1);
    _this.clip = (0, _ifnull2.default)((0, _calc2.default)(params.clip), false);
    _this.fixed = (0, _ifnull2.default)((0, _calc2.default)(params.fixed), false);
    return _this;
  }

  // draw-methode


  _createClass(Path, [{
    key: 'draw',
    value: function draw(context, additionalModifier) {
      var _this2 = this;

      if (this.enabled) {
        var a = this.a;
        if (this.oldPath !== this.path) {
          if ((0, _isArray3.default)(this.path)) {
            this.path2D = new Path2D();
            this.path.forEach(function (curve) {
              _this2.path2D.moveTo(curve[0][0], curve[0][1]);
              curve.forEach(function (points) {
                _this2.path2D.bezierCurveTo(points[2], points[3], points[4], points[5], points[6], points[7]);
              });
              _this2.path2D.closePath();
            });
          } else {
            this.path2D = new Path2D(this.path);
          }
          this.oldPath = this.path;
        }
        if (additionalModifier) {
          a *= additionalModifier.a;
        }

        var scaleX = this.scaleX,
            scaleY = this.scaleY;

        if (this.fixed) {
          if (scaleX == 0) {
            scaleX = 0.0000000001;
          }
          if (scaleY == 0) {
            scaleY = 0.0000000001;
          }
        }

        context.globalCompositeOperation = this.alphaMode;
        context.globalAlpha = a;
        context.save();
        context.translate(this.x, this.y);
        context.scale(scaleX, scaleY);
        context.rotate(this.arc * degToRad);

        if (this.color) {
          context.fillStyle = this.color;
          context.fill(this.path2D);
        }

        if (this.borderColor) {
          context.strokeStyle = this.borderColor;
          context.lineWidth = this.lineWidth;
          context.stroke(this.path2D);
        }

        if (this.clip) {
          context.clip(this.path2D);
          if (this.fixed) {
            context.rotate(-this.arc * degToRad);
            context.scale(1 / scaleX, 1 / scaleY);
            context.translate(-this.x, -this.y);
          }
        }

        // draw all sprites
        for (var i in this.sprite) {
          this.sprite[i].draw(context, additionalModifier);
        }

        context.restore();
      }
    }
  }]);

  return Path;
}(_Group3.default);

exports.default = Path;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _Emitter2 = __webpack_require__(18);

var _Emitter3 = _interopRequireDefault(_Emitter2);

var _Text = __webpack_require__(19);

var _Text2 = _interopRequireDefault(_Text);

var _assign2 = __webpack_require__(60);

var _assign3 = _interopRequireDefault(_assign2);

var _isArray2 = __webpack_require__(3);

var _isArray3 = _interopRequireDefault(_isArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scroller = function (_Emitter) {
  _inherits(Scroller, _Emitter);

  function Scroller(params) {
    _classCallCheck(this, Scroller);

    var text = (0, _calc2.default)(params.text),
        characterList = (0, _isArray3.default)(text) ? text : [].concat(_toConsumableArray(text));
    return _possibleConstructorReturn(this, (Scroller.__proto__ || Object.getPrototypeOf(Scroller)).call(this, (0, _assign3.default)({}, params, {
      class: _Text2.default,
      count: characterList.length,
      text: function text(index) {
        return characterList[index];
      },
      enabled: function enabled(index) {
        return characterList[index] !== " " && (0, _calc2.default)(params.enabled, index);
      }
    })));
  }

  return Scroller;
}(_Emitter3.default);

exports.default = Scroller;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(24),
    copyObject = __webpack_require__(67),
    createAssigner = __webpack_require__(68),
    isArrayLike = __webpack_require__(12),
    isPrototype = __webpack_require__(32),
    keys = __webpack_require__(77);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */
var assign = createAssigner(function(object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

module.exports = assign;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(62),
    getValue = __webpack_require__(66);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(27),
    isMasked = __webpack_require__(63),
    isObject = __webpack_require__(11),
    toSource = __webpack_require__(65);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(64);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(10);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),
/* 65 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),
/* 66 */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(24),
    baseAssignValue = __webpack_require__(25);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(69),
    isIterateeCall = __webpack_require__(76);

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(29),
    overRest = __webpack_require__(70),
    setToString = __webpack_require__(72);

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(71);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),
/* 71 */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(73),
    shortOut = __webpack_require__(75);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(74),
    defineProperty = __webpack_require__(26),
    identity = __webpack_require__(29);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),
/* 74 */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),
/* 75 */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(28),
    isArrayLike = __webpack_require__(12),
    isIndex = __webpack_require__(31),
    isObject = __webpack_require__(11);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(78),
    baseKeys = __webpack_require__(88),
    isArrayLike = __webpack_require__(12);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(79),
    isArguments = __webpack_require__(80),
    isArray = __webpack_require__(3),
    isBuffer = __webpack_require__(82),
    isIndex = __webpack_require__(31),
    isTypedArray = __webpack_require__(84);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),
/* 79 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(81),
    isObjectLike = __webpack_require__(5);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(4),
    isObjectLike = __webpack_require__(5);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(10),
    stubFalse = __webpack_require__(83);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ }),
/* 83 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(85),
    baseUnary = __webpack_require__(86),
    nodeUtil = __webpack_require__(87);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(4),
    isLength = __webpack_require__(30),
    isObjectLike = __webpack_require__(5);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),
/* 86 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(15);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(33)(module)))

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(32),
    nativeKeys = __webpack_require__(89);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(90);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 90 */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _Rect2 = __webpack_require__(23);

var _Rect3 = _interopRequireDefault(_Rect2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Sprite
// Draw a Circle
var StarField = function (_Rect) {
  _inherits(StarField, _Rect);

  function StarField(params) {
    _classCallCheck(this, StarField);

    var _this = _possibleConstructorReturn(this, (StarField.__proto__ || Object.getPrototypeOf(StarField)).call(this, params));

    _this.count = (0, _ifnull2.default)((0, _calc2.default)(params.count), 40);
    _this.moveX = (0, _ifnull2.default)((0, _calc2.default)(params.moveX), 0);
    _this.moveY = (0, _ifnull2.default)((0, _calc2.default)(params.moveY), 0);
    _this.moveZ = (0, _ifnull2.default)((0, _calc2.default)(params.moveZ), 0);

    if (_this.width && _this.height) {
      _this.init();
    }
    return _this;
  }

  _createClass(StarField, [{
    key: 'init',
    value: function init() {
      this.centerX = Math.floor((this.width - this.x) / 2);
      this.centerY = Math.floor((this.height - this.y) / 2);
      this.scaleZ = this.width + this.height >> 1;

      this.starsX = new Array(this.count);
      this.starsY = new Array(this.count);
      this.starsZ = new Array(this.count);
      this.starsOldX = new Array(this.count);
      this.starsOldY = new Array(this.count);
      this.starsNewX = new Array(this.count);
      this.starsNewY = new Array(this.count);
      this.starsEnabled = new Array(this.count);
      this.starsLineWidth = new Array(this.count);

      for (var i = 0; i < this.count; i++) {
        this.starsX[i] = Math.random() * this.centerX * 4 - this.centerX * 2;
        this.starsY[i] = Math.random() * this.centerY * 4 - this.centerY * 2;
        this.starsZ[i] = Math.random() * this.scaleZ;
      }
    }
  }, {
    key: 'moveStar',
    value: function moveStar(i, scaled_timepassed, firstPass) {
      if (firstPass) {
        this.starsEnabled[i] = true;
      }

      var x = this.starsX[i] + this.moveX * scaled_timepassed,
          y = this.starsY[i] + this.moveY * scaled_timepassed,
          z = this.starsZ[i] + this.moveZ * scaled_timepassed;

      if (x < -this.centerX) {
        x += this.width * 2;
        this.starsEnabled[i] = false;
      } else if (x > this.width * 2 - this.centerX) {
        x -= this.width * 2;
        this.starsEnabled[i] = false;
      }
      if (y < -this.centerY) {
        y += this.height * 2;
        this.starsEnabled[i] = false;
      } else if (y > this.height * 2 - this.centerY) {
        y -= this.height * 2;
        this.starsEnabled[i] = false;
      }
      if (z < 0) {
        z += this.scaleZ;
        this.starsEnabled[i] = false;
      } else if (z > this.scaleZ) {
        z -= this.scaleZ;
        this.starsEnabled[i] = false;
      }

      var projectX = ~~(this.centerX + x / z * this.scaleZ),
          projectY = ~~(this.centerY + y / z * this.scaleZ / 2);

      this.starsEnabled[i] = this.starsEnabled[i] && projectX >= this.x && projectY >= this.y && projectX < this.width && projectY < this.height;

      if (firstPass) {
        this.starsX[i] = x;
        this.starsY[i] = y;
        this.starsZ[i] = z;
        this.starsNewX[i] = projectX;
        this.starsNewY[i] = projectY;
      } else {
        this.starsOldX[i] = projectX;
        this.starsOldY[i] = projectY;
        this.starsLineWidth[i] = Math.round((1 - this.starsZ[i] / this.scaleZ) * 2 + 1);
      }
    }
  }, {
    key: 'animate',
    value: function animate(timepassed) {
      var ret = _get(StarField.prototype.__proto__ || Object.getPrototypeOf(StarField.prototype), 'animate', this).call(this, timepassed);
      if (this.enabled && this.width && this.height) {
        var i = this.count;
        while (i--) {
          this.moveStar(i, timepassed / 16, true);
          if (this.starsEnabled[i]) {
            this.moveStar(i, -3, false);
          }
        }
      }
      return ret;
    }

    // Draw-Funktion

  }, {
    key: 'draw',
    value: function draw(context, additionalModifier) {
      if (this.enabled) {
        if (!this.width || !this.height) {
          this.width = this.width || context.canvas.width;
          this.height = this.height || context.canvas.height;
          this.init();
          return;
        }
        var a = this.a;
        if (additionalModifier) {
          a *= additionalModifier.a;
        }
        context.globalCompositeOperation = this.alphaMode;
        context.globalAlpha = a;

        if (this.moveY == 0 && this.moveZ == 0 && this.moveX < 0) {
          context.fillStyle = this.color;
          var i = this.count;
          while (i--) {
            if (this.starsEnabled[i]) {
              context.fillRect(this.starsNewX[i], this.starsNewY[i] - this.starsLineWidth[i] / 2, this.starsOldX[i] - this.starsNewX[i], this.starsLineWidth[i]);
            }
          }
        } else {
          context.strokeStyle = this.color;
          var lw = 4,
              _i = void 0;
          while (--lw) {
            context.beginPath();
            context.lineWidth = lw;
            _i = this.count;
            while (_i--) {
              if (this.starsEnabled[_i] && this.starsLineWidth[_i] === lw) {
                context.moveTo(this.starsOldX[_i], this.starsOldY[_i]);
                context.lineTo(this.starsNewX[_i], this.starsNewY[_i]);
              }
            }
            context.stroke();
            context.closePath();
          }
        }
      }
    }
  }]);

  return StarField;
}(_Rect3.default);

exports.default = StarField;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Callback2 = __webpack_require__(93);

var _Callback3 = _interopRequireDefault(_Callback2);

var _ChangeTo2 = __webpack_require__(34);

var _ChangeTo3 = _interopRequireDefault(_ChangeTo2);

var _End2 = __webpack_require__(95);

var _End3 = _interopRequireDefault(_End2);

var _EndDisabled2 = __webpack_require__(96);

var _EndDisabled3 = _interopRequireDefault(_EndDisabled2);

var _Image2 = __webpack_require__(97);

var _Image3 = _interopRequireDefault(_Image2);

var _ImageFrame2 = __webpack_require__(98);

var _ImageFrame3 = _interopRequireDefault(_ImageFrame2);

var _Move2 = __webpack_require__(99);

var _Move3 = _interopRequireDefault(_Move2);

var _Once2 = __webpack_require__(100);

var _Once3 = _interopRequireDefault(_Once2);

var _Play2 = __webpack_require__(101);

var _Play3 = _interopRequireDefault(_Play2);

var _Shake2 = __webpack_require__(102);

var _Shake3 = _interopRequireDefault(_Shake2);

var _ShowOnce2 = __webpack_require__(103);

var _ShowOnce3 = _interopRequireDefault(_ShowOnce2);

var _Stop2 = __webpack_require__(104);

var _Stop3 = _interopRequireDefault(_Stop2);

var _Wait2 = __webpack_require__(105);

var _Wait3 = _interopRequireDefault(_Wait2);

var _WaitDisabled2 = __webpack_require__(106);

var _WaitDisabled3 = _interopRequireDefault(_WaitDisabled2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Callback = function Callback() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(_Callback3.default, [null].concat(args)))();
},
    ChangeTo = function ChangeTo() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return new (Function.prototype.bind.apply(_ChangeTo3.default, [null].concat(args)))();
},
    End = function End() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return new (Function.prototype.bind.apply(_End3.default, [null].concat(args)))();
},
    EndDisabled = function EndDisabled() {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return new (Function.prototype.bind.apply(_EndDisabled3.default, [null].concat(args)))();
},
    Image = function Image() {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  return new (Function.prototype.bind.apply(_Image3.default, [null].concat(args)))();
},
    ImageFrame = function ImageFrame() {
  for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  return new (Function.prototype.bind.apply(_ImageFrame3.default, [null].concat(args)))();
},
    Move = function Move() {
  for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    args[_key7] = arguments[_key7];
  }

  return new (Function.prototype.bind.apply(_Move3.default, [null].concat(args)))();
},
    Once = function Once() {
  for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
    args[_key8] = arguments[_key8];
  }

  return new (Function.prototype.bind.apply(_Once3.default, [null].concat(args)))();
},
    Play = function Play() {
  for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    args[_key9] = arguments[_key9];
  }

  return new (Function.prototype.bind.apply(_Play3.default, [null].concat(args)))();
},
    Shake = function Shake() {
  for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
    args[_key10] = arguments[_key10];
  }

  return new (Function.prototype.bind.apply(_Shake3.default, [null].concat(args)))();
},
    ShowOnce = function ShowOnce() {
  for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
    args[_key11] = arguments[_key11];
  }

  return new (Function.prototype.bind.apply(_ShowOnce3.default, [null].concat(args)))();
},
    Stop = function Stop() {
  for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
    args[_key12] = arguments[_key12];
  }

  return new (Function.prototype.bind.apply(_Stop3.default, [null].concat(args)))();
},
    Wait = function Wait() {
  for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
    args[_key13] = arguments[_key13];
  }

  return new (Function.prototype.bind.apply(_Wait3.default, [null].concat(args)))();
},
    WaitDisabled = function WaitDisabled() {
  for (var _len14 = arguments.length, args = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
    args[_key14] = arguments[_key14];
  }

  return new (Function.prototype.bind.apply(_WaitDisabled3.default, [null].concat(args)))();
};

exports.default = {
  Callback: Callback,
  ChangeTo: ChangeTo,
  End: End,
  EndDisabled: EndDisabled,
  Image: Image,
  ImageFrame: ImageFrame,
  Move: Move,
  Once: Once,
  Play: Play,
  Shake: Shake,
  ShowOnce: ShowOnce,
  Stop: Stop,
  Wait: Wait,
  WaitDisabled: WaitDisabled
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _isNumber = __webpack_require__(16);

var _isNumber2 = _interopRequireDefault(_isNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Callback = function () {
  function Callback(callback, duration) {
    _classCallCheck(this, Callback);

    this.callback = callback;
    this.duration = (0, _ifnull2.default)((0, _calc2.default)(duration), 0);
    this.initialized = false;
  }

  _createClass(Callback, [{
    key: 'reset',
    value: function reset() {
      this.initialized = false;
    }
  }, {
    key: 'run',
    value: function run(sprite, time) {
      var result = void 0;

      if ((0, _isNumber2.default)(this.duration)) {
        this.callback(sprite, Math.min(time, this.duration), !this.initialized);
        this.initialized = true;
        return time - this.duration;
      } else {
        result = this.callback(sprite, time, !this.initialized);
        this.initialized = true;
        return result;
      }
    }
  }]);

  return Callback;
}();

exports.default = Callback;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * pasition v1.0.1 By dntzhang
 * Github: https://github.com/AlloyTeam/pasition
 * MIT Licensed.
 */

(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.pasition = factory());
}(this, (function () { 'use strict';

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
        args = parseValues(args

        // overloaded moveTo
        );if (type == 'm' && args.length > 2) {
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
                    cy: preX + item[7]
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

pasition._upShapes = function (shapes, count) {
    var _loop = function _loop(i) {
        var shape = shapes[shapes.length - 1];
        var newShape = [];

        shape.forEach(function (curve) {
            newShape.push(curve.slice(0));
        });
        shapes.push(newShape);
    };

    for (var i = 0; i < count; i++) {
        _loop(i);
    }
};

pasition._subShapes = function (pathA, pathB, count) {
    var _loop2 = function _loop2(i) {
        var shape = pathB[pathB.length - 1];
        var newShape = [];
        var x = shape[0][0],
            y = shape[0][1];
        shape.forEach(function () {
            newShape.push([x, y, x, y, x, y, x, y]);
        });

        pathB.push(newShape);
    };

    for (var i = 0; i < count; i++) {
        _loop2(i);
    }
};

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
        pasition._subShapes(clonePathA, clonePathB, lenA - lenB);
    } else if (lenA < lenB) {
        pasition._upShapes(clonePathA, lenB - lenA);
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


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sequence = __webpack_require__(8);

var _Sequence2 = _interopRequireDefault(_Sequence);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var End = function () {
	function End() {
		_classCallCheck(this, End);
	}

	_createClass(End, [{
		key: 'run',
		value: function run(sprite, time) {
			return _Sequence2.default.TIMELAPSE_TO_FORCE_DISABLE;
		}
	}]);

	return End;
}();

exports.default = End;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sequence = __webpack_require__(8);

var _Sequence2 = _interopRequireDefault(_Sequence);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EndDisabled = function () {
    function EndDisabled() {
        _classCallCheck(this, EndDisabled);
    }

    _createClass(EndDisabled, [{
        key: 'run',
        value: function run(sprite, time) {
            sprite.enabled = false;
            return _Sequence2.default.TIMELAPSE_TO_FORCE_DISABLE;
        }
    }]);

    return EndDisabled;
}();

exports.default = EndDisabled;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _ImageManager = __webpack_require__(6);

var _ImageManager2 = _interopRequireDefault(_ImageManager);

var _isArray = __webpack_require__(3);

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Image = function () {
  function Image(image, durationBetweenFrames) {
    _classCallCheck(this, Image);

    this.initialized = false;
    this.image = (0, _calc2.default)(image);
    this.durationBetweenFrames = (0, _ifnull2.default)((0, _calc2.default)(durationBetweenFrames), 0);
    if ((0, _isArray2.default)(this.image)) {
      this.count = this.image.length;
    } else {
      this.image = [this.image];
      this.count = 1;
    }
    this.duration = this.count * this.durationBetweenFrames;
  }

  _createClass(Image, [{
    key: 'reset',
    value: function reset() {
      this.initialized = false;
    }
  }, {
    key: 'run',
    value: function run(sprite, time) {
      if (!this.initialized) {
        this.initialized = true;
        this.current = -1;
      }

      // return time left
      if (time >= this.duration) {
        sprite.image = _ImageManager2.default.getImage(this.image[this.image.length - 1]);
      } else {
        var currentFrame = Math.floor(time / this.durationBetweenFrames);
        if (currentFrame !== this.current) {
          this.current = currentFrame;
          sprite.image = _ImageManager2.default.getImage(this.image[this.current]);
        }
      }
      return time - this.duration;
    }
  }]);

  return Image;
}();

exports.default = Image;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

var _isArray = __webpack_require__(3);

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageFrame = function () {
    function ImageFrame(frameNumber, framesToRight, durationBetweenFrames) {
        _classCallCheck(this, ImageFrame);

        this.initialized = false;
        this.frameNumber = (0, _calc2.default)(frameNumber);
        this.framesToRight = (0, _ifnull2.default)((0, _calc2.default)(framesToRight), true);
        this.durationBetweenFrames = (0, _ifnull2.default)((0, _calc2.default)(durationBetweenFrames), 0);
        if ((0, _isArray2.default)(this.frameNumber)) {
            this.count = this.frameNumber.length;
        } else {
            this.frameNumber = [this.frameNumber];
            this.count = 1;
        }
        this.duration = this.count * this.durationBetweenFrames;
    }

    _createClass(ImageFrame, [{
        key: 'run',
        value: function run(sprite, time) {
            var currentFrame = 0;
            if (time >= this.duration) {
                currentFrame = this.frameNumber[this.frameNumber.length - 1];
            } else {
                currentFrame = Math.floor(time / this.durationBetweenFrames);
            }
            if (this.framesToRight) {
                sprite.frameX = sprite.frameWidth * currentFrame;
            } else {
                sprite.frameY = sprite.frameHeight * currentFrame;
            }

            return time - this.duration;
        }
    }]);

    return ImageFrame;
}();

exports.default = ImageFrame;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _ChangeTo2 = __webpack_require__(34);

var _ChangeTo3 = _interopRequireDefault(_ChangeTo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DURATION_FOR_1PX = 10;

var Move = function (_ChangeTo) {
  _inherits(Move, _ChangeTo);

  function Move(x, y, speed, ease) {
    _classCallCheck(this, Move);

    var _this = _possibleConstructorReturn(this, (Move.__proto__ || Object.getPrototypeOf(Move)).call(this, {
      x: x,
      y: y
    }, 0, ease));

    _this.speed = (0, _calc2.default)(speed) || 1;
    return _this;
  }

  _createClass(Move, [{
    key: 'init',
    value: function init(sprite, time) {
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

      _get(Move.prototype.__proto__ || Object.getPrototypeOf(Move.prototype), 'init', this).call(this, sprite, time);
    }
  }]);

  return Move;
}(_ChangeTo3.default);

exports.default = Move;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Once = function () {
  function Once(Aniobject, times) {
    _classCallCheck(this, Once);

    this.Aniobject = Aniobject;
    this.times = (0, _ifnull2.default)((0, _calc2.default)(times), 1);
  }

  _createClass(Once, [{
    key: 'run',
    value: function run(sprite, time) {
      if (this.times <= 0) {
        return time;
      } else {
        var t = this.Aniobject.run(sprite, time);
        if (t > 0) {
          this.times--;
        }
        return t;
      }
    }
  }]);

  return Once;
}();

exports.default = Once;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

var _ifnull = __webpack_require__(1);

var _ifnull2 = _interopRequireDefault(_ifnull);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Play = function () {
  function Play(name, duration, loop) {
    _classCallCheck(this, Play);

    this.duration = (0, _ifnull2.default)((0, _calc2.default)(duration), 1);
    this.name = (0, _calc2.default)(name);
    this.loop = (0, _calc2.default)((0, _ifnull2.default)(loop, 1));
  }

  _createClass(Play, [{
    key: 'run',
    value: function run(sprite, time) {
      // return time left
      if (time >= this.duration) {
        // Play animation from the start
        sprite.changeAnimationStatus(_defineProperty({}, this.name, {
          position: 0,
          timelapsed: time - this.duration,
          loop: this.loop
        }));
      }
      return time - this.duration;
    }
  }]);

  return Play;
}();

exports.default = Play;

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Shake = function () {
  function Shake(shakediff, duration) {
    _classCallCheck(this, Shake);

    this.initialized = false;
    this.duration = (0, _calc2.default)(duration);
    this.shakeDiff = (0, _calc2.default)(shakediff);
    this.shakeDiffHalf = this.shakeDiff / 2;
  }

  _createClass(Shake, [{
    key: 'reset',
    value: function reset() {
      this.initialized = false;
    }
  }, {
    key: 'run',
    value: function run(sprite, time) {
      if (!this.initialized) {
        this.initialized = true;
        this.x = sprite.x;
        this.y = sprite.y;
      }

      // return time left
      if (time >= this.duration) {
        // prevent round errors
        sprite.x = this.x;
        sprite.y = this.y;
      } else {
        // shake sprite
        sprite.x = this.x + Math.random() * this.shakeDiff - this.shakeDiffHalf;
        sprite.y = this.y + Math.random() * this.shakeDiff - this.shakeDiffHalf;
      }
      return time - this.duration;
    }
  }]);

  return Shake;
}();

exports.default = Shake;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShowOnce = function () {
    function ShowOnce() {
        _classCallCheck(this, ShowOnce);

        this.showOnce = true;
    }

    _createClass(ShowOnce, [{
        key: "run",
        value: function run(sprite, time) {
            sprite.enabled = sprite.enabled && this.showOnce;
            this.showOnce = false;
            return 0;
        }
    }]);

    return ShowOnce;
}();

exports.default = ShowOnce;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sequence = __webpack_require__(8);

var _Sequence2 = _interopRequireDefault(_Sequence);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var End = function () {
	function End() {
		_classCallCheck(this, End);
	}

	_createClass(End, [{
		key: 'run',
		value: function run(sprite, time) {
			return _Sequence2.default.TIMELAPSE_TO_STOP;
		}
	}]);

	return End;
}();

exports.default = End;

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Wait = function () {
    function Wait(duration) {
        _classCallCheck(this, Wait);

        this.duration = (0, _calc2.default)(duration);
    }

    _createClass(Wait, [{
        key: 'run',
        value: function run(sprite, time) {
            // return time left
            return this.duration ? time - this.duration : -1;
        }
    }]);

    return Wait;
}();

exports.default = Wait;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _calc = __webpack_require__(0);

var _calc2 = _interopRequireDefault(_calc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WaitDisabled = function () {
  function WaitDisabled(duration) {
    _classCallCheck(this, WaitDisabled);

    this.duration = (0, _calc2.default)(duration);
  }

  _createClass(WaitDisabled, [{
    key: 'run',
    value: function run(sprite, time) {
      // return time left
      sprite.enabled = time >= this.duration;
      return time - this.duration;
    }
  }]);

  return WaitDisabled;
}();

exports.default = WaitDisabled;

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
	'backInOut': __webpack_require__(108),
	'backIn': __webpack_require__(109),
	'backOut': __webpack_require__(110),
	'bounceInOut': __webpack_require__(111),
	'bounceIn': __webpack_require__(112),
	'bounceOut': __webpack_require__(13),
	'circInOut': __webpack_require__(113),
	'circIn': __webpack_require__(114),
	'circOut': __webpack_require__(115),
	'cubicInOut': __webpack_require__(116),
	'cubicIn': __webpack_require__(117),
	'cubicOut': __webpack_require__(118),
	'elasticInOut': __webpack_require__(119),
	'elasticIn': __webpack_require__(120),
	'elasticOut': __webpack_require__(121),
	'expoInOut': __webpack_require__(122),
	'expoIn': __webpack_require__(123),
	'expoOut': __webpack_require__(124),
	'linear': __webpack_require__(35),
	'quadInOut': __webpack_require__(125),
	'quadIn': __webpack_require__(126),
	'quadOut': __webpack_require__(127),
	'quartInOut': __webpack_require__(128),
	'quartIn': __webpack_require__(129),
	'quartOut': __webpack_require__(130),
	'quintInOut': __webpack_require__(131),
	'quintIn': __webpack_require__(132),
	'quintOut': __webpack_require__(133),
	'sineInOut': __webpack_require__(134),
	'sineIn': __webpack_require__(135),
	'sineOut': __webpack_require__(136)
}

/***/ }),
/* 108 */
/***/ (function(module, exports) {

function backInOut(t) {
  var s = 1.70158 * 1.525
  if ((t *= 2) < 1)
    return 0.5 * (t * t * ((s + 1) * t - s))
  return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2)
}

module.exports = backInOut

/***/ }),
/* 109 */
/***/ (function(module, exports) {

function backIn(t) {
  var s = 1.70158
  return t * t * ((s + 1) * t - s)
}

module.exports = backIn

/***/ }),
/* 110 */
/***/ (function(module, exports) {

function backOut(t) {
  var s = 1.70158
  return --t * t * ((s + 1) * t + s) + 1
}

module.exports = backOut

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var bounceOut = __webpack_require__(13)

function bounceInOut(t) {
  return t < 0.5
    ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
    : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5
}

module.exports = bounceInOut

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var bounceOut = __webpack_require__(13)

function bounceIn(t) {
  return 1.0 - bounceOut(1.0 - t)
}

module.exports = bounceIn

/***/ }),
/* 113 */
/***/ (function(module, exports) {

function circInOut(t) {
  if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1)
  return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
}

module.exports = circInOut

/***/ }),
/* 114 */
/***/ (function(module, exports) {

function circIn(t) {
  return 1.0 - Math.sqrt(1.0 - t * t)
}

module.exports = circIn

/***/ }),
/* 115 */
/***/ (function(module, exports) {

function circOut(t) {
  return Math.sqrt(1 - ( --t * t ))
}

module.exports = circOut

/***/ }),
/* 116 */
/***/ (function(module, exports) {

function cubicInOut(t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0
}

module.exports = cubicInOut

/***/ }),
/* 117 */
/***/ (function(module, exports) {

function cubicIn(t) {
  return t * t * t
}

module.exports = cubicIn

/***/ }),
/* 118 */
/***/ (function(module, exports) {

function cubicOut(t) {
  var f = t - 1.0
  return f * f * f + 1.0
}

module.exports = cubicOut

/***/ }),
/* 119 */
/***/ (function(module, exports) {

function elasticInOut(t) {
  return t < 0.5
    ? 0.5 * Math.sin(+13.0 * Math.PI/2 * 2.0 * t) * Math.pow(2.0, 10.0 * (2.0 * t - 1.0))
    : 0.5 * Math.sin(-13.0 * Math.PI/2 * ((2.0 * t - 1.0) + 1.0)) * Math.pow(2.0, -10.0 * (2.0 * t - 1.0)) + 1.0
}

module.exports = elasticInOut

/***/ }),
/* 120 */
/***/ (function(module, exports) {

function elasticIn(t) {
  return Math.sin(13.0 * t * Math.PI/2) * Math.pow(2.0, 10.0 * (t - 1.0))
}

module.exports = elasticIn

/***/ }),
/* 121 */
/***/ (function(module, exports) {

function elasticOut(t) {
  return Math.sin(-13.0 * (t + 1.0) * Math.PI/2) * Math.pow(2.0, -10.0 * t) + 1.0
}

module.exports = elasticOut

/***/ }),
/* 122 */
/***/ (function(module, exports) {

function expoInOut(t) {
  return (t === 0.0 || t === 1.0)
    ? t
    : t < 0.5
      ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0
}

module.exports = expoInOut

/***/ }),
/* 123 */
/***/ (function(module, exports) {

function expoIn(t) {
  return t === 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0))
}

module.exports = expoIn

/***/ }),
/* 124 */
/***/ (function(module, exports) {

function expoOut(t) {
  return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t)
}

module.exports = expoOut

/***/ }),
/* 125 */
/***/ (function(module, exports) {

function quadInOut(t) {
    t /= 0.5
    if (t < 1) return 0.5*t*t
    t--
    return -0.5 * (t*(t-2) - 1)
}

module.exports = quadInOut

/***/ }),
/* 126 */
/***/ (function(module, exports) {

function quadIn(t) {
  return t * t
}

module.exports = quadIn

/***/ }),
/* 127 */
/***/ (function(module, exports) {

function quadOut(t) {
  return -t * (t - 2.0)
}

module.exports = quadOut

/***/ }),
/* 128 */
/***/ (function(module, exports) {

function quarticInOut(t) {
  return t < 0.5
    ? +8.0 * Math.pow(t, 4.0)
    : -8.0 * Math.pow(t - 1.0, 4.0) + 1.0
}

module.exports = quarticInOut

/***/ }),
/* 129 */
/***/ (function(module, exports) {

function quarticIn(t) {
  return Math.pow(t, 4.0)
}

module.exports = quarticIn

/***/ }),
/* 130 */
/***/ (function(module, exports) {

function quarticOut(t) {
  return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0
}

module.exports = quarticOut

/***/ }),
/* 131 */
/***/ (function(module, exports) {

function qinticInOut(t) {
    if ( ( t *= 2 ) < 1 ) return 0.5 * t * t * t * t * t
    return 0.5 * ( ( t -= 2 ) * t * t * t * t + 2 )
}

module.exports = qinticInOut

/***/ }),
/* 132 */
/***/ (function(module, exports) {

function qinticIn(t) {
  return t * t * t * t * t
}

module.exports = qinticIn

/***/ }),
/* 133 */
/***/ (function(module, exports) {

function qinticOut(t) {
  return --t * t * t * t * t + 1
}

module.exports = qinticOut

/***/ }),
/* 134 */
/***/ (function(module, exports) {

function sineInOut(t) {
  return -0.5 * (Math.cos(Math.PI*t) - 1)
}

module.exports = sineInOut

/***/ }),
/* 135 */
/***/ (function(module, exports) {

function sineIn (t) {
  var v = Math.cos(t * Math.PI * 0.5)
  if (Math.abs(v) < 1e-14) return 1
  else return 1 - v
}

module.exports = sineIn


/***/ }),
/* 136 */
/***/ (function(module, exports) {

function sineOut(t) {
  return Math.sin(t * Math.PI/2)
}

module.exports = sineOut

/***/ })
/******/ ]);
});