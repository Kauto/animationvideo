import { SpriteBase, SpriteBaseOptions, SpriteBaseOptionsInternal } from "./Sprite";
import { AdditionalModifier } from "../Scene";
import { OrFunction } from "../helper";
import { OutputInfo } from "../Engine";

export interface SpriteStarFieldOptions extends SpriteBaseOptions {
  x?: OrFunction<number>
  y?: OrFunction<number>
  width?: OrFunction<number>
  height?: OrFunction<number>
  alpha?: OrFunction<number>
  lineWidth?: OrFunction<number>
  count?: OrFunction<number>
  compositeOperation?: OrFunction<GlobalCompositeOperation>
  moveX?: OrFunction<undefined|number>
  moveY?: OrFunction<undefined|number>
  moveZ?: OrFunction<undefined|number>
  highScale?: OrFunction<undefined|boolean>
  color?: OrFunction<undefined|string>
}

export interface SpriteStarFieldOptionsInternal extends SpriteBaseOptionsInternal {
  x: undefined | number
  y: undefined | number
  width: undefined | number
  height: undefined | number
  alpha: number
  count: number
  lineWidth: number
  compositeOperation: GlobalCompositeOperation
  moveX: number
  moveY: number
  moveZ: number
  highScale: boolean
  color: string
}



// Sprite
// Draw a Circle
export default class StarField extends SpriteBase<SpriteStarFieldOptions, SpriteStarFieldOptionsInternal> {
  _starsX: number[] = []
  _starsY: number[] = []
  _starsZ: number[] = []
  _starsOldX: number[] = []
  _starsOldY: number[] = []
  _starsNewX: number[] = []
  _starsNewY: number[] = []
  _starsEnabled: boolean[] = []
  _starsLineWidth: number[] = []
  _centerX: number = 0
  _centerY: number = 0
  _scaleZ: number = 0

  constructor(givenParameters: SpriteStarFieldOptions) {
    super(givenParameters);
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // set image
      count: 40,
      // relative position
      moveX: 0,
      moveY: 0,
      moveZ: 0,
      lineWidth: undefined,
      highScale: true,
      color: "#FFF" // here default color is white
    });
  }

  init(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) {
    const p = this.p
    p.width = p.width || additionalModifier.width;
    p.height = p.height || additionalModifier.height;
    p.x = p.x === undefined ? additionalModifier.x : p.x;
    p.y = p.y === undefined ? additionalModifier.y : p.y;
    p.lineWidth =
      p.lineWidth ||
      Math.min(
        additionalModifier.height / additionalModifier.heightInPixel,
        additionalModifier.width / additionalModifier.widthInPixel
      ) / 2;
    this._centerX = p.width / 2 + p.x;
    this._centerY = p.height / 2 + p.y;
    this._scaleZ = Math.max(p.width, p.height) / 2;
    function clampOrRandom(val: number | undefined, min: number, max = -min) {
      return val === undefined || val < min || val >= max
        ? Math.random() * (max - min) + min
        : val;
    }
    for (let i = 0; i < p.count; i++) {
      this._starsX[i] = clampOrRandom(this._starsX[i], -p.width / 2);
      this._starsY[i] = clampOrRandom(this._starsY[i], -p.height / 2);
      this._starsZ[i] = clampOrRandom(this._starsZ[i], 0, this._scaleZ);
    }
  }

  _moveStar(i: number, scaled_timepassed: number, firstPass: boolean) {
    const p = this.p
    const hw = p.width! / 2;
    const hh = p.height! / 2;
    if (firstPass) {
      this._starsEnabled[i] = true;
    }
    let
      x = this._starsX[i] + p.moveX * scaled_timepassed,
      y = this._starsY[i] + p.moveY * scaled_timepassed,
      z = this._starsZ[i] + p.moveZ * scaled_timepassed;
    while (x < -hw) {
      x += p.width!;
      y = Math.random() * p.height! - hh;
      this._starsEnabled[i] = false;
    }
    while (x > hw) {
      x -= p.width!;
      y = Math.random() * p.height! - hh;
      this._starsEnabled[i] = false;
    }

    while (y < -hh) {
      y += p.height!;
      x = Math.random() * p.width! - hw;
      this._starsEnabled[i] = false;
    }
    while (y > hh) {
      y -= p.height!;
      x = Math.random() * p.width! - hw;
      this._starsEnabled[i] = false;
    }

    while (z <= 0) {
      z += this._scaleZ;
      x = Math.random() * p.width! - hw;
      y = Math.random() * p.height! - hh;
      this._starsEnabled[i] = false;
    }
    while (z > this._scaleZ) {
      z -= this._scaleZ;
      x = Math.random() * p.width! - hw;
      y = Math.random() * p.height! - hh;
      this._starsEnabled[i] = false;
    }

    const projectX = this._centerX + (x / z) * hw;
    const projectY = this._centerY + (y / z) * hh;
    this._starsEnabled[i] =
      this._starsEnabled[i] &&
      projectX >= p.x! &&
      projectY >= p.y! &&
      projectX < p.x! + p.width! &&
      projectY < p.y! + p.height!;
    if (firstPass) {
      this._starsX[i] = x;
      this._starsY[i] = y;
      this._starsZ[i] = z;
      this._starsNewX[i] = projectX;
      this._starsNewY[i] = projectY;
    } else {
      this._starsOldX[i] = projectX;
      this._starsOldY[i] = projectY;
      let lw = (1 - this._starsZ[i] / this._scaleZ) * 4;
      if (!p.highScale) {
        lw = Math.ceil(lw);
      }
      this._starsLineWidth[i] = lw;
    }
  }

  animate(timepassed:number) {
    let ret = super.animate(timepassed);
    if (this.p.enabled && this._centerX !== undefined) {
      let i = this.p.count;
      while (i--) {
        this._moveStar(i, timepassed / 16, true);
        if (this._starsEnabled[i]) {
          this._moveStar(i, -5, false);
        }
      }
    }
    return ret;
  }

  resize(output:OutputInfo, additionalModifier:AdditionalModifier) {
    this._needInit = true;
  }

  detect(context:CanvasRenderingContext2D, x:number, y:number) {
    return this._detectHelper(this.p, context, x, y, false);
  }

  // Draw-Funktion
  draw(context:CanvasRenderingContext2D, additionalModifier:AdditionalModifier) {
    if (this.p.enabled) {
      const p = this.p
      context.globalCompositeOperation = p.compositeOperation;
      context.globalAlpha = p.alpha * additionalModifier.alpha;

      if (p.moveY == 0 && p.moveZ == 0 && p.moveX < 0) {
        context.fillStyle = p.color;
        let i = p.count;
        while (i--) {
          if (this._starsEnabled[i]) {
            context.fillRect(
              this._starsNewX[i],
              this._starsNewY[i] -
              (this._starsLineWidth[i] * p.lineWidth) / 2,
              this._starsOldX[i] - this._starsNewX[i],
              this._starsLineWidth[i] * p.lineWidth
            );
          }
        }
      } else {
        context.strokeStyle = p.color;
        if (p.highScale) {
          let i = p.count;
          while (i--) {
            if (this._starsEnabled[i]) {
              context.beginPath();
              context.lineWidth = this._starsLineWidth[i] * p.lineWidth;
              context.moveTo(this._starsOldX[i], this._starsOldY[i]);
              context.lineTo(this._starsNewX[i], this._starsNewY[i]);
              context.stroke();
              context.closePath();
            }
          }
        } else {
          let lw = 5,
            i;
          while (--lw) {
            context.beginPath();
            context.lineWidth = lw * p.lineWidth;
            i = p.count;
            while (i--) {
              if (this._starsEnabled[i] && this._starsLineWidth[i] === lw) {
                context.moveTo(this._starsOldX[i], this._starsOldY[i]);
                context.lineTo(this._starsNewX[i], this._starsNewY[i]);
              }
            }
            context.stroke();
            context.closePath();
          }
        }
      }
    }
  }
}
