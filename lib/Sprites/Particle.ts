import { TinyColor } from "@ctrl/tinycolor";
import { OutputInfo } from "../Engine.js";
import calc from "../func/calc.js";
import ifNull from "../func/ifnull.js";
import type { OrFunction } from "../helper.js";
import type { AdditionalModifier } from "../Scene.js";
import {
  SpriteBase,
  SpriteBaseOptions,
  SpriteBaseOptionsInternal,
} from "./Sprite";

const gradientSize = 64;
const gradientResolution = 4;
const gradientSizeHalf = gradientSize >> 1;

export interface SpriteParticleOptions extends SpriteBaseOptions {
  x?: OrFunction<number>;
  y?: OrFunction<number>;
  scaleX?: OrFunction<number>;
  scaleY?: OrFunction<number>;
  scale?: OrFunction<number>;
  alpha?: OrFunction<number>;
  compositeOperation?: OrFunction<GlobalCompositeOperation>;
  color?: OrFunction<string>;
}

type TinyColorRGB = ReturnType<TinyColor["toRgb"]>;

export interface SpriteParticleOptionsInternal
  extends SpriteBaseOptionsInternal {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  alpha: number;
  compositeOperation: GlobalCompositeOperation;
  color: string | TinyColorRGB;
}

class Particle extends SpriteBase<
  SpriteParticleOptions,
  SpriteParticleOptionsInternal
> {
  _currentScaleX: number | undefined;
  _currentPixelSmoothing: boolean = false;
  static _Gradient: HTMLCanvasElement[][][];

  constructor(givenParameter: SpriteParticleOptions) {
    super(givenParameter);
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      x: 0,
      y: 0,
      // scalling
      scaleX: (
        value: SpriteParticleOptions["scaleX"],
        givenParameter: SpriteParticleOptions,
      ) => {
        return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
      },
      scaleY: (
        value: SpriteParticleOptions["scaleY"],
        givenParameter: SpriteParticleOptions,
      ) => {
        return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
      },
      color: "#FFF",
      alpha: 1,
      compositeOperation: "source-over",
    });
  }

  static getGradientImage(r: number, g: number, b: number) {
    const cr = r >> gradientResolution,
      cg = g >> gradientResolution,
      cb = b >> gradientResolution;

    if (!Particle._Gradient) {
      const length = 256 >> gradientResolution;
      Particle._Gradient = Array.from({ length }, (_) =>
        Array.from({ length }, (_) => Array.from({ length })),
      );
    }
    if (!Particle._Gradient[cr][cg][cb]) {
      Particle._Gradient[cr][cg][cb] = Particle.generateGradientImage(
        cr,
        cg,
        cb,
      );
    }
    return Particle._Gradient[cr][cg][cb];
  }

  static generateGradientImage(cr: number, cg: number, cb: number) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = gradientSize;

    const txtc = canvas.getContext("2d")!;
    txtc.globalAlpha = 1;
    txtc.globalCompositeOperation = "source-over";
    txtc.clearRect(0, 0, gradientSize, gradientSize);

    const grad = txtc.createRadialGradient(
      gradientSizeHalf,
      gradientSizeHalf,
      0,
      gradientSizeHalf,
      gradientSizeHalf,
      gradientSizeHalf,
    );
    grad.addColorStop(
      0,
      "rgba(" +
        ((cr << gradientResolution) + (1 << gradientResolution) - 1) +
        "," +
        ((cg << gradientResolution) + (1 << gradientResolution) - 1) +
        "," +
        ((cb << gradientResolution) + (1 << gradientResolution) - 1) +
        ",1)",
    );
    grad.addColorStop(
      0.3,
      "rgba(" +
        ((cr << gradientResolution) + (1 << gradientResolution) - 1) +
        "," +
        ((cg << gradientResolution) + (1 << gradientResolution) - 1) +
        "," +
        ((cb << gradientResolution) + (1 << gradientResolution) - 1) +
        ",0.4)",
    );
    grad.addColorStop(
      1,
      "rgba(" +
        ((cr << gradientResolution) + (1 << gradientResolution) - 1) +
        "," +
        ((cg << gradientResolution) + (1 << gradientResolution) - 1) +
        "," +
        ((cb << gradientResolution) + (1 << gradientResolution) - 1) +
        ",0)",
    );

    txtc.fillStyle = grad;
    txtc.fillRect(0, 0, gradientSize, gradientSize);

    return canvas;
  }

  resize(_output: OutputInfo, _additionalModifier: AdditionalModifier) {
    this._currentScaleX = undefined;
  }

  // draw-methode
  draw(
    context: CanvasRenderingContext2D,
    additionalModifier: AdditionalModifier,
  ) {
    const p = this.p;
    if (p.enabled && p.alpha > 0) {
      // faster than: if (!(this.color instanceof TinyColor && this.color.model === 'rgb')) {
      if (!p.color || !(p.color as TinyColorRGB).r) {
        p.color = new TinyColor(p.color).toRgb();
      }
      if (this._currentScaleX !== p.scaleX) {
        this._currentScaleX = p.scaleX;
        this._currentPixelSmoothing =
          (p.scaleX * additionalModifier.widthInPixel) /
            additionalModifier.width >
          gradientSize;
      }
      const { r, g, b } = p.color as TinyColorRGB;
      context.globalCompositeOperation = p.compositeOperation;
      context.globalAlpha = p.alpha * additionalModifier.alpha;
      context.imageSmoothingEnabled = this._currentPixelSmoothing;
      context.drawImage(
        Particle.getGradientImage(r, g, b),
        0,
        0,
        gradientSize,
        gradientSize,
        p.x - p.scaleX / 2,
        p.y - p.scaleY / 2,
        p.scaleX,
        p.scaleY,
      );
      context.imageSmoothingEnabled = true;
    }
  }
}

export default Particle;
