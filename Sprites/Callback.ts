import { AdditionalModifier } from "../Scene.js";
import { ISprite, SpriteBase, SpriteBaseOptions, SpriteBaseOptionsInternal } from "./Sprite.js";


export type SpriteCallback = (context:CanvasRenderingContext2D, timePassed:number, additionalParameter:AdditionalModifier, sprite:ISprite) => void

export interface SpriteCallbackOptions extends SpriteBaseOptions {
  callback?: SpriteCallback
}

export interface SpriteCallbackOptionsInternal extends SpriteBaseOptionsInternal {
  callback: SpriteCallback
}


export default class Callback extends SpriteBase<SpriteCallbackOptions,SpriteCallbackOptionsInternal> {
  _timePassed = 0;

  constructor(givenParameter:SpriteCallbackOptions|SpriteCallbackOptions['callback']) {
    if (typeof givenParameter === "function") {
      givenParameter = { callback: givenParameter } as SpriteCallbackOptions;
    }
    super(givenParameter as SpriteCallbackOptions);
  }

  _getParameterList() {
    return Object.assign({}, this._getBaseParameterList(), {
      callback: (v:SpriteCallback|undefined) => (typeof v === undefined ? () => {} : v) as SpriteCallback
    });
  }

  animate(timePassed:number) {
    if (this.p.enabled) {
      this._timePassed += timePassed;
    }
    return super.animate(timePassed);
  }

  draw(context:CanvasRenderingContext2D, additionalParameter:AdditionalModifier) {
    if (this.p.enabled) {
      this.p.callback(context, this._timePassed, additionalParameter, this);
    }
  }
}
