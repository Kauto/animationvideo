import { default as Group, SpriteGroupOptions } from './Group.js';
import { SpriteBaseOptions, ISprite } from './Sprite';

export interface SpriteEmitterOptions<P extends SpriteBaseOptions = SpriteBaseOptions> {
    count?: number;
    class: {
        new (options: P): ISprite;
    };
    self?: SpriteGroupOptions;
}
export default class Emitter<P extends SpriteBaseOptions> extends Group {
    constructor(givenParameter: SpriteEmitterOptions<P>);
}
