import Sequence from './Sequence.mjs';

export default class End {

	constructor() {
	}

	run(sprite, time){
		return Sequence._TIMELAPSE_TO_STOP;
	}
}