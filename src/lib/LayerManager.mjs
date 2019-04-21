import Layer from "./Layer.mjs";

class LayerManager {
  constructor() {
    this.layers = [];
  }

  addLayer() {
    this.layers[this.layers.length] = new Layer();
    return this.layers[this.layers.length - 1];
  }

  addLayerForId() {
    this.layers[this.layers.length] = new Layer();
    return this.layers.length - 1;
  }

  addLayersForIds(numberOfLayer = 1) {
    const result = Array.from(
      { length: numberOfLayer },
      (v, k) => k + this.layers.length
    );
    this.layers = this.layers.concat(
      Array.from({ length: numberOfLayer }, v => new Layer())
    );
    return result;
  }

  getById(layerId) {
    return this.layers[layerId];
  }

  forEach(callback) {
    let i;
    const l = this.layers.length;
    for (i = 0; i < l; i++) {
      this.layers[i].forEach(callback);
    }
  }

  count() {
    return this.layers.length;
  }

  clear() {
    this.layers = [];
  }
}

export default LayerManager;