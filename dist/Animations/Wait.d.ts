import { OrFunction } from '../helper';
import { ISprite } from '../Sprites/Sprite';
import { IAnimation } from './Animation';

export default class Wait implements IAnimation {
    _duration: number;
    constructor(duration: OrFunction<number>);
    run(_sprite: ISprite, time: number): number;
}
