import Circle from "./Circle.mjs";

export default class Callback extends Circle {
  constructor(givenParameter) {
    if (typeof givenParameter === "function") {
      givenParameter = { callback: givenParameter };
    }
    super(givenParameter);

    // set start value to count
    this.timePassed = 0;
    this.deltaTime = 0;
  }

  getParameterList() {
    return {
      ...super.getParameterList(),
      callback: v => (typeof v === undefined ? () => {} : v)
    };
  }

  animate(timePassed) {
    if (this.enabled) {
      this.timePassed += timePassed;
      this.deltaTime += timePassed;
    }
    return super.animate(timePassed);
  }

  draw(context, additionalParameter) {
    if (this.enabled) {
      this.callback(context, this.timePassed, additionalParameter, this);
    }
    this.deltaTime = 0;
  }
}
