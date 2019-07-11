import Circle from "./Circle.mjs";

export default class Callback extends Circle {
  constructor(params) {
    if (typeof params === "function") {
      params = { callback: params };
    }
    super(params);
    // Callback
    this.callback = params.callback;
    this.timepassed = 0;
  }

  animate(timepassed) {
    this.timepassed += timepassed;
    return super.animate(timepassed);
  }

  draw(context, additionalParameter) {
    if (this.enabled) {
      this.callback(context, this.timepassed, additionalParameter, this);
    }
    this.timepassed = 0;
  }
}
