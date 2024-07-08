import {ParameterListPositionEvent} from "../Scene.js";
import CameraControl from "./CameraControl.js";
const clickTime = 300;

export default class CameraControlSecondButton extends CameraControl {
  mouseUp({
    event: e,
    position: [mx, my],
    button: i,
    scene,
  }: ParameterListPositionEvent) {
    if (!this._mousePos[i]) {
      delete this._mousePos[i];
    }
    const down = this._mousePos[i]._isDown;
    const numCurrentFingers = (e as TouchEvent).changedTouches?.length || 1;
    const numOfFingers = Math.max(
      this._mousePos[i]._numOfFingers,
      numCurrentFingers,
    );
    this._mousePos[i]._isDown = false;
    this._mousePos[i]._numOfFingers -= numCurrentFingers;

    if (!down || numOfFingers > 1) {
      scene.stopPropagation();
      return;
    }

    if (
      (Date.now() - this._mousePos[i]._timestamp > clickTime ||
        Math.abs(this._mousePos[i].x - mx) >= 5 ||
        Math.abs(this._mousePos[i].y - my) >= 5) &&
      i === 1
    ) {
      scene.stopPropagation();
      const [x, y] = scene.transformPoint(mx, my);
      const [ox, oy] = scene.transformPoint(
        this._mousePos[i].x,
        this._mousePos[i].y,
      );
      scene.map("region", {
        event: e,
        x1: Math.min(ox, x),
        y1: Math.min(oy, y),
        x2: Math.max(ox, x),
        y2: Math.max(oy, y),
        fromX: ox,
        fromY: oy,
        toX: x,
        toY: y,
      });
    }
  }

  mouseMove(props: ParameterListPositionEvent) {
    const {
      event: e,
      position: [mx, my],
      button: i,
      scene,
    } = props;
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
          (t[0].pageY - t[1].pageY) * (t[0].pageY - t[1].pageY),
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
            (this._mousePos[i]._czoom! * distance) /
              this._mousePos[i]._distance!,
          ),
        );

        const viewMatrix = scene.camera
          .viewportByCam(props, this.toCam)
          .invert();
        const [ox, oy] = viewMatrix.transformPoint(
          this._mousePos[i].x * scale,
          this._mousePos[i].y * scale,
        );
        const [nx, ny] = viewMatrix.transformPoint(mx * scale, my * scale);
        this.toCam.x = this._mousePos[i]._cx + ox - nx;
        this.toCam.y = this._mousePos[i]._cy + oy - ny;

        this.toCam = scene.camera.clampView(props, this.toCam);
      }
      return;
    } else {
      this._mousePos[i]._distance = undefined;
      if (i === 2) {
        const viewMatrix = scene.camera
          .viewportByCam(props, this.toCam)
          .invert();
        const [ox, oy] = viewMatrix.transformPoint(
          this._mousePos[i].x * scale,
          this._mousePos[i].y * scale,
        );
        const [nx, ny] = viewMatrix.transformPoint(mx * scale, my * scale);
        this.toCam.x = this._mousePos[i]._cx + ox - nx;
        this.toCam.y = this._mousePos[i]._cy + oy - ny;

        this.toCam = scene.camera.clampView(props, this.toCam);
      }
    }

    if (
      i === 1 &&
      scene.has("regionMove") &&
      !(
        Date.now() - this._mousePos[i]._timestamp < clickTime &&
        Math.abs(this._mousePos[i].x - mx) < 5 &&
        Math.abs(this._mousePos[i].y - my) < 5
      ) &&
      (!(e as TouchEvent).touches || (e as TouchEvent).touches.length === 1)
    ) {
      const [x, y] = scene.transformPoint(mx, my);
      const [ox, oy] = scene.transformPoint(
        this._mousePos[i].x,
        this._mousePos[i].y,
      );
      scene.map("regionMove", {
        event: e,
        x1: Math.min(ox, x),
        y1: Math.min(oy, y),
        x2: Math.max(ox, x),
        y2: Math.max(oy, y),
        fromX: ox,
        fromY: oy,
        toX: x,
        toY: y,
      });
    }
  }
}
