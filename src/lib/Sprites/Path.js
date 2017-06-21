import calc from '../../func/calc';
import Text from './Text';
import _isArray from 'lodash/isArray';
import pasition from 'pasition';

const degToRad = 0.017453292519943295; //Math.PI / 180;

export default class Path extends Text {
  constructor (params) {
    super(params);

    this.oldPath = undefined;
    this.path = calc(params.path);
    this.path2D = new Path2D();
  }

  // draw-methode
  draw (context, additionalModifier) {
    if (this.enabled) {
      let a = this.a;
      if (this.oldPath !== this.path) {
        if (_isArray(this.path)) {
          this.path2D = [];
          this.path.forEach((curve) => {
            let newPath2D = new Path2D();
            newPath2D.moveTo(curve[0][0], curve[0][1]);
            curve.forEach((points) => {
              newPath2D.bezierCurveTo(points[2], points[3], points[4], points[5], points[6], points[7]);
            });
            newPath2D.closePath();
            this.path2D.push(newPath2D);
          });
        } else {
          this.path2D = new Path2D(this.path);
        }
        this.oldPath = this.path;
      }
      if (additionalModifier) {
        a *= additionalModifier.a;
      }
      context.globalCompositeOperation = this.alphaMode;
      context.globalAlpha = a;
      context.save();
      context.translate(this.x, this.y);
      context.scale(this.scaleX, this.scaleY);
      context.rotate(this.arc * degToRad);

      if (this.color) {
        context.fillStyle = this.color;
        if (_isArray(this.path2D)) {
          this.path2D.forEach((path) => {
            context.fill(path);
          });
        } else {
          context.fill(this.path2D);
        }
      }

      if (this.borderColor) {
        context.strokeStyle = this.borderColor;
        context.lineWidth = this.lineWidth;
        if (_isArray(this.path2D)) {
          this.path2D.forEach((path) => {
            context.stroke(path);
          });
        } else {
          context.stroke(this.path2D);
        }
      }

      context.restore();
    }
  };

  static path2shapes = pasition.path2shapes;
}