import calc from '../func/calc';
import ifNull from "../func/ifnull";
import type { OrFunction } from "../helper";
import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";

export default class WaitDisabled implements IAnimation {
  duration:number

  constructor(duration:OrFunction<number>) {
    this.duration = ifNull(calc(duration), 0);
  }

  run(sprite:ISprite, time:number) {
    // return time left
    sprite.p.enabled = (time >= this.duration);
    return time - this.duration;
  }
}