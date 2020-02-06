import Circle from "./Circle.mjs";

export default class Callback extends Circle {
  constructor(givenParameter) {
    if (typeof givenParameter === "function") {
      givenParameter = { callback: givenParameter };
    }
    super(givenParameter);

    // set start value to count
    this._timePassed = 0;
    this._deltaTime = 0;
  }

  _getParameterList() {
    return Object.assign({}, this._getBaseParameterList(), {
      callback: v => (typeof v === undefined ? () => {} : v)
    });
  }

  animate(timePassed) {
    if (this.enabled) {
      this._timePassed += timePassed;
      this._deltaTime += timePassed;
    }
    return super.animate(timePassed);
  }

  detect(context, color) {}

  draw(context, additionalParameter) {
    if (this.enabled) {
      this.callback(context, this._timePassed, additionalParameter, this);
    }
    this._deltaTime = 0;
  }
}
