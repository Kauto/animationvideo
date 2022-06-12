import type Scene from "../Scene";
import type { ConfigurationObject, ParameterList, ParameterListFixedUpdate, ParameterListInitDestroy, ParameterListPositionEvent, ParameterListWithoutTime, RectPosition } from "../Scene";
import type { CameraPosition } from "./Camera";

export interface MiddlewareCameraControlOptions {
  zoomMax: number
  zoomMin: number
  zoomFactor: number
  tween: number
  callResize: boolean
}

const clickTime = 300;
export default class CameraControl implements ConfigurationObject {
  type = "control"
  _mousePos: Record<number, {
    x: number
    y: number
    _cx: number
    _cy: number
    _isDown: boolean
    _numOfFingers: number
    _distance: undefined | number
    _timestamp: number
    _czoom: undefined | number
  }> = {}
  toCam: CameraPosition = {
    zoom: 1,
    x: 0,
    y: 0
  }
  _config: MiddlewareCameraControlOptions
  _scene: Scene | undefined
  _instant: boolean = false

  constructor(config: Partial<MiddlewareCameraControlOptions> = {}) {
    this._config = Object.assign(
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

  init({ scene }: ParameterListInitDestroy) {
    this._scene = scene
    this.toCam = Object.assign({}, scene.camera.cam);
  }

  mouseDown({ event: e, position: [mx, my], button: i }: ParameterListPositionEvent) {
    this._mousePos[i] = Object.assign({}, this._mousePos[i], {
      x: mx,
      y: my,
      _cx: this.toCam.x,
      _cy: this.toCam.y,
      _isDown: true,
      _numOfFingers: (e as TouchEvent).touches?.length || 1,
      _distance: undefined,
      _timestamp: Date.now(),
    });
  }

  mouseUp({ event: e, position: [mx, my], button: i, scene }: ParameterListPositionEvent) {
    if (!this._mousePos[i]) {
      delete this._mousePos[i];
    }
    const down = this._mousePos[i]._isDown;
    const numCurrentFingers =
      (e as TouchEvent).changedTouches?.length || 1;
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
          i === 1
        ) // i === 0
      )
    ) {
      scene.stopPropagation();
    }
  }

  mouseOut({ button: i }: ParameterListPositionEvent) {
    if (this._mousePos[i]) this._mousePos[i]._isDown = false;
  }

  mouseMove({ event: e, position: [mx, my], button: i, scene }: ParameterListPositionEvent) {
    if (
      !this._mousePos[i] ||
      !this._mousePos[i]._isDown ||
      ((e as TouchEvent).which === 0 && !(e as TouchEvent).touches)
    ) {
      return;
    }
    const scale = scene.additionalModifier.scaleCanvas;
    if ((e as TouchEvent).touches?.length >= 2) {
      const t = (e as TouchEvent).touches;
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
          this._config.zoomMin,
          Math.min(
            this._config.zoomMax,
            (this._mousePos[i]._czoom! * distance) / this._mousePos[i]._distance!
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

  mouseWheel({ event: e, position: [mx, my], scene }: ParameterListPositionEvent) {
    const scale = scene.additionalModifier.scaleCanvas;
    const [ox, oy] = scene.camera
      .viewportByCam(arguments[0], this.toCam)
      .invert()
      .transformPoint(mx * scale, my * scale);
    // @ts-ignore
    const wheelData = (e as WheelEvent).wheelDelta || (e as WheelEvent).deltaY * -1;
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
    const t = this._config.tween || 1;
    return (
      Math.abs(this.toCam.x - this._scene!.camera.cam.x) >= Number.EPSILON * t ||
      Math.abs(this.toCam.y - this._scene!.camera.cam.y) >= Number.EPSILON * t ||
      Math.abs(this.toCam.zoom - this._scene!.camera.cam.zoom) >=
      Number.EPSILON * t
    );
  }

  fixedUpdate({ scene, lastCall }: ParameterListFixedUpdate) {
    if (this._config.tween && !this._instant && this.hasCamChanged()) {
      scene.camera.cam.x +=
        (this.toCam.x - scene.camera.cam.x) / this._config.tween;
      scene.camera.cam.y +=
        (this.toCam.y - scene.camera.cam.y) / this._config.tween;
      scene.camera.cam.zoom +=
        (this.toCam.zoom - scene.camera.cam.zoom) / this._config.tween;
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

  update({ scene }: ParameterList) {
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

  resize(args: ParameterListWithoutTime& { clampLimits?: RectPosition }) {
    this.toCam = args.scene.camera.clampView(args, this.toCam);
  }

  zoomToNorm() {
    this.toCam.zoom = 1;
    return this;
  }
  zoomIn() {
    this.toCam.zoom = Math.min(
      this._config.zoomMax,
      this.toCam.zoom * this._config.zoomFactor
    );
    return this;
  }
  zoomOut(args: ParameterListWithoutTime & { clampLimits?: RectPosition }) {
    this.toCam.zoom = Math.max(
      this._config.zoomMin,
      this.toCam.zoom / this._config.zoomFactor
    );
    this.toCam = args.scene.camera.clampView(args, this.toCam);
    return this;
  }

  zoomTo(params: ParameterListWithoutTime & RectPosition) {
    params.scene.camera.zoomTo(Object.assign(
      params, {cam:this.toCam}
    ));
  }
}
