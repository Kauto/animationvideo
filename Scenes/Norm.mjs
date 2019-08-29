import Scene from "./Default.mjs";
import Transform from "../func/transform.mjs";

export default class SceneNorm extends Scene {
  constructor(...args) {
    super(...args);
    this.transform = null;
    this.transformInvert = null;
    this.cam = {
      zoom: 1,
      x: 0,
      y: 0
    };
  }

  _getViewport() {
    if (!this.engine) return new Transform();

    if (!this.transform) {
      this.transform = this._getViewportByCam(this.cam);
      this.transformInvert = null;
    }
    return this.transform;
  }

  _getViewportByCam(cam) {
    const hw = this.engine.getWidth() / 2;
    const hh = this.engine.getHeight() / 2;
    const scale = this.engine.getRatio() > 1 ? hw : hh;
    return new Transform()
      .translate(hw, hh)
      .scale(scale, scale)
      .scale(cam.zoom, cam.zoom)
      .translate(-cam.x, -cam.y);
  }

  resize(output) {
    this.transform = null;
    this.transformInvert = null;
    this.additionalModifier = {
      alpha: 1,
      x: -1,
      y: -1,
      width: 2,
      height: 2,
      widthInPixel: output.width,
      heightInPixel: output.height,
      scaleCanvas: output.width / output.canvas.clientWidth
    };
    const [x1, y1] = this.transformPoint(0, 0, 1);
    const [x2, y2] = this.transformPoint(output.width, output.height, 1);
    this.additionalModifier.visibleScreen = {
      x: x1,
      y: y1,
      width: x2 - x1,
      height: y2 - y1
    };
    this.layerManager.forEach(({ layer, element, isFunction, index }) => {
      if (!isFunction) {
        element.resize(output, this.additionalModifier);
      }
    });
  }

  transformPoint(x, y, scale = this.additionalModifier.scaleCanvas) {
    if (!this.transformInvert) {
      this.transformInvert = this._getViewport()
        .clone()
        .invert();
    }
    return this.transformInvert.transformPoint(x * scale, y * scale);
  }

  draw(output) {
    output.context.save();

    output.context.setTransform(...this._getViewport().m);

    super.draw(output);
    output.context.restore();
  }
}
