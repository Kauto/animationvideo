import Group, { SpriteGroupOptions } from "./Group.js";
import { SpriteBaseOptions, ISprite } from "./Sprite";
export interface SpriteEmitterOptions<P extends SpriteBaseOptions = SpriteBaseOptions & Record<string, any>> {
    count?: number;
    class: {
        new (options: P): ISprite;
    };
    self?: SpriteGroupOptions;
}
export default class Emitter<P> extends Group {
    constructor(givenParameter: SpriteEmitterOptions<P>);
}
