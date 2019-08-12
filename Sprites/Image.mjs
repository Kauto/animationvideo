import calc from "../func/calc.mjs";
import ImageManager from "../ImageManager.mjs";
import Circle from "./Circle.mjs";

// Sprite
// Draw a Image
class Image extends Circle {
  constructor(givenParameter) {
    super(givenParameter);
  }

  getParameterList() {
    return {
      ...super.getParameterList(),
      // set image
      image: v => ImageManager.getImage(calc(v)),
      // relative position
      position: Image.CENTER,
      // cutting for sprite stripes
      frameX: 0,
      frameY: 0,
      frameWidth: 0,
      frameHeight: 0,
      // autoscale to max
      norm: false
    };
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
              additionalModifier.width / frameWidth,
              additionalModifier.height / frameHeight
            )
          : 1;
      }
      const sX = frameWidth * this.normScale * this.scaleX,
        sY = frameHeight * this.normScale * this.scaleY;
      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;
      if (this.rotation == 0) {
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
        context.rotate(this.rotation);
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
