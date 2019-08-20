import calc from "../func/calc.mjs";
import ifNull from "../func/ifnull.mjs";
import Sequence from "./Sequence.mjs";

export default class Loop {
  constructor(times, ...Aniobject) {
    this.Aniobject =
      Aniobject[0] instanceof Sequence
        ? Aniobject[0]
        : new Sequence(...Aniobject);
    this.times = this.timesOrg = ifNull(calc(times), 1);
  }

  reset(timelapsed = 0) {
    this.times = this.timesOrg;
    this.Aniobject.reset && this.Aniobject.reset(timelapsed);
  }

  play(label = "", timelapsed = 0) {
    this.times = this.timesOrg;
    this.Aniobject.play && this.Aniobject.play(label, timelapsed);
  }

  run(sprite, time, isDifference) {
    let t = time;
    while (t >= 0 && this.times > 0) {
      t = this.Aniobject.run(sprite, t, isDifference);
      isDifference = true;
      if (t === true) {
        return true;
      }
      if (t >= 0) {
        this.times--;
        this.Aniobject.reset && this.Aniobject.reset();
      }
    }
    return t;
  }
}
