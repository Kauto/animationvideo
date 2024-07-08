import type {
  ISpriteFunctionOrSprite,
  ISprite,
  TTagParameter,
} from "./Sprites/Sprite";

export interface LayerCallbackData {
  elementId: number;
  layerId: number;
  element: ISpriteFunctionOrSprite;
  isFunction: boolean;
  layer: Layer;
}
export type LayerCallback = (data: LayerCallbackData) => void | boolean;

class Layer {
  _layer: (undefined | ISpriteFunctionOrSprite)[];
  _isFunction: (undefined | boolean)[];
  _start: number;
  _nextFree: number;
  _canvasIds: number[];

  constructor(canvasIds: undefined | number | number[]) {
    this._layer = [];
    this._isFunction = [];
    this._start = 0;
    this._nextFree = 0;
    this._canvasIds =
      canvasIds === undefined
        ? []
        : Array.isArray(canvasIds)
          ? canvasIds
          : [canvasIds];
  }

  addElement(element: ISpriteFunctionOrSprite) {
    this.addElementForId(element);
    return element;
  }

  addElements(arrayOfElements: ISpriteFunctionOrSprite[]) {
    this.addElementsForIds(arrayOfElements);
    return arrayOfElements;
  }

  addElementForId(element: ISpriteFunctionOrSprite) {
    let len = this._layer.length;
    const id = this._nextFree;
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

  addElementsForIds(arrayOfElements: ISpriteFunctionOrSprite[]) {
    const len = this._layer.length;
    const id = this._nextFree;
    if (len === id) {
      this._layer = this._layer.concat(arrayOfElements);
      this._nextFree = this._layer.length;
      arrayOfElements.forEach((v, k) => {
        this._isFunction[len + k] = typeof v === "function";
      });
      return Array.from({ length: arrayOfElements.length }, (_v, k) => k + len);
    } else {
      return arrayOfElements.map((element) => this.addElement(element));
    }
  }

  getById(elementId: number) {
    return this._layer[elementId];
  }

  getIdByElement(element: ISpriteFunctionOrSprite) {
    return this._layer.indexOf(element);
  }

  deleteByElement(element: ISpriteFunctionOrSprite) {
    const elementId = this.getIdByElement(element);
    if (elementId >= 0) {
      this.deleteById(elementId);
    }
  }

  deleteById(elementId: number) {
    let len = this._layer.length - 1;
    if (len > 0 && elementId === len) {
      this._layer[elementId] = undefined;
      while (len && !this._layer[len - 1]) {
        len--;
      }
      this._layer.length = len;
      this._isFunction.length = len;
      this._nextFree = Math.min(this._nextFree, len);
      this._start = Math.min(this._start, len);
    } else if (this._layer[elementId]) {
      this._layer[elementId] = undefined;
      this._nextFree = Math.min(this._nextFree, elementId);
      if (this._start === elementId) {
        this._start = elementId + 1;
      }
    }
  }

  isCanvasId(canvasId: number | undefined) {
    return (
      canvasId === undefined ||
      !this._canvasIds.length ||
      this._canvasIds.includes(canvasId)
    );
  }

  forEach(callback: LayerCallback, layerId: number = 0) {
    let index, element;
    const l = this._layer.length;
    for (index = this._start; index < l; index++) {
      element = this._layer[index];
      if (element) {
        if (
          callback({
            elementId: index,
            layerId,
            element,
            isFunction: this._isFunction[index]!,
            layer: this,
          }) === false
        ) {
          return;
        }
      }
    }
  }

  getElementsByTag(tag: TTagParameter) {
    let result: ISprite[] = [];
    this.forEach(({ element, isFunction }) => {
      if (!isFunction) {
        const ans = (element as ISprite).getElementsByTag(tag);
        if (ans) {
          result = result.concat(ans);
        }
      }
    });
    return result;
  }

  play(label: string = "", timelapsed: number = 0) {
    this.forEach(
      ({ element, isFunction }) =>
        !isFunction && (element as ISprite).play(label, timelapsed),
    );
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
