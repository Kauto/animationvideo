import Circle from "./Circle.mjs";

// Sprite
// Draw a Circle
export default class Rect extends Circle {
  constructor(givenParameters) {
    super(givenParameters);
  }

  getParameterList() {
    return {
      ...super.getParameterList(),
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      borderColor: undefined,
      lineWidth: 1,
      clear: false
    };
  }

  // Draw-Funktion
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (!this.width) {
        this.width = additionalModifier.width;
      }
      if (!this.height) {
        this.height = additionalModifier.height;
      }
      if (this.x === undefined) {
        this.x = additionalModifier.x;
      }
      if (this.y === undefined) {
        this.y = additionalModifier.y;
      }

      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;
      if (this.arc === 0) {
        if (this.clear) {
          context.clearRect(this.x, this.y, this.width, this.height);
        } else {
          context.fillStyle = this.color;
          context.fillRect(this.x, this.y, this.width, this.height);
        }
        if (this.borderColor) {
          context.beginPath();
          context.lineWidth = this.lineWidth;
          context.strokeStyle = this.borderColor;
          context.rect(this.x, this.y, this.width, this.height);
          context.stroke();
        }
      } else {
        let hw = this.width / 2;
        let hh = this.height / 2;
        context.save();
        context.translate(this.x + hw, this.y + hh);
        context.rotate(this.rotation);
        if (this.clear) {
          context.clearRect(-hw, -hh, this.width, this.height);
        } else {
          context.fillStyle = this.color;
          context.fillRect(-hw, -hh, this.width, this.height);
        }
        if (this.borderColor) {
          context.beginPath();
          context.lineWidth = this.lineWidth;
          context.strokeStyle = this.borderColor;
          context.rect(-hw, -hh, this.width, this.height);
          context.stroke();
        }
        context.restore();
      }
    }
  }
}
