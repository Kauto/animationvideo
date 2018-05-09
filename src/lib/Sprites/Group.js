import ifNull from '../../func/ifnull';
import Circle from './Circle';

const degToRad = 0.017453292519943295; //Math.PI / 180;

export default class Group extends Circle {
  constructor(params) {
    super(params);
    // Sprite
    this.sprite = ifNull(params.sprite, []);
  }

  // overwrite changeAnimationStatus
  changeAnimationStatus(ani) {
    // call super
    super.changeAnimationStatus(ani);
    // changeAnimationStatus for all sprites
    for (let i in this.sprite) {
      this.sprite[i].changeAnimationStatus(ani);
    }
  }

  // overwrite change
  animate(timepassed) {
    // call super
    let finished = super.animate(timepassed),
      spriteFinished = true;
    // animate all sprites
    if (this.enabled) {
      for (let i in this.sprite) {
        spriteFinished = this.sprite[i].animate(timepassed) && spriteFinished;
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
      if (!additionalModifier) {
        if (this.a < 1) {
          additionalModifier = {
            a:this.a
          };
        }
      } else {
        additionalModifier = Object.assign({}. additionalModifier);
        additionalModifier.a *= this.a;
      }

      context.save();
      context.translate(this.x, this.y);
      context.scale(this.scaleX, this.scaleY);
      context.rotate(this.arc * degToRad);
      // draw all sprites
      for (let i in this.sprite) {
        this.sprite[i].draw(context, additionalModifier);
      }
      context.restore();
    }
  }
}
