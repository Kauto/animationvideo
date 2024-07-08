import { ISprite } from '../Sprites/Sprite';
import { IAnimation } from './Animation';

export default class ShowOnce implements IAnimation {
    _showOnce: boolean;
    run(sprite: ISprite, _time: number): number;
}
