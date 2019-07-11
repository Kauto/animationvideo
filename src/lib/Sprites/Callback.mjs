import Circle from "./Circle.mjs";

export default class Callback extends Circle {
  constructor(params) {
    super(params);
    // Callback
    this.callback = params.callback;
    this.timepassed = 0;
  }

  animate(timepassed) {
    this.timepassed += timepassed;
    super.animate(timepassed);
  }

  draw(context, additionalParameter) {
    if (this.enabled) {
      this.callback(context, this.timepassed, additionalParameter, this);
    }
    this.timepassed = 0;
  }
}
