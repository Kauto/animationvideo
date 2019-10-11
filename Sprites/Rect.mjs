import Circle from "./Circle.mjs";
import ifNull from "../func/ifnull.mjs";
import calc from "../func/calc.mjs";

// Sprite
// Draw a Circle
export default class Rect extends Circle {
  constructor(givenParameters) {
    super(givenParameters);
  }

  getParameterList() {
    return Object.assign({}, super.getParameterList(), {
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      borderColor: undefined,
      color: undefined,
      lineWidth: 1,
      clear: false,
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

  resize(output, additionalModifier) {
    // this.normalizeFullScreen(additionalModifier);
  }

  // Draw-Funktion
  draw(context, additionalModifier) {
    if (this.enabled) {
      this.normalizeFullScreen(additionalModifier);

      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;
      if (this.rotation === 0) {
        if (this.clear) {
          context.clearRect(this.x, this.y, this.width, this.height);
        } else if (this.color) {
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
        } else if (this.color) {
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
