import SceneAudio from "./Audio.mjs";

export default class SceneNormAudio extends SceneAudio {
  constructor(...args) {
    super(...args);
    this._transform = null;
    this._transformInvert = null;
  }

  _getViewport() {
    if (!this._engine) return new Transform();

    if (!this._transform) {
      const hw = this._engine.getWidth() / 2;
      const hh = this._engine.getHeight() / 2;
      const scale = this._engine.getRatio() > 1 ? hw : hh;

      this._transform = new Transform().translate(hw, hh).scale(scale, scale);
      this._transformInvert = null;
    }
    return this._transform;
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
      scaleCanvas: output.width / output.canvas.clientWidth
    };
    const [x1, y1] = this.transformPoint(0, 0, 1);
    const [x2, y2] = this.transformPoint(output.width, output.height, 1);
    this._additionalModifier.fullScreen = this._additionalModifier.visibleScreen = {
      x: x1,
      y: y1,
      width: x2 - x1,
      height: y2 - y1
    };

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

  draw(output) {
    output.context.save();

    output.context.setTransform(...this._getViewport().m);

    super.draw(output);
    output.context.restore();
  }
}
