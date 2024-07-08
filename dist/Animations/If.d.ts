import { OrFunction } from '../helper';
import { ISprite } from '../Sprites/Sprite';
import { IAnimation } from './Animation';
import { TAnimationFunction } from './Sequence';

export default class If implements IAnimation {
    _ifCallback: OrFunction<boolean>;
    _Aniobject: IAnimation | TAnimationFunction;
    _AniobjectElse: IAnimation | TAnimationFunction;
    constructor(ifCallback: OrFunction<boolean>, Aniobject: IAnimation | TAnimationFunction, AniobjectElse: IAnimation | TAnimationFunction);
    play(label?: string, timelapsed?: number): boolean | void;
    run(sprite: ISprite, time: number): number | boolean | import('./Sequence').SequenceRunCommand;
}
