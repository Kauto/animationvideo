import calc from "../func/calc.mjs";
import Group from "./Group.mjs";

export default class Canvas extends Group {
  constructor(givenParameter) {
    super(givenParameter);
    this.currentGridSize = false;
  }

  getParameterList() {
    return Object.assign({}, super.getParameterList(), {
      // x,y,width,height without default to enable norm
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      gridSize: undefined,
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

  generateTempCanvas(context, additionalModifier) {
    let w = additionalModifier.widthInPixel || context.canvas.width,
      h = additionalModifier.heightInPixel || context.canvas.height;
    this.temp_canvas = document.createElement("canvas");
    if (this.gridSize) {
      this.currentGridSize = this.gridSize;
      this.temp_canvas.width = Math.round(this.currentGridSize);
      this.temp_canvas.height = Math.round(this.currentGridSize);
    } else {
      this.temp_canvas.width = Math.round(w / this.scaleX);
      this.temp_canvas.height = Math.round(h / this.scaleY);
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
      this.width = additionalModifier.visibleScreen.width;
    }
    if (this.height === undefined || this.norm) {
      this.height = additionalModifier.visibleScreen.height;
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

      const w = this.width,
        h = this.height,
        wh = w / 2,
        hh = h / 2,
        tw = this.temp_canvas.width,
        th = this.temp_canvas.height;

      // draw all sprites
      for (let i in this.sprite) {
        this.sprite[i].draw(this.tctx, {
          alpha: 1,
          x: 0,
          y: 0,
          width: tw,
          height: th,
          widthInPixel: tw,
          heightInPixel: th,
          visibleScreen: {
            x: 0,
            y: 0,
            width: tw,
            height: th
          }
        });
      }

      context.save();
      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;
      context.translate(this.x + wh, this.y + hh);
      context.scale(this.scaleX, this.scaleY);
      context.rotate(this.rotation);
      context.drawImage(
        this.temp_canvas,
        0,
        0,
        this.temp_canvas.width,
        this.temp_canvas.height,
        -wh,
        -hh,
        w,
        h
      );
      context.restore();
    }
  }
}
