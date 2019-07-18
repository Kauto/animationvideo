import calc from '../../func/calc.mjs';
import Group from './Group.mjs';

const degToRad = 0.017453292519943295; //Math.PI / 180;

export default class Canvas extends Group {

  constructor(params) {
    super(params);
    // x,y,width,height without default to enable norm 
    this.x = calc(params.x);
    this.y = calc(params.y);
    this.width = calc(params.width);
    this.height = calc(params.height);
    this.gridSize = calc(params.gridSize);
    this.norm = ifNull(calc(params.norm), (this.x === undefined && this.y === undefined && this.width === undefined && this.height === undefined));
    this.currentGridSize = false;
  }

  generateTempCanvas(context, additionalModifier) {
    let w = additionalModifier.orgW || context.canvas.width,
      h = additionalModifier.orgH || context.canvas.height;
    this.temp_canvas = document.createElement('canvas');
    if (this.gridSize) {
      this.currentGridSize = this.gridSize;
      this.temp_canvas.width = Math.round(this.currentGridSize);
      this.temp_canvas.height = Math.round(this.currentGridSize);
      } else {
      this.temp_canvas.width = Math.round(w / this.scaleX);
      this.temp_canvas.height = Math.round(h / this.scaleY);
      }
    this.tctx = this.temp_canvas.getContext('2d');
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
      this.tctx.drawImage(oldTempCanvas,0,0,oldTempCanvas.width, oldTempCanvas.height, 0,0,this.temp_canvas.width, this.temp_canvas.height)
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
          a: 1,
          x: 0,
          y: 0,
          w: tw,
          h: th,
          orgW: tw,
          orgH: th,
          visibleScreen: {
            x: 0,
            y: 0,
            w: tw,
            h: th
          }
        });
      }

      context.save();
      context.globalCompositeOperation = this.alphaMode;
      context.globalAlpha = this.a * additionalModifier.a;
      context.translate(this.x + wh, this.y + hh);
      context.scale(this.scaleX, this.scaleY);
      context.rotate(this.arc * degToRad);
      context.drawImage(this.temp_canvas, 0, 0, this.temp_canvas.width, this.temp_canvas.height, -wh, -hh, w, h);
      context.restore();
    }
  }
}
