import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";

export default class ShowOnce implements IAnimation {
  _showOnce: boolean = true;

  run(sprite: ISprite, _time: number) {
    sprite.p.enabled = sprite.p.enabled && this._showOnce;
    this._showOnce = false;
    return 0;
  }
}
