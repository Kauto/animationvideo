import type { OutputInfo } from "../Engine"
import type { AdditionalModifier, ParameterListWithoutTime } from "../Scene"
import type { OrFunction, OrPromise } from "../helper";
import type Layer from "../Layer";
import Sequence from "../Animations/Sequence";
import { IAnimation } from "../Animations/Animation";
import calc from "../func/calc";
import ifNull from "../func/ifnull";

export type TTagParameter = string | string[] | ((value: string, index: number, array: string[]) => unknown)
export interface ISprite {
    p: SpriteBaseOptionsInternal & Record<string, any>
    changeToPathInit?: (from: number[][][] | string, to: number[][][] | string) => [number[][][], number[][][]]
    changeToPath?: (progress: number, data: {
        pathFrom: number[][][]
        pathTo: number[][][]
    }) => number[][][]
    getElementsByTag: (tag: TTagParameter) => ISprite[]
    play: (label: string, timelapsed?: number) => void
    resize: (output: OutputInfo, additionalModifier: AdditionalModifier) => OrPromise<void>
    callInit: (context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) => OrPromise<void>
    animate: (timepassed: number) => boolean
    draw: (context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) => void
    detect: (context: CanvasRenderingContext2D, coordinateX: number, coordinateY: number) => ISprite | "c" | undefined
    detectDraw: (context: CanvasRenderingContext2D, color: string) => void
}

export type ISpriteFunction = (params: ParameterListWithoutTime & {
    layerId: number
    elementId: number
    layer: Layer
    context: CanvasRenderingContext2D,
}) => number | boolean

export type ISpriteFunctionOrSprite = ISpriteFunction | ISprite



export interface SpriteBaseOptions {
    animation?: OrFunction<Sequence | IAnimation[]>
    enabled?: OrFunction<boolean>
    isClickable?: OrFunction<boolean>
    tag?: OrFunction<string[] | string>
}

export interface SpriteBaseOptionsInternal {
    animation: Sequence | undefined
    enabled: boolean
    isClickable: boolean
    tag: string[]
}
export type TParameterList<T, R> = {
    [P in keyof R & keyof T]?: R[P] | ((value: T[P], givenParameter: T) => R[P]);
}

export class SpriteBase<O extends SpriteBaseOptions = SpriteBaseOptions, P extends SpriteBaseOptionsInternal = SpriteBaseOptionsInternal> implements ISprite {
    _needInit = true
    p: P
    constructor(givenParameter: O) {
        this.p = this._parseParameterList(this._getParameterList(), givenParameter);
    }

    _parseParameterList(parameterList: TParameterList<O, P>, givenParameter: O): P {
        const parameterEntries = Object.entries(parameterList as ReturnType<this["_getParameterList"]>)
        const valueEntries = parameterEntries.map(
            ([name, d]) => {
                const givenValue = givenParameter[name as keyof O]
                return [name,
                    typeof d === "function"
                        ? d(givenValue, givenParameter)
                        : ifNull(calc(givenValue), d)
                ];
            }
        );
        return Object.fromEntries(valueEntries)
    }

    _getBaseParameterList() {
        return {
            // animation
            animation: (value: OrFunction<Sequence | IAnimation[]> | undefined, givenParameter: O) => {
                const result = calc(value);
                return Array.isArray(result) ? new Sequence(result) : result;
            },
            // if it's rendering or not
            enabled: true,
            // if you can click it or not
            isClickable: false,
            // tags to mark the sprites
            tag: (value: OrFunction<string | undefined | string[]>, givenParameter: O) => {
                const v: string | string[] | undefined = calc(value)
                return Array.isArray(v) ? v : v ? [v] : [];
            }
        }
    }

    _getParameterList():TParameterList<O,P> {
        return this._getBaseParameterList() as TParameterList<O, P>
    }

    getElementsByTag(tag: TTagParameter):ISprite[] {
        if (typeof tag === "function") {
            if (this.p.tag.filter(tag).length) {
                return [this];
            }
        } else {
            const aTag = Array.isArray(tag) ? tag : [tag];
            if (aTag.filter(tag => this.p.tag.includes(tag)).length) {
                return [this];
            }
        }
        return [];
    }


    // Animation-Funktion
    animate(timepassed: number) {
        if (this.p.animation) {
            // run animation
            if (this.p.animation.run(this, timepassed, true) === true) {
                // disable
                this.p.enabled = false;
                return true;
            }
        }

        return false;
    }

    play(label = "", timelapsed = 0) {
        if (this.p.animation) {
            this.p.animation.play?.(label, timelapsed);
        }
    }

    init(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) { }

    callInit(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier):OrPromise<void> {
        if (this._needInit) {
            this.init(context, additionalModifier);
            this._needInit = false;
        }
    }


    resize(output: OutputInfo, additionalModifier: AdditionalModifier):OrPromise<void> { }

    _detectHelperCallback(p: {
        enabled: boolean
        isClickable: boolean
        x: number
        y: number
        scaleX: number
        scaleY: number
        rotation: number
    }, context: CanvasRenderingContext2D, x: number, y: number, callback: () => boolean) {
        let a = false;
        if (p.enabled && p.isClickable) {
            context.save();
            context.translate(p.x, p.y);
            context.scale(p.scaleX, p.scaleY);
            context.rotate(p.rotation);
            context.beginPath();
            a = callback();
            context.restore();
        }
        return a ? this as ISprite : undefined;
    }

    _detectHelper({
        enabled,
        isClickable,
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        scaleX = 1,
        scaleY = 1,
        rotation = 0
    }: {
        enabled: boolean
        isClickable: boolean
        x?: number
        y?: number
        width?: number
        height?: number
        scaleX?: number
        scaleY?: number
        rotation?: number
    }, context: CanvasRenderingContext2D, coordinateX: number, coordinateY: number, moveToCenter: boolean, callback?: (hw: number, hh: number) => boolean) {
        let a = false;
        if (enabled && isClickable) {
            const hw = width / 2;
            const hh = height / 2;
            context.save();
            if (moveToCenter) {
                context.translate(x + hw, y + hh);
            } else {
                context.translate(x, y);
            }
            context.scale(scaleX, scaleY);
            context.rotate(rotation);
            context.beginPath();
            if (callback) {
                a = callback(hw, hh);
            } else {
                context.rect(-hw, -hh, width, height);
                context.closePath();
                a = context.isPointInPath(coordinateX, coordinateY);
            }
            context.restore();
        }
        return a ? this as ISprite: undefined;
    }

    detectDraw(context: CanvasRenderingContext2D, color: string) { }

    detect(context: CanvasRenderingContext2D, x: number, y: number):ISprite | "c" | undefined { return undefined }

    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier) { }

}