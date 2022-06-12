import type { OutputInfo } from "../Engine";
import type { AdditionalModifier, ParameterListWithoutTime } from "../Scene";
import type { OrFunction, OrPromise } from "../helper";
import type Layer from "../Layer";
import Sequence from "../Animations/Sequence";
import { IAnimation } from "../Animations/Animation";
export declare type TTagParameter = string | string[] | ((value: string, index: number, array: string[]) => unknown);
export interface ISprite {
    p: SpriteBaseOptionsInternal & Record<string, any>;
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
export declare type ISpriteFunction = (params: ParameterListWithoutTime & {
    layerId: number;
    elementId: number;
    layer: Layer;
    context: CanvasRenderingContext2D;
}) => number | boolean;
export declare type ISpriteFunctionOrSprite = ISpriteFunction | ISprite;
export interface SpriteBaseOptions {
    animation?: OrFunction<Sequence | (IAnimation | number | string)[]>;
    enabled?: OrFunction<boolean>;
    isClickable?: OrFunction<boolean>;
    tag?: OrFunction<string[] | string>;
}
export interface SpriteBaseOptionsInternal {
    animation: Sequence | undefined;
    enabled: boolean;
    isClickable: boolean;
    tag: string[];
}
export declare type TParameterList<T, R> = {
    [P in keyof R & keyof T]?: R[P] | ((value: T[P], givenParameter: T) => R[P]);
};
export declare class SpriteBase<O extends SpriteBaseOptions = SpriteBaseOptions, P extends SpriteBaseOptionsInternal = SpriteBaseOptionsInternal> implements ISprite {
    _needInit: boolean;
    p: P;
    constructor(givenParameter: O);
    _parseParameterList(parameterList: TParameterList<O, P>, givenParameter: O): P;
    _getBaseParameterList(): {
        animation: (value: SpriteBaseOptions['animation'], givenParameter: O) => Sequence | undefined;
        enabled: boolean;
        isClickable: boolean;
        tag: (value: SpriteBaseOptions['tag'], givenParameter: O) => string[];
    };
    _getParameterList(): TParameterList<O, P>;
    getElementsByTag(tag: TTagParameter): ISprite[];
    animate(timepassed: number): boolean;
    play(label?: string, timelapsed?: number): void;
    init(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    callInit(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): OrPromise<void>;
    resize(output: OutputInfo, additionalModifier: AdditionalModifier): OrPromise<void>;
    _detectHelperCallback(p: {
        enabled: boolean;
        isClickable: boolean;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
    }, context: CanvasRenderingContext2D, x: number, y: number, callback: () => boolean): ISprite | undefined;
    _detectHelper({ enabled, isClickable, x, y, width, height, scaleX, scaleY, rotation }: {
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
    detectDraw(context: CanvasRenderingContext2D, color: string): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): ISprite | "c" | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}
