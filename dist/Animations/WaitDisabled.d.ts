import { OrFunction } from '../helper';
import { ISprite } from '../Sprites/Sprite';
import { IAnimation } from './Animation';

export default class WaitDisabled implements IAnimation {
    duration: number;
    constructor(duration: OrFunction<number>);
    run(sprite: ISprite, time: number): number;
}
