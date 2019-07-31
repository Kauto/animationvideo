import ifNull from "../../func/ifnull.mjs";
import calc from "../../func/calc.mjs";
import ImageManager from "../ImageManager.mjs";
import Circle from "./Circle.mjs";

const degToRad = 0.017453292519943295; //Math.PI / 180;

// Sprite
// Draw a Image
class Image extends Circle {
  constructor(params) {
    super(params);
    // Image
    this.image = ImageManager.getImage(calc(params.image));
    // relativ position
    this.position = ifNull(calc(params.position), Image.CENTER);
    this.frameX = ifNull(calc(params.frameX), 0);
    this.frameY = ifNull(calc(params.frameY), 0);
    this.frameWidth = ifNull(calc(params.frameWidth), 0);
    this.frameHeight = ifNull(calc(params.frameHeight), 0);
    this.norm = ifNull(calc(params.norm), false);
  }

  resize() {
    this.normScale = undefined;
  }

  // Draw-Funktion
  draw(context, additionalModifier) {
    if (this.enabled && this.image) {
      const frameWidth = this.frameWidth || this.image.width,
        frameHeight = this.frameHeight || this.image.height;
      if (!this.normScale) {
        this.normScale = this.norm
          ? Math.min(
              additionalModifier.w / frameWidth,
              additionalModifier.h / frameHeight
            )
          : 1;
      }
      const sX = frameWidth * this.normScale * this.scaleX,
        sY = frameHeight * this.normScale * this.scaleY;
      context.globalCompositeOperation = this.alphaMode;
      context.globalAlpha = this.a * additionalModifier.a;
      if (this.arc == 0) {
        if (this.position === Image.LEFT_TOP) {
          context.drawImage(
            this.image,
            this.frameX,
            this.frameY,
            frameWidth,
            frameHeight,
            this.x,
            this.y,
            sX,
            sY
          );
        } else {
          context.drawImage(
            this.image,
            this.frameX,
            this.frameY,
            frameWidth,
            frameHeight,
            this.x - sX / 2,
            this.y - sY / 2,
            sX,
            sY
          );
        }
      } else {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.arc * degToRad);
        context.drawImage(
          this.image,
          this.frameX,
          this.frameY,
          frameWidth,
          frameHeight,
          -sX / 2,
          -sY / 2,
          sX,
          sY
        );
        context.restore();
      }
    }
  }
}
Image.LEFT_TOP = 0;
Image.CENTER = 1;

export default Image;
