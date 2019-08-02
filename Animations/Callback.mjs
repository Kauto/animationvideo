import calc from '../func/calc.mjs';
import ifNull from '../func/ifnull.mjs';

export default class Callback {

    constructor(callback, duration) {
      this.callback = callback;
      this.duration = ifNull(calc(duration), undefined);
      this.initialized = false;
    }

    reset() {
      this.initialized = false;
    }

    run(sprite, time) {
      let result;

      if (this.duration !== undefined) {
        this.callback(sprite, Math.min(time, this.duration), !this.initialized);
        this.initialized = true;
        return time - this.duration;
      } else {
        result = this.callback(sprite, time, !this.initialized);
        this.initialized = true;
        return result;
      }
    };
}