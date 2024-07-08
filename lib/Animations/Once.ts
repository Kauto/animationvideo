import calc from "../func/calc";
import ifNull from "../func/ifnull";
import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";

export default class Once implements IAnimation {
  _Aniobject: IAnimation;
  _times: number;

  constructor(Aniobject: IAnimation, times: number) {
    this._Aniobject = Aniobject;
    this._times = ifNull(calc(times), 1);
  }

  run(sprite: ISprite, time: number) {
    if (this._times <= 0) {
      return time;
    } else {
      const t = this._Aniobject.run(sprite, time);
      if (typeof t === "number" && t >= 0) {
        this._times--;
      }
      return t;
    }
  }
}
