import type { OutputInfo } from "../Engine";
import type { OrFunction } from "../helper";
import { Position } from "../Position";
import type { AdditionalModifier } from "../Scene";
import { SpriteCircleOptions, SpriteCircleOptionsInternal } from "./Circle";
import { SpriteBase } from "./Sprite";
export interface SpriteImageOptions extends SpriteCircleOptions {
    image: OrFunction<HTMLImageElement | string>;
    position?: OrFunction<Position>;
    frameX?: OrFunction<number>;
    frameY?: OrFunction<number>;
    frameWidth?: OrFunction<number>;
    frameHeight?: OrFunction<number>;
    width?: OrFunction<number>;
    height?: OrFunction<number>;
    norm?: OrFunction<boolean>;
    normCover?: OrFunction<boolean>;
    normToScreen?: OrFunction<boolean>;
    clickExact?: OrFunction<boolean>;
    tint?: OrFunction<number>;
}
export interface SpriteImageOptionsInternal extends SpriteCircleOptionsInternal {
    image: HTMLImageElement;
    position: Position;
    frameX: number;
    frameY: number;
    frameWidth: number;
    frameHeight: number;
    width: number;
    height: number;
    norm: boolean;
    normCover: boolean;
    normToScreen: boolean;
    clickExact: boolean;
    tint: number;
}
declare class Image extends SpriteBase<SpriteImageOptions, SpriteImageOptionsInternal> {
    _currentTintKey: string | undefined;
    _normScale: number | undefined;
    _temp_canvas: HTMLCanvasElement | undefined;
    _tctx: CanvasRenderingContext2D | undefined;
    constructor(givenParameter: SpriteImageOptions);
    _getParameterList(): import("./Sprite").TParameterList<SpriteImageOptions, SpriteImageOptionsInternal> & {
        x: number;
        y: number;
        rotation: (value: OrFunction<number, []> | undefined, givenParameter: SpriteCircleOptions) => number;
        scaleX: (value: OrFunction<number, []> | undefined, givenParameter: SpriteCircleOptions) => number;
        scaleY: (value: OrFunction<number, []> | undefined, givenParameter: SpriteCircleOptions) => number;
        alpha: number;
        compositeOperation: string;
        color: string;
    } & {
        image: (v: OrFunction<HTMLImageElement | string>) => HTMLImageElement;
        position: Position;
        frameX: number;
        frameY: number;
        frameWidth: number;
        frameHeight: number;
        width: undefined;
        height: undefined;
        norm: boolean;
        normCover: boolean;
        normToScreen: boolean;
        clickExact: boolean;
        color: string;
        tint: number;
    };
    resize(output: OutputInfo, additionalModifier: AdditionalModifier): void;
    init(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
    _tintCacheKey(): string;
    _temp_context(frameWidth: number, frameHeight: number): CanvasRenderingContext2D;
    detectDraw(context: CanvasRenderingContext2D, color: string): void;
    detect(context: CanvasRenderingContext2D, x: number, y: number): import("./Sprite").ISprite | "c" | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}
export default Image;
