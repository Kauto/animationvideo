import Sequenz from '../Sequence.mjs';

export default class End {

	constructor() {
	}

	run(sprite, time){
		return Sequenz.TIMELAPSE_TO_FORCE_DISABLE;
	}
}