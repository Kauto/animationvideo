import type { OrFunction } from '../helper';
import { ISprite } from '../Sprites/Sprite';
import { IAnimation } from './Animation';
export default class ImageFrame implements IAnimation {
    _frameNumber: number[];
    _durationBetweenFrames: number;
    _duration: number;
    _framesToRight: boolean;
    constructor(frameNumber: OrFunction<number | number[]>, framesToRight: OrFunction<boolean>, durationBetweenFrames: OrFunction<number>);
    run(sprite: ISprite, time: number): number;
}
