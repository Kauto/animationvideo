import calc from '../func/calc.mjs';

export default class Wait {

    constructor(duration) {
        this.duration = calc(duration);
    }

    run(sprite, time) {
        // return time left
        return this.duration ? time - this.duration : -1;
    };
}