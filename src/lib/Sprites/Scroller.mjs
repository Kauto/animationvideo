import calc from '../../func/calc.mjs';
import Emitter from './Emitter.mjs';
import Text from './Text.mjs';

export default class Scroller extends Emitter {
  constructor(params) {
    let text = calc(params.text),
      characterList = Array.isArray(text) ? text : [...text];
    super(Object.assign({}, params, {
      class: Text,
      count: characterList.length,
      text: (index) => characterList[index],
      enabled: (index) => characterList[index] !== " " && calc(params.enabled, index)
    }));
  }
}