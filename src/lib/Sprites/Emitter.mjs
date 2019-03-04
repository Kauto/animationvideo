import ifNull from '../../func/ifnull.mjs';
import calc from '../../func/calc.mjs';
import Group from './Group.mjs';

export default class Emitter extends Group {
    constructor(params) {
        super(params.self || {});
        let staticArray = {},
          functionArray = {};

        for(let i in params) {
            if (['self', 'class', 'count'].indexOf(i) === -1) {
                if (typeof(params[i]) === 'function') {
                  functionArray[i] = params[i];
                } else {
                  staticArray[i] = params[i];
                }
            }
        }

        // add the letters
        let count = ifNull(calc(params.count), 1);
        this.sprite = [];

        for(let i = 0; i < count; i++) {
            let classToEmit = params.class,
                parameter = {};
            for(let index in staticArray) {
              parameter[index] = staticArray[index];
            }
            for(let index in functionArray) {
              parameter[index] = functionArray[index].call(null, i);
            }
            this.sprite[i] = new classToEmit(parameter);
        }
    }
}