import { default as FastBlur, SpriteFastBlurOptions, SpriteFastBlurOptionsInternal } from './FastBlur';
import { OrFunction } from '../helper';
import { AdditionalModifier } from '../Scene';
import { OutputInfo } from '../Engine';

export interface SpriteStackBlurOptions extends SpriteFastBlurOptions {
    onCanvas?: OrFunction<boolean>;
    radius?: OrFunction<undefined | number>;
    radiusPart?: OrFunction<undefined | number>;
    radiusScale?: OrFunction<boolean>;
}
export interface SpriteStackBlurOptionsInternal extends SpriteFastBlurOptionsInternal {
    onCanvas: boolean;
    radius: undefined | number;
    radiusPart: undefined | number;
    radiusScale: boolean;
}
export default class StackBlur extends FastBlur<SpriteStackBlurOptions, SpriteStackBlurOptionsInternal> {
    _currentRadiusPart: number | undefined;
    constructor(givenParameter: SpriteStackBlurOptions);
    _getParameterList(): import('./Sprite').TParameterList<SpriteStackBlurOptions, SpriteStackBlurOptionsInternal> & {
        x: undefined;
        y: undefined;
        width: undefined;
        height: undefined;
        gridSize: undefined;
        darker: number;
        pixel: boolean;
        clear: boolean;
        norm: (value: SpriteFastBlurOptions["norm"], givenParameter: SpriteFastBlurOptions) => boolean;
        scaleX: (value: SpriteFastBlurOptions["scaleX"], givenParameter: SpriteFastBlurOptions) => number;
        scaleY: (value: SpriteFastBlurOptions["scaleY"], givenParameter: SpriteFastBlurOptions) => number;
        alpha: number;
        compositeOperation: string;
    } & {
        onCanvas: boolean;
        radius: undefined;
        radiusPart: undefined;
        radiusScale: boolean;
    };
    normalizeFullScreen(additionalModifier: AdditionalModifier): void;
    resize(output: OutputInfo, additionalModifier: AdditionalModifier): void;
    additionalBlur(targetW: number, targetH: number, additionalModifier: AdditionalModifier): void;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}
