import calc from '../../func/calc.mjs';

export default class WaitDisabled {

  constructor(duration) {
    this.duration = calc(duration);
  }

  run(sprite, time) {
    // return time left
    sprite.enabled = (time >= this.duration);
    return time - this.duration;
  }
}