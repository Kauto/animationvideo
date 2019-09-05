import SceneNorm from "./Norm.mjs";
import calc from "../func/calc.mjs";

export default class SceneNormCamera extends SceneNorm {
  constructor(...args) {
    super(...args);
    this.camConfig = Object.assign(
      {},
      {
        zoomMax: 10,
        zoomMin: 0.5,
        zoomFactor: 1.2,
        tween: 4,
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
      x: 0,
      y: 0,
      zoom: 1
    };

    this._mousePos = [];
  }

  camEnable() {
    this.camConfig.enabled = true;
  }

  camDisable() {
    this.camConfig.enabled = false;
  }

  camReset() {
    this.toCam = {
      x: 0,
      y: 0,
      zoom: 1
    };
  }

  camTween(tween) {
    this.camConfig.tween = tween;
  }

  camAlternative(bool) {
    this._mousePos = [];
    this.camConfig.alternative = bool;
  }

  callInit(output, parameter, engine) {
    if (this.camConfig.registerEvents) {
      this.registerCamEvents(output.canvas);
    }
    return super.callInit(output, parameter, engine);
  }

  destroy(output) {
    if (this.camConfig.registerEvents) {
      this.destroyCamEvents(output.canvas);
    }
    return super.destroy(output);
  }

  _hasCamChanged() {
    return (
      Math.abs(this.toCam.x - this.cam.x) >= Number.EPSILON ||
      Math.abs(this.toCam.y - this.cam.y) >= Number.EPSILON ||
      Math.abs(this.toCam.zoom - this.cam.zoom) >= Number.EPSILON
    );
  }

  fixedUpdate(output, timePassed, lastCall) {
    const ret = super.fixedUpdate(output, timePassed);
    if (this.camConfig.tween && this._hasCamChanged()) {
      this.cam.x += (this.toCam.x - this.cam.x) / this.camConfig.tween;
      this.cam.y += (this.toCam.y - this.cam.y) / this.camConfig.tween;
      this.cam.zoom += (this.toCam.zoom - this.cam.zoom) / this.camConfig.tween;
      if (lastCall) {
        if (this.camConfig.callResize) {
          this.resize(output);
        } else {
          this.transform = null;
          this.transformInvert = null;
        }
      }
    }
    return ret;
  }

  move(output, timePassed) {
    const ret = super.move(output, timePassed);
    if (!this.camConfig.tween && this._hasCamChanged()) {
      this.cam = Object.assign({}, this.toCam);
      if (this.camConfig.callResize) {
        this.resize(output);
      } else {
        this.transform = null;
        this.transformInvert = null;
      }
    }
    return ret;
  }

  registerCamEvents(element) {
    for (const eventName of ["touchstart", "mousedown"]) {
      element.addEventListener(eventName, this._mouseDown.bind(this), true);
    }
    for (const eventName of ["touchend", "mouseup"]) {
      element.addEventListener(eventName, this._mouseUp.bind(this), true);
    }
    for (const eventName of ["touchendoutside", "mouseout"]) {
      element.addEventListener(eventName, this._mouseOut.bind(this), true);
    }
    for (const eventName of ["touchmove", "mousemove"]) {
      element.addEventListener(eventName, this._mouseMove.bind(this), true);
    }
    element.addEventListener("mousewheel", this._mouseWheel.bind(this), true);
    element.addEventListener("contextmenu", this._eventPrevent, true);
  }

  destroyCamEvents(element) {
    for (const eventName of ["touchstart", "mousedown"]) {
      element.removeEventListener(eventName, this._mouseDown, true);
    }
    for (const eventName of ["touchend", "mouseup"]) {
      element.removeEventListener(eventName, this._mouseUp, true);
    }
    for (const eventName of ["touchendoutside", "mouseout"]) {
      element.removeEventListener(eventName, this._mouseOut, true);
    }
    for (const eventName of ["touchmove", "mousemove"]) {
      element.removeEventListener(eventName, this._mouseMove, true);
    }
    element.removeEventListener("mousewheel", this._mouseWheel, true);
    element.removeEventListener("contextmenu", this._eventPrevent, true);
  }

  _eventPrevent(e) {
    e.preventDefault();
  }

  _getMousePosition(e) {
    if (e.touches && e.touches.length > 0) {
      const rect = e.target.getBoundingClientRect();
      const length = e.targetTouches.length;
      return [
        e.targetTouches.reduce((sum, v) => sum + v.pageX, 0) / length -
          rect.left,
        e.targetTouches.reduce((sum, v) => sum + v.pageY, 0) / length - rect.top
      ];
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
      _distance: undefined,
      _timestamp: Date.now()
    });
  }
  _mouseUp(e) {
    if (this.camConfig.preventDefault) e.preventDefault();
    const i = this._getMouseButton(e);
    this._mousePos[i]._isDown = false;
    const [mx, my] = this._getMousePosition(e);
    if (
      Date.now() - this._mousePos[i]._timestamp < 150 &&
      Math.abs(this._mousePos[i].x - mx) < 5 &&
      Math.abs(this._mousePos[i].y - my) < 5 &&
      i == 0
    ) {
      const [x, y] = this.transformPoint(mx, my);
      if (this._configuration.doubleClick) {
        if (this._mousePos[i].doubleClickTimer) {
          clearTimeout(this._mousePos[i].doubleClickTimer);
          this._mousePos[i].doubleClickTimer = undefined;
          this._configuration.doubleClick({ event: e, x, y, scene: this });
        } else {
          this._mousePos[i].doubleClickTimer = setTimeout(() => {
            this._mousePos[i].doubleClickTimer = undefined;
            this._configuration.click({ event: e, x, y, scene: this });
          }, this.camConfig.doubleClickDetectInterval);
        }
      } else {
        this._configuration.click({ event: e, x, y, scene: this });
      }
    } else if (this.camConfig.alternative && i === 0) {
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
    this._mousePos[i]._isDown = false;
  }
  _mouseMove(e) {
    const i = this._getMouseButton(e);
    if (this.camConfig.preventDefault) e.preventDefault();
    if (!this._mousePos[i] || !this._mousePos[i]._isDown || e.which === 0) {
      return;
    }
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
              this._mousePos[i].x,
              this._mousePos[i].y
            );
            const [nx, ny] = viewMatrix.transformPoint(
              ...this._getMousePosition(e)
            );
            this.toCam.x = this._mousePos[i]._cx + ox - nx;
            this.toCam.y = this._mousePos[i]._cy + oy - ny;
          }
          this.clampView();
        }
      } else {
        this._mousePos[i]._distance = undefined;
        if (!this.camConfig.alternative || i === 2) {
          const viewMatrix = this._getViewportByCam(this.toCam).invert();
          const [ox, oy] = viewMatrix.transformPoint(
            this._mousePos[i].x,
            this._mousePos[i].y
          );
          const [nx, ny] = viewMatrix.transformPoint(
            ...this._getMousePosition(e)
          );
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
      Date.now() - this._mousePos[i]._timestamp >= 150
    ) {
      const [x, y] = this.transformPoint(...this._getMousePosition(e));
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
      const [mx, my] = this._getMousePosition(e);
      const [ox, oy] = this._getViewportByCam(this.toCam)
        .invert()
        .transformPoint(mx, my);
      const wheelData = e.wheelDelta || e.deltaY * -1;
      if (wheelData / 120 > 0) {
        this.zoomIn();
        const [nx, ny] = this._getViewportByCam(this.toCam)
          .invert()
          .transformPoint(mx, my);
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
  }
  zoomOut() {
    this.toCam.zoom = Math.max(
      this.camConfig.zoomMin,
      this.toCam.zoom / this.camConfig.zoomFactor
    );
    this.clampView();
  }
  zoomTo(x1, y1, x2, y2) {
    const invert = this._getViewportByCam(this.toCam).invert();
    const [sx1, sy1] = invert.transformPoint(0, 0);
    const [sx2, sy2] = invert.transformPoint(
      this.engine.getWidth(),
      this.engine.getHeight()
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
  }

  clampView = function() {
    const invert = this._getViewportByCam(this.toCam).invert();
    const [x1, y1] = invert.transformPoint(0, 0);
    const [x2, y2] = invert.transformPoint(
      this.engine.getWidth(),
      this.engine.getHeight()
    );

    // check for x
    // is there a zoom in?
    if (x2 - x1 <= 2) {
      if (x1 < -1) {
        if (x2 <= 1) {
          this.toCam.x += -1 - x1;
        }
      } else {
        if (x2 > 1) {
          this.toCam.x += 1 - x2;
        }
      }
    } else {
      if (x1 > -1) {
        this.toCam.x += -1 - x1;
      } else {
        if (x2 < 1) {
          this.toCam.x += 1 - x2;
        }
      }
    }

    // check for y
    // zoom in?
    if (y2 - y1 <= 2) {
      if (y1 < -1) {
        if (y2 <= 1) {
          this.toCam.y += -1 - y1;
        }
      } else {
        if (y2 > 1) {
          this.toCam.y += 1 - y2;
        }
      }
    } else {
      if (y1 > -1) {
        this.toCam.y += -1 - y1;
      } else {
        if (y2 < 1) {
          this.toCam.y += 1 - y2;
        }
      }
    }
  };
}
