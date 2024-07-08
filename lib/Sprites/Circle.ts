import ifNull from "../func/ifnull";
import calc from "../func/calc";
import {
  ISprite,
  SpriteBase,
  SpriteBaseOptions,
  SpriteBaseOptionsInternal,
  TParameterList,
} from "./Sprite";
import { OrFunction } from "../helper";
import { AdditionalModifier } from "../Scene";

const degToRad = Math.PI / 180;

export interface SpriteCircleOptions extends SpriteBaseOptions {
  x?: OrFunction<number>;
  y?: OrFunction<number>;
  rotation?: OrFunction<number>;
  rotationInRadian?: OrFunction<number>;
  rotationInDegree?: OrFunction<number>;
  scaleX?: OrFunction<number>;
  scaleY?: OrFunction<number>;
  scale?: OrFunction<number>;
  alpha?: OrFunction<number>;
  compositeOperation?: OrFunction<GlobalCompositeOperation>;
  color?: OrFunction<string>;
}

export interface SpriteCircleOptionsInternal extends SpriteBaseOptionsInternal {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  alpha: number;
  compositeOperation: GlobalCompositeOperation;
  color: string;
}

export const CircleParameterList = {
  // position
  x: 0 as number,
  y: 0 as number,
  // rotation
  rotation: (
    value: SpriteCircleOptions["rotation"],
    givenParameter: SpriteCircleOptions,
  ) => {
    return ifNull(
      calc(value),
      ifNull(
        calc(givenParameter.rotationInRadian),
        ifNull(calc(givenParameter.rotationInDegree), 0) * degToRad,
      ),
    ) as number;
  },
  // scalling
  scaleX: (
    value: SpriteCircleOptions["scaleX"],
    givenParameter: SpriteCircleOptions,
  ) => {
    return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
  },
  scaleY: (
    value: SpriteCircleOptions["scaleY"],
    givenParameter: SpriteCircleOptions,
  ) => {
    return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
  },
  // alpha
  alpha: 1,
  // blending
  compositeOperation: "source-over",
  // color
  color: "#fff",
};

// Sprite
// Draw a Circle
export default class Circle
  extends SpriteBase<SpriteCircleOptions, SpriteCircleOptionsInternal>
  implements ISprite
{
  constructor(givenParameter: SpriteCircleOptions) {
    super(givenParameter);
  }

  _getParameterList() {
    return Object.assign(
      {},
      this._getBaseParameterList(),
      CircleParameterList,
    ) as TParameterList<SpriteCircleOptions, SpriteCircleOptionsInternal>;
  }

  detect(context: CanvasRenderingContext2D, x: number, y: number) {
    return this._detectHelperCallback(this.p, context, x, y, () => {
      context.arc(
        0,
        0,
        1,
        Math.PI / 2 + this.p.rotation,
        Math.PI * 2.5 - this.p.rotation,
        false,
      );
      return context.isPointInPath(x, y);
    });
  }

  // Draw-Funktion
  draw(
    context: CanvasRenderingContext2D,
    additionalModifier: AdditionalModifier,
  ) {
    if (this.p.enabled) {
      context.globalCompositeOperation = this.p.compositeOperation;
      context.globalAlpha = this.p.alpha * additionalModifier.alpha;
      context.save();
      context.translate(this.p.x, this.p.y);
      context.scale(this.p.scaleX, this.p.scaleY);
      context.beginPath();
      context.fillStyle = this.p.color;
      context.arc(
        0,
        0,
        1,
        Math.PI / 2 + this.p.rotation,
        Math.PI * 2.5 - this.p.rotation,
        false,
      );
      context.fill();
      context.restore();
    }
  }
}
