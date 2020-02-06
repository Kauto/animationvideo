import Sequence from './Sequence.mjs';

export default class EndDisabled {

    constructor() {
    }

    run(sprite, time) {
        sprite.enabled = false;
        return Sequence._TIMELAPSE_TO_FORCE_DISABLE;
    };
}