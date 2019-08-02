import calc from "../func/calc.mjs";
import ifNull from "../func/ifnull.mjs";

export default class If {
  constructor(ifCallback, Aniobject, AniobjectElse) {
    this.ifCallback = ifCallback;
    this.Aniobject = Aniobject;
    this.AniobjectElse = ifNull(AniobjectElse, () => 0);
  }

  run(sprite, time) {
    const AniObject = calc(this.ifCallback)
      ? this.Aniobject
      : this.AniobjectElse;
    return AniObject.run
      ? AniObject.run(sprite, time)
      : AniObject(sprite, time);
  }
}
