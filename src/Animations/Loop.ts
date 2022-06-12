import calc from "../func/calc";
import ifNull from "../func/ifnull";
import { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
import Sequence, { AnimationSequenceOptions } from "./Sequence";

export default class Loop implements IAnimation {
  _Aniobject: Sequence
  _times:number
  _timesOrg:number

  constructor(times:number, ...Aniobject:AnimationSequenceOptions) {
    this._Aniobject =
      Aniobject[0] instanceof Sequence
        ? Aniobject[0]
        : new Sequence(...Aniobject);
    this._times = this._timesOrg = ifNull(calc(times), 1);
  }

  reset(timelapsed:number = 0) {
    this._times = this._timesOrg;
    this._Aniobject.reset?.(timelapsed);
  }

  play(label:string = "", timelapsed:number = 0) {
    this._times = this._timesOrg;
    const b = this._Aniobject.play?.(label, timelapsed);
    if (b) {
      this._times = this._timesOrg;
    }
    return b
  }

  run(sprite: ISprite, time:number, isDifference?:boolean) {
    let t:number|boolean = time;
    while (t >= 0 && this._times > 0) {
      t = this._Aniobject.run(sprite, t, isDifference);
      isDifference = true;
      if (t === true) {
        return true;
      }
      if (t >= 0) {
        this._times--;
        this._Aniobject.reset?.();
      }
    }
    return t;
  }
}
