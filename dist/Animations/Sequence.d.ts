import { ISprite } from '../Sprites/Sprite';
import { IAnimation } from './Animation';

export declare enum SequenceRunCommand {
    FORCE_DISABLE = "F",
    STOP = "S",
    REMOVE = "R"
}
export type TWaitTime = number;
export type TLabel = string;
export type TAnimationFunction = IAnimation["run"];
export type TAnimationSequence = (TWaitTime | TLabel | TAnimationFunction | IAnimation)[];
export type AnimationSequenceOptions = TAnimationSequence | TAnimationSequence[];
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
