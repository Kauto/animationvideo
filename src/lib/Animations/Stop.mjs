import Animation from '../Sequence.mjs';

export default class End {

	constructor() {
	}

	run(sprite, time){
		return Animation.TIMELAPSE_TO_STOP;
	}
}