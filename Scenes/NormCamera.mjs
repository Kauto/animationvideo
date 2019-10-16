import SceneNorm from "./Norm.mjs";
import calc from "../func/calc.mjs";

const clickTime = 300;

export default class SceneNormCamera extends SceneNorm {
  constructor(...args) {
    super(...args);
    this._events = [];
    this.camConfig = Object.assign(
      {},
      {
        zoomMax: 10,
        zoomMin: 0.5,
        zoomFactor: 1.2,
        tween: 2,
        registerEvents: true,
        preventDefault: true,
        enabled: true,
        callResize: true,
        doubleClickDetectInterval: 350,
        alternative: false
      },
      calc(this._configuration.cam) || {}
    );
    if (!this._configuration.click) {
      this._configuration.click = () => {};
    }
    this.toCam = {
      x: this.camConfig.currentX || 0,
      y: this.camConfig.currentY || 0,
      zoom: this.camConfig.currentZoom || 1
    };

    this._clampLimits = {
      _x1: -1,
      _y1: -1,
      _x2: 1,
      _y2: 1,
      _w: 2,
      _h: 2
    };

    this._mousePos = [];
  }

  camEnable() {
    this.camConfig.enabled = true;
    return this;
  }

  camDisable() {
    this.camConfig.enabled = false;
    return this;
  }

  camReset() {
    this.toCam = {
      x: 0,
      y: 0,
      zoom: 1
    };
    return this;
  }

  camTween(tween) {
    this.camConfig.tween = tween;
    return this;
  }

  camAlternative(bool) {
    this._mousePos = [];
    this.camConfig.alternative = bool;
    return this;
  }

  setClampLimit(x1, y1, x2, y2) {
    this._clampLimits = {
      _x1: x1,
      _y1: y1,
      _x2: x2,
      _y2: y2,
      _w: x2 - x1,
      _h: y2 - y1
    };
    return this;
  }

  callInit(output, parameter, engine) {
    if (this.camConfig.registerEvents) {
      this._registerCamEvents(output.canvas[0]);
    }
    return super.callInit(output, parameter, engine);
  }

  destroy(output) {
    if (this.camConfig.registerEvents) {
      this._destroyCamEvents();
    }
    return super.destroy(output);
  }

  hasCamChanged() {
    const t = this.camConfig.tween || 1;
    return (
      Math.abs(this.toCam.x - this.cam.x) >= Number.EPSILON * t ||
      Math.abs(this.toCam.y - this.cam.y) >= Number.EPSILON * t ||
      Math.abs(this.toCam.zoom - this.cam.zoom) >= Number.EPSILON * t
    );
  }

  fixedUpdate(output, timePassed, lastCall) {
    if (this.camConfig.tween && this.hasCamChanged()) {
      this.cam.x += (this.toCam.x - this.cam.x) / this.camConfig.tween;
      this.cam.y += (this.toCam.y - this.cam.y) / this.camConfig.tween;
      this.cam.zoom += (this.toCam.zoom - this.cam.zoom) / this.camConfig.tween;
      if (lastCall) {
        this._additionalModifier.cam = this.cam;
        if (this.camConfig.callResize) {
          super.resize(output);
        } else {
          this._transform = null;
          this._transformInvert = null;
        }
      }
    }
    return super.fixedUpdate(output, timePassed, lastCall);
  }

  move(output, timePassed) {
    const ret = super.move(output, timePassed);
    if (!this.camConfig.tween && this.hasCamChanged()) {
      this.cam = Object.assign({}, this.toCam);
      if (this.camConfig.callResize) {
        super.resize(output);
      } else {
        this._transform = null;
        this._transformInvert = null;
      }
    }
    return ret;
  }

  resize(output) {
    super.resize(output);
    this.clampView();
  }

  _registerCamEvents(element) {
    this._events = [
      [["touchstart", "mousedown"], this._mouseDown],
      [["touchend", "mouseup"], this._mouseUp],
      [["touchendoutside", "mouseout"], this._mouseOut],
      [["touchmove", "mousemove"], this._mouseMove],
      [["wheel"], this._mouseWheel],
      [["contextmenu"], this._eventPrevent]
    ]
      .map(([events, func]) =>
        events.map(e => ({
          _node: element,
          _event: e,
          _function: func.bind(this)
        }))
      )
      .flat(1);

    this._events.forEach(v => {
      v._node.addEventListener(v._event, v._function, true);
    });
  }

  _destroyCamEvents() {
    this._events.forEach(v => {
      v._node.removeEventListener(v._event, v._function, true);
    });
    this._events = [];
  }

  _eventPrevent(e) {
    e.preventDefault();
  }

  _getMousePosition(e) {
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
      return [
        touches.reduce((sum, v) => sum + v.pageX, 0) / length - rect.left,
        touches.reduce((sum, v) => sum + v.pageY, 0) / length - rect.top
      ];
    }
    if (e.offsetX === undefined) {
      const rect = e.target.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    }
    return [e.offsetX, e.offsetY];
  }

  _getMouseButton(e) {
    return this.camConfig.alternative
      ? e.which
        ? e.which - 1
        : e.button || 0
      : 0;
  }

  _mouseDown(e) {
    if (this.camConfig.preventDefault) e.preventDefault();
    const [mx, my] = this._getMousePosition(e);
    const i = this._getMouseButton(e);
    this._mousePos[i] = Object.assign({}, this._mousePos[i], {
      x: mx,
      y: my,
      _cx: this.toCam.x,
      _cy: this.toCam.y,
      _isDown: true,
      _numOfFingers: (e.touches && e.touches.length) || 1,
      _distance: undefined,
      _timestamp: Date.now()
    });
    if (this._configuration.mouseDown) {
      const [x, y] = this.transformPoint(mx, my);
      this._configuration.mouseDown({
        event: e,
        x,
        y,
        scene: this,
        engine: this._engine,
        imageManager: this._imageManager
      });
    }
  }
  _mouseUp(e) {
    if (this.camConfig.preventDefault) e.preventDefault();
    const i = this._getMouseButton(e);
    if (!this._mousePos[i]) {
      this._mousePos[i] = {};
    }
    const down = this._mousePos[i]._isDown;
    const numCurrentFingers =
      (e.changedTouches && e.changedTouches.length) || 1;
    const numOfFingers = Math.max(
      this._mousePos[i]._numOfFingers,
      numCurrentFingers
    );
    this._mousePos[i]._isDown = false;
    this._mousePos[i]._numOfFingers -= numCurrentFingers;

    const [mx, my] = this._getMousePosition(e);
    if (this._configuration.mouseUp) {
      const [x, y] = this.transformPoint(mx, my);
      this._configuration.mouseUp({
        event: e,
        x,
        y,
        scene: this,
        engine: this._engine,
        imageManager: this._imageManager
      });
    }

    if (!down || numOfFingers > 1) {
      return;
    }

    if (
      Date.now() - this._mousePos[i]._timestamp < clickTime &&
      Math.abs(this._mousePos[i].x - mx) < 5 &&
      Math.abs(this._mousePos[i].y - my) < 5 &&
      !i // i === 0
    ) {
      const [x, y] = this.transformPoint(mx, my);
      if (this._configuration.doubleClick) {
        if (this._mousePos[i].doubleClickTimer) {
          clearTimeout(this._mousePos[i].doubleClickTimer);
          this._mousePos[i].doubleClickTimer = undefined;
          this._configuration.doubleClick({
            event: e,
            x,
            y,
            scene: this,
            engine: this._engine,
            imageManager: this._imageManager
          });
        } else {
          this._mousePos[i].doubleClickTimer = setTimeout(() => {
            this._mousePos[i].doubleClickTimer = undefined;
            this._configuration.click({
              event: e,
              x,
              y,
              scene: this,
              engine: this._engine,
              imageManager: this._imageManager
            });
          }, this.camConfig.doubleClickDetectInterval);
        }
      } else {
        this._configuration.click({
          event: e,
          x,
          y,
          scene: this,
          engine: this._engine,
          imageManager: this._imageManager
        });
      }
    } else if (this.camConfig.alternative && !i /* i === 0 */) {
      const [x, y] = this.transformPoint(mx, my);
      const [ox, oy] = this.transformPoint(
        this._mousePos[i].x,
        this._mousePos[i].y
      );
      this._configuration.region &&
        this._configuration.region({
          event: e,
          x1: Math.min(ox, x),
          y1: Math.min(oy, y),
          x2: Math.max(ox, x),
          y2: Math.max(oy, y),
          fromX: ox,
          fromY: oy,
          toX: x,
          toY: y,
          scene: this
        });
    }
  }
  _mouseOut(e) {
    const i = this._getMouseButton(e);
    if (this._mousePos[i]) this._mousePos[i]._isDown = false;
    if (this._configuration.mouseOut) {
      this._configuration.mouseOut({
        event: e,
        scene: this,
        engine: this._engine,
        imageManager: this._imageManager
      });
    }
  }
  _mouseMove(e) {
    if (this.camConfig.preventDefault) e.preventDefault();
    const i = this._getMouseButton(e);
    const [mx, my] = this._getMousePosition(e);
    if (this._configuration.mouseMove) {
      const [x, y] = this.transformPoint(mx, my);
      this._configuration.mouseMove({
        event: e,
        x,
        y,
        scene: this,
        engine: this._engine,
        imageManager: this._imageManager
      });
    }
    if (
      !this._mousePos[i] ||
      !this._mousePos[i]._isDown ||
      (e.which === 0 && !e.touches)
    ) {
      return;
    }
    const scale = this._additionalModifier.scaleCanvas;
    if (this.camConfig.enabled) {
      if (e.touches && e.touches.length >= 2) {
        const t = e.touches;
        // get distance of two finger
        const distance = Math.sqrt(
          (t[0].pageX - t[1].pageX) * (t[0].pageX - t[1].pageX) +
            (t[0].pageY - t[1].pageY) * (t[0].pageY - t[1].pageY)
        );
        if (this._mousePos[i]._distance === undefined) {
          if (distance > 0) {
            this._mousePos[i]._distance = distance;
            this._mousePos[i]._czoom = this.toCam.zoom;
          }
        } else {
          this.toCam.zoom = Math.max(
            this.camConfig.zoomMin,
            Math.min(
              this.camConfig.zoomMax,
              (this._mousePos[i]._czoom * distance) /
                this._mousePos[i]._distance
            )
          );
          if (this.camConfig.alternative) {
            const viewMatrix = this._getViewportByCam(this.toCam).invert();
            const [ox, oy] = viewMatrix.transformPoint(
              this._mousePos[i].x * scale,
              this._mousePos[i].y * scale
            );
            const [nx, ny] = viewMatrix.transformPoint(mx * scale, my * scale);
            this.toCam.x = this._mousePos[i]._cx + ox - nx;
            this.toCam.y = this._mousePos[i]._cy + oy - ny;
          }
          this.clampView();
        }
        return;
      } else {
        this._mousePos[i]._distance = undefined;
        if (!this.camConfig.alternative || i === 2) {
          const viewMatrix = this._getViewportByCam(this.toCam).invert();
          const [ox, oy] = viewMatrix.transformPoint(
            this._mousePos[i].x * scale,
            this._mousePos[i].y * scale
          );
          const [nx, ny] = viewMatrix.transformPoint(mx * scale, my * scale);
          this.toCam.x = this._mousePos[i]._cx + ox - nx;
          this.toCam.y = this._mousePos[i]._cy + oy - ny;
          this.clampView();
        }
      }
    }
    if (
      this.camConfig.alternative &&
      i === 0 &&
      this._configuration.regionMove &&
      !(
        Date.now() - this._mousePos[i]._timestamp < clickTime &&
        Math.abs(this._mousePos[i].x - mx) < 5 &&
        Math.abs(this._mousePos[i].y - my) < 5
      ) &&
      (!e.touches || e.touches.length === 1)
    ) {
      const [x, y] = this.transformPoint(mx, my);
      const [ox, oy] = this.transformPoint(
        this._mousePos[i].x,
        this._mousePos[i].y
      );
      this._configuration.regionMove({
        event: e,
        x1: Math.min(ox, x),
        y1: Math.min(oy, y),
        x2: Math.max(ox, x),
        y2: Math.max(oy, y),
        fromX: ox,
        fromY: oy,
        toX: x,
        toY: y,
        scene: this
      });
    }
  }
  _mouseWheel(e) {
    if (this.camConfig.preventDefault) e.preventDefault();
    if (this.camConfig.enabled) {
      const scale = this._additionalModifier.scaleCanvas;
      const [mx, my] = this._getMousePosition(e);
      const [ox, oy] = this._getViewportByCam(this.toCam)
        .invert()
        .transformPoint(mx * scale, my * scale);
      const wheelData = e.wheelDelta || e.deltaY * -1;
      if (wheelData / 120 > 0) {
        this.zoomIn();
        const [nx, ny] = this._getViewportByCam(this.toCam)
          .invert()
          .transformPoint(mx * scale, my * scale);
        this.toCam.x -= nx - ox;
        this.toCam.y -= ny - oy;
        this.clampView();
      } else {
        this.zoomOut();
      }
    }
  }
  zoomIn() {
    this.toCam.zoom = Math.min(
      this.camConfig.zoomMax,
      this.toCam.zoom * this.camConfig.zoomFactor
    );
    return this;
  }
  zoomOut() {
    this.toCam.zoom = Math.max(
      this.camConfig.zoomMin,
      this.toCam.zoom / this.camConfig.zoomFactor
    );
    this.clampView();
    return this;
  }
  zoomTo(x1, y1, x2, y2) {
    const scale = this._additionalModifier.scaleCanvas;
    const invert = this._getViewportByCam(this.toCam).invert();
    const [sx1, sy1] = invert.transformPoint(0, 0);
    const [sx2, sy2] = invert.transformPoint(
      this._engine.getWidth() * scale,
      this._engine.getHeight() * scale
    );
    const sw = sx2 - sx1;
    const sh = sy2 - sy1;
    const w = x2 - x1;
    const h = y2 - y1;
    const mx = x1 + w / 2;
    const my = y1 + h / 2;
    const zoomX = sw / w;
    const zoomY = sh / h;
    this.toCam.x = mx;
    this.toCam.y = my;
    this.toCam.zoom =
      this.toCam.zoom * Math.max(Math.min(zoomX, zoomY), Number.MIN_VALUE);
    return this;
  }

  clampView() {
    const invert = this._getViewportByCam(this.toCam).invert();
    const [x1, y1] = invert.transformPoint(0, 0);
    const [x2, y2] = invert.transformPoint(
      this._engine.getWidth(),
      this._engine.getHeight()
    );

    // check for x
    // is there a zoom in?
    if (x2 - x1 <= this._clampLimits._w) {
      if (x1 < this._clampLimits._x1) {
        if (x2 <= this._clampLimits._x2) {
          this.toCam.x += this._clampLimits._x1 - x1;
        }
      } else {
        if (x2 > this._clampLimits._x2) {
          this.toCam.x += this._clampLimits._x2 - x2;
        }
      }
    } else {
      if (x1 > this._clampLimits._x1) {
        this.toCam.x += this._clampLimits._x1 - x1;
      } else {
        if (x2 < this._clampLimits._x2) {
          this.toCam.x += this._clampLimits._x2 - x2;
        }
      }
    }

    // check for y
    // zoom in?
    if (y2 - y1 <= this._clampLimits._h) {
      if (y1 < this._clampLimits._y1) {
        if (y2 <= this._clampLimits._y2) {
          this.toCam.y += this._clampLimits._y1 - y1;
        }
      } else {
        if (y2 > this._clampLimits._y2) {
          this.toCam.y += this._clampLimits._y2 - y2;
        }
      }
    } else {
      if (y1 > this._clampLimits._y1) {
        this.toCam.y += this._clampLimits._y1 - y1;
      } else {
        if (y2 < this._clampLimits._y2) {
          this.toCam.y += this._clampLimits._y2 - y2;
        }
      }
    }
    return this;
  }
}
