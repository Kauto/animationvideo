import Circle from './Circle.mjs';

export default class Group extends Circle {
  constructor(givenParameter) {
    super(givenParameter);
  }

  getParameterList() {
    return Object.assign({}, super.getParameterList(), {
      sprite: []
    });
  }

  // overwrite change
  animate(timepassed) {
    // call super
    let finished = super.animate(timepassed),
      spriteFinished = false;
    // animate all sprites
    if (this.enabled) {
      for (let i in this.sprite) {
        spriteFinished = spriteFinished || this.sprite[i].animate(timepassed) === true;
      }
    }

    if (this.animation) {
      return finished;
    } else {
      if (spriteFinished) {
        this.enabled = false;
      }
      return spriteFinished;
    }
  }

  // draw-methode
  draw(context, additionalModifier) {
    if (this.enabled) {
      if (this.alpha < 1) {
        additionalModifier = Object.assign({}, additionalModifier);
        additionalModifier.alpha *= this.alpha;
      }

      context.save();
      context.translate(this.x, this.y);
      context.scale(this.scaleX, this.scaleY);
      context.rotate(this.rotation);
      // draw all sprites
      for (let i in this.sprite) {
        this.sprite[i].draw(context, additionalModifier);
      }
      context.restore();
    }
  }
}
