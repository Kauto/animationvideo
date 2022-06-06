import { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
import Sequence from "./Sequence";
export default class Loop implements IAnimation {
    _Aniobject: Sequence;
    _times: number;
    _timesOrg: number;
    constructor(times: number, ...Aniobject: IAnimation[]);
    reset(timelapsed?: number): void;
    play(label?: string, timelapsed?: number): boolean;
    run(sprite: ISprite, time: number, isDifference?: boolean): number | true;
}
