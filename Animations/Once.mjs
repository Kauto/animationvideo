import calc from '../func/calc.mjs';
import ifNull from '../func/ifNull.mjs';

export default class Once {
  constructor(Aniobject, times) {
    this.Aniobject = Aniobject;
    this.times = ifNull(calc(times), 1);
  }

  run(sprite, time) {
    if (this.times <= 0) {
      return time;
    }
    else {
      let t = this.Aniobject.run(sprite, time);
      if (t >= 0) {
        this.times--;
      }
      return t;
    }
  };
}