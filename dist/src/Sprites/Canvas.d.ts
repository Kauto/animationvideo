import { OutputInfo } from "../Engine";
import { OrFunction } from "../helper";
import { AdditionalModifier } from "../Scene";
import Group, { SpriteGroupOptions, SpriteGroupOptionsInternal } from "./Group";
export interface SpriteCanvasOptions extends SpriteGroupOptions {
    width?: OrFunction<number>;
    height?: OrFunction<number>;
    canvasWidth?: OrFunction<number>;
    canvasHeight?: OrFunction<number>;
    compositeOperation?: OrFunction<GlobalCompositeOperation>;
    gridSize?: OrFunction<number>;
    norm?: OrFunction<boolean>;
    isDrawFrame?: OrFunction<number, [undefined | CanvasRenderingContext2D, undefined | AdditionalModifier]>;
}
export interface SpriteCanvasOptionsInternal extends SpriteGroupOptionsInternal {
    width: number | undefined;
    height: number | undefined;
    canvasWidth: number | undefined;
    canvasHeight: number | undefined;
    compositeOperation: GlobalCompositeOperation;
    gridSize: number | undefined;
    norm: boolean;
    isDrawFrame: OrFunction<number, [undefined | CanvasRenderingContext2D, undefined | AdditionalModifier]>;
}
export default class Canvas extends Group<SpriteCanvasOptions, SpriteCanvasOptionsInternal> {
    _currentGridSize: number | undefined;
    _drawFrame: number;
    _temp_canvas: undefined | HTMLCanvasElement;
    _tctx: undefined | CanvasRenderingContext2D;
    constructor(givenParameter: SpriteCanvasOptions);
    _getParameterList(): never;
    _generateTempCanvas(additionalModifier: AdditionalModifier): void;
    _normalizeFullScreen(additionalModifier: AdditionalModifier): void;
    _copyCanvas(additionalModifier: AdditionalModifier): void;
    resize(output: OutputInfo, additionalModifier: AdditionalModifier): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): import("./Sprite").ISprite | undefined;
    init(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}
