'use strict';
import Scene from './Default';
import Transform from '../../func/transform';

export default class SceneNorm extends Scene {
  constructor(endTime) {
    super(endTime);
    this.transform = null;
    this.transformInvert = null;
  }

  _getViewport() {
    if (!this.engine) return new Transform();

    if (!this.transform) {
        this.additionalModifier = {
          a: 1,
          w: this.engine._output.w / 2,
          h: this.engine._output.h / 2
        };
        const scale = this.engine._output.ratio > 1 ? this.additionalModifier.w : this.additionalModifier.h;

      this.transform = (new Transform())
        .translate(this.additionalModifier.w, this.additionalModifier.h)
        .scale(scale, scale);
      this.transformInvert = null;

      // Maybe move a cam in the future
      //			output.context.scale(cam.zoom,cam.zoom);
      //			output.context.translate(-cam.centerX,-cam.centerY);
      //output.context.translate(-0.5,-0.5);
    }
    return this.transform
  }

  transformPoint(x, y) {
    if (!this.transformInvert) {
      this.transformInvert = this._getViewport().clone().invert()
    }
    return this.transformInvert.transformPoint(x, y);
  }

  draw(output) {
    output.context.save();

    output.context.setTransform(...this._getViewport().m);

    super.draw(output);
    output.context.restore();
  }

}
