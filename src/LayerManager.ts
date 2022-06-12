import Layer from "./Layer";
import type { LayerCallback } from "./Layer"
import type { ISprite, TTagParameter } from './Sprites/Sprite'


class LayerManager {
  _layers: Layer[]
  constructor() {
    this._layers = [];
  }

  addLayer(canvasIds: undefined | number | number[] = undefined) {
    this._layers[this._layers.length] = new Layer(canvasIds);
    return this._layers[this._layers.length - 1];
  }

  addLayers(numberOfLayer: number = 1, canvasIds: undefined | number | number[] = undefined) {
    let newLayers = Array.from({ length: numberOfLayer }, v => new Layer(canvasIds));
    this._layers = this._layers.concat(newLayers);
    return newLayers;
  }

  addLayerForId(canvasIds: undefined | number | number[] = undefined) {
    this._layers[this._layers.length] = new Layer(canvasIds);
    return this._layers.length - 1;
  }

  addLayersForIds(numberOfLayer: number = 1, canvasIds: undefined | number | number[] = undefined) {
    const result = Array.from(
      { length: numberOfLayer },
      (v, k) => k + this._layers.length
    );
    this._layers = this._layers.concat(
      Array.from({ length: numberOfLayer }, v => new Layer(canvasIds))
    );
    return result;
  }

  getById(layerId: number) {
    return this._layers[layerId];
  }

  forEach(callback: LayerCallback, canvasId?: number|undefined) {
    let i;
    const l = this._layers.length;
    for (i = 0; i < l; i++) {
      if (this._layers[i].isCanvasId(canvasId)) {
        this._layers[i].forEach(callback, i)
      }
    }
  }

  play(label:string = "", timelapsed:number = 0) {
    this.forEach(
      ({ element, isFunction }) =>
        !isFunction && (element as ISprite).play(label, timelapsed)
    );
  }

  getElementsByTag(tag:TTagParameter) {
    let result:ISprite[] = []
    this.forEach(({ element, isFunction }) => {
      if (!isFunction) {
        const ans = (element as ISprite).getElementsByTag(tag)
        if (ans) {
          result = result.concat(ans)
        }
      }
    })
    return result
  }

  count() {
    return this._layers.length;
  }

  clear() {
    this._layers = [];
  }
}

export default LayerManager;