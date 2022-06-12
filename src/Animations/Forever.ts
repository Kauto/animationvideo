import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
import Sequence, { AnimationSequenceOptions } from "./Sequence";

export default class Forever implements IAnimation {
  _Aniobject:Sequence

  constructor(...Aniobject: AnimationSequenceOptions) {
    this._Aniobject =
      Aniobject[0] instanceof Sequence
        ? Aniobject[0]
        : new Sequence(...Aniobject);
  }

  reset(timelapsed:number = 0) {
    this._Aniobject.reset?.(timelapsed);
  }

  play(label:string = "", timelapsed:number = 0) {
    return this._Aniobject.play?.(label, timelapsed);
  }

  run(sprite:ISprite, time:number, isDifference?:boolean) {
    let t:number|boolean = time;
    while (t >= 0) {
      t = this._Aniobject.run(sprite, t, isDifference);
      isDifference = true;
      if (t === true) {
        return true;
      }
      if (t >= 0) {
        this._Aniobject.reset?.();
      }
    }
    return t;
  }
}
