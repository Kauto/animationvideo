import Circle from "./Circle.mjs";

export default class Group extends Circle {
  constructor(givenParameter) {
    super(givenParameter);
  }

  _getParameterList() {
    return Object.assign({}, super._getParameterList(), {
      sprite: []
    });
  }

  getElementsByTag(tag) {
    let result = super.getElementsByTag(tag);
    for (const sprite of this.sprite) {
      const ans = sprite.getElementsByTag(tag);
      if (ans) {
        result = result.concat(ans);
      }
    }
    return result;
  }

  // overwrite change
  animate(timepassed) {
    // call super
    let finished = super.animate(timepassed),
      spriteFinished = false;
    // animate all sprites
    if (this.enabled) {
      for (const sprite of this.sprite) {
        spriteFinished = spriteFinished || sprite.animate(timepassed) === true;
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

  play(label = "", timelapsed = 0) {
    if (this.animation) {
      this.animation.play && this.animation.play(label, timelapsed);
    }
    for (const sprite of this.sprite) {
      sprite.play && sprite.play(label, timelapsed);
    }
  }

  resize(output, additionalModifier) {
    for (const sprite of this.sprite) {
      sprite.resize(output, additionalModifier);
    }
  }

  callInit(context, additionalModifier) {
    super.callInit(context, additionalModifier);
    for (let sprite of this.sprite) {
      sprite.callInit(context, additionalModifier);
    }
  }

  detectImage(context, color) {
    if (this.enabled) {
      for (const sprite of this.sprite) {
        sprite.detectImage(context, color);
      }
    }
  }

  detect(context, x, y) {
    if (this.enabled) {
      for (const sprite of this.sprite) {
        const a = sprite.detect(context, x, y);
        if (a) return a;
      }
    }
    return false;
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
      for (const sprite of this.sprite) {
        sprite.draw(context, additionalModifier);
      }
      context.restore();
    }
  }
}
