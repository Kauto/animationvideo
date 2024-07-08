import { ISprite, SpriteBase, SpriteBaseOptionsInternal } from './Sprite';
import { SpriteCircleOptions } from './Circle';
import { OrFunction } from '../helper';
import { Position } from '../Position';
import { AdditionalModifier } from '../Scene';
import { OutputInfo } from '../Engine';

export interface SpriteRectOptions extends SpriteCircleOptions {
    position?: OrFunction<undefined | Position>;
    borderColor?: OrFunction<undefined | string>;
    lineWidth?: OrFunction<undefined | number>;
    width?: OrFunction<undefined | number>;
    height?: OrFunction<undefined | number>;
    clear?: OrFunction<undefined | boolean>;
    norm?: OrFunction<undefined | boolean>;
}
export interface SpriteRectOptionsInternal extends SpriteBaseOptionsInternal {
    x: undefined | number;
    y: undefined | number;
    width: undefined | number;
    height: undefined | number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    compositeOperation: GlobalCompositeOperation;
    position: Position;
    borderColor: undefined | string;
    color: undefined | string;
    lineWidth: number;
    clear: boolean;
    norm: boolean;
}
declare class Rect extends SpriteBase<SpriteRectOptions, SpriteRectOptionsInternal> implements ISprite {
    constructor(givenParameters: SpriteRectOptions);
    _getParameterList(): never;
    _normalizeFullScreen(additionalModifier: AdditionalModifier): void;
    resize(_output: OutputInfo, _additionalModifier: AdditionalModifier): void;
    init(_context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): ISprite | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}
export default Rect;
