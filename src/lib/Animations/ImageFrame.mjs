import calc from '../../func/calc.mjs';
import ifNull from '../../func/ifnull.mjs';

export default class ImageFrame {

    constructor(frameNumber, framesToRight, durationBetweenFrames) {
        this.initialized = false;
        this.frameNumber = calc(frameNumber);
        this.framesToRight = ifNull(calc(framesToRight), true);
        this.durationBetweenFrames = ifNull(calc(durationBetweenFrames), 0);
        if (Array.isArray(this.frameNumber)) {
            this.count = this.frameNumber.length;
        } else {
            this.frameNumber = [this.frameNumber];
            this.count = 1;
        }
        this.duration = this.count * this.durationBetweenFrames;
    }

    run(sprite, time) {
        let currentFrame = 0;
        if (time >= this.duration) {
            currentFrame = this.frameNumber[this.frameNumber.length - 1];
        } else {
            currentFrame = Math.floor(time / this.durationBetweenFrames);
        }
        if (this.framesToRight) {
            sprite.frameX = sprite.frameWidth * currentFrame;
        } else {
            sprite.frameY = sprite.frameHeight * currentFrame;
        }

        return time - this.duration;
    }
}