import ifNull from "../func/ifnull.mjs";
import calc from "../func/calc.mjs";
import Group from "./Group.mjs";

export default class Emitter extends Group {
  constructor(givenParameter) {
    super(givenParameter.self || {});
    let staticArray = {},
      functionArray = {};

    for (let i in givenParameter) {
      if (!["self", "class", "count"].includes(i)) {
        if (typeof givenParameter[i] === "function") {
          functionArray[i] = givenParameter[i];
        } else {
          staticArray[i] = givenParameter[i];
        }
      }
    }

    let count = ifNull(calc(givenParameter.count), 1);
    this.sprite = [];

    for (let i = 0; i < count; i++) {
      const classToEmit = givenParameter.class;
      let parameter = {};
      for (let index in staticArray) {
        parameter[index] = staticArray[index];
      }
      for (let index in functionArray) {
        parameter[index] = functionArray[index].call(null, i);
      }
      this.sprite[i] = new classToEmit(parameter);
    }
  }
}
