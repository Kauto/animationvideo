import ifNull from "../func/ifNull.mjs";
import calc from "../func/calc.mjs";
import Sequence from "../Animations/Sequence.mjs";

const degToRad = 0.017453292519943295; //Math.PI / 180;

// Sprite
// Draw a Circle
export default class Circle {
  constructor(givenParameter) {
    this._parseParameterList(this, this._getParameterList(), givenParameter);
    this._needInit = true;
  }

  _parseParameterList(obj, parameterList, givenParameter) {
    Object.keys(parameterList).forEach(name => {
      const d = parameterList[name];
      obj[name] =
        typeof d === "function"
          ? d(givenParameter[name], givenParameter, obj)
          : ifNull(calc(givenParameter[name]), d);
    });
  }

  _getBaseParameterList() {
    return {
      // animation
      animation: (value, givenParameter) => {
        let result = calc(value);
        return Array.isArray(result) ? new Sequence(result) : result;
      },
      // if it's rendering or not
      enabled: true,
      // if you can click it or not
      isClickable: false,
      // tags to mark the sprites
      tag: value => {
        return Array.isArray(value) ? value : value ? [value] : [];
      }
    };
  }

  _getParameterList() {
    return Object.assign({}, this._getBaseParameterList(), {
      // position
      x: 0,
      y: 0,
      // rotation
      rotation: (value, givenParameter) => {
        return ifNull(
          calc(value),
          ifNull(
            calc(givenParameter.rotationInRadian),
            ifNull(calc(givenParameter.rotationInDegree), 0) * degToRad
          )
        );
      },
      // scalling
      scaleX: (value, givenParameter) => {
        return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
      },
      scaleY: (value, givenParameter) => {
        return ifNull(calc(value), ifNull(calc(givenParameter.scale), 1));
      },
      // alpha
      alpha: 1,
      // blending
      compositeOperation: "source-over",
      // color
      color: "#fff"
    });
  }

  getElementsByTag(tag) {
    if (typeof tag === "function") {
      if (this.tag.filter(tag).length) {
        return [this];
      }
    } else {
      const aTag = Array.isArray(tag) ? tag : [tag];
      if (aTag.filter(tag => this.tag.includes(tag)).length) {
        return [this];
      }
    }
    return [];
  }

  // Animation-Funktion
  animate(timepassed) {
    if (this.animation) {
      // run animation
      if (this.animation.run(this, timepassed, true) === true) {
        // disable
        this.enabled = false;
        return true;
      }
    }

    return false;
  }

  play(label = "", timelapsed = 0) {
    if (this.animation) {
      this.animation.play && this.animation.play(label, timelapsed);
    }
  }

  init(context, additionalModifier) {}

  callInit(context, additionalModifier) {
    if (this._needInit) {
      this.init(context, additionalModifier);
      this._needInit = false;
    }
  }

  resize(output, additionalModifier) {}

  _detectHelper(context, x, y, moveToCenter, callback) {
    let a = false;
    if (this.enabled && this.isClickable) {
      const hw = this.width / 2;
      const hh = this.height / 2;
      context.save();
      if (moveToCenter) {
        context.translate(this.x + hw, this.y + hh);
      } else {
        context.translate(this.x, this.y);
      }
      context.scale(this.scaleX, this.scaleY);
      context.rotate(this.rotation);
      context.beginPath();
      if (callback) {
        a = callback(hw, hh);
      } else {
        context.rect(-hw, -hh, this.width, this.height);
        context.closePath();
        a = context.isPointInPath(x, y);
      }
      context.restore();
    }
    return a ? this : false;
  }

  detectDraw(context, color) {}

  detect(context, x, y) {
    return this._detectHelper(context, x, y, false, () => {
      context.arc(
        0,
        0,
        1,
        Math.PI / 2 + this.rotation,
        Math.PI * 2.5 - this.rotation,
        false
      );
      return context.isPointInPath(x, y);
    });
  }

  // Draw-Funktion
  draw(context, additionalModifier) {
    if (this.enabled) {
      context.globalCompositeOperation = this.compositeOperation;
      context.globalAlpha = this.alpha * additionalModifier.alpha;
      context.save();
      context.translate(this.x, this.y);
      context.scale(this.scaleX, this.scaleY);
      context.beginPath();
      context.fillStyle = this.color;
      context.arc(
        0,
        0,
        1,
        Math.PI / 2 + this.rotation,
        Math.PI * 2.5 - this.rotation,
        false
      );
      context.fill();
      context.restore();
    }
  }
}
