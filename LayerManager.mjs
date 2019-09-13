import Layer from "./Layer.mjs";

class LayerManager {
  constructor() {
    this._layers = [];
  }

  addLayer() {
    this._layers[this._layers.length] = new Layer();
    return this._layers[this._layers.length - 1];
  }

  addLayers(numberOfLayer = 1) {
    let newLayers = Array.from({ length: numberOfLayer }, v => new Layer());
    this._layers = this._layers.concat(newLayers);
    return newLayers;
  }

  addLayerForId() {
    this._layers[this._layers.length] = new Layer();
    return this._layers.length - 1;
  }

  addLayersForIds(numberOfLayer = 1) {
    const result = Array.from(
      { length: numberOfLayer },
      (v, k) => k + this._layers.length
    );
    this._layers = this._layers.concat(
      Array.from({ length: numberOfLayer }, v => new Layer())
    );
    return result;
  }

  getById(layerId) {
    return this._layers[layerId];
  }

  forEach(callback) {
    let i;
    const l = this._layers.length;
    for (i = 0; i < l; i++) {
      this._layers[i].forEach(callback);
    }
  }

  count() {
    return this._layers.length;
  }

  clear() {
    this._layers = [];
  }
}

export default LayerManager;