import type { ISpriteFunctionOrSprite, ISprite, TTagParameter } from './Sprites/Sprite';
export interface LayerCallbackData {
    elementId: number;
    layerId: number;
    element: ISpriteFunctionOrSprite;
    isFunction: boolean;
    layer: Layer;
}
export declare type LayerCallback = (data: LayerCallbackData) => void | boolean;
declare class Layer {
    _layer: (undefined | ISpriteFunctionOrSprite)[];
    _isFunction: (undefined | boolean)[];
    _start: number;
    _nextFree: number;
    _canvasIds: number[];
    constructor(canvasIds: undefined | number | number[]);
    addElement(element: ISpriteFunctionOrSprite): ISpriteFunctionOrSprite;
    addElements(arrayOfElements: ISpriteFunctionOrSprite[]): ISpriteFunctionOrSprite[];
    addElementForId(element: ISpriteFunctionOrSprite): number;
    addElementsForIds(arrayOfElements: ISpriteFunctionOrSprite[]): number[] | ISpriteFunctionOrSprite[];
    getById(elementId: number): ISpriteFunctionOrSprite | undefined;
    getIdByElement(element: ISpriteFunctionOrSprite): number;
    deleteByElement(element: ISpriteFunctionOrSprite): void;
    deleteById(elementId: number): void;
    isCanvasId(canvasId: number | undefined): boolean;
    forEach(callback: LayerCallback, layerId?: number): void;
    getElementsByTag(tag: TTagParameter): ISprite[];
    play(label?: string, timelapsed?: number): void;
    count(): number;
    clear(): void;
}
export default Layer;
