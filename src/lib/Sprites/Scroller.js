import calc from '../../func/calc';
import Emitter from './Emitter';
import Text from './Text';

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