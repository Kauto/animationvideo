import type { OrFunction } from "../helper";
import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
export default class Wait implements IAnimation {
    _duration: number;
    constructor(duration: OrFunction<number>);
    run(sprite: ISprite, time: number): number;
}
