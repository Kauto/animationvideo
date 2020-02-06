import Circle from "./Circle.mjs";
import { TinyColor } from "@ctrl/tinycolor";

const gradientSize = 64;
const gradientResolution = 4;
const gradientSizeHalf = gradientSize >> 1;

class Particle extends Circle {
  constructor(givenParameter) {
    super(givenParameter);
    this._currentScaleX = undefined;
    this._currentPixelSmoothing = false;
  }

  static getGradientImage(r, g, b) {
    let rIndex,
      gIndex,
      cr = r >> gradientResolution,
      cg = g >> gradientResolution,
      cb = b >> gradientResolution;

    if (!Particle._Gradient) {
      const length = 256 >> gradientResolution;
      Particle._Gradient = Array.from({ length }, a =>
        Array.from({ length }, a => Array.from({ length }))
      );
    }
    if (!Particle._Gradient[cr][cg][cb]) {
      Particle._Gradient[cr][cg][cb] = Particle.generateGradientImage(
        cr,
        cg,
        cb
      );
    }
    return Particle._Gradient[cr][cg][cb];
  }

  static generateGradientImage(cr, cg, cb) {
    let canvas = document.createElement("canvas");
    canvas.width = canvas.height = gradientSize;

    let txtc = canvas.getContext("2d");
    txtc.globalAlpha = 1;
    txtc.globalCompositeOperation = "source-over";
    txtc.clearRect(0, 0, gradientSize, gradientSize);

    let grad = txtc.createRadialGradient(
      gradientSizeHalf,
      gradientSizeHalf,
      0,
      gradientSizeHalf,
      gradientSizeHalf,
      gradientSizeHalf
    );
    grad.addColorStop(
      0,
      "rgba(" +
        ((cr << gradientResolution) + (1 << gradientResolution) - 1) +
        "," +
        ((cg << gradientResolution) + (1 << gradientResolution) - 1) +
        "," +
        ((cb << gradientResolution) + (1 << gradientResolution) - 1) +
        ",1)"
    );
    grad.addColorStop(
      0.3,
      "rgba(" +
        ((cr << gradientResolution) + (1 << gradientResolution) - 1) +
        "," +
        ((cg << gradientResolution) + (1 << gradientResolution) - 1) +
        "," +
        ((cb << gradientResolution) + (1 << gradientResolution) - 1) +
        ",0.4)"
    );
    grad.addColorStop(
      1,
      "rgba(" +
        ((cr << gradientResolution) + (1 << gradientResolution) - 1) +
        "," +
        ((cg << gradientResolution) + (1 << gradientResolution) - 1) +
        "," +
        ((cb << gradientResolution) + (1 << gradientResolution) - 1) +
        ",0)"
    );

    txtc.fillStyle = grad;
    txtc.fillRect(0, 0, gradientSize, gradientSize);

    return canvas;
  }

  resize(output, additionalModifier) {
    this._currentScaleX = undefined;
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      // faster than: if (!(this.color instanceof TinyColor && this.color.model === 'rgb')) {
      if (!this.color || !this.color.r) {
        this.color = new TinyColor(this.color).toRgb();
      }
      if (this._currentScaleX !== this.scaleX) {
        this._currentScaleX = this.scaleX;
        this._currentPixelSmoothing =
          (this.scaleX * additionalModifier.widthInPixel) /
            additionalModifier.width >
          gradientSize;
      }
      const { r, g, b } = this.color;
      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;
      context.imageSmoothingEnabled = this._currentPixelSmoothing;
      context.drawImage(
        Particle.getGradientImage(r, g, b),
        0,
        0,
        gradientSize,
        gradientSize,
        this.x - this.scaleX / 2,
        this.y - this.scaleY / 2,
        this.scaleX,
        this.scaleY
      );
      context.imageSmoothingEnabled = true;
    }
  }
}

export default Particle;
