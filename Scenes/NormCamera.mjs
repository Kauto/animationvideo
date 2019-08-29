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
        enabled: true,
        callResize: true,
        doubleClickDetectInterval: 350
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

    this._mousePos = {
      _isDown: false,
      _timestamp: 0
    };
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
      this.toCam.x !== this.cam.x ||
      this.toCam.y !== this.cam.y ||
      this.toCam.zoom !== this.cam.zoom
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
  }

  _getMousePosition(e) {
    if (e && e.touches && e.touches.length > 0) {
      const rect = e.target.getBoundingClientRect();
      return [
        e.targetTouches[0].pageX - rect.left,
        e.targetTouches[0].pageY - rect.top
      ];
    }
    return [e.offsetX, e.offsetY];
  }

  _mouseDown(e) {
    const [mx, my] = this._getMousePosition(e);
    this._mousePos.x = mx;
    this._mousePos.y = my;
    this._mousePos._cx = this.toCam.x;
    this._mousePos._cy = this.toCam.y;
    this._mousePos._isDown = true;
    this._mousePos._distance = undefined;
    this._mousePos._timestamp = Date.now();
    
  }
  _mouseUp(e) {
    this._mousePos._isDown = false;
    const [mx, my] = this._getMousePosition(e);
    if (
      Date.now() - this._mousePos._timestamp < 150 &&
      Math.abs(this._mousePos.x - mx) < 5 &&
      Math.abs(this._mousePos.y - my) < 5
    ) {
      const [x, y] = this.transformPoint(mx, my);
      if (this._configuration.doubleClick) {
        if (this._mousePos.doubleClickTimer) {
          clearTimeout(this._mousePos.doubleClickTimer)
          this._mousePos.doubleClickTimer = undefined
          this._configuration.doubleClick(e, x, y);
        } else {
          this._mousePos.doubleClickTimer = setTimeout(()=>{
            this._mousePos.doubleClickTimer = undefined
            this._configuration.click(e, x, y);
          }, this._configuration.doubleClickDetectInterval);
        }
      } else {
        this._configuration.click(e, x, y);
      }
    }
  }
  _mouseOut(e) {
    this._mousePos._isDown = false;
  }
  _mouseMove(e) {
    if (e && this.camConfig.enabled && this._mousePos._isDown) {
      if (e.touches && e.touches.length >= 2) {
        const t = e.touches;
        // Abstand der zwei Finger ausrechnen
        const distance = Math.sqrt(
          (t[0].pageX - t[1].pageX) * (t[0].pageX - t[1].pageX) +
            (t[0].pageY - t[1].pageY) * (t[0].pageY - t[1].pageY)
        );
        if (this._mousePos._distance !== undefined) {
          if (distance > this._mousePos._distance) {
            this.zoomIn();
          } else if (distance < this._mousePos._distance) {
            this.zoomOut();
          }
        }
        this._mousePos._distance = distance;
      } else {
        this._mousePos._distance = undefined;
        const [mx, my] = this._getMousePosition(e);
        const viewMatrix = this._getViewportByCam(this.toCam).invert();
        const [ox, oy] = viewMatrix.transformPoint(
          this._mousePos.x,
          this._mousePos.y
        );
        const [nx, ny] = viewMatrix.transformPoint(mx, my);
        this.toCam.x = this._mousePos._cx + ox - nx;
        this.toCam.y = this._mousePos._cy + oy - ny;
        this.clampView();
      }
    }
  }
  _mouseWheel(e) {
    if (e && this.camConfig.enabled) {
      e.preventDefault();
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