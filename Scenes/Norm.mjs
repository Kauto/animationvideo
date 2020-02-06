import Scene from "./Default.mjs";
import Transform from "../func/transform.mjs";

export default class SceneNorm extends Scene {
  constructor(...args) {
    super(...args);
    this._transform = null;
    this._transformInvert = null;
    this.cam = {
      zoom: 1,
      x: 0,
      y: 0
    };
  }

  _getViewport() {
    if (!this._engine) return new Transform();

    if (!this._transform) {
      this._transform = this._getViewportByCam(this.cam);
      this._transformInvert = null;
    }
    return this._transform;
  }

  _getViewportByCam(cam) {
    const hw = this._engine.getWidth() / 2;
    const hh = this._engine.getHeight() / 2;
    const scale = this._engine.getRatio() > 1 ? hw : hh;
    return new Transform()
      .translate(hw, hh)
      .scale(scale, scale)
      .scale(cam.zoom, cam.zoom)
      .translate(-cam.x, -cam.y);
  }

  resize(output) {
    this._transform = null;
    this._transformInvert = null;
    this._additionalModifier = {
      alpha: 1,
      x: -1,
      y: -1,
      width: 2,
      height: 2,
      widthInPixel: output.width,
      heightInPixel: output.height,
      scaleCanvas: output.width / output.canvas[0].clientWidth
    };
    const [x1, y1] = this.transformPoint(0, 0, 1);
    const [x2, y2] = this.transformPoint(output.width, output.height, 1);
    this._additionalModifier.visibleScreen = {
      x: x1,
      y: y1,
      width: x2 - x1,
      height: y2 - y1
    };
    const transformInvert = this._getViewportByCam({ x: 0, y: 0, zoom: 1 }).invert();
    const [sx1, sy1] = transformInvert.transformPoint(0, 0, 1);
    const [sx2, sy2] = transformInvert.transformPoint(output.width, output.height, 1);
    this._additionalModifier.fullScreen = {
      x: sx1,
      y: sy1,
      width: sx2 - sx1,
      height: sy2 - sy1
    };
    this._additionalModifier.cam = this.cam;
    this._layerManager.forEach(({ layer, element, isFunction, index }) => {
      if (!isFunction) {
        element.resize(output, this._additionalModifier);
      }
    });
  }

  transformPoint(x, y, scale = this._additionalModifier.scaleCanvas) {
    if (!this._transformInvert) {
      this._transformInvert = this._getViewport()
        .clone()
        .invert();
    }
    return this._transformInvert.transformPoint(x * scale, y * scale);
  }

  draw(output, canvasId) {
    const ctx = output.context[canvasId];
    ctx.save();

    ctx.setTransform(...this._getViewport().m);

    super.draw(output, canvasId);
    ctx.restore();
  }
}
