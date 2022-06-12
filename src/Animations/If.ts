import calc from "../func/calc";
import ifNull from "../func/ifnull";
import type { OrFunction } from "../helper";
import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
import type { TAnimationFunction } from "./Sequence";

export default class If implements IAnimation {
  _ifCallback: OrFunction<boolean>
  _Aniobject: IAnimation|TAnimationFunction
  _AniobjectElse: IAnimation|TAnimationFunction

  constructor(ifCallback:OrFunction<boolean>, Aniobject:IAnimation|TAnimationFunction, AniobjectElse:IAnimation|TAnimationFunction) {
    this._ifCallback = ifCallback;
    this._Aniobject = Aniobject;
    this._AniobjectElse = ifNull(AniobjectElse, () => 0);
  }

  play(label = "", timelapsed = 0) {
    return (this._Aniobject as IAnimation).play?.(label, timelapsed) || (this._AniobjectElse as IAnimation).play?.(label, timelapsed);
  }

  run(sprite:ISprite, time:number) {
    const AniObject = calc(this._ifCallback)
      ? this._Aniobject
      : this._AniobjectElse;
    return (AniObject as IAnimation).run
      ?  (AniObject as IAnimation).run(sprite, time)
      :  (AniObject as TAnimationFunction)(sprite, time);
  }
}
