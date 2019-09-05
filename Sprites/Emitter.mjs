import ifNull from "../func/ifnull.mjs";
import calc from "../func/calc.mjs";
import Group from "./Group.mjs";

export default class Emitter extends Group {
  constructor(givenParameter) {
    super(givenParameter.self || {});

    let count = ifNull(calc(givenParameter.count), 1);
    this.sprite = [];
    const classToEmit = givenParameter.class;

    for (let i = 0; i < count; i++) {
      let parameter = {};
      for (let index in givenParameter) {
        if (!["self", "class", "count"].includes(index)) {
          if (typeof givenParameter[index] === "function") {
            parameter[index] = givenParameter[index].call(givenParameter, i);
          } else {
            parameter[index] = givenParameter[index];
          }
        }
      } 
      this.sprite[i] = new classToEmit(parameter);
    }
  }
}
