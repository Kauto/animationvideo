import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
export default class ShowOnce implements IAnimation {
    _showOnce: boolean;
    run(sprite: ISprite, time: number): number;
}
