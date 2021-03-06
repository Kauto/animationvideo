import Circle from "./Circle.mjs";
import ifNull from "../func/ifNull.mjs";
import calc from "../func/calc.mjs";

// Sprite
// Draw a Circle
class Rect extends Circle {
  constructor(givenParameters) {
    super(givenParameters);
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
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
        ),
      // relative position
      position: Rect.CENTER
    });
  }

  normalizeFullScreen(additionalModifier) {
    if (this.norm || this.width === undefined) {
      this.width = additionalModifier.visibleScreen.width;
    }
    if (this.norm || this.height === undefined) {
      this.height = additionalModifier.visibleScreen.height;
    }
    if (this.norm || this.x === undefined) {
      this.x = additionalModifier.visibleScreen.x;
      if (this.position === Rect.CENTER) {
        this.x += this.width / 2;
      }
    }
    if (this.norm || this.y === undefined) {
      this.y = additionalModifier.visibleScreen.y;
      if (this.position === Rect.CENTER) {
        this.y += this.height / 2;
      }
    }
  }

  resize(output, additionalModifier) {
    this._needInit = true;
  }

  init(context, additionalModifier) {
    this.normalizeFullScreen(additionalModifier);
  }

  detect(context, x, y) {
    return this._detectHelper(context, x, y, this.position === Rect.LEFT_TOP);
  }

  // Draw-Funktion
  draw(context, additionalModifier) {
    if (this.enabled && this.alpha > 0) {
      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;
      if (this.rotation === 0 && this.position === Rect.LEFT_TOP) {
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
        if (this.position === Rect.LEFT_TOP) {
          context.translate(this.x + hw, this.y + hh);
        } else {
          context.translate(this.x, this.y);
        }
        context.scale(this.scaleX, this.scaleY);
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
Rect.LEFT_TOP = 0;
Rect.CENTER = 1;

export default Rect;
