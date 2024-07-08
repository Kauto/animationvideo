import { ISprite } from '../Sprites/Sprite';
import { IAnimation } from './Animation';

export default class Once implements IAnimation {
    _Aniobject: IAnimation;
    _times: number;
    constructor(Aniobject: IAnimation, times: number);
    run(sprite: ISprite, time: number): number | boolean | import('./Sequence').SequenceRunCommand;
}
