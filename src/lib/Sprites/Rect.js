import calc from '../../func/calc';
import Circle from './Circle';

const degToRad = 0.017453292519943295; //Math.PI / 180;

// Sprite
// Draw a Circle
export default class Rect extends Circle {

  constructor(params) {
    super(params);
    // Size
    this.width = calc(params.width);
    this.height = calc(params.height);
  }

  // Draw-Funktion
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (!this.width) {
        this.width = context.canvas.width;
      }
      if (!this.height) {
        this.height = context.canvas.height;
      }
      let a = this.a;
      if (additionalModifier) {
        a *= additionalModifier.a;
      }
      context.globalCompositeOperation = this.alphaMode;
      context.globalAlpha = a;
      if (this.arc === 0) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
      } else {
        context.save();
        context.translate(this.x + this.width/2, this.y + this.height / 2);
        context.scale(this.width, this.height);
        context.fillStyle = this.color;
        context.fillRect(-0.5, -0.5, 1, 1);
        context.restore();
      }
    }
  };
}