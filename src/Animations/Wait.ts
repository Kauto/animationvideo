import calc from "../func/calc";
import type { OrFunction } from "../helper";
import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";

export default class Wait implements IAnimation{
  _duration:number
  constructor(duration:OrFunction<number>) {
    this._duration = calc(duration) - 0;
  }

  run(sprite: ISprite, time: number) {
    // return time left
    return time - this._duration;
  }
}
