import { TinyColor } from '@ctrl/tinycolor';
import { OutputInfo } from '../Engine.js';
import { OrFunction } from '../helper.js';
import { AdditionalModifier } from '../Scene.js';
import { SpriteBase, SpriteBaseOptions, SpriteBaseOptionsInternal } from './Sprite';

export interface SpriteParticleOptions extends SpriteBaseOptions {
    x?: OrFunction<number>;
    y?: OrFunction<number>;
    scaleX?: OrFunction<number>;
    scaleY?: OrFunction<number>;
    scale?: OrFunction<number>;
    alpha?: OrFunction<number>;
    compositeOperation?: OrFunction<GlobalCompositeOperation>;
    color?: OrFunction<string>;
}
type TinyColorRGB = ReturnType<TinyColor["toRgb"]>;
export interface SpriteParticleOptionsInternal extends SpriteBaseOptionsInternal {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    compositeOperation: GlobalCompositeOperation;
    color: string | TinyColorRGB;
}
declare class Particle extends SpriteBase<SpriteParticleOptions, SpriteParticleOptionsInternal> {
    _currentScaleX: number | undefined;
    _currentPixelSmoothing: boolean;
    static _Gradient: HTMLCanvasElement[][][];
    constructor(givenParameter: SpriteParticleOptions);
    _getParameterList(): import('./Sprite').TParameterList<SpriteParticleOptions, SpriteParticleOptionsInternal> & {
        x: number;
        y: number;
        scaleX: (value: SpriteParticleOptions["scaleX"], givenParameter: SpriteParticleOptions) => number;
        scaleY: (value: SpriteParticleOptions["scaleY"], givenParameter: SpriteParticleOptions) => number;
        color: string;
        alpha: number;
        compositeOperation: string;
    };
    static getGradientImage(r: number, g: number, b: number): HTMLCanvasElement;
    static generateGradientImage(cr: number, cg: number, cb: number): HTMLCanvasElement;
    resize(_output: OutputInfo, _additionalModifier: AdditionalModifier): void;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}
export default Particle;
