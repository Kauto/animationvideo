import CanvasSprite from "./Canvas.mjs";
import { imageDataRGBA } from "stackblur-canvas";

export default class StackBlurCanvas extends CanvasSprite {
  constructor(givenParameter) {
    super(givenParameter);
    this.currentGridSize = false;
    this.currentRadiusPart = undefined;
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
      this.imageData = this.tctx.getImageData(0, 0, targetW, targetH);
      imageDataRGBA(
        this.imageData,
        0,
        0,
        targetW,
        targetH,
        additionalModifier.radius
      );
      this.tctx.putImageData(this.imageData, 0, 0);
    }
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (
        this.radius === undefined ||
        this.currentRadiusPart !== this.radiusPart
      ) {
        this.radius = Math.round(
          (additionalModifier.widthInPixel + additionalModifier.heightInPixel) /
            2 /
            this.radiusPart
        );
        this.currentRadiusPart = this.radiusPart;
      }
      additionalModifier.radius = Math.round(this.radius);
      super.draw(context, additionalModifier);
    }
  }
}
