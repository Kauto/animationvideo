import { AdditionalModifier } from "../Scene.js";
import { ISprite, SpriteBase, SpriteBaseOptions, SpriteBaseOptionsInternal } from "./Sprite.js";
export declare type SpriteCallback = (context: CanvasRenderingContext2D, timePassed: number, additionalParameter: AdditionalModifier, sprite: ISprite) => void;
export interface SpriteCallbackOptions extends SpriteBaseOptions {
    callback?: SpriteCallback | undefined;
}
export interface SpriteCallbackOptionsInternal extends SpriteBaseOptionsInternal {
    callback: SpriteCallback;
}
export default class Callback extends SpriteBase<SpriteCallbackOptions, SpriteCallbackOptionsInternal> {
    _timePassed: number;
    constructor(givenParameter: SpriteCallbackOptions | SpriteCallbackOptions['callback']);
    _getParameterList(): {
        animation: (value: import("../helper.js").OrFunction<import("../Animations/Sequence.js").default | (string | number | import("../Animations/Animation.js").IAnimation)[], []> | undefined, givenParameter: SpriteCallbackOptions) => import("../Animations/Sequence.js").default | undefined;
        enabled: boolean;
        isClickable: boolean;
        tag: (value: import("../helper.js").OrFunction<string | string[], []> | undefined, givenParameter: SpriteCallbackOptions) => string[];
    } & {
        callback: (v: SpriteCallbackOptions['callback']) => SpriteCallback;
    };
    animate(timePassed: number): boolean;
    draw(context: CanvasRenderingContext2D, additionalParameter: AdditionalModifier): void;
}
