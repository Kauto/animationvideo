'use strict';
import SceneAudio from './Audio';

export default class SceneNormAudio extends SceneAudio {
  constructor(audioElement) {
    super(audioElement);
  }

  resize(output) {
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

  draw(output) {
    output.context.save();
    output.context.translate(output.w / 2, output.h / 2);
    output.context.scale(output.w, output.h);

    // Maybe move a cam in the future
    //			output.context.scale(cam.zoom,cam.zoom);
    //			output.context.translate(-cam.centerX,-cam.centerY);
    output.context.translate(-0.5,-0.5);

    super.draw(output);
    output.context.restore();
  }

}
