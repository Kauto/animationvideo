class Layer {
  constructor() {
    this.layer = [];
    this.isFunction = [];
    this.start = 0;
    this.nextFree = 0;
  }

  addElement(element) {
    let len = this.layer.length;
    let id = this.nextFree;
    this.layer[id] = element;
    this.isFunction[id] = typeof element === "function";
    if (len === id) {
      len++;
    }
    let nextFree = this.nextFree + 1;
    while (nextFree !== len && layer[nextFree]) {
      nextFree++;
    }
    this.nextFree = nextFree;
    if (this.start > id) {
      this.start = id;
    }
    return id;
  }

  addElements(arrayOfElements) {
    let len = this.layer.length;
    let id = this.nextFree;
    if (len === id) {
      this.layer = this.layer.concat(arrayOfElements);
      this.nextFree = this.layer.length;
      arrayOfElements.forEach((v, k) => {
        this.isFunction[len + k] = typeof v === "function";
      });
      return Array.from({ length: arrayOfElements.length }, (v, k) => k + len);
    } else {
      return arrayOfElements.map(element => this.addElement(element));
    }
  }

  getById(elementId) {
    return this.layer[elementId];
  }

  getIdByElement(element) {
    return this.layer.indexOf(element);
  }

  deleteByElement(element) {
    const elementId = this.getIdByElement(element);
    if (elementId >= 0) {
      this.deleteById(elementId);
    }
  }

  deleteById(elementId) {
    let len = this.layer.length - 1;
    if (len > 0 && elementId === len) {
      this.layer[elementId] = null;
      while (len && !this.layer[len - 1]) {
        len--;
      }
      this.layer.length = len;
      this.isFunction.length = len;
      this.nextFree = Math.min(this.nextFree, len);
      this.start = Math.min(this.start, len);
    } else {
      this.layer[elementId] = null;
      this.nextFree = Math.min(this.nextFree, elementId);
      if (this.start === elementId) {
        this.start = elementId + 1;
      }
    }
  }

  forEach(callback) {
    let index, element;
    const l = this.layer.length;
    for (index = this.start; index < l; index++) {
      element = this.layer[index];
      if (element) {
        callback({
          index,
          element,
          isFunction: this.isFunction[index],
          layer: this
        });
      }
    }
  }

  count() {
    return this.layer.length;
  }

  clear() {
    this.layer = [];
    this.isFunction = [];
    this.start = 0;
    this.nextFree = 0;
  }
}

export default Layer;
