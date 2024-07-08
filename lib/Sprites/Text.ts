import calc from "../func/calc";
import type { OrFunction } from "../helper";
import { Position } from "../Position";
import { AdditionalModifier } from "../Scene";
import { CircleParameterList, SpriteCircleOptions } from "./Circle";
import { ISprite, SpriteBase, SpriteBaseOptionsInternal } from "./Sprite";

export interface SpriteTextOptions extends SpriteCircleOptions {
  text?: OrFunction<string | string[]>;
  font?: OrFunction<undefined | string>;
  position?: OrFunction<undefined | Position>;
  borderColor?: OrFunction<undefined | string>;
  lineWidth?: OrFunction<undefined | number>;
}

export interface SpriteTextOptionsInternal extends SpriteBaseOptionsInternal {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  alpha: number;
  compositeOperation: GlobalCompositeOperation;
  text: string;
  font: string;
  position: Position;
  borderColor: undefined | string;
  color: undefined | string;
  lineWidth: number;
}

export default class Text
  extends SpriteBase<SpriteTextOptions, SpriteTextOptionsInternal>
  implements ISprite
{
  constructor(givenParameters: SpriteTextOptions) {
    super(givenParameters);
  }

  _getParameterList() {
    return Object.assign(
      {},
      this._getBaseParameterList(),
      CircleParameterList,
      {
        text: (value: SpriteTextOptions["text"]) => {
          const text = calc(value);
          return (Array.isArray(text) ? text.join("") : text) || "";
        },
        font: "2em monospace",
        position: Position.CENTER,
        color: undefined,
        borderColor: undefined,
        lineWidth: 1,
      },
    );
  }

  detectDraw(context: CanvasRenderingContext2D, color: string) {
    if (this.p.enabled && this.p.isClickable) {
      context.save();
      context.translate(this.p.x, this.p.y);
      context.scale(this.p.scaleX, this.p.scaleY);
      context.rotate(this.p.rotation);
      if (!this.p.position) {
        context.textAlign = "left";
        context.textBaseline = "top";
      }
      context.font = this.p.font;
      context.fillStyle = color;
      context.fillText(this.p.text, 0, 0);
      context.restore();
    }
  }

  detect(_context: CanvasRenderingContext2D, _x: number, _y: number): "c" {
    return "c";
  }

  // draw-methode
  draw(
    context: CanvasRenderingContext2D,
    additionalModifier: AdditionalModifier,
  ) {
    if (this.p.enabled) {
      context.globalCompositeOperation = this.p.compositeOperation;
      context.globalAlpha = this.p.alpha * additionalModifier.alpha;
      context.save();
      if (!this.p.position) {
        context.textAlign = "left";
        context.textBaseline = "top";
      }
      context.translate(this.p.x, this.p.y);
      context.scale(this.p.scaleX, this.p.scaleY);
      context.rotate(this.p.rotation);
      context.font = this.p.font;

      if (this.p.color) {
        context.fillStyle = this.p.color;
        context.fillText(this.p.text, 0, 0);
      }

      if (this.p.borderColor) {
        context.strokeStyle = this.p.borderColor;
        context.lineWidth = this.p.lineWidth;
        context.strokeText(this.p.text, 0, 0);
      }

      context.restore();
    }
  }
}
