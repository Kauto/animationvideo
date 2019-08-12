import Sequenz from './Sequence.mjs';

export default class EndDisabled {

    constructor() {
    }

    run(sprite, time) {
        sprite.enabled = false;
        return Sequenz.TIMELAPSE_TO_FORCE_DISABLE;
    };
}