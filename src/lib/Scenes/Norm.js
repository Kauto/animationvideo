'use strict';
import Scene from './Default';
import Transform from '../../func/transform';

export default class SceneNorm extends Scene {
  constructor(endTime) {
    super(endTime);
  }

  _getViewport() {
    if (!this.engine) return new Transform();

    const wh = this.engine._output.w / 2,
      hh = this.engine._output.h / 2,
      scale = this.engine._output.ratio > 1 ? wh : hh;

    return (new Transform())
      .translate(wh, hh)
      .scale(scale, scale);

    // Maybe move a cam in the future
    //			output.context.scale(cam.zoom,cam.zoom);
    //			output.context.translate(-cam.centerX,-cam.centerY);
    //output.context.translate(-0.5,-0.5);
  }

  transformPoint(x, y) {
    return this._getViewport().invert().transformPoint(x, y);
  }

  draw(output) {
    output.context.save();

    output.context.setTransform(...this._getViewport().m);

    super.draw(output);
    output.context.restore();
  }

}
