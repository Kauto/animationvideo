import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
import { SequenceRunCommand } from './Sequence';

export default class EndDisabled implements IAnimation{
    constructor() {
    }

    run(sprite: ISprite, time:number) {
        sprite.p.enabled = false;
        return SequenceRunCommand.FORCE_DISABLE;
    };
}