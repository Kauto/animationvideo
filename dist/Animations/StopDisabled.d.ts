import { ISprite } from '../Sprites/Sprite';
import { IAnimation } from './Animation';
import { SequenceRunCommand } from './Sequence';

export default class EndDisabled implements IAnimation {
    constructor();
    run(sprite: ISprite, _time: number): SequenceRunCommand;
}
