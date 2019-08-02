import Sequence from "./Sequence.mjs";

export default class Forever {
  constructor(...Aniobject) {
    this.Aniobject =
      Aniobject[0] instanceof Sequence
        ? Aniobject[0]
        : new Sequence(...Aniobject);
  }

  reset(timelapsed = 0) {
    this.Aniobject.reset && this.Aniobject.reset(timelapsed);
  }

  run(sprite, time, isDifference) {
    let t = time;
    while (t >= 0) {
      t = this.Aniobject.run(sprite, t, isDifference);
      isDifference = true;
      if (t === true) {
        return true;
      }
      if (t >= 0) {
        this.Aniobject.reset && this.Aniobject.reset();
      }
    }
    return t;
  }
}
