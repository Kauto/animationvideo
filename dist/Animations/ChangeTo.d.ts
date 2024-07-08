import { TinyColor } from '@ctrl/tinycolor';
import { IAnimation } from './Animation';
import { ISprite } from '../Sprites/Sprite';

export type TProperty = number | string;
export type TBezier = number[];
export type TChangeFunction = ((from?: number | undefined) => number) | ((from?: string | undefined) => string);
export type TChangeValue = TProperty | TBezier | TChangeFunction;
export interface IChangeValueMeta {
    name: string;
    to: TProperty;
    bezier?: TBezier;
    isColor: boolean;
    isPath: boolean;
    isStatic: boolean;
    isFunction?: TChangeFunction;
    moveAlgorithm: TAlgorithm;
}
export type TAlgorithm = (progress: number, data: IAlgorithmData, sprite?: ISprite) => TProperty | number[][][];
export interface IAlgorithmData extends IChangeValueMeta {
    from?: TProperty;
    delta?: number;
    values?: TBezier;
    pathFrom?: number[][][];
    pathTo?: number[][][];
    colorFrom?: TinyColor;
    colorTo?: TinyColor;
}
export default class ChangeTo implements IAnimation {
    _initialized: boolean;
    _changeValues: IChangeValueMeta[];
    _duration: number;
    _ease: (t: number) => number;
    constructor(changeValues: Record<string, TChangeValue>, duration: number, ease?: (t: number) => number);
    reset(): void;
    _init(sprite: ISprite, _time: number): void;
    run(sprite: ISprite, time: number): number;
}
