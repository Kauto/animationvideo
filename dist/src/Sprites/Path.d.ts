import Group, { SpriteGroupOptions, SpriteGroupOptionsInternal } from "./Group";
import { OrFunction } from "../helper";
import { AdditionalModifier } from "../Scene";
export interface SpritePathOptions extends SpriteGroupOptions {
    path?: OrFunction<number[][][] | string | Path2D>;
    color?: OrFunction<string | undefined>;
    borderColor?: OrFunction<string | undefined>;
    compositeOperation?: OrFunction<GlobalCompositeOperation>;
    lineWidth?: OrFunction<number>;
    clip?: OrFunction<boolean>;
    fixed?: OrFunction<boolean>;
    polyfill?: OrFunction<boolean>;
}
export interface SpritePathOptionsInternal extends SpriteGroupOptionsInternal {
    path: number[][][] | string | Path2D;
    color: string | undefined;
    borderColor: string | undefined;
    compositeOperation: GlobalCompositeOperation;
    lineWidth: number;
    clip: boolean;
    fixed: boolean;
    polyfill: boolean;
}
export default class Path extends Group<SpritePathOptions, SpritePathOptionsInternal> {
    _oldPath: number[][][] | string | Path2D | undefined;
    _path2D: Path2D;
    constructor(givenParameters: SpritePathOptions);
    _getParameterList(): never;
    changeToPathInit(from: number[][][] | string, to: number[][][] | string): [number[][][], number[][][]];
    changeToPath(progress: number, data: {
        pathFrom: number[][][];
        pathTo: number[][][];
    }): number[][][];
    detect(context: CanvasRenderingContext2D, x: number, y: number): import("./Sprite").ISprite | undefined;
    draw(context: CanvasRenderingContext2D, additionalModifier: AdditionalModifier): void;
}
