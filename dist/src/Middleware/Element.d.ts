import Scene, { ConfigurationObject, ParameterListCanvas, ParameterListClickElement, ParameterListClickNonElement, ParameterListPositionEvent } from "../Scene";
export interface MiddlewareElementOptions {
    doubleClickDetectInterval?: number;
}
interface MousePosition {
    mx: number;
    my: number;
}
export default class Element implements ConfigurationObject {
    _clickIntend: MousePosition | undefined;
    _hoverIntend: MousePosition | undefined;
    _hasDetectImage: boolean;
    _doubleClickElementTimer: number | undefined;
    _doubleClickDetectInterval: number;
    constructor({ doubleClickDetectInterval }?: MiddlewareElementOptions);
    isDrawFrame(): 1 | 0;
    _dispatchEvent(scene: Scene, isClick: boolean, param: ParameterListClickElement): void;
    _dispatchNonEvent(scene: Scene, isClick: boolean, param: ParameterListClickNonElement): void;
    initSprites(params: ParameterListCanvas): void;
    draw(params: ParameterListCanvas): void;
    mouseUp({ scene, position: [mx, my], button }: ParameterListPositionEvent): void;
    mouseMove({ scene, position: [mx, my] }: ParameterListPositionEvent): void;
}
export {};
