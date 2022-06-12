import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
import { SequenceRunCommand } from './Sequence';

export default class EndDisabled implements IAnimation {
	constructor() {
	}

	run(sprite: ISprite, time: number) {
		return SequenceRunCommand.FORCE_DISABLE;
	};
}