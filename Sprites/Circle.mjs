import ifNull from '../func/ifnull.mjs';
import calc from '../func/calc.mjs';
import Sequence from '../Animations/Sequence.mjs';

const degToRad = 0.017453292519943295; //Math.PI / 180;

// Sprite
// Draw a Circle
export default class Circle {

  constructor(params) {
    // Position
    this.x = ifNull(calc(params.x), 0);
    this.y = ifNull(calc(params.y), 0);
    // rotation
    this.arc = ifNull(calc(params.arc), 0);
    // Scale
    this.scaleX = ifNull(calc(params.scaleX), 1);
    this.scaleY = ifNull(calc(params.scaleY), 1);
    // Alpha
    this.a = ifNull(calc(params.a), 1);
    // Alphamode
    this.alphaMode = ifNull(calc(params.alphaMode), "source-over");
    // Color
    this.color = ifNull(calc(params.color), "#fff");
    // Animation
    this.animation = calc(params.animation);
    if (Array.isArray(this.animation)) {
      this.animation = new Sequence(this.animation)
    }
    // Sprite active
    this.enabled = ifNull(calc(params.enabled), true);
  }

  // Animation-Funktion
  animate(timepassed) {
    if (typeof(this.animation) === "object") {
      // run animation
      if (this.animation.run(this, timepassed, true) === true) {
        // disable
        this.enabled = false;
        return true;
      }
    }

    return false;
  };

  resize(output, additionalModifier) {}

  // Draw-Funktion
  draw(context, additionalModifier) {
    if (this.enabled) {
      context.globalCompositeOperation = this.alphaMode;
      context.globalAlpha = this.a * additionalModifier.a;
      context.save();
      context.translate(this.x, this.y);
      context.scale(this.scaleX, this.scaleY);
      context.beginPath();
      context.fillStyle = this.color;
      context.arc(0, 0, 1, (90 + this.arc) * degToRad, (450 - this.arc) * degToRad, false);
      context.fill();
      context.closePath();
      context.restore();
    }
  };
}