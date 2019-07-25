import ifNull from "../../func/ifnull.mjs";
import calc from "../../func/calc.mjs";
import Rect from "./Rect.mjs";
// Sprite
// Draw a Circle
export default class StarField extends Rect {
  constructor(params) {
    super(params);
    this.count = ifNull(calc(params.count), 40);
    this.moveX = ifNull(calc(params.moveX), 0);
    this.moveY = ifNull(calc(params.moveY), 0);
    this.moveZ = ifNull(calc(params.moveZ), 0);
    this.lineWidth = calc(params.lineWidth);
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

  init() {
    this.centerX = this.width / 2 + this.x;
    this.centerY = this.height / 2 + this.y;
    this.scaleZ = Math.min(this.width, this.height);
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
    while (x < -hw ) {
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
			this.starsLineWidth[i] = (1 - this.starsZ[i] / this.scaleZ) * 3 + 1;
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
        this.width = this.width || additionalModifier.w;
        this.height = this.height || additionalModifier.h;
        this.x = this.x === undefined ? additionalModifier.x : this.x;
        this.y = this.y === undefined ? additionalModifier.y : this.y;
				this.lineWidth = this.lineWidth || (additionalModifier.h / additionalModifier.orgH) / 4;
        this.init();
        return;
      }
      context.globalCompositeOperation = this.alphaMode;
      context.globalAlpha = this.a * additionalModifier.a;
      if (this.moveY == 0 && this.moveZ == 0 && this.moveX < 0) {
        context.fillStyle = this.color;
        let i = this.count;
        while (i--) {
          if (this.starsEnabled[i]) {
            context.fillRect(
              this.starsNewX[i],
              this.starsNewY[i] - this.starsLineWidth[i] * this.lineWidth / 2,
              this.starsOldX[i] - this.starsNewX[i],
              this.starsLineWidth[i] * this.lineWidth
            );
          }
        }
      } else {
        context.strokeStyle = this.color;
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
