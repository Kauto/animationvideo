'use strict';
import SceneAudio from './Audio';

export default class SceneNormAudio extends SceneAudio {
  constructor(audioElement) {
    super(audioElement);
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
