import type { OrFunction } from "../helper";
import { Position } from "../Position";
import { AdditionalModifier } from "../Scene";
import { SpriteCircleOptions } from "./Circle";
import { ISprite, SpriteBase, SpriteBaseOptionsInternal } from "./Sprite";
export interface SpriteTextOptions extends SpriteCircleOptions {
    text?: OrFunction<string | string[]>;
    font?: OrFunction<undefined | string>;
    position?: OrFunction<undefined | Position>;
    borderColor?: OrFunction<undefined | string>;
    lineWidth?: OrFunction<undefined | number>;
}
export interface SpriteTextOptionsInternal extends SpriteBaseOptionsInternal {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    compositeOperation: GlobalCompositeOperation;
    text: string;
    font: string;
    position: Position;
    borderColor: undefined | string;
    color: undefined | string;
    lineWidth: number;
}
export default class Text extends SpriteBase<SpriteTextOptions, SpriteTextOptionsInternal> implements ISprite {
    constructor(givenParameters: SpriteTextOptions);
    _getParameterList(): never;
    detectDraw(context: CanvasRenderingContext2D, color: string): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): "c";
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}
