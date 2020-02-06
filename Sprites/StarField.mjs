import ifNull from "../func/ifnull.mjs";
import calc from "../func/calc.mjs";
import Rect from "./Rect.mjs";
// Sprite
// Draw a Circle
export default class StarField extends Rect {
  constructor(givenParameters) {
    super(givenParameters);

    this._starsX = [];
    this._starsY = [];
    this._starsZ = [];
    this._starsOldX = [];
    this._starsOldY = [];
    this._starsNewX = [];
    this._starsNewY = [];
    this._starsEnabled = [];
    this._starsLineWidth = [];
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // set image
      count: 40,
      // relative position
      moveX: 0,
      moveY: 0,
      moveZ: 0,
      lineWidth: undefined,
      highScale: true,
      color: "#FFF" // here default color is white
    });
  }

  init(context, additionalModifier) {
    this.width = this.width || additionalModifier.width;
    this.height = this.height || additionalModifier.height;
    this.x = this.x === undefined ? additionalModifier.x : this.x;
    this.y = this.y === undefined ? additionalModifier.y : this.y;
    this.lineWidth =
      this.lineWidth ||
      Math.min(
        additionalModifier.height / additionalModifier.heightInPixel,
        additionalModifier.width / additionalModifier.widthInPixel
      ) / 2;
    this._centerX = this.width / 2 + this.x;
    this._centerY = this.height / 2 + this.y;
    this._scaleZ = Math.max(this.width, this.height) / 2;
    function clampOrRandom(val, min, max = -min) {
      return val === undefined || val < min || val >= max
        ? Math.random() * (max - min) + min
        : val;
    }
    for (let i = 0; i < this.count; i++) {
      this._starsX[i] = clampOrRandom(this._starsX[i], -this.width / 2);
      this._starsY[i] = clampOrRandom(this._starsY[i], -this.height / 2);
      this._starsZ[i] = clampOrRandom(this._starsZ[i], 0, this._scaleZ);
    }
  }

  moveStar(i, scaled_timepassed, firstPass) {
    if (firstPass) {
      this._starsEnabled[i] = true;
    }
    const hw = this.width / 2;
    const hh = this.height / 2;
    let x = this._starsX[i] + this.moveX * scaled_timepassed,
      y = this._starsY[i] + this.moveY * scaled_timepassed,
      z = this._starsZ[i] + this.moveZ * scaled_timepassed;
    while (x < -hw) {
      x += this.width;
      y = Math.random() * this.height - hh;
      this._starsEnabled[i] = false;
    }
    while (x > hw) {
      x -= this.width;
      y = Math.random() * this.height - hh;
      this._starsEnabled[i] = false;
    }

    while (y < -hh) {
      y += this.height;
      x = Math.random() * this.width - hw;
      this._starsEnabled[i] = false;
    }
    while (y > hh) {
      y -= this.height;
      x = Math.random() * this.width - hw;
      this._starsEnabled[i] = false;
    }

    while (z <= 0) {
      z += this._scaleZ;
      x = Math.random() * this.width - hw;
      y = Math.random() * this.height - hh;
      this._starsEnabled[i] = false;
    }
    while (z > this._scaleZ) {
      z -= this._scaleZ;
      x = Math.random() * this.width - hw;
      y = Math.random() * this.height - hh;
      this._starsEnabled[i] = false;
    }

    const projectX = this._centerX + (x / z) * hw;
    const projectY = this._centerY + (y / z) * hh;
    this._starsEnabled[i] =
      this._starsEnabled[i] &&
      projectX >= this.x &&
      projectY >= this.y &&
      projectX < this.x + this.width &&
      projectY < this.y + this.height;
    if (firstPass) {
      this._starsX[i] = x;
      this._starsY[i] = y;
      this._starsZ[i] = z;
      this._starsNewX[i] = projectX;
      this._starsNewY[i] = projectY;
    } else {
      this._starsOldX[i] = projectX;
      this._starsOldY[i] = projectY;
      let lw = (1 - this._starsZ[i] / this._scaleZ) * 4;
      if (!this.highScale) {
        lw = Math.ceil(lw);
      }
      this._starsLineWidth[i] = lw;
    }
  }

  animate(timepassed) {
    let ret = super.animate(timepassed);
    if (this.enabled && this._centerX !== undefined) {
      let i = this.count;
      while (i--) {
        this.moveStar(i, timepassed / 16, true);
        if (this._starsEnabled[i]) {
          this.moveStar(i, -5, false);
        }
      }
    }
    return ret;
  }

  resize(output, additionalModifier) {
    this._needInit = true
  }

  detect(context, color) {
    this._detectHelper(context, color, false);
  }

  // Draw-Funktion
  draw(context, additionalModifier) {
    if (this.enabled) {
      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;

      if (this.moveY == 0 && this.moveZ == 0 && this.moveX < 0) {
        context.fillStyle = this.color;
        let i = this.count;
        while (i--) {
          if (this._starsEnabled[i]) {
            context.fillRect(
              this._starsNewX[i],
              this._starsNewY[i] -
                (this._starsLineWidth[i] * this.lineWidth) / 2,
              this._starsOldX[i] - this._starsNewX[i],
              this._starsLineWidth[i] * this.lineWidth
            );
          }
        }
      } else {
        context.strokeStyle = this.color;
        if (this.highScale) {
          let i = this.count;
          while (i--) {
            if (this._starsEnabled[i]) {
              context.beginPath();
              context.lineWidth = this._starsLineWidth[i] * this.lineWidth;
              context.moveTo(this._starsOldX[i], this._starsOldY[i]);
              context.lineTo(this._starsNewX[i], this._starsNewY[i]);
              context.stroke();
              context.closePath();
            }
          }
        } else {
          let lw = 5,
            i;
          while (--lw) {
            context.beginPath();
            context.lineWidth = lw * this.lineWidth;
            i = this.count;
            while (i--) {
              if (this._starsEnabled[i] && this._starsLineWidth[i] === lw) {
                context.moveTo(this._starsOldX[i], this._starsOldY[i]);
                context.lineTo(this._starsNewX[i], this._starsNewY[i]);
              }
            }
            context.stroke();
            context.closePath();
          }
        }
      }
    }
  }
}
