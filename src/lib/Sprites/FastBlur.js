import ifNull from '../../func/ifnull';
import calc from '../../func/calc';
import Circle from './Circle';

export default class FastBlur extends Circle {

  constructor(params) {
    super(params);
    // Size
    this.width = calc(params.width);
    this.height = calc(params.height);
    // Darker
    this.darker = ifNull(calc(params.darker), 0);
  }

  generateTempCanvas(context) {
    let w = context.canvas.width,
      h = context.canvas.height;
    this.temp_canvas = document.createElement('canvas');
    this.temp_canvas.width = Math.round(w / this.scaleX);
    this.temp_canvas.height = Math.round(h / this.scaleY);
    this.tctx = this.temp_canvas.getContext('2d');
    this.tctx.globalCompositeOperation = "source-over";
    this.tctx.globalAlpha = 1;
    if (!this.width) {
      this.width = w;
    }
    if (!this.height) {
      this.height = h;
    }
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (!this.temp_canvas) {
        this.generateTempCanvas(context);
      }

      let a = this.a,
        w = this.width,
        h = this.height,
        targetW = Math.round(w / this.scaleX),
        targetH = Math.round(h / this.scaleY);

      if (additionalModifier) {
        a *= additionalModifier.a;
      }
      if (a > 0) {
        this.tctx.drawImage(context.canvas, this.x, this.y, w, h, 0, 0, targetW, targetH);

        if (this.darker > 0) {
          this.tctx.globalCompositeOperation = "source-over";
          this.tctx.globalAlpha = 1;
          this.tctx.fillStyle = "rgba(0,0,0," + this.darker + ")";
          this.tctx.fillRect(0, 0, targetW, targetH);
        }

        context.globalCompositeOperation = this.alphaMode;
        context.globalAlpha = a;
        context.drawImage(this.temp_canvas, 0, 0, targetW, targetH, this.x, this.y, w, h);
      }
    }
  }
}