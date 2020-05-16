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

  hasCamChanged() {
    const t = this.config.tween || 1;
    return (
      Math.abs(this.toCam.x - this._scene.camera.cam.x) >= Number.EPSILON * t ||
      Math.abs(this.toCam.y - this._scene.camera.cam.y) >= Number.EPSILON * t ||
      Math.abs(this.toCam.zoom - this._scene.camera.cam.zoom) >=
        Number.EPSILON * t
    );
  }

  update({ scene }) {
    // play animation
  }

  camInstant() {
    this._instant = true;
  }
}
