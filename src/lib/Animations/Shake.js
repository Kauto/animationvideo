import calc from '../../func/calc';

export default class Shake {

  constructor(shakediff, duration) {
    this.initialized = false;
    this.duration = calc(duration);
    this.shakeDiff = calc(shakediff);
    this.shakeDiffHalf = this.shakeDiff / 2;
  }

  reset() {
    this.initialized = false;
  }

  run(sprite, time) {
    if (!this.initialized) {
      this.initialized = true;
      this.x = sprite.x;
      this.y = sprite.y;
    }

    // return time left
    if (time >= this.duration) {
      // prevent round errors
      sprite.x = this.x;
      sprite.y = this.y;
    } else {
      // shake sprite
      sprite.x = this.x + Math.random() * this.shakeDiff - this.shakeDiffHalf;
      sprite.y = this.y + Math.random() * this.shakeDiff - this.shakeDiffHalf;
    }
    return time - this.duration;
  }
}