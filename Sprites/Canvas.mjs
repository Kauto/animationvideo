import calc from "../func/calc.mjs";
import ifNull from "../func/ifnull.mjs";
import Group from "./Group.mjs";

export default class Canvas extends Group {
  constructor(givenParameter) {
    super(givenParameter);
    this._currentGridSize = false;
    this._drawFrame = 2;
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // x,y,width,height without default to enable norm
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      canvasWidth: undefined,
      canvasHeight: undefined,
      gridSize: undefined,
      norm: (value, givenParameter, setParameter) =>
        ifNull(
          calc(value),
          setParameter.x === undefined &&
            setParameter.y === undefined &&
            setParameter.width === undefined &&
            setParameter.height === undefined
        ),
      isDrawFrame: (value, givenParameter, setParameter) => ifNull(value, true)
    });
  }

  generateTempCanvas(additionalModifier) {
    const w = additionalModifier.widthInPixel;
    const h = additionalModifier.heightInPixel;
    this._temp_canvas = document.createElement("canvas");
    if (this.canvasWidth && this.canvasHeight) {
      this._temp_canvas.width = this.canvasWidth;
      this._temp_canvas.height = this.canvasHeight;
    } else if (this.gridSize) {
      this._currentGridSize = this.gridSize;
      this._temp_canvas.width = Math.round(this._currentGridSize);
      this._temp_canvas.height = Math.round(this._currentGridSize);
    } else {
      this._temp_canvas.width = Math.round(w / this.scaleX);
      this._temp_canvas.height = Math.round(h / this.scaleY);
    }
    this._tctx = this._temp_canvas.getContext("2d");
  }

  normalizeFullScreen(additionalModifier) {
    if (this.norm || this.x === undefined) {
      this.x = additionalModifier.visibleScreen.x;
    }
    if (this.norm || this.y === undefined) {
      this.y = additionalModifier.visibleScreen.y;
    }
    if (this.norm || this.width === undefined) {
      this.width = additionalModifier.visibleScreen.width;
    }
    if (this.norm || this.height === undefined) {
      this.height = additionalModifier.visibleScreen.height;
    }
  }

  resize(output, additionalModifier) {
    if (
      this._temp_canvas &&
      this._currentGridSize !== this.gridSize &&
      !this.canvasWidth
    ) {
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
      this._drawFrame = 2;
    }
    this.normalizeFullScreen(additionalModifier);
    super.resize(output, additionalModifier);
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (!this._temp_canvas) {
        this.generateTempCanvas(additionalModifier);
        this.normalizeFullScreen(additionalModifier);
      }
      if (this.gridSize && this._currentGridSize !== this.gridSize) {
        this.resize(additionalModifier);
      }
      this._drawFrame = Math.max(
        this._drawFrame - 1,
        calc(this.isDrawFrame, context, additionalModifier)
      );
      const w = this.width,
        h = this.height,
        wh = w / 2,
        hh = h / 2,
        tw = this._temp_canvas.width,
        th = this._temp_canvas.height;

      if (this._drawFrame) {
        this._tctx.textBaseline = "middle";
        this._tctx.textAlign = "center";
        this._tctx.globalAlpha = 1;
        this._tctx.globalCompositeOperation = "source-over";
        this._tctx.save();
        // draw all sprites
        const cam = additionalModifier.cam;
        if (this.norm && cam) {
          const scale = Math.max(tw, th) / 2;
          this._tctx.translate(tw / 2, th / 2);
          this._tctx.scale(scale, scale);
          this._tctx.scale(cam.zoom, cam.zoom);
          this._tctx.translate(-cam.x, -cam.y);
        }
        for (let i in this.sprite) {
          this.sprite[i].draw(
            this._tctx,
            this.norm
              ? Object.assign({}, additionalModifier, {
                  alpha: 1,
                  widthInPixel: tw,
                  heightInPixel: th
                })
              : {
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
                }
          );
        }
        this._tctx.restore();
      }

      context.save();
      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;
      context.translate(this.x + wh, this.y + hh);
      context.scale(this.scaleX, this.scaleY);
      context.rotate(this.rotation);
      context.drawImage(this._temp_canvas, 0, 0, tw, th, -wh, -hh, w, h);
      context.restore();
    }
  }
}
