import type { OrFunction } from '../helper.js';
import type { ISprite } from '../Sprites/Sprite.js';
export default class Shake {
    _initialized: boolean;
    _duration: number;
    _shakeDiff: number;
    _shakeDiffHalf: number;
    _x: number;
    _y: number;
    constructor(shakediff: OrFunction<number>, duration: OrFunction<number>);
    reset(): void;
    run(sprite: ISprite, time: number): number;
}
