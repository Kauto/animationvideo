import type { OutputInfo } from "../Engine";
import calc from "../func/calc";
import type { OrFunction } from "../helper";
import ImageManager from "../ImageManager";
import { Position } from "../Position";
import type { AdditionalModifier } from "../Scene";
import { CircleParameterList, SpriteCircleOptions, SpriteCircleOptionsInternal } from "./Circle";
import { SpriteBase } from "./Sprite";

export interface SpriteImageOptions extends SpriteCircleOptions {
  image: OrFunction<HTMLImageElement | string>
  position?: OrFunction<Position>
  frameX?: OrFunction<number>
  frameY?: OrFunction<number>
  frameWidth?: OrFunction<number>
  frameHeight?: OrFunction<number>
  width?: OrFunction<number>
  height?: OrFunction<number>
  norm?: OrFunction<boolean>
  normCover?: OrFunction<boolean>
  normToScreen?: OrFunction<boolean>
  clickExact?: OrFunction<boolean>
  tint?: OrFunction<number>
}

export interface SpriteImageOptionsInternal extends SpriteCircleOptionsInternal {
  image: HTMLImageElement
  position: Position
  frameX: number
  frameY: number
  frameWidth: number
  frameHeight: number
  width: number
  height: number
  norm: boolean
  normCover: boolean
  normToScreen: boolean
  clickExact: boolean
  tint: number
}

// Sprite
// Draw a Image
class Image extends SpriteBase<SpriteImageOptions, SpriteImageOptionsInternal> {
  _currentTintKey: string | undefined
  _normScale: number | undefined
  _temp_canvas: HTMLCanvasElement | undefined
  _tctx: CanvasRenderingContext2D | undefined

  constructor(givenParameter: SpriteImageOptions) {
    super(givenParameter);
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), CircleParameterList, {
      // set image
      image: (v: OrFunction<HTMLImageElement | string>) => ImageManager.getImage(calc(v)),
      // relative position
      position: Position.CENTER,
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
      tint: 0
    });
  }

  resize(output: OutputInfo, additionalModifier: AdditionalModifier) {
    this._needInit = true;
  }

  init(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) {
    const p = this.p
    const frameWidth = p.frameWidth || p.image.width;
    const frameHeight = p.frameHeight || p.image.height;

    this._normScale = p.normToScreen
      ? p.normCover
        ? Math.max(
          additionalModifier.fullScreen.width / frameWidth,
          additionalModifier.fullScreen.height / frameHeight
        )
        : p.norm
          ? Math.min(
            additionalModifier.fullScreen.width / frameWidth,
            additionalModifier.fullScreen.height / frameHeight
          )
          : 1
      : p.normCover
        ? Math.max(
          additionalModifier.width / frameWidth,
          additionalModifier.height / frameHeight
        )
        : p.norm
          ? Math.min(
            additionalModifier.width / frameWidth,
            additionalModifier.height / frameHeight
          )
          : 1;
  }

  _tintCacheKey() {
    const frameWidth = this.p.frameWidth || this.p.image.width;
    const frameHeight = this.p.frameHeight || this.p.image.height;
    return [
      this.p.tint,
      frameWidth,
      frameHeight,
      this.p.color,
      this.p.frameX,
      this.p.frameY
    ].join(";");
  }

  _temp_context(frameWidth: number, frameHeight: number): CanvasRenderingContext2D {
    if (!this._temp_canvas) {
      this._temp_canvas = document.createElement("canvas");
      this._tctx = this._temp_canvas.getContext("2d")!;
    }
    this._temp_canvas.width = frameWidth;
    this._temp_canvas.height = frameHeight;
    return this._tctx!;
  }

  detectDraw(context: CanvasRenderingContext2D, color: string) {
    const p = this.p
    if (p.enabled && p.isClickable && p.clickExact) {
      const frameWidth = p.frameWidth || p.image.width;
      const frameHeight = p.frameHeight || p.image.height;
      const sX =
        (p.width ? p.width : frameWidth) * this._normScale! * p.scaleX;
      const sY =
        (p.height ? p.height : frameHeight) *
        this._normScale! *
        p.scaleY;
      const isTopLeft = p.position === Position.LEFT_TOP;

      const tctx = this._temp_context(frameWidth, frameHeight);
      tctx.globalAlpha = 1;
      tctx.globalCompositeOperation = "source-over";
      tctx.fillStyle = color;
      tctx.fillRect(0, 0, frameWidth, frameHeight);
      tctx.globalCompositeOperation = "destination-atop";
      tctx.drawImage(
        p.image,
        p.frameX,
        p.frameY,
        frameWidth,
        frameHeight,
        0,
        0,
        frameWidth,
        frameHeight
      );

      context.save();
      context.translate(p.x, p.y);
      context.scale(p.scaleX, p.scaleY);
      context.rotate(p.rotation);
      context.drawImage(
        this._temp_canvas!,
        0,
        0,
        frameWidth,
        frameHeight,
        isTopLeft ? 0 : -sX / 2,
        isTopLeft ? 0 : -sY / 2,
        sX,
        sY
      );
      context.restore();
      this._currentTintKey = undefined;
    }
  }

  detect(context: CanvasRenderingContext2D, x: number, y: number) {
    if (this.p.enabled && this.p.isClickable && this.p.clickExact) return "c";
    return this._detectHelper(this.p, context, x, y, false);
  }

  // Draw-Funktion
  draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) {
    const p = this.p
    if (p.enabled && p.image && p.alpha > 0) {
      const frameWidth = p.frameWidth || p.image.width,
        frameHeight = p.frameHeight || p.image.height;
      const sX =
        (p.width ? p.width : frameWidth) *
        this._normScale! *
        p.scaleX,
        sY =
          (p.height ? p.height : frameHeight) *
          this._normScale! *
          p.scaleY;
      context.globalCompositeOperation = p.compositeOperation;
      context.globalAlpha = p.alpha * additionalModifier.alpha;
      const isCenter = p.position !== Position.LEFT_TOP;

      let img: CanvasImageSource = p.image
      let frameX = p.frameX
      let frameY = p.frameY

      if (p.tint) {
        const key = this._tintCacheKey()
        if (this._currentTintKey !== key) {
          const tctx = this._temp_context(frameWidth, frameHeight);
          tctx.globalAlpha = 1;
          tctx.globalCompositeOperation = "source-over";
          tctx.clearRect(0, 0, frameWidth, frameHeight);
          tctx.globalAlpha = p.tint;
          tctx.fillStyle = p.color;
          tctx.fillRect(0, 0, frameWidth, frameHeight);
          tctx.globalAlpha = 1;
          tctx.globalCompositeOperation = "destination-atop";
          tctx.drawImage(
            p.image,
            p.frameX,
            p.frameY,
            frameWidth,
            frameHeight,
            0,
            0,
            frameWidth,
            frameHeight
          );
          this._currentTintKey = key;
        }
        img = this._temp_canvas!
        frameX = 0
        frameY = 0
      }

      let cx = 0
      let cy = 0
      if (isCenter) {
        cx = - sX / 2
        cy = - sY / 2
      }

      if (p.rotation == 0) {
        context.drawImage(
          img,
          frameX,
          frameY,
          frameWidth,
          frameHeight,
          p.x + cx,
          p.y + cy,
          sX,
          sY
        );
      } else {
        context.save();
        context.translate(p.x, p.y);
        context.rotate(p.rotation);
        context.drawImage(
          img,
          frameX,
          frameY,
          frameWidth,
          frameHeight,
          cx,
          cy,
          sX,
          sY
        );
        context.restore();
      }
    }
  }
}

export default Image;
