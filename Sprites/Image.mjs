import calc from "../func/calc.mjs";
import ImageManager from "../ImageManager.mjs";
import Circle from "./Circle.mjs";

// Sprite
// Draw a Image
class Image extends Circle {
  constructor(givenParameter) {
    super(givenParameter);
    this._currentDye = false;
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // set image
      image: v => ImageManager.getImage(calc(v)),
      // relative position
      position: Image.CENTER,
      // cutting for sprite stripes
      frameX: 0,
      frameY: 0,
      frameWidth: 0,
      frameHeight: 0,
      width: undefined,
      height: undefined,
      // autoscale to max
      norm: false,
      normCover: false,
      normToScreen: false,
      clickExact: false,
      color: "#FFF",
      dye: 0
    });
  }

  resize(output, additionalModifier) {
    this._needInit = true;
  }

  init(context, additionalModifier) {
    const frameWidth = this.frameWidth || this.image.width;
    const frameHeight = this.frameHeight || this.image.height;

    this._normScale = this.normToScreen
      ? this.normCover
        ? Math.max(
            additionalModifier.fullScreen.width / frameWidth,
            additionalModifier.fullScreen.height / frameHeight
          )
        : this.norm
        ? Math.min(
            additionalModifier.fullScreen.width / frameWidth,
            additionalModifier.fullScreen.height / frameHeight
          )
        : 1
      : this.normCover
      ? Math.max(
          additionalModifier.width / frameWidth,
          additionalModifier.height / frameHeight
        )
      : this.norm
      ? Math.min(
          additionalModifier.width / frameWidth,
          additionalModifier.height / frameHeight
        )
      : 1;
  }

  _dyeCacheKey() {
    const frameWidth = this.frameWidth || this.image.width;
    const frameHeight = this.frameHeight || this.image.height;
    return [
      this.dye,
      frameWidth,
      frameHeight,
      this.color,
      this.frameX,
      this.frameY
    ].join(";");
  }

  _temp_context(frameWidth, frameHeight) {
    if (!this._temp_canvas) {
      this._temp_canvas = document.createElement("canvas");
      this._tctx = this._temp_canvas.getContext("2d");
    }
    this._temp_canvas.width = frameWidth;
    this._temp_canvas.height = frameHeight;
    return this._tctx;
  }

  detect(context, color) {
    this._detectHelper(context, color, false, () => {
      const frameWidth = this.frameWidth || this.image.width;
      const frameHeight = this.frameHeight || this.image.height;
      const sX =
        (this.width ? this.width : frameWidth) * this._normScale * this.scaleX;
      const sY =
        (this.height ? this.height : frameHeight) *
        this._normScale *
        this.scaleY;
      const isTopLeft = this.position === Image.LEFT_TOP;
      if (this.clickExact) {
        const tctx = this._temp_context(frameWidth, frameHeight);
        tctx.globalAlpha = 1;
        tctx.globalCompositeOperation = "source-over";
        tctx.fillStyle = color;
        tctx.fillRect(0, 0, frameWidth, frameHeight);
        tctx.globalCompositeOperation = "destination-atop";
        tctx.drawImage(
          this.image,
          this.frameX,
          this.frameY,
          frameWidth,
          frameHeight,
          0,
          0,
          frameWidth,
          frameHeight
        );
        context.drawImage(
          this._temp_canvas,
          0,
          0,
          frameWidth,
          frameHeight,
          isTopLeft ? 0 : -sX / 2,
          isTopLeft ? 0 : -sY / 2,
          sX,
          sY
        );
      } else {
        context.fillStyle = color;
        context.fillRect(
          isTopLeft ? 0 : -sX / 2,
          isTopLeft ? 0 : -sY / 2,
          sX,
          sY
        );
      }
      this._currentDye = false;
    });
  }

  // Draw-Funktion
  draw(context, additionalModifier) {
    if (this.enabled && this.image) {
      const frameWidth = this.frameWidth || this.image.width,
        frameHeight = this.frameHeight || this.image.height;
      const sX =
          (this.width ? this.width : frameWidth) *
          this._normScale *
          this.scaleX,
        sY =
          (this.height ? this.height : frameHeight) *
          this._normScale *
          this.scaleY;
      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;
      const isTopLeft = this.position === Image.LEFT_TOP;

      if (this.dye && this._currentDye !== this._dyeCacheKey()) {
        const tctx = this._temp_context(frameWidth, frameHeight);
        tctx.globalAlpha = 1;
        tctx.globalCompositeOperation = "source-over";
        tctx.clearRect(0, 0, frameWidth, frameHeight);
        tctx.globalAlpha = this.dye;
        tctx.fillStyle = this.color;
        tctx.fillRect(0, 0, frameWidth, frameHeight);
        tctx.globalAlpha = 1;
        tctx.globalCompositeOperation = "destination-atop";
        tctx.drawImage(
          this.image,
          this.frameX,
          this.frameY,
          frameWidth,
          frameHeight,
          0,
          0,
          frameWidth,
          frameHeight
        );
        this._currentDye = this._dyeCacheKey();
      }

      if (this.rotation == 0) {
        if (isTopLeft) {
          context.drawImage(
            this.dye ? this._temp_canvas : this.image,
            this.dye ? 0 : this.frameX,
            this.dye ? 0 : this.frameY,
            frameWidth,
            frameHeight,
            this.x,
            this.y,
            sX,
            sY
          );
        } else {
          context.drawImage(
            this.dye ? this._temp_canvas : this.image,
            this.dye ? 0 : this.frameX,
            this.dye ? 0 : this.frameY,
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
          this.dye ? this._temp_canvas : this.image,
          this.dye ? 0 : this.frameX,
          this.dye ? 0 : this.frameY,
          frameWidth,
          frameHeight,
          isTopLeft ? 0 : -sX / 2,
          isTopLeft ? 0 : -sY / 2,
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
