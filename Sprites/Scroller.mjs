import calc from "../func/calc.mjs";
import Emitter from "./Emitter.mjs";
import Text from "./Text.mjs";

export default class Scroller extends Emitter {
  constructor(givenParameters) {
    let text = calc(givenParameters.text);
    let characterList = Array.isArray(text) ? text : [...text];
    super(
      Object.assign({}, givenParameters, {
        class: Text,
        count: characterList.length,
        text: index => characterList[index],
        enabled: index =>
          characterList[index] !== " " && calc(givenParameters.enabled, index)
      })
    );
  }
}
