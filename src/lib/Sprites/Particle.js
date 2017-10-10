import Circle from './Circle';
import Color from 'color';

const gradientSize = 64;
const gradientResolution = 4;
const gradientSizeHalf = gradientSize >> 1;

class Particle extends Circle {


  constructor(params) {
    super(params)
  }

  static getGradientImage(r, g, b) {
    let rIndex, gIndex, cr = r >> gradientResolution, cg = g >> gradientResolution, cb = b >> gradientResolution;

    if (!Particle.Gradient) {
      Particle.Gradient = new Array(256 >> gradientResolution);
      for (rIndex = 0; rIndex < Particle.Gradient.length; rIndex++) {
        Particle.Gradient[rIndex] = new Array(256 >> gradientResolution);
        for (gIndex = 0; gIndex < Particle.Gradient[rIndex].length; gIndex++) {
          Particle.Gradient[rIndex][gIndex] = new Array(256 >> gradientResolution);
        }

      }
    }
    if (!Particle.Gradient[cr][cg][cb]) {
      Particle.Gradient[cr][cg][cb] = Particle.generateGradientImage(cr, cg, cb);
    }
    return Particle.Gradient[cr][cg][cb];
  }

  static generateGradientImage(cr, cg, cb) {
    let canvas = document.createElement('canvas');
    canvas.width = canvas.height = gradientSize;

    let txtc = canvas.getContext('2d');
    txtc.globalAlpha = 1;
    txtc.globalCompositeOperation = "source-over";
    txtc.clearRect(0, 0, gradientSize, gradientSize);

    let grad = txtc.createRadialGradient(gradientSizeHalf, gradientSizeHalf, 0, gradientSizeHalf, gradientSizeHalf, gradientSizeHalf);
    grad.addColorStop(0, "rgba(" + ((cr << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cg << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cb << gradientResolution) + (1 << gradientResolution) - 1) + ",1)");
    grad.addColorStop(0.3, "rgba(" + ((cr << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cg << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cb << gradientResolution) + (1 << gradientResolution) - 1) + ",0.4)");
    grad.addColorStop(1, "rgba(" + ((cr << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cg << gradientResolution) + (1 << gradientResolution) - 1) + "," + ((cb << gradientResolution) + (1 << gradientResolution) - 1) + ",0)");

    txtc.fillStyle = grad;
    txtc.fillRect(0, 0, gradientSize, gradientSize);

    return canvas;
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      // faster as: if (!(this.color instanceof Color && this.color.model === 'rgb')) {
      if (!this.color || !this.color.color) {
        this.color = Color(this.color).rgb();
      }
      let a = this.a,
        color = this.color.color;
      if (additionalModifier) {
        a *= additionalModifier.a;
      }
      context.globalCompositeOperation = this.alphaMode;
      context.globalAlpha = a;
      context.imageSmoothingEnabled = this.scaleX > gradientSize;
      context.drawImage(Particle.getGradientImage(color[0], color[1], color[2]), 0, 0, gradientSize, gradientSize, this.x - (this.scaleX >> 1), this.y - (this.scaleY >> 1), this.scaleX, this.scaleY);
      context.imageSmoothingEnabled = true;
    }
  }
}

Particle.Gradient = null;

export default Particle;
