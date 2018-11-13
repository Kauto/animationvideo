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
        const hw = this.engine._output.w / 2
        const hh = this.engine._output.h / 2
        const scale = this.engine._output.ratio > 1 ? hw : hh;

      this.transform = (new Transform())
        .translate(hw, hh)
        .scale(scale, scale);
      this.transformInvert = null;

      // Maybe move a cam in the future
      //			output.context.scale(cam.zoom,cam.zoom);
      //			output.context.translate(-cam.centerX,-cam.centerY);
      //output.context.translate(-0.5,-0.5);
    }
    return this.transform
  }

  resize(output) {
    this.transform = undefined;
    this.additionalModifier = {
      a: 1,
      x: -1,
      y: -1,
      w: 2,
      h: 2,
      orgW: output.w,
      orgH: output.h
    };
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
