import calc from '../func/calc';
import ifNull from '../func/ifnull';
import { OrFunction } from '../helper';
import ImageManager from '../ImageManager';
import { ISprite } from '../Sprites/Sprite';

export default class Image {
  _initialized: boolean = false
  _image: (HTMLImageElement | string)[]
  _count: number
  _durationBetweenFrames: number
  _duration: number
  _current:number = -1

  constructor(image: OrFunction<HTMLImageElement | string | (HTMLImageElement | string)[]>, durationBetweenFrames: OrFunction<number>) {
    const imageCalced = calc(image);
    this._durationBetweenFrames = ifNull(calc(durationBetweenFrames), 0);
    if (Array.isArray(imageCalced)) {
      this._image = imageCalced
      this._count = imageCalced.length;
    } else {
      this._image = [imageCalced];
      this._count = 1;
    }
    this._duration = this._count * this._durationBetweenFrames;
  }

  reset() {
    this._initialized = false;
  };

  run(sprite: ISprite, time:number) {
    if (!this._initialized) {
      this._initialized = true;
      this._current = -1;
    }

    // return time left
    if (time >= this._duration) {
      sprite.p.image = ImageManager.getImage(this._image[this._image.length - 1]);
    } else {
      let currentFrame = Math.floor(time / this._durationBetweenFrames);
      if (currentFrame !== this._current) {
        this._current = currentFrame;
        sprite.p.image = ImageManager.getImage(this._image[this._current]);
      }
    }
    return time - this._duration;
  }
}