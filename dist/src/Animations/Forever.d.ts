import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
import Sequence, { AnimationSequenceOptions } from "./Sequence";
export default class Forever implements IAnimation {
    _Aniobject: Sequence;
    constructor(...Aniobject: AnimationSequenceOptions);
    reset(timelapsed?: number): void;
    play(label?: string, timelapsed?: number): boolean;
    run(sprite: ISprite, time: number, isDifference?: boolean): number | true;
}
