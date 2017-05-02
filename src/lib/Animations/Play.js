import calc from '../../func/calc';
import ifNull from '../../func/ifnull';

export default class Play {

  constructor(name, duration, loop) {
    this.duration = ifNull(calc(duration),1);
    this.name = calc(name);
    this.loop = calc(ifNull(loop, 1));
  }

  run(sprite, time) {
    // return time left
    if (time >= this.duration) {
      // Play animation from the start
      sprite.changeAnimationStatus({
        [this.name]: {
          position: 0,
          timelapsed: (time - this.duration),
          loop: this.loop
        }
      });
    }
    return time - this.duration;
  };
}