import FastBlur, {
  SpriteFastBlurOptions,
  SpriteFastBlurOptionsInternal,
} from "./FastBlur";
import { imageDataRGBA } from "stackblur-canvas";
import type { OrFunction } from "../helper";
import type { AdditionalModifier } from "../Scene";
import { OutputInfo } from "../Engine";

export interface SpriteStackBlurOptions extends SpriteFastBlurOptions {
  onCanvas?: OrFunction<boolean>;
  radius?: OrFunction<undefined | number>;
  radiusPart?: OrFunction<undefined | number>;
  radiusScale?: OrFunction<boolean>;
}

export interface SpriteStackBlurOptionsInternal
  extends SpriteFastBlurOptionsInternal {
  onCanvas: boolean;
  radius: undefined | number;
  radiusPart: undefined | number;
  radiusScale: boolean;
}

export default class StackBlur extends FastBlur<
  SpriteStackBlurOptions,
  SpriteStackBlurOptionsInternal
> {
  _currentRadiusPart: number | undefined;

  constructor(givenParameter: SpriteStackBlurOptions) {
    super(givenParameter);
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // work directly on the main canvas
      onCanvas: false,
      radius: undefined,
      radiusPart: undefined,
      radiusScale: true,
    });
  }

  normalizeFullScreen(additionalModifier: AdditionalModifier) {
    const p = this.p;
    if (p.norm && p.onCanvas) {
      p.x = 0;
      p.y = 0;
      p.width = additionalModifier.widthInPixel;
      p.height = additionalModifier.heightInPixel;
    } else {
      super.normalizeFullScreen(additionalModifier);
    }
  }

  resize(output: OutputInfo, additionalModifier: AdditionalModifier) {
    super.resize(output, additionalModifier);
    if (this.p.radiusPart) {
      this.p.radius = undefined;
    }
  }

  additionalBlur(
    targetW: number,
    targetH: number,
    additionalModifier: AdditionalModifier,
  ) {
    const imageData = this._tctx!.getImageData(0, 0, targetW, targetH);
    imageDataRGBA(
      imageData,
      0,
      0,
      targetW,
      targetH,
      additionalModifier.radius || 1,
    );
    this._tctx!.putImageData(imageData, 0, 0);
  }

  // draw-methode
  draw(
    context: CanvasRenderingContext2D,
    additionalModifier: AdditionalModifier,
  ) {
    const p = this.p;
    if (p.enabled) {
      if (p.radius === undefined || this._currentRadiusPart !== p.radiusPart) {
        p.radius = Math.round(
          (additionalModifier.widthInPixel + additionalModifier.heightInPixel) /
            2 /
            p.radiusPart!,
        );
        this._currentRadiusPart = p.radiusPart!;
      }
      const radius = Math.round(
        (p.radius! *
          (p.radiusScale && additionalModifier.cam
            ? additionalModifier.cam.zoom
            : 1)) /
          additionalModifier.scaleCanvas,
      );
      if (radius) {
        if (p.onCanvas) {
          if (p.width === undefined || p.height === undefined) {
            this.normalizeFullScreen(additionalModifier);
          }
          const x = Math.round(p.x!);
          const y = Math.round(p.y!);
          const w = Math.round(p.width!);
          const h = Math.round(p.height!);
          const imageData = context.getImageData(x, y, w, h);
          imageDataRGBA(imageData, 0, 0, w - x, h - y, radius);
          context.putImageData(imageData, x, y, 0, 0, w, h);
        } else {
          additionalModifier.radius = radius;
          super.draw(context, additionalModifier);
        }
      }
    } else {
      super.draw(context, additionalModifier);
    }
  }
}
