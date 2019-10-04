class Layer {
  constructor(canvasIds) {
    this._layer = [];
    this._isFunction = [];
    this._start = 0;
    this._nextFree = 0;
    this._canvasIds = canvasIds === undefined ? [] : (Array.isArray(canvasIds) ? canvasIds : [canvasIds]);
  }

  addElement(element) {
    this.addElementForId(element);
    return element;
  }

  addElements(arrayOfElements) {
    this.addElementsForIds(arrayOfElements);
    return arrayOfElements;
  }

  addElementForId(element) {
    let len = this._layer.length;
    let id = this._nextFree;
    this._layer[id] = element;
    this._isFunction[id] = typeof element === "function";
    if (len === id) {
      len++;
    }
    let nextFree = this._nextFree + 1;
    while (nextFree !== len && this._layer[nextFree]) {
      nextFree++;
    }
    this._nextFree = nextFree;
    if (this._start > id) {
      this._start = id;
    }
    return id;
  }

  addElementsForIds(arrayOfElements) {
    let len = this._layer.length;
    let id = this._nextFree;
    if (len === id) {
      this._layer = this._layer.concat(arrayOfElements);
      this._nextFree = this._layer.length;
      arrayOfElements.forEach((v, k) => {
        this._isFunction[len + k] = typeof v === "function";
      });
      return Array.from({ length: arrayOfElements.length }, (v, k) => k + len);
    } else {
      return arrayOfElements.map(element => this.addElement(element));
    }
  }

  getById(elementId) {
    return this._layer[elementId];
  }

  getIdByElement(element) {
    return this._layer.indexOf(element);
  }

  deleteByElement(element) {
    const elementId = this.getIdByElement(element);
    if (elementId >= 0) {
      this.deleteById(elementId);
    }
  }

  deleteById(elementId) {
    let len = this._layer.length - 1;
    if (len > 0 && elementId === len) {
      this._layer[elementId] = null;
      while (len && !this._layer[len - 1]) {
        len--;
      }
      this._layer.length = len;
      this._isFunction.length = len;
      this._nextFree = Math.min(this._nextFree, len);
      this._start = Math.min(this._start, len);
    } else {
      this._layer[elementId] = null;
      this._nextFree = Math.min(this._nextFree, elementId);
      if (this._start === elementId) {
        this._start = elementId + 1;
      }
    }
  }

  isCanvasId(canvasId) {
    return (canvasId === undefined) || !this._canvasIds.length || this._canvasIds.includes(canvasId)
  }
  
  forEach(callback) {
    let index, element;
    const l = this._layer.length;
    for (index = this._start; index < l; index++) {
      element = this._layer[index];
      if (element) {
        callback({
          index,
          element,
          isFunction: this._isFunction[index],
          layer: this
        });
      }
    }
  }

  count() {
    let count = 0;
    const l = this._layer.length;
    for (let index = this._start; index < l; index++) {
      if (this._layer[index]) count++;
    }
    return count;
  }

  clear() {
    this._layer = [];
    this._isFunction = [];
    this._start = 0;
    this._nextFree = 0;
  }
}

export default Layer;
