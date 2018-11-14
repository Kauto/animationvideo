import ifNull from '../../func/ifnull';
import calc from '../../func/calc';
import Group from './Group';

const degToRad = 0.017453292519943295; //Math.PI / 180;

export default class Path extends Group {
  constructor(params) {
    super(params);

    this.oldPath = undefined;
    this.path = calc(params.path);
    this.path2D = new Path2D();

    this.color = calc(params.color);
    this.borderColor = calc(params.borderColor);
    this.lineWidth = ifNull(calc(params.lineWidth), 1);
    this.clip = ifNull(calc(params.clip), false);
    this.fixed = ifNull(calc(params.fixed), false);
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      let a = this.a;
      if (this.oldPath !== this.path) {
        if (Array.isArray(this.path)) {
          this.path2D = new Path2D();
          this.path.forEach((curve) => {
            this.path2D.moveTo(curve[0][0], curve[0][1]);
            curve.forEach((points) => {
              this.path2D.bezierCurveTo(points[2], points[3], points[4], points[5], points[6], points[7]);
            });
            this.path2D.closePath();
          });
        } else {
          this.path2D = new Path2D(this.path);
        }
        this.oldPath = this.path;
      }
      if (additionalModifier) {
        a *= additionalModifier.a;
      }

      let scaleX = this.scaleX,
        scaleY = this.scaleY;

      if (this.fixed) {
        if (scaleX == 0) {
          scaleX = 0.0000000001;
        }
        if (scaleY == 0) {
          scaleY = 0.0000000001;
        }
      }

      context.globalCompositeOperation = this.alphaMode;
      context.globalAlpha = a;
      context.save();
      context.translate(this.x, this.y);
      context.scale(scaleX, scaleY);
      context.rotate(this.arc * degToRad);

      if (this.color) {
        context.fillStyle = this.color;
        context.fill(this.path2D);
      }

      context.save();

      if (this.clip) {
        context.clip(this.path2D);
        if (this.fixed) {
          context.rotate(-this.arc * degToRad);
          context.scale(1/scaleX, 1/scaleY);
          context.translate(-this.x, -this.y);
        }
      }

      // draw all sprites
      for (let i in this.sprite) {
        this.sprite[i].draw(context, additionalModifier);
      }

      context.restore();

      if (this.borderColor) {
        context.strokeStyle = this.borderColor;
        context.lineWidth = this.lineWidth;
        context.stroke(this.path2D);
      }
      
      context.restore();
    }
  };
}
