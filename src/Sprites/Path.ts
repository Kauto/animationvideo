import Group, { SpriteGroupOptions, SpriteGroupOptionsInternal } from "./Group";
// @ts-ignore
import pasition from "pasition";
import { OrFunction } from "../helper";
import { AdditionalModifier } from "../Scene";


export interface SpritePathOptions extends SpriteGroupOptions {
  path?: OrFunction<number[][][]|string|Path2D>
  color?: OrFunction<string|undefined>
  borderColor?: OrFunction<string|undefined>
  compositeOperation?: OrFunction<GlobalCompositeOperation>
  lineWidth?: OrFunction<number>
  clip?: OrFunction<boolean>
  fixed?: OrFunction<boolean>
  polyfill?: OrFunction<boolean>
}

export interface SpritePathOptionsInternal extends SpriteGroupOptionsInternal {
  path:  number[][][]|string|Path2D
  color: string|undefined
  borderColor: string|undefined
  compositeOperation: GlobalCompositeOperation
  lineWidth: number
  clip: boolean
  fixed: boolean
  polyfill: boolean
}

export default class Path extends Group<SpritePathOptions,SpritePathOptionsInternal> {
  _oldPath:number[][][]|string|Path2D|undefined;
  _path2D:Path2D = new Path2D();
  
  constructor(givenParameters:SpritePathOptions) {
    super(givenParameters);

    if (this.p.polyfill) {
      if (typeof Path2D !== "function") {
        let head = document.getElementsByTagName("head")[0];
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
          "https://cdn.jsdelivr.net/npm/canvas-5-polyfill@0.1.5/canvas.min.js";
        head.appendChild(script);
      } else {
        // create a new context
        let ctx = document.createElement("canvas").getContext("2d")!;
        // stroke a simple path
        ctx.stroke(new Path2D("M0,0H1"));
        // check it did paint something
        if (ctx.getImageData(0, 0, 1, 1).data[3]) {
          this.p.polyfill = false;
        }
      }
    }
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      // set path
      path: undefined,
      color: undefined,
      borderColor: undefined,
      lineWidth: 1,
      clip: false,
      fixed: false,
      polyfill: true
    });
  }

  // helper function for changeTo
  changeToPathInit(from: number[][][] | string, to: number[][][] | string): number[][][] {
    return pasition._preprocessing(
      typeof from === "string" ? pasition.path2shapes(from) : Array.isArray(from) ? from : [],
      typeof to === "string" ? pasition.path2shapes(to) : Array.isArray(to) ? to : []
    );
  }
  
  changeToPath(progress: number, data: {
    pathFrom: number[][][]
    pathTo: number[][][]
  }) {
    return pasition._lerp(data.pathFrom, data.pathTo, progress);
  }

  detect(context:CanvasRenderingContext2D, x:number, y:number) {
    return this._detectHelper(this.p, context, x, y, false, () => {
      return context.isPointInPath(this._path2D, x, y);
    });
  }

  // draw-methode
  draw(context:CanvasRenderingContext2D, additionalModifier:AdditionalModifier) {
    const p = this.p
    if (p.enabled) {
      const a = p.alpha * additionalModifier.alpha;
      if (this._oldPath !== p.path) {
        if (p.polyfill && typeof p.path === "string") {
          p.path = pasition.path2shapes(p.path);
        }
        if (Array.isArray(p.path)) {
          this._path2D = new Path2D();
          p.path.forEach(curve => {
            this._path2D.moveTo(curve[0][0], curve[0][1]);
            curve.forEach(points => {
              this._path2D.bezierCurveTo(
                points[2],
                points[3],
                points[4],
                points[5],
                points[6],
                points[7]
              );
            });
            this._path2D.closePath();
          });
        } else if (p.path instanceof Path2D) {
          this._path2D = p.path;
        } else {
          this._path2D = new Path2D(p.path);
        }
        this._oldPath = p.path;
      }

      let scaleX = p.scaleX,
        scaleY = p.scaleY;

      if (p.fixed) {
        if (scaleX == 0) {
          scaleX = Number.EPSILON;
        }
        if (scaleY == 0) {
          scaleY = Number.EPSILON;
        }
      }

      context.globalCompositeOperation = p.compositeOperation;
      context.globalAlpha = a;
      context.save();
      context.translate(p.x!, p.y!);
      context.scale(scaleX, scaleY);
      context.rotate(p.rotation);

      if (p.color) {
        context.fillStyle = p.color;
        context.fill(this._path2D);
      }

      context.save();

      if (p.clip) {
        context.clip(this._path2D);
        if (p.fixed) {
          context.rotate(-p.rotation);
          context.scale(1 / scaleX, 1 / scaleY);
          context.translate(-p.x!, -p.y!);
        }
      }

      // draw all sprites
      for (const sprite of p.sprite) {
        sprite.draw(context, additionalModifier);
      }

      context.restore();

      if (p.borderColor) {
        context.strokeStyle = p.borderColor;
        context.lineWidth = p.lineWidth;
        context.stroke(this._path2D);
      }

      context.restore();
    }
  }
}
