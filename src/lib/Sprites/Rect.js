import ifNull from '../../func/ifnull';
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
    this.x = calc(params.x);
    this.y = calc(params.y);

    this.borderColor = calc(params.borderColor);
    this.lineWidth = ifNull(calc(params.lineWidth), 1);
  }

  // Draw-Funktion
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (!this.width) {
        this.width = additionalModifier.w;
      }
      if (!this.height) {
        this.height = additionalModifier.h;
      }
      if (this.x === undefined) {
        this.x = additionalModifier.x;
      }
      if (this.y === undefined) {
        this.y = additionalModifier.y;
      }
      
      context.globalCompositeOperation = this.alphaMode;
      context.globalAlpha = this.a * additionalModifier.a;
      if (this.arc === 0) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        if (this.borderColor) {
            context.beginPath();
            context.lineWidth = this.lineWidth;
            context.strokeStyle = this.borderColor;
            context.rect(this.x, this.y, this.width, this.height);
            context.stroke();
        }
      } else {
        context.save();
        context.translate(this.x + this.width/2, this.y + this.height / 2);
        context.rotate(this.arc * degToRad);
        context.fillStyle = this.color;
        context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        if (this.borderColor) {
            context.beginPath();
            context.lineWidth = this.lineWidth;
            context.strokeStyle = this.borderColor;
            context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            context.stroke();
        }
        context.restore();
      }
    }
  };
}