import calc from '../../func/calc.mjs';
import Group from './Group.mjs';

const degToRad = 0.017453292519943295; //Math.PI / 180;

export default class Canvas extends Group {

  constructor(params) {
    super(params);
    // Size
    this.width = calc(params.width);
    this.height = calc(params.height);
  }

  generateTempCanvas(context, additionalModifier) {
    let w = context.canvas.width,
      h = context.canvas.height;
    this.temp_canvas = document.createElement('canvas');
    this.temp_canvas.width = Math.round(w / this.scaleX);
    this.temp_canvas.height = Math.round(h / this.scaleY);
    this.tctx = this.temp_canvas.getContext('2d');
    this.tctx.globalCompositeOperation = "source-over";
    this.tctx.globalAlpha = 1;
    if (!this.width) {
      this.width = additionalModifier.w;
    }
    if (!this.height) {
      this.height = additionalModifier.h;
    }
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (!this.temp_canvas) {
        this.generateTempCanvas(context, additionalModifier);
      }

      let w = this.width,
        h = this.height,
        wh = w / 2,
        hh = h / 2;

      // draw all sprites
      for (let i in this.sprite) {
        this.sprite[i].draw(this.tctx, false);
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
