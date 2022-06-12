import { SpriteBase, SpriteBaseOptions, SpriteBaseOptionsInternal } from "./Sprite";
import { AdditionalModifier } from "../Scene";
import { OrFunction } from "../helper";
import { OutputInfo } from "../Engine";
export interface SpriteStarFieldOptions extends SpriteBaseOptions {
    x?: OrFunction<number>;
    y?: OrFunction<number>;
    width?: OrFunction<number>;
    height?: OrFunction<number>;
    alpha?: OrFunction<number>;
    lineWidth?: OrFunction<number>;
    count?: OrFunction<number>;
    compositeOperation?: OrFunction<GlobalCompositeOperation>;
    moveX?: OrFunction<undefined | number>;
    moveY?: OrFunction<undefined | number>;
    moveZ?: OrFunction<undefined | number>;
    highScale?: OrFunction<undefined | boolean>;
    color?: OrFunction<undefined | string>;
}
export interface SpriteStarFieldOptionsInternal extends SpriteBaseOptionsInternal {
    x: undefined | number;
    y: undefined | number;
    width: undefined | number;
    height: undefined | number;
    alpha: number;
    count: number;
    lineWidth: number;
    compositeOperation: GlobalCompositeOperation;
    moveX: number;
    moveY: number;
    moveZ: number;
    highScale: boolean;
    color: string;
}
export default class StarField extends SpriteBase<SpriteStarFieldOptions, SpriteStarFieldOptionsInternal> {
    _starsX: number[];
    _starsY: number[];
    _starsZ: number[];
    _starsOldX: number[];
    _starsOldY: number[];
    _starsNewX: number[];
    _starsNewY: number[];
    _starsEnabled: boolean[];
    _starsLineWidth: number[];
    _centerX: number;
    _centerY: number;
    _scaleZ: number;
    constructor(givenParameters: SpriteStarFieldOptions);
    _getParameterList(): import("./Sprite").TParameterList<SpriteStarFieldOptions, SpriteStarFieldOptionsInternal> & {
        count: number;
        moveX: number;
        moveY: number;
        moveZ: number;
        lineWidth: undefined;
        highScale: boolean;
        color: string;
    };
    init(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    _moveStar(i: number, scaled_timepassed: number, firstPass: boolean): void;
    animate(timepassed: number): boolean;
    resize(output: OutputInfo, additionalModifier: AdditionalModifier): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): import("./Sprite").ISprite | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}
