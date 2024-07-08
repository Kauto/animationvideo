import ifNull from "../func/ifnull";
import calc from "../func/calc";
import { ISprite, SpriteBase, SpriteBaseOptionsInternal } from "./Sprite";
import { CircleParameterList, SpriteCircleOptions } from "./Circle";
import { OrFunction } from "../helper";
import { Position } from "../Position";
import { AdditionalModifier } from "../Scene";
import { OutputInfo } from "../Engine";

export interface SpriteRectOptions extends SpriteCircleOptions {
  position?: OrFunction<undefined | Position>;
  borderColor?: OrFunction<undefined | string>;
  lineWidth?: OrFunction<undefined | number>;
  width?: OrFunction<undefined | number>;
  height?: OrFunction<undefined | number>;
  clear?: OrFunction<undefined | boolean>;
  norm?: OrFunction<undefined | boolean>;
}

export interface SpriteRectOptionsInternal extends SpriteBaseOptionsInternal {
  x: undefined | number;
  y: undefined | number;
  width: undefined | number;
  height: undefined | number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  alpha: number;
  compositeOperation: GlobalCompositeOperation;
  position: Position;
  borderColor: undefined | string;
  color: undefined | string;
  lineWidth: number;
  clear: boolean;
  norm: boolean;
}

// Sprite
// Draw a Circle
class Rect
  extends SpriteBase<SpriteRectOptions, SpriteRectOptionsInternal>
  implements ISprite
{
  constructor(givenParameters: SpriteRectOptions) {
    super(givenParameters);
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), CircleParameterList, {
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      borderColor: undefined,
      color: undefined,
      lineWidth: 1,
      clear: false,
      norm: (
        value: SpriteRectOptions["norm"],
        givenParameter: SpriteRectOptions,
      ) =>
        ifNull(
          calc(value),
          calc(givenParameter.x) === undefined &&
            calc(givenParameter.y) === undefined &&
            calc(givenParameter.width) === undefined &&
            calc(givenParameter.height) === undefined,
        ),
      // relative position
      position: Position.CENTER,
    });
  }

  _normalizeFullScreen(additionalModifier: AdditionalModifier) {
    if (this.p.norm || this.p.width === undefined) {
      this.p.width = additionalModifier.visibleScreen.width;
    }
    if (this.p.norm || this.p.height === undefined) {
      this.p.height = additionalModifier.visibleScreen.height;
    }
    if (this.p.norm || this.p.x === undefined) {
      this.p.x = additionalModifier.visibleScreen.x;
      if (this.p.position === Position.CENTER) {
        this.p.x += this.p.width / 2;
      }
    }
    if (this.p.norm || this.p.y === undefined) {
      this.p.y = additionalModifier.visibleScreen.y;
      if (this.p.position === Position.CENTER) {
        this.p.y += this.p.height / 2;
      }
    }
  }

  resize(_output: OutputInfo, _additionalModifier: AdditionalModifier) {
    this._needInit = true;
  }

  init(
    _context: CanvasRenderingContext2D,
    additionalModifier: AdditionalModifier,
  ) {
    this._normalizeFullScreen(additionalModifier);
  }

  detect(context: CanvasRenderingContext2D, x: number, y: number) {
    return this._detectHelper(
      this.p,
      context,
      x,
      y,
      this.p.position === Position.LEFT_TOP,
    );
  }

  // Draw-Funktion
  draw(
    context: CanvasRenderingContext2D,
    additionalModifier: AdditionalModifier,
  ) {
    const p = this.p;
    if (p.enabled && p.alpha > 0) {
      context.globalCompositeOperation = p.compositeOperation;
      context.globalAlpha = p.alpha * additionalModifier.alpha;
      if (p.rotation === 0 && p.position === Position.LEFT_TOP) {
        if (p.clear) {
          context.clearRect(p.x!, p.y!, p.width!, p.height!);
        } else if (p.color) {
          context.fillStyle = p.color;
          context.fillRect(p.x!, p.y!, p.width!, p.height!);
        }
        if (p.borderColor) {
          context.beginPath();
          context.lineWidth = p.lineWidth;
          context.strokeStyle = p.borderColor;
          context.rect(p.x!, p.y!, p.width!, p.height!);
          context.stroke();
        }
      } else {
        const hw = p.width! / 2;
        const hh = p.height! / 2;
        context.save();
        if (p.position === Position.LEFT_TOP) {
          context.translate(p.x! + hw, p.y! + hh);
        } else {
          context.translate(p.x!, p.y!);
        }
        context.scale(p.scaleX, p.scaleY);
        context.rotate(p.rotation);
        if (p.clear) {
          context.clearRect(-hw, -hh, p.width!, p.height!);
        } else if (p.color) {
          context.fillStyle = p.color;
          context.fillRect(-hw, -hh, p.width!, p.height!);
        }
        if (p.borderColor) {
          context.beginPath();
          context.lineWidth = p.lineWidth;
          context.strokeStyle = p.borderColor;
          context.rect(-hw, -hh, p.width!, p.height!);
          context.stroke();
        }
        context.restore();
      }
    }
  }
}

export default Rect;
