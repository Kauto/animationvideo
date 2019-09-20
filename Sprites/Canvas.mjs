import calc from "../func/calc.mjs";
import ifNull from "../func/ifnull.mjs";
import Group from "./Group.mjs";

export default class Canvas extends Group {
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
    this._temp_canvas = document.createElement("canvas");
    if (this.gridSize) {
      this._currentGridSize = this.gridSize;
      this._temp_canvas.width = Math.round(this._currentGridSize);
      this._temp_canvas.height = Math.round(this._currentGridSize);
    } else {
      this._temp_canvas.width = Math.round(w / this.scaleX);
      this._temp_canvas.height = Math.round(h / this.scaleY);
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

  resize(context, additionalModifier) {
    if (this._temp_canvas && this._currentGridSize !== this.gridSize) {
      const oldTempCanvas = this._temp_canvas;
      this.generateTempCanvas(context, additionalModifier);
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
        this.generateTempCanvas(context, additionalModifier);
        this.normalizeFullScreen(additionalModifier);
      }
      if (this.gridSize && this._currentGridSize !== this.gridSize) {
        this.resize(context, additionalModifier);
      }

      const w = this.width,
        h = this.height,
        wh = w / 2,
        hh = h / 2,
        tw = this._temp_canvas.width,
        th = this._temp_canvas.height;

      this._tctx.textBaseline = "middle";
      this._tctx.textAlign = "center";
      this._tctx.globalAlpha = 1;
      this._tctx.globalCompositeOperation = "source-over";

      // draw all sprites
      for (let i in this.sprite) {
        this.sprite[i].draw(this._tctx, {
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

      this.additionalBlur && this.additionalBlur(tw, th, additionalModifier);

      context.save();
      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;
      context.translate(this.x + wh, this.y + hh);
      context.scale(this.scaleX, this.scaleY);
      context.rotate(this.rotation);
      context.drawImage(
        this._temp_canvas,
        0,
        0,
        this._temp_canvas.width,
        this._temp_canvas.height,
        -wh,
        -hh,
        w,
        h
      );
      context.restore();
    }
  }
}
