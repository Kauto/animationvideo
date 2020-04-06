const clickTime = 300;
export default class CameraControl {
  constructor(config = {}) {
    this.type = "control";
    this._mousePos = {};
    this.toCam = {};
    this.config = Object.assign(
      {
        zoomMax: 10,
        zoomMin: 0.5,
        zoomFactor: 1.2,
        tween: 2,
        callResize: true,
      },
      config
    );
  }

  init({ scene }) {
    this._scene = scene;
    this.toCam = Object.assign({}, scene.camera.cam);
  }

  mouseDown({ event: e, position: [mx, my], button: i }) {
    this._mousePos[i] = Object.assign({}, this._mousePos[i], {
      x: mx,
      y: my,
      _cx: this.toCam.x,
      _cy: this.toCam.y,
      _isDown: true,
      _numOfFingers: (e.touches && e.touches.length) || 1,
      _distance: undefined,
      _timestamp: Date.now(),
    });
  }

  mouseUp({ event: e, position: [mx, my], button: i, scene }) {
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

    if (!down || numOfFingers > 1) {
      scene.stopPropagation();
      return;
    }

    if (
      !(
        (
          Date.now() - this._mousePos[i]._timestamp < clickTime &&
          Math.abs(this._mousePos[i].x - mx) < 5 &&
          Math.abs(this._mousePos[i].y - my) < 5 &&
          !i
        ) // i === 0
      )
    ) {
      scene.stopPropagation();
    }
  }

  mouseOut({ button: i }) {
    if (this._mousePos[i]) this._mousePos[i]._isDown = false;
  }

  mouseMove({ event: e, position: [mx, my], button: i, scene }) {
    if (
      !this._mousePos[i] ||
      !this._mousePos[i]._isDown ||
      (e.which === 0 && !e.touches)
    ) {
      return;
    }
    const scale = scene.additionalModifier.scaleCanvas;
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
          this.config.zoomMin,
          Math.min(
            this.config.zoomMax,
            (this._mousePos[i]._czoom * distance) / this._mousePos[i]._distance
          )
        );

        this.toCam = scene.camera.clampView(arguments[0], this.toCam);
      }
      return;
    } else {
      this._mousePos[i]._distance = undefined;
      const viewMatrix = scene.camera
        .viewportByCam(arguments[0], this.toCam)
        .invert();
      const [ox, oy] = viewMatrix.transformPoint(
        this._mousePos[i].x * scale,
        this._mousePos[i].y * scale
      );
      const [nx, ny] = viewMatrix.transformPoint(mx * scale, my * scale);
      this.toCam.x = this._mousePos[i]._cx + ox - nx;
      this.toCam.y = this._mousePos[i]._cy + oy - ny;

      this.toCam = scene.camera.clampView(arguments[0], this.toCam);
    }
  }

  mouseWheel({ event: e, position: [mx, my], scene }) {
    const scale = scene.additionalModifier.scaleCanvas;
    const [ox, oy] = scene.camera
      .viewportByCam(arguments[0], this.toCam)
      .invert()
      .transformPoint(mx * scale, my * scale);
    const wheelData = e.wheelDelta || e.deltaY * -1;
    if (wheelData / 120 > 0) {
      this.zoomIn();
      const [nx, ny] = scene.camera
        .viewportByCam(arguments[0], this.toCam)
        .invert()
        .transformPoint(mx * scale, my * scale);
      this.toCam.x -= nx - ox;
      this.toCam.y -= ny - oy;
      this.toCam = scene.camera.clampView(arguments[0], this.toCam);
    } else {
      this.zoomOut(arguments[0]);
    }
  }

  hasCamChanged() {
    const t = this.config.tween || 1;
    return (
      Math.abs(this.toCam.x - this._scene.camera.cam.x) >= Number.EPSILON * t ||
      Math.abs(this.toCam.y - this._scene.camera.cam.y) >= Number.EPSILON * t ||
      Math.abs(this.toCam.zoom - this._scene.camera.cam.zoom) >=
        Number.EPSILON * t
    );
  }

  fixedUpdate({ scene, lastCall }) {
    if (this.config.tween && !this._instant && this.hasCamChanged()) {
      scene.camera.cam.x +=
        (this.toCam.x - scene.camera.cam.x) / this.config.tween;
      scene.camera.cam.y +=
        (this.toCam.y - scene.camera.cam.y) / this.config.tween;
      scene.camera.cam.zoom +=
        (this.toCam.zoom - scene.camera.cam.zoom) / this.config.tween;
      if (lastCall) {
        scene.additionalModifier.cam = this.cam;
        if (this.config.callResize) {
          scene.resize();
        } else {
          scene.cacheClear();
        }
      }
    }
  }

  update({ scene }) {
    if ((!this.config.tween || this._instant) && this.hasCamChanged()) {
      this._instant = false;
      scene.camera.cam = Object.assign({}, this.toCam);
      if (this.config.callResize) {
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
    this.toCam.zoom = Math.min(
      this.config.zoomMax,
      this.toCam.zoom * this.config.zoomFactor
    );
    return this;
  }
  zoomOut(args) {
    this.toCam.zoom = Math.max(
      this.config.zoomMin,
      this.toCam.zoom / this.config.zoomFactor
    );
    if (args) this.toCam = this._scene.camera.clampView(args, this.toCam);
    return this;
  }

  zoomTo(params) {
    params.cam = this.toCam;
    params.scene.camera.zoomTo(params);
  }
}
