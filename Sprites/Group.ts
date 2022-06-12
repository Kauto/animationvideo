import { OutputInfo } from "../Engine.js"
import { OrFunction } from "../helper.js"
import { AdditionalModifier } from "../Scene.js"
import { CircleParameterList } from "./Circle.js"
import { ISprite, SpriteBase, SpriteBaseOptions, SpriteBaseOptionsInternal, TTagParameter } from "./Sprite.js"

export interface SpriteGroupOptions extends SpriteBaseOptions {
  x?: OrFunction<number>
  y?: OrFunction<number>
  rotation?: OrFunction<number>
  rotationInRadian?: OrFunction<number>
  rotationInDegree?: OrFunction<number>
  scaleX?: OrFunction<number>
  scaleY?: OrFunction<number>
  scale?: OrFunction<number>
  alpha?: OrFunction<number>
  sprite?: OrFunction<ISprite>
}

export interface SpriteGroupOptionsInternal extends SpriteBaseOptionsInternal {
  x: number|undefined
  y: number|undefined
  rotation: number
  scaleX: number
  scaleY: number
  alpha: number
  sprite: ISprite[]
}


export default class Group<O extends SpriteGroupOptions = SpriteGroupOptions, P extends SpriteGroupOptionsInternal = SpriteGroupOptionsInternal> extends SpriteBase<O, P> {
  constructor(givenParameter:O) {
    super(givenParameter);
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), CircleParameterList, {
      sprite: []
    });
  }

  getElementsByTag(tag: TTagParameter):ISprite[] {
    let result:ISprite[] = super.getElementsByTag(tag);
    for (const sprite of this.p.sprite) {
      const ans = sprite.getElementsByTag(tag);
      if (ans) {
        result = result.concat(ans);
      }
    }
    return result;
  }

  // overwrite change
  animate(timepassed:number) {
    // call super
    let finished = super.animate(timepassed),
      spriteFinished = false;
    // animate all sprites
    if (this.p.enabled) {
      for (const sprite of this.p.sprite) {
        spriteFinished = spriteFinished || sprite.animate(timepassed) === true;
      }
    }

    if (this.p.animation) {
      return finished;
    } else {
      if (spriteFinished) {
        this.p.enabled = false;
      }
      return spriteFinished;
    }
  }

  play(label = "", timelapsed = 0) {
    if (this.p.animation) {
      this.p.animation.play?.(label, timelapsed);
    }
    for (const sprite of this.p.sprite) {
      sprite.play?.(label, timelapsed);
    }
  }

  resize(output:OutputInfo, additionalModifier:AdditionalModifier) {
    for (const sprite of this.p.sprite) {
      sprite.resize(output, additionalModifier);
    }
  }

  callInit(context:CanvasRenderingContext2D, additionalModifier:AdditionalModifier) {
    super.callInit(context, additionalModifier);
    for (let sprite of this.p.sprite) {
      sprite.callInit(context, additionalModifier);
    }
  }

  detectDraw(context:CanvasRenderingContext2D, color:string) {
    if (this.p.enabled) {
      for (const sprite of this.p.sprite) {
        sprite.detectDraw(context, color);
      }
    }
  }

  detect(context:CanvasRenderingContext2D, x:number, y:number) {
    if (this.p.enabled) {
      for (const sprite of this.p.sprite) {
        const a = sprite.detect(context, x, y);
        if (a) return a;
      }
    }
    return undefined;
  }

  // draw-methode
  draw(context:CanvasRenderingContext2D, additionalModifier:AdditionalModifier) {
    if (this.p.enabled) {
      if (this.p.alpha < 1) {
        additionalModifier = Object.assign({}, additionalModifier);
        additionalModifier.alpha *= this.p.alpha;
      }

      context.save();
      context.translate(this.p.x!, this.p.y!);
      context.scale(this.p.scaleX, this.p.scaleY);
      context.rotate(this.p.rotation);
      // draw all sprites
      for (const sprite of this.p.sprite) {
        sprite.draw(context, additionalModifier);
      }
      context.restore();
    }
  }
}
