import Sequence from '../Sequence.mjs';

export default class End {

	constructor() {
	}

	run(sprite, time){
		return Sequence.TIMELAPSE_TO_FORCE_DISABLE;
	}
}