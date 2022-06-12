import { SpriteBase, SpriteBaseOptions, SpriteBaseOptionsInternal } from "./Sprite.js";
import type { OrFunction } from "../helper";
import type { AdditionalModifier } from "../Scene";
import type { OutputInfo } from "../Engine";
export interface SpriteFastBlurOptions extends SpriteBaseOptions {
    x?: OrFunction<undefined | number>;
    y?: OrFunction<undefined | number>;
    width?: OrFunction<undefined | number>;
    height?: OrFunction<undefined | number>;
    scaleX?: OrFunction<undefined | number>;
    scaleY?: OrFunction<undefined | number>;
    scale?: OrFunction<undefined | number>;
    alpha?: OrFunction<undefined | number>;
    gridSize?: OrFunction<undefined | number>;
    darker?: OrFunction<undefined | number>;
    pixel?: OrFunction<undefined | boolean>;
    clear?: OrFunction<undefined | boolean>;
    norm?: OrFunction<undefined | boolean>;
    compositeOperation?: OrFunction<undefined | GlobalCompositeOperation>;
}
export interface SpriteFastBlurOptionsInternal extends SpriteBaseOptionsInternal {
    x: undefined | number;
    y: undefined | number;
    width: undefined | number;
    height: undefined | number;
    scaleX?: number;
    scaleY?: number;
    gridSize: undefined | number;
    darker: number;
    pixel: boolean;
    clear: boolean;
    norm: boolean;
    alpha: number;
    compositeOperation: GlobalCompositeOperation;
}
export default class FastBlur<O extends SpriteFastBlurOptions = SpriteFastBlurOptions, P extends SpriteFastBlurOptionsInternal = SpriteFastBlurOptionsInternal> extends SpriteBase<O, P> {
    _temp_canvas: HTMLCanvasElement | undefined;
    _currentGridSize: number | undefined;
    _tctx: CanvasRenderingContext2D | undefined;
    constructor(givenParameter: O);
    _getParameterList(): import("./Sprite.js").TParameterList<O, P> & {
        x: undefined;
        y: undefined;
        width: undefined;
        height: undefined;
        gridSize: undefined;
        darker: number;
        pixel: boolean;
        clear: boolean;
        norm: (value: SpriteFastBlurOptions['norm'], givenParameter: SpriteFastBlurOptions) => boolean;
        scaleX: (value: SpriteFastBlurOptions['scaleX'], givenParameter: SpriteFastBlurOptions) => number;
        scaleY: (value: SpriteFastBlurOptions['scaleY'], givenParameter: SpriteFastBlurOptions) => number;
        alpha: number;
        compositeOperation: string;
    };
    _generateTempCanvas(additionalModifier: AdditionalModifier): void;
    normalizeFullScreen(additionalModifier: AdditionalModifier): void;
    resize(output: OutputInfo | undefined, additionalModifier: AdditionalModifier): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): import("./Sprite.js").ISprite | undefined;
    init(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}
