import ifNull from "../func/ifnull.mjs";
import calc from "../func/calc.mjs";
import Rect from "./Rect.mjs";
// Sprite
// Draw a Circle
export default class StarField extends Rect {
  constructor(givenParameters) {
    super(givenParameters);

    if (
      this.x !== undefined &&
      this.y !== undefined &&
      this.width &&
      this.height &&
      this.lineWidth
    ) {
      this.init();
    } else {
      this.centerX = undefined;
    }
  }

  getParameterList() {
    return {
      ...super.getParameterList(),
      // set image
      count: 40,
      // relative position
      moveX: 0.,
      moveY: 0.,
      moveZ: 0.,
      lineWidth: undefined,
      highScale: true
    };
  }

  init() {
    this.centerX = this.width / 2 + this.x;
    this.centerY = this.height / 2 + this.y;
    this.scaleZ = Math.max(this.width, this.height) / 2;
    this.starsX = [];
    this.starsY = [];
    this.starsZ = [];
    this.starsOldX = [];
    this.starsOldY = [];
    this.starsNewX = [];
    this.starsNewY = [];
    this.starsEnabled = [];
    this.starsLineWidth = [];
    for (let i = 0; i < this.count; i++) {
      this.starsX[i] = Math.random() * this.width - this.width / 2;
      this.starsY[i] = Math.random() * this.height - this.height / 2;
      this.starsZ[i] = Math.random() * this.scaleZ;
    }
  }

  moveStar(i, scaled_timepassed, firstPass) {
    if (firstPass) {
      this.starsEnabled[i] = true;
    }
    const hw = this.width / 2;
    const hh = this.height / 2;
    let x = this.starsX[i] + this.moveX * scaled_timepassed,
      y = this.starsY[i] + this.moveY * scaled_timepassed,
      z = this.starsZ[i] + this.moveZ * scaled_timepassed;
    while (x < -hw) {
      x += this.width;
      y = Math.random() * this.height - hh;
      this.starsEnabled[i] = false;
    }
    while (x > hw) {
      x -= this.width;
      y = Math.random() * this.height - hh;
      this.starsEnabled[i] = false;
    }

    while (y < -hh) {
      y += this.height;
      x = Math.random() * this.width - hw;
      this.starsEnabled[i] = false;
    }
    while (y > hh) {
      y -= this.height;
      x = Math.random() * this.width - hw;
      this.starsEnabled[i] = false;
    }

    while (z <= 0) {
      z += this.scaleZ;
      x = Math.random() * this.width - hw;
      y = Math.random() * this.height - hh;
      this.starsEnabled[i] = false;
    }
    while (z > this.scaleZ) {
      z -= this.scaleZ;
      x = Math.random() * this.width - hw;
      y = Math.random() * this.height - hh;
      this.starsEnabled[i] = false;
    }

    const projectX = this.centerX + (x / z) * hw;
    const projectY = this.centerY + (y / z) * hh;
    this.starsEnabled[i] =
      this.starsEnabled[i] &&
      projectX >= this.x &&
      projectY >= this.y &&
      projectX < this.x + this.width &&
      projectY < this.y + this.height;
    if (firstPass) {
      this.starsX[i] = x;
      this.starsY[i] = y;
      this.starsZ[i] = z;
      this.starsNewX[i] = projectX;
      this.starsNewY[i] = projectY;
    } else {
      this.starsOldX[i] = projectX;
      this.starsOldY[i] = projectY;
      let lw = (1 - this.starsZ[i] / this.scaleZ) * 4;
      if (!this.highScale) {
        lw = Math.ceil(lw);
      }
      this.starsLineWidth[i] = lw;
    }
  }

  animate(timepassed) {
    let ret = super.animate(timepassed);
    if (this.enabled && this.centerX !== undefined) {
      let i = this.count;
      while (i--) {
        this.moveStar(i, timepassed / 16, true);
        if (this.starsEnabled[i]) {
          this.moveStar(i, -5, false);
        }
      }
    }
    return ret;
  }

  // Draw-Funktion
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (this.centerX === undefined) {
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
        this.init();
        return;
      }
      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;
      if (this.moveY == 0 && this.moveZ == 0 && this.moveX < 0) {
        context.fillStyle = this.color;
        let i = this.count;
        while (i--) {
          if (this.starsEnabled[i]) {
            context.fillRect(
              this.starsNewX[i],
              this.starsNewY[i] - (this.starsLineWidth[i] * this.lineWidth) / 2,
              this.starsOldX[i] - this.starsNewX[i],
              this.starsLineWidth[i] * this.lineWidth
            );
          }
        }
      } else {
        context.strokeStyle = this.color;
        if (this.highScale) {
          let i = this.count;
          while (i--) {
            if (this.starsEnabled[i]) {
              context.beginPath();
              context.lineWidth = this.starsLineWidth[i] * this.lineWidth;
              context.moveTo(this.starsOldX[i], this.starsOldY[i]);
              context.lineTo(this.starsNewX[i], this.starsNewY[i]);
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
              if (this.starsEnabled[i] && this.starsLineWidth[i] === lw) {
                context.moveTo(this.starsOldX[i], this.starsOldY[i]);
                context.lineTo(this.starsNewX[i], this.starsNewY[i]);
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
