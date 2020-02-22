import FastBlur from "./FastBlur.mjs";
import * as stackblur from "stackblur-canvas";
const { imageDataRGBA } = stackblur.default || stackblur;

export default class StackBlur extends FastBlur {
  constructor(givenParameter) {
    super(givenParameter);

    this._currentGridSize = false;
    this._currentRadiusPart = undefined;
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // work directly on the main canvas
      onCanvas: false,
      radius: undefined,
      radiusPart: undefined,
      radiusScale: true
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

  resize(output, additionalModifier) {
    super.resize(output, additionalModifier);
    if (this.radiusPart) {
      this.radius = undefined;
    }
  }

  additionalBlur(targetW, targetH, additionalModifier) {
    const imageData = this._tctx.getImageData(0, 0, targetW, targetH);
    imageDataRGBA(imageData, 0, 0, targetW, targetH, additionalModifier.radius);
    this._tctx.putImageData(imageData, 0, 0);
  }

  detect(context, x, y) {
    return this._detectHelper(context, x, y, false);
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
      const radius = Math.round(
        this.radius *
          (this.radiusScale &&
            (additionalModifier.cam ? additionalModifier.cam.zoom : 1) /
              additionalModifier.scaleCanvas)
      );
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
