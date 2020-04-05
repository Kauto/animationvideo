import CameraControl from "./CameraControl.mjs";

export default class CameraControlSecondButton extends CameraControl {
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

    if (!(
      Date.now() - this._mousePos[i]._timestamp < clickTime &&
      Math.abs(this._mousePos[i].x - mx) < 5 &&
      Math.abs(this._mousePos[i].y - my) < 5 &&
      !i // i === 0
    )) {
      scene.stopPropagation();
      const [x, y] = this.transformPoint(mx, my);
      const [ox, oy] = this.transformPoint(
        this._mousePos[i].x,
        this._mousePos[i].y
      );
      scene.map('region',{
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

        const viewMatrix = scene.camera.viewportByCam(arguments[0], this.toCam).invert();
        const [ox, oy] = viewMatrix.transformPoint(
          this._mousePos[i].x * scale,
          this._mousePos[i].y * scale
        );
        const [nx, ny] = viewMatrix.transformPoint(mx * scale, my * scale);
        this.toCam.x = this._mousePos[i]._cx + ox - nx;
        this.toCam.y = this._mousePos[i]._cy + oy - ny;

        this.toCam = scene.camera.clampView(arguments[0], this.toCam);
      }
      return;
    } else {
      this._mousePos[i]._distance = undefined;
      
      if (i === 2) {
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
    
    if (
      i === 0 &&
      scene.has('regionMove') &&
      !(
        Date.now() - this._mousePos[i]._timestamp < clickTime &&
        Math.abs(this._mousePos[i].x - mx) < 5 &&
        Math.abs(this._mousePos[i].y - my) < 5
      ) &&
      (!e.touches || e.touches.length === 1)
    ) {
      const [x, y] = scene.transformPoint(mx, my);
      const [ox, oy] = scene.transformPoint(
        this._mousePos[i].x,
        this._mousePos[i].y
      );
      scene.map('regionMove', {
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