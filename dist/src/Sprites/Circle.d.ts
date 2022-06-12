import { ISprite, SpriteBase, SpriteBaseOptions, SpriteBaseOptionsInternal, TParameterList } from "./Sprite";
import { OrFunction } from "../helper";
import { AdditionalModifier } from "../Scene";
export interface SpriteCircleOptions extends SpriteBaseOptions {
    x?: OrFunction<number>;
    y?: OrFunction<number>;
    rotation?: OrFunction<number>;
    rotationInRadian?: OrFunction<number>;
    rotationInDegree?: OrFunction<number>;
    scaleX?: OrFunction<number>;
    scaleY?: OrFunction<number>;
    scale?: OrFunction<number>;
    alpha?: OrFunction<number>;
    compositeOperation?: OrFunction<GlobalCompositeOperation>;
    color?: OrFunction<string>;
}
export interface SpriteCircleOptionsInternal extends SpriteBaseOptionsInternal {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    compositeOperation: GlobalCompositeOperation;
    color: string;
}
export declare const CircleParameterList: {
    x: number;
    y: number;
    rotation: (value: SpriteCircleOptions['rotation'], givenParameter: SpriteCircleOptions) => number;
    scaleX: (value: SpriteCircleOptions['scaleX'], givenParameter: SpriteCircleOptions) => number;
    scaleY: (value: SpriteCircleOptions['scaleY'], givenParameter: SpriteCircleOptions) => number;
    alpha: number;
    compositeOperation: string;
    color: string;
};
export default class Circle extends SpriteBase<SpriteCircleOptions, SpriteCircleOptionsInternal> implements ISprite {
    constructor(givenParameter: SpriteCircleOptions);
    _getParameterList(): TParameterList<SpriteCircleOptions, SpriteCircleOptionsInternal>;
    detect(context: CanvasRenderingContext2D, x: number, y: number): ISprite | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}
