import { OutputInfo } from '../Engine';
import { AdditionalModifier, ParameterListWithoutTime } from '../Scene';
import { OrFunction, OrPromise } from '../helper';
import { default as Layer } from '../Layer';
import { default as Sequence, TAnimationSequence } from '../Animations/Sequence';
import { IAnimation } from '../Animations/Animation';

export type TTagParameter = string | string[] | ((value: string, index: number, array: string[]) => unknown);
export interface ISprite {
    p: SpriteBaseOptionsInternal;
    changeToPathInit?: (from: number[][][] | string, to: number[][][] | string) => [number[][][], number[][][]];
    changeToPath?: (progress: number, data: {
        pathFrom: number[][][];
        pathTo: number[][][];
    }) => number[][][];
    getElementsByTag: (tag: TTagParameter) => ISprite[];
    play: (label: string, timelapsed?: number) => void;
    resize: (output: OutputInfo, additionalModifier: AdditionalModifier) => OrPromise<void>;
    callInit: (context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) => OrPromise<void>;
    animate: (timepassed: number) => boolean;
    draw: (context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) => void;
    detect: (context: CanvasRenderingContext2D, coordinateX: number, coordinateY: number) => ISprite | "c" | undefined;
    detectDraw: (context: CanvasRenderingContext2D, color: string) => void;
}
export type ISpriteFunction = (params: ParameterListWithoutTime & {
    layerId: number;
    elementId: number;
    layer: Layer;
    context: CanvasRenderingContext2D;
}) => number | boolean;
export type ISpriteFunctionOrSprite = ISpriteFunction | ISprite;
export type ISpriteWithPosition = ISprite & {
    p: {
        x: number;
        y: number;
    };
};
export interface SpriteBaseOptions {
    animation?: OrFunction<TAnimationSequence>;
    enabled?: OrFunction<boolean>;
    isClickable?: OrFunction<boolean>;
    tag?: OrFunction<string[] | string>;
}
export interface SpriteBaseOptionsInternal {
    animation: IAnimation | undefined;
    enabled: boolean;
    isClickable: boolean;
    tag: string[];
}
export type TParameterList<T, R> = {
    [P in keyof R & keyof T]?: R[P] | ((value: T[P], givenParameter: T) => R[P]);
};
export declare class SpriteBase<O extends SpriteBaseOptions = SpriteBaseOptions, P extends SpriteBaseOptionsInternal = SpriteBaseOptionsInternal> implements ISprite {
    _needInit: boolean;
    p: P;
    constructor(givenParameter: O);
    _parseParameterList(parameterList: TParameterList<O, P>, givenParameter: O): P;
    _getBaseParameterList(): {
        animation: (value: SpriteBaseOptions["animation"], _givenParameter: O) => Sequence | undefined;
        enabled: boolean;
        isClickable: boolean;
        tag: (value: SpriteBaseOptions["tag"], _givenParameter: O) => string[];
    };
    _getParameterList(): TParameterList<O, P>;
    getElementsByTag(tag: TTagParameter): ISprite[];
    animate(timepassed: number): boolean;
    play(label?: string, timelapsed?: number): void;
    init(_context: CanvasRenderingContext2D, _additionalModifier: AdditionalModifier): void;
    callInit(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): OrPromise<void>;
    resize(_output: OutputInfo, _additionalModifier: AdditionalModifier): OrPromise<void>;
    _detectHelperCallback(p: {
        enabled: boolean;
        isClickable: boolean;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
    }, context: CanvasRenderingContext2D, _x: number, _y: number, callback: () => boolean): ISprite | undefined;
    _detectHelper({ enabled, isClickable, x, y, width, height, scaleX, scaleY, rotation, }: {
        enabled: boolean;
        isClickable: boolean;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        scaleX?: number;
        scaleY?: number;
        rotation?: number;
    }, context: CanvasRenderingContext2D, coordinateX: number, coordinateY: number, moveToCenter: boolean, callback?: (hw: number, hh: number) => boolean): ISprite | undefined;
    detectDraw(_context: CanvasRenderingContext2D, _color: string): void;
    detect(_context: CanvasRenderingContext2D, _x: number, _y: number): ISprite | "c" | undefined;
    draw(_context: CanvasRenderingContext2D, _additionalModifier: AdditionalModifier): void;
}
