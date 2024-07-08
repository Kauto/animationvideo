import ifNull from "../func/ifnull";
import calc from "../func/calc";
import Group, { SpriteGroupOptions } from "./Group.js";
import { SpriteBaseOptions, ISprite } from "./Sprite";

export interface SpriteEmitterOptions<
  P extends SpriteBaseOptions = SpriteBaseOptions,
> {
  count?: number;
  class: { new (options: P): ISprite };
  self?: SpriteGroupOptions;
}

export default class Emitter<P extends SpriteBaseOptions> extends Group {
  constructor(givenParameter: SpriteEmitterOptions<P>) {
    super(givenParameter.self || {});

    const count = ifNull(calc(givenParameter.count), 1);
    this.p.sprite = [];
    const classToEmit = givenParameter.class;

    for (let i = 0; i < count; i++) {
      const parameter: P = Object.entries(givenParameter).reduce<P>(
        (p, [index, value]) => {
          if (["self", "class", "count"].includes(index)) {
            return p;
          }
          p[index as keyof P] = calc(value, i);
          return p;
        },
        {} as P,
      );
      this.p.sprite[i] = new classToEmit(parameter);
    }
  }
}
