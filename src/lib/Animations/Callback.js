import calc from '../../func/calc';
import ifNull from '../../func/ifnull';

export default class Callback {

    constructor(callback, duration) {
      this.callback = callback;
      this.duration = calc(duration);
      this.initialized = false;
    }

    reset() {
      this.initialized = false;
    }

    run(sprite, time) {
      let result;

      if (this.duration === undefined) {
        result = this.callback(sprite, time, !this.initialized);
        this.initialized = true;
        return result;
      } else {
        this.callback(sprite, Math.min(time, this.duration), !this.initialized);
        this.initialized = true;
        return time - this.duration;
      }
    };
}