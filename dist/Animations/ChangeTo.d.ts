import { TinyColor } from "@ctrl/tinycolor";
import type { IAnimation } from "./Animation";
import type { ISprite } from "../Sprites/Sprite";
export declare type TProperty = number | string;
export declare type TBezier = number[];
export declare type TChangeFunction = ((from?: number | undefined) => number) | ((from?: string | undefined) => string);
export declare type TChangeValue = TProperty | TBezier | TChangeFunction;
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
export declare type TAlgorithm = (progress: number, data: IAlgorithmData, sprite?: ISprite) => TProperty | number[][][];
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
    constructor(changeValues: Record<string, TChangeValue>, duration: number, ease: (t: number) => number);
    reset(): void;
    _init(sprite: ISprite, time: number): void;
    run(sprite: ISprite, time: number): number;
}
