import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
export declare type TAnimationCallbackCallback = (sprite: ISprite, time: number, firstRun: boolean) => ReturnType<IAnimation['run']>;
export default class Callback implements IAnimation {
    _callback: TAnimationCallbackCallback;
    _duration: number | undefined;
    _initialized: boolean;
    constructor(callback: TAnimationCallbackCallback, duration?: number);
    reset(): void;
    run(sprite: ISprite, time: number): number | boolean | import("./Sequence").SequenceRunCommand;
}
