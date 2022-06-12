import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
import { SequenceRunCommand } from './Sequence';

export default class Remove implements IAnimation{
    constructor() {
    }

    run(sprite: ISprite, time:number) {
        return SequenceRunCommand.REMOVE;
    };
}