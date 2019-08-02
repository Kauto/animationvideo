import ifNull from "../func/ifnull.mjs";
import calc from "../func/calc.mjs";
import Circle from "./Circle.mjs";

export default class FastBlur extends Circle {
  constructor(params) {
    super(params);
    // Size
    this.x = calc(params.x);
    this.y = calc(params.y);
    this.width = calc(params.width);
    this.height = calc(params.height);

    this.gridSize = calc(params.gridSize);
    this.darker = ifNull(calc(params.darker), 0);
    this.pixel = ifNull(calc(params.pixel), false);
    this.clear = ifNull(calc(params.clear), false);
    this.norm = ifNull(
      calc(params.norm),
      this.x === undefined &&
        this.y === undefined &&
        this.width === undefined &&
        this.height === undefined
    );
    this.currentGridSize = false;
  }

  generateTempCanvas(context, additionalModifier) {
    const w = additionalModifier.orgW || context.canvas.width,
      h = additionalModifier.orgH || context.canvas.height;
    this.temp_canvas = document.createElement("canvas");
    if (this.gridSize) {
      this.currentGridSize = this.gridSize;
      this.temp_canvas.width = Math.round(this.currentGridSize);
      this.temp_canvas.height = Math.round(this.currentGridSize);
    } else {
      this.temp_canvas.width = Math.ceil(w / this.scaleX);
      this.temp_canvas.height = Math.ceil(h / this.scaleY);
    }
    this.tctx = this.temp_canvas.getContext("2d");
    this.tctx.globalCompositeOperation = "source-over";
    this.tctx.globalAlpha = 1;
  }

  normalizeFullScreen(additionalModifier) {
    if (this.x === undefined || this.norm) {
      this.x = additionalModifier.visibleScreen.x;
    }
    if (this.y === undefined || this.norm) {
      this.y = additionalModifier.visibleScreen.y;
    }
    if (this.width === undefined || this.norm) {
      this.width = additionalModifier.visibleScreen.w;
    }
    if (this.height === undefined || this.norm) {
      this.height = additionalModifier.visibleScreen.h;
    }
  }

  resize(context, additionalModifier) {
    if (this.temp_canvas && this.currentGridSize !== this.gridSize) {
      const oldTempCanvas = this.temp_canvas;
      this.generateTempCanvas(context, additionalModifier);
      this.tctx.globalCompositeOperation = "copy";
      this.tctx.drawImage(
        oldTempCanvas,
        0,
        0,
        oldTempCanvas.width,
        oldTempCanvas.height,
        0,
        0,
        this.temp_canvas.width,
        this.temp_canvas.height
      );
      this.tctx.globalCompositeOperation = "source-over";
    }
    this.normalizeFullScreen(additionalModifier);
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (!this.temp_canvas) {
        this.generateTempCanvas(context, additionalModifier);
        this.normalizeFullScreen(additionalModifier);
      }
      if (this.gridSize && this.currentGridSize !== this.gridSize) {
        this.resize(context, additionalModifier);
      }

      let a = this.a * additionalModifier.a,
        w = this.width,
        h = this.height,
        targetW = this.temp_canvas.width,
        targetH = this.temp_canvas.height;

      if (a > 0 && targetW && targetH) {
        this.tctx.globalCompositeOperation = "copy";
        this.tctx.globalAlpha = 1;
        this.tctx.drawImage(
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
          this.tctx.globalCompositeOperation = this.clear
            ? "source-atop"
            : "source-over"; // "source-atop"; source-atop works with transparent background but source-over is much faster
          this.tctx.fillStyle = "rgba(0,0,0," + this.darker + ")";
          this.tctx.fillRect(0, 0, targetW, targetH);
        }

        // optional: clear screen
        if (this.clear) {
          context.clearRect(this.x, this.y, w, h);
        }
        context.globalCompositeOperation = this.alphaMode;
        context.globalAlpha = a;
        context.imageSmoothingEnabled = !this.pixel;
        context.drawImage(
          this.temp_canvas,
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
          this.width = additionalModifier.w;
        }
        if (!this.height) {
          this.height = additionalModifier.h;
        }
        context.clearRect(this.x, this.y, this.width, this.height);
      }
    }
  }
}
