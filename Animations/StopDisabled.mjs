import Sequence from './Sequence.mjs';

export default class EndDisabled {

    constructor() {
    }

    run(sprite, time) {
        sprite.enabled = false;
        return Sequence.TIMELAPSE_TO_STOP;
    };
}