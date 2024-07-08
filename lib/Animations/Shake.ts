import calc from "../func/calc";
import type { OrFunction } from "../helper.js";
import type {ISpriteWithPosition} from "../Sprites/Sprite.js";


export default class Shake {
  _initialized = false;
  _duration: number;
  _shakeDiff: number;
  _shakeDiffHalf: number;
  _x: number = 0;
  _y: number = 0;

  constructor(shakediff: OrFunction<number>, duration: OrFunction<number>) {
    this._duration = calc(duration);
    this._shakeDiff = calc(shakediff);
    this._shakeDiffHalf = this._shakeDiff / 2;
  }

  reset() {
    this._initialized = false;
  }

  run(sprite: ISpriteWithPosition, time: number) {
    if (!this._initialized) {
      this._initialized = true;
      this._x = sprite.p.x;
      this._y = sprite.p.y;
    }

    // return time left
    if (time >= this._duration) {
      // prevent round errors
      sprite.p.x = this._x;
      sprite.p.y = this._y;
    } else {
      // shake sprite
      sprite.p.x =
        this._x + Math.random() * this._shakeDiff - this._shakeDiffHalf;
      sprite.p.y =
        this._y + Math.random() * this._shakeDiff - this._shakeDiffHalf;
    }
    return time - this._duration;
  }
}
