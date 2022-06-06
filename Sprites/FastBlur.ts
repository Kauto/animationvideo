import ifNull from "../func/ifnull";
import calc from "../func/calc";
import { SpriteBase, SpriteBaseOptions, SpriteBaseOptionsInternal } from "./Sprite.js";
import type { OrFunction } from "../helper";
import type { AdditionalModifier } from "../Scene";
import type { OutputInfo } from "../Engine";

export interface SpriteFastBlurOptions extends SpriteBaseOptions {
  x?: OrFunction<undefined | number>
  y?: OrFunction<undefined | number>
  width?: OrFunction<undefined | number>
  height?: OrFunction<undefined | number>
  scaleX?: OrFunction<undefined | number>
  scaleY?: OrFunction<undefined | number>
  scale?: OrFunction<undefined | number>
  alpha?: OrFunction<undefined | number>
  gridSize?: OrFunction<undefined | number>
  darker?: OrFunction<undefined | number>
  pixel?: OrFunction<undefined | boolean>
  clear?: OrFunction<undefined | boolean>
  norm?: OrFunction<undefined | boolean>
  compositeOperation?: OrFunction<undefined | GlobalCompositeOperation>
}

export interface SpriteFastBlurOptionsInternal extends SpriteBaseOptionsInternal {
  x: undefined | number
  y: undefined | number
  width: undefined | number
  height: undefined | number
  scaleX?: number
  scaleY?: number
  gridSize: undefined | number
  darker: number
  pixel: boolean
  clear: boolean
  norm: boolean
  alpha: number
  compositeOperation: GlobalCompositeOperation
}

export default class FastBlur<O extends SpriteFastBlurOptions = SpriteFastBlurOptions, P extends SpriteFastBlurOptionsInternal = SpriteFastBlurOptionsInternal> extends SpriteBase<O,P> {
  _temp_canvas: HTMLCanvasElement | undefined;
  _currentGridSize: number | undefined
  _tctx: CanvasRenderingContext2D | undefined

  constructor(givenParameter: O) {
    super(givenParameter);
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // x,y,width,height without default to enable norm
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      gridSize: undefined,
      darker: 0,
      pixel: false,
      clear: false,
      norm: (value: SpriteFastBlurOptions['norm'], givenParameter: SpriteFastBlurOptions) =>
        ifNull(
          calc(value),
          calc(givenParameter.x) === undefined &&
          calc(givenParameter.y) === undefined &&
          calc(givenParameter.width) === undefined &&
          calc(givenParameter.height) === undefined
        ),
      // scalling
      scaleX: (value: SpriteFastBlurOptions['scaleX'], givenParameter: SpriteFastBlurOptions) => {
        return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
      },
      scaleY: (value: SpriteFastBlurOptions['scaleY'], givenParameter: SpriteFastBlurOptions) => {
        return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
      },
      // alpha
      alpha: 1,
      compositeOperation: "source-over",
    });
  }

  _generateTempCanvas(additionalModifier: AdditionalModifier) {
    const w = additionalModifier.widthInPixel;
    const h = additionalModifier.heightInPixel;
    const p = this.p;
    this._temp_canvas = document.createElement("canvas");
    if (p.gridSize) {
      this._currentGridSize = p.gridSize;
      this._temp_canvas.width = Math.round(this._currentGridSize);
      this._temp_canvas.height = Math.round(this._currentGridSize);
    } else {
      this._temp_canvas.width = Math.ceil(w / p.scaleX!);
      this._temp_canvas.height = Math.ceil(h / p.scaleY!);
    }
    this._tctx = this._temp_canvas.getContext("2d")!;
    this._tctx.globalCompositeOperation = "source-over";
    this._tctx.globalAlpha = 1;
  }

  normalizeFullScreen(additionalModifier: AdditionalModifier) {
    const p = this.p
    if (p.norm || p.x === undefined) {
      p.x = additionalModifier.visibleScreen.x;
    }
    if (p.norm || p.y === undefined) {
      p.y = additionalModifier.visibleScreen.y;
    }
    if (p.norm || p.width === undefined) {
      p.width = additionalModifier.visibleScreen.width;
    }
    if (p.norm || p.height === undefined) {
      p.height = additionalModifier.visibleScreen.height;
    }
  }

  resize(output: OutputInfo | undefined, additionalModifier: AdditionalModifier) {
    if (this._temp_canvas && this._currentGridSize !== this.p.gridSize) {
      const oldTempCanvas = this._temp_canvas;
      this._generateTempCanvas(additionalModifier);
      this._tctx!.globalCompositeOperation = "copy";
      this._tctx!.drawImage(
        oldTempCanvas,
        0,
        0,
        oldTempCanvas.width,
        oldTempCanvas.height,
        0,
        0,
        this._temp_canvas.width,
        this._temp_canvas.height
      );
      this._tctx!.globalCompositeOperation = "source-over";
    }
    this.normalizeFullScreen(additionalModifier);
  }

  detect(context: CanvasRenderingContext2D, x: number, y: number) {
    return this._detectHelper(this.p, context, x, y, false);
  }

  init(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) {
    this._generateTempCanvas(additionalModifier);
    this.normalizeFullScreen(additionalModifier);
  }

  // draw-methode
  draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) {
    const p = this.p
    if (p.enabled && p.alpha > 0) {
      if (p.gridSize && this._currentGridSize !== p.gridSize) {
        this.resize(undefined, additionalModifier);
      }

      const a = p.alpha * additionalModifier.alpha,
        w = p.width!,
        h = p.height!,
        targetW = this._temp_canvas!.width,
        targetH = this._temp_canvas!.height;

      if (a > 0 && targetW && targetH) {
        this._tctx!.globalCompositeOperation = "copy";
        this._tctx!.globalAlpha = 1;
        this._tctx!.drawImage(
          context.canvas,
          0,
          0,
          context.canvas.width,
          context.canvas.height,
          0,
          0,
          targetW,
          targetH
        );

        if (p.darker > 0) {
          this._tctx!.globalCompositeOperation = p.clear
            ? "source-atop"
            : "source-over"; // "source-atop"; source-atop works with transparent background but source-over is much faster
          this._tctx!.fillStyle = "rgba(0,0,0," + p.darker + ")";
          this._tctx!.fillRect(0, 0, targetW, targetH);
        }

        // @ts-ignore
        this.additionalBlur?.(targetW, targetH, additionalModifier);

        // optional: clear screen
        if (p.clear) {
          context.globalCompositeOperation = "source-over";
          context.globalAlpha = 1;
          context.clearRect(p.x!, p.y!, w, h);
        }
        context.globalCompositeOperation = p.compositeOperation;
        context.globalAlpha = a;
        const oldValue = context.imageSmoothingEnabled;
        context.imageSmoothingEnabled = !p.pixel;
        context.drawImage(
          this._temp_canvas!,
          0,
          0,
          targetW,
          targetH,
          p.x!,
          p.y!,
          w,
          h
        );
        context.imageSmoothingEnabled = oldValue;
      }
    } else {
      // optional: clear screen
      if (p.clear) {
        if (!p.x) {
          p.x = additionalModifier.x;
        }
        if (!p.y) {
          p.y = additionalModifier.y;
        }
        if (!p.width) {
          p.width = additionalModifier.width;
        }
        if (!p.height) {
          p.height = additionalModifier.height;
        }
        context.clearRect(p.x, p.y, p.width, p.height);
      }
    }
  }
}
