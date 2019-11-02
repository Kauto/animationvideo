import calc from '../func/calc.mjs';
import ifNull from "../func/ifnull.mjs";

export default class WaitDisabled {

  constructor(duration) {
    this.duration = ifNull(calc(duration), 0);
  }

  run(sprite, time) {
    // return time left
    sprite.enabled = (time >= this.duration);
    return time - this.duration;
  }
}