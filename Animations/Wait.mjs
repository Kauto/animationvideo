import calc from "../func/calc.mjs";

export default class Wait {
  constructor(duration) {
    this.duration = calc(duration) - 0;
  }

  run(sprite, time) {
    // return time left
    return time - this.duration;
  }
}
