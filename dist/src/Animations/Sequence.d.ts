import type { ISprite } from "../Sprites/Sprite";
import type { IAnimation } from "./Animation";
export declare enum SequenceRunCommand {
    FORCE_DISABLE = "F",
    STOP = "S",
    REMOVE = "R"
}
export declare type TWaitTime = number;
export declare type TLabel = string;
export declare type TAnimationFunction = IAnimation['run'];
export declare type TAnimationSequence = (TWaitTime | TLabel | TAnimationFunction | IAnimation)[];
export declare type AnimationSequenceOptions = TAnimationSequence | TAnimationSequence[];
interface ISequence {
    position: number;
    timelapsed: number;
    sequence: IAnimation[];
    label: Record<string, number>;
    enabled: boolean;
}
declare class Sequence implements IAnimation {
    sequences: ISequence[];
    lastTimestamp: number;
    enabled: boolean;
    constructor(...sequences: AnimationSequenceOptions);
    reset(timelapsed?: number): void;
    play(label?: string, timelapsed?: number): boolean;
    _runSequence(sprite: ISprite, sequencePosition: ISequence, timePassed: number): number | true;
    run(sprite: ISprite, time: number, is_difference?: boolean): number | true;
}
export default Sequence;
