import calc from '../func/calc.mjs';
import ifNull from '../func/ifNull.mjs';
import ImageManager from '../ImageManager.mjs';

export default class Image {

  constructor(image, durationBetweenFrames) {
    this.initialized = false;
    this.image = calc(image);
    this.durationBetweenFrames = ifNull(calc(durationBetweenFrames), 0);
    if (Array.isArray(this.image)) {
      this.count = this.image.length;
    } else {
      this.image = [this.image];
      this.count = 1;
    }
    this.duration = this.count * this.durationBetweenFrames;
  }

  reset() {
    this.initialized = false;
  };

  run(sprite, time) {
    if (!this.initialized) {
      this.initialized = true;
      this.current = -1;
    }

    // return time left
    if (time >= this.duration) {
      sprite.image = ImageManager.getImage(this.image[this.image.length - 1]);
    } else {
      let currentFrame = Math.floor(time / this.durationBetweenFrames);
      if (currentFrame !== this.current) {
        this.current = currentFrame;
        sprite.image = ImageManager.getImage(this.image[this.current]);
      }
    }
    return time - this.duration;
  }
}