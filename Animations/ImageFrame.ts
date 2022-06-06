import calc from '../func/calc';
import ifNull from '../func/ifnull';
import type { OrFunction } from '../helper';
import { ISprite } from '../Sprites/Sprite';
import { IAnimation } from './Animation';

export default class ImageFrame implements IAnimation{
    _frameNumber: number[]
    _durationBetweenFrames: number
    _duration: number
    _framesToRight: boolean

    constructor(frameNumber: OrFunction<number | number[]>, framesToRight: OrFunction<boolean>, durationBetweenFrames: OrFunction<number>) {
        const frameNumberCalc = calc(frameNumber);
        this._framesToRight = ifNull(calc(framesToRight), true);
        this._durationBetweenFrames = ifNull(calc(durationBetweenFrames), 0);
        this._frameNumber = Array.isArray(frameNumberCalc) ? frameNumberCalc : [frameNumberCalc];

        this._duration = this._frameNumber.length * this._durationBetweenFrames;
    }

    run(sprite: ISprite, time:number) {
        let currentFrame = 0;
        if (time >= this._duration) {
            currentFrame = this._frameNumber[this._frameNumber.length - 1];
        } else {
            currentFrame = this._frameNumber[Math.floor(time / this._durationBetweenFrames)];
        }
        if (this._framesToRight) {
            sprite.p.frameX = sprite.p.frameWidth! * currentFrame;
        } else {
            sprite.p.frameY = sprite.p.frameHeight! * currentFrame;
        }

        return time - this._duration;
    }
}