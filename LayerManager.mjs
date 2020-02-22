import Layer from "./Layer.mjs";

class LayerManager {
  constructor() {
    this._layers = [];
  }

  addLayer(canvasIds) {
    this._layers[this._layers.length] = new Layer(canvasIds);
    return this._layers[this._layers.length - 1];
  }

  addLayers(numberOfLayer = 1, canvasIds) {
    let newLayers = Array.from({ length: numberOfLayer }, v => new Layer(canvasIds));
    this._layers = this._layers.concat(newLayers);
    return newLayers;
  }

  addLayerForId(canvasIds) {
    this._layers[this._layers.length] = new Layer(canvasIds);
    return this._layers.length - 1;
  }

  addLayersForIds(numberOfLayer = 1, canvasIds) {
    const result = Array.from(
      { length: numberOfLayer },
      (v, k) => k + this._layers.length
    );
    this._layers = this._layers.concat(
      Array.from({ length: numberOfLayer }, v => new Layer(canvasIds))
    );
    return result;
  }

  getById(layerId) {
    return this._layers[layerId];
  }

  forEach(callback, canvasId) {
    let i;
    const l = this._layers.length;
    for (i = 0; i < l; i++) {
      if (this._layers[i].isCanvasId(canvasId)) {
        if (this._layers[i].forEach(callback, i) === false) {
          break;
        }
      }
    }
  }

  play(label = "", timelapsed = 0) {
    this.forEach(
      ({ element, isFunction }) =>
        !isFunction && element.play(label, timelapsed)
    );
  }

  getElementsByTag (tag) {
    let result = []
    this.forEach(({element, isFunction}) => {
      if (!isFunction) {
        const ans = element.getElementsByTag(tag)
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