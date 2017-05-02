import calc from '../../func/calc';
import Emitter from './Emitter';
import Text from './Text';
import _assign from 'lodash/assign';
import _isArray from 'lodash/isArray';

export default class Scroller extends Emitter {
  constructor(params) {
    let text = calc(params.text),
      characterList = _isArray(text) ? text : [...text];
    super(_assign({}, params, {
      class: Text,
      count: characterList.length,
      text: (index) => characterList[index],
      enabled: (index) => characterList[index] !== " " && calc(params.enabled, index)
    }));
  }
}