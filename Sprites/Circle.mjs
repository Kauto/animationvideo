import ifNull from "../func/ifnull.mjs";
import calc from "../func/calc.mjs";
import Sequence from "../Animations/Sequence.mjs";

const degToRad = 0.017453292519943295; //Math.PI / 180;

// Sprite
// Draw a Circle
export default class Circle {
  constructor(givenParameter) {
    const parameterList = this.getParameterList();
    Object.keys(parameterList).forEach(name => {
      const d = parameterList[name];
      this[name] =
        typeof d === "function"
          ? d(givenParameter[name], givenParameter, this)
          : ifNull(calc(givenParameter[name]), d);
    });
  }

  getParameterList() {
    return {
      // position
      x: 0,
      y: 0,
      // rotation
      rotation: (value, givenParameter) => {
        return ifNull(
          value,
          ifNull(
            givenParameter.rotationInRadian,
            ifNull(givenParameter.rotationInDegree, 0) * degToRad
          )
        );
      },
      // scalling
      scaleX: 1.,
      scaleY: 1.,
      // alpha
      alpha: 1.,
      // blending
      compositeOperation: "source-over",
      // color
      color: "#fff",
      // animation
      animation: (value, givenParameter) => {
        let result = calc(value);
        return Array.isArray(result)
          ? new Sequence(result)
          : typeof result === "object"
          ? result
          : undefined;
      },
      // if it's rendering or not
      enabled: true
    };
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

  resize(output, additionalModifier) {}

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
      context.closePath();
      context.restore();
    }
  }
}
