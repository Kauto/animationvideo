import { OutputInfo } from "../Engine";
import calc from "../func/calc";
import ifNull from "../func/ifnull";
import { OrFunction } from "../helper";
import { AdditionalModifier } from "../Scene";
import Group, { SpriteGroupOptions, SpriteGroupOptionsInternal } from "./Group";

export interface SpriteCanvasOptions extends SpriteGroupOptions {
  width?: OrFunction<number>;
  height?: OrFunction<number>;
  canvasWidth?: OrFunction<number>;
  canvasHeight?: OrFunction<number>;
  compositeOperation?: OrFunction<GlobalCompositeOperation>;
  gridSize?: OrFunction<number>;
  norm?: OrFunction<boolean>;
  isDrawFrame?: OrFunction<
    number,
    [undefined | CanvasRenderingContext2D, undefined | AdditionalModifier]
  >;
}

export interface SpriteCanvasOptionsInternal
  extends SpriteGroupOptionsInternal {
  width: number | undefined;
  height: number | undefined;
  canvasWidth: number | undefined;
  canvasHeight: number | undefined;
  compositeOperation: GlobalCompositeOperation;
  gridSize: number | undefined;
  norm: boolean;
  isDrawFrame: OrFunction<
    number,
    [undefined | CanvasRenderingContext2D, undefined | AdditionalModifier]
  >;
}

export default class Canvas extends Group<
  SpriteCanvasOptions,
  SpriteCanvasOptionsInternal
> {
  _currentGridSize: number | undefined;
  _drawFrame: number = 2;
  _temp_canvas: undefined | HTMLCanvasElement;
  _tctx: undefined | CanvasRenderingContext2D;

  constructor(givenParameter: SpriteCanvasOptions) {
    super(givenParameter);
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // x,y,width,height without default to enable norm
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      canvasWidth: undefined,
      canvasHeight: undefined,
      gridSize: undefined,
      compositeOperation: "source-over",
      norm: (
        value: SpriteCanvasOptions["norm"],
        givenParameter: SpriteCanvasOptions,
      ) =>
        ifNull(
          calc(value),
          calc(givenParameter.x) === undefined &&
            calc(givenParameter.y) === undefined &&
            calc(givenParameter.width) === undefined &&
            calc(givenParameter.height) === undefined,
        ),
      isDrawFrame: (
        value: SpriteCanvasOptions["isDrawFrame"],
        _givenParameter: SpriteCanvasOptions,
      ) => ifNull(value, 1),
    });
  }

  _generateTempCanvas(additionalModifier: AdditionalModifier) {
    const w = additionalModifier.widthInPixel;
    const h = additionalModifier.heightInPixel;
    const p = this.p;
    this._temp_canvas = document.createElement("canvas");
    if (p.canvasWidth && p.canvasHeight) {
      this._temp_canvas.width = p.canvasWidth;
      this._temp_canvas.height = p.canvasHeight;
    } else if (p.gridSize) {
      this._currentGridSize = p.gridSize;
      this._temp_canvas.width = Math.round(this._currentGridSize);
      this._temp_canvas.height = Math.round(this._currentGridSize);
    } else {
      this._temp_canvas.width = Math.round(w / p.scaleX);
      this._temp_canvas.height = Math.round(h / p.scaleY);
    }
    this._tctx = this._temp_canvas.getContext("2d")!;
  }

  _normalizeFullScreen(additionalModifier: AdditionalModifier) {
    const p = this.p;
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

  _copyCanvas(additionalModifier: AdditionalModifier) {
    const p = this.p;
    if (
      this._temp_canvas &&
      this._currentGridSize !== p.gridSize &&
      !p.canvasWidth
    ) {
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
        this._temp_canvas.height,
      );
      this._tctx!.globalCompositeOperation = "source-over";
      this._drawFrame = 2;
    }
    this._normalizeFullScreen(additionalModifier);
  }

  resize(output: OutputInfo, additionalModifier: AdditionalModifier) {
    this._copyCanvas(additionalModifier);
    super.resize(output!, additionalModifier);
  }

  detect(context: CanvasRenderingContext2D, x: number, y: number) {
    return this._detectHelper(this.p, context, x, y, false);
  }

  init(
    _context: CanvasRenderingContext2D,
    additionalModifier: AdditionalModifier,
  ) {
    this._generateTempCanvas(additionalModifier);
    this._normalizeFullScreen(additionalModifier);
  }

  // draw-methode
  draw(
    context: CanvasRenderingContext2D,
    additionalModifier: AdditionalModifier,
  ) {
    const p = this.p;
    if (p.enabled) {
      if (p.gridSize && this._currentGridSize !== p.gridSize) {
        this._copyCanvas(additionalModifier);
      }
      this._drawFrame = Math.max(
        this._drawFrame - 1,
        calc(p.isDrawFrame, context, additionalModifier),
      );
      const w = p.width!,
        h = p.height!,
        wh = w / 2,
        hh = h / 2,
        tw = this._temp_canvas!.width,
        th = this._temp_canvas!.height;

      if (this._drawFrame) {
        this._tctx!.textBaseline = "middle";
        this._tctx!.textAlign = "center";
        this._tctx!.globalAlpha = 1;
        this._tctx!.globalCompositeOperation = "source-over";
        this._tctx!.save();
        // draw all sprites
        const cam = additionalModifier.cam;
        if (p.norm && cam) {
          const scale = Math.max(tw, th) / 2;
          this._tctx!.translate(tw / 2, th / 2);
          this._tctx!.scale(scale, scale);
          this._tctx!.scale(cam.zoom, cam.zoom);
          this._tctx!.translate(-cam.x, -cam.y);
        }
        for (const sprite of p.sprite) {
          sprite.draw(
            this._tctx!,
            p.norm
              ? Object.assign({}, additionalModifier, {
                  alpha: 1,
                  widthInPixel: tw,
                  heightInPixel: th,
                })
              : {
                  alpha: 1,
                  x: 0,
                  y: 0,
                  width: tw,
                  height: th,
                  widthInPixel: tw,
                  heightInPixel: th,
                  scaleCanvas: 1,
                  visibleScreen: {
                    x: 0,
                    y: 0,
                    width: tw,
                    height: th,
                  },
                  fullScreen: {
                    x: 0,
                    y: 0,
                    width: tw,
                    height: th,
                  },
                },
          );
        }
        this._tctx!.restore();
      }

      context.save();
      context.globalCompositeOperation = p.compositeOperation;
      context.globalAlpha = p.alpha * additionalModifier.alpha;
      context.translate(p.x! + wh, p.y! + hh);
      context.scale(p.scaleX, p.scaleY);
      context.rotate(p.rotation);
      context.drawImage(this._temp_canvas!, 0, 0, tw, th, -wh, -hh, w, h);
      context.restore();
    }
  }
}
