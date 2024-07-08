import { ISprite } from '../Sprites/Sprite';
import { IAnimation } from './Animation';
import { SequenceRunCommand } from './Sequence';

export default class End implements IAnimation {
    constructor();
    run(_sprite: ISprite, _time: number): SequenceRunCommand;
}
