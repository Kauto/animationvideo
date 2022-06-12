import type { OrFunction } from "../helper";
import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
export default class WaitDisabled implements IAnimation {
    duration: number;
    constructor(duration: OrFunction<number>);
    run(sprite: ISprite, time: number): number;
}
