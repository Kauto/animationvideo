import Sequenz from '../Sequence';

export default class End {

	constructor() {
	}

	run(sprite, time){
		return Sequenz.TIMELAPSE_TO_FORCE_DISABLE;
	}
}