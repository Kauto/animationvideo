import { default as Layer, LayerCallback } from './Layer';
import { ISprite, TTagParameter } from './Sprites/Sprite';

declare class LayerManager {
    _layers: Layer[];
    constructor();
    addLayer(canvasIds?: undefined | number | number[]): Layer;
    addLayers(numberOfLayer?: number, canvasIds?: undefined | number | number[]): Layer[];
    addLayerForId(canvasIds?: undefined | number | number[]): number;
    addLayersForIds(numberOfLayer?: number, canvasIds?: undefined | number | number[]): number[];
    getById(layerId: number): Layer;
    forEach(callback: LayerCallback, canvasId?: number | undefined): void;
    play(label?: string, timelapsed?: number): void;
    getElementsByTag(tag: TTagParameter): ISprite[];
    count(): number;
    clear(): void;
}
export default LayerManager;
