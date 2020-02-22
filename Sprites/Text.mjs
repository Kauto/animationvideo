import Circle from './Circle.mjs';

class Text extends Circle {
  constructor(givenParameters) {
    super(givenParameters);
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      text: undefined,
      font: '2em monospace',
      position: Text.CENTER,
      color: undefined,
      borderColor: undefined,
      lineWidth: 1
    });
  }

  detectDraw(context, color) {
    if (this.enabled && this.isClickable) {
      context.save();
      context.translate(this.x, this.y);
      context.scale(this.scaleX, this.scaleY);
      context.rotate(this.rotation);
      if (!this.position) {
        context.textAlign = 'left';
        context.textBaseline = 'top';
      }
      context.font = this.font;
      context.fillStyle = color;
      context.fillText(this.text, 0, 0);
      context.restore();
    }
  }

  detect(context, color) {
    return "c"
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;
      context.save();
      if (!this.position) {
        context.textAlign = 'left';
        context.textBaseline = 'top';
      }
      context.translate(this.x, this.y);
      context.scale(this.scaleX, this.scaleY);
      context.rotate(this.rotation);
      context.font = this.font;

      if (this.color) {
        context.fillStyle = this.color;
        context.fillText(this.text, 0, 0);
      }

      if (this.borderColor) {
        context.strokeStyle = this.borderColor;
        context.lineWidth = this.lineWidth;
        context.strokeText(this.text, 0, 0);
      }

      context.restore();
    }
  };
}

// const
Text.LEFT_TOP = 0;
Text.CENTER = 1;

export default Text;
