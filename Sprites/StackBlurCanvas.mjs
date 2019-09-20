import CanvasSprite from "./Canvas.mjs";
import * as stackblur from "stackblur-canvas";
const {imageDataRGBA} = stackblur.default || stackblur 

export default class StackBlurCanvas extends CanvasSprite {
  constructor(givenParameter) {
    super(givenParameter);
    this._currentGridSize = false;
    this._currentRadiusPart = undefined;
  }

  getParameterList() {
    return Object.assign({}, super.getParameterList(), {
      radius: undefined,
      radiusPart: undefined
    });
  }

  resize(context, additionalModifier) {
    super.resize(context, additionalModifier);
    if (this.radiusPart) {
      this.radius = undefined;
    }
  }

  additionalBlur(targetW, targetH, additionalModifier) {
    if (additionalModifier.radius) {
      const imageData = this._tctx.getImageData(0, 0, targetW, targetH);
      imageDataRGBA(
        imageData,
        0,
        0,
        targetW,
        targetH,
        additionalModifier.radius
      );
      this._tctx.putImageData(imageData, 0, 0);
    }
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (
        this.radius === undefined ||
        this._currentRadiusPart !== this.radiusPart
      ) {
        this.radius = Math.round(
          (additionalModifier.widthInPixel + additionalModifier.heightInPixel) /
            2 /
            this.radiusPart
        );
        this._currentRadiusPart = this.radiusPart;
      }
      additionalModifier.radius = Math.round(this.radius);
      super.draw(context, additionalModifier);
    }
  }
}
