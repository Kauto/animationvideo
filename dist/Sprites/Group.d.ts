import { OutputInfo } from "../Engine.js";
import { OrFunction } from "../helper.js";
import { AdditionalModifier } from "../Scene.js";
import { ISprite, SpriteBase, SpriteBaseOptions, SpriteBaseOptionsInternal, TTagParameter } from "./Sprite.js";
export interface SpriteGroupOptions extends SpriteBaseOptions {
    x?: OrFunction<number>;
    y?: OrFunction<number>;
    rotation?: OrFunction<number>;
    rotationInRadian?: OrFunction<number>;
    rotationInDegree?: OrFunction<number>;
    scaleX?: OrFunction<number>;
    scaleY?: OrFunction<number>;
    scale?: OrFunction<number>;
    alpha?: OrFunction<number>;
    sprite?: OrFunction<ISprite>;
}
export interface SpriteGroupOptionsInternal extends SpriteBaseOptionsInternal {
    x: number | undefined;
    y: number | undefined;
    rotation: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    sprite: ISprite[];
}
export default class Group<O extends SpriteGroupOptions = SpriteGroupOptions, P extends SpriteGroupOptionsInternal = SpriteGroupOptionsInternal> extends SpriteBase<O, P> {
    constructor(givenParameter: O);
    _getParameterList(): import("./Sprite.js").TParameterList<O, P> & {
        x: number;
        y: number;
        rotation: (value: OrFunction<number, []> | undefined, givenParameter: import("./Circle.js").SpriteCircleOptions) => number;
        scaleX: (value: OrFunction<number, []> | undefined, givenParameter: import("./Circle.js").SpriteCircleOptions) => number;
        scaleY: (value: OrFunction<number, []> | undefined, givenParameter: import("./Circle.js").SpriteCircleOptions) => number;
        alpha: number;
        compositeOperation: string;
        color: string;
    } & {
        sprite: never[];
    };
    getElementsByTag(tag: TTagParameter): ISprite[];
    animate(timepassed: number): boolean;
    play(label?: string, timelapsed?: number): void;
    resize(output: OutputInfo, additionalModifier: AdditionalModifier): void;
    callInit(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    detectDraw(context: CanvasRenderingContext2D, color: string): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): ISprite | "c" | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}
