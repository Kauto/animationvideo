import FastBlur from "./FastBlur.mjs";
import * as stackblur from "stackblur-canvas";
const {imageDataRGBA} = stackblur.default || stackblur

export default class StackBlur extends FastBlur {
  constructor(givenParameter) {
    super(givenParameter);

    this.currentGridSize = false;
    this.currentRadiusPart = undefined;
  }

  getParameterList() {
    return Object.assign({}, super.getParameterList(), {
      // work directly on the main canvas
      onCanvas: false,
      radius: undefined,
      radiusPart: undefined
    });
  }

  normalizeFullScreen(additionalModifier) {
    if (this.norm && this.onCanvas) {
      this.x = 0;
      this.y = 0;
      this.width = additionalModifier.widthInPixel;
      this.height = additionalModifier.heightInPixel;
    } else {
      super.normalizeFullScreen(additionalModifier);
    }
  }

  resize(context, additionalModifier) {
    super.resize(context, additionalModifier);
    if (this.radiusPart) {
      this.radius = undefined;
    }
  }

  additionalBlur(targetW, targetH, additionalModifier) {
    this.imageData = this.tctx.getImageData(0, 0, targetW, targetH);
    imageDataRGBA(this.imageData, 0, 0, targetW, targetH, additionalModifier.radius);
    this.tctx.putImageData(this.imageData, 0, 0);
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (this.radius === undefined || this.currentRadiusPart !== this.radiusPart) {
        this.radius = Math.round(
          (additionalModifier.widthInPixel + additionalModifier.heightInPixel) /
            2 /
            this.radiusPart
        );
        this.currentRadiusPart = this.radiusPart;
      }
      const radius = Math.round(this.radius);
      if (radius) {
        if (this.onCanvas) {
          if (this.width === undefined || this.height === undefined) {
            this.normalizeFullScreen(additionalModifier);
          }
          const x = Math.round(this.x);
          const y = Math.round(this.y);
          const w = Math.round(this.width);
          const h = Math.round(this.height);
          this.imageData = context.getImageData(x, y, w, h);
          imageDataRGBA(this.imageData, 0, 0, w - x, h - y, radius);
          context.putImageData(this.imageData, x, y, 0, 0, w, h);
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
