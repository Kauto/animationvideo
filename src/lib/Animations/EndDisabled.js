import Sequenz from '../Sequence';

export default class EndDisabled {

    constructor() {
    }

    run(sprite, time) {
        sprite.enabled = false;
        return Sequenz.TIMELAPSE_TO_FORCE_DISABLE;
    };
}