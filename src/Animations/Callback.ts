import calc from '../func/calc';
import ifNull from "../func/ifnull";
import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";

export type TAnimationCallbackCallback = (sprite:ISprite, time:number, firstRun:boolean) => ReturnType<IAnimation['run']>

export default class Callback implements IAnimation{
    _callback: TAnimationCallbackCallback
    _duration: number|undefined
    _initialized: boolean = false

    constructor(callback: TAnimationCallbackCallback, duration?:number) {
      this._callback = callback;
      this._duration = ifNull(calc(duration), undefined);
    }

    reset() {
      this._initialized = false;
    }

    run(sprite:ISprite, time:number) {
      let result;

      if (this._duration !== undefined) {
        this._callback(sprite, Math.min(time, this._duration), !this._initialized);
        this._initialized = true;
        return time - this._duration;
      } else {
        result = this._callback(sprite, time, !this._initialized);
        this._initialized = true;
        return result;
      }
    };
}