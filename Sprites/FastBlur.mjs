import ifNull from "../func/ifnull.mjs";
import calc from "../func/calc.mjs";
import Circle from "./Circle.mjs";

export default class FastBlur extends Circle {
  constructor(givenParameter) {
    super(givenParameter);

    this._currentGridSize = false;
  }

  getParameterList() {
    return Object.assign({}, super.getParameterList(), {
      // x,y,width,height without default to enable norm
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      gridSize: undefined,
      darker: 0,
      pixel: false,
      clear: false,
      norm: (value, givenParameter, setParameter) =>
        ifNull(
          calc(value),
          setParameter.x === undefined &&
            setParameter.y === undefined &&
            setParameter.width === undefined &&
            setParameter.height === undefined
        )
    });
  }

  generateTempCanvas(additionalModifier) {
    const w = additionalModifier.widthInPixel
    const h = additionalModifier.heightInPixel
    this._temp_canvas = document.createElement("canvas");
    if (this.gridSize) {
      this._currentGridSize = this.gridSize;
      this._temp_canvas.width = Math.round(this._currentGridSize);
      this._temp_canvas.height = Math.round(this._currentGridSize);
    } else {
      this._temp_canvas.width = Math.ceil(w / this.scaleX);
      this._temp_canvas.height = Math.ceil(h / this.scaleY);
    }
    this._tctx = this._temp_canvas.getContext("2d");
    this._tctx.globalCompositeOperation = "source-over";
    this._tctx.globalAlpha = 1;
  }

  normalizeFullScreen(additionalModifier) {
    if (this.x === undefined || this.norm) {
      this.x = additionalModifier.visibleScreen.x;
    }
    if (this.y === undefined || this.norm) {
      this.y = additionalModifier.visibleScreen.y;
    }
    if (this.width === undefined || this.norm) {
      this.width = additionalModifier.visibleScreen.width;
    }
    if (this.height === undefined || this.norm) {
      this.height = additionalModifier.visibleScreen.height;
    }
  }

  resize(output, additionalModifier) {
    if (this._temp_canvas && this._currentGridSize !== this.gridSize) {
      const oldTempCanvas = this._temp_canvas;
      this.generateTempCanvas(additionalModifier);
      this._tctx.globalCompositeOperation = "copy";
      this._tctx.drawImage(
        oldTempCanvas,
        0,
        0,
        oldTempCanvas.width,
        oldTempCanvas.height,
        0,
        0,
        this._temp_canvas.width,
        this._temp_canvas.height
      );
      this._tctx.globalCompositeOperation = "source-over";
    }
    this.normalizeFullScreen(additionalModifier);
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (!this._temp_canvas) {
        this.generateTempCanvas(additionalModifier);
        this.normalizeFullScreen(additionalModifier);
      }
      if (this.gridSize && this._currentGridSize !== this.gridSize) {
        this.resize(context, additionalModifier);
      }

      const a = this.alpha * additionalModifier.alpha,
        w = this.width,
        h = this.height,
        targetW = this._temp_canvas.width,
        targetH = this._temp_canvas.height;

      if (a > 0 && targetW && targetH) {
        this._tctx.globalCompositeOperation = "copy";
        this._tctx.globalAlpha = 1;
        this._tctx.drawImage(
          context.canvas,
          0,
          0,
          context.canvas.width,
          context.canvas.height,
          0,
          0,
          targetW,
          targetH
        );

        if (this.darker > 0) {
          this._tctx.globalCompositeOperation = this.clear
            ? "source-atop"
            : "source-over"; // "source-atop"; source-atop works with transparent background but source-over is much faster
          this._tctx.fillStyle = "rgba(0,0,0," + this.darker + ")";
          this._tctx.fillRect(0, 0, targetW, targetH);
        }

        this.additionalBlur && this.additionalBlur(targetW, targetH, additionalModifier);

        // optional: clear screen
        if (this.clear) {
          context.clearRect(this.x, this.y, w, h);
        }
        context.globalCompositeOperation = this.compositeOperation;
        context.globalAlpha = a;
        context.imageSmoothingEnabled = !this.pixel;
        context.drawImage(
          this._temp_canvas,
          0,
          0,
          targetW,
          targetH,
          this.x,
          this.y,
          w,
          h
        );
        context.imageSmoothingEnabled = true;
      }
    } else {
      // optional: clear screen
      if (this.clear) {
        if (!this.x) {
          this.x = additionalModifier.x;
        }
        if (!this.y) {
          this.y = additionalModifier.y;
        }
        if (!this.width) {
          this.width = additionalModifier.width;
        }
        if (!this.height) {
          this.height = additionalModifier.height;
        }
        context.clearRect(this.x, this.y, this.width, this.height);
      }
    }
  }
}
