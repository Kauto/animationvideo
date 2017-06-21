import calc from '../../func/calc';
import ifNull from '../../func/ifnull';
import isNumber from 'lodash/isNumber';

export default class Callback {

    constructor(callback, duration) {
      this.callback = callback;
      this.duration = ifNull(calc(duration), 0);
      this.initialized = false;
    }

    reset() {
      this.initialized = false;
    }

    run(sprite, time) {
      let result;

      if (isNumber(this.duration)) {
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