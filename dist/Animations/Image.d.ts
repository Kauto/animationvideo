import { OrFunction } from '../helper';
import { ISprite } from '../Sprites/Sprite';
export default class Image {
    _initialized: boolean;
    _image: (HTMLImageElement | string)[];
    _count: number;
    _durationBetweenFrames: number;
    _duration: number;
    _current: number;
    constructor(image: OrFunction<HTMLImageElement | string | (HTMLImageElement | string)[]>, durationBetweenFrames: OrFunction<number>);
    reset(): void;
    run(sprite: ISprite, time: number): number;
}
